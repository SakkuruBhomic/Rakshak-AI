// Vercel Serverless Function: Emergency Call Triage Database
const SEED_LOGS = [
  {
    "id": 1,
    "timestamp": "2026-09-03 08:44:30",
    "language": "EN",
    "transcript": "The ideas are nurturing me.",
    "svi_score": 40.0,
    "risk_category": "MODERATE RISK",
    "action_taken": "ASSIGN TO STANDARD COUNSELING QUEUE & SCHEDULER"
  },
  {
    "id": 2,
    "timestamp": "2026-09-03 08:46:00",
    "language": "LA",
    "transcript": "I'm watching you, you can't escape me. I'm looking for blood.",
    "svi_score": 40.0,
    "risk_category": "MODERATE RISK",
    "action_taken": "ASSIGN TO STANDARD COUNSELING QUEUE & SCHEDULER"
  },
  {
    "id": 3,
    "timestamp": "2026-09-03 08:56:40",
    "language": "EN",
    "transcript": "They want to kill me.",
    "svi_score": 55.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  },
  {
    "id": 4,
    "timestamp": "2026-09-03 12:54:12",
    "language": "LA",
    "transcript": "I'm watching you, you can't escape me. I'm looking for blood.",
    "svi_score": 70.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  },
  {
    "id": 5,
    "timestamp": "2026-09-04 06:11:39",
    "language": "LA",
    "transcript": "I'm watching you, you can't escape me. I'm looking for blood.",
    "svi_score": 70.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  },
  {
    "id": 6,
    "timestamp": "2026-09-04 06:11:39",
    "language": "LA",
    "transcript": "I'm watching you, you can't escape me. I'm not making you proud.",
    "svi_score": 70.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  },
  {
    "id": 7,
    "timestamp": "2026-09-04 06:12:46",
    "language": "EN",
    "transcript": "They are threatening me. I am afraid. He is beside me. You want to rape me.",
    "svi_score": 70.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  },
  {
    "id": 8,
    "timestamp": "2026-09-04 06:13:58",
    "language": "EN",
    "transcript": "I am so happy you know because I am actually committing a sexual interaction.",
    "svi_score": 40.0,
    "risk_category": "MODERATE RISK",
    "action_taken": "ASSIGN TO STANDARD COUNSELING QUEUE & SCHEDULER"
  },
  {
    "id": 9,
    "timestamp": "2026-09-04 06:16:43",
    "language": "TE",
    "transcript": "I am scared of them.",
    "svi_score": 40.0,
    "risk_category": "MODERATE RISK",
    "action_taken": "ASSIGN TO STANDARD COUNSELING QUEUE & SCHEDULER"
  },
  {
    "id": 10,
    "timestamp": "2026-09-04 06:17:33",
    "language": "TE",
    "transcript": "I am the boss of the village. I am the boss of the village. I am the boss of the village.",
    "svi_score": 40.0,
    "risk_category": "MODERATE RISK",
    "action_taken": "ASSIGN TO STANDARD COUNSELING QUEUE & SCHEDULER"
  },
  {
    "id": 11,
    "timestamp": "2026-09-04 06:18:20",
    "language": "TE",
    "transcript": "Go and earn water水 ...please algameen",
    "svi_score": 40.0,
    "risk_category": "MODERATE RISK",
    "action_taken": "ASSIGN TO STANDARD COUNSELING QUEUE & SCHEDULER"
  },
  {
    "id": 12,
    "timestamp": "2026-09-04 06:18:49",
    "language": "TE",
    "transcript": "Come to this place onceEnlave me Come",
    "svi_score": 40.0,
    "risk_category": "MODERATE RISK",
    "action_taken": "ASSIGN TO STANDARD COUNSELING QUEUE & SCHEDULER"
  },
  {
    "id": 13,
    "timestamp": "2026-09-04 06:31:32",
    "language": "TE",
    "transcript": "Why have youaves me? You have talked to me on the bed.. How have you saved meni? How have you saved me, my children? How have you saved meni?",
    "svi_score": 40.0,
    "risk_category": "MODERATE RISK",
    "action_taken": "ASSIGN TO STANDARD COUNSELING QUEUE & SCHEDULER"
  },
  {
    "id": 14,
    "timestamp": "2026-09-04 07:13:15",
    "language": "TE",
    "transcript": "I would make him happy potato then broke the lock as whether I can bring him or not",
    "svi_score": 55.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  },
  {
    "id": 15,
    "timestamp": "2026-09-04 07:14:36",
    "language": "TE",
    "transcript": "I am not a servant. I am a servant. I am a servant. Please help me. I am scared of them. No. Please save me. Save me. Save me. I will kill you. I will kill you now. I will kill you. I am very scared. Please save me. I will kill you. I will kill you.",
    "svi_score": 85.0,
    "risk_category": "CRITICAL RISK",
    "action_taken": "IMMEDIATE POLICE INTERVENTION (PCR VAN DISPATCH) & DLSA LEGAL EMERGENCY ALERT"
  },
  {
    "id": 16,
    "timestamp": "2026-09-04 09:28:23",
    "language": "LA",
    "transcript": "I'm watching you, you can't escape me. I'm looking for blood.",
    "svi_score": 70.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  },
  {
    "id": 17,
    "timestamp": "2026-09-04 09:29:36",
    "language": "ML",
    "transcript": "it cheating",
    "svi_score": 40.0,
    "risk_category": "MODERATE RISK",
    "action_taken": "ASSIGN TO STANDARD COUNSELING QUEUE & SCHEDULER"
  },
  {
    "id": 18,
    "timestamp": "2026-09-04 09:33:08",
    "language": "LA",
    "transcript": "I'm watching you, you can't escape me. I'm looking for blood.",
    "svi_score": 70.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  },
  {
    "id": 19,
    "timestamp": "2026-09-04 10:44:55",
    "language": "LA",
    "transcript": "I'm watching you, you can't escape me. I'm looking for blood.",
    "svi_score": 70.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  },
  {
    "id": 20,
    "timestamp": "2026-09-04 10:45:19",
    "language": "EN",
    "transcript": "I am not buying masks. I am buying masks. I am buying masks. I am buying masks.",
    "svi_score": 40.0,
    "risk_category": "MODERATE RISK",
    "action_taken": "ASSIGN TO STANDARD COUNSELING QUEUE & SCHEDULER"
  },
  {
    "id": 21,
    "timestamp": "2026-09-04 10:46:15",
    "language": "TA",
    "transcript": "My dream has changed so much",
    "svi_score": 40.0,
    "risk_category": "MODERATE RISK",
    "action_taken": "ASSIGN TO STANDARD COUNSELING QUEUE & SCHEDULER"
  },
  {
    "id": 22,
    "timestamp": "2026-09-04 10:52:55",
    "language": "TA",
    "transcript": "My dad wasWowky",
    "svi_score": 40.0,
    "risk_category": "MODERATE RISK",
    "action_taken": "ASSIGN TO STANDARD COUNSELING QUEUE & SCHEDULER"
  },
  {
    "id": 23,
    "timestamp": "2026-09-04 10:53:02",
    "language": "TA",
    "transcript": "there is a lot of peace of my life",
    "svi_score": 40.0,
    "risk_category": "MODERATE RISK",
    "action_taken": "ASSIGN TO STANDARD COUNSELING QUEUE & SCHEDULER"
  },
  {
    "id": 24,
    "timestamp": "2026-09-04 10:58:37",
    "language": "LA",
    "transcript": "I'm watching you, you can't escape me. I'm looking for blood.",
    "svi_score": 70.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  },
  {
    "id": 25,
    "timestamp": "2026-09-04 11:00:55",
    "language": "TE",
    "transcript": "Gozo, smash it and hit the bell? nooo son... anything was wrong",
    "svi_score": 55.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  },
  {
    "id": 26,
    "timestamp": "2026-09-04 11:03:23",
    "language": "LA",
    "transcript": "I'm watching you, you can't escape me. I'm looking for blood.",
    "svi_score": 70.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  },
  {
    "id": 27,
    "timestamp": "2026-09-04 11:47:27",
    "language": "LA",
    "transcript": "I'm watching you, you can't escape me. I'm looking for blood.",
    "svi_score": 70.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  },
  {
    "id": 28,
    "timestamp": "2026-09-04 11:48:35",
    "language": "EN",
    "transcript": "They are trying to kill me. Help me.",
    "svi_score": 70.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  },
  {
    "id": 29,
    "timestamp": "2026-09-04 11:49:28",
    "language": "HI",
    "transcript": "I don't want to kill him. Save me. I don't want to kill him. Save me. Save me.",
    "svi_score": 70.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  },
  {
    "id": 30,
    "timestamp": "2026-09-04 11:49:55",
    "language": "HI",
    "transcript": "I want to die. Help me.",
    "svi_score": 55.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  },
  {
    "id": 31,
    "timestamp": "2026-09-04 12:50:59",
    "language": "LA",
    "transcript": "I'm watching you, you can't escape me. I'm looking for blood.",
    "svi_score": 70.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  },
  {
    "id": 32,
    "timestamp": "2026-09-04 12:52:01",
    "language": "LA",
    "transcript": "I'm watching you, you can't escape me. I'm looking for blood.",
    "svi_score": 70.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  },
  {
    "id": 33,
    "timestamp": "2026-09-04 12:53:14",
    "language": "TE",
    "transcript": "I am scared. I am going to die.",
    "svi_score": 40.0,
    "risk_category": "MODERATE RISK",
    "action_taken": "ASSIGN TO STANDARD COUNSELING QUEUE & SCHEDULER"
  },
  {
    "id": 34,
    "timestamp": "2026-09-04 13:32:36",
    "language": "la",
    "transcript": "I'm watching you, you can't escape me. I'm looking for blood.",
    "svi_score": 70.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  },
  {
    "id": 35,
    "timestamp": "2026-09-04 13:39:41",
    "language": "la",
    "transcript": "I'm watching you, you can't escape me. I'm looking for blood.",
    "svi_score": 70.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  },
  {
    "id": 36,
    "timestamp": "2026-09-04 13:40:43",
    "language": "la",
    "transcript": "I'm watching you, you can't escape me. I'm looking for blood.",
    "svi_score": 70.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  },
  {
    "id": 37,
    "timestamp": "2026-09-04 13:43:17",
    "language": "la",
    "transcript": "I'm watching you, you can't escape me. I'm looking for blood.",
    "svi_score": 70.0,
    "risk_category": "HIGH RISK",
    "action_taken": "CONNECT TO SENIOR PSYCHOLOGICAL COUNSELOR & DE-ESCALATION PFA PROTOCOL"
  }
];

let inMemoryLogs = [...SEED_LOGS];

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    const id = req.query?.id;
    if (id) {
      const found = inMemoryLogs.find(l => String(l.id) === String(id));
      if (!found) return res.status(404).json({ error: "Log not found" });
      return res.status(200).json(found);
    }
    return res.status(200).json(inMemoryLogs);
  }

  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const maxId = inMemoryLogs.reduce((max, l) => Math.max(max, Number(l.id) || 0), 0);
      const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);

      const record = {
        id: maxId + 1,
        timestamp: body.timestamp || nowStr,
        language: (body.language || body.language_name || "AUTO").toUpperCase(),
        transcript: body.transcript || body.source_transcript || body.english_transcript || "(Audio triage recorded)",
        svi_score: typeof body.svi_score === "number" ? Number(body.svi_score.toFixed(1)) : 50.0,
        risk_category: body.risk_category || body.risk_level || "MODERATE RISK",
        action_taken: body.action_taken || body.action_protocol || "ASSIGN TO COUNSELING QUEUE",
        scenario_id: body.scenario_id || null,
        full_report: body.full_report || null
      };

      inMemoryLogs.unshift(record);
      return res.status(201).json({ success: true, record });
    } catch (err) {
      return res.status(400).json({ error: "Invalid JSON body", detail: err.message });
    }
  }

  if (req.method === "DELETE") {
    const id = req.query?.id;
    if (id) {
      inMemoryLogs = inMemoryLogs.filter(l => String(l.id) !== String(id));
      return res.status(200).json({ success: true, deleted: id });
    }
    inMemoryLogs = [...SEED_LOGS];
    return res.status(200).json({ success: true, message: "Database reset to defaults" });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};
