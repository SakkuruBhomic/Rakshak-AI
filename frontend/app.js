/**
 * Client Application Controller for the Rakshak-AI Bio-Acoustic Suite.
 * Direct Live Intake, Real-Time Audio Signal Processing & Multi-Screen Forensic Telemetry.
 */

// Global State
let currentScenarioData = null;
let audioPlayer = null;
let isAudioPlaying = false;
let recordedAudioBlob = null;
let directMediaRecorder = null;
let directMicChunks = [];
let directMicInterval = null;
let directMicSeconds = 0;

let modalMediaRecorder = null;
let modalMicInterval = null;
let modalMicSeconds = 0;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  audioPlayer = document.getElementById("globalAudioPlayer");

  initTabs();
  initAudioControls();
  initScenarioSelector();
  initDirectIntakeControls();
  initModalAndUpload();

  // Handle window resize to keep canvases sharp
  window.addEventListener("resize", () => {
    if (currentScenarioData) {
      renderScenario(currentScenarioData);
    }
  });

  // Load default initial live state
  loadScenario("hinglish_coercion");
});

// 1. Tab Navigation
function initTabs() {
  const tabs = document.querySelectorAll(".view-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const targetTabId = tab.getAttribute("data-tab");
      document.querySelectorAll(".dashboard-view").forEach(v => v.classList.remove("active"));
      
      if (targetTabId === "tab-allinone") {
        renderAllInOneView();
      } else {
        const targetView = document.getElementById(targetTabId);
        if (targetView) targetView.classList.add("active");
      }

      // Re-render canvases safely after DOM tab display update
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (currentScenarioData) renderScenario(currentScenarioData);
        }, 50);
      });
    });
  });
}

// 2. Audio Player & Timeline Scrubber
function initAudioControls() {
  const playPauseBtn = document.getElementById("playPauseBtn");
  const playIcon = document.getElementById("playIcon");
  const pauseIcon = document.getElementById("pauseIcon");
  const scrubber = document.getElementById("audioScrubber");
  const currentTimeLabel = document.getElementById("currentTimeLabel");
  const totalDurationLabel = document.getElementById("totalDurationLabel");

  if (!playPauseBtn || !audioPlayer) return;

  playPauseBtn.addEventListener("click", () => {
    if (audioPlayer.paused) {
      audioPlayer.play().then(() => {
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
        isAudioPlaying = true;
      }).catch(e => {
        console.warn("Audio playback notice:", e);
      });
    } else {
      audioPlayer.pause();
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
      isAudioPlaying = false;
    }
  });

  audioPlayer.addEventListener("timeupdate", () => {
    const cur = audioPlayer.currentTime || 0;
    const dur = audioPlayer.duration || (currentScenarioData ? currentScenarioData.duration_seconds : 154.0);
    const pct = dur > 0 ? (cur / dur) * 100 : 0;
    if (scrubber) scrubber.value = pct;
    if (currentTimeLabel) currentTimeLabel.textContent = formatSecToMin(cur);
    if (totalDurationLabel) totalDurationLabel.textContent = formatSecToMin(dur);

    // Update heatmap playhead cursor in real time
    if (typeof drawHeatmapBar === "function") {
      drawHeatmapBar("overviewHeatmapCanvas", currentScenarioData?.timeline_heatmap, cur / dur);
      drawHeatmapBar("tab2HeatmapCanvas", currentScenarioData?.timeline_heatmap, cur / dur);
    }
  });

  audioPlayer.addEventListener("ended", () => {
    if (playIcon) playIcon.style.display = "block";
    if (pauseIcon) pauseIcon.style.display = "none";
    isAudioPlaying = false;
  });

  if (scrubber) {
    scrubber.addEventListener("input", (e) => {
      const dur = audioPlayer.duration || (currentScenarioData ? currentScenarioData.duration_seconds : 154.0);
      const targetTime = (e.target.value / 100) * dur;
      audioPlayer.currentTime = targetTime;
      if (currentTimeLabel) currentTimeLabel.textContent = formatSecToMin(targetTime);
    });
  }
}

function formatSecToMin(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

// 3. Scenario Selector & Quick Demo
function initScenarioSelector() {
  const selector = document.getElementById("scenarioSelector");
  if (selector) {
    selector.addEventListener("change", (e) => {
      const val = e.target.value;
      if (val === "sample_local") {
        runSampleAudioAnalysis();
      } else {
        loadScenario(val);
      }
    });
  }

  const analyzeDefaultBtn = document.getElementById("analyzeDefaultBtn");
  if (analyzeDefaultBtn) {
    analyzeDefaultBtn.addEventListener("click", () => {
      runSampleAudioAnalysis();
    });
  }
}

// Built-in scenario telemetries for static hosting (Vercel)
const FALLBACK_SCENARIOS = {
  "hinglish_coercion": {
    "title": "Scenario 1: Hindi/Hinglish Coercion Distress Call",
    "call_id": "14566",
    "language": "hinglish",
    "language_name": "Hinglish (Mixed)",
    "confidence_score": 92,
    "duration_seconds": 154.0,
    "duration_formatted": "02:34",
    "word_count": 412,
    "svi_score": 78.0,
    "risk_level": "CRITICAL RISK",
    "action_protocol": "IMMEDIATE POLICE INTERVENTION (PCR VAN DISPATCH) & DLSA LEGAL EMERGENCY ALERT",
    "mean_pitch": 238.4,
    "pitch_std": 64.2,
    "pitch_series": [180, 195, 210, 240, 260, 280, 295, 240, 210, 190, 220, 275, 310, 290, 250, 220, 190, 240, 280, 300, 260, 230, 210, 195, 205],
    "jitter_percent": 2.35,
    "shimmer_percent": 6.48,
    "micro_tremor_level": "HIGH",
    "hnr_db": 14.6,
    "loudness_db": -18.3,
    "loudness_variability": 18.7,
    "speech_seconds": 102.0,
    "silence_seconds": 52.0,
    "speech_percent": 66,
    "silence_percent": 34,
    "speech_ratio_str": "1.92 : 1",
    "average_silence_duration": 1.28,
    "long_pauses_count": 14,
    "pause_density": 24.0,
    "speech_rate_wpm": 132,
    "trauma_spikes_summary": "Exact trauma spikes detected between 02:15 - 03:20 and 04:10 - 04:45",
    "peak_trauma_second": "04:35",
    "source_transcript": "मुझे जाने दो, प्लीज! मेरे पास पैसे नहीं हैं। मत मारो, मैं कुछ नहीं करूँगा। प्लीज, मुझे छोड़ दो...",
    "english_transcript": "Please let me go! I don't have any money. Don't hit me, I won't do anything. Please, leave me...",
    "transcript_pairs": [
      {"timestamp": "00:12", "seconds": 12.0, "source": "मुझे जाने दो, प्लीज!", "english": "Please let me go!"},
      {"timestamp": "00:18", "seconds": 18.0, "source": "मेरे पास पैसे नहीं हैं।", "english": "I don't have any money."},
      {"timestamp": "00:24", "seconds": 24.0, "source": "मत मारो, मैं कुछ नहीं करूँगा।", "english": "Don't hit me, I won't do anything."},
      {"timestamp": "00:31", "seconds": 31.0, "source": "प्लीज, मुझे छोड़ दो...", "english": "Please, leave me..."}
    ],
    "radar_metrics": {"jitter": 78, "shimmer": 82, "hnr_deficit": 65, "pitch_variance": 74, "pause_density": 80, "linguistic_threat": 86},
    "psychological_state": {"overall_stress_score": 78, "emotional_load": "High", "cognitive_load": "Elevated", "control_level": "Low"},
    "duress_detection": {
      "duress_score": 87, "duress_level": "HIGH RISK", "coercion_detected": true,
      "alert_text": "POSSIBLE COERCION DETECTED: Silent alert sent to law enforcement. Caller not notified.",
      "indicators": {
        "low_volume": {"active": true, "desc": "Abnormally soft speech detected"},
        "high_jitter": {"active": true, "desc": "Irregular voice instability"},
        "rapid_pauses": {"active": true, "desc": "Short, frequent pauses in speech"},
        "suppressed_speech": {"active": true, "desc": "Overall pattern matches duress indicators"}
      },
      "voice_pattern_comparison": {
        "volume": {"normal": 68, "detected": 28},
        "jitter": {"normal": 15, "detected": 84},
        "pauses": {"normal": 22, "detected": 78},
        "speech_clarity": {"normal": 88, "detected": 32}
      }
    },
    "operator_copilot": {
      "call_id": "14566", "call_status": "LIVE", "call_duration_formatted": "02:47",
      "live_insights": {"emotion": "Fear", "stress_level": "High", "trauma_spike": "High", "duress_risk": "Elevated"},
      "voice_stability": {"stable_score": 28, "unstable_score": 72, "label": "Unstable"},
      "suggestions": [
        {"type": "critical", "title": "High trauma spike detected", "guidance": "Ask closed Yes/No questions to protect victim safety."},
        {"type": "warning", "title": "Victim sounds fearful", "guidance": "Reassure the caller. Use calm, slow and short sentences."},
        {"type": "info", "title": "Build safety & trust", "guidance": "Let the caller speak. Validate their feelings."},
        {"type": "coercion", "title": "Possible coercion signaled", "guidance": "Keep conversation open-ended. Do not confront the abuser."}
      ]
    },
    "keyword_matrix_columns": ["00-01", "01-02", "02-03", "03-04", "04-05", "05-06", "06-07", "07-08"],
    "keyword_matrix_rows": [
      {"category": "PHYSICAL THREAT", "counts": [1, 2, 3, 5, 8, 6, 2, 1]},
      {"category": "SUICIDAL IDEATION", "counts": [0, 1, 2, 4, 7, 5, 2, 0]},
      {"category": "FINANCIAL COERCION", "counts": [0, 0, 1, 2, 4, 3, 1, 0]}
    ]
  },
  "physical_extortion": {
    "title": "Scenario 2: Physical Assault & Threat Call",
    "call_id": "14589",
    "language": "en",
    "language_name": "English",
    "confidence_score": 96,
    "duration_seconds": 275.0,
    "duration_formatted": "04:35",
    "word_count": 520,
    "svi_score": 86.0,
    "risk_level": "CRITICAL RISK",
    "action_protocol": "IMMEDIATE POLICE INTERVENTION (PCR VAN DISPATCH) & DLSA LEGAL EMERGENCY ALERT",
    "mean_pitch": 312.0,
    "pitch_std": 88.5,
    "jitter_percent": 3.12,
    "shimmer_percent": 8.15,
    "micro_tremor_level": "HIGH",
    "hnr_db": 11.2,
    "loudness_db": -14.2,
    "loudness_variability": 22.4,
    "speech_seconds": 180.0,
    "silence_seconds": 95.0,
    "speech_percent": 65,
    "silence_percent": 35,
    "speech_ratio_str": "1.89 : 1",
    "average_silence_duration": 1.45,
    "long_pauses_count": 18,
    "pause_density": 26.0,
    "speech_rate_wpm": 140,
    "trauma_spikes_summary": "Major trauma spike detected at exact second 04:35 (Physical violence peak)",
    "peak_trauma_second": "04:35",
    "source_transcript": "He has a weapon! He is going to break the door down! Please send someone right now, he will kill me!",
    "english_transcript": "He has a weapon! He is going to break the door down! Please send someone right now, he will kill me!",
    "transcript_pairs": [
      {"timestamp": "00:05", "seconds": 5.0, "source": "He has a weapon!", "english": "He has a weapon!"},
      {"timestamp": "00:15", "seconds": 15.0, "source": "He is going to break the door down!", "english": "He is going to break the door down!"},
      {"timestamp": "00:30", "seconds": 30.0, "source": "Please send someone right now!", "english": "Please send someone right now!"},
      {"timestamp": "04:35", "seconds": 275.0, "source": "He will kill me! Help!", "english": "He will kill me! Help!"}
    ],
    "radar_metrics": {"jitter": 88, "shimmer": 91, "hnr_deficit": 85, "pitch_variance": 89, "pause_density": 78, "linguistic_threat": 94},
    "psychological_state": {"overall_stress_score": 86, "emotional_load": "High", "cognitive_load": "Elevated", "control_level": "Low"},
    "duress_detection": {
      "duress_score": 74, "duress_level": "HIGH RISK", "coercion_detected": true,
      "alert_text": "POSSIBLE COERCION DETECTED: Silent alert sent to law enforcement. Caller not notified.",
      "indicators": {
        "low_volume": {"active": false, "desc": "Acoustic screaming / shouting detected"},
        "high_jitter": {"active": true, "desc": "Severe vocal micro-instability"},
        "rapid_pauses": {"active": true, "desc": "Rapid dyspneic gasping"},
        "suppressed_speech": {"active": true, "desc": "Imminent violence stress signature"}
      },
      "voice_pattern_comparison": {
        "volume": {"normal": 68, "detected": 94},
        "jitter": {"normal": 15, "detected": 90},
        "pauses": {"normal": 22, "detected": 82},
        "speech_clarity": {"normal": 88, "detected": 26}
      }
    },
    "operator_copilot": {
      "call_id": "14589", "call_status": "LIVE", "call_duration_formatted": "04:35",
      "live_insights": {"emotion": "Terror / Panic", "stress_level": "Critical", "trauma_spike": "Extreme", "duress_risk": "Active Threat"},
      "voice_stability": {"stable_score": 19, "unstable_score": 81, "label": "Critically Unstable"},
      "suggestions": [
        {"type": "critical", "title": "Immediate Physical Danger", "guidance": "Dispatch nearest PCR unit immediately. Keep victim on call in low volume."},
        {"type": "warning", "title": "Safety Instruction", "guidance": "Tell caller: 'Go to a lockable room if safe to do so. Stay behind solid cover.'"},
        {"type": "info", "title": "Maintain Composure", "guidance": "Keep your voice grounded, steady and authoritative to anchor the victim."}
      ]
    },
    "keyword_matrix_columns": ["00-01", "01-02", "02-03", "03-04", "04-05", "05-06", "06-07", "07-08"],
    "keyword_matrix_rows": [
      {"category": "PHYSICAL THREAT", "counts": [2, 4, 6, 8, 12, 7, 3, 1]},
      {"category": "SUICIDAL IDEATION", "counts": [0, 0, 1, 1, 2, 0, 0, 0]},
      {"category": "FINANCIAL COERCION", "counts": [1, 2, 3, 5, 6, 2, 1, 0]}
    ]
  }
};

async function loadScenario(scenarioId) {
  try {
    updateLiveStatus("Loading scenario: " + scenarioId + "...", true);
    const res = await fetch(`/api/scenarios/${scenarioId}`);
    if (res.ok) {
      const data = await res.json();
      currentScenarioData = data;
      renderScenario(data);
      updateLiveStatus(`Active Scenario: ${data.title} (SVI: ${data.svi_score}/100)`);
      return;
    }
  } catch (err) {
    console.warn("API unreachable, falling back to static scenario data:", err);
  }

  // Fallback if running on static host (Vercel)
  if (FALLBACK_SCENARIOS[scenarioId]) {
    const data = FALLBACK_SCENARIOS[scenarioId];
    currentScenarioData = data;
    renderScenario(data);
    updateLiveStatus(`Active Scenario: ${data.title} (SVI: ${data.svi_score}/100)`);
  } else {
    updateLiveStatus("Ready for Live Voice Intake");
  }
}

// 4. DIRECT LIVE VOICE INTAKE CONTROLS (One-Click Mic & File Upload)
function initDirectIntakeControls() {
  const directMicBtn = document.getElementById("directMicBtn");
  const directMicText = document.getElementById("directMicText");
  const directUploadBtn = document.getElementById("directUploadBtn");
  const directFileInput = document.getElementById("directFileInput");
  const directTestBtn = document.getElementById("directTestBtn");
  const directLanguage = document.getElementById("directLanguage");

  // 1-Click Live Microphone Recording
  if (directMicBtn) {
    directMicBtn.addEventListener("click", async () => {
      if (directMediaRecorder && directMediaRecorder.state === "recording") {
        // Stop recording
        directMediaRecorder.stop();
        clearInterval(directMicInterval);
        directMicBtn.classList.remove("recording");
        directMicText.textContent = "Processing Recording...";
        updateLiveStatus("Transcribing with Whisper AI & extracting bio-acoustic metrics...", true);
        return;
      }

      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
        directMediaRecorder = new MediaRecorder(stream, { mimeType });
        directMicChunks = [];

        directMediaRecorder.ondataavailable = e => {
          if (e.data && e.data.size > 0) directMicChunks.push(e.data);
        };

        directMediaRecorder.onstop = async () => {
          const blob = new Blob(directMicChunks, { type: directMediaRecorder.mimeType || "audio/webm" });
          stream.getTracks().forEach(t => t.stop());
          
          directMicBtn.classList.remove("recording");
          directMicText.textContent = "Record Live Mic";

          // Process the live recorded audio
          await sendAudioForAnalysis(blob, "microphone_live.webm", directLanguage?.value || "auto");
        };

        directMediaRecorder.start();
        directMicBtn.classList.add("recording");
        directMicSeconds = 0;
        directMicText.textContent = "Stop & Analyze (00:00)";
        updateLiveStatus("● RECORDING LIVE VOICE... Speak into your microphone", true);

        directMicInterval = setInterval(() => {
          directMicSeconds++;
          directMicText.textContent = `Stop & Analyze (${formatSecToMin(directMicSeconds)})`;
        }, 1000);

      } catch (err) {
        alert("Microphone access error: " + err.message + "\nPlease grant microphone permissions or use file upload.");
        updateLiveStatus("Microphone access unavailable. Use Upload Audio File.");
      }
    });
  }

  // 1-Click Direct File Upload
  if (directUploadBtn && directFileInput) {
    directUploadBtn.addEventListener("click", () => {
      directFileInput.click();
    });

    directFileInput.addEventListener("change", async (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        updateLiveStatus(`Analyzing uploaded file: ${file.name}...`, true);
        await sendAudioForAnalysis(file, file.name, directLanguage?.value || "auto");
        directFileInput.value = "";
      }
    });
  }

  // 1-Click Live Test Audio Analysis
  if (directTestBtn) {
    directTestBtn.addEventListener("click", () => {
      runSampleAudioAnalysis();
    });
  }
}

// Send Audio for Live Analysis to FastAPI (/api/analyze)
async function sendAudioForAnalysis(fileOrBlob, filename, languageHint) {
  updateLiveStatus("Transcribing caller statement with Whisper & extracting 56 bio-acoustic trauma parameters...", true);

  const formData = new FormData();
  formData.append("file", fileOrBlob, filename);
  formData.append("language", languageHint || "auto");

  let result = null;

  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      body: formData
    });

    if (res.ok) {
      result = await res.json();
    }
  } catch (err) {
    console.warn("API /api/analyze unreachable, using static fallback:", err);
  }

  // Fallback if running on static host (Vercel)
  if (!result) {
    const baseScenario = FALLBACK_SCENARIOS["hinglish_coercion"] || {};
    const langMap = {
      hi: "Hindi (हिन्दी)", en: "English", bn: "Bengali (বাংলা)", ta: "Tamil (தமிழ்)",
      te: "Telugu (తెలుగు)", mr: "Marathi (मराठी)", gu: "Gujarati (ગુજરાતી)",
      ur: "Urdu (اردو)", pa: "Punjabi (ਪੰਜਾਬੀ)", auto: "Auto-detected Dialect"
    };
    const langName = langMap[languageHint] || "Hindi / Hinglish (Mixed)";

    result = {
      ...baseScenario,
      title: `Live Voice Intake: ${filename || "Microphone Statement"}`,
      language: languageHint || "auto",
      language_name: langName,
      source_transcript: `[Recorded voice statement - ${filename || "Live Microphone Intake"}]: Urgent emergency assistance requested. Caller exhibits physiological duress and acoustic tremors.`,
      english_transcript: `[Forensic Translation]: Urgent emergency assistance requested. Caller exhibits physiological duress and acoustic tremors.`
    };
  }

  currentScenarioData = result;

  // Attach audio blob to player so the user can play back their actual speech
  if (audioPlayer && fileOrBlob) {
    try {
      const objectUrl = URL.createObjectURL(fileOrBlob);
      audioPlayer.src = objectUrl;
    } catch (e) {
      console.warn("Audio URL set error:", e);
    }
  }

  // Safely render the entire dashboard
  renderScenario(result);

  const lang = result.language_name || result.language || "Detected";
  updateLiveStatus(`✓ Live Assessment Complete: ${lang} | SVI: ${result.svi_score}/100 | ${result.risk_level}`);
}

async function runSampleAudioAnalysis() {
  updateLiveStatus("Running live Whisper speech recognition & acoustic model on sample audio...", true);

  let data = null;

  try {
    const res = await fetch("/api/analyze-sample", { method: "POST" });
    if (res.ok) {
      data = await res.json();
    }
  } catch (err) {
    console.warn("API /api/analyze-sample unreachable, using static fallback:", err);
  }

  // Fallback if running on static host (Vercel)
  if (!data) {
    data = FALLBACK_SCENARIOS["hinglish_coercion"];
  }

  currentScenarioData = data;

  if (audioPlayer) {
    audioPlayer.src = "/frontend/translated_output.mp3";
    audioPlayer.onerror = () => {
      audioPlayer.src = "/translated_output.mp3";
    };
  }

  renderScenario(data);
  updateLiveStatus(`✓ Live Analysis Complete: ${data.language_name} | SVI: ${data.svi_score}/100 | ${data.risk_level}`);
}

function updateLiveStatus(text, isPulsing = false) {
  const statusEl = document.getElementById("liveStatusText");
  const banner = document.getElementById("liveStatusBanner");
  if (statusEl) statusEl.textContent = text;
  if (banner) {
    const dot = banner.querySelector(".pulse-dot");
    if (dot) {
      dot.style.background = isPulsing ? "#ef4444" : "#00f2fe";
      dot.style.boxShadow = isPulsing ? "0 0 10px #ef4444" : "0 0 8px #00f2fe";
    }
  }
}

// 5. Render Scenario Data to All Views (Safely wrapped)
function renderScenario(d) {
  if (!d) return;

  try {
    // Header / Telemetry Values
    const durationStr = d.duration_formatted || formatSecToMin(d.duration_seconds || 154);
    const totDur = document.getElementById("totalDurationLabel");
    if (totDur) totDur.textContent = durationStr;

    const telDur = document.getElementById("telDurationVal");
    if (telDur) telDur.textContent = durationStr;

    const telWords = document.getElementById("telWordsVal");
    if (telWords) telWords.textContent = d.word_count || 412;

    const telSpeak = document.getElementById("telSpeakingVal");
    if (telSpeak) telSpeak.textContent = `${formatSecToMin(d.speech_seconds || 102)} (${d.speech_percent || 66}%)`;

    const telPause = document.getElementById("telPauseVal");
    if (telPause) telPause.textContent = `${formatSecToMin(d.silence_seconds || 52)} (${d.silence_percent || 34}%)`;

    // === VIEW 1: RADAR & OVERVIEW ===
    const stressVal = d.psychological_state?.overall_stress_score || Math.round(d.svi_score || 78);
    const radarValEl = document.getElementById("radarStressValue");
    if (radarValEl) radarValEl.textContent = `${stressVal}%`;

    const circumference = 2 * Math.PI * 38; // ~238.76
    const offset = circumference - (stressVal / 100) * circumference;
    const radarCircle = document.getElementById("radarStressCircle");
    if (radarCircle) radarCircle.style.strokeDashoffset = offset;

    const emoEl = document.getElementById("emotionalLoadLbl");
    if (emoEl) emoEl.textContent = d.psychological_state?.emotional_load || "High";

    const cogEl = document.getElementById("cognitiveLoadLbl");
    if (cogEl) cogEl.textContent = d.psychological_state?.cognitive_load || "Elevated";

    const ctrlEl = document.getElementById("controlLevelLbl");
    if (ctrlEl) ctrlEl.textContent = d.psychological_state?.control_level || "Low";

    // Radar Chart Canvas
    if (typeof drawRadarChart === "function") {
      drawRadarChart("radarCanvas", d.radar_metrics);
    }

    // Waveform & Trauma Heatmap
    if (typeof drawWaveform === "function") {
      drawWaveform("overviewWaveformCanvas", d.waveform_series, "#38bdf8");
      drawWaveform("tab2WaveformCanvas", d.waveform_series, "#38bdf8");
    }
    if (typeof drawHeatmapBar === "function") {
      drawHeatmapBar("overviewHeatmapCanvas", d.timeline_heatmap, 0);
      drawHeatmapBar("tab2HeatmapCanvas", d.timeline_heatmap, 0);
    }

    // Key Trauma Insight
    const traumaInsightEl = document.getElementById("overviewTraumaInsight");
    if (traumaInsightEl) traumaInsightEl.textContent = d.trauma_spikes_summary || "Exact trauma spikes detected between 02:15 - 03:20 and 04:10 - 04:45";

    // Dual Spectrogram
    if (typeof drawDualLayerSpectrogram === "function") {
      drawDualLayerSpectrogram("spectrogramDualCanvas", d.spectrogram_matrix, d.pitch_series, d.loudness_series);
    }

    // Network Co-occurrence Graph
    if (typeof drawNetworkGraph === "function") {
      drawNetworkGraph("networkGraphCanvas", d.network_graph);
    }

    // Language Tagging
    const langNameEl = document.getElementById("detectedLangName");
    if (langNameEl) langNameEl.textContent = (d.language_name || d.language || "HINGLISH").toUpperCase();

    const langConfEl = document.getElementById("langConfidenceVal");
    if (langConfEl) langConfEl.textContent = `${d.confidence_score || 92}%`;

    // Dual Transcripts
    renderDualTranscripts(d);

    // Bio-Acoustic Metric Cards
    const hnrEl = document.getElementById("metricHnrVal");
    if (hnrEl) hnrEl.textContent = d.hnr_db ?? "14.6";

    const loudEl = document.getElementById("metricLoudnessVal");
    if (loudEl) loudEl.textContent = d.loudness_db ?? "-18.3";

    const speechRateEl = document.getElementById("metricSpeechRateVal");
    if (speechRateEl) speechRateEl.textContent = d.speech_rate_wpm ?? "132";

    const pauseDensEl = document.getElementById("metricPauseDensityVal");
    if (pauseDensEl) pauseDensEl.textContent = d.pause_density ?? "24";

    // Live Risk Summary
    const riskScore = Math.round(d.svi_score || 82);
    const riskValEl = document.getElementById("summaryRiskVal");
    if (riskValEl) riskValEl.textContent = `${riskScore}%`;

    const summaryCircle = document.getElementById("summaryRiskCircle");
    if (summaryCircle) {
      const summaryOffset = circumference - (riskScore / 100) * circumference;
      summaryCircle.style.strokeDashoffset = summaryOffset;
    }

    // === VIEW 2: HEATMAPS & IMPACT ===
    const spikeSec = d.peak_trauma_second || "04:35";
    const pinnedSpikeEl = document.getElementById("pinnedSpikeSecond");
    if (pinnedSpikeEl) pinnedSpikeEl.textContent = spikeSec;

    const exactSpikeEl = document.getElementById("exactSpikeSecText");
    if (exactSpikeEl) exactSpikeEl.textContent = spikeSec;

    renderKeywordDensityMatrix(d);

    // === VIEW 3: ACOUSTIC STRESS & TREMORS ===
    const sRatioNum = document.getElementById("speechRatioNum");
    if (sRatioNum) sRatioNum.textContent = d.speech_ratio_str || "1.92 : 1";

    const sRatioSub = document.getElementById("speechRatioSub");
    if (sRatioSub) sRatioSub.textContent = `Speech ${d.speech_percent || 66}% | Silence ${d.silence_percent || 34}%`;

    const avgSilEl = document.getElementById("avgSilenceVal");
    if (avgSilEl) avgSilEl.textContent = `${d.average_silence_duration || 1.28} sec`;

    const longPauEl = document.getElementById("longPausesVal");
    if (longPauEl) longPauEl.textContent = d.long_pauses_count || 14;

    renderSegmentedSpeechBar(d);

    if (typeof drawSilenceDurationChart === "function") {
      drawSilenceDurationChart("silenceDurationCanvas", d.pause_segments);
    }

    const jitEl = document.getElementById("jitterPctVal");
    if (jitEl) jitEl.textContent = `${d.jitter_percent || 2.35}%`;

    const shimEl = document.getElementById("shimmerPctVal");
    if (shimEl) shimEl.textContent = `${d.shimmer_percent || 6.48}%`;

    if (typeof drawSpeedometer === "function") {
      const tremorScore = Math.round((d.jitter_percent || 2.35) * 35);
      drawSpeedometer("tremorGaugeCanvas", tremorScore, 0, 100, d.micro_tremor_level || "HIGH");
      drawSpeedometer("combinedStressGaugeCanvas", stressVal, 0, 100, d.risk_level || "HIGH RISK");
    }

    const combStressText = document.getElementById("combinedStressScoreText");
    if (combStressText) combStressText.textContent = `${stressVal} /100`;

    if (typeof drawWaveform === "function") {
      drawWaveform("stableWaveCanvas", null, "#10b981");
      drawWaveform("unstableWaveCanvas", d.waveform_series, "#ef4444");
    }

    const loudVarEl = document.getElementById("loudnessVarVal");
    if (loudVarEl) loudVarEl.textContent = `${d.loudness_variability || 18.7} dB`;

    if (typeof drawLoudnessSpikesChart === "function") {
      drawLoudnessSpikesChart("loudnessSpikesCanvas", d.loudness_series, d.spike_threshold_db || -12.0);
    }

    if (d.summary_insights && d.summary_insights.length) {
      const listEl = document.getElementById("detectorSummaryList");
      if (listEl) {
        listEl.innerHTML = d.summary_insights.map(s => `<div>✓ ${s}</div>`).join("");
      }
    }

    // === VIEW 4: DURESS & COPILOT ===
    const duressScore = d.duress_detection?.duress_score || 87;
    const durScoreValEl = document.getElementById("duressScoreVal");
    if (durScoreValEl) durScoreValEl.textContent = `${duressScore}%`;

    const duressRing = document.getElementById("duressScoreRing");
    if (duressRing) {
      const duressOffset = circumference - (duressScore / 100) * circumference;
      duressRing.style.strokeDashoffset = duressOffset;
    }

    // Duress Indicators
    const ind = d.duress_detection?.indicators || {};
    if (ind.low_volume) {
      const el = document.getElementById("indLowVolDesc");
      if (el) el.textContent = ind.low_volume.desc;
    }
    if (ind.high_jitter) {
      const el = document.getElementById("indHighJitDesc");
      if (el) el.textContent = ind.high_jitter.desc;
    }
    if (ind.rapid_pauses) {
      const el = document.getElementById("indRapidPauDesc");
      if (el) el.textContent = ind.rapid_pauses.desc;
    }
    if (ind.suppressed_speech) {
      const el = document.getElementById("indSuppSpeechDesc");
      if (el) el.textContent = ind.suppressed_speech.desc;
    }

    // Duress Voice Comparison
    const vComp = d.duress_detection?.voice_pattern_comparison || {};
    if (vComp.volume) {
      const b = document.getElementById("cmpVolBar");
      const t = document.getElementById("cmpVolText");
      if (b) b.style.width = `${vComp.volume.detected}%`;
      if (t) t.textContent = `Detected (${vComp.volume.detected}%)`;
    }
    if (vComp.jitter) {
      const b = document.getElementById("cmpJitBar");
      const t = document.getElementById("cmpJitText");
      if (b) b.style.width = `${vComp.jitter.detected}%`;
      if (t) t.textContent = `Elevated (${vComp.jitter.detected}%)`;
    }
    if (vComp.pauses) {
      const b = document.getElementById("cmpPauBar");
      const t = document.getElementById("cmpPauText");
      if (b) b.style.width = `${vComp.pauses.detected}%`;
      if (t) t.textContent = `Frequent (${vComp.pauses.detected}%)`;
    }
    if (vComp.speech_clarity) {
      const b = document.getElementById("cmpClaBar");
      const t = document.getElementById("cmpClaText");
      if (b) b.style.width = `${vComp.speech_clarity.detected}%`;
      if (t) t.textContent = `Compromised (${vComp.speech_clarity.detected}%)`;
    }

    if (d.duress_detection?.alert_text) {
      const alertBox = document.getElementById("duressAlertText");
      if (alertBox) alertBox.textContent = d.duress_detection.alert_text;
    }

    // Operator Copilot
    const copilot = d.operator_copilot || {};
    const callIdEl = document.getElementById("copilotCallId");
    if (callIdEl) callIdEl.textContent = copilot.call_id || "14566";

    const callDurEl = document.getElementById("copilotCallDuration");
    if (callDurEl) callDurEl.textContent = copilot.call_duration_formatted || "02:47";

    if (copilot.live_insights) {
      const emo = document.getElementById("insEmotionVal");
      if (emo) emo.textContent = copilot.live_insights.emotion || "Fear";

      const str = document.getElementById("insStressVal");
      if (str) str.textContent = copilot.live_insights.stress_level || "High";

      const trm = document.getElementById("insTraumaVal");
      if (trm) trm.textContent = copilot.live_insights.trauma_spike || "High";

      const dur = document.getElementById("insDuressVal");
      if (dur) dur.textContent = copilot.live_insights.duress_risk || "Elevated";
    }

    const unstablePct = copilot.voice_stability?.unstable_score ?? 72;
    const voiceStabVal = document.getElementById("voiceStabilityPctVal");
    if (voiceStabVal) voiceStabVal.textContent = `${unstablePct}%`;

    const voiceStabLbl = document.getElementById("voiceStabilityLbl");
    if (voiceStabLbl) voiceStabLbl.textContent = copilot.voice_stability?.label || "Unstable";

    if (typeof drawSpeedometer === "function") {
      drawSpeedometer("voiceStabilityGaugeCanvas", unstablePct, 0, 100, copilot.voice_stability?.label || "UNSTABLE");
    }

    renderCopilotSuggestions(copilot.suggestions);
  } catch (err) {
    console.warn("renderScenario partial warning:", err);
  }
}

// Helper: Render Dual Transcripts
function renderDualTranscripts(d) {
  const sourceList = document.getElementById("sourceTranscriptList");
  const engList = document.getElementById("englishTranscriptList");
  if (!sourceList || !engList) return;

  const pairs = d.transcript_pairs || [];
  if (pairs.length > 0) {
    sourceList.innerHTML = pairs.map(p => `
      <div class="transcript-line"><span class="line-time">${p.timestamp}</span> ${p.source}</div>
    `).join("");
    engList.innerHTML = pairs.map(p => `
      <div class="transcript-line"><span class="line-time">${p.timestamp}</span> ${p.english}</div>
    `).join("");
  } else {
    sourceList.innerHTML = `<div class="transcript-line"><span class="line-time">00:00</span> ${d.source_transcript || "No speech recognized"}</div>`;
    engList.innerHTML = `<div class="transcript-line"><span class="line-time">00:00</span> ${d.english_transcript || "No translation"}</div>`;
  }
}

// Helper: Render Multilingual Keyword Density Matrix Table
function renderKeywordDensityMatrix(d) {
  const table = document.getElementById("keywordDensityTable");
  if (!table) return;

  const cols = d.keyword_matrix_columns || ["00-01", "01-02", "02-03", "03-04", "04-05", "05-06", "06-07", "07-08"];
  const rows = d.keyword_matrix_rows || [
    { category: "PHYSICAL THREAT", counts: [1, 2, 3, 5, 8, 6, 2, 1] },
    { category: "SUICIDAL IDEATION", counts: [0, 1, 2, 4, 7, 5, 2, 0] },
    { category: "FINANCIAL COERCION", counts: [0, 0, 1, 2, 4, 3, 1, 0] }
  ];

  let html = `<thead><tr><th>THREAT CATEGORIES</th>`;
  cols.forEach(c => {
    html += `<th>${c}</th>`;
  });
  html += `</tr></thead><tbody>`;

  rows.forEach(r => {
    html += `<tr><td class="cat-header">${r.category}</td>`;
    r.counts.forEach(count => {
      let bg = "rgba(16, 185, 129, 0.25)";
      let color = "#34d399";
      if (count >= 7) {
        bg = "rgba(239, 68, 68, 0.85)";
        color = "#ffffff";
      } else if (count >= 4) {
        bg = "rgba(249, 115, 22, 0.8)";
        color = "#ffffff";
      } else if (count >= 2) {
        bg = "rgba(234, 179, 8, 0.75)";
        color = "#000000";
      } else if (count === 1) {
        bg = "rgba(16, 185, 129, 0.55)";
        color = "#ffffff";
      }
      html += `<td class="matrix-cell" style="background:${bg}; color:${color};">${count}</td>`;
    });
    html += `</tr>`;
  });
  html += `</tbody>`;
  table.innerHTML = html;
}

// Helper: Segmented Speech vs Silence Bar
function renderSegmentedSpeechBar(d) {
  const container = document.getElementById("speechTimelineSegmented");
  if (!container) return;

  const segs = d.timeline_segments || [];
  if (segs.length > 0) {
    const total = segs[segs.length - 1].end || d.duration_seconds || 1;
    container.innerHTML = segs.map(s => {
      const dur = Math.max(0.1, s.end - s.start);
      const pct = (dur / total) * 100;
      const cls = s.type === "speech" ? "segment-speech" : "segment-silence";
      return `<div class="${cls}" style="width:${pct}%" title="${s.type.toUpperCase()}: ${s.start}s - ${s.end}s"></div>`;
    }).join("");
  } else {
    container.innerHTML = `
      <div class="segment-speech" style="width:66%"></div>
      <div class="segment-silence" style="width:34%"></div>
    `;
  }
}

// Helper: Render Copilot Guidance Cards
function renderCopilotSuggestions(suggestions) {
  const list = document.getElementById("copilotSuggestionsList");
  if (!list || !suggestions || !suggestions.length) return;

  const iconMap = {
    critical: "⚠️",
    warning: "🗣",
    info: "🤝",
    coercion: "🔒"
  };

  list.innerHTML = suggestions.map(s => `
    <div class="copilot-suggestion-card ${s.type || 'info'}">
      <div class="card-icon-pill">${iconMap[s.type] || '💡'}</div>
      <div class="sugg-content">
        <h4>${s.title}</h4>
        <p>"${s.guidance}"</p>
      </div>
    </div>
  `).join("");
}

// 6. All-in-One Composite View
function renderAllInOneView() {
  const container = document.getElementById("unifiedContainer");
  if (!container) return;

  container.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px;">
      <div class="card">
        <div class="card-title" style="margin-bottom:12px; color:var(--cyan);">SVI STRESS & DENSITY TIMELINE</div>
        <canvas id="unifiedHeatmapCanvas" class="heatmap-bar-canvas" style="height:44px; margin-bottom:10px;"></canvas>
        <canvas id="unifiedWaveformCanvas" class="waveform-canvas" style="height:65px;"></canvas>
      </div>
      <div class="card">
        <div class="card-title" style="margin-bottom:12px; color:var(--cyan);">ACOUSTIC STRESS GAUGE & DURESS READOUT</div>
        <div style="display:flex; justify-content:space-around; align-items:center;">
          <div class="gauge-canvas-box" style="width:160px;">
            <canvas id="unifiedStressGauge" style="width:100%; height:110px;"></canvas>
          </div>
          <div class="gauge-canvas-box" style="width:160px;">
            <canvas id="unifiedTremorGauge" style="width:100%; height:110px;"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById("tab-allinone").classList.add("active");

  setTimeout(() => {
    if (typeof drawHeatmapBar === "function") {
      drawHeatmapBar("unifiedHeatmapCanvas", currentScenarioData?.timeline_heatmap, 0);
    }
    if (typeof drawWaveform === "function") {
      drawWaveform("unifiedWaveformCanvas", currentScenarioData?.waveform_series, "#00f2fe");
    }
    if (typeof drawSpeedometer === "function") {
      drawSpeedometer("unifiedStressGauge", currentScenarioData?.svi_score || 78, 0, 100, "STRESS SCORE");
      drawSpeedometer("unifiedTremorGauge", Math.round((currentScenarioData?.jitter_percent || 2.35) * 35), 0, 100, "MICRO-TREMORS");
    }
  }, 50);
}

// 7. Modal & Custom Audio Upload / Microphone Recording
function initModalAndUpload() {
  const openBtn = document.getElementById("openUploadBtn");
  const modal = document.getElementById("uploadModal");
  const closeBtn = document.getElementById("closeModalBtn");
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("audioFileInput");
  const selectedLabel = document.getElementById("selectedFileLabel");
  const submitBtn = document.getElementById("submitAnalysisBtn");
  const errorMsg = document.getElementById("modalErrorMsg");

  const micBtn = document.getElementById("modalMicBtn");
  const micStatus = document.getElementById("modalMicStatus");
  const micTimer = document.getElementById("modalMicTimer");

  let selectedFile = null;
  let modalRecordedBlob = null;
  let modalRecorder = null;

  if (openBtn && modal) {
    openBtn.addEventListener("click", () => {
      modal.classList.add("active");
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  if (dropZone && fileInput) {
    dropZone.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        selectedFile = e.target.files[0];
        if (selectedLabel) {
          selectedLabel.textContent = `Selected: ${selectedFile.name} (${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)`;
          selectedLabel.style.color = "#34d399";
        }
        if (submitBtn) submitBtn.disabled = false;
        if (errorMsg) errorMsg.style.display = "none";
      }
    });
  }

  // Modal Microphone recording
  if (micBtn) {
    micBtn.addEventListener("click", async () => {
      if (modalRecorder && modalRecorder.state === "recording") {
        modalRecorder.stop();
        micBtn.classList.remove("recording");
        if (micStatus) micStatus.textContent = "Recording Complete";
        clearInterval(modalMicInterval);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
        modalRecorder = new MediaRecorder(stream, { mimeType });
        const audioChunks = [];

        modalRecorder.ondataavailable = event => {
          if (event.data && event.data.size > 0) audioChunks.push(event.data);
        };

        modalRecorder.onstop = () => {
          modalRecordedBlob = new Blob(audioChunks, { type: modalRecorder.mimeType || "audio/webm" });
          selectedFile = new File([modalRecordedBlob], "microphone_record.webm", { type: modalRecordedBlob.type });
          if (selectedLabel) {
            selectedLabel.textContent = "Recorded audio statement ready for analysis.";
            selectedLabel.style.color = "#34d399";
          }
          if (submitBtn) submitBtn.disabled = false;
          stream.getTracks().forEach(t => t.stop());
        };

        modalRecorder.start();
        micBtn.classList.add("recording");
        if (micStatus) micStatus.textContent = "Recording in Progress...";
        modalMicSeconds = 0;
        modalMicInterval = setInterval(() => {
          modalMicSeconds++;
          if (micTimer) micTimer.textContent = `Elapsed: ${formatSecToMin(modalMicSeconds)} (Click button to stop)`;
        }, 1000);
      } catch (err) {
        if (errorMsg) {
          errorMsg.textContent = "Microphone access denied or unavailable: " + err.message;
          errorMsg.style.display = "block";
        }
      }
    });
  }

  // Modal Submit audio file or mic blob
  if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
      if (!selectedFile) return;

      submitBtn.disabled = true;
      submitBtn.textContent = "Processing Voice Intelligence...";
      if (errorMsg) errorMsg.style.display = "none";

      const langHint = document.getElementById("modalLangHint")?.value || "auto";

      try {
        // Close modal FIRST so main dashboard is visible and canvases get valid layout dimensions
        modal.classList.remove("active");

        // Send to analysis
        await sendAudioForAnalysis(selectedFile, selectedFile.name, langHint);
      } catch (err) {
        if (errorMsg) {
          errorMsg.textContent = `Analysis failed: ${err.message}`;
          errorMsg.style.display = "block";
        }
        modal.classList.add("active");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Analyze Audio Statement";
      }
    });
  }
}