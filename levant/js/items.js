// Sandouq El-Donya: item library.
// Every item has a built-in SVG drawing (viewBox 0 0 100 100) so the game works offline with zero assets.
// If levant/assets/manifest.json lists "item-<id>": true, the PNG at assets/items/<id>.png is used instead.
(function () {
  const K = '#2B2520';            // ink
  const C = {
    paper: '#F6EEDC', sand: '#E9D9B8', cobalt: '#1F4E8C', sky: '#5C8FC7', red: '#B0302E', rose: '#D9607A',
    olive: '#5E6B33', leaf: '#6F8F3A', lime: '#9DB04A', orange: '#E07A2E', gold: '#D9A43A', brass: '#C98A3C',
    brown: '#8A5A33', dough: '#E2B56E', crust: '#C98B45', cream: '#FFF6E3', white: '#FFFDF7', yellow: '#F2C43D',
    green: '#3F6B3A', pink: '#E7A2A0', black: '#2B2520', stone: '#CDB792', petra: '#D9845C'
  };
  const sw = 'stroke="' + K + '" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"';
  const p = (d, f) => `<path d="${d}" fill="${f || 'none'}" ${sw}/>`;
  const c = (x, y, r, f) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f || 'none'}" ${sw}/>`;
  const e = (x, y, rx, ry, f) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f || 'none'}" ${sw}/>`;
  const dots = (pts, r, f) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/>`).join('');

  const flower5 = (x, y, s, f) => {
    let o = '';
    for (let i = 0; i < 5; i++) {
      const a = (i * 72 - 90) * Math.PI / 180;
      o += e((x + Math.cos(a) * 6 * s).toFixed(1), (y + Math.sin(a) * 6 * s).toFixed(1), (4.2 * s).toFixed(1), (6.4 * s).toFixed(1), f)
        .replace('<ellipse', `<ellipse transform="rotate(${i * 72} ${(x + Math.cos(a) * 6 * s).toFixed(1)} ${(y + Math.sin(a) * 6 * s).toFixed(1)})"`);
    }
    return o + c(x, y, 2.6 * s, C.yellow);
  };
  const star8 = (x, y, r, f) => {
    let pts = [];
    for (let i = 0; i < 16; i++) {
      const rr = i % 2 ? r * 0.55 : r, a = (i * 22.5 - 90) * Math.PI / 180;
      pts.push((x + Math.cos(a) * rr).toFixed(1) + ' ' + (y + Math.sin(a) * rr).toFixed(1));
    }
    return p('M' + pts.join(' L') + 'Z', f);
  };

  const SVG = {
    // ---------- shared Levant items (decoys) ----------
    rakweh: p('M33 40 L67 40 L74 82 Q50 91 26 82 Z', C.brass) + e(50, 40, 17, 4, C.gold) + p('M33 41 L22 33 L32 37') +
      p('M70 56 L95 47', null).replace('stroke-width="2.6"', 'stroke-width="7"') + p('M70 56 L95 47', null).replace(K, C.brown).replace('stroke-width="2.6"', 'stroke-width="3.2"') +
      p('M30 66 Q50 72 72 66') + dots([[40, 76], [50, 78], [60, 76]], 2, K),
    finjan: e(50, 80, 34, 8, C.cream) + p('M28 48 L72 48 L66 74 Q50 82 34 74 Z', C.white) + e(50, 48, 22, 5, C.brown) +
      p('M71 54 Q86 56 78 68 L68 68') + p('M31 60 L69 60', null).replace(K, C.red).replace('2.6', '5') + dots([[38, 66], [50, 67], [62, 66]], 2, C.cobalt),
    lemon: p('M14 56 Q16 34 46 30 Q78 28 86 52 Q84 76 50 78 Q20 78 14 56Z', C.yellow) + p('M86 52 L93 50') + p('M14 56 L7 58') +
      p('M48 30 Q52 12 72 14 Q66 30 48 30Z', C.leaf) + dots([[32, 50], [44, 60], [60, 48], [70, 62]], 1.3, K),
    pomegranate: c(50, 58, 31, C.red) + p('M40 30 L42 18 L47 26 L50 16 L53 26 L58 18 L60 30') + p('M30 52 Q36 42 46 40', null).replace(K, C.pink).replace('2.6', '4'),
    lantern: p('M50 8 L50 16') + c(50, 7, 3) + p('M34 28 Q50 10 66 28 Z', C.brass) + p('M32 28 L68 28 L64 72 L36 72 Z', C.orange) +
      p('M44 28 L42 72 M56 28 L58 72') + p('M36 72 L64 72 L58 86 L42 86 Z', C.brass) + c(50, 50, 6, C.yellow),
    misbaha: (() => { let o = ''; for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; o += c((50 + Math.cos(a) * 26).toFixed(1), (42 + Math.sin(a) * 26).toFixed(1), 4.6, i % 6 === 0 ? C.gold : C.cobalt); } return o; })() +
      p('M50 70 L50 80') + p('M44 80 L56 80 L58 96 L42 96Z', C.red),
    oud: p('M30 40 Q14 72 34 88 Q52 100 72 84 Q86 66 66 42 Q50 30 30 40Z', C.brown) + p('M58 37 L82 10 L90 16 L66 42', C.dough) +
      c(46, 64, 9, C.black) + c(46, 64, 4.5, C.gold) + p('M40 84 L58 80') + p('M48 38 L78 13 M52 40 L82 15', null),

    // ---------- Syria ----------
    jasmine: p('M20 80 Q40 60 50 40 M50 40 Q66 62 84 72', null) + e(34, 72, 9, 5, C.leaf) + e(72, 66, 9, 5, C.leaf) +
      flower5(32, 38, 1.55, C.white) + flower5(68, 30, 1.35, C.white) + flower5(60, 66, 1.2, C.white),
    aleppo: p('M14 42 L50 28 L86 42 L50 56 Z', '#B9A26A') + p('M14 42 L14 70 L50 86 L50 56 Z', C.olive) + p('M50 56 L50 86 L86 70 L86 42 Z', '#4E5A2B') +
      e(50, 42, 14, 5.5, null) + p('M41 42 L59 42', null) + dots([[44, 39], [56, 45]], 1.4, K),
    tarboush: p('M24 84 L32 30 Q50 22 68 30 L76 84 Q50 92 24 84Z', C.red) + e(50, 30, 18, 5, '#8E2321') +
      p('M50 28 Q62 30 66 46') + p('M62 44 L72 70 L60 72 Z', C.black) + p('M30 72 Q50 78 70 72', null).replace(K, '#8E2321').replace('2.6', '3.5'),
    tile: `<rect x="12" y="12" width="76" height="76" rx="3" fill="${C.white}" ${sw}/>` + `<rect x="18" y="18" width="64" height="64" fill="none" stroke="${C.cobalt}" stroke-width="3"/>` +
      star8(50, 50, 24, C.cobalt) + c(50, 50, 8, C.white) + c(50, 50, 3.4, C.orange) +
      [[18, 18], [82, 18], [18, 82], [82, 82]].map(([x, y]) => `<path d="M${x} ${y} l${x < 50 ? 12 : -12} 0 l${x < 50 ? -12 : 12} ${y < 50 ? 12 : -12}z" fill="${C.sky}"/>`).join(''),
    barazek: c(50, 52, 34, C.dough) + c(50, 52, 27, '#D9A35C').replace(sw, 'stroke="#B98242" stroke-width="1.5"') +
      dots([[38, 40], [52, 34], [64, 44], [44, 54], [60, 60], [36, 64], [52, 70], [68, 56], [30, 50], [56, 46]], 2.2, C.cream) +
      dots([[46, 44], [62, 66], [40, 60], [58, 54]], 2.4, C.lime),

    // ---------- Lebanon ----------
    cedar: p('M50 10 L66 30 L58 30 L76 50 L64 50 L86 74 L14 74 L36 50 L24 50 L42 30 L34 30 Z', C.green) + `<rect x="45" y="74" width="10" height="16" fill="${C.brown}" ${sw}/>` +
      p('M36 50 L64 50 M24 74', null).replace(K, '#2E5230'),
    manousheh: c(50, 52, 37, C.dough) + c(50, 52, 30, C.olive).replace(sw, 'stroke="#4A5527" stroke-width="1.5"') +
      dots([[36, 42], [50, 36], [64, 44], [44, 54], [58, 58], [38, 64], [52, 68], [66, 60], [30, 52], [70, 50], [46, 46]], 2.3, '#3A4220') +
      dots([[42, 38], [60, 52], [34, 58], [54, 62]], 1.6, C.cream),
    kaak: p('M50 18 Q84 20 84 56 Q84 88 50 88 Q16 88 16 56 Q16 20 50 18Z', C.crust) + p('M50 34 Q70 36 70 58 Q70 74 50 74 Q30 74 30 58 Q30 36 50 34Z', C.paper) +
      p('M38 20 Q50 2 62 20', null).replace('2.6', '7').replace(K, C.crust) + p('M38 20 Q50 2 62 20') +
      dots([[24, 50], [26, 66], [34, 80], [50, 84], [66, 80], [74, 66], [76, 50], [70, 30], [30, 30], [50, 24]], 1.8, C.cream),
    boat: p('M8 60 L92 60 L80 80 L20 80 Z', C.cobalt) + p('M12 66 L88 66', null).replace(K, C.white).replace('2.6', '3.5') + p('M8 60 L92 60 L80 80 L20 80 Z') +
      p('M50 60 L50 14') + p('M52 18 L78 54 L52 54 Z', C.white) + p('M48 22 L26 54 L48 54 Z', C.orange) + p('M6 88 Q20 82 34 88 T62 88 T94 88', null).replace(K, C.sky),
    record: c(50, 50, 40, C.black) + c(50, 50, 30, null).replace(K, '#5a514a').replace('2.6', '1.2') + c(50, 50, 22, null).replace(K, '#5a514a').replace('2.6', '1.2') +
      c(50, 50, 14, C.red) + c(50, 50, 2.6, C.paper) + p('M30 24 Q40 18 50 18', null).replace(K, '#8a8078').replace('2.6', '2'),

    // ---------- Palestine ----------
    olives: p('M12 56 L88 56 Q84 86 50 88 Q16 86 12 56Z', C.white) + p('M18 66 L82 66', null).replace(K, C.cobalt).replace('2.6', '3') +
      e(30, 50, 9, 7, C.olive) + e(48, 46, 9, 7, C.lime) + e(66, 50, 9, 7, C.olive) + e(40, 54, 8, 6, C.lime) + e(58, 55, 8, 6, C.olive) +
      p('M60 30 Q74 18 90 24', null) + e(80, 28, 8, 3.5, C.leaf),
    tatreez: `<rect x="12" y="14" width="76" height="72" fill="${C.cream}" ${sw}/>` +
      (() => { let o = ''; const R = C.red, cell = 4.2; const pts = [];
        for (let i = -4; i <= 4; i++) for (let j = -4; j <= 4; j++) if (Math.abs(i) + Math.abs(j) === 4 || Math.abs(i) + Math.abs(j) === 2 || (i === 0 && j === 0)) pts.push([i, j]);
        pts.forEach(([i, j]) => { const x = 50 + i * cell, y = 50 + j * cell; o += `<path d="M${x - 1.6} ${y - 1.6} L${x + 1.6} ${y + 1.6} M${x + 1.6} ${y - 1.6} L${x - 1.6} ${y + 1.6}" stroke="${(Math.abs(i) + Math.abs(j)) === 2 ? C.olive : R}" stroke-width="1.8"/>`; });
        for (let x = 18; x <= 82; x += 6) o += `<path d="M${x - 1.5} 20 l3 3 M${x + 1.5} 20 l-3 3 M${x - 1.5} 77 l3 3 M${x + 1.5} 77 l-3 3" stroke="${R}" stroke-width="1.6"/>`;
        return o; })() + p('M12 86 L12 92 M24 86 L24 94 M36 86 L36 92 M48 86 L48 94 M60 86 L60 92 M72 86 L72 94 M88 86 L88 92', null),
    knafeh: e(50, 60, 40, 22, '#B8B2A6') + e(50, 56, 34, 17, C.orange) + p('M50 56 L84 56 Q84 64 74 68 L50 60 Z', C.cream) +
      dots([[34, 52], [44, 48], [58, 50], [30, 60], [46, 62], [62, 58], [40, 56], [54, 46]], 2.2, C.lime),
    orange: c(48, 56, 32, C.orange) + p('M48 24 Q50 14 56 12') + p('M56 16 Q74 6 84 18 Q70 28 56 16Z', C.leaf) +
      dots([[36, 50], [56, 46], [44, 66], [62, 64], [30, 62]], 1.4, '#B95A1C') + p('M30 44 Q34 36 42 34', null).replace(K, '#F6B26B').replace('2.6', '4'),

    // ---------- Jordan ----------
    mansaf: e(50, 64, 44, 18, '#B8B2A6') + e(50, 58, 36, 13, C.white) + c(38, 52, 9, C.brown) + c(58, 50, 10, '#7A4B2A') + c(50, 60, 7, C.brown) +
      dots([[30, 60], [44, 64], [66, 60], [70, 54], [26, 54], [56, 64]], 2, C.yellow) + dots([[36, 46], [62, 44], [48, 52]], 1.6, C.leaf),
    sandbottle: p('M42 10 L58 10 L58 26 Q74 32 74 52 L74 84 Q74 92 64 92 L36 92 Q26 92 26 84 L26 52 Q26 32 42 26 Z', C.paper) +
      `<g clip-path="url(#sbclip)"><rect x="20" y="42" width="60" height="10" fill="${C.petra}"/><rect x="20" y="52" width="60" height="8" fill="${C.yellow}"/><rect x="20" y="60" width="60" height="10" fill="${C.red}"/><rect x="20" y="70" width="60" height="8" fill="${C.cobalt}"/><rect x="20" y="78" width="60" height="16" fill="${C.orange}"/><path d="M34 78 q4-10 10-6 q6-8 12 0 l4 6z" fill="${K}"/></g>` +
      `<clipPath id="sbclip"><path d="M27 42 L73 42 L73 84 Q73 91 64 91 L36 91 Q27 91 27 84 Z"/></clipPath>` +
      p('M42 10 L58 10 L58 26 Q74 32 74 52 L74 84 Q74 92 64 92 L36 92 Q26 92 26 84 L26 52 Q26 32 42 26 Z') + `<rect x="40" y="4" width="20" height="8" rx="2" fill="${C.brown}" ${sw}/>`,
    shmagh: p('M8 30 L92 30 L50 84 Z', C.white) +
      (() => { let o = ''; for (let y = 34; y < 80; y += 7) for (let x = 12; x < 90; x += 7) { const hw = 42 * (84 - y) / 54; if (Math.abs(x + 1.8 - 50) < hw - 4) o += `<rect x="${x}" y="${y}" width="3.6" height="3.6" fill="${C.red}" transform="rotate(45 ${x + 1.8} ${y + 1.8})"/>`; } return o; })() +
      p('M8 30 L92 30 L50 84 Z') + p('M8 30 L92 30', null).replace(K, C.red).replace('2.6', '5') + p('M40 84 L38 94 M46 86 L45 96 M54 86 L55 96 M60 84 L62 94', null),
    dallah: p('M40 34 L60 34 L66 58 Q74 66 72 84 L28 84 Q26 66 34 58 Z', C.brass) + p('M40 34 Q50 18 60 34', C.gold) + p('M50 22 L50 10') + c(50, 9, 3, C.gold) +
      p('M36 56 Q18 52 12 34 Q22 40 30 44', null) + p('M64 46 Q84 50 78 72', null) + p('M30 72 L70 72', null).replace(K, C.brown) + e(50, 84, 22, 4, C.gold),

    // ---------- the golden one ----------
    golden: e(50, 80, 34, 8, C.gold) + p('M28 48 L72 48 L66 74 Q50 82 34 74 Z', C.yellow) + e(50, 48, 22, 5, C.brown) +
      p('M71 54 Q86 56 78 68 L68 68') + p('M31 60 L69 60', null).replace(K, C.brass).replace('2.6', '5') +
      star8(20, 24, 7, C.white) + star8(84, 30, 5, C.white) + star8(78, 10, 3.6, C.white)
  };

  // Names, transliteration, English and one short line each. Arabic first, English second.
  const ITEMS = [
    // shared
    { id: 'rakweh', c: 'all', ar: 'ركوة', tr: 'rakweh', en: 'Coffee pot', fact_ar: 'قهوة الصبح ما بتزبط إلا بالركوة.', fact_en: 'Levant coffee is boiled in this little pot, not brewed.' },
    { id: 'finjan', c: 'all', ar: 'فنجان', tr: 'finjan', en: 'Coffee cup', fact_ar: 'فنجان صغير، وحكي كتير.', fact_en: 'A tiny cup that always comes with a long chat.' },
    { id: 'lemon', c: 'all', ar: 'ليمون', tr: 'laymoun', en: 'Lemon', fact_ar: 'ليمون ونعنع: مشروب الصيف بالشام.', fact_en: 'Lemon and mint: the Levant summer drink.' },
    { id: 'pomegranate', c: 'all', ar: 'رمّانة', tr: 'rummaneh', en: 'Pomegranate', fact_ar: 'دبس الرمان هو سرّ الحموضة بالأكل الشامي.', fact_en: 'Pomegranate molasses is the secret sour note in Levant cooking.' },
    { id: 'lantern', c: 'all', ar: 'فانوس', tr: 'fanous', en: 'Lantern', fact_ar: 'بيضوّي الحارات القديمة بليالي رمضان.', fact_en: 'It lights the old alleys on Ramadan nights.' },
    { id: 'misbaha', c: 'all', ar: 'مسبحة', tr: 'masbaha', en: 'Prayer beads', fact_ar: 'ما في جدّ بلا مسبحة بإيده.', fact_en: 'Every grandpa has one clicking in his hand.' },
    { id: 'oud', c: 'all', ar: 'عود', tr: 'oud', en: 'Oud', fact_ar: 'العود هو قلب الطرب.', fact_en: 'The oud is the heartbeat of tarab music.' },
    // Syria
    { id: 'jasmine', c: 'sy', ar: 'ياسمين شامي', tr: 'yasmeen shami', en: 'Damascene jasmine', fact_ar: 'دمشق اسمها مدينة الياسمين.', fact_en: 'Damascus is known as the City of Jasmine.' },
    { id: 'aleppo', c: 'sy', ar: 'صابون غار', tr: 'saboun ghar', en: 'Aleppo soap', fact_ar: 'صابون حلبي من زيت الزيتون والغار.', fact_en: 'Made in Aleppo from olive oil and laurel for centuries.' },
    { id: 'tarboush', c: 'sy', ar: 'طربوش', tr: 'tarboush', en: 'Tarboush (fez)', fact_ar: 'لبسة الحكواتي بالشام القديمة.', fact_en: 'The hat of the old Damascus storyteller.' },
    { id: 'tile', c: 'sy', ar: 'قيشاني شامي', tr: 'qishani', en: 'Damascene tile', fact_ar: 'أزرق وأبيض على حيطان البيوت الشامية.', fact_en: 'Cobalt and white tiles line Damascene courtyards.' },
    { id: 'barazek', c: 'sy', ar: 'برازق', tr: 'barazek', en: 'Barazek cookie', fact_ar: 'بسكويت شامي بالسمسم والفستق.', fact_en: 'A Damascus cookie with sesame and pistachio.' },
    // Lebanon
    { id: 'cedar', c: 'lb', ar: 'أرزة', tr: 'arzeh', en: 'Cedar tree', fact_ar: 'الأرزة بنص علم لبنان.', fact_en: 'The cedar sits in the middle of Lebanon’s flag.' },
    { id: 'manousheh', c: 'lb', ar: 'منقوشة زعتر', tr: 'manʼousheh', en: 'Za’atar flatbread', fact_ar: 'فطور لبنان: عجينة وزعتر وزيت زيتون.', fact_en: 'Lebanon’s breakfast: dough, za’atar and olive oil.' },
    { id: 'kaak', c: 'lb', ar: 'كعكة', tr: 'kaʼak', en: 'Ka’ak bread', fact_ar: 'كعك بيروت بسمسم، بينباع ع العربيات.', fact_en: 'Beirut’s purse-shaped sesame bread, sold from street carts.' },
    { id: 'boat', c: 'lb', ar: 'شختورة', tr: 'shakhtoura', en: 'Fishing boat', fact_ar: 'مينا جبيل من أقدم موانئ الدنيا.', fact_en: 'Byblos harbour is one of the oldest in the world.' },
    { id: 'record', c: 'lb', ar: 'أسطوانة', tr: 'istiwaneh', en: 'Vinyl record', fact_ar: 'الصبح بالشام يعني فيروز عالراديو.', fact_en: 'Mornings in the Levant mean Fairuz on the radio.' },
    // Palestine
    { id: 'olives', c: 'ps', ar: 'زيتون', tr: 'zaytoun', en: 'Olives', fact_ar: 'موسم القطاف بيجمع العيلة كلها تحت الشجر.', fact_en: 'Olive harvest brings the whole family out to the trees.' },
    { id: 'tatreez', c: 'ps', ar: 'تطريز', tr: 'tatreez', en: 'Embroidery', fact_ar: 'كل بلدة إلها غرزتها وألوانها.', fact_en: 'Every village had its own stitches and colours.' },
    { id: 'knafeh', c: 'ps', ar: 'كنافة نابلسية', tr: 'knafeh', en: 'Knafeh', fact_ar: 'من نابلس: جبنة وقطر وقرمشة.', fact_en: 'From Nablus: cheese, syrup and crunch.' },
    { id: 'orange', c: 'ps', ar: 'برتقال يافا', tr: 'burdan yafa', en: 'Jaffa orange', fact_ar: 'برتقال يافا كان مشهور بكل الدنيا.', fact_en: 'Jaffa oranges were famous all over the world.' },
    // Jordan
    { id: 'mansaf', c: 'jo', ar: 'منسف', tr: 'mansaf', en: 'Mansaf', fact_ar: 'أكلة الأردن: لحم وجميد ورز.', fact_en: 'Jordan’s national dish: lamb, jameed and rice.' },
    { id: 'sandbottle', c: 'jo', ar: 'رمل البترا', tr: 'raml al-batra', en: 'Petra sand bottle', fact_ar: 'رسومات من رمل ملوّن جوّا قنينة.', fact_en: 'Pictures made of coloured sand, poured into a bottle.' },
    { id: 'shmagh', c: 'jo', ar: 'شماغ', tr: 'shmagh', en: 'Red shmagh', fact_ar: 'الشماغ الأحمر والأبيض علامة أردنية.', fact_en: 'The red-and-white shmagh is a Jordanian signature.' },
    { id: 'dallah', c: 'jo', ar: 'دلّة', tr: 'dalleh', en: 'Bedouin coffee pot', fact_ar: 'هزّ الفنجان يعني: بكفّي، الله يسلّم إيدك.', fact_en: 'Shake your cup when you’ve had enough: that’s the rule.' },
    // golden
    { id: 'golden', c: 'gold', ar: 'الفنجان الذهبي', tr: 'al-finjan adh-dhahabi', en: 'The golden finjan', fact_ar: 'لقيت الكنز!', fact_en: 'You found the treasure!' }
  ];

  const COUNTRIES = {
    sy: { ar: 'سوريا', en: 'Syria', place_ar: 'سوق الحميدية · دمشق', place_en: 'Souq Al-Hamidiyeh, Damascus', emblem: 'jasmine', color: '#1F4E8C' },
    lb: { ar: 'لبنان', en: 'Lebanon', place_ar: 'السوق العتيق · جبيل', place_en: 'Old Souk, Byblos', emblem: 'cedar', color: '#3F6B3A' },
    ps: { ar: 'فلسطين', en: 'Palestine', place_ar: 'شرفة تيتا · فلسطين', place_en: 'Teta’s terrace, Palestine', emblem: 'olives', color: '#B0302E' },
    jo: { ar: 'الأردن', en: 'Jordan', place_ar: 'البترا · الأردن', place_en: 'Petra, Jordan', emblem: 'sandbottle', color: '#C4642F' }
  };

  const svgOf = (id) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${SVG[id] || ''}</svg>`;

  window.SANDOUQ = window.SANDOUQ || {};
  Object.assign(window.SANDOUQ, { ITEMS, COUNTRIES, SVG, svgOf, PALETTE: C, INK: K });
})();
