/* Keyboard Fury live sync.
   Works across two devices out of the box: the contestant laptop and the projector laptop
   both join the same room on ntfy.sh (free public pub/sub, no account, needs internet).
   Same-laptop windows also sync instantly through localStorage + BroadcastChannel.
   To save ntfy's free daily quota, only 2 network messages are sent per contestant
   (start + final result). Unsent results wait in an outbox and retry until delivered. */
(function () {
  const DEFAULT_ROOM = 'aoupd26-7q4kx9';
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
    if (!s.room) s.room = DEFAULT_ROOM;
    return s;
  }
  function saveSettings(s) { LS.set('settings', s); }
  function online() { return settings().room !== 'local'; }
  function topic() { return 'ccpd-fury-' + String(settings().room).toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40); }

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
    return true;
  }
  function emit(msg) { msg._new = merge(msg); listeners.forEach(f => f(msg)); }

  // ---- network outbox (results + resets), retried until ntfy accepts them
  function outbox() { return LS.get('outbox', []); }
  let flushing = false;
  async function flush() {
    if (flushing || !online()) return; flushing = true;
    try {
      let box = outbox();
      while (box.length) {
        const r = await fetch('https://ntfy.sh/' + topic(), { method: 'POST', body: JSON.stringify(box[0]) });
        if (!r.ok) break;
        box = outbox().slice(1); LS.set('outbox', box);
      }
    } catch (e) {}
    flushing = false;
    listeners.forEach(f => f({ t: 'status' }));
  }
  setInterval(flush, 8000);

  function send(msg) {
    if (!msg.ts) msg.ts = Date.now();
    const clean = Object.assign({}, msg); delete clean._new;
    emit(msg);
    if (bc) bc.postMessage(clean);
    if (!online()) return;
    if (msg.t === 'result' || msg.t === 'reset') { LS.set('outbox', outbox().concat([clean])); flush(); }
    else if (msg.t === 'live' && msg.state === 'ready' && msg.round === 1) {
      fetch('https://ntfy.sh/' + topic(), { method: 'POST', body: JSON.stringify(clean) }).catch(() => {});
    }
  }
  function on(f) { listeners.push(f); }

  if (bc) bc.onmessage = e => emit(e.data);
  window.addEventListener('storage', e => { if (e.key && e.key.startsWith('fury_results_')) listeners.forEach(f => f({ t: 'refresh' })); });

  function connect() {
    if (es) { es.close(); es = null; }
    if (!online()) { roomStatus = 'local'; listeners.forEach(f => f({ t: 'status' })); return; }
    try {
      es = new EventSource('https://ntfy.sh/' + topic() + '/sse?since=12h');
      roomStatus = 'connecting';
      es.onopen = () => { roomStatus = 'online'; listeners.forEach(f => f({ t: 'status' })); flush(); };
      es.onerror = () => { roomStatus = es && es.readyState === 0 ? 'reconnecting' : 'offline'; listeners.forEach(f => f({ t: 'status' })); };
      es.onmessage = e => { try { const d = JSON.parse(e.data); if (d.event === 'message' && d.message) { const m = JSON.parse(d.message); if (m.t === 'live' && Date.now() - (m.ts || 0) > 60000) return; m._net = true; emit(m); } } catch (err) {} };
    } catch (e) { roomStatus = 'offline'; }
    listeners.forEach(f => f({ t: 'status' }));
  }

  function ranked(shift) {
    const best = {};
    results(shift).forEach(r => { const k = r.name.trim().toLowerCase(); if (!best[k] || r.wpm > best[k].wpm || (r.wpm === best[k].wpm && r.acc > best[k].acc)) best[k] = r; });
    return Object.values(best).sort((a, b) => b.wpm - a.wpm || b.acc - a.acc || a.ts - b.ts);
  }

  window.Fury = { LS, settings, saveSettings, send, on, connect, results, ranked, status: () => roomStatus, pending: () => outbox().length, online, DEFAULT_ROOM };
})();
