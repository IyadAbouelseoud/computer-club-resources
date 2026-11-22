// node kids/caravan/test.js — verifies every level is solvable, par matches, loops are really needed, debug starts fail
const E = require('./engine.js');
let bad = 0; const fail = m => { bad++; console.log('FAIL', m); };
for (const L of E.LEVELS) {
  const sol = E.simulate(L, L.sol);
  if (!sol.ok) fail(L.id + ' solution does not win: ' + sol.reason);
  if (E.count(L.sol) !== L.par) fail(L.id + ' par ' + L.par + ' != solution blocks ' + E.count(L.sol));
  if (L.par > L.max) fail(L.id + ' par exceeds max');
  const flat = E.minFlat(L);
  const flatLen = E.flatten(L.sol).length;
  console.log(L.id.padEnd(3), 'par', String(L.par).padStart(2), 'max', String(L.max).padStart(2), 'minFlat', String(flat).padStart(2), 'solFlat', String(flatLen).padStart(2), L.loops ? '(loops)' : '', L.debug ? '(debug)' : '');
  if (L.loops && !L.debug && flat <= L.max) fail(L.id + ' flat solution (' + flat + ') fits within max (' + L.max + ') so loops are not required');
  if (!L.loops && !L.debug && flat < L.par) console.log('   note: shorter flat solution exists (' + flat + ' < par ' + L.par + ') — fine, gets 3 stars');
  if (L.debug) {
    const st = E.simulate(L, L.start);
    if (st.ok) fail(L.id + ' buggy start already wins');
    if (E.count(L.start) > L.max) fail(L.id + ' start exceeds max');
  }
  if (!L.debug) { /* a no-program run must not win */ if (E.simulate(L, []).ok) fail(L.id + ' empty program wins'); }
}
for (const D of E.DOORS) {
  if (D.type === 'make') { if (D.target > D.vals.reduce((a, b) => a + b, 0)) fail(D.id + ' target unreachable'); }
  else { const v = D.bits.reduce((a, b, i) => a + b * D.vals[i], 0); if (!D.options.includes(v)) fail(D.id + ' correct answer missing from options'); if (new Set(D.options).size !== D.options.length) fail(D.id + ' duplicate options'); }
}
console.log(bad ? bad + ' FAILURES' : 'ALL LEVELS OK (' + E.LEVELS.length + ' levels + ' + E.DOORS.length + ' doors)');
process.exit(bad ? 1 : 0);
