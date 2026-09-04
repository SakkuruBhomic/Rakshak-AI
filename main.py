import sqlite3
from functools import lru_cache
from pathlib import Path
from tempfile import NamedTemporaryFile
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from logic import load_speech_model, process_victim_voice
from scenarios import SCENARIOS

app = FastAPI(title="Rakshak AI - Bio-Acoustic Intelligence Suite")

BASE_DIR = Path(__file__).parent
FRONTEND_DIR = BASE_DIR / "frontend"
SAMPLE_AUDIO_PATH = BASE_DIR / "translated_output.mp3"
DB_PATH = BASE_DIR / "rakshak_triage.db"

ALLOWED_LANGUAGES = {"auto", "en", "hi", "bn", "ta", "te", "mr", "gu", "kn", "ml", "pa", "ur", "or", "as", "ne"}
MAX_UPLOAD_BYTES = 25 * 1024 * 1024

app.mount("/frontend", StaticFiles(directory=FRONTEND_DIR), name="frontend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("""CREATE TABLE IF NOT EXISTS call_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            language TEXT,
            transcript TEXT,
            svi_score REAL,
            risk_category TEXT,
            action_taken TEXT
        )""")


def save_log_to_db(data: Dict[str, Any]) -> int:
    init_db()
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        lang = str(data.get("language_name") or data.get("language") or "AUTO").upper()
        transcript = str(data.get("transcript") or data.get("source_transcript") or data.get("english_transcript") or "")
        svi = float(data.get("svi_score") or 50.0)
        risk = str(data.get("risk_level") or data.get("risk_category") or "MODERATE RISK")
        action = str(data.get("action_protocol") or data.get("action_taken") or "ASSIGN TO STANDARD COUNSELING QUEUE")
        cur.execute(
            "INSERT INTO call_logs (language, transcript, svi_score, risk_category, action_taken) VALUES (?, ?, ?, ?, ?)",
            (lang, transcript, svi, risk, action)
        )
        conn.commit()
        return cur.lastrowid


init_db()


@lru_cache(maxsize=1)
def get_speech_model():
    return load_speech_model()


@app.get("/")
def root():
    return FileResponse(FRONTEND_DIR / "index.html")


@app.get("/health")
def health():
    with sqlite3.connect(DB_PATH) as conn:
        count = conn.execute("SELECT COUNT(*) FROM call_logs").fetchone()[0]
    return {
        "status": "ok",
        "database_connected": True,
        "total_call_logs": count,
        "model_loaded": get_speech_model.cache_info().currsize > 0
    }


# Database API Endpoints
@app.get("/api/logs")
def get_call_logs(id: Optional[int] = None):
    init_db()
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        if id is not None:
            row = conn.execute("SELECT * FROM call_logs WHERE id = ?", (id,)).fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Log record not found")
            return dict(row)
        rows = conn.execute("SELECT * FROM call_logs ORDER BY id DESC").fetchall()
        return [dict(r) for r in rows]


@app.post("/api/logs")
async def create_call_log(request: Request):
    data = await request.json()
    row_id = save_log_to_db(data)
    return {"success": True, "id": row_id}


@app.delete("/api/logs")
def delete_call_log(id: Optional[int] = None):
    init_db()
    with sqlite3.connect(DB_PATH) as conn:
        if id is not None:
            conn.execute("DELETE FROM call_logs WHERE id = ?", (id,))
            return {"success": True, "deleted": id}
        conn.execute("DELETE FROM call_logs")
        return {"success": True, "message": "All call logs cleared"}


@app.get("/api/scenarios")
def get_scenarios():
    summary_list = []
    for sid, sc in SCENARIOS.items():
        summary_list.append({
            "id": sid,
            "title": sc["title"],
            "language_name": sc["language_name"],
            "risk_level": sc["risk_level"],
            "svi_score": sc["svi_score"],
            "duration_formatted": sc["duration_formatted"],
        })
    return summary_list


@app.get("/api/scenarios/{scenario_id}")
def get_scenario_detail(scenario_id: str):
    if scenario_id in SCENARIOS:
        return SCENARIOS[scenario_id]
    raise HTTPException(status_code=404, detail="Scenario not found")


@app.get("/api/sample-audio")
def get_sample_audio():
    if SAMPLE_AUDIO_PATH.exists():
        return FileResponse(SAMPLE_AUDIO_PATH, media_type="audio/mpeg")
    raise HTTPException(status_code=404, detail="Sample audio file not found")


@app.post("/api/analyze-sample")
def analyze_default_sample():
    if not SAMPLE_AUDIO_PATH.exists():
        raise HTTPException(status_code=404, detail="Sample audio file not found")
    result = process_victim_voice(str(SAMPLE_AUDIO_PATH), language_hint="auto", model=get_speech_model())
    try:
        save_log_to_db(result)
    except Exception as e:
        print("DB log error:", e)
    return result


@app.post("/api/analyze")
async def analyze_voice(
    file: UploadFile = File(...),
    language: str = Form("auto"),
):
    if language not in ALLOWED_LANGUAGES:
        raise HTTPException(status_code=400, detail="Unsupported language")

    raw_suffix = Path(file.filename or "audio.webm").suffix.lower()
    allowed_suffixes = {".wav", ".mp3", ".ogg", ".webm", ".m4a", ".aac", ".mp4", ".flac"}
    suffix = raw_suffix if raw_suffix in allowed_suffixes else ".webm"

    with NamedTemporaryFile(prefix="rakshak_", suffix=suffix, delete=False) as temp_file:
        temp_path = Path(temp_file.name)
        total_bytes = 0
        while chunk := await file.read(1024 * 1024):
            total_bytes += len(chunk)
            if total_bytes > MAX_UPLOAD_BYTES:
                temp_path.unlink(missing_ok=True)
                raise HTTPException(status_code=413, detail="Audio file exceeds 25 MB")
            temp_file.write(chunk)

    try:
        result = process_victim_voice(str(temp_path), language_hint=language, model=get_speech_model())
        try:
            save_log_to_db(result)
        except Exception as e:
            print("DB log error:", e)
        return result
    finally:
        temp_path.unlink(missing_ok=True)