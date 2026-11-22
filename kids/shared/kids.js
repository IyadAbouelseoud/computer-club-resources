/* Computer Club x Volunteer Club — kids games shared helpers.
   Art (inline SVG, replaceable by PNGs in ../assets), sound (WebAudio), read-aloud, confetti, storage. */
(function (g) {
  'use strict';
  const INK = '#2a1745', GOLD = '#ffc247', GOLD2 = '#ff9f1c', TEAL = '#19d3c5', INDIGO = '#3b2f8f', CORAL = '#ff6b6b',
        SKIN = '#f4b183', CREAM = '#fff4d6', SAND = '#f6e3b4', MAG = '#ff3df2', CYAN = '#22e6ff';
  const S = 'stroke="' + INK + '" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"';
  const S3 = 'stroke="' + INK + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';

  /* ---------- tiny helpers ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  function h(tag, attrs, kids) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) e.setAttribute(k, v);
    }
    (kids || []).forEach(c => {
      if (typeof c === 'string' && c.indexOf('<span class="art') === 0) { const t = document.createElement('template'); t.innerHTML = c; e.append(t.content); }
      else e.append(c && c.nodeType ? c : document.createTextNode(c == null ? '' : c));
    });
    return e;
  }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const store = {
    get(k, d) { try { const v = localStorage.getItem('kidsclub:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('kidsclub:' + k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };
  const wait = ms => new Promise(r => setTimeout(r, ms));

  /* ---------- ART (inline SVG; swapped for PNG if present in assets/manifest.json) ---------- */
  function eyes(cx1, cx2, cy, mood) {
    const px = mood === 'sly' ? 3 : mood === 'oops' ? 0 : 0, py = mood === 'sad' ? 2 : 0;
    const r = mood === 'oops' ? 13 : 11;
    return '<circle cx="' + cx1 + '" cy="' + cy + '" r="' + r + '" fill="#fff" ' + S3 + '/><circle cx="' + cx2 + '" cy="' + cy + '" r="' + r + '" fill="#fff" ' + S3 + '/>' +
      '<circle cx="' + (cx1 + px) + '" cy="' + (cy + py) + '" r="' + (mood === 'oops' ? 4 : 5.5) + '" fill="' + INK + '"/><circle cx="' + (cx2 + px) + '" cy="' + (cy + py) + '" r="' + (mood === 'oops' ? 4 : 5.5) + '" fill="' + INK + '"/>' +
      '<circle cx="' + (cx1 + px + 2) + '" cy="' + (cy + py - 2) + '" r="1.8" fill="#fff"/><circle cx="' + (cx2 + px + 2) + '" cy="' + (cy + py - 2) + '" r="1.8" fill="#fff"/>';
  }
  const ART = {
    /* Ali Baba — goofy, harmless trickster. moods: sly | laugh | oops | sad | happy */
    ali(mood) {
      mood = mood || 'sly';
      let brows, mouth, extra = '';
      if (mood === 'sly') {
        brows = '<path d="M74 90 L102 98" ' + S + ' fill="none"/><path d="M122 96 L148 84" ' + S + ' fill="none"/>';
        mouth = '<path d="M92 150 q20 14 40 -6" fill="none" ' + S + '/><path d="M128 146 l6 -5" ' + S3 + ' fill="none"/>';
      } else if (mood === 'laugh') {
        brows = '<path d="M74 92 q14 -10 28 0" ' + S + ' fill="none"/><path d="M122 92 q14 -10 28 0" ' + S + ' fill="none"/>';
        mouth = '<path d="M92 142 q20 34 40 0 z" fill="#7a1f2b" ' + S3 + '/><path d="M100 156 q12 8 24 0" fill="#ff8da1"/>';
      } else if (mood === 'oops') {
        brows = '<path d="M74 84 q14 -12 28 -2" ' + S + ' fill="none"/><path d="M122 82 q14 -10 28 2" ' + S + ' fill="none"/>';
        mouth = '<ellipse cx="112" cy="152" rx="9" ry="11" fill="#7a1f2b" ' + S3 + '/>';
        extra = '<path d="M166 80 q8 14 0 22 q-8 -8 0 -22z" fill="#8fd9ff" ' + S3 + '/>';
      } else if (mood === 'sad') {
        brows = '<path d="M74 94 q14 -4 28 6" ' + S + ' fill="none"/><path d="M122 100 q14 -10 28 -6" ' + S + ' fill="none"/>';
        mouth = '<path d="M94 154 q18 -14 36 0" fill="none" ' + S + '/>';
        extra = '<path d="M84 128 q-6 14 0 20 q6 -6 0 -20z" fill="#8fd9ff" ' + S3 + '/>';
      } else { /* happy */
        brows = '<path d="M74 90 q14 -8 28 0" ' + S + ' fill="none"/><path d="M122 90 q14 -8 28 0" ' + S + ' fill="none"/>';
        mouth = '<path d="M92 144 q20 24 40 0" fill="none" ' + S + '/>';
      }
      return '<svg viewBox="0 0 230 270" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        /* sack */
        '<g transform="translate(172 168) rotate(14)"><path d="M0 0 C-30 6 -40 58 -20 80 C-4 94 32 92 44 72 C58 46 40 6 0 0Z" fill="#b8814a" ' + S + '/><path d="M-14 3 q14 -16 28 0" fill="none" ' + S + '/>' +
        '<circle cx="2" cy="44" r="14" fill="#ffe0fb" ' + S3 + '/><ellipse cx="2" cy="40" rx="4.5" ry="8" fill="' + MAG + '"/><ellipse cx="-5" cy="44" rx="4" ry="7" fill="' + MAG + '" transform="rotate(-40 -5 44)"/><ellipse cx="9" cy="44" rx="4" ry="7" fill="' + MAG + '" transform="rotate(40 9 44)"/></g>' +
        /* robe */
        '<path d="M44 270 C40 200 70 172 112 172 C154 172 184 200 180 270Z" fill="' + INDIGO + '" ' + S + '/>' +
        '<path d="M64 222 h96 v22 h-96z" fill="' + GOLD + '" ' + S3 + '/><circle cx="112" cy="233" r="8" fill="' + CORAL + '" ' + S3 + '/>' +
        /* head */
        '<ellipse cx="62" cy="116" rx="10" ry="14" fill="' + SKIN + '" ' + S3 + '/><ellipse cx="162" cy="116" rx="10" ry="14" fill="' + SKIN + '" ' + S3 + '/>' +
        '<circle cx="112" cy="114" r="56" fill="' + SKIN + '" ' + S + '/>' +
        '<circle cx="78" cy="136" r="9" fill="#ff9a9a" opacity=".55"/><circle cx="146" cy="136" r="9" fill="#ff9a9a" opacity=".55"/>' +
        /* turban */
        '<path d="M52 98 C48 36 176 36 172 98 C146 76 78 76 52 98Z" fill="' + CREAM + '" ' + S + '/>' +
        '<path d="M62 84 C88 62 136 62 162 84" fill="none" stroke="#d9bd78" stroke-width="3.5"/><path d="M70 70 C96 52 130 52 156 70" fill="none" stroke="#d9bd78" stroke-width="3.5"/>' +
        '<path d="M112 38 q-6 -24 12 -34 q-2 22 -6 34" fill="' + TEAL + '" ' + S3 + '/>' +
        '<circle cx="112" cy="70" r="11" fill="' + CORAL + '" ' + S3 + '/><circle cx="109" cy="67" r="3" fill="#fff" opacity=".8"/>' +
        brows + eyes(88, 136, 112, mood) +
        '<ellipse cx="112" cy="128" rx="8" ry="6" fill="#e39a68" ' + S3 + '/>' +
        /* mustache */
        '<path d="M112 138 C98 126 70 128 62 146 C76 142 94 146 112 148 C130 146 148 142 162 146 C154 128 126 126 112 138Z" fill="#3b2626" ' + S3 + '/>' +
        '<path d="M64 146 q-10 4 -8 -8" fill="none" ' + S3 + '/><path d="M160 146 q10 4 8 -8" fill="none" ' + S3 + '/>' +
        mouth + extra +
        '</svg>';
    },
    /* Child explorer: 'f' girl (scarf) | 'm' boy (cap) */
    hero(g) {
      const girl = g !== 'm';
      return '<svg viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<path d="M30 230 C28 176 56 156 100 156 C144 156 172 176 170 230Z" fill="' + (girl ? '#ff8fb1' : '#4aa8ff') + '" ' + S + '/>' +
        '<path d="M70 168 l30 22 l30 -22" fill="' + CREAM + '" ' + S3 + '/>' +
        (girl ?
          '<path d="M34 120 C30 40 170 40 166 120 C166 168 140 182 100 182 C60 182 34 168 34 120Z" fill="' + TEAL + '" ' + S + '/>' +
          '<ellipse cx="100" cy="116" rx="46" ry="50" fill="' + SKIN + '" ' + S + '/>' +
          '<path d="M52 92 C60 56 140 56 148 92 C132 80 68 80 52 92Z" fill="' + TEAL + '" ' + S3 + '/>' +
          '<circle cx="100" cy="64" r="7" fill="' + GOLD + '" ' + S3 + '/>'
          :
          '<ellipse cx="54" cy="120" rx="9" ry="13" fill="' + SKIN + '" ' + S3 + '/><ellipse cx="146" cy="120" rx="9" ry="13" fill="' + SKIN + '" ' + S3 + '/>' +
          '<circle cx="100" cy="116" r="50" fill="' + SKIN + '" ' + S + '/>' +
          '<path d="M52 96 C52 40 148 40 148 96 C128 82 72 82 52 96Z" fill="#fff" ' + S + '/><path d="M60 84 h80" stroke="' + CORAL + '" stroke-width="7"/><path d="M64 72 h72" stroke="' + TEAL + '" stroke-width="5"/>') +
        eyes(80, 120, 118, 'happy') +
        '<path d="M76 100 q8 -6 16 0" fill="none" ' + S3 + '/><path d="M108 100 q8 -6 16 0" fill="none" ' + S3 + '/>' +
        '<circle cx="68" cy="138" r="8" fill="#ff9a9a" opacity=".55"/><circle cx="132" cy="138" r="8" fill="#ff9a9a" opacity=".55"/>' +
        '<path d="M82 144 q18 20 36 0" fill="' + '#fff' + '" ' + S3 + '/>' +
        '</svg>';
    },
    /* Top-down robot camel (faces UP) */
    camelbot() {
      return '<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<rect x="42" y="92" width="16" height="12" rx="6" fill="#c98a3a" ' + S3 + '/>' +
        '<ellipse cx="22" cy="48" rx="9" ry="14" fill="#c98a3a" ' + S3 + '/><ellipse cx="78" cy="48" rx="9" ry="14" fill="#c98a3a" ' + S3 + '/>' +
        '<ellipse cx="22" cy="80" rx="9" ry="14" fill="#c98a3a" ' + S3 + '/><ellipse cx="78" cy="80" rx="9" ry="14" fill="#c98a3a" ' + S3 + '/>' +
        '<ellipse cx="50" cy="66" rx="26" ry="32" fill="' + GOLD + '" ' + S + '/>' +
        '<circle cx="50" cy="66" r="15" fill="#ffd978" ' + S3 + '/><rect x="43" y="62" width="14" height="8" rx="4" fill="' + CYAN + '" ' + S3 + '/>' +
        '<circle cx="36" cy="26" r="7" fill="#ffd978" ' + S3 + '/><circle cx="64" cy="26" r="7" fill="#ffd978" ' + S3 + '/>' +
        '<ellipse cx="50" cy="28" rx="17" ry="19" fill="#ffe29a" ' + S + '/>' +
        '<rect x="35" y="23" width="30" height="11" rx="5.5" fill="#1b1448" ' + S3 + '/><circle cx="43" cy="28.5" r="3" fill="' + CYAN + '"/><circle cx="57" cy="28.5" r="3" fill="' + CYAN + '"/>' +
        '<ellipse cx="50" cy="14" rx="9" ry="6" fill="#f3c77a" ' + S3 + '/>' +
        '<line x1="50" y1="10" x2="50" y2="3" ' + S3 + '/><circle cx="50" cy="3" r="3.5" fill="' + MAG + '" ' + S3 + '/>' +
        '</svg>';
    },
    chest() {
      return '<svg viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><ellipse cx="50" cy="82" rx="38" ry="7" fill="rgba(0,0,0,.25)"/>' +
        '<path d="M12 40 C12 14 88 14 88 40Z" fill="#c9833b" ' + S + '/><rect x="12" y="38" width="76" height="40" rx="6" fill="#b06a2a" ' + S + '/>' +
        '<rect x="12" y="38" width="76" height="9" fill="' + GOLD + '" ' + S3 + '/><rect x="26" y="16" width="10" height="62" fill="' + GOLD + '" opacity=".95" ' + S3 + '/><rect x="64" y="16" width="10" height="62" fill="' + GOLD + '" ' + S3 + '/>' +
        '<rect x="42" y="42" width="16" height="18" rx="4" fill="' + GOLD2 + '" ' + S3 + '/><circle cx="50" cy="51" r="3" fill="' + INK + '"/>' +
        '<path d="M44 20 l3 -8 l3 8 l3 -8 l3 8" fill="none" stroke="' + CYAN + '" stroke-width="3" stroke-linecap="round"/></svg>';
    },
    gem(c) {
      c = c || TEAL;
      return '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M30 6 L52 24 L30 54 L8 24Z" fill="' + c + '" ' + S + '/><path d="M8 24 H52 M20 24 L30 6 L40 24 L30 54Z" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2.5" stroke-linejoin="round"/><path d="M16 18 l5 -4" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>';
    },
    rock() {
      return '<svg viewBox="0 0 80 70" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8 58 C2 40 14 18 34 14 C52 10 70 24 72 42 C73 52 68 60 60 62 L16 62Z" fill="#9a8cb8" ' + S + '/><path d="M24 30 q8 -10 20 -8" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/><path d="M40 62 l-4 -14 l10 -6" fill="none" stroke="' + INK + '" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/></svg>';
    },
    palm() {
      return '<svg viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M38 86 q-2 -34 4 -50 q4 -2 6 0 q-4 18 -2 50z" fill="#b8814a" ' + S3 + '/><g fill="#38c26b" ' + S3 + '><path d="M42 38 C22 20 8 28 4 38 C20 30 30 32 42 38Z"/><path d="M42 38 C62 20 76 28 78 40 C62 30 52 32 42 38Z"/><path d="M42 36 C34 12 46 4 54 8 C46 14 44 24 42 36Z"/><path d="M42 38 C26 40 14 52 14 60 C26 50 34 46 42 38Z"/><path d="M42 38 C58 40 70 52 70 60 C58 50 50 46 42 38Z"/></g><circle cx="40" cy="42" r="4" fill="#8a5a2a" ' + S3 + '/><circle cx="48" cy="42" r="4" fill="#8a5a2a" ' + S3 + '/></svg>';
    },
    lantern(on) {
      const f = on ? '#ffd24a' : '#5b4f8f';
      return '<svg viewBox="0 0 70 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        (on ? '<circle cx="35" cy="62" r="34" fill="#ffd24a" opacity=".35"/>' : '') +
        '<path d="M35 4 v14" ' + S3 + '/><circle cx="35" cy="6" r="5" fill="none" ' + S3 + '/>' +
        '<path d="M20 22 h30 l-4 -6 h-22z" fill="' + GOLD2 + '" ' + S3 + '/>' +
        '<path d="M18 24 C6 40 6 78 18 92 H52 C64 78 64 40 52 24Z" fill="' + f + '" ' + S + '/>' +
        '<path d="M26 24 C16 44 16 74 26 92 M44 24 C54 44 54 74 44 92 M35 24 V92" fill="none" stroke="' + INK + '" stroke-width="2.5" opacity=".55"/>' +
        '<path d="M16 92 h38 v8 H16z" fill="' + GOLD2 + '" ' + S3 + '/>' +
        (on ? '<ellipse cx="35" cy="58" rx="7" ry="11" fill="#fff6c8"/>' : '') + '</svg>';
    },
    star8(c, o) { /* 8-point arabesque star for patterns */
      return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="' + (c || GOLD) + '" opacity="' + (o == null ? 1 : o) + '"><rect x="18" y="18" width="64" height="64"/><rect x="18" y="18" width="64" height="64" transform="rotate(45 50 50)"/></g></svg>';
    },
    lock() { return '<svg viewBox="0 0 60 70" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M16 30 V20 a14 14 0 0 1 28 0 V30" fill="none" ' + S + '/><rect x="8" y="30" width="44" height="32" rx="8" fill="' + GOLD + '" ' + S + '/><circle cx="30" cy="44" r="5" fill="' + INK + '"/><rect x="28" y="46" width="4" height="9" fill="' + INK + '"/></svg>'; },
    /* six Arabian-desert animal avatars */
    avatar(k) {
      const f = (fill, extra) => '<svg viewBox="0 -12 120 132" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + extra[0] + '<circle cx="60" cy="64" r="40" fill="' + fill + '" ' + S + '/>' + extra[1] + '</svg>';
      const E = '<circle cx="46" cy="58" r="9" fill="#fff" ' + S3 + '/><circle cx="74" cy="58" r="9" fill="#fff" ' + S3 + '/><circle cx="47" cy="59" r="4.5" fill="' + INK + '"/><circle cx="75" cy="59" r="4.5" fill="' + INK + '"/>';
      const M = '<path d="M50 84 q10 8 20 0" fill="none" ' + S3 + '/>';
      switch (k) {
        case 'falcon': return f('#b8844f', ['<path d="M34 30 L28 10 L48 24Z M86 30 L92 10 L72 24Z" fill="#6b4423" ' + S3 + '/>', '<path d="M40 50 q20 -16 40 0" fill="#f4e3c2" ' + S3 + '/>' + E + '<path d="M52 66 L68 66 L60 84Z" fill="' + GOLD + '" ' + S3 + '/>']);
        case 'leopard': return f('#ffb347', ['<circle cx="30" cy="34" r="13" fill="#ffb347" ' + S3 + '/><circle cx="90" cy="34" r="13" fill="#ffb347" ' + S3 + '/><circle cx="30" cy="34" r="6" fill="#6b3a1e"/><circle cx="90" cy="34" r="6" fill="#6b3a1e"/>', '<g fill="#6b3a1e"><circle cx="40" cy="42" r="3"/><circle cx="80" cy="42" r="3"/><circle cx="60" cy="40" r="3"/><circle cx="30" cy="70" r="3"/><circle cx="90" cy="70" r="3"/></g>' + E + '<ellipse cx="60" cy="72" rx="9" ry="6" fill="#ffe3c0" ' + S3 + '/><circle cx="60" cy="70" r="3.5" fill="' + INK + '"/>' + M.replace('y="84"', '') ]);
        case 'oryx': return f('#fff1d6', ['<path d="M44 34 L30 -2 M76 34 L90 -2" ' + S + ' stroke-width="7" fill="none"/>', '<path d="M30 52 q4 -12 14 -12 M90 52 q-4 -12 -14 -12" fill="none" stroke="#5b3a2a" stroke-width="5" stroke-linecap="round"/><ellipse cx="60" cy="76" rx="14" ry="10" fill="#5b3a2a" ' + S3 + '/>' + E + '<circle cx="54" cy="76" r="2.5" fill="#fff"/><circle cx="66" cy="76" r="2.5" fill="#fff"/>']);
        case 'gazelle': return f('#e0a96b', ['<path d="M24 38 L10 20 L36 30Z M96 38 L110 20 L84 30Z" fill="#e0a96b" ' + S3 + '/><path d="M46 28 q-6 -22 6 -26 M74 28 q6 -22 -6 -26" fill="none" ' + S + ' stroke-width="5"/>', '<path d="M60 44 v20" stroke="#fff" stroke-width="7" stroke-linecap="round"/>' + E + '<ellipse cx="60" cy="78" rx="10" ry="7" fill="#fff1d6" ' + S3 + '/><circle cx="60" cy="76" r="3.5" fill="' + INK + '"/>']);
        case 'camel': return f('#e8c07a', ['<circle cx="34" cy="30" r="9" fill="#e8c07a" ' + S3 + '/><circle cx="86" cy="30" r="9" fill="#e8c07a" ' + S3 + '/>', '<path d="M40 42 q20 -10 40 0" fill="#d9a85a" ' + S3 + '/>' + E + '<ellipse cx="60" cy="80" rx="20" ry="14" fill="#f6dba5" ' + S3 + '/><circle cx="52" cy="78" r="2.8" fill="' + INK + '"/><circle cx="68" cy="78" r="2.8" fill="' + INK + '"/><path d="M52 88 q8 5 16 0" fill="none" ' + S3 + '/>']);
        default: return f('#ff8a3d', ['<path d="M24 40 L22 6 L52 26Z M96 40 L98 6 L68 26Z" fill="#ff8a3d" ' + S3 + '/>', '<path d="M30 70 q30 36 60 0 q-30 -10 -60 0Z" fill="#fff" ' + S3 + '/>' + E + '<circle cx="60" cy="72" r="4" fill="' + INK + '"/>' + M]);
      }
    }
  };
  const AVATARS = [['falcon', 'الصقر'], ['leopard', 'النمر'], ['oryx', 'المها'], ['gazelle', 'الغزال'], ['camel', 'الجمل'], ['fox', 'الثعلب']];

  /* ART slot: <span class="art" data-art="ali-sly"> — if assets/manifest.json lists a PNG, it replaces the SVG */
  let MANIFEST = {}, ASSET_BASE = '../assets/';
  function art(name, svg, cls, style) {
    return '<span class="art ' + (cls || '') + '" data-art="' + name + '"' + (style ? ' style="' + style + '"' : '') + '>' + svg + '</span>';
  }
  let LOADED = false;
  function upgradeArt(root) {
    if (!LOADED) return;
    (root || document).querySelectorAll('[data-art]:not([data-up])').forEach(n => {
      n.setAttribute('data-up', '1');
      const f = MANIFEST[n.getAttribute('data-art')];
      if (!f) return;
      const orig = n.innerHTML, im = new Image();
      im.alt = ''; im.draggable = false;
      im.onerror = () => { n.innerHTML = orig; };
      im.src = ASSET_BASE + (typeof f === 'string' ? f : n.getAttribute('data-art') + '.png');
      n.innerHTML = ''; n.append(im);
    });
  }
  function initAssets(base) {
    ASSET_BASE = base || '../assets/';
    return fetch(ASSET_BASE + 'manifest.json', { cache: 'no-cache' }).then(r => r.ok ? r.json() : {}).catch(() => ({})).then(m => {
      MANIFEST = m || {}; LOADED = true; upgradeArt();
      new MutationObserver(() => upgradeArt()).observe(document.body, { childList: true, subtree: true });
    });
  }

  /* ---------- starry Arabian night background ---------- */
  function sky() {
    let st = '';
    for (let i = 0; i < 46; i++) {
      const x = Math.random() * 100, y = Math.random() * 60, r = 0.8 + Math.random() * 1.6, d = (Math.random() * 3).toFixed(2);
      st += '<circle class="star" cx="' + x.toFixed(1) + '%" cy="' + y.toFixed(1) + '%" r="' + r.toFixed(1) + '" fill="#fff" style="animation-delay:' + d + 's"/>';
    }
    const dome = (x, w, hgt, c) => '<g fill="' + c + '"><rect x="' + x + '" y="' + (100 - hgt) + '" width="' + w + '" height="' + hgt + '"/><path d="M' + x + ' ' + (100 - hgt) + ' a' + w / 2 + ' ' + w / 2 + ' 0 0 1 ' + w + ' 0z"/></g>';
    let city = '';
    [[4, 7, 12], [13, 5, 9], [20, 8, 15], [31, 6, 8], [62, 6, 9], [70, 8, 14], [80, 5, 10], [88, 7, 13]].forEach(a => city += dome(a[0], a[1], a[2], '#1a1550'));
    const el = h('div', { class: 'sky', html:
      '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' + st + '</svg>' +
      '<svg viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' + city +
      '<path d="M0 100 V86 C20 78 38 90 58 84 C78 78 90 88 100 82 V100Z" fill="#171145"/><path d="M0 100 V92 C26 86 46 96 70 91 C86 88 94 94 100 92 V100Z" fill="#0f0b36"/></svg>' +
      '<svg class="moon" style="position:absolute;top:4px;right:auto;left:44%;width:62px;height:62px;opacity:.9" viewBox="-30 -30 60 60" xmlns="http://www.w3.org/2000/svg"><circle r="22" fill="#ffd24a" opacity=".18"/><circle r="15" fill="#ffe27a"/><circle cx="7" cy="-4" r="13" fill="#2a2468"/></svg>' });
    document.body.prepend(el); return el;
  }

  /* ---------- sound (synth, no files; no music) ---------- */
  let ctx = null, muted = store.get('muted', false);
  function ac() { if (!ctx) { try { ctx = new (g.AudioContext || g.webkitAudioContext)(); } catch (e) { return null; } } if (ctx.state === 'suspended') ctx.resume(); return ctx; }
  function tone(f, t0, dur, type, vol, f2) {
    const c = ac(); if (!c || muted) return;
    const o = c.createOscillator(), gn = c.createGain(); o.type = type || 'sine';
    o.frequency.setValueAtTime(f, c.currentTime + t0); if (f2) o.frequency.exponentialRampToValueAtTime(f2, c.currentTime + t0 + dur);
    gn.gain.setValueAtTime(0.0001, c.currentTime + t0); gn.gain.exponentialRampToValueAtTime(vol || 0.15, c.currentTime + t0 + 0.02); gn.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t0 + dur);
    o.connect(gn); gn.connect(c.destination); o.start(c.currentTime + t0); o.stop(c.currentTime + t0 + dur + 0.05);
  }
  const sfx = {
    tap() { tone(520, 0, .08, 'triangle', .12); },
    ok() { tone(660, 0, .12, 'triangle', .16); tone(880, .1, .16, 'triangle', .16); tone(1320, .22, .22, 'sine', .12); },
    no() { tone(300, 0, .18, 'sawtooth', .08, 180); },
    boing() { tone(220, 0, .3, 'sine', .2, 660); tone(660, .28, .2, 'sine', .12, 330); },
    step() { tone(300, 0, .07, 'square', .05, 240); },
    gem() { tone(1046, 0, .1, 'triangle', .14); tone(1568, .08, .18, 'triangle', .14); },
    bump() { tone(140, 0, .2, 'square', .1, 70); },
    win() { [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, i * .1, .26, 'triangle', .16)); },
    laugh() { [420, 380, 440, 360].forEach((f, i) => tone(f, i * .09, .09, 'square', .06)); }
  };
  function toggleMute() { muted = !muted; store.set('muted', muted); try { if (muted) speechSynthesis.cancel(); } catch (e) { } return muted; }
  function isMuted() { return muted; }

  /* ---------- read-aloud (browser speech, Arabic) ---------- */
  function say(text) {
    if (muted) return;
    try {
      const ss = g.speechSynthesis; if (!ss) return; ss.cancel();
      const u = new SpeechSynthesisUtterance(String(text).replace(/<[^>]+>/g, ' '));
      u.lang = 'ar-SA'; u.rate = 0.9;
      const v = ss.getVoices().find(x => /^ar/i.test(x.lang)); if (v) u.voice = v;
      ss.speak(u);
    } catch (e) { }
  }
  function sayBtn(text) { return h('button', { class: 'say', type: 'button', 'aria-label': 'استمع', onclick: ev => { ev.stopPropagation(); say(typeof text === 'function' ? text() : text); } }, ['🔊']); }

  /* ---------- confetti ---------- */
  function confetti(n) {
    const w = h('div', { class: 'confetti' }); const em = ['⭐', '💎', '✨', '🪙', '🎉', '🌙'];
    for (let i = 0; i < (n || 36); i++) {
      const b = h('b', null, [em[i % em.length]]); b.style.left = Math.random() * 100 + '%'; b.style.fontSize = 20 + Math.random() * 26 + 'px';
      b.style.animationDuration = 2 + Math.random() * 2.2 + 's'; b.style.animationDelay = Math.random() * .5 + 's'; w.append(b);
    }
    document.body.append(w); setTimeout(() => w.remove(), 5200);
  }

  g.Kids = { $, $$, h, shuffle, store, wait, ART, AVATARS, art, upgradeArt, initAssets, sky, sfx, say, sayBtn, toggleMute, isMuted, confetti };
})(window);
