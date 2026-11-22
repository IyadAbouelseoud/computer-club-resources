/* Caravan engine: pure functions (browser + Node tests). Programs: 'F'|'L'|'R' or {n:2..6, b:[...cmds]} */
(function (root) {
  'use strict';
  const DR = [-1, 0, 1, 0], DC = [0, 1, 0, -1];

  /* grid legend: # rock | . sand | o gem | G chest | S start (dir given separately) */
  function parse(L) {
    const rows = L.grid, H = rows.length, W = rows[0].length, rocks = new Set(), gems = [];
    let s = null, goal = null;
    rows.forEach((row, r) => { if (row.length !== W) throw new Error(L.id + ': ragged grid'); for (let c = 0; c < W; c++) {
      const ch = row[c];
      if (ch === '#') rocks.add(r + ',' + c); else if (ch === 'o') gems.push([r, c]); else if (ch === 'G') goal = [r, c]; else if (ch === 'S') s = [r, c];
    } });
    if (!s || !goal) throw new Error(L.id + ': missing S or G');
    return { H, W, rocks, gems, s, goal };
  }

  function flatten(prog) {
    const out = [];
    prog.forEach((b, i) => {
      if (typeof b === 'string') out.push({ c: b, p: String(i), l: null });
      else for (let k = 0; k < b.n; k++) b.b.forEach((c, j) => out.push({ c, p: i + '.' + j, l: String(i) }));
    });
    return out;
  }
  const count = prog => prog.reduce((a, b) => a + (typeof b === 'string' ? 1 : 1 + b.b.length), 0);

  function simulate(L, prog) {
    const M = L._m || (L._m = parse(L));
    let r = M.s[0], c = M.s[1], d = L.d, deg = d * 90;
    const left = new Set(M.gems.map(g => g.join(','))); const total = left.size;
    const tl = [{ r, c, d, deg, ev: 'start' }];
    for (const st of flatten(prog)) {
      let ev = null;
      if (st.c === 'L') { d = (d + 3) % 4; deg -= 90; }
      else if (st.c === 'R') { d = (d + 1) % 4; deg += 90; }
      else {
        const nr = r + DR[d], nc = c + DC[d];
        if (nr < 0 || nc < 0 || nr >= M.H || nc >= M.W || M.rocks.has(nr + ',' + nc)) {
          tl.push({ r, c, d, deg, p: st.p, l: st.l, ev: 'bump', br: nr, bc: nc });
          return { ok: false, reason: 'bump', tl, gotAll: left.size === 0 };
        }
        r = nr; c = nc;
        if (left.delete(r + ',' + c)) ev = 'gem';
        if (r === M.goal[0] && c === M.goal[1] && left.size === 0) { tl.push({ r, c, d, deg, p: st.p, l: st.l, ev: 'win', gem: ev === 'gem' }); return { ok: true, reason: 'win', tl }; }
      }
      tl.push({ r, c, d, deg, p: st.p, l: st.l, ev });
    }
    const onGoal = r === M.goal[0] && c === M.goal[1];
    return { ok: false, reason: onGoal ? 'gems' : 'short', tl, left: left.size };
  }

  /* minimum flat (loop-free) program length, BFS — used by tests and for stars */
  function minFlat(L, cap) {
    const M = L._m || (L._m = parse(L)); cap = cap || 40;
    const gi = {}; M.gems.forEach((g, i) => gi[g.join(',')] = i);
    const full = (1 << M.gems.length) - 1;
    const key = (r, c, d, m) => r + ',' + c + ',' + d + ',' + m;
    const q = [[M.s[0], M.s[1], L.d, 0, 0]]; const seen = new Set([key(M.s[0], M.s[1], L.d, 0)]);
    while (q.length) {
      const [r, c, d, m, n] = q.shift(); if (n >= cap) continue;
      for (const cmd of ['F', 'L', 'R']) {
        let nr = r, nc = c, nd = d, nm = m;
        if (cmd === 'L') nd = (d + 3) % 4; else if (cmd === 'R') nd = (d + 1) % 4;
        else { nr = r + DR[d]; nc = c + DC[d]; if (nr < 0 || nc < 0 || nr >= M.H || nc >= M.W || M.rocks.has(nr + ',' + nc)) continue; const k = nr + ',' + nc; if (k in gi) nm |= 1 << gi[k]; }
        if (nr === M.goal[0] && nc === M.goal[1] && nm === full) return n + 1;
        const kk = key(nr, nc, nd, nm); if (!seen.has(kk)) { seen.add(kk); q.push([nr, nc, nd, nm, n + 1]); }
      }
    }
    return Infinity;
  }

  /* ---------------- levels ---------------- */
  const W1 = 'w1', W2 = 'w2', W3 = 'w3';
  const LEVELS = [
    /* World 1: commands (small boards, a few steps) */
    { id: 'a1', w: W1, grid: ['....', 'S..G', '....'], d: 1, max: 8, par: 3, sol: ['F', 'F', 'F'], hint: 'كل قطعة ⬆️ تحرّك جمّول خطوة واحدة. اضغطوا ⬆️ ثلاث مرات ثم ▶' },
    { id: 'a2', w: W1, grid: ['..G', '...', 'S..'], d: 0, max: 9, par: 5, sol: ['F', 'F', 'R', 'F', 'F'], hint: 'جمّول ينظر للأعلى. تقدّموا خطوتين، ثم لفّوا يمينًا نحو الكنز' },
    { id: 'a3', w: W1, grid: ['...', 'S#G', '...'], d: 1, max: 10, par: 7, sol: ['L', 'F', 'R', 'F', 'F', 'R', 'F'], hint: 'الصخرة تسدّ الطريق! ندور من فوقها: يسار، تقدّم، يمين…' },
    { id: 'a4', w: W1, grid: ['..G', '.o.', 'S..'], d: 0, max: 10, par: 6, sol: ['F', 'R', 'F', 'F', 'L', 'F'], hint: 'اجمعوا الجوهرة 💎 في طريقكم قبل أن تصلوا للكنز' },
    /* World 2: loops (two levels) */
    { id: 'b1', w: W2, grid: ['#######', 'S.....G', '#######'], d: 1, max: 3, par: 2, sol: [{ n: 6, b: ['F'] }], loops: true, hint: 'ست خطوات كثيرة! اضغطوا 🔁 كرّر ثم ⬆️ ثم غيّروا العدد إلى 6' },
    { id: 'b2', w: W2, grid: ['####G', '####.', '####.', 'S....'], d: 1, max: 7, par: 5, sol: [{ n: 4, b: ['F'] }, 'L', { n: 3, b: ['F'] }], loops: true, hint: 'حلقتان: واحدة للطريق الأفقي (4) وواحدة للصعود (3)' },
    /* World 3: debug — program given, fix it (two levels) */
    { id: 'c1', w: W3, grid: ['..G', '...', 'S..'], d: 0, max: 9, par: 5, start: ['F', 'F', 'L', 'F', 'F'], sol: ['F', 'F', 'R', 'F', 'F'], debug: true, hint: 'علي بابا خلط الأوامر! اضغطوا على القطعة الزرقاء ↶ لتصير ↷' },
    { id: 'c2', w: W3, grid: ['#####', 'S...G', '#####'], d: 1, max: 8, par: 4, start: ['F', 'F', 'L', 'F', 'F'], sol: ['F', 'F', 'F', 'F'], debug: true, hint: 'هناك أمر زائد! احذفوه بالضغط على ✕' }
  ];

  /* ---------------- binary doors (three, three lanterns each) ---------------- */
  const DOORS = [
    { id: 'd1', type: 'make', vals: [4, 2, 1], target: 3, hint: 'مضيء = 1 ومطفأ = 0. أضيئوا الفانوسين 2 و1 لتصلوا إلى 3' },
    { id: 'd2', type: 'make', vals: [4, 2, 1], target: 5, hint: '4 + 1 = 5 … أضيئوا فانوس 4 وفانوس 1' },
    { id: 'd3', type: 'make', vals: [4, 2, 1], target: 6, hint: '4 + 2 = 6 — باب النادي الكبير!' }
  ];

  const api = { LEVELS, DOORS, parse, flatten, count, simulate, minFlat, DR, DC };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.CaravanEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
