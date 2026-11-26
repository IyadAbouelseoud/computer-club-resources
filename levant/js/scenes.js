// Sandouq El-Donya: built-in scene backdrops (vintage print style, 1600x1000, cropped to fit any screen).
// If manifest lists "scene-<code>": true, assets/scenes/<code>.jpg replaces these.
(function () {
  const K = '#2B2520';
  const s = (o) => `stroke="${K}" stroke-width="${o || 4}" stroke-linejoin="round"`;
  const ablaq = (x, y, w, h, band) => {
    let o = ''; for (let yy = y, i = 0; yy < y + h; yy += band, i++) o += `<rect x="${x}" y="${yy}" width="${w}" height="${Math.min(band, y + h - yy)}" fill="${i % 2 ? '#2F2A25' : '#E4D3B0'}"/>`;
    return o;
  };
  const archPath = (x, y, w, h) => `M${x} ${y + h} L${x} ${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} L${x + w} ${y + h} Z`;
  const rnd = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  const SCENES = {
    sy: () => {
      const r = rnd(7); let holes = '';
      for (let i = 0; i < 140; i++) { const a = Math.PI * (0.06 + r() * 0.88), rad = 700 + r() * 90; holes += `<circle cx="${800 - Math.cos(a) * rad}" cy="${760 - Math.sin(a) * rad * 0.85}" r="${2 + r() * 3}" fill="#F6E7B8"/>`; }
      let shops = '';
      [[30, 300], [430, 300], [830, 300], [1230, 300]].forEach(([x, y], i) => {
        shops += `<clipPath id="sya${i}"><path d="${archPath(x, y, 340, 520)}"/></clipPath><g clip-path="url(#sya${i})">${ablaq(x, y, 340, 520, 26)}</g>`;
        shops += `<path d="${archPath(x + 34, y + 40, 272, 480)}" fill="#5A3B2A" ${s()}/>`;
        const cols = ['#B0302E', '#1F4E8C', '#D9A43A', '#5E6B33', '#E07A2E'];
        for (let k = 0; k < 5; k++) shops += `<path d="M${x + 62 + k * 46} ${y + 170} q20 150 0 300 l30 0 q-12 -150 0 -300z" fill="${cols[(k + i) % 5]}" ${s(3)}/>`;
        shops += `<path d="${archPath(x, y, 340, 520)}" fill="none" ${s()}/>`;
      });
      return `<rect width="1600" height="1000" fill="#3A2C22"/>
        <path d="M0 760 Q800 -60 1600 760 L1600 0 L0 0Z" fill="#2B2520"/>
        <path d="M60 760 Q800 40 1540 760" fill="#4A3A2C"/>${holes}
        <path d="M60 760 Q800 40 1540 760" fill="none" stroke="#7A6248" stroke-width="6"/>
        ${shops}
        <rect y="820" width="1600" height="180" fill="#CDB792"/>
        ${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 200 - 40} 1000 L${700 + i * 25} 820" stroke="#B49C74" stroke-width="3"/>`).join('')}
        <rect y="816" width="1600" height="8" fill="${K}"/>`;
    },
    lb: () => {
      let blocks = ''; const r = rnd(11);
      for (let y = 160, row = 0; y < 860; y += 78, row++) for (let x = (row % 2) * -70; x < 1600; x += 140 + Math.floor(r() * 40)) {
        const t = ['#D9C49B', '#CDB488', '#E2D1AE', '#C7AC7E'][Math.floor(r() * 4)];
        blocks += `<rect x="${x}" y="${y}" width="${136}" height="74" rx="6" fill="${t}" stroke="#9E8660" stroke-width="3"/>`;
      }
      let bulbs = '';
      for (let i = 0; i < 12; i++) { const x = 80 + i * 130, y = 200 + Math.sin(i * 0.9) * 30; bulbs += `<path d="M${x} 150 L${x} ${y}" stroke="${K}" stroke-width="3"/><circle cx="${x}" cy="${y + 16}" r="16" fill="#FBE7A6" ${s(3)}/>`; }
      return `<rect width="1600" height="1000" fill="#D9C49B"/>${blocks}
        <path d="M0 0 L1600 0 L1600 120 L0 150Z" fill="#B0302E" ${s()}/>
        ${Array.from({ length: 16 }, (_, i) => `<path d="M${i * 100} ${148 - i * 1.9} l50 40 l50 -40" fill="#8E2321" ${s(3)}/>`).join('')}
        <path d="M0 150 Q800 230 1600 120" fill="none" ${s(3)}/>${bulbs}
        <rect x="1180" y="300" width="330" height="620" fill="#A0652F" ${s()}/>
        <rect x="1210" y="330" width="130" height="250" fill="#C98A4B" ${s(3)}/><rect x="1350" y="330" width="130" height="250" fill="#C98A4B" ${s(3)}/>
        <rect x="1210" y="600" width="130" height="290" fill="#C98A4B" ${s(3)}/><rect x="1350" y="600" width="130" height="290" fill="#C98A4B" ${s(3)}/>
        <rect x="60" y="330" width="220" height="150" fill="#F6EEDC" ${s()}/><rect x="60" y="330" width="73" height="150" fill="#E7362D"/><rect x="207" y="330" width="73" height="150" fill="#E7362D"/>
        <path d="M170 360 l26 40 h-12 l18 30 h-64 l18 -30 h-12z" fill="#3F6B3A"/><rect x="60" y="330" width="220" height="150" fill="none" ${s()}/>
        <rect y="900" width="1600" height="100" fill="#8C7A62"/><rect y="896" width="1600" height="8" fill="${K}"/>`;
    },
    ps: () => {
      let houses = ''; const r = rnd(5);
      for (let i = 0; i < 26; i++) { const x = 760 + r() * 760, y = 330 + r() * 150, w = 40 + r() * 40; houses += `<rect x="${x}" y="${y}" width="${w}" height="${w * 0.8}" fill="#EFE3C7" stroke="#6E604C" stroke-width="2.5"/><rect x="${x + w * 0.35}" y="${y + w * 0.35}" width="${w * 0.2}" height="${w * 0.3}" fill="#6E604C"/>`; }
      let trees = '';
      [[200, 560, 1.3], [520, 600, 1], [1350, 640, 1.2], [980, 620, 0.9], [80, 650, 0.9]].forEach(([x, y, k]) => {
        trees += `<path d="M${x} ${y + 120 * k} q-10 -60 0 -110" stroke="#5A4632" stroke-width="${12 * k}" fill="none"/>`;
        trees += `<ellipse cx="${x}" cy="${y}" rx="${110 * k}" ry="${70 * k}" fill="#7C8A52" ${s(3)}/><ellipse cx="${x - 40 * k}" cy="${y - 30 * k}" rx="${60 * k}" ry="${40 * k}" fill="#8F9C60" ${s(3)}/>`;
      });
      return `<rect width="1600" height="1000" fill="#E9D8B4"/>
        <circle cx="1240" cy="190" r="110" fill="#E07A2E"/>
        ${[[300, 120], [380, 90], [460, 130]].map(([x, y]) => `<path d="M${x} ${y} q12 -10 24 0 q12 -10 24 0" stroke="${K}" stroke-width="4" fill="none"/>`).join('')}
        <path d="M0 520 Q300 380 640 470 T1600 400 L1600 1000 L0 1000Z" fill="#BFB07E" ${s(3)}/>
        ${houses}
        <rect x="1400" y="250" width="22" height="120" fill="#EFE3C7" stroke="#6E604C" stroke-width="2.5"/><path d="M1396 250 l15 -26 l15 26z" fill="#6E604C"/>
        <path d="M0 620 Q500 540 1000 610 T1600 580 L1600 1000 L0 1000Z" fill="#A3A06A" ${s(3)}/>
        ${trees}
        <rect y="790" width="1600" height="210" fill="#D9C49B" ${s()}/>
        ${Array.from({ length: 12 }, (_, i) => `<circle cx="${60 + i * 140}" cy="930" r="26" fill="#B0302E"/><circle cx="${60 + i * 140}" cy="930" r="10" fill="#F6EEDC"/><path d="M${100 + i * 140} 930 q20 -24 40 0" stroke="#3F6B3A" stroke-width="5" fill="none"/>`).join('')}`;
    },
    jo: () => {
      return `<rect width="1600" height="1000" fill="#E9C8A0"/>
        <path d="M0 0 L520 0 Q470 300 540 1000 L0 1000Z" fill="#C46E4A" ${s()}/>
        <path d="M1600 0 L1080 0 Q1140 320 1060 1000 L1600 1000Z" fill="#C46E4A" ${s()}/>
        ${Array.from({ length: 12 }, (_, i) => `<path d="M0 ${80 + i * 80} Q260 ${60 + i * 80} 500 ${100 + i * 80}" stroke="#A9583A" stroke-width="5" fill="none"/><path d="M1600 ${70 + i * 80} Q1340 ${50 + i * 80} 1090 ${95 + i * 80}" stroke="#A9583A" stroke-width="5" fill="none"/>`).join('')}
        <rect x="560" y="40" width="480" height="820" fill="#E6A57E" ${s()}/>
        <path d="M600 470 L1000 470 L800 380 Z" fill="#E9B48F" ${s()}/>
        ${[620, 700, 860, 940].map((x) => `<rect x="${x}" y="500" width="40" height="330" fill="#F0BE98" ${s(3)}/>`).join('')}
        <rect x="770" y="580" width="60" height="250" fill="#5A3324" ${s(3)}/>
        <rect x="590" y="470" width="420" height="30" fill="#D9936B" ${s(3)}/>
        <rect x="740" y="140" width="120" height="200" fill="#F0BE98" ${s(3)}/><path d="M730 140 Q800 70 870 140Z" fill="#E9B48F" ${s(3)}/>
        <path d="M600 340 L740 340 L740 300 L640 300Z M1000 340 L860 340 L860 300 L960 300Z" fill="#E9B48F" ${s(3)}/>
        <rect x="560" y="860" width="480" height="20" fill="#C9875F"/>
        <path d="M0 900 Q800 840 1600 900 L1600 1000 L0 1000Z" fill="#E2B98C" ${s()}/>`;
    }
  };

  const sceneSVG = (code) => `<svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${SCENES[code]()}</svg>`;
  window.SANDOUQ = window.SANDOUQ || {};
  window.SANDOUQ.sceneSVG = sceneSVG;
})();
