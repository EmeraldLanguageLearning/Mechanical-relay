/* ===== Maintenance Relay – app ===== */
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const LS = {
  get(k, d){ try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} },
  del(k){ try { localStorage.removeItem(k); } catch(e){} }
};
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const norm = s => String(s || '').toUpperCase().replace(/[^A-Z]/g, '');
const TEAMCLS = ['t0', 't1'];

/* ---------- local (per-device) state ---------- */
let ROLE = null;            // 'host' | 'guest' | 'solo'
let S = null;               // shared game state (host is the authority)
let PEND = [];              // points awarded during one action
let lastFlash = 0;
const LOCAL = { reveal:{}, sel:null, menu:false, err:'' };
const LINK = { ok:false, code:'', status:'' };
const me = () => ROLE === 'solo' ? null : (ROLE === 'host' ? 0 : 1);
const isHost = () => ROLE === 'host' || ROLE === 'solo';

function fresh(teams){
  const order = {};
  for (let r = 1; r <= 5; r++) { const n = ROUNDS[r].items.length; const idx = [...Array(n).keys()]; order[r] = ROUNDS[r].shuffle ? shuffle(idx) : idx; }
  return {
    v:1, screen:'lobby', round:0, idx:0, phase:'ready', d:{},
    teams: teams ? teams.map(t => ({name:t.name, players:t.players.slice(), score:0})) :
      [{name:'Team A', players:['','','',''], score:0}, {name:'Team B', players:['','','',''], score:0}],
    rp:{1:[0,0],2:[0,0],3:[0,0],4:[0,0],5:[0,0],0:[0,0]}, done:{}, order,
    timer:{running:false, rem:0, dur:0, end:0}, flash:null
  };
}

/* ---------- helpers on state ---------- */
const RD = () => ROUNDS[S.round];
const itemsOf = r => ROUNDS[r].items;
const curItem = () => itemsOf(S.round)[S.order[S.round][S.idx]];
const active = () => S.idx % 2;                  // team "on turn" for rounds 1, 4, 5
const tname = t => esc(S.teams[t].name || (t ? 'Team B' : 'Team A'));
const tag = t => `<span class="tag ${TEAMCLS[t]}">${tname(t)}</span>`;
function players(t){ const p = S.teams[t].players.map(x => (x || '').trim()).filter(Boolean); return p.length ? p : ['Player 1','Player 2','Player 3']; }
function playerFor(t, offset){ const p = players(t); const turn = Math.floor(S.idx / 2); return esc(p[(turn + (offset || 0)) % p.length]); }

function startTimer(ms){ S.timer = {running:true, dur:ms, rem:ms, end:Date.now() + ms}; }
function remaining(){ const T = S.timer; return T.running ? Math.max(0, T.end - Date.now()) : T.rem; }
function pauseTimer(){ if (S.timer.running) { S.timer.rem = remaining(); S.timer.running = false; } }
function resumeTimer(){ if (!S.timer.running && S.timer.rem > 0) { S.timer.end = Date.now() + S.timer.rem; S.timer.running = true; } }
function award(t, p, why){ S.teams[t].score += p; const k = S.screen === 'item' ? S.round : 0; S.rp[k][t] += p; PEND.push({t, p, why}); }

/* ---------- reducer (host only) ---------- */
const FORCE_TEAM = new Set(['setTeam','pick','ans','guess','diag','buzz']);
function reduce(a, from){
  if (from === 'guest' && FORCE_TEAM.has(a.t)) a.team = 1;
  const t = a.team == null ? null : +a.team;
  const R = S.round;
  switch (a.t) {
    case 'setTeam':
      if (a.name != null) S.teams[t].name = String(a.name).slice(0, 24).trim() || (t ? 'Team B' : 'Team A');
      if (a.p != null) S.teams[t].players[+a.p] = String(a.val || '').slice(0, 20);
      break;
    case 'home': pauseTimer(); S.screen = 'home'; break;
    case 'lobbyReq': pauseTimer(); S.screen = 'lobby'; break;
    case 'intro': pauseTimer(); S.round = +a.r; S.screen = 'intro'; break;
    case 'begin': S.screen = 'item'; S.idx = 0; enterItem(); break;
    case 'next':
      pauseTimer(); S.idx++;
      if (S.idx >= itemsOf(R).length) { S.screen = 'roundEnd'; S.done[R] = true; } else enterItem();
      break;
    case 'endRound': pauseTimer(); S.screen = 'roundEnd'; S.done[R] = true; break;
    case 'final': pauseTimer(); S.screen = 'final'; break;
    case 'adj': award(t, +a.d, 'Score adjusted'); break;
    case 'reset': S = fresh(S.teams); break;
    case 'pt': if (S.screen === 'item' && (S.phase === 'play')) { S.timer.running ? pauseTimer() : resumeTimer(); } break;
    case 'go': if (S.phase === 'ready') startPlay(); break;
    case 'timeup': onTimeUp(); break;

    case 'pick': { // round 1
      if (R !== 1 || S.phase !== 'play' || t !== 1 - active()) break;
      const it = curItem();
      if (S.d.tried.includes(a.part)) break;
      if (a.part === it.part) { S.d.ok = true; award(t, 1, 'Part found'); award(active(), 1, 'Clear explanation'); pauseTimer(); S.phase = 'result'; }
      else { S.d.tried.push(a.part); if (S.d.tried.length >= 3) { pauseTimer(); S.phase = 'result'; } }
      break; }
    case 'ans': { // round 2
      if (R !== 2 || S.phase !== 'play' || S.d.ans[t] != null) break;
      S.d.ans[t] = +a.c; S.d.at[t] = Date.now();
      if (S.d.ans[0] != null && S.d.ans[1] != null) r2reveal();
      break; }
    case 'guess': { // round 3
      if (R !== 3 || S.phase !== 'play' || S.d.solved[t]) break;
      const it = curItem();
      if (it.ans.includes(norm(a.text))) {
        S.d.solved[t] = true; S.d.order.push(t);
        const final = S.idx === REBUS.length;
        award(t, S.d.order.length === 1 ? (final ? 3 : 2) : 1, final ? 'Mystery word' : 'Rebus solved');
        if (S.d.solved[0] && S.d.solved[1]) { pauseTimer(); S.phase = 'result'; }
      } else { S.d.wrong[t]++; S.d.last[t] = String(a.text).slice(0, 30); }
      break; }
    case 'diag': { // round 4
      if (R !== 4 || S.phase !== 'play' || t !== active() || S.d.choice != null) break;
      S.d.choice = +a.c;
      if (S.d.choice === curItem().a) award(t, 2, 'Correct diagnosis');
      pauseTimer(); S.phase = 'judge';
      break; }
    case 'judge':
      if (R !== 4 || S.phase !== 'judge') break;
      S.d.clear = a.ok === '1' || a.ok === 1;
      if (S.d.clear) award(active(), 1, 'Clear English');
      S.phase = 'result';
      break;
    case 'buzz': // round 5
      if (R !== 5 || S.phase !== 'play' || t === S.d.holder) break;
      pauseTimer(); S.d.buzzedBy = t; S.phase = 'buzz';
      break;
    case 'rule':
      if (R !== 5 || S.phase !== 'buzz') break;
      if (a.ok === '1' || a.ok === 1) { award(S.d.buzzedBy, 1, 'Good buzz!'); S.d.holder = S.d.buzzedBy; S.d.buzzes[S.d.buzzedBy]++; }
      S.d.buzzedBy = null; S.phase = 'play'; resumeTimer();
      break;
  }
}
function enterItem(){
  S.phase = 'ready'; S.d = {}; LOCAL.sel = null;
  const ms = (S.round === 3 && S.idx === REBUS.length ? 60 : RD().time) * 1000;
  S.timer = {running:false, rem:ms, dur:ms, end:0};
}
function startPlay(){
  const R = S.round;
  if (R === 1) S.d = {tried:[], grid:shuffle(PART_KEYS), ok:false};
  if (R === 2) S.d = {ans:[null,null], at:[0,0]};
  if (R === 3) S.d = {solved:[false,false], order:[], wrong:[0,0], last:['',''], hint:false};
  if (R === 4) S.d = {choice:null, clear:null};
  if (R === 5) S.d = {holder:active(), buzzedBy:null, buzzes:[0,0]};
  S.phase = 'play'; startTimer(S.timer.dur);
}
function r2reveal(){
  pauseTimer(); S.phase = 'result';
  const c = curItem().a, ok = [S.d.ans[0] === c, S.d.ans[1] === c];
  ok.forEach((o, t) => { if (o) award(t, 1, 'Correct answer'); });
  if (ok[0] && ok[1]) { const f = S.d.at[0] <= S.d.at[1] ? 0 : 1; award(f, 1, 'Fastest team'); S.d.fast = f; }
}
function onTimeUp(){
  if (S.screen !== 'item' || S.phase !== 'play') return;
  S.timer.running = false; S.timer.rem = 0;
  const R = S.round;
  if (R === 2) return r2reveal();
  if (R === 4) { S.phase = 'judge'; return; }
  if (R === 5) { award(S.d.holder, 2, 'Held the dialogue'); }
  S.phase = 'result';
}

/* ---------- dispatch & sync ---------- */
function act(a){
  unlockAudio();
  if (ROLE === 'guest') {
    if (netUp()) netPub('g', {k:'act', a});
    else toast('Not connected to the internet');
    if (!LINK.ok) toast('Waiting for the Team A device…');
    return;
  }
  apply(a, 'host');
}
function apply(a, from){
  PEND = [];
  reduce(a, from);
  if (PEND.length) S.flash = {id:(S.flash ? S.flash.id : 0) + 1, items:PEND};
  commit();
}
function packed(){ return Object.assign({}, S, {timer:Object.assign({}, S.timer, {rem:remaining()})}); }
function commit(){
  LS.set('mr-state', S);
  sendState();
  render();
}

/* Linking through public MQTT relay servers (works across networks, no direct device-to-device connection).
   Both devices connect to every relay they can reach and send each message to all of them; duplicates are ignored. */
const BROKERS = [
  {url:'wss://public.cloud.shiftr.io', o:{username:'public', password:'public'}},
  {url:'wss://broker.emqx.io:8084/mqtt', o:{}},
  {url:'wss://test.mosquitto.org:8081/mqtt', o:{}}
];
const rid = () => Math.random().toString(36).slice(2, 10);
const NET = {clients:[], code:'', me:rid(), n:0, seen:new Set(), lastSeq:0, lastPeer:0, started:0};
const topic = sub => 'emerald-mrelay/v1/' + NET.code + '/' + sub;
const netUp = () => NET.clients.some(c => c.connected);
function newCode(){ const L = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let c = ''; for (let i = 0; i < 4; i++) c += L[Math.floor(Math.random() * L.length)]; return c; }
function netStart(code, subs, onMsg, onConnect){
  netStop(); NET.code = code; NET.started = Date.now(); NET.lastPeer = 0; NET.lastSeq = 0;
  if (typeof mqtt === 'undefined') return;
  NET.clients = BROKERS.map(b => {
    let c;
    try { c = mqtt.connect(b.url, Object.assign({clientId:'emr-' + rid(), keepalive:30, reconnectPeriod:3000, connectTimeout:8000, clean:true}, b.o)); }
    catch(e){ return null; }
    c.on('connect', () => { c.subscribe(subs.map(topic)); if (onConnect) onConnect(c); });
    c.on('message', (t, p) => {
      let m; try { m = JSON.parse(p.toString()); } catch(e){ return; }
      if (!m || m.from === NET.me) return;
      if (m.id) { if (NET.seen.has(m.id)) return; NET.seen.add(m.id); if (NET.seen.size > 600) NET.seen = new Set([...NET.seen].slice(-300)); }
      onMsg(t.split('/').pop(), m);
    });
    c.on('error', () => {});
    return c;
  }).filter(Boolean);
}
function netPub(sub, m, retain, onlyClient){
  m.from = NET.me; m.id = NET.me + '-' + (++NET.n);
  const s = JSON.stringify(m);
  (onlyClient ? [onlyClient] : NET.clients).forEach(c => { if (c.connected) { try { c.publish(topic(sub), s, {qos:0, retain:!!retain}); } catch(e){} } });
}
function netStop(clear){
  NET.clients.forEach(c => { try { if (clear && c.connected) c.publish(topic('s'), '', {retain:true}); c.end(false); } catch(e){} });
  NET.clients = [];
}
function sendState(){ if (ROLE === 'host' && NET.clients.length) netPub('s', {k:'state', seq:Date.now() * 100 + (NET.n % 100), s:packed()}, true); }

function hostRoom(code){
  LINK.code = code; LS.set('mr-code', code); LINK.status = 'opening'; LINK.ok = false; render();
  netStart(code, ['g'], (sub, m) => {
    NET.lastPeer = Date.now();
    if (!LINK.ok) { LINK.ok = true; LINK.status = 'linked'; beep(660, .12); render(); }
    if (m.k === 'hello') sendState();
    if (m.k === 'act' && m.a) apply(m.a, 'guest');
  }, c => { if (!LINK.ok) { LINK.status = 'waiting'; render(); } sendState(); });
}
function joinRoom(code){
  LINK.code = code; LS.set('mr-join', code); LINK.status = 'connecting'; LINK.ok = false; render();
  netStart(code, ['s', 'h'], (sub, m) => {
    NET.lastPeer = Date.now();
    if (sub === 's' && m.k === 'state' && m.s && m.seq > NET.lastSeq) {
      NET.lastSeq = m.seq; m.s.timer.end = Date.now() + m.s.timer.rem; S = m.s;
    }
    if (!LINK.ok) { LINK.ok = true; LINK.status = 'linked'; LOCAL.err = ''; beep(660, .12); }
    render();
  }, c => netPub('g', {k:'hello'}, false, c));
}
/* heartbeat: each device says "I'm here" every 4 s; 12 s of silence = link lost */
setInterval(() => {
  if (!NET.clients.length || (ROLE !== 'host' && ROLE !== 'guest')) return;
  const now = Date.now();
  netPub(ROLE === 'host' ? 'h' : 'g', {k:'ping'});
  const up = netUp();
  if (LINK.ok && now - NET.lastPeer > 12000) { LINK.ok = false; LINK.status = ROLE === 'host' ? 'waiting' : 'reconnecting'; render(); }
  else if (!up && now - NET.started > 10000 && LINK.status !== 'offline') { LINK.status = 'offline'; render(); }
  else if (up && LINK.status === 'offline') { LINK.status = LINK.ok ? 'linked' : (ROLE === 'host' ? 'waiting' : 'connecting'); render(); }
  if (ROLE === 'guest' && !S && !LINK.ok && now - NET.started > 12000 && up) {
    LOCAL.err = 'Room ' + LINK.code + ' not found. Check the code, and that the Team A device has the game open.';
    netStop(); ROLE = null; LINK.status = ''; render();
  }
}, 4000);

/* ---------- sound ---------- */
let AC = null;
function unlockAudio(){ if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){} } if (AC && AC.state === 'suspended') AC.resume(); }
function beep(f, d, type){ if (!AC) return; try { const o = AC.createOscillator(), g = AC.createGain(); o.type = type || 'sine'; o.frequency.value = f; g.gain.setValueAtTime(.18, AC.currentTime); g.gain.exponentialRampToValueAtTime(.001, AC.currentTime + d); o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + d); } catch(e){} }

/* ---------- rendering ---------- */
const app = $('#app');
function captureFocus(){ const el = document.activeElement; if (el && el.id && (el.tagName === 'INPUT')) return {id:el.id, v:el.value, s:el.selectionStart, e:el.selectionEnd}; return null; }
function restoreFocus(f){ if (!f) return; const el = document.getElementById(f.id); if (!el) return; el.value = f.v; el.focus(); try { el.setSelectionRange(f.s, f.e); } catch(e){} }

function panels(list){ // list of [team, html]; show only my team's panel, or all on one device
  const mine = me();
  const shown = list.filter(([t]) => mine === null || t === mine);
  if (!shown.length) return '';
  return `<div class="${shown.length > 1 ? 'duo' : 'solo'}">${shown.map(([t, h]) => `<section class="panel ${TEAMCLS[t]}"><div class="ph">${tag(t)}${mine === null ? '' : '<span class="you">your device</span>'}</div>${h}</section>`).join('')}</div>`;
}
const btn = (label, a, extra='', cls='btn') => `<button class="${cls}" data-a="${a}" ${extra}>${label}</button>`;

function render(){
  const f = captureFocus();
  renderBoard();
  let h;
  if (!ROLE) h = viewStart();
  else if (!S) h = viewJoining();
  else h = ({lobby:viewLobby, home:viewHome, intro:viewIntro, item:viewItem, roundEnd:viewRoundEnd, final:viewFinal})[S.screen]();
  app.innerHTML = h;
  restoreFocus(f);
  if (LOCAL.menu) renderMenu();
  showFlash();
  tick();
}
function renderBoard(){
  const b = $('#board');
  if (!S || !ROLE) { b.innerHTML = ''; b.hidden = true; return; }
  b.hidden = false;
  const live = S.screen === 'item';
  b.innerHTML = `<div class="sc ${TEAMCLS[0]}"><span class="sn">${tname(0)}</span><b>${S.teams[0].score}</b></div>
    <button class="clock ${live ? '' : 'idle'}" id="clock" data-a="pt" title="Pause / resume">${live ? '' : (S.round ? 'R' + S.round : '—')}</button>
    <div class="sc ${TEAMCLS[1]}"><b>${S.teams[1].score}</b><span class="sn">${tname(1)}</span></div>`;
}
function fmt(ms){ const s = Math.ceil(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
function tick(){
  if (!S || !ROLE) return;
  const c = document.getElementById('clock');
  if (c && S.screen === 'item') {
    const r = remaining();
    c.textContent = fmt(r) + (S.timer.running || S.phase !== 'play' ? '' : ' ⏸');
    c.classList.toggle('low', r <= 10000 && S.phase === 'play');
    const bar = document.getElementById('tbar'); if (bar) bar.style.width = (S.timer.dur ? 100 * r / S.timer.dur : 0) + '%';
  }
  if (isHost() && S.screen === 'item' && S.phase === 'play') {
    if (S.timer.running && remaining() <= 0) { beep(220, .5, 'square'); apply({t:'timeup'}, 'host'); return; }
    if (S.round === 3 && !S.d.hint && remaining() <= S.timer.dur / 2) { S.d.hint = true; commit(); }
  }
}
setInterval(tick, 200);

function toast(msg, cls){ const el = $('#toast'); el.innerHTML = msg; el.className = 'show ' + (cls || ''); clearTimeout(toast.t); toast.t = setTimeout(() => el.className = '', 2600); }
function showFlash(){
  if (!S || !S.flash || S.flash.id <= lastFlash) return;
  const first = lastFlash === 0 && ROLE === 'guest';
  lastFlash = S.flash.id;
  if (first) return;
  const html = S.flash.items.map(x => `<div>${tag(x.t)} <b>${x.p > 0 ? '+' : ''}${x.p}</b> ${esc(x.why)}</div>`).join('');
  toast(html, 'pts');
  if (S.flash.items.some(x => x.p > 0)) { beep(880, .12); setTimeout(() => beep(1175, .18), 120); }
}

/* ----- screens ----- */
function viewStart(){
  const saved = LS.get('mr-state', null), savedRole = LS.get('mr-role', null);
  return `<div class="hero"><img class="sq" src="%%LOGO_SQ%%" width="251" height="257" alt="Emerald Language Learning">
    <h1>Maintenance Relay</h1><p class="lead">A team game for light aircraft mechanics: 5 rounds, 2 teams, 2 devices.</p></div>
    <div class="cards3">
      <div class="card"><div class="circ">A</div><h3>Team A device</h3><p>This device hosts the game and shows a room code.</p>${btn('Host the game', 'L:host')}</div>
      <div class="card"><div class="circ b">B</div><h3>Team B device</h3><p>Type the room code shown on the Team A device.</p>
        <form data-f="join" class="joinf"><input id="code" maxlength="4" autocomplete="off" autocapitalize="characters" placeholder="CODE" value="${esc(LS.get('mr-join', ''))}"><button class="btn">Join</button></form>
        ${LOCAL.err ? `<p class="err">${esc(LOCAL.err)}</p>` : ''}</div>
      <div class="card"><div class="circ g">1</div><h3>One device</h3><p>No link needed: both teams play on this screen.</p>${btn('Play on one device', 'L:solo', '', 'btn ghost')}</div>
    </div>
    ${saved && savedRole && savedRole !== 'guest' && saved.screen !== 'lobby' ? `<p class="center">${btn('Resume the last game (' + esc(saved.teams[0].name) + ' ' + saved.teams[0].score + ' – ' + saved.teams[1].score + ' ' + esc(saved.teams[1].name) + ')', 'L:resume', '', 'btn ghost')}</p>` : ''}
    <p class="note">Linking the two devices needs the internet (the same Wi-Fi is best). The iPad plays in Safari; the Android tablet can use the app or the same web page.</p>`;
}
function viewJoining(){
  return `<div class="hero"><img class="sq" src="%%LOGO_SQ%%" width="251" height="257" alt="Emerald Language Learning"><h2 class="h2">Joining room ${esc(LINK.code)}…</h2>
    <p class="lead">${LINK.status === 'offline' ? 'No internet connection.' : 'Connecting to the Team A device.'}</p>${btn('Back', 'L:quit', '', 'btn ghost')}</div>`;
}
function linkBox(){
  if (ROLE === 'solo') return `<div class="link solo-l">One-device mode: both teams play on this screen.</div>`;
  const st = {waiting:'Waiting for the Team B device…', linked:'Team B device connected ✓', opening:'Opening the room…', offline:'No internet: the devices cannot link. You can still play on one device.', connecting:'Connecting…', reconnecting:'Connection lost, reconnecting…'}[LINK.status] || '';
  if (ROLE === 'host') return `<div class="link ${LINK.ok ? 'ok' : ''}"><div>Room code</div><div class="code">${esc(LINK.code || '…')}</div><div class="st">${st}</div>${LINK.ok ? '' : '<div class="st small">On the Team B device: open the game, choose <b>Join</b>, type this code.</div>'}</div>`;
  return `<div class="link ${LINK.ok ? 'ok' : ''}"><div>Room <b>${esc(LINK.code)}</b></div><div class="st">${LINK.ok ? 'Connected to the Team A device ✓' : st}</div></div>`;
}
function viewLobby(){
  const mine = me();
  const teamCard = t => {
    const ed = mine === null || mine === t, dis = ed ? '' : 'disabled';
    return `<div class="card team ${TEAMCLS[t]}"><div class="circ ${t ? 'b' : ''}">${t ? 'B' : 'A'}</div>
      <label>Team name<input id="tn${t}" data-team="${t}" data-k="name" value="${esc(S.teams[t].name)}" ${dis}></label>
      ${[0,1,2,3].map(i => `<label>Player ${i + 1}${i === 3 ? ' <span class="opt">(if 4)</span>' : ''}<input id="p${t}${i}" data-team="${t}" data-k="p" data-p="${i}" value="${esc(S.teams[t].players[i])}" placeholder="Name" ${dis}></label>`).join('')}
      ${ed ? '' : '<p class="small">The other device fills this in.</p>'}</div>`;
  };
  return `<h2 class="h2">The teams</h2>${linkBox()}<div class="duo">${teamCard(0)}${teamCard(1)}</div>
    <p class="small center">Player names are optional. They are used to choose who explains or speaks in each turn.</p>
    <p class="center">${btn('Continue to the rounds →', 'home', '', 'btn big')}</p>`;
}
function viewHome(){
  return `<h2 class="h2">The rounds</h2>${ROLE !== 'solo' && !LINK.ok ? linkBox() : ''}
    <div class="rounds">${[1,2,3,4,5].map(r => { const R = ROUNDS[r]; return `<button class="card rcard ${S.done[r] ? 'done' : ''}" data-a="intro" data-r="${r}">
      <div class="circ">${S.done[r] ? '✓' : r}</div><h3>${R.title}</h3><p>${R.short}</p>
      ${S.done[r] ? `<p class="small">${tname(0)} ${S.rp[r][0]} · ${tname(1)} ${S.rp[r][1]}</p>` : ''}</button>`; }).join('')}</div>
    <p class="center">${btn('Final scores', 'final', '', 'btn ghost')} ${btn('Edit teams', 'L:lobby', '', 'btn ghost')}</p>`;
}
function viewIntro(){
  const R = RD();
  return `<div class="intro"><div class="circ big">${R.n}</div><h2 class="h2">${R.title}</h2>
    <div class="card left"><h3>How to play</h3><ul>${R.rules.map(x => `<li>${x}</li>`).join('')}</ul>
    <h3>Points</h3><ul class="pts">${R.points.map(x => `<li>${x}</li>`).join('')}</ul>
    <p class="small">${itemsOf(R.n).length} ${R.unit.toLowerCase()}s · the trainer can end the round at any time from the menu ☰.</p></div>
    <p class="center">${btn('Back', 'home', '', 'btn ghost')} ${btn('Start the round', 'begin', '', 'btn big')}</p></div>`;
}
function viewRoundEnd(){
  const r = S.round;
  return `<div class="intro"><div class="circ big">✓</div><h2 class="h2">End of round ${r}</h2>
    <div class="duo">${[0,1].map(t => `<div class="card ${TEAMCLS[t]}"><h3>${tname(t)}</h3><div class="bigscore">+${S.rp[r][t]}</div><p>Total: <b>${S.teams[t].score}</b></p></div>`).join('')}</div>
    <p class="center">${btn('Back to the rounds', 'home', '', 'btn ghost')} ${r < 5 ? btn('Round ' + (r + 1) + ' →', 'intro', `data-r="${r + 1}"`, 'btn big') : btn('Final scores →', 'final', '', 'btn big')}</p></div>`;
}
function viewFinal(){
  const a = S.teams[0].score, b = S.teams[1].score;
  const head = a === b ? 'It’s a draw!' : `${tname(a > b ? 0 : 1)} win${''}!`;
  return `<div class="intro"><div class="circ big">★</div><h2 class="h2">${head}</h2>
    <table class="tbl"><tr><th>Round</th><th>${tname(0)}</th><th>${tname(1)}</th></tr>
    ${[1,2,3,4,5].map(r => `<tr><td>${r}. ${ROUNDS[r].title}</td><td>${S.rp[r][0]}</td><td>${S.rp[r][1]}</td></tr>`).join('')}
    ${S.rp[0][0] || S.rp[0][1] ? `<tr><td>Adjustments</td><td>${S.rp[0][0]}</td><td>${S.rp[0][1]}</td></tr>` : ''}
    <tr class="tot"><td>Total</td><td>${a}</td><td>${b}</td></tr></table>
    <p class="center">${btn('Back to the rounds', 'home', '', 'btn ghost')} ${btn('New game', 'L:reset', '', 'btn')}</p></div>`;
}

function viewItem(){
  const R = RD(), n = itemsOf(S.round).length;
  const label = S.round === 3 && S.idx === REBUS.length ? 'Mystery word' : `${R.unit} ${S.idx + 1} of ${S.round === 3 ? REBUS.length : n}`;
  const body = [null, r1, r2, r3, r4, r5][S.round]();
  const nextBtn = S.phase === 'result' ? `<p class="center">${btn(S.idx + 1 >= n ? 'Finish the round →' : 'Next →', 'next', '', 'btn big')}</p>` : '';
  return `<div class="ihead"><span class="rt">Round ${S.round} · ${R.title}</span><span class="rl">${label}</span></div>
    <div class="tbar"><i id="tbar"></i></div>${body}${nextBtn}`;
}
const startBtn = secs => `<p class="center">${btn('Start the clock (' + secs + ')', 'go', '', 'btn big')}</p>`;
function cover(key, label, inner){
  if (me() !== null || LOCAL.reveal[key]) return inner;
  return `<div class="cover"><p>${label}</p>${btn('Show', 'L:reveal', `data-k="${key}"`, 'btn ghost')}</div>`;
}
const rkey = () => S.round + '-' + S.idx;

/* Round 1 */
function r1(){
  const it = curItem(), ex = active(), gu = 1 - ex, P = PARTS[it.part];
  if (S.phase === 'ready') return `<div class="card stage"><p class="role">${tag(ex)} explains · explainer: <b>${playerFor(ex)}</b></p><p class="role">${tag(gu)} finds the part on their device</p>
    <p>Explainer: read the card silently, then explain the repair. Don’t say the words on the card!</p></div>${startBtn('1:00')}`;
  if (S.phase === 'play') {
    const card = `<div class="scard">${cover(rkey(), 'Explainer only! Team ' + (ex ? 'B' : 'A') + ': tap to see your card.', `<div class="target">${pic(it.part)}<div><div class="small">Target part</div><b>${P.name}</b></div></div><p class="scen">${esc(it.text)}</p><div class="taboo">Don’t say: ${it.taboo.map(w => `<span>${esc(w)}</span>`).join('')}</div>`)}</div>`;
    const grid = `<p class="small">Tries left: <b>${3 - S.d.tried.length}</b></p><div class="grid">${S.d.grid.map(k => { const tr = S.d.tried.includes(k); return `<button class="part ${tr ? 'no' : ''}" data-a="pick" data-team="${gu}" data-part="${k}" ${tr ? 'disabled' : ''}>${pic(k)}<span>${PARTS[k].name}</span></button>`; }).join('')}</div>`;
    return panels([[ex, `<p class="small">Explainer: <b>${playerFor(ex)}</b></p>${card}`], [gu, grid]]);
  }
  return `<div class="card stage result ${S.d.ok ? 'good' : 'bad'}"><h3>${S.d.ok ? 'Found it!' : (S.d.tried.length >= 3 ? 'No more tries!' : 'Time’s up!')}</h3>
    <div class="target big">${pic(it.part)}<b>${P.name}</b></div><p class="scen">${esc(it.text)}</p>
    ${S.d.tried.length ? `<p class="small">Wrong tries: ${S.d.tried.map(k => PARTS[k].name).join(', ')}</p>` : ''}</div>`;
}
/* Round 2 */
function r2(){
  const it = curItem();
  if (S.phase === 'ready') return `<div class="card stage"><p class="role">Both teams answer on their own device.</p><p>30 seconds. +1 for a correct answer, +1 bonus for the faster team if both are right.</p></div>${startBtn('0:30')}`;
  const L = 'ABCD';
  const q = `<div class="card qcard"><h3>${esc(it.q)}</h3>${viz(it.v)}</div>`;
  if (S.phase === 'play') {
    const pane = t => S.d.ans[t] != null
      ? `<p class="locked">Answer locked: <b>${L[S.d.ans[t]]}. ${esc(it.o[S.d.ans[t]])}</b></p><p class="small">Waiting for ${tname(1 - t)}…</p>`
      : `<div class="opts">${it.o.map((o, i) => `<button class="opt" data-a="ans" data-team="${t}" data-c="${i}"><b>${L[i]}</b> ${esc(o)}</button>`).join('')}</div>${S.d.ans[1 - t] != null ? `<p class="small">${tname(1 - t)} has answered!</p>` : ''}`;
    return q + panels([[0, pane(0)], [1, pane(1)]]);
  }
  return `<div class="card qcard"><h3>${esc(it.q)}</h3>${viz(it.v)}
    <div class="opts rev">${it.o.map((o, i) => `<div class="opt ${i === it.a ? 'right' : ''}"><b>${L[i]}</b> ${esc(o)} ${[0,1].filter(t => S.d.ans[t] === i).map(t => tag(t)).join(' ')}</div>`).join('')}</div>
    <p class="ex">${esc(it.ex)}</p></div>`;
}
/* Round 3 */
function lettersBank(upto){
  return `<div class="bank">${REBUS.map((r, i) => `<span class="tile ${i < upto ? 'on' : ''}">${i < upto ? r.word[0] : '?'}</span>`).join('')}</div>`;
}
function rebusPic(it){ return `<div class="rebus">${it.parts.map(x => x.p ? pic(x.p, 'rp') : `<span class="op">${esc(x.t)}</span>`).join('')}</div>`; }
function r3(){
  const it = curItem(), final = S.idx === REBUS.length;
  const done = final ? REBUS.length : S.idx + (S.phase === 'result' ? 1 : 0);
  if (S.phase === 'ready') return `<div class="card stage">${final ? `<h3>The mystery word</h3><p>Unscramble the 5 letters to find an aircraft word.</p>${lettersBank(5)}<p class="small">First team +3, second team +1. 1 minute.</p>`
    : `<p class="role">Rebus ${S.idx + 1} of 5. Both teams type the answer on their device.</p><p class="small">The answer is an aircraft word. First team +2, second team +1. A hint appears at half time.</p>${lettersBank(S.idx)}`}</div>${startBtn(final ? '1:00' : '1:30')}`;
  const top = final ? `<div class="card qcard"><h3>Unscramble the letters</h3><div class="bank scr">${shuffleFixed(REBUS.map(r => r.word[0]))}</div>${S.d.hint || S.phase === 'result' ? `<p class="hint">Hint: ${esc(it.hint)}</p>` : ''}</div>`
    : `<div class="card qcard">${rebusPic(it)}${S.d.hint || S.phase === 'result' ? `<p class="hint">Hint: ${esc(it.hint)}</p>` : ''}${lettersBank(done)}</div>`;
  if (S.phase === 'play') {
    const pane = t => S.d.solved[t] ? `<p class="locked good">Solved! ${S.d.order[0] === t ? '(1st)' : '(2nd)'}</p>`
      : `<form data-f="guess" data-team="${t}" class="guessf"><input id="g${t}" autocomplete="off" autocapitalize="characters" placeholder="Your answer"><button class="btn">Check</button></form>
        ${S.d.wrong[t] ? `<p class="err">“${esc(S.d.last[t])}” is not right. Try again! (${S.d.wrong[t]})</p>` : ''}${S.d.solved[1 - t] ? `<p class="small">${tname(1 - t)} has solved it!</p>` : ''}`;
    return top + panels([[0, pane(0)], [1, pane(1)]]);
  }
  return top + `<div class="card stage result good"><h3>${esc(it.word)}</h3>
    ${final ? '' : `<p>First letter: <span class="tile on">${it.word[0]}</span></p>`}
    <p class="small">${S.d.order.length ? S.d.order.map((t, i) => tag(t) + (i ? ' 2nd' : ' 1st')).join(' · ') : 'Nobody found it.'}</p></div>`;
}
function shuffleFixed(arr){ const order = [2, 4, 0, 3, 1]; return order.map(i => `<span class="tile on">${arr[i]}</span>`).join(''); }
/* Round 4 */
function r4(){
  const it = curItem(), mech = active(), pil = 1 - mech;
  const head = `<p class="role">${tag(mech)} mechanics · ${tag(pil)} pilot (${playerFor(pil)})</p>`;
  const pilotCard = `<div class="scard">${cover(rkey(), 'Pilot team only: tap to see the role card.', `<h3>${esc(it.title)} – pilot card</h3><p><b>Start with:</b> ${esc(it.say)}</p><p><b>Say only if they ask:</b></p><ul>${it.ifAsked.map(x => `<li>${esc(x)}</li>`).join('')}</ul><p class="secret"><b>The real fault (secret!):</b> ${esc(it.fault)}</p><p><b>A good mechanic should:</b> ${esc(it.fix)}</p>`)}</div>`;
  if (S.phase === 'ready') return `<div class="card stage">${head}<p>Pilot team: read your card now. Mechanics: when the clock starts, ask questions, then choose your diagnosis. 4 minutes.</p></div>` + panels([[pil, pilotCard]]) + startBtn('4:00');
  if (S.phase === 'play') {
    const mechPane = `<h3>${esc(it.title)}</h3><p>${esc(it.brief)}</p><p class="small">Useful questions:</p><div class="chips">${it.ask.map(x => `<span>${esc(x)}</span>`).join('')}</div>
      <h3>Your diagnosis</h3><div class="opts">${it.opts.map((o, i) => `<button class="opt ${LOCAL.sel === i ? 'sel' : ''}" data-a="L:sel" data-c="${i}">${esc(o)}</button>`).join('')}</div>
      ${LOCAL.sel != null ? `<p class="center">${btn('Confirm: ' + esc(it.opts[LOCAL.sel]), 'diag', `data-team="${mech}" data-c="${LOCAL.sel}"`)}</p>` : '<p class="small">Choose one, then confirm. Only one try!</p>'}`;
    return `<div class="card stage">${head}</div>` + panels([[mech, mechPane], [pil, pilotCard]]);
  }
  const ok = S.d.choice === it.a;
  const res = `<div class="card stage result ${ok ? 'good' : 'bad'}"><h3>${S.d.choice == null ? 'Time’s up! No diagnosis.' : (ok ? 'Correct diagnosis!' : 'Wrong diagnosis: ' + esc(it.opts[S.d.choice]))}</h3>
    <p><b>Fault:</b> ${esc(it.fault)}</p><p><b>Fix:</b> ${esc(it.fix)}</p></div>`;
  if (S.phase === 'judge') return res + panels([[pil, `<p>Did the mechanics ask clear questions and explain the fix in English?</p><p class="center">${btn('Yes, +1', 'judge', 'data-ok="1"')} ${btn('No', 'judge', 'data-ok="0"', 'btn ghost')}</p>`], [mech, `<p class="small">Waiting for the pilot team’s verdict…</p>`]].filter(([t]) => me() === null ? t === pil : true));
  return res + `<p class="center small">Clear English: ${S.d.clear ? '+1 ✓' : 'no point'}</p>`;
}
/* Round 5 */
function r5(){
  const it = curItem(), sp = active();
  const topic = `<div class="card qcard left"><h3>${esc(it.title)}</h3><ol>${it.roles.map(r => `<li>${esc(r)}</li>`).join('')}</ol><div class="chips">${it.phrases.map(x => `<span>${esc(x)}</span>`).join('')}</div></div>`;
  if (S.phase === 'ready') return topic + `<div class="card stage"><p class="role">${tag(sp)} speaks first: <b>${playerFor(sp)}</b> &amp; <b>${playerFor(sp, 1)}</b></p><p class="small">2 minutes without stopping. Hesitate and ${tname(1 - sp)} can buzz in!</p></div>${startBtn('2:00')}`;
  const h = S.d.holder;
  if (S.phase === 'play') {
    const talk = `<p class="locked good">You’re talking! Keep going…</p>`;
    const buzz = `<button class="buzz" data-a="buzz" data-team="${1 - h}">BUZZ!</button><p class="small center">Buzz if you hear a hesitation.</p>`;
    return `<div class="card stage"><p class="role">Speaking now: ${tag(h)}</p></div>` + topic + panels([[h, talk], [1 - h, buzz]]);
  }
  if (S.phase === 'buzz') return `<div class="card stage buzzed"><h3>${tname(S.d.buzzedBy)} buzzed!</h3><p>Trainer: was there a hesitation?</p>
    <p class="center">${btn('Yes: ' + tname(S.d.buzzedBy) + ' takes over (+1)', 'rule', 'data-ok="1"')} ${btn('No: ' + tname(h) + ' continues', 'rule', 'data-ok="0"', 'btn ghost')}</p></div>`;
  return `<div class="card stage result good"><h3>Time’s up!</h3><p>${tag(h)} held the dialogue to the end: +2</p><p class="small">Accepted buzzes: ${tname(0)} ${S.d.buzzes[0]} · ${tname(1)} ${S.d.buzzes[1]}</p></div>`;
}

/* ----- menu ----- */
function renderMenu(){
  const m = $('#menu');
  m.hidden = false;
  if (!S) { m.innerHTML = `<div class="mbox"><button class="x" data-a="L:menu">×</button><p>${btn('Back to start', 'L:quit', '', 'btn ghost')}</p></div>`; return; }
  m.innerHTML = `<div class="mbox"><button class="x" data-a="L:menu" aria-label="Close">×</button>
    ${linkBox()}
    <h3>Rounds</h3><div class="mrounds">${[1,2,3,4,5].map(r => btn(r + '. ' + ROUNDS[r].title, 'intro', `data-r="${r}"`, 'mlink')).join('')}${btn('Final scores', 'final', '', 'mlink')}${btn('Teams', 'L:lobby', '', 'mlink')}</div>
    ${S.screen === 'item' ? `<p>${btn('End this round', 'endRound', '', 'btn ghost')} ${S.phase === 'play' ? btn(S.timer.running ? 'Pause the clock' : 'Resume the clock', 'pt', '', 'btn ghost') : ''}</p>` : ''}
    <h3>Adjust scores</h3>${[0,1].map(t => `<div class="adj">${tag(t)} <b>${S.teams[t].score}</b> ${btn('−1', 'adj', `data-team="${t}" data-d="-1"`, 'btn ghost sm')} ${btn('+1', 'adj', `data-team="${t}" data-d="1"`, 'btn sm')}</div>`).join('')}
    <h3>Game</h3><p>${isHost() ? btn('New game (scores to 0)', 'L:reset', '', 'btn ghost') : ''} ${btn('Leave / change device role', 'L:quit', '', 'btn ghost')}</p></div>`;
}

/* ----- events ----- */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-a]');
  if (!b || b.disabled) return;
  const a = {t:b.dataset.a};
  for (const k in b.dataset) if (k !== 'a') a[k] = b.dataset[k];
  ['team','c','r','d'].forEach(k => { if (a[k] != null) a[k] = +a[k]; });
  if (a.t.startsWith('L:')) return local(a.t.slice(2), a, b);
  if (b.closest('#menu')) { LOCAL.menu = false; $('#menu').hidden = true; }
  act(a);
});
document.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  if (f.dataset.f === 'join') { const c = f.querySelector('input').value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4); if (c.length === 4) { LOCAL.err = ''; ROLE = 'guest'; LS.set('mr-role', 'guest'); unlockAudio(); joinRoom(c); } else { LOCAL.err = 'The code has 4 characters.'; render(); } }
  if (f.dataset.f === 'guess') { const inp = f.querySelector('input'); const v = inp.value; if (!norm(v)) return; inp.value = ''; inp.blur(); act({t:'guess', team:+f.dataset.team, text:v}); }
});
document.addEventListener('change', e => {
  const i = e.target;
  if (!i.dataset || !i.dataset.k || i.dataset.team == null) return;
  if (i.dataset.k === 'name') act({t:'setTeam', team:+i.dataset.team, name:i.value});
  else act({t:'setTeam', team:+i.dataset.team, p:+i.dataset.p, val:i.value});
});
$('#menuBtn').addEventListener('click', () => { LOCAL.menu = !LOCAL.menu; if (LOCAL.menu) renderMenu(); else $('#menu').hidden = true; });
$('#menu').addEventListener('click', e => { if (e.target.id === 'menu') { LOCAL.menu = false; $('#menu').hidden = true; } });

function local(cmd, a){
  unlockAudio();
  switch (cmd) {
    case 'host':
      ROLE = 'host'; LS.set('mr-role', 'host');
      S = fresh(); commit(); hostRoom(newCode()); break;
    case 'solo':
      ROLE = 'solo'; LS.set('mr-role', 'solo'); S = fresh(); commit(); break;
    case 'resume': {
      const role = LS.get('mr-role', 'solo'); ROLE = role; S = LS.get('mr-state', null);
      if (!S) { ROLE = null; render(); break; }
      if (S.timer.running) pauseTimer();
      commit(); if (ROLE === 'host') hostRoom(LS.get('mr-code', null) || newCode()); break; }
    case 'reveal': LOCAL.reveal[a.k] = true; render(); break;
    case 'sel': LOCAL.sel = +a.c; render(); break;
    case 'menu': LOCAL.menu = false; $('#menu').hidden = true; break;
    case 'lobby': LOCAL.menu = false; $('#menu').hidden = true; if (isHost()) { S.screen = 'lobby'; commit(); } else act({t:'lobbyReq'}); break;
    case 'reset': if (confirmTwice('reset')) { LOCAL.menu = false; $('#menu').hidden = true; act({t:'reset'}); } break;
    case 'quit':
      if (S && ROLE !== 'guest' && !confirmTwice('quit')) break;
      LOCAL.menu = false; $('#menu').hidden = true;
      netStop(ROLE === 'host');
      Object.assign(LINK, {ok:false, code:'', status:''});
      ROLE = null; S = null; lastFlash = 0; render(); break;
  }
}
/* no browser dialogs: a second tap within 3 s confirms */
const confirmAt = {};
function confirmTwice(k){ const now = Date.now(); if (confirmAt[k] && now - confirmAt[k] < 3000) { confirmAt[k] = 0; return true; } confirmAt[k] = now; toast('Tap again to confirm'); return false; }


/* host: when the app comes back to the foreground, re-send the state */
document.addEventListener('visibilitychange', () => { if (!document.hidden && ROLE === 'host' && S) commit(); });

render();
