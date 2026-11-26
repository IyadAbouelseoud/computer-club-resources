// Sandouq El-Donya · صندوق الدنيا
// One-screen booth game for the Levant booth. Works on a tablet or a touch laptop, offline once loaded.
(function () {
  'use strict';
  const S = window.SANDOUQ, sfx = S.sfx;
  const $ = (q) => document.querySelector(q);
  const AR = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
  const ORDER = ['sy', 'lb', 'ps', 'jo'];
  const byId = Object.fromEntries(S.ITEMS.map((i) => [i.id, i]));

  // ---------- storage ----------
  const KEY = 'sandouq.v1';
  const DEFAULTS = {
    pin: '2026', shift: 'girls', sound: true,
    roundSec: 40, penalty: 1, goldenChance: 12,
    ghAuto: true, ghEvery: 30, ghLen: 5, ghManualUntil: 0,
    pay: { perfect: 10, partial: 5, speed: 5, speedUnder: 20, golden: 15, mult: 2 }
  };
  let DB;
  try { DB = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { DB = {}; }
  DB.settings = Object.assign({}, DEFAULTS, DB.settings || {});
  DB.settings.pay = Object.assign({}, DEFAULTS.pay, (DB.settings && DB.settings.pay) || {});
  DB.boards = DB.boards || {}; DB.stats = DB.stats || {};
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { } };
  const cfg = DB.settings;
  sfx.on = cfg.sound;
  const board = () => (DB.boards[cfg.shift] = DB.boards[cfg.shift] || []);
  const stats = () => (DB.stats[cfg.shift] = DB.stats[cfg.shift] || { peeks: 0, lira: 0, golden: 0, perfect: 0 });
  const SHIFT_NAME = { girls: ['فترة البنات', 'Girls shift'], boys: ['فترة الشباب', 'Boys shift'] };

  // ---------- optional art from Gemini (assets/manifest.json) ----------
  let MAN = {};
  fetch('assets/manifest.json', { cache: 'no-cache' }).then((r) => r.ok ? r.json() : {}).then((j) => { MAN = j || {}; renderAttract(); renderDoors(); }).catch(() => { });
  const art = (id) => MAN['item-' + id] ? `<img src="assets/items/${id}.png" alt="" draggable="false">` : S.svgOf(id);

  // ---------- golden hour ----------
  function golden(now) {
    now = now || Date.now();
    if (cfg.ghManualUntil > now) return { on: true, left: cfg.ghManualUntil - now };
    if (!cfg.ghAuto) return { on: false, next: null };
    const d = new Date(now), m = d.getMinutes() + d.getSeconds() / 60 + d.getMilliseconds() / 60000;
    const pos = m % cfg.ghEvery;
    if (pos < cfg.ghLen) return { on: true, left: (cfg.ghLen - pos) * 60000 };
    return { on: false, next: (cfg.ghEvery - pos) * 60000 };
  }
  const mmss = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };

  // ---------- screens ----------
  let screen = 'attract';
  function show(id) {
    document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('on', s.id === id));
    screen = id; bumpIdle();
  }
  let idleT = 0;
  function bumpIdle() {
    clearTimeout(idleT);
    if (screen === 'pick') idleT = setTimeout(() => show('attract'), 30000);
    if (screen === 'result') idleT = setTimeout(() => { if (document.activeElement !== $('#nameIn')) finishResult(); else bumpIdle(); }, 40000);
  }
  document.addEventListener('pointerdown', () => { sfx.init(); bumpIdle(); }, { passive: true });

  // ---------- box art (attract) ----------
  function boxSVG() {
    const k = '#2B2520', sw = `stroke="${k}" stroke-width="5" stroke-linejoin="round"`;
    let merlons = '';
    for (let i = 0; i < 9; i++) { const x = 62 + i * 54; merlons += `<path d="M${x} 112 L${x} 84 L${x + 10} 84 L${x + 10} 70 L${x + 30} 70 L${x + 30} 84 L${x + 40} 84 L${x + 40} 112 Z" fill="#E4D3B0" ${sw}/>`; }
    let stripes = ''; for (let y = 112, i = 0; y < 168; y += 14, i++) stripes += `<rect x="58" y="${y}" width="484" height="14" fill="${i % 2 ? '#2F2A25' : '#E4D3B0'}"/>`;
    let folds = ''; for (let i = 0; i < 8; i++) { const x = 186 + i * 29; folds += `<path d="M${x} 250 Q${x + 8} 380 ${x - 2} 500" stroke="#7E1D1C" stroke-width="4" fill="none"/>`; }
    const star = (cx, cy, r, f) => { let p = []; for (let i = 0; i < 16; i++) { const rr = i % 2 ? r * .55 : r, a = (i * 22.5 - 90) * Math.PI / 180; p.push((cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1)); } return `<path d="M${p.join(' L')}Z" fill="${f}" ${sw.replace('5', '3')}/>`; };
    const peep = (x) => `<circle cx="${x}" cy="330" r="34" fill="#C98A3C" ${sw}/><circle cx="${x}" cy="330" r="20" fill="#1B1612" ${sw.replace('5', '3')}/><circle cx="${x - 7}" cy="323" r="5" fill="#FFF6E3"/>`;
    return `<svg viewBox="0 0 600 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="صندوق الدنيا">
      <defs>
        <pattern id="tz" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#F3E9D4"/><path d="M10 4l4 4M14 4l-4 4M6 10l4 4M10 10l-4 4M14 10l4 4M18 10l-4 4M10 16l4 4M14 16l-4 4" stroke="#B0302E" stroke-width="2"/></pattern>
        <radialGradient id="glow" cx="50%" cy="55%" r="60%"><stop offset="0" stop-color="#FFE7A0"/><stop offset="1" stop-color="#E07A2E"/></radialGradient>
        <clipPath id="win"><path d="M170 510 L170 330 A130 130 0 0 1 430 330 L430 510 Z"/></clipPath>
      </defs>
      <ellipse cx="300" cy="700" rx="250" ry="14" fill="rgba(43,37,32,.18)"/>
      <path d="M120 560 L88 698 L118 698 L160 560Z M480 560 L512 698 L482 698 L440 560Z" fill="#6B4428" ${sw}/>
      <rect x="140" y="610" width="320" height="16" fill="#8A5A33" ${sw}/>
      <circle cx="300" cy="48" r="14" fill="#D9A43A" ${sw}/><path d="M300 62 L300 70" ${sw}/>
      ${merlons}${stripes}<rect x="58" y="112" width="484" height="56" fill="none" ${sw}/>
      <rect x="58" y="166" width="484" height="404" rx="6" fill="#8A5A33" ${sw}/>
      <rect x="80" y="186" width="440" height="364" rx="4" fill="url(#tz)" ${sw.replace('5', '3')}/>
      <rect x="100" y="206" width="400" height="324" rx="4" fill="#6B4428" ${sw.replace('5', '3')}/>
      <path d="M152 516 L152 330 A148 148 0 0 1 448 330 L448 516 Z" fill="#D9A43A" ${sw}/>
      <g clip-path="url(#win)">
        <rect x="160" y="190" width="280" height="330" fill="url(#glow)"/>
        <g class="cur-l"><path d="M160 190 L300 190 L300 510 Q250 470 160 510Z" fill="#B0302E"/>${folds}</g>
        <path d="M300 190 L440 190 L440 510 Q350 470 300 510Z" fill="#9B2523"/>
        ${[318, 346, 374, 402, 430].map((x) => `<path d="M${x} 250 Q${x - 8} 380 ${x + 2} 500" stroke="#7E1D1C" stroke-width="4" fill="none"/>`).join('')}
        <path d="M296 200 L304 200 L306 510 L294 510Z" fill="#FFE7A0" opacity=".9"/>
        <path d="M160 190 L440 190 L440 238 Q300 270 160 238Z" fill="#8E2321"/>
        <path d="M160 238 Q300 270 440 238" stroke="#D9A43A" stroke-width="8" fill="none" stroke-dasharray="2 10" stroke-linecap="round"/>
      </g>
      <path d="M170 510 L170 330 A130 130 0 0 1 430 330 L430 510 Z" fill="none" ${sw}/>
      ${peep(124)}${peep(476)}
      ${star(124, 450, 22, '#1F4E8C')}${star(476, 450, 22, '#1F4E8C')}
      <rect x="196" y="524" width="208" height="40" rx="8" fill="#F3E9D4" ${sw.replace('5', '4')}/>
      <text x="300" y="552" text-anchor="middle" font-family="Aref Ruqaa, serif" font-weight="700" font-size="26" fill="#B0302E">تعا تفرّج</text>
    </svg>`;
  }

  // ---------- attract ----------
  const CALLS = [
    ['تعا تفرّج يا سلام! الدنيا كلها بهالصندوق', 'Come and see! The whole Levant fits in this box.'],
    ['٣ كنوز مخبّاية، ٤٠ ثانية، وليرات بجيبتك', '3 hidden treasures. 40 seconds. Lira in your pocket.'],
    ['كمّل بلاطتك الشامية واربح الجايزة الكبيرة', 'Complete your Damascene tile, win the big prize.'],
    ['في فنجان ذهبي مخبّى… مين بيلاقيه؟', 'A golden finjan is hiding somewhere. Who will find it?'],
    ['أهلين وسهلين! أول قطعة من البلاطة علينا', 'Ahlain! The first piece of your tile is on us.']
  ];
  let callI = 0;
  function rotateCall() {
    const el = $('#call'), [a, e] = CALLS[callI++ % CALLS.length];
    el.innerHTML = `${a}<small lang="en" dir="ltr">${e}</small>`;
    el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap');
  }
  function renderAttract() {
    $('#boxArt').innerHTML = MAN['box'] ? '<img src="assets/box.png" alt="صندوق الدنيا" draggable="false">' : boxSVG();
    const hk = $('.hak'); if (hk) hk.remove();
    if (MAN['hakawati']) $('#peekBtn').insertAdjacentHTML('beforeend', '<img class="hak" src="assets/hakawati.png" alt="" draggable="false">');
    $('.gc-ic').innerHTML = art('golden');
    $('#goalArt').innerHTML = tileSVG(null, true);
    renderBoard(); tickGold();
  }
  function renderBoard() {
    const b = board().slice(0, 5), sn = SHIFT_NAME[cfg.shift] || ['', cfg.shift];
    $('#shiftLabel').textContent = sn[1];
    $('#board').innerHTML = b.length ? b.map((r, i) => `<li><span class="rk">${AR(i + 1)}</span><span class="fl">${art(S.COUNTRIES[r.c].emblem)}</span><span class="nm" dir="auto">${esc(r.n)}</span><span class="tm" dir="ltr">${r.t.toFixed(1)}s</span></li>`).join('')
      : `<li class="empty">لسّا ما حدا · <span lang="en" dir="ltr">Be the first!</span></li>`;
  }
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function tickGold() {
    const g = golden(), card = $('#goldCard');
    card.classList.toggle('live', g.on);
    if (g.on) {
      $('#gcTitle').textContent = 'الساعة الذهبية شغّالة!'; $('#gcSub').textContent = 'Golden hour is ON · double lira';
      $('#gcTime').textContent = mmss(g.left); $('#gcNote').textContent = 'كل الليرات ×٢ والفنجان الذهبي أقرب · All lira ×2';
    } else if (g.next != null) {
      $('#gcTitle').textContent = 'الساعة الذهبية بعد'; $('#gcSub').textContent = 'Golden hour starts in';
      $('#gcTime').textContent = mmss(g.next); $('#gcNote').textContent = 'ارجعلنا وقتها، الليرات دبل · Come back for double lira';
    } else {
      $('#gcTitle').textContent = 'الساعة الذهبية'; $('#gcSub').textContent = 'Golden hour';
      $('#gcTime').textContent = '--:--'; $('#gcNote').textContent = 'بتعلن عنها الحكواتية · Announced live at the booth';
    }
  }
  setInterval(() => { if (screen === 'attract') tickGold(); }, 1000);
  setInterval(() => { if (screen === 'attract') rotateCall(); }, 5200);
  $('#peekBtn').addEventListener('click', () => { sfx.init(); sfx.tap(); show('pick'); });

  // ---------- pick ----------
  function renderDoors() {
    $('#doors').innerHTML = ORDER.map((c) => {
      const C = S.COUNTRIES[c];
      return `<button class="door" data-c="${c}" style="--c:${C.color}"><span class="emb">${art(C.emblem)}</span><b>${C.ar}</b><small lang="en" dir="ltr">${C.en}</small><span class="pl">${C.place_ar}</span></button>`;
    }).join('');
  }
  $('#doors').addEventListener('click', (e) => { const d = e.target.closest('.door'); if (d) { sfx.tap(); startRound(d.dataset.c); } });
  $('#pickBack').addEventListener('click', () => show('attract'));

  // ---------- play ----------
  let R = null; // current round
  const rand = (a, b) => a + Math.random() * (b - a);
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; };

  function startRound(c) {
    const C = S.COUNTRIES[c], g = golden();
    const own = S.ITEMS.filter((i) => i.c === c);
    const targets = shuffle(own.slice()).slice(0, 3);
    const hasGold = Math.random() * 100 < (g.on ? Math.max(50, cfg.goldenChance) : cfg.goldenChance);
    R = { c, targets: targets.map((t) => t.id), found: [], hasGold, gotGold: false, gh: g.on, t0: 0, used: 0, over: false, lastFind: 0, hinted: false, penalty: 0, el: {} };
    $('#placeAr').textContent = C.place_ar; $('#placeEn').textContent = C.place_en;
    $('#goldFlag').hidden = !g.on;
    // scene
    const sc = $('#scene');
    if (MAN['scene-' + c]) { sc.className = 'scene img'; sc.style.backgroundImage = `url(assets/scenes/${c}.jpg)`; sc.innerHTML = ''; }
    else { sc.className = 'scene'; sc.style.backgroundImage = ''; sc.innerHTML = S.sceneSVG(c); }
    // tray
    $('#tray').innerHTML = targets.map((t) => `<div class="tg" data-id="${t.id}"><span class="ic">${art(t.id)}</span><span class="tx"><b>${t.ar}</b><small lang="en" dir="ltr">${t.en}</small></span></div>`).join('') +
      (hasGold ? `<div class="tg gold" data-id="golden"><span class="ic">${art('golden')}</span></div>` : '');
    $('#items').innerHTML = ''; $('#banner').hidden = true; $('#fact').classList.remove('show');
    $('#timerNum').textContent = AR(cfg.roundSec); $('#timer').classList.remove('low'); $('#timerRing').style.strokeDashoffset = 0;
    const sw = $('.stage-wrap'); sw.classList.remove('open');
    show('play');
    requestAnimationFrame(() => requestAnimationFrame(() => { layout(); openCurtains(); }));
  }

  function layout() {
    const st = $('#stage').getBoundingClientRect(), W = st.width, H = st.height;
    const base = Math.max(56, Math.min(140, Math.min(W, H) * 0.17, Math.sqrt(W * H) * 0.12));
    const n = Math.max(12, Math.min(22, Math.round((W * H) / (base * base * 2.6))));
    const placed = [];
    const m = base * 0.6;
    function spot(minD, size) {
      for (let tries = 0, d = minD; tries < 400; tries++) {
        if (tries && tries % 80 === 0) d *= 0.85;
        const x = rand(m, W - m), y = rand(m, H - m);
        if (placed.every((p) => Math.hypot(p.x - x, p.y - y) > d * (size + p.s) / 2 / base * 1.0)) return { x, y };
      }
      return { x: rand(m, W - m), y: rand(m, H - m) };
    }
    const list = [];
    R.targets.forEach((id) => list.push({ id, kind: 't', s: base * rand(0.95, 1.1) }));
    if (R.hasGold) list.push({ id: 'golden', kind: 'g', s: base * 0.78 });
    const pool = shuffle(S.ITEMS.filter((i) => i.c !== 'gold' && !R.targets.includes(i.id)).map((i) => i.id));
    let k = 0; const counts = {};
    while (list.length < n) { const id = pool[k++ % pool.length]; counts[id] = (counts[id] || 0) + 1; if (counts[id] > 2) continue; list.push({ id, kind: 'd', s: base * rand(0.82, 1.12) }); }
    const frag = document.createDocumentFragment();
    list.forEach((it, i) => {
      const pos = spot(it.kind === 'd' ? base * 0.78 : base * 1.05, it.s);
      placed.push({ x: pos.x, y: pos.y, s: it.s });
      const b = document.createElement('button');
      b.className = 'it'; b.dataset.id = it.id; b.dataset.k = it.kind;
      b.setAttribute('aria-label', byId[it.id].ar + ' · ' + byId[it.id].en);
      b.style.setProperty('--x', (pos.x / W * 100).toFixed(2) + '%');
      b.style.setProperty('--y', (pos.y / H * 100).toFixed(2) + '%');
      b.style.setProperty('--s', Math.round(it.s) + 'px');
      b.style.setProperty('--r', Math.round(rand(-22, 22)) + 'deg');
      b.style.zIndex = it.kind === 'd' ? 1 + (i % 3) : 2;
      b.innerHTML = art(it.id);
      frag.appendChild(b);
      if (it.kind !== 'd') R.el[it.id] = b;
    });
    $('#items').appendChild(frag);
  }

  function openCurtains() {
    sfx.curtain();
    setTimeout(() => $('.stage-wrap').classList.add('open'), 150);
    if (R.hasGold) setTimeout(() => banner(`✦ الفنجان الذهبي مخبّى هون! <small lang="en" dir="ltr">Golden finjan inside · +${cfg.pay.golden}</small>`, 3200), 700);
    let n = 3; const cEl = $('#count');
    const step = () => {
      if (n > 0) { cEl.innerHTML = `<b>${AR(n)}</b>`; sfx.count(n); n--; setTimeout(step, 650); }
      else { cEl.innerHTML = `<b>يلّا!</b>`; sfx.count(0); setTimeout(() => (cEl.innerHTML = ''), 650); begin(); }
    };
    setTimeout(step, 900);
  }
  function banner(html, ms) { const b = $('#banner'); b.innerHTML = html; b.hidden = false; clearTimeout(banner.t); banner.t = setTimeout(() => (b.hidden = true), ms); }

  let raf = 0;
  function begin() { R.t0 = performance.now(); R.lastFind = R.t0; raf = requestAnimationFrame(tick); }
  function tick(now) {
    if (!R || R.over) return;
    const D = cfg.roundSec, el = (now - R.t0) / 1000 + R.penalty, rem = Math.max(0, D - el);
    $('#timerNum').textContent = AR(Math.ceil(rem));
    $('#timerRing').style.strokeDashoffset = (119.4 * (1 - rem / D)).toFixed(1);
    $('#timer').classList.toggle('low', rem <= 10);
    if (!R.hinted && now - R.lastFind > 13000) {
      const id = R.targets.find((t) => !R.found.includes(t));
      if (id) { R.el[id].classList.add('hint'); R.hinted = true; }
    }
    if (rem <= 0) return end();
    raf = requestAnimationFrame(tick);
  }

  $('#items').addEventListener('pointerdown', (e) => {
    const b = e.target.closest('.it'); if (!b || !R || R.over || !R.t0) return;
    e.preventDefault();
    const id = b.dataset.id, k = b.dataset.k;
    if (k === 't' && !R.found.includes(id)) return found(b, id);
    if (k === 'g' && !R.gotGold) return gotGold(b);
    if (k === 'd') {
      b.classList.remove('wig'); void b.offsetWidth; b.classList.add('wig');
      sfx.wrong(); R.penalty += cfg.penalty;
      tip(b, byId[id]);
      if (cfg.penalty) minus(b);
    }
  });

  function centerOf(el) { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
  function fly(b, toEl) {
    const a = centerOf(b), t = centerOf(toEl);
    b.style.setProperty('--fx', (t.x - a.x) + 'px'); b.style.setProperty('--fy', (t.y - a.y) + 'px');
    const st = $('#stage').getBoundingClientRect(), bu = document.createElement('i');
    bu.className = 'burst'; bu.style.left = (a.x - st.left) + 'px'; bu.style.top = (a.y - st.top) + 'px';
    $('#items').appendChild(bu); setTimeout(() => bu.remove(), 700);
    b.classList.remove('hint'); b.classList.add('got');
  }
  function found(b, id) {
    R.found.push(id); R.lastFind = performance.now(); R.hinted = false;
    const card = $(`.tg[data-id="${id}"]`);
    fly(b, card.querySelector('.ic'));
    sfx.found(R.found.length - 1);
    setTimeout(() => card.classList.add('done'), 420);
    fact(byId[id]);
    if (R.found.length === 3) setTimeout(end, 900);
  }
  function gotGold(b) {
    R.gotGold = true; const card = $('.tg.gold');
    fly(b, card.querySelector('.ic')); sfx.golden();
    setTimeout(() => card.classList.add('done'), 420);
    banner(`✦ لقيت الفنجان الذهبي! <small lang="en" dir="ltr">+${cfg.pay.golden} lira</small>`, 2400);
  }
  function fact(it) {
    const f = $('#fact');
    f.innerHTML = `<span class="ic">${art(it.id)}</span><div><b>${it.ar}</b><span class="tr" lang="en" dir="ltr">${it.tr} · ${it.en}</span><p>${it.fact_ar}</p><p lang="en" dir="ltr">${it.fact_en}</p></div>`;
    f.classList.add('show'); clearTimeout(fact.t); fact.t = setTimeout(() => f.classList.remove('show'), 2800);
  }
  function tip(b, it) {
    const st = $('#stage').getBoundingClientRect(), a = centerOf(b), t = document.createElement('span');
    t.className = 'tip'; t.innerHTML = `${it.ar} <small lang="en" dir="ltr">${it.en}</small>`;
    t.style.left = Math.min(Math.max(a.x - st.left, 70), st.width - 70) + 'px'; t.style.top = (a.y - st.top - b.offsetHeight * 0.3) + 'px';
    $('#items').appendChild(t); setTimeout(() => t.remove(), 1400);
  }
  function minus(b) {
    const st = $('#stage').getBoundingClientRect(), a = centerOf(b), m = document.createElement('span');
    m.className = 'minus'; m.textContent = '-' + cfg.penalty + 's'; m.style.left = (a.x - st.left + 20) + 'px'; m.style.top = (a.y - st.top) + 'px';
    $('#items').appendChild(m); setTimeout(() => m.remove(), 900);
  }

  // ---------- result ----------
  function end() {
    if (!R || R.over) return;
    R.over = true; cancelAnimationFrame(raf);
    R.used = Math.min(cfg.roundSec, (performance.now() - R.t0) / 1000 + R.penalty);
    setTimeout(showResult, 650);
  }
  function showResult() {
    const P = cfg.pay, n = R.found.length, perfect = n === 3, C = S.COUNTRIES[R.c];
    const lines = []; let sum = 0;
    if (perfect) { lines.push(['لقيت الكنوز الثلاثة', 'All 3 found', P.perfect]); sum += P.perfect; }
    else if (n > 0) { lines.push([`لقيت ${AR(n)} من ٣`, `Found ${n} of 3`, P.partial]); sum += P.partial; }
    if (perfect && R.used < P.speedUnder) { lines.push([`أسرع من ${AR(P.speedUnder)} ثانية`, `Under ${P.speedUnder}s`, P.speed]); sum += P.speed; }
    if (R.gotGold) { lines.push(['الفنجان الذهبي', 'Golden finjan', P.golden]); sum += P.golden; }
    let total = sum;
    if (R.gh && sum > 0) { total = sum * P.mult; }
    const st = stats(); st.peeks++; st.lira += total; if (R.gotGold) st.golden++; if (perfect) st.perfect++;

    $('#resTitle').textContent = perfect ? 'يا سلام عليك!' : n ? 'قرّبت كتير!' : 'ولا يهمّك!';
    $('#resSub').textContent = perfect ? `Ya salaam! Sharp eyes: ${R.used.toFixed(1)} seconds.` : n ? 'So close! Come back for another peek.' : 'No worries. The box will wait for you.';
    $('#payAr').textContent = AR(total); $('#payEn').textContent = total + ' LIRA';
    $('#noteBig').classList.toggle('zero', total === 0);
    $('#payLines').innerHTML = lines.map(([a, e, v], i) => `<li style="animation-delay:${i * .15}s"><span>${a}<small lang="en" dir="ltr">${e}</small></span><span class="v" dir="ltr">+${v}</span></li>`).join('') +
      (R.gh && sum > 0 ? `<li class="x2" style="animation-delay:${lines.length * .15}s"><span>الساعة الذهبية<small lang="en" dir="ltr">Golden hour</small></span><span class="v" dir="ltr">×${P.mult}</span></li>` : '') +
      (!lines.length ? `<li><span>ارجع جرّب كمان مرة<small lang="en" dir="ltr">Try again later</small></span><span class="v">0</span></li>` : '');
    $('#stampArt').innerHTML = tileSVG(perfect ? R.c : null);
    $('#stampMsg').innerHTML = perfect
      ? `اختموا قطعة ${C.ar} على بطاقة البلاطة<small lang="en" dir="ltr">Stamp the ${C.en} piece on the Tile Card</small>`
      : `قطعة ${C.ar} بتستناك، ارجعلنا بعد شوي<small lang="en" dir="ltr">The ${C.en} piece is waiting. Come back soon!</small>`;
    // leaderboard
    const f = $('#nameForm'); f.hidden = true; R.rec = null;
    if (perfect) {
      const rec = { n: 'ضيف', t: Math.round(R.used * 10) / 10, c: R.c, at: Date.now() };
      const b = board(); b.push(rec); b.sort((x, y) => x.t - y.t); b.length = Math.min(b.length, 30);
      const rank = b.indexOf(rec);
      if (rank > -1 && rank < 5) { R.rec = rec; f.hidden = false; $('#rankMsg').textContent = `دخلت لوحة أحدّ عيون! المركز ${AR(rank + 1)}`; $('#nameIn').value = ''; }
    }
    save();
    show('result');
    if (perfect) { sfx.win(); confetti(R.gotGold || R.gh); } else sfx.lose();
  }
  $('#nameForm').addEventListener('submit', (e) => {
    e.preventDefault(); const v = $('#nameIn').value.trim();
    if (R && R.rec && v) { R.rec.n = v.slice(0, 14); save(); }
    $('#nameIn').blur(); $('#nameForm').hidden = true; sfx.tap();
  });
  function finishResult() { $('#confetti').innerHTML = ''; R = null; renderBoard(); tickGold(); show('attract'); }
  $('#doneBtn').addEventListener('click', () => { const v = $('#nameIn').value.trim(); if (R && R.rec && v) { R.rec.n = v.slice(0, 14); save(); } finishResult(); });

  function tileSVG(hi, all) {
    const k = '#2B2520', q = { sy: [100, 0], lb: [0, 0], ps: [100, 100], jo: [0, 100] };
    let o = `<svg viewBox="-6 -6 212 212" xmlns="http://www.w3.org/2000/svg">`;
    ORDER.forEach((c) => {
      const [x, y] = q[c], C = S.COUNTRIES[c], on = c === hi || all;
      o += `<rect x="${x}" y="${y}" width="100" height="100" fill="${on ? C.color : '#F3E9D4'}" stroke="${k}" stroke-width="4"/>`;
      o += `<g transform="translate(${x + (x ? 46 : 14)} ${y + (y ? 46 : 14)}) scale(.4)" opacity="${on ? 1 : .35}"><rect width="100" height="100" rx="50" fill="#FFF6E3"/>${S.SVG[C.emblem]}</g>`;
      if (on && !all) o += `<circle cx="${x + 50}" cy="${y + 50}" r="44" fill="none" stroke="#FFF6E3" stroke-width="3" stroke-dasharray="6 6"><animateTransform attributeName="transform" type="rotate" from="0 ${x + 50} ${y + 50}" to="360 ${x + 50} ${y + 50}" dur="8s" repeatCount="indefinite"/></circle>`;
    });
    let p = []; for (let i = 0; i < 16; i++) { const r = i % 2 ? 18 : 32, a = (i * 22.5 - 90) * Math.PI / 180; p.push((100 + Math.cos(a) * r).toFixed(1) + ' ' + (100 + Math.sin(a) * r).toFixed(1)); }
    o += `<path d="M${p.join(' L')}Z" fill="#D9A43A" stroke="${k}" stroke-width="4"/><circle cx="100" cy="100" r="9" fill="#B0302E" stroke="${k}" stroke-width="3"/></svg>`;
    return o;
  }
  function confetti(gold) {
    const box = $('#confetti'); box.innerHTML = '';
    const cols = gold ? ['#F2C94C', '#D9A43A', '#FFFDF7'] : ['#FFFDF7', '#FFFDF7', '#B0302E', '#F2C94C'];
    for (let i = 0; i < 46; i++) {
      const d = document.createElement('i'), w = rand(18, 34), col = cols[i % cols.length];
      d.className = 'petal';
      d.style.cssText = `left:${rand(0, 100)}%;--w:${w}px;--d:${rand(2.6, 4.6)}s;--dl:${rand(0, 1.2)}s;--dx:${rand(-80, 80)}px;--sp:${rand(1.5, 3.5)}s`;
      d.innerHTML = `<svg viewBox="0 0 40 40">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="20" cy="10" rx="6" ry="9" fill="${col}" stroke="#2B2520" stroke-width="1.5" transform="rotate(${a} 20 20)"/>`).join('')}<circle cx="20" cy="20" r="4" fill="#F2C43D"/></svg>`;
      box.appendChild(d);
    }
    setTimeout(() => (box.innerHTML = ''), 6500);
  }

  // ---------- staff panel ----------
  let pin = '', pressT = 0;
  const seal = $('#staffSeal');
  seal.addEventListener('pointerdown', () => { pressT = setTimeout(openStaff, 1200); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => seal.addEventListener(ev, () => clearTimeout(pressT)));
  document.addEventListener('keydown', (e) => { if (e.key === 'S' && e.shiftKey && e.ctrlKey) openStaff(); });
  function openStaff() {
    pin = ''; dots(); $('#pinView').hidden = false; $('#staffView').hidden = true; $('#staff').hidden = false;
  }
  $('#pinpad').innerHTML = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].map((d) => `<button data-d="${d}">${d}</button>`).join('');
  $('#pinpad').addEventListener('click', (e) => {
    const d = e.target.dataset.d; if (d == null) return;
    if (d === 'C') pin = ''; else if (d === '✓') checkPin(); else if (pin.length < 4) { pin += d; if (pin.length === 4) setTimeout(checkPin, 120); }
    dots();
  });
  function dots() { document.querySelectorAll('#pinDots i').forEach((i, k) => i.classList.toggle('f', k < pin.length)); }
  function checkPin() {
    if (pin === cfg.pin) { $('#pinView').hidden = true; renderStaff(); $('#staffView').hidden = false; }
    else { const d = $('#pinDots'); d.classList.remove('bad'); void d.offsetWidth; d.classList.add('bad'); pin = ''; dots(); }
  }
  $('#staff').addEventListener('click', (e) => { if (e.target.matches('[data-close]') || e.target.id === 'staff') closeStaff(); });
  function closeStaff() { $('#staff').hidden = true; save(); renderAttract(); }
  function renderStaff() {
    const st = stats(), g = golden(), P = cfg.pay;
    const num = (k, v, lbl, path) => `<div class="row"><label for="f_${k}">${lbl}</label><input type="number" id="f_${k}" data-path="${path || k}" value="${v}" min="0" inputmode="numeric"></div>`;
    $('#staffView').innerHTML = `<div class="sv">
      <h3>لوحة الفريق <small lang="en" dir="ltr">Staff panel</small></h3>
      <fieldset><legend>الفترة · Shift</legend>
        <div class="row"><div class="seg" id="segShift"><button data-v="girls" class="${cfg.shift === 'girls' ? 'on' : ''}">بنات · Girls</button><button data-v="boys" class="${cfg.shift === 'boys' ? 'on' : ''}">شباب · Boys</button></div>
        <button class="btn red" id="clrBoard">امسح اللوحة · Clear board</button></div>
        <div class="stats"><div><b>${st.peeks}</b><span>Peeks</span></div><div><b>${st.perfect}</b><span>3/3 wins</span></div><div><b>${st.golden}</b><span>Golden</span></div><div><b>${st.lira}</b><span>Lira paid</span></div></div>
        <p class="hint">Each shift keeps its own leaderboard and totals. "Lira paid" is what the screen told you to pay out.</p>
      </fieldset>
      <fieldset><legend>الساعة الذهبية · Golden hour</legend>
        <div class="row"><span>${g.on ? 'ON now · ' + mmss(g.left) + ' left' : 'Off · next in ' + (g.next != null ? mmss(g.next) : '—')}</span>
          ${g.on && cfg.ghManualUntil > Date.now() ? '<button class="btn" id="ghStop">Stop</button>' : '<button class="btn gold" id="ghNow">Start now (5 min)</button>'}</div>
        <div class="row"><label><input type="checkbox" id="ghAuto" ${cfg.ghAuto ? 'checked' : ''}> Automatic schedule</label></div>
        ${num('ghEvery', cfg.ghEvery, 'Every (minutes)')}${num('ghLen', cfg.ghLen, 'Lasts (minutes)')}
      </fieldset>
      <fieldset><legend>الجولة · Round</legend>
        ${num('roundSec', cfg.roundSec, 'Round length (seconds)')}${num('penalty', cfg.penalty, 'Wrong tap costs (seconds)')}${num('goldenChance', cfg.goldenChance, 'Golden finjan chance % (50% in golden hour)')}
      </fieldset>
      <fieldset><legend>الليرات · Payouts</legend>
        ${num('p_perfect', P.perfect, 'All 3 found', 'pay.perfect')}${num('p_partial', P.partial, 'Found 1 or 2', 'pay.partial')}
        ${num('p_speed', P.speed, 'Speed bonus', 'pay.speed')}${num('p_under', P.speedUnder, 'Speed bonus if under (s)', 'pay.speedUnder')}
        ${num('p_golden', P.golden, 'Golden finjan', 'pay.golden')}${num('p_mult', P.mult, 'Golden hour multiplier', 'pay.mult')}
      </fieldset>
      <fieldset><legend>الجهاز · Device</legend>
        <div class="row"><label><input type="checkbox" id="snd" ${cfg.sound ? 'checked' : ''}> Sound</label><button class="btn" id="fs">Fullscreen</button></div>
        <div class="row"><label for="f_pin">Staff PIN (4 digits)</label><input type="text" id="f_pin" maxlength="4" inputmode="numeric" value="${cfg.pin}"></div>
      </fieldset>
      <button class="btn dark" data-close>حفظ وإغلاق · Save &amp; close</button>
    </div>`;
    const sv = $('#staffView');
    sv.querySelectorAll('input[type=number]').forEach((inp) => inp.addEventListener('change', () => {
      const v = Math.max(0, Number(inp.value) || 0), path = inp.dataset.path.split('.');
      if (path.length === 2) cfg.pay[path[1]] = v; else cfg[path[0]] = v;
      if (cfg.ghEvery < 1) cfg.ghEvery = 1; if (cfg.ghLen >= cfg.ghEvery) cfg.ghLen = Math.max(1, cfg.ghEvery - 1); if (cfg.roundSec < 10) cfg.roundSec = 10; if (cfg.pay.mult < 1) cfg.pay.mult = 1;
      save();
    }));
    sv.querySelector('#segShift').addEventListener('click', (e) => { const v = e.target.dataset.v; if (v) { cfg.shift = v; save(); renderStaff(); } });
    sv.querySelector('#clrBoard').addEventListener('click', () => { if (confirmTwice(sv.querySelector('#clrBoard'))) { DB.boards[cfg.shift] = []; DB.stats[cfg.shift] = { peeks: 0, lira: 0, golden: 0, perfect: 0 }; save(); renderStaff(); } });
    const now = sv.querySelector('#ghNow'), stop = sv.querySelector('#ghStop');
    if (now) now.addEventListener('click', () => { cfg.ghManualUntil = Date.now() + 5 * 60000; save(); renderStaff(); });
    if (stop) stop.addEventListener('click', () => { cfg.ghManualUntil = 0; save(); renderStaff(); });
    sv.querySelector('#ghAuto').addEventListener('change', (e) => { cfg.ghAuto = e.target.checked; save(); renderStaff(); });
    sv.querySelector('#snd').addEventListener('change', (e) => { cfg.sound = sfx.on = e.target.checked; save(); });
    sv.querySelector('#fs').addEventListener('click', () => { const d = document.documentElement; (d.requestFullscreen || d.webkitRequestFullscreen || (() => { })).call(d); });
    sv.querySelector('#f_pin').addEventListener('change', (e) => { const v = e.target.value.replace(/\D/g, ''); if (v.length === 4) { cfg.pin = v; save(); } else e.target.value = cfg.pin; });
  }
  function confirmTwice(btn) {
    if (btn.dataset.armed) return true;
    btn.dataset.armed = '1'; const t = btn.textContent; btn.textContent = 'اضغط كمان مرة للتأكيد · Tap again to confirm';
    setTimeout(() => { if (btn.isConnected) { btn.textContent = t; delete btn.dataset.armed; } }, 3000);
    return false;
  }

  // block pinch / double-tap zoom and the context menu on long press
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  document.addEventListener('contextmenu', (e) => { if (!e.target.closest('input')) e.preventDefault(); });
  let lastTouch = 0;
  document.addEventListener('touchend', (e) => { const n = Date.now(); if (n - lastTouch < 350 && !e.target.closest('input,button')) e.preventDefault(); lastTouch = n; }, { passive: false });

  // relayout if the screen rotates mid-round: positions are in %, only sizes need nothing
  renderAttract(); renderDoors(); rotateCall();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { $('#boxArt').innerHTML = MAN['box'] ? $('#boxArt').innerHTML : boxSVG(); });

  // test hook (used by the automated check, harmless at the booth)
  window.__sandouq = { startRound, get R() { return R; }, cfg, show };
})();
