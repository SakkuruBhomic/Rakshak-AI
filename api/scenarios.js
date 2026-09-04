// Vercel Serverless Function: Scenarios Endpoint
const ALL_SCENARIOS = {
  "hinglish_coercion": {
    "id": "hinglish_coercion",
    "title": "Scenario 1: Hindi/Hinglish Coercion Distress Call",
    "call_id": "14566",
    "language": "hinglish",
    "language_name": "Hinglish (Mixed)",
    "confidence_score": 92,
    "duration_seconds": 154.0,
    "duration_formatted": "02:34",
    "word_count": 412,
    "processing_seconds": 1.42,
    "svi_score": 78.0,
    "risk_level": "CRITICAL RISK",
    "action_protocol": "IMMEDIATE POLICE INTERVENTION (PCR VAN DISPATCH) & DLSA LEGAL EMERGENCY ALERT",
    "risk_drivers": [
      {
        "text": "High Trauma Spike Detected",
        "color": "critical"
      },
      {
        "text": "Suppressed Speech Patterns",
        "color": "high"
      },
      {
        "text": "Coercive Language Detected",
        "color": "critical"
      },
      {
        "text": "Elevated Pause Density",
        "color": "high"
      }
    ],
    "mean_pitch": 238.4,
    "pitch_std": 64.2,
    "pitch_series": [
      180,
      195,
      210,
      240,
      260,
      280,
      295,
      240,
      210,
      190,
      220,
      275,
      310,
      290,
      250,
      220,
      190,
      240,
      280,
      300,
      260,
      230,
      210,
      195,
      205
    ],
    "jitter_percent": 2.35,
    "shimmer_percent": 6.48,
    "micro_tremor_level": "HIGH",
    "hnr_db": 14.6,
    "hnr_deficit_score": 68.0,
    "loudness_db": -18.3,
    "loudness_variability": 18.7,
    "speech_seconds": 102.0,
    "silence_seconds": 52.0,
    "speech_percent": 66,
    "silence_percent": 34,
    "speech_ratio_str": "1.92 : 1",
    "speech_to_silence_ratio": 1.92,
    "average_silence_duration": 1.28,
    "long_pauses_count": 14,
    "pause_density": 24.0,
    "speech_rate_wpm": 132,
    "spike_threshold_db": -12.0,
    "trauma_spikes_summary": "Exact trauma spikes detected between 02:15 - 03:20 and 04:10 - 04:45",
    "peak_trauma_second": "04:35",
    "source_transcript": "मुझे जाने दो, प्लीज! मेरे पास पैसे नहीं हैं। मत मारो, मैं कुछ नहीं करूँगा। प्लीज, मुझे छोड़ दो...",
    "english_transcript": "Please let me go! I don't have any money. Don't hit me, I won't do anything. Please, leave me...",
    "transcript_pairs": [
      {
        "timestamp": "00:12",
        "seconds": 12.0,
        "source": "मुझे जाने दो, प्लीज!",
        "english": "Please let me go!"
      },
      {
        "timestamp": "00:18",
        "seconds": 18.0,
        "source": "मेरे पास पैसे नहीं हैं।",
        "english": "I don't have any money."
      },
      {
        "timestamp": "00:24",
        "seconds": 24.0,
        "source": "मत मारो, मैं कुछ नहीं करूँगा।",
        "english": "Don't hit me, I won't do anything."
      },
      {
        "timestamp": "00:31",
        "seconds": 31.0,
        "source": "प्लीज, मुझे छोड़ दो...",
        "english": "Please, leave me..."
      }
    ],
    "radar_metrics": {
      "jitter": 78,
      "shimmer": 82,
      "hnr_deficit": 65,
      "pitch_variance": 74,
      "pause_density": 80,
      "linguistic_threat": 86
    },
    "psychological_state": {
      "overall_stress_score": 78,
      "emotional_load": "High",
      "cognitive_load": "Elevated",
      "control_level": "Low"
    },
    "feature_contribution": {
      "pause_hesitation": 30,
      "jitter": 25,
      "shimmer": 20,
      "loudness_spikes": 25
    },
    "summary_insights": [
      "High ratio of silence suggests hesitation and fear.",
      "Prolonged pauses detected, indicating emotional distress.",
      "Elevated jitter & shimmer show micro-tremors due to stress.",
      "Loudness spikes reflect sudden emotional outbursts / suppression.",
      "Overall Acoustic Stress Level: HIGH"
    ],
    "duress_detection": {
      "duress_score": 87,
      "duress_level": "HIGH RISK",
      "coercion_detected": true,
      "alert_text": "POSSIBLE COERCION DETECTED: Silent alert sent to law enforcement. Caller not notified.",
      "indicators": {
        "low_volume": {
          "active": true,
          "label": "LOW VOLUME",
          "desc": "Abnormally soft speech detected"
        },
        "high_jitter": {
          "active": true,
          "label": "HIGH JITTER",
          "desc": "Irregular voice instability"
        },
        "rapid_pauses": {
          "active": true,
          "label": "RAPID PAUSES",
          "desc": "Short, frequent pauses in speech"
        },
        "suppressed_speech": {
          "active": true,
          "label": "SUPPRESSED SPEECH",
          "desc": "Overall pattern matches duress indicators"
        }
      },
      "voice_pattern_comparison": {
        "volume": {
          "normal": 68,
          "detected": 28
        },
        "jitter": {
          "normal": 15,
          "detected": 84
        },
        "pauses": {
          "normal": 22,
          "detected": 78
        },
        "speech_clarity": {
          "normal": 88,
          "detected": 32
        }
      }
    },
    "operator_copilot": {
      "call_id": "14566",
      "call_status": "LIVE",
      "call_duration_formatted": "02:47",
      "live_insights": {
        "emotion": "Fear",
        "stress_level": "High",
        "trauma_spike": "High",
        "duress_risk": "Elevated"
      },
      "voice_stability": {
        "stable_score": 28,
        "unstable_score": 72,
        "label": "Unstable"
      },
      "suggestions": [
        {
          "type": "critical",
          "title": "High trauma spike detected",
          "guidance": "Ask closed Yes/No questions to protect victim safety."
        },
        {
          "type": "warning",
          "title": "Victim sounds fearful",
          "guidance": "Reassure the caller. Use calm, slow and short sentences."
        },
        {
          "type": "info",
          "title": "Build safety & trust",
          "guidance": "Let the caller speak. Validate their feelings."
        },
        {
          "type": "coercion",
          "title": "Possible coercion signaled",
          "guidance": "Keep conversation open-ended. Do not confront the abuser."
        }
      ]
    },
    "keyword_matrix_columns": [
      "00-01",
      "01-02",
      "02-03",
      "03-04",
      "04-05",
      "05-06",
      "06-07",
      "07-08"
    ],
    "keyword_matrix_rows": [
      {
        "category": "PHYSICAL THREAT",
        "counts": [
          1,
          2,
          3,
          5,
          8,
          6,
          2,
          1
        ]
      },
      {
        "category": "SUICIDAL IDEATION",
        "counts": [
          0,
          1,
          2,
          4,
          7,
          5,
          2,
          0
        ]
      },
      {
        "category": "FINANCIAL COERCION",
        "counts": [
          0,
          0,
          1,
          2,
          4,
          3,
          1,
          0
        ]
      }
    ],
    "network_graph": {
      "nodes": [
        {
          "id": "COERCION",
          "name": "COERCION",
          "group": "hub",
          "radius": 24
        },
        {
          "id": "THREAT",
          "name": "THREAT",
          "group": "hub",
          "radius": 20
        },
        {
          "id": "PHYSICAL VIOLENCE",
          "name": "PHYSICAL VIOLENCE",
          "group": "hub",
          "radius": 20
        },
        {
          "id": "INTIMIDATION",
          "name": "INTIMIDATION",
          "group": "hub",
          "radius": 20
        },
        {
          "id": "SUICIDAL IDEATION",
          "name": "SUICIDAL IDEATION",
          "group": "hub",
          "radius": 20
        },
        {
          "id": "kill",
          "name": "kill",
          "group": "word",
          "radius": 12
        },
        {
          "id": "hurt",
          "name": "hurt",
          "group": "word",
          "radius": 11
        },
        {
          "id": "harm",
          "name": "harm",
          "group": "word",
          "radius": 10
        },
        {
          "id": "beat",
          "name": "beat",
          "group": "word",
          "radius": 11
        },
        {
          "id": "attack",
          "name": "attack",
          "group": "word",
          "radius": 12
        },
        {
          "id": "hit",
          "name": "hit",
          "group": "word",
          "radius": 10
        },
        {
          "id": "scared",
          "name": "scared",
          "group": "word",
          "radius": 11
        },
        {
          "id": "fear",
          "name": "fear",
          "group": "word",
          "radius": 11
        },
        {
          "id": "pressure",
          "name": "pressure",
          "group": "word",
          "radius": 10
        },
        {
          "id": "end it",
          "name": "end it",
          "group": "word",
          "radius": 11
        },
        {
          "id": "die",
          "name": "die",
          "group": "word",
          "radius": 11
        },
        {
          "id": "kill myself",
          "name": "kill myself",
          "group": "word",
          "radius": 12
        }
      ],
      "links": [
        {
          "source": "COERCION",
          "target": "THREAT",
          "value": 3
        },
        {
          "source": "COERCION",
          "target": "PHYSICAL VIOLENCE",
          "value": 3
        },
        {
          "source": "COERCION",
          "target": "INTIMIDATION",
          "value": 3
        },
        {
          "source": "COERCION",
          "target": "SUICIDAL IDEATION",
          "value": 3
        },
        {
          "source": "THREAT",
          "target": "kill",
          "value": 2
        },
        {
          "source": "THREAT",
          "target": "hurt",
          "value": 2
        },
        {
          "source": "THREAT",
          "target": "harm",
          "value": 2
        },
        {
          "source": "PHYSICAL VIOLENCE",
          "target": "beat",
          "value": 2
        },
        {
          "source": "PHYSICAL VIOLENCE",
          "target": "attack",
          "value": 2
        },
        {
          "source": "PHYSICAL VIOLENCE",
          "target": "hit",
          "value": 2
        },
        {
          "source": "INTIMIDATION",
          "target": "scared",
          "value": 2
        },
        {
          "source": "INTIMIDATION",
          "target": "fear",
          "value": 2
        },
        {
          "source": "INTIMIDATION",
          "target": "pressure",
          "value": 2
        },
        {
          "source": "SUICIDAL IDEATION",
          "target": "end it",
          "value": 2
        },
        {
          "source": "SUICIDAL IDEATION",
          "target": "die",
          "value": 2
        },
        {
          "source": "SUICIDAL IDEATION",
          "target": "kill myself",
          "value": 2
        }
      ]
    },
    "trauma_density_intervals": [
      {
        "interval": "00:00 - 01:00",
        "stress": 25,
        "level": "LOW",
        "color": "#10b981"
      },
      {
        "interval": "01:00 - 02:00",
        "stress": 48,
        "level": "MODERATE",
        "color": "#eab308"
      },
      {
        "interval": "02:00 - 03:00",
        "stress": 85,
        "level": "EXTREME",
        "color": "#ef4444"
      },
      {
        "interval": "03:00 - 04:00",
        "stress": 72,
        "level": "HIGH",
        "color": "#f97316"
      },
      {
        "interval": "04:00 - 05:00",
        "stress": 92,
        "level": "EXTREME",
        "color": "#ef4444"
      }
    ],
    "detected_threats": [
      "kill",
      "beat",
      "hit",
      "hurt",
      "scared",
      "die",
      "money"
    ]
  },
  "physical_extortion": {
    "id": "physical_extortion",
    "title": "Scenario 2: Physical Assault & Threat Call",
    "call_id": "14589",
    "language": "en",
    "language_name": "English",
    "confidence_score": 96,
    "duration_seconds": 275.0,
    "duration_formatted": "04:35",
    "word_count": 520,
    "processing_seconds": 1.15,
    "svi_score": 86.0,
    "risk_level": "CRITICAL RISK",
    "action_protocol": "IMMEDIATE POLICE INTERVENTION (PCR VAN DISPATCH) & DLSA LEGAL EMERGENCY ALERT",
    "risk_drivers": [
      {
        "text": "Trauma Spike Detected at 04:35",
        "color": "critical"
      },
      {
        "text": "Direct Physical Violence Threats",
        "color": "critical"
      },
      {
        "text": "Extreme Loudness Burst Cycles",
        "color": "high"
      },
      {
        "text": "Voice Stability Breakdown (81% Unstable)",
        "color": "high"
      }
    ],
    "mean_pitch": 312.0,
    "pitch_std": 88.5,
    "pitch_series": [
      210,
      240,
      270,
      310,
      350,
      390,
      420,
      380,
      320,
      290,
      330,
      400,
      430,
      410,
      350,
      280,
      240,
      310,
      390,
      440,
      420,
      360,
      300,
      270,
      260
    ],
    "jitter_percent": 3.12,
    "shimmer_percent": 8.15,
    "micro_tremor_level": "HIGH",
    "hnr_db": 11.2,
    "hnr_deficit_score": 82.0,
    "loudness_db": -14.2,
    "loudness_variability": 22.4,
    "speech_seconds": 180.0,
    "silence_seconds": 95.0,
    "speech_percent": 65,
    "silence_percent": 35,
    "speech_ratio_str": "1.89 : 1",
    "speech_to_silence_ratio": 1.89,
    "average_silence_duration": 1.45,
    "long_pauses_count": 18,
    "pause_density": 26.0,
    "speech_rate_wpm": 140,
    "spike_threshold_db": -10.0,
    "trauma_spikes_summary": "Major trauma spike detected at exact second 04:35 (Physical violence peak)",
    "peak_trauma_second": "04:35",
    "source_transcript": "He has a weapon! He is going to break the door down! Please send someone right now, he will kill me!",
    "english_transcript": "He has a weapon! He is going to break the door down! Please send someone right now, he will kill me!",
    "transcript_pairs": [
      {
        "timestamp": "00:05",
        "seconds": 5.0,
        "source": "He has a weapon!",
        "english": "He has a weapon!"
      },
      {
        "timestamp": "00:15",
        "seconds": 15.0,
        "source": "He is going to break the door down!",
        "english": "He is going to break the door down!"
      },
      {
        "timestamp": "00:30",
        "seconds": 30.0,
        "source": "Please send someone right now!",
        "english": "Please send someone right now!"
      },
      {
        "timestamp": "04:35",
        "seconds": 275.0,
        "source": "He will kill me! Help!",
        "english": "He will kill me! Help!"
      }
    ],
    "radar_metrics": {
      "jitter": 88,
      "shimmer": 91,
      "hnr_deficit": 85,
      "pitch_variance": 89,
      "pause_density": 78,
      "linguistic_threat": 94
    },
    "psychological_state": {
      "overall_stress_score": 86,
      "emotional_load": "High",
      "cognitive_load": "Elevated",
      "control_level": "Low"
    },
    "feature_contribution": {
      "pause_hesitation": 28,
      "jitter": 26,
      "shimmer": 21,
      "loudness_spikes": 25
    },
    "summary_insights": [
      "Critical trauma spike identified at 04:35 with vocal frequency overload.",
      "Direct physical violence threats ('weapon', 'kill', 'break down') detected.",
      "High acoustic jitter (3.12%) indicates intense somatic panic response.",
      "Frequent breath gasps and pauses reflect severe adrenaline surge.",
      "Overall Bio-Acoustic Urgency Level: CRITICAL RISK"
    ],
    "duress_detection": {
      "duress_score": 74,
      "duress_level": "HIGH RISK",
      "coercion_detected": true,
      "alert_text": "POSSIBLE COERCION DETECTED: Silent alert sent to law enforcement. Caller not notified.",
      "indicators": {
        "low_volume": {
          "active": false,
          "label": "LOW VOLUME",
          "desc": "Acoustic screaming / shouting detected"
        },
        "high_jitter": {
          "active": true,
          "label": "HIGH JITTER",
          "desc": "Severe vocal micro-instability"
        },
        "rapid_pauses": {
          "active": true,
          "label": "RAPID PAUSES",
          "desc": "Rapid dyspneic gasping"
        },
        "suppressed_speech": {
          "active": true,
          "label": "SUPPRESSED SPEECH",
          "desc": "Imminent violence stress signature"
        }
      },
      "voice_pattern_comparison": {
        "volume": {
          "normal": 68,
          "detected": 94
        },
        "jitter": {
          "normal": 15,
          "detected": 90
        },
        "pauses": {
          "normal": 22,
          "detected": 82
        },
        "speech_clarity": {
          "normal": 88,
          "detected": 26
        }
      }
    },
    "operator_copilot": {
      "call_id": "14589",
      "call_status": "LIVE",
      "call_duration_formatted": "04:35",
      "live_insights": {
        "emotion": "Terror / Panic",
        "stress_level": "Critical",
        "trauma_spike": "Extreme",
        "duress_risk": "Active Threat"
      },
      "voice_stability": {
        "stable_score": 19,
        "unstable_score": 81,
        "label": "Critically Unstable"
      },
      "suggestions": [
        {
          "type": "critical",
          "title": "Immediate Physical Danger",
          "guidance": "Dispatch nearest PCR unit immediately. Keep victim on call in low volume."
        },
        {
          "type": "warning",
          "title": "Safety Instruction",
          "guidance": "Tell caller: 'Go to a lockable room if safe to do so. Stay behind solid cover.'"
        },
        {
          "type": "info",
          "title": "Maintain Composure",
          "guidance": "Keep your voice grounded, steady and authoritative to anchor the victim."
        }
      ]
    },
    "keyword_matrix_columns": [
      "00-01",
      "01-02",
      "02-03",
      "03-04",
      "04-05",
      "05-06",
      "06-07",
      "07-08"
    ],
    "keyword_matrix_rows": [
      {
        "category": "PHYSICAL THREAT",
        "counts": [
          2,
          4,
          6,
          8,
          12,
          7,
          3,
          1
        ]
      },
      {
        "category": "SUICIDAL IDEATION",
        "counts": [
          0,
          0,
          1,
          1,
          2,
          0,
          0,
          0
        ]
      },
      {
        "category": "FINANCIAL COERCION",
        "counts": [
          1,
          2,
          3,
          5,
          6,
          2,
          1,
          0
        ]
      }
    ],
    "network_graph": {
      "nodes": [
        {
          "id": "COERCION",
          "name": "COERCION",
          "group": "hub",
          "radius": 24
        },
        {
          "id": "THREAT",
          "name": "THREAT",
          "group": "hub",
          "radius": 20
        },
        {
          "id": "PHYSICAL VIOLENCE",
          "name": "PHYSICAL VIOLENCE",
          "group": "hub",
          "radius": 20
        },
        {
          "id": "INTIMIDATION",
          "name": "INTIMIDATION",
          "group": "hub",
          "radius": 20
        },
        {
          "id": "SUICIDAL IDEATION",
          "name": "SUICIDAL IDEATION",
          "group": "hub",
          "radius": 20
        },
        {
          "id": "weapon",
          "name": "weapon",
          "group": "word",
          "radius": 13
        },
        {
          "id": "kill",
          "name": "kill",
          "group": "word",
          "radius": 14
        },
        {
          "id": "attack",
          "name": "attack",
          "group": "word",
          "radius": 12
        },
        {
          "id": "break",
          "name": "break",
          "group": "word",
          "radius": 11
        },
        {
          "id": "door",
          "name": "door",
          "group": "word",
          "radius": 10
        },
        {
          "id": "help",
          "name": "help",
          "group": "word",
          "radius": 12
        }
      ],
      "links": [
        {
          "source": "PHYSICAL VIOLENCE",
          "target": "weapon",
          "value": 3
        },
        {
          "source": "PHYSICAL VIOLENCE",
          "target": "kill",
          "value": 3
        },
        {
          "source": "PHYSICAL VIOLENCE",
          "target": "attack",
          "value": 3
        },
        {
          "source": "INTIMIDATION",
          "target": "door",
          "value": 2
        },
        {
          "source": "COERCION",
          "target": "PHYSICAL VIOLENCE",
          "value": 3
        }
      ]
    },
    "trauma_density_intervals": [
      {
        "interval": "00:00 - 01:00",
        "stress": 38,
        "level": "MODERATE",
        "color": "#eab308"
      },
      {
        "interval": "01:00 - 02:00",
        "stress": 62,
        "level": "HIGH",
        "color": "#f97316"
      },
      {
        "interval": "02:00 - 03:00",
        "stress": 78,
        "level": "HIGH",
        "color": "#f97316"
      },
      {
        "interval": "03:00 - 04:00",
        "stress": 88,
        "level": "EXTREME",
        "color": "#ef4444"
      },
      {
        "interval": "04:00 - 04:35",
        "stress": 96,
        "level": "EXTREME",
        "color": "#ef4444"
      }
    ],
    "detected_threats": [
      "weapon",
      "kill",
      "break",
      "attack",
      "hurt",
      "help"
    ]
  }
};

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const id = req.query?.id || req.query?.scenario_id;
  if (id) {
    if (ALL_SCENARIOS[id]) {
      return res.status(200).json(ALL_SCENARIOS[id]);
    }
    return res.status(404).json({ error: "Scenario not found" });
  }

  const list = Object.entries(ALL_SCENARIOS).map(([sid, sc]) => ({
    id: sid,
    title: sc.title,
    language_name: sc.language_name,
    risk_level: sc.risk_level,
    svi_score: sc.svi_score,
    duration_formatted: sc.duration_formatted,
  }));

  return res.status(200).json(list);
};
