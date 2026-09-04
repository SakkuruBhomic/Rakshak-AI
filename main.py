from functools import lru_cache
from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from logic import load_speech_model, process_victim_voice
from scenarios import SCENARIOS

app = FastAPI(title="Rakshak AI - Bio-Acoustic Intelligence Suite")

BASE_DIR = Path(__file__).parent
FRONTEND_DIR = BASE_DIR / "frontend"
SAMPLE_AUDIO_PATH = BASE_DIR / "translated_output.mp3"

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


@lru_cache(maxsize=1)
def get_speech_model():
    return load_speech_model()


@app.get("/")
def root():
    return FileResponse(FRONTEND_DIR / "index.html")


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": get_speech_model.cache_info().currsize > 0}


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
    return process_victim_voice(str(SAMPLE_AUDIO_PATH), language_hint="auto", model=get_speech_model())


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
        return process_victim_voice(str(temp_path), language_hint=language, model=get_speech_model())
    finally:
        temp_path.unlink(missing_ok=True)