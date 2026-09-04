# Rakshak-AI | Bio-Acoustic Intelligence & Forensic Trauma Suite
> **Decode Voices. Detect Threats. Deliver Justice.**

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688.svg)](https://fastapi.tiangolo.com)
[![Whisper](https://img.shields.io/badge/OpenAI-Whisper_ASR-black.svg)](https://github.com/openai/whisper)
[![Librosa](https://img.shields.io/badge/Librosa-Acoustic_Processing-orange.svg)](https://librosa.org)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Frontend_Deployment-black.svg?logo=vercel)](https://vercel.com)

**Rakshak-AI** is a military-grade, real-time bio-acoustic triage and forensic trauma assessment system. It ingests emergency voice calls in native Indian dialects, auto-detects linguistic context, measures psychological distress through micro-tremor bio-acoustic signals (Jitter, Shimmer, HNR, vocal freeze pauses), and generates actionable legal and psychological intervention protocols.

---

## 🚀 Key Modules & Dashboard Screens

### 1. Bio-Acoustic Radar & Multi-Dimensional Profile
* **6-Axis Radar Spider Chart**: Quantifies `Jitter`, `Shimmer`, `HNR Deficit`, `Pitch Variance`, `Pause Density`, and `Linguistic Threat`.
* **Psychological State Fingerprint**: Brain silhouette with dynamic cognitive load, emotional stress gauge, and control level readouts.
* **Timeline Trauma Heatmap**: Second-by-second continuous trauma density gradient (`Green` → `Yellow` → `Orange` → `Red`) with exact timestamp trauma spike identification.
* **Dual-Layer Audio Spectrogram**: Real-time STFT waterfall (`125 Hz` to `8 kHz`) with dynamic **F0 pitch tracking** and **decibel intensity overlay**.
* **Interactive Threat-Word Matrix**: Force-directed network graph correlating flagged keywords with category hubs (`Coercion`, `Threat`, `Physical Violence`, `Intimidation`, `Suicidal Ideation`).
* **Dynamic Dialect Tagging**: Auto-detects 100+ languages and dialects (e.g. `HINGLISH (MIXED) 92% Confidence`).
* **Dual-Transcript Synchronizer**: Aligned side-by-side native script transcript and translated English with timestamps.

### 2. Timeline & Multilingual Keyword Heatmaps
* **SVI Stress Heatmap Across Time**: Continuous 2D timeline bar allowing judges and operators to pinpoint the exact second of vocal trauma spikes (e.g. `04:35`).
* **Threat Keyword Density Matrix**: Time-sliced matrix table displaying categorical frequency distributions across intervals.

### 3. Acoustic Stress & Tremor Detector
* **Speech Pause & Hesitation Analysis**: Speech-to-silence ratio (`1.92 : 1`), average silence duration, long pauses (> 2s), and silence duration chart with a **2-second freeze threshold**.
* **Micro-Tremors**: Cycle-to-cycle frequency perturbations (Jitter %) and amplitude instability (Shimmer %) with micro-tremor speedometer.
* **Loudness Spikes**: Decibel fluctuation variability line chart with peak spike detection.
* **Acoustic Score**: Radial gauge (`0 - 100`) with feature contribution breakdown.

### 4. Duress & Operator Copilot
* **Duress / Stealth Mode Detection**: Identifies suppressed whisper dynamics and coercion indicators with a silent law enforcement alert trigger.
* **Voice Pattern Comparison**: Normal vs Suppressed voice comparison across Volume, Jitter, Pauses, and Clarity.
* **Real-Time Operator Copilot**: Live prompts and empathetic de-escalation guidance cards based on active distress state.

---

## ⚡ Deployment & Hosting

### Option A: Deploy to Vercel (Frontend & Static Interface)
This repository is configured with `vercel.json` for zero-config Vercel deployment:
1. Push this repository to your GitHub account.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your **`Rakshak-AI`** repository.
4. Keep the default settings and click **Deploy**.
5. Your Bio-Acoustic Intelligence Dashboard will be live instantly!

### Option B: Run Full Live Model Locally (Whisper + Librosa)
To run the full backend with local speech recognition and acoustic analysis:
```bash
# 1. Clone repository
git clone https://github.com/SakkuruBhomic/Rakshak-AI.git
cd Rakshak-AI

# 2. Install dependencies
pip install fastapi uvicorn whisper librosa numpy scipy soundfile

# 3. Start the FastAPI server
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
Open your browser at **`http://127.0.0.1:8000`**.

---

## 📁 Repository Structure
```
Rakshak-AI/
├── frontend/
│   ├── index.html        # Main Forensic Dashboard (all 4 screens)
│   ├── style.css         # Cyber-tactical dark design system
│   ├── spectrogram.js    # Canvas visualizers (Radar, Spectrogram, Heatmaps, Gauges)
│   └── app.js            # Client controller & audio synchronization
├── logic.py              # Bio-acoustic signal processing engine & Whisper model
├── main.py               # FastAPI backend server & REST API
├── scenarios.py          # Curated forensic emergency demonstration scenarios
├── vercel.json           # Vercel deployment configuration
├── index.html            # Root redirect fallback for static hosts
└── README.md             # Project documentation
```

---

## ⚖ License & Disclaimer
This software is intended as an emergency response decision-support and triage assessment aid for helplines and judicial review. It is not a clinical diagnostic tool.
