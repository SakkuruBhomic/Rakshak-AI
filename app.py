import os
import sqlite3
import librosa
import numpy as np
import plotly.graph_objects as go
import streamlit as st
import whisper

# ---------------------------------------------------------
# 1. PAGE CONFIGURATION & THEME
# ---------------------------------------------------------
st.set_page_config(
    page_title="Rakshak-AI | Emergency Triage Portal",
    page_icon="🚨",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom Styling
st.markdown(
    """
    <style>
    .main { background-color: #0e1117; }
    .stMetric { background-color: #1f2937; padding: 15px; border-radius: 10px; }
    .risk-critical { background-color: #7f1d1d; color: white; padding: 15px; border-radius: 10px; border-left: 6px solid #ef4444; }
    .risk-high { background-color: #7c2d12; color: white; padding: 15px; border-radius: 10px; border-left: 6px solid #f97316; }
    .risk-moderate { background-color: #713f12; color: white; padding: 15px; border-radius: 10px; border-left: 6px solid #eab308; }
    .risk-low { background-color: #14532d; color: white; padding: 15px; border-radius: 10px; border-left: 6px solid #22c55e; }
    </style>
""",
    unsafe_allow_html=True,
)


# ---------------------------------------------------------
# 2. DATABASE INITIALIZATION (SQLite)
# ---------------------------------------------------------
def init_db():
    conn = sqlite3.connect("rakshak_triage.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS call_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            language TEXT,
            transcript TEXT,
            svi_score REAL,
            risk_category TEXT,
            action_taken TEXT
        )
    """)
    conn.commit()
    conn.close()


init_db()


def log_to_database(language, transcript, svi_score, risk_category, action_taken):
    conn = sqlite3.connect("rakshak_triage.db")
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO call_logs (language, transcript, svi_score, risk_category, action_taken)
        VALUES (?, ?, ?, ?, ?)
    """,
        (language, transcript, svi_score, risk_category, action_taken),
    )
    conn.commit()
    conn.close()


# ---------------------------------------------------------
# 3. MODEL LOADING
# ---------------------------------------------------------
@st.cache_resource
def load_speech_model():
    return whisper.load_model("base")


whisper_model = load_speech_model()


# ---------------------------------------------------------
# 4. CORE ENGINE (PITCH + TRANSCRIPTION + SVI LOGIC)
# ---------------------------------------------------------
def process_victim_voice(audio_path):
    # Speech-to-Text & Translation via Whisper
    transcription = whisper_model.transcribe(audio_path, task="translate")
    detected_language = transcription.get("language", "unknown").upper()
    english_transcript = transcription.get("text", "").strip()

    # Acoustic Pitch & Tremor Analysis via Librosa
    y, sr = librosa.load(audio_path, sr=None)
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    pitch_values = pitches[pitches > 0]

    if len(pitch_values) > 0:
        mean_pitch = float(np.mean(pitch_values))
        pitch_std = float(np.std(pitch_values))
    else:
        mean_pitch, pitch_std = 0.0, 0.0

    # Calculate Acoustic Stress (0 - 100)
    acoustic_stress_score = min(100.0, (pitch_std / 45.0) * 100)

    # Keyword Detection
    # ---------------------------------------------------------
    # EXPANDED THREAT LEXICON (English + Transliterated Emergency Terms)
    # ---------------------------------------------------------
    threat_dictionary = [
        # Direct Violence & Bodily Harm
        "kill",
        "killing",
        "killer",
        "murder",
        "attack",
        "attacking",
        "attacked",
        "blood",
        "bleeding",
        "bleed",
        "stab",
        "stabbing",
        "stabbed",
        "shoot",
        "shooting",
        "shot",
        "gun",
        "bullet",
        "knife",
        "weapon",
        "bomb",
        "choke",
        "choking",
        "hit",
        "hitting",
        "beat",
        "beating",
        "poison",
        "drown",
        # Coercion, Stalking & Captivity
        "watching",
        "watch",
        "escape",
        "trap",
        "trapped",
        "follow",
        "following",
        "kidnap",
        "kidnapping",
        "abduct",
        "lock",
        "locked",
        "hostage",
        "chase",
        "chasing",
        "forced",
        "force",
        # Abuse, Harassment & Distress Signals
        "abuse",
        "abusing",
        "abusive",
        "threat",
        "threaten",
        "threatening",
        "harass",
        "harassing",
        "molest",
        "rape",
        "assault",
        "torture",
        "hurt",
        "hurting",
        "pain",
        "die",
        "dying",
        "dead",
        "death",
        # Calls for Immediate Help & Emergency Responders
        "help",
        "save",
        "police",
        "cop",
        "cops",
        "pcr",
        "ambulance",
        "doctor",
        "hospital",
        "emergency",
        "danger",
        "dangerous",
        "sos",
        "rescue",
        # Common Transliterated Crisis Terms
        "bachao",
        "mardo",
        "marne",
        "khoon",
        "humla",
        "banchao",
        "chhadodu",
        "champakandi",
    ]

    # Clean punctuation and normalize text to lowercase
    clean_transcript = (
        english_transcript.lower()
        .replace(".", " ")
        .replace(",", " ")
        .replace("!", " ")
        .replace("?", " ")
        .replace("-", " ")
    )
    words_in_transcript = clean_transcript.split()

    # Detect exact word matches OR root-word substring matches
    detected_threats = []
    for threat in threat_dictionary:
        for word in words_in_transcript:
            if threat in word and threat not in detected_threats:
                detected_threats.append(threat)

    # Calculate threat score based on flagged density
    text_threat_score = min(100.0, len(detected_threats) * 30.0)
    words_in_transcript = english_transcript.lower().split()
    detected_threats = [
        word for word in threat_dictionary if word in words_in_transcript
    ]

    text_threat_score = min(100.0, len(detected_threats) * 25.0)

    # Final SVI Formula (40% Acoustic + 60% Textual)
    svi_score = round(
        (0.4 * acoustic_stress_score) + (0.6 * text_threat_score), 2
    )

    # Risk Categorization & Action Mapping
    if svi_score >= 75:
        risk_level = "CRITICAL RISK"
        action_protocol = "IMMEDIATE POLICE INTERVENTION (PCR VAN DISPATCH) & DLSA LEGAL EMERGENCY ALERT"
        css_class = "risk-critical"
    elif svi_score >= 50:
        risk_level = "HIGH RISK"
        action_protocol = "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
        css_class = "risk-high"
    elif svi_score >= 25:
        risk_level = "MODERATE RISK"
        action_protocol = "ASSIGN TO STANDARD COUNSELING QUEUE & SCHEDULER"
        css_class = "risk-moderate"
    else:
        risk_level = "LOW RISK"
        action_protocol = "PROVIDE AUTOMATED INFORMATION & SELF-GUIDANCE RESOURCES"
        css_class = "risk-low"

    return {
        "language": detected_language,
        "transcript": english_transcript,
        "mean_pitch": round(mean_pitch, 2),
        "pitch_std": round(pitch_std, 2),
        "detected_threats": detected_threats,
        "svi_score": svi_score,
        "risk_level": risk_level,
        "action_protocol": action_protocol,
        "css_class": css_class,
        "pitch_series": pitch_values[:150],
    }


# ---------------------------------------------------------
# 5. UI LAYOUT & NAVIGATION
# ---------------------------------------------------------
st.title("🚨 Rakshak-AI: Crisis Triage & Response Portal")
st.caption("National Helpline Crisis Engine (14566) | Powered by Whisper & Librosa")

sidebar_option = st.sidebar.radio(
    "Navigation Console", ["Live Victim Triage", "Historical Call Logs / Audit"]
)

# ---------------------------------------------------------
# 6. PAGE 1: LIVE TRIAGE MODULE
# ---------------------------------------------------------
if sidebar_option == "Live Victim Triage":
    st.subheader("1. Audio Input")

    input_mode = st.radio(
        "Choose Input Source:",
        ["Upload Recorded Audio File", "Live Voice Input (Microphone)"],
        horizontal=True,
    )

    audio_file_path = None

    if input_mode == "Upload Recorded Audio File":
        uploaded_file = st.file_uploader(
            "Upload incoming victim call (.wav, .mp3)", type=["wav", "mp3"]
        )
        if uploaded_file:
            audio_file_path = "temp_incoming.wav"
            with open(audio_file_path, "wb") as f:
                f.write(uploaded_file.getbuffer())
            st.audio(audio_file_path)

    else:
        audio_value = st.audio_input("Record victim statement live")
        if audio_value:
            audio_file_path = "temp_recorded.wav"
            with open(audio_file_path, "wb") as f:
                f.write(audio_value.read())

    if audio_file_path and st.button("RUN TRIAGE ENGINE", type="primary"):
        with st.spinner("Processing audio features..."):
            results = process_victim_voice(audio_file_path)

            log_to_database(
                results["language"],
                results["transcript"],
                results["svi_score"],
                results["risk_level"],
                results["action_protocol"],
            )

            st.divider()

            # Display Categorization and Action
            st.subheader("2. Risk Assessment & Action Protocol")

            st.markdown(
                f"""
                <div class="{results['css_class']}">
                    <h2 style="margin:0;">CATEGORY: {results['risk_level']} (SVI: {results['svi_score']} / 100)</h2>
                    <h4 style="margin-top:10px;">ACTION REQUIRED: {results['action_protocol']}</h4>
                </div>
            """,
                unsafe_allow_html=True,
            )

            st.write("")

            # Display Metrics
            col1, col2, col3, col4 = st.columns(4)
            col1.metric("Detected Language", results["language"])
            col2.metric("Mean Pitch", f"{results['mean_pitch']} Hz")
            col3.metric("Voice Tremor Index", f"{results['pitch_std']}")
            col4.metric(
                "Threat Words Flagged", len(results["detected_threats"])
            )

            # Display Transcript
            col_left, col_right = st.columns([2, 1])

            with col_left:
                st.subheader("3. Audio Transcript (English)")
                st.info(
                    results["transcript"]
                    if results["transcript"]
                    else "No clear speech recognized."
                )

            with col_right:
                st.subheader("Detected Threat Words")
                if results["detected_threats"]:
                    for word in results["detected_threats"]:
                        st.error(f"⚠️ Flagged: {word}")
                else:
                    st.success("No threat keywords flagged.")

            # Display Pitch Graph
            if len(results["pitch_series"]) > 0:
                st.subheader("4. Vocal Pitch Contour Analysis")
                fig = go.Figure()
                fig.add_trace(
                    go.Scatter(
                        y=results["pitch_series"],
                        mode="lines+markers",
                        name="Frequency (Hz)",
                        line=dict(color="#f97316", width=2),
                    )
                )
                fig.update_layout(
                    template="plotly_dark",
                    xaxis_title="Frame Index",
                    yaxis_title="Pitch (Hz)",
                    height=280,
                )
                st.plotly_chart(fig, use_container_width=True)

            if os.path.exists(audio_file_path):
                os.remove(audio_file_path)

# ---------------------------------------------------------
# 7. PAGE 2: HISTORICAL LOGS MODULE
# ---------------------------------------------------------
elif sidebar_option == "Historical Call Logs / Audit":
    st.subheader("📊 System Call Logs")

    conn = sqlite3.connect("rakshak_triage.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM call_logs ORDER BY timestamp DESC")
    records = cursor.fetchall()
    conn.close()

    if records:
        for row in records:
            with st.expander(
                f"Call ID #{row[0]} | Timestamp: {row[1]} | Category: {row[5]}"
            ):
                st.write(f"**Language:** {row[2]}")
                st.write(f"**SVI Score:** {row[4]} / 100")
                st.write(f"**Action Executed:** {row[6]}")
                st.write(f"**Transcript:** {row[3]}")
    else:
        st.info("No recorded triage calls found in the database yet.")