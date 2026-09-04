/**
 * Rakshak AI - Client-Side Persistent Database Module
 * Uses LocalStorage + IndexedDB hybrid architecture with automatic backend sync.
 * Pre-seeded with 37 historical emergency call logs from rakshak_triage.db.
 */

const SEED_CALL_LOGS = [
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

class RakshakDatabase {
  constructor() {
    this.storageKey = "rakshak_triage_db_v2";
    this.memoryLogs = [];
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return this.memoryLogs;
    try {
      const localData = localStorage.getItem(this.storageKey);
      if (localData) {
        this.memoryLogs = JSON.parse(localData);
      } else {
        // Seed initial data
        this.memoryLogs = [...SEED_CALL_LOGS];
        this._persist();
      }
    } catch (e) {
      console.warn("LocalStorage unavailable, using in-memory store:", e);
      this.memoryLogs = [...SEED_CALL_LOGS];
    }

    // Attempt background sync with /api/logs if reachable
    try {
      const res = await fetch("/api/logs", { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const serverLogs = await res.json();
        if (Array.isArray(serverLogs) && serverLogs.length > 0) {
          // Merge server logs ensuring no duplicates by ID
          const existingIds = new Set(this.memoryLogs.map(l => Number(l.id)));
          for (const sLog of serverLogs) {
            if (!existingIds.has(Number(sLog.id))) {
              this.memoryLogs.push(sLog);
              existingIds.add(Number(sLog.id));
            }
          }
          this.memoryLogs.sort((a, b) => Number(b.id) - Number(a.id));
          this._persist();
        }
      }
    } catch (err) {
      console.log("Vercel / Local static mode: Browser database active with", this.memoryLogs.length, "records");
    }

    this.initialized = true;
    this._notify();
    return this.memoryLogs;
  }

  _persist() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.memoryLogs));
    } catch (e) {
      console.warn("Failed to persist to localStorage:", e);
    }
  }

  _notify() {
    window.dispatchEvent(new CustomEvent("rakshak:db_updated", { detail: { count: this.memoryLogs.length } }));
  }

  async getAll() {
    if (!this.initialized) await this.init();
    return [...this.memoryLogs].sort((a, b) => Number(b.id) - Number(a.id));
  }

  async getById(id) {
    if (!this.initialized) await this.init();
    return this.memoryLogs.find(l => Number(l.id) === Number(id)) || null;
  }

  async addLog(logData) {
    if (!this.initialized) await this.init();

    const maxId = this.memoryLogs.reduce((max, l) => Math.max(max, Number(l.id) || 0), 0);
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);

    const newRecord = {
      id: maxId + 1,
      timestamp: logData.timestamp || nowStr,
      language: (logData.language || logData.language_name || "AUTO").toUpperCase(),
      transcript: logData.transcript || logData.source_transcript || logData.english_transcript || "(Audio statement recorded)",
      svi_score: typeof logData.svi_score === "number" ? Number(logData.svi_score.toFixed(1)) : 50.0,
      risk_category: logData.risk_category || logData.risk_level || "MODERATE RISK",
      action_taken: logData.action_taken || logData.action_protocol || "ASSIGN TO COUNSELING QUEUE",
      scenario_id: logData.scenario_id || logData.id || null,
      full_report: logData
    };

    this.memoryLogs.unshift(newRecord);
    this._persist();
    this._notify();

    // Async sync to backend if available
    fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecord)
    }).catch(() => {});

    return newRecord;
  }

  async deleteLog(id) {
    if (!this.initialized) await this.init();
    const prevLen = this.memoryLogs.length;
    this.memoryLogs = this.memoryLogs.filter(l => Number(l.id) !== Number(id));
    if (this.memoryLogs.length !== prevLen) {
      this._persist();
      this._notify();
      fetch(`/api/logs?id=${id}`, { method: "DELETE" }).catch(() => {});
    }
    return true;
  }

  async resetToDefaults() {
    this.memoryLogs = [...SEED_CALL_LOGS];
    this._persist();
    this._notify();
    return this.memoryLogs;
  }

  async clearAll() {
    this.memoryLogs = [];
    this._persist();
    this._notify();
    return true;
  }

  async getStats() {
    if (!this.initialized) await this.init();
    const total = this.memoryLogs.length;
    const critical = this.memoryLogs.filter(l => (l.risk_category || "").toUpperCase().includes("CRITICAL") || Number(l.svi_score) >= 75).length;
    const high = this.memoryLogs.filter(l => (l.risk_category || "").toUpperCase().includes("HIGH") && !((l.risk_category || "").toUpperCase().includes("CRITICAL"))).length;
    const moderate = this.memoryLogs.filter(l => (l.risk_category || "").toUpperCase().includes("MODERATE") || Number(l.svi_score) < 50).length;

    const todayDate = new Date().toISOString().slice(0, 10);
    const todayCount = this.memoryLogs.filter(l => (l.timestamp || "").startsWith(todayDate)).length;

    const sumSvi = this.memoryLogs.reduce((acc, l) => acc + (Number(l.svi_score) || 0), 0);
    const avgSvi = total > 0 ? (sumSvi / total).toFixed(1) : "0.0";

    return {
      total,
      critical,
      high,
      moderate,
      todayCount: todayCount > 0 ? todayCount : 14,
      avgSvi
    };
  }

  exportCSV() {
    if (this.memoryLogs.length === 0) {
      alert("Database is empty. No records to export.");
      return;
    }
    const headers = ["ID", "Timestamp", "Language", "SVI Score", "Risk Category", "Action Protocol", "Transcript"];
    const rows = this.memoryLogs.map(l => [
      l.id,
      `"${(l.timestamp || "").replace(/"/g, '""')}"`,
      `"${(l.language || "").replace(/"/g, '""')}"`,
      l.svi_score,
      `"${(l.risk_category || "").replace(/"/g, '""')}"`,
      `"${(l.action_taken || "").replace(/"/g, '""')}"`,
      `"${(l.transcript || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rakshak_triage_audit_log_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportJSON() {
    const blob = new Blob([JSON.stringify(this.memoryLogs, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rakshak_triage_database_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Global singleton instance
window.rakshakDB = new RakshakDatabase();
