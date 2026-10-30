/* Keyboard Fury live sync.
   1) Same laptop (contestant window + projector window): localStorage + BroadcastChannel. Works offline.
   2) Two devices: set the same ROOM code on both. Results also travel through ntfy.sh (free public pub/sub, no account).
   Results are kept per shift ("girls" / "boys"). */
(function () {
  const LS = {
    get(k, d) { try { const v = localStorage.getItem('fury_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('fury_' + k, JSON.stringify(v)); } catch (e) {} }
  };
  const bc = ('BroadcastChannel' in window) ? new BroadcastChannel('fury') : null;
  const listeners = [];
  let es = null, roomStatus = 'local';

  function settings() {
    const url = new URLSearchParams(location.search);
    const s = LS.get('settings', { shift: 'girls', room: '' });
    if (url.get('room') != null) s.room = url.get('room');
    if (url.get('shift')) s.shift = url.get('shift');
    return s;
  }
  function saveSettings(s) { LS.set('settings', s); }
  function topic(room) { return 'ccpd-fury-' + String(room).toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 24); }

  function results(shift) { return LS.get('results_' + shift, []); }
  function merge(msg) {
    if (msg.t === 'result') {
      const list = results(msg.shift);
      if (!list.some(r => r.id === msg.id)) { list.push(msg); LS.set('results_' + msg.shift, list); return true; }
      return false;
    }
    if (msg.t === 'reset') {
      const last = LS.get('reset_' + msg.shift, 0);
      if (msg.ts > last) {
        LS.set('reset_' + msg.shift, msg.ts);
        LS.set('results_' + msg.shift, results(msg.shift).filter(r => r.ts > msg.ts));
        return true;
      }
      return false;
    }
    return true; // live messages always pass
  }
  function emit(msg, fromNet) { msg._new = merge(msg); listeners.forEach(f => f(msg)); }

  function send(msg) {
    emit(msg);
    if (bc) bc.postMessage(msg);
    const s = settings();
    if (s.room && msg.t !== 'live') {
      fetch('https://ntfy.sh/' + topic(s.room), { method: 'POST', body: JSON.stringify(msg) }).catch(() => {});
    } else if (s.room && msg.t === 'live' && (!send._last || Date.now() - send._last > 900)) {
      send._last = Date.now();
      fetch('https://ntfy.sh/' + topic(s.room), { method: 'POST', body: JSON.stringify(msg) }).catch(() => {});
    }
  }
  function on(f) { listeners.push(f); }

  if (bc) bc.onmessage = e => emit(e.data);
  window.addEventListener('storage', e => { if (e.key && e.key.startsWith('fury_results_')) listeners.forEach(f => f({ t: 'refresh' })); });

  function connect() {
    if (es) { es.close(); es = null; }
    const s = settings();
    if (!s.room) { roomStatus = 'local'; listeners.forEach(f => f({ t: 'status' })); return; }
    try {
      es = new EventSource('https://ntfy.sh/' + topic(s.room) + '/sse?since=12h');
      roomStatus = 'connecting';
      es.onopen = () => { roomStatus = 'online'; listeners.forEach(f => f({ t: 'status' })); };
      es.onerror = () => { roomStatus = 'offline'; listeners.forEach(f => f({ t: 'status' })); };
      es.onmessage = e => { try { const d = JSON.parse(e.data); if (d.event === 'message' && d.message) emit(JSON.parse(d.message), true); } catch (err) {} };
    } catch (e) { roomStatus = 'offline'; }
    listeners.forEach(f => f({ t: 'status' }));
  }

  function ranked(shift) {
    const best = {};
    results(shift).forEach(r => { const k = r.name.trim().toLowerCase(); if (!best[k] || r.wpm > best[k].wpm || (r.wpm === best[k].wpm && r.acc > best[k].acc)) best[k] = r; });
    return Object.values(best).sort((a, b) => b.wpm - a.wpm || b.acc - a.acc || a.ts - b.ts);
  }

  window.Fury = { LS, settings, saveSettings, send, on, connect, results, ranked, status: () => roomStatus };
})();
