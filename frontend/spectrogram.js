/**
 * High-performance native Canvas & SVG visualizers for the Bio-Acoustic Intelligence Dashboard.
 * Designed with defensive geometry checks to prevent zero-dimension errors.
 */

// Thermal Colormap: deep navy -> cyan -> yellow -> bright orange -> crimson
function getThermalColor(intensity) {
  const t = Math.max(0, Math.min(255, intensity)) / 255;
  let r, g, b;
  if (t < 0.25) {
    const f = t / 0.25;
    r = Math.round(10 * (1 - f) + 0 * f);
    g = Math.round(20 * (1 - f) + 242 * f);
    b = Math.round(80 * (1 - f) + 254 * f);
  } else if (t < 0.5) {
    const f = (t - 0.25) / 0.25;
    r = Math.round(0 * (1 - f) + 16 * f);
    g = Math.round(242 * (1 - f) + 185 * f);
    b = Math.round(254 * (1 - f) + 129 * f);
  } else if (t < 0.75) {
    const f = (t - 0.5) / 0.25;
    r = Math.round(16 * (1 - f) + 250 * f);
    g = Math.round(185 * (1 - f) + 204 * f);
    b = Math.round(129 * (1 - f) + 21 * f);
  } else {
    const f = (t - 0.75) / 0.25;
    r = Math.round(250 * (1 - f) + 239 * f);
    g = Math.round(204 * (1 - f) + 68 * f);
    b = Math.round(21 * (1 - f) + 68 * f);
  }
  return { r, g, b };
}

// 1. Dual-Layer Spectrogram with F0 & Loudness overlay
function drawDualLayerSpectrogram(canvasId, fftMatrix, pitchSeries, loudnessSeries) {
  try {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width > 20 ? rect.width : (canvas.parentElement?.clientWidth || 400);
    const height = rect.height > 20 ? rect.height : (canvas.parentElement?.clientHeight || 180);
    if (width <= 20 || height <= 20) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#070d1a';
    ctx.fillRect(0, 0, width, height);

    let matrix = fftMatrix;
    if (!matrix || !matrix.length) {
      matrix = [];
      for (let y = 0; y < 35; y++) {
        const row = [];
        for (let x = 0; x < 70; x++) {
          const harmonic = Math.sin(x * 0.3) * Math.cos(y * 0.4);
          const noise = Math.random() * 0.3;
          const val = Math.max(0, Math.min(255, Math.floor((harmonic + noise + 0.6) * 128)));
          row.push(val);
        }
        matrix.push(row);
      }
    }

    const numFreqBins = matrix.length;
    const numTimeFrames = matrix[0].length;
    const cellW = width / numTimeFrames;
    const cellH = height / numFreqBins;

    for (let y = 0; y < numFreqBins; y++) {
      for (let x = 0; x < numTimeFrames; x++) {
        const intensity = matrix[numFreqBins - 1 - y][x];
        const { r, g, b } = getThermalColor(intensity);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x * cellW, y * cellH, cellW + 0.5, cellH + 0.5);
      }
    }

    // Frequency grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    const freqLabels = ['8k', '2k', '500', '125'];
    freqLabels.forEach((lbl, idx) => {
      const yPos = (idx + 1) * (height / 5);
      ctx.beginPath();
      ctx.moveTo(0, yPos);
      ctx.lineTo(width, yPos);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(lbl + ' Hz', 6, yPos - 3);
    });
    ctx.setLineDash([]);

    // Overlay 1: Dynamic F0 Pitch Tracking Line (Purple / Magenta)
    if (pitchSeries && pitchSeries.length > 1) {
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const minP = 70;
      const maxP = 450;
      for (let i = 0; i < pitchSeries.length; i++) {
        const px = (i / (pitchSeries.length - 1)) * width;
        const norm = (pitchSeries[i] - minP) / (maxP - minP);
        const py = height - (Math.max(0.05, Math.min(0.95, norm)) * height);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Overlay 2: Intensity (dB) Tracking Line (Orange / Amber)
    if (loudnessSeries && loudnessSeries.length > 1) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < loudnessSeries.length; i++) {
        const lx = (i / (loudnessSeries.length - 1)) * width;
        const dbVal = loudnessSeries[i].db ?? loudnessSeries[i];
        const norm = Math.max(0, Math.min(1, (dbVal + 60) / 60));
        const ly = height - (norm * (height * 0.7) + height * 0.15);
        if (i === 0) ctx.moveTo(lx, ly);
        else ctx.lineTo(lx, ly);
      }
      ctx.stroke();
    }
  } catch (err) {
    console.warn("drawDualLayerSpectrogram non-fatal error:", err);
  }
}

// 2. 6-Axis Bio-Acoustic Radar / Spider Chart (Defensively guarded)
function drawRadarChart(canvasId, metrics) {
  try {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width > 30 ? rect.width : (canvas.parentElement?.clientWidth || 320);
    const height = rect.height > 30 ? rect.height : (canvas.parentElement?.clientHeight || 270);
    if (width <= 30 || height <= 30) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.max(25, Math.min(centerX, centerY) - 34);

    ctx.clearRect(0, 0, width, height);

    const axes = [
      { label: 'Jitter', key: 'jitter' },
      { label: 'Shimmer', key: 'shimmer' },
      { label: 'HNR Deficit', key: 'hnr_deficit' },
      { label: 'Pitch Variance', key: 'pitch_variance' },
      { label: 'Pause Density', key: 'pause_density' },
      { label: 'Linguistic Threat', key: 'linguistic_threat' },
    ];
    const numAxes = axes.length;
    const angleStep = (Math.PI * 2) / numAxes;

    // Concentric polygon rings
    const levels = [0.25, 0.5, 0.75, 1.0];
    levels.forEach(level => {
      ctx.beginPath();
      ctx.strokeStyle = level === 1.0 ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < numAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius * level);
        const y = centerY + Math.sin(angle) * (radius * level);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    });

    // Radiating spokes
    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Axis Labels
      const labelDist = radius + 20;
      const lx = centerX + Math.cos(angle) * labelDist;
      const ly = centerY + Math.sin(angle) * labelDist;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(axes[i].label, lx, ly);
    }

    // Data Polygon
    const dataPoints = axes.map(a => {
      const val = metrics ? (metrics[a.key] ?? 65) : 65;
      return Math.max(15, Math.min(100, val)) / 100;
    });

    ctx.beginPath();
    dataPoints.forEach((normVal, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = radius * normVal;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();

    // Defensively create radial gradient (r0 >= 0 and r1 > r0 guaranteed!)
    const r0 = Math.max(0, radius * 0.1);
    const r1 = Math.max(r0 + 2, radius);
    const gradient = ctx.createRadialGradient(centerX, centerY, r0, centerX, centerY, r1);
    gradient.addColorStop(0, 'rgba(168, 85, 247, 0.45)');
    gradient.addColorStop(0.7, 'rgba(0, 242, 254, 0.35)');
    gradient.addColorStop(1, 'rgba(0, 242, 254, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Vertex markers
    dataPoints.forEach((normVal, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = radius * normVal;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 1.8;
      ctx.stroke();
    });
  } catch (err) {
    console.warn("drawRadarChart non-fatal error:", err);
  }
}

// 3. Waveform Canvas
function drawWaveform(canvasId, waveformData, strokeColor = '#38bdf8') {
  try {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width > 20 ? rect.width : (canvas.parentElement?.clientWidth || 400);
    const height = rect.height > 20 ? rect.height : (canvas.parentElement?.clientHeight || 70);
    if (width <= 20 || height <= 20) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const midY = height / 2;
    ctx.clearRect(0, 0, width, height);

    const data = (waveformData && waveformData.length) ? waveformData : (function() {
      const arr = [];
      for (let i = 0; i < 200; i++) {
        const amp = (Math.sin(i * 0.15) * 0.5 + Math.sin(i * 0.05) * 0.3) * (0.4 + Math.random() * 0.6);
        arr.push(amp);
      }
      return arr;
    })();

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.6;
    ctx.beginPath();

    const step = width / data.length;
    for (let i = 0; i < data.length; i++) {
      const x = i * step;
      const y = midY - data[i] * (height * 0.42);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();
  } catch (err) {
    console.warn("drawWaveform non-fatal error:", err);
  }
}

// 4. Continuous 2D Trauma Heatmap Bar
function drawHeatmapBar(canvasId, heatmapData, currentPlayheadRatio = null) {
  try {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width > 20 ? rect.width : (canvas.parentElement?.clientWidth || 400);
    const height = rect.height > 10 ? rect.height : (canvas.parentElement?.clientHeight || 38);
    if (width <= 20 || height <= 10) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const gradient = ctx.createLinearGradient(0, 0, width, 0);

    if (heatmapData && heatmapData.length > 1) {
      heatmapData.forEach((item, idx) => {
        const stop = idx / (heatmapData.length - 1);
        const score = item.stress;
        let color;
        if (score < 30) color = '#10b981';
        else if (score < 60) color = '#facc15';
        else if (score < 80) color = '#f97316';
        else color = '#ef4444';
        gradient.addColorStop(stop, color);
      });
    } else {
      gradient.addColorStop(0, '#10b981');
      gradient.addColorStop(0.35, '#facc15');
      gradient.addColorStop(0.65, '#f97316');
      gradient.addColorStop(0.85, '#ef4444');
      gradient.addColorStop(1.0, '#ef4444');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    if (currentPlayheadRatio !== null) {
      const px = width * Math.max(0, Math.min(1, currentPlayheadRatio));
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();
    }
  } catch (err) {
    console.warn("drawHeatmapBar non-fatal error:", err);
  }
}

// 5. Interactive Threat-Word Co-Occurrence Network Graph
function drawNetworkGraph(canvasId, graphData) {
  try {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width > 40 ? rect.width : (canvas.parentElement?.clientWidth || 400);
    const height = rect.height > 40 ? rect.height : (canvas.parentElement?.clientHeight || 250);
    if (width <= 40 || height <= 40) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = '#080e1c';
    ctx.fillRect(0, 0, width, height);

    const hubs = {
      'COERCION': { x: centerX, y: centerY, color: '#a855f7', r: 24, label: 'COERCION' },
      'PHYSICAL VIOLENCE': { x: centerX + 110, y: centerY - 55, color: '#f59e0b', r: 20, label: 'PHYSICAL\nVIOLENCE' },
      'INTIMIDATION': { x: centerX - 110, y: centerY + 50, color: '#f97316', r: 20, label: 'INTIMIDATION' },
      'THREAT': { x: centerX - 110, y: centerY - 55, color: '#ef4444', r: 20, label: 'THREAT' },
      'SUICIDAL IDEATION': { x: centerX + 110, y: centerY + 55, color: '#dc2626', r: 20, label: 'SUICIDAL\nIDEATION' },
    };

    const satellites = [
      { text: 'kill', hub: 'THREAT', angle: 180, dist: 55 },
      { text: 'hurt', hub: 'THREAT', angle: 140, dist: 50 },
      { text: 'harm', hub: 'THREAT', angle: 220, dist: 52 },
      { text: 'beat', hub: 'PHYSICAL VIOLENCE', angle: 10, dist: 52 },
      { text: 'attack', hub: 'PHYSICAL VIOLENCE', angle: 60, dist: 50 },
      { text: 'hit', hub: 'PHYSICAL VIOLENCE', angle: 320, dist: 50 },
      { text: 'scared', hub: 'INTIMIDATION', angle: 180, dist: 50 },
      { text: 'fear', hub: 'INTIMIDATION', angle: 220, dist: 52 },
      { text: 'pressure', hub: 'INTIMIDATION', angle: 270, dist: 50 },
      { text: 'end it', hub: 'SUICIDAL IDEATION', angle: 10, dist: 50 },
      { text: 'die', hub: 'SUICIDAL IDEATION', angle: 60, dist: 52 },
      { text: 'kill myself', hub: 'SUICIDAL IDEATION', angle: 320, dist: 55 },
    ];

    // Links to Coercion Center
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
    ctx.lineWidth = 1.8;
    Object.keys(hubs).forEach(hKey => {
      if (hKey !== 'COERCION') {
        ctx.beginPath();
        ctx.moveTo(hubs['COERCION'].x, hubs['COERCION'].y);
        ctx.lineTo(hubs[hKey].x, hubs[hKey].y);
        ctx.stroke();
      }
    });

    // Links to Satellites
    satellites.forEach(sat => {
      const parent = hubs[sat.hub];
      if (!parent) return;
      const rad = (sat.angle * Math.PI) / 180;
      const sx = parent.x + Math.cos(rad) * sat.dist;
      const sy = parent.y + Math.sin(rad) * sat.dist;
      sat.x = sx;
      sat.y = sy;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(parent.x, parent.y);
      ctx.lineTo(sx, sy);
      ctx.stroke();
    });

    // Satellites
    satellites.forEach(sat => {
      ctx.beginPath();
      ctx.arc(sat.x, sat.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = '8.5px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sat.text, sat.x, sat.y);
    });

    // Hubs
    Object.values(hubs).forEach(h => {
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2);
      ctx.fillStyle = h.color;
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const lines = h.label.split('\n');
      if (lines.length === 1) {
        ctx.fillText(lines[0], h.x, h.y);
      } else {
        ctx.fillText(lines[0], h.x, h.y - 4);
        ctx.fillText(lines[1], h.x, h.y + 5);
      }
    });
  } catch (err) {
    console.warn("drawNetworkGraph non-fatal error:", err);
  }
}

// 6. Semi-Circular Speedometer Gauge (Safely guarded)
function drawSpeedometer(canvasId, score, minVal = 0, maxVal = 100, label = 'HIGH') {
  try {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width > 20 ? rect.width : (canvas.parentElement?.clientWidth || 180);
    const height = rect.height > 20 ? rect.height : (canvas.parentElement?.clientHeight || 110);
    if (width <= 20 || height <= 20) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const cx = width / 2;
    const cy = height - 14;
    const radius = Math.max(20, Math.min(width / 2, height) - 16);

    ctx.clearRect(0, 0, width, height);

    const startAngle = Math.PI;
    const totalAngle = Math.PI;

    const zones = [
      { pct: 0.25, color: '#10b981' },
      { pct: 0.50, color: '#facc15' },
      { pct: 0.75, color: '#f97316' },
      { pct: 1.00, color: '#ef4444' },
    ];

    let currentAngle = startAngle;
    zones.forEach((z, i) => {
      const prevPct = i === 0 ? 0 : zones[i - 1].pct;
      const span = (z.pct - prevPct) * totalAngle;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, currentAngle, currentAngle + span, false);
      ctx.strokeStyle = z.color;
      ctx.lineWidth = 12;
      ctx.stroke();
      currentAngle += span;
    });

    const normalized = Math.max(0, Math.min(1, (score - minVal) / (maxVal - minVal)));
    const needleAngle = startAngle + normalized * totalAngle;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(needleAngle);
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(radius - 8, 0);
    ctx.lineTo(0, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${score}`, cx, cy - 18);

    ctx.fillStyle = normalized > 0.7 ? '#f87171' : (normalized > 0.4 ? '#fb923c' : '#34d399');
    ctx.font = 'bold 9px "Space Grotesk", sans-serif';
    ctx.fillText(label, cx, cy - 6);
  } catch (err) {
    console.warn("drawSpeedometer non-fatal error:", err);
  }
}

// 7. Silence Duration Over Time with 2s Threshold line
function drawSilenceDurationChart(canvasId, pauseSegments, maxSec = 150) {
  try {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width > 20 ? rect.width : (canvas.parentElement?.clientWidth || 400);
    const height = rect.height > 20 ? rect.height : (canvas.parentElement?.clientHeight || 130);
    if (width <= 20 || height <= 20) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#080e1c';
    ctx.fillRect(0, 0, width, height);

    const maxY = 4.0;
    const thresholdY = height - (2.0 / maxY) * (height - 20) - 10;

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(0, thresholdY);
    ctx.lineTo(width, thresholdY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#f87171';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('2 sec Threshold', width - 90, thresholdY - 4);

    const pauses = (pauseSegments && pauseSegments.length > 1) ? pauseSegments : [
      { time: 5, duration: 0.8 },
      { time: 15, duration: 1.4 },
      { time: 30, duration: 2.3 },
      { time: 45, duration: 1.1 },
      { time: 60, duration: 2.8 },
      { time: 75, duration: 0.9 },
      { time: 90, duration: 1.7 },
      { time: 110, duration: 3.1 },
      { time: 130, duration: 0.7 },
      { time: 145, duration: 1.2 }
    ];

    ctx.beginPath();
    pauses.forEach((p, idx) => {
      const x = (idx / (pauses.length - 1)) * (width - 20) + 10;
      const norm = Math.min(maxY, p.duration) / maxY;
      const y = height - (norm * (height - 24)) - 10;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.stroke();

    pauses.forEach((p, idx) => {
      const x = (idx / (pauses.length - 1)) * (width - 20) + 10;
      const norm = Math.min(maxY, p.duration) / maxY;
      const y = height - (norm * (height - 24)) - 10;

      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = p.duration >= 2.0 ? '#ef4444' : '#c084fc';
      ctx.fill();
    });
  } catch (err) {
    console.warn("drawSilenceDurationChart non-fatal error:", err);
  }
}

// 8. Loudness Spikes Chart
function drawLoudnessSpikesChart(canvasId, series, thresholdDb = -12.0) {
  try {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width > 20 ? rect.width : (canvas.parentElement?.clientWidth || 400);
    const height = rect.height > 20 ? rect.height : (canvas.parentElement?.clientHeight || 160);
    if (width <= 20 || height <= 20) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#080e1c';
    ctx.fillRect(0, 0, width, height);

    const minDb = -70;
    const maxDb = 0;
    const threshNorm = (thresholdDb - minDb) / (maxDb - minDb);
    const threshY = height - (threshNorm * (height - 20)) - 10;

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(0, threshY);
    ctx.lineTo(width, threshY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#f87171';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('Spike Threshold', width - 90, threshY - 4);

    const data = (series && series.length > 2) ? series : (function() {
      const arr = [];
      for (let i = 0; i < 40; i++) {
        const db = -45 + Math.sin(i * 0.4) * 15 + (Math.random() > 0.85 ? 25 : 0);
        arr.push({ time: i * 3, db });
      }
      return arr;
    })();

    ctx.beginPath();
    data.forEach((pt, idx) => {
      const x = (idx / (data.length - 1)) * (width - 20) + 10;
      const norm = Math.max(0, Math.min(1, (pt.db - minDb) / (maxDb - minDb)));
      const y = height - (norm * (height - 24)) - 10;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.stroke();

    data.forEach((pt, idx) => {
      if (pt.db >= thresholdDb) {
        const x = (idx / (data.length - 1)) * (width - 20) + 10;
        const norm = Math.max(0, Math.min(1, (pt.db - minDb) / (maxDb - minDb)));
        const y = height - (norm * (height - 24)) - 10;

        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
      }
    });
  } catch (err) {
    console.warn("drawLoudnessSpikesChart non-fatal error:", err);
  }
}