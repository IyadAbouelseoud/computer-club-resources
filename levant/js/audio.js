// Sandouq El-Donya: tiny synth. Oud-like plucks (Karplus-Strong) in maqam hijaz + darbuka dum/tak. No audio files.
(function () {
  let ctx = null, master = null, on = true;
  const HIJAZ = [146.83, 155.56, 185.0, 196.0, 220.0, 233.08, 261.63, 293.66, 311.13, 369.99, 392.0, 440.0]; // D Eb F# G A Bb C D...
  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = 0.55;
      const comp = ctx.createDynamicsCompressor(); master.connect(comp); comp.connect(ctx.destination);
    } catch (e) { ctx = null; }
  }
  function pluck(freq, t, dur, vol) {
    if (!ctx) return;
    const sr = ctx.sampleRate, len = Math.floor(sr * (dur || 1.1)), buf = ctx.createBuffer(1, len, sr), d = buf.getChannelData(0);
    const N = Math.max(2, Math.round(sr / freq)), ring = new Float32Array(N);
    for (let i = 0; i < N; i++) ring[i] = Math.random() * 2 - 1;
    let idx = 0;
    for (let i = 0; i < len; i++) { const nx = (idx + 1) % N; const v = (ring[idx] + ring[nx]) * 0.4965; d[i] = ring[idx]; ring[idx] = v; idx = nx; }
    const src = ctx.createBufferSource(); src.buffer = buf;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600;
    const g = ctx.createGain(); g.gain.value = vol || 0.6;
    src.connect(lp); lp.connect(g); g.connect(master); src.start(t || ctx.currentTime);
  }
  function drum(kind, t) {
    if (!ctx) return; t = t || ctx.currentTime;
    if (kind === 'dum') {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine';
      o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(55, t + 0.25);
      g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.45);
    } else {
      const len = Math.floor(ctx.sampleRate * 0.08), b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      const src = ctx.createBufferSource(); src.buffer = b;
      const hp = ctx.createBiquadFilter(); hp.type = 'bandpass'; hp.frequency.value = kind === 'tak' ? 3200 : 1800; hp.Q.value = 1.2;
      const g = ctx.createGain(); g.gain.value = 0.7; src.connect(hp); hp.connect(g); g.connect(master); src.start(t);
    }
  }
  const S = {
    init, get on() { return on; }, set on(v) { on = !!v; },
    tap() { if (!on || !ctx) return; drum('tak'); },
    count(n) { if (!on || !ctx) return; drum(n === 0 ? 'dum' : 'tak'); if (n === 0) pluck(HIJAZ[7], ctx.currentTime, 1.2, 0.5); },
    found(i) { if (!on || !ctx) return; const t = ctx.currentTime, b = [0, 2, 4][i % 3]; [b, b + 2, b + 4].forEach((k, j) => pluck(HIJAZ[k + 3], t + j * 0.07, 1, 0.55)); drum('dum', t); },
    wrong() { if (!on || !ctx) return; pluck(HIJAZ[0] / 2, ctx.currentTime, 0.5, 0.5); drum('ka'); },
    golden() { if (!on || !ctx) return; const t = ctx.currentTime; [3, 4, 5, 6, 7, 8, 9, 10, 11].forEach((k, j) => pluck(HIJAZ[k], t + j * 0.055, 1.3, 0.45)); },
    win() {
      if (!on || !ctx) return; const t = ctx.currentTime;
      // maqsoum-ish: dum tak _ tak dum _ tak _
      [['dum', 0], ['tak', 0.18], ['tak', 0.45], ['dum', 0.6], ['tak', 0.9], ['dum', 1.08], ['tak', 1.26]].forEach(([k, d]) => drum(k, t + d));
      [7, 8, 9, 10, 11, 10, 9, 8, 7].forEach((k, j) => pluck(HIJAZ[k], t + 0.1 + j * 0.12, 1.2, 0.4));
    },
    lose() { if (!on || !ctx) return; const t = ctx.currentTime; [7, 6, 5, 4, 3].forEach((k, j) => pluck(HIJAZ[k], t + j * 0.16, 1.2, 0.45)); },
    curtain() { if (!on || !ctx) return; const t = ctx.currentTime; for (let i = 0; i < 6; i++) drum('tak', t + i * 0.06); drum('dum', t + 0.4); }
  };
  window.SANDOUQ = window.SANDOUQ || {};
  window.SANDOUQ.sfx = S;
})();
