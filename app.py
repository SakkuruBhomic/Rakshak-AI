import sqlite3
from datetime import datetime
from pathlib import Path
from tempfile import NamedTemporaryFile

import plotly.graph_objects as go
import streamlit as st

from logic import load_speech_model, process_victim_voice

APP_DIR = Path(__file__).parent
DB_PATH = APP_DIR / "rakshak_triage.db"
LANGUAGES = {
    "Auto-detect": "auto", "English": "en", "Hindi": "hi", "Bengali": "bn",
    "Tamil": "ta", "Telugu": "te", "Marathi": "mr", "Gujarati": "gu",
    "Kannada": "kn", "Malayalam": "ml", "Punjabi": "pa", "Urdu": "ur",
    "Odia": "or", "Assamese": "as", "Nepali": "ne",
}
MAX_UPLOAD_BYTES = 25 * 1024 * 1024

st.set_page_config(page_title="Rakshak AI | Response Desk", page_icon="R", layout="wide")
st.markdown("""
<style>
:root { --navy:#102a43; --ink:#243b53; --muted:#627d98; --line:#d9e2ec; --mint:#0f766e; --gold:#d97706; }
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
.stApp { background:radial-gradient(circle at 88% 8%,#d9f3ef 0,transparent 25%),linear-gradient(135deg,#f4f7f9,#fffaf0); color:var(--ink); font-family:'DM Sans',sans-serif; }
[data-testid="stHeader"] { background:transparent; }
[data-testid="stSidebar"] { background:linear-gradient(180deg,var(--navy),#173f5f); }
[data-testid="stSidebar"] * { color:#f0f7fa; }
[data-testid="stSidebar"] hr { border-color:#486581; }
h1,h2,h3 { color:var(--navy); letter-spacing:0; font-family:'Space Grotesk',sans-serif; }
.eyebrow,.panel-title { color:var(--mint); font-size:.74rem; font-weight:800; letter-spacing:.16em; text-transform:uppercase; }
.hero { background:linear-gradient(120deg,var(--navy),#173f5f); color:white; padding:30px 34px; border-radius:18px; margin:10px 0 22px; box-shadow:0 16px 35px #102a4325; }
.hero h1 { color:white; font-size:2.3rem; margin:5px 0; }
.hero p { color:#c9d8e7; max-width:680px; margin:0; }
.panel { background:#ffffffcc; border:1px solid var(--line); border-radius:14px; padding:22px; box-shadow:0 10px 28px #102a4312; }
.panel-title { color:var(--muted); font-size:.72rem; margin-bottom:10px; }
.risk { padding:18px 20px; border-left:6px solid var(--mint); border-radius:10px; background:#d9f3ef; margin:12px 0 20px; }
.risk h2 { margin:0 0 4px; color:var(--navy); }
.risk-critical { background:#ffe4e6; border-left-color:#e11d48; }
.risk-high { background:#ffedd5; border-left-color:#ea580c; }
.risk-moderate { background:#fef3c7; border-left-color:#ca8a04; }
.metric { background:#f7fafc; border:1px solid var(--line); padding:14px; border-radius:10px; }
.metric-label { color:var(--muted); font-size:.75rem; }
.metric-value { color:var(--mint); font-size:1.3rem; font-weight:800; margin-top:3px; }
.stButton > button[kind="primary"] { background:var(--mint); border:0; }
.stButton > button[kind="primary"]:hover { background:#115e59; }
.stTabs [data-baseweb="tab-list"] { gap:24px; }
</style>
""", unsafe_allow_html=True)


def init_db():
    with sqlite3.connect(DB_PATH) as connection:
        connection.execute("""CREATE TABLE IF NOT EXISTS call_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            language TEXT, transcript TEXT, svi_score REAL, risk_category TEXT, action_taken TEXT
        )""")


def save_log(result):
    with sqlite3.connect(DB_PATH) as connection:
        connection.execute(
            "INSERT INTO call_logs (language, transcript, svi_score, risk_category, action_taken) VALUES (?, ?, ?, ?, ?)",
            (result["language"], result["transcript"], result["svi_score"], result["risk_level"], result["action_protocol"]),
        )


def today_count():
    with sqlite3.connect(DB_PATH) as connection:
        return connection.execute("SELECT COUNT(*) FROM call_logs WHERE date(timestamp, 'localtime') = date('now', 'localtime')").fetchone()[0]


@st.cache_resource
def cached_model():
    return load_speech_model()


def analyze_audio(uploaded_file, language_hint):
    suffix = Path(uploaded_file.name).suffix.lower() or ".wav"
    with NamedTemporaryFile(prefix="rakshak_", suffix=suffix, delete=False) as temporary:
        temporary.write(uploaded_file.getbuffer())
        temporary_path = Path(temporary.name)
    try:
        return process_victim_voice(str(temporary_path), language_hint, cached_model())
    finally:
        temporary_path.unlink(missing_ok=True)


init_db()
st.sidebar.markdown("## RAKSHAK AI")
st.sidebar.caption("Response desk / voice intelligence")
st.sidebar.markdown("---")
st.sidebar.markdown(f"**Local time**  \n{datetime.now().astimezone().strftime('%d %b %Y · %H:%M:%S')}")
st.sidebar.caption("Analysis decisions require human review")
page = st.sidebar.radio("Workspace", ["Live triage", "Audit history"], label_visibility="collapsed")
st.markdown('<div class="hero"><div class="eyebrow">National helpline response desk</div><h1>Make the next call count.</h1><p>Analyze a caller statement, surface urgency signals, and give the response team a clear brief for human review.</p></div>', unsafe_allow_html=True)
status_columns = st.columns(3)
status_columns[0].metric("Assessments today", today_count())
status_columns[1].metric("Engine status", "READY")
status_columns[2].metric("Review policy", "HUMAN-IN-LOOP")

if page == "Live triage":
    left, right = st.columns([1.35, 1], gap="large")
    with left:
        st.markdown('<div class="panel-title">01 / Intake</div>', unsafe_allow_html=True)
        st.subheader("Start a caller assessment")
        language_name = st.selectbox("Caller language", list(LANGUAGES))
        input_mode = st.radio("Source", ["Upload file", "Record now"], horizontal=True)
        if input_mode == "Upload file":
            audio_file = st.file_uploader("Audio statement", type=["wav", "mp3", "ogg", "webm", "m4a", "aac"], max_upload_size=25)
        else:
            audio_file = st.audio_input("Record caller statement")
        st.caption("Maximum 25 MB. Audio is processed temporarily and removed after analysis.")
        if audio_file:
            st.audio(audio_file)
        run_analysis = st.button("Analyze statement", type="primary", disabled=audio_file is None, use_container_width=True)
    with right:
        st.markdown('<div class="panel-title">02 / Signal profile</div>', unsafe_allow_html=True)
        st.subheader("Acoustic activity")
        st.caption("The pitch contour appears here after analysis.")
        if "last_result" in st.session_state:
            latest = st.session_state["last_result"]
            st.success(f"Last assessment: {latest['risk_level']} · {latest['processing_seconds']}s")
            st.caption(f"Analyzed {latest['analyzed_at']} · {latest['duration_seconds']}s of audio")
        else:
            st.info("Awaiting an audio statement")

    if run_analysis and audio_file:
        if audio_file.size > MAX_UPLOAD_BYTES:
            st.error("Audio files must be 25 MB or smaller.")
        else:
            with st.spinner("Transcribing and scoring the statement..."):
                result = analyze_audio(audio_file, LANGUAGES[language_name])
            result["analyzed_at"] = datetime.now().astimezone().strftime("%d %b %Y · %H:%M:%S")
            st.session_state["last_result"] = result
            save_log(result)
            st.markdown('<div class="panel-title">03 / Response brief</div>', unsafe_allow_html=True)
            risk_class = result["risk_level"].lower().replace(" risk", "")
            st.markdown(f'<div class="risk risk-{risk_class}"><h2>{result["risk_level"]} · {result["svi_score"]} / 100</h2><div>{result["action_protocol"]}</div></div>', unsafe_allow_html=True)
            metric_columns = st.columns(4)
            metrics = [("Detected language", result["language_name"]), ("Audio duration", f'{result["duration_seconds"]} s'), ("Transcript confidence", f'{result["transcription_confidence"]}%'), ("Threat signals", len(result["detected_threats"]))]
            for column, (label, value) in zip(metric_columns, metrics):
                column.markdown(f'<div class="metric"><div class="metric-label">{label}</div><div class="metric-value">{value}</div></div>', unsafe_allow_html=True)
            transcript_left, transcript_right = st.columns(2)
            transcript_left.text_area("Original statement", result["source_transcript"] or "No clear speech recognized.", height=150, disabled=True)
            transcript_right.text_area("English translation", result["english_transcript"] or "No translation available.", height=150, disabled=True)
            st.caption(f"Mean pitch: {result['mean_pitch']} Hz · Tremor index: {result['pitch_std']} · Voiced frames: {result['voiced_frame_ratio']}% · Processed at {result['analyzed_at']}")
            if result["detected_threats"]:
                st.warning("Detected signals: " + ", ".join(result["detected_threats"]))
            if result["pitch_series"]:
                figure = go.Figure(go.Scatter(y=result["pitch_series"], mode="lines", line={"color": "#0f766e", "width": 3}))
                figure.update_layout(height=250, margin={"l": 20, "r": 20, "t": 15, "b": 30}, template="plotly_white", yaxis_title="Hz", xaxis_title="Frame")
                st.plotly_chart(figure, use_container_width=True)
else:
    st.markdown('<div class="panel-title">Audit history</div>', unsafe_allow_html=True)
    st.subheader("Recent assessments")
    with sqlite3.connect(DB_PATH) as connection:
        records = connection.execute("SELECT * FROM call_logs ORDER BY timestamp DESC LIMIT 100").fetchall()
    if not records:
        st.info("No assessments have been logged yet.")
    for record in records:
        with st.expander(f"#{record[0]} · {record[1]} · {record[5]} · SVI {record[4]}"):
            st.write(f"Language: {record[2]}")
            st.write(f"Action: {record[6]}")
            st.text(record[3])