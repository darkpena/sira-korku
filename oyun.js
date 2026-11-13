/* three.js yalnızca Bekleme Salonu'na girerken yüklenir (eski Safari'de import map desteği yok) */
let THREE=null;
const loadThree=async()=>{ if(!THREE) THREE=await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'); return THREE; };

/* =========================================================
   YARDIMCILAR
   ========================================================= */
const $ = id => document.getElementById(id);
const Q = new URLSearchParams(location.search);
const SPEED = Q.has('hizli') ? 0.2 : 1;
const sleep = ms => new Promise(r => setTimeout(r, ms * SPEED));
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const rnd = (a,b) => a + Math.random()*(b-a);

/* ---------- ikonlar (Material) ---------- */
const P_ = {
  back:'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
  video:'M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z',
  call:'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
  more:'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
  search:'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
  camera:'M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z',
  mic:'M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z',
  attach:'M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z',
  emoji:'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z',
  send:'M2.01 21 23 12 2.01 3 2 10l15 2-15 2z',
  play:'M8 5v14l11-7z', pause:'M6 19h4V5H6v14zm8-14v14h4V5h-4z',
  callend:'M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.956.956 0 0 1-.29-.7c0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28a11.27 11.27 0 0 0-2.67-1.85.996.996 0 0 1-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z',
  missed:'M19.59 7 12 14.59 6.41 9H11V7H3v8h2v-4.59l7 7 9-9z',
  incoming:'M20 5.41 18.59 4 7 15.59V9H5v10h10v-2H8.41z',
  outgoing:'M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z',
  chats:'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z',
  updates:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-13a5 5 0 1 0 0 10 5 5 0 0 0 0-10z',
  groups:'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
  lock:'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z',
  archive:'M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5 6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z',
  newchat:'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 9h-4v4h-2v-4H7V9h4V5h2v4h4v2z',
  close:'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  share:'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z',
  speaker:'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z',
  micoff:'M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3 3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z',
  ticks:'M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41 6 19l1.41-1.41L1.83 12 .41 13.41z',
  mute:'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z',
  pin:'M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z',
  web:'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
  clock:'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
  settings:'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
  photo:'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
  wa:'M12 2C6.48 2 2 6.03 2 11c0 2.49 1.12 4.74 2.94 6.37L4 22l4.73-2.36c1.03.29 2.13.45 3.27.45 5.52 0 10-4.03 10-9S17.52 2 12 2zm4.9 12.32c-.21.58-1.2 1.11-1.66 1.15-.44.04-.85.2-2.86-.6-2.42-.96-3.95-3.44-4.07-3.6-.12-.16-.97-1.29-.97-2.46 0-1.17.61-1.74.83-1.98.22-.24.48-.3.64-.3l.46.01c.15 0 .35-.06.54.42.21.5.7 1.71.76 1.84.06.12.1.27.02.43-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.24.25-.1.49.14.24.62 1.02 1.33 1.65.92.82 1.69 1.07 1.93 1.19.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.15 1.16z',
};
const svg = (k) => `<svg viewBox="0 0 24 24"><path d="${P_[k]}"/></svg>`;
function paintIcons(root=document){ root.querySelectorAll('.ic[data-i]').forEach(e=>{ if(!e.firstChild) e.innerHTML=svg(e.dataset.i); }); }
paintIcons();

/* =========================================================
   SAAT, DURUM
   ========================================================= */
const S = {
  day:1, min:21*60+34, frozen:false, battery:64,
  screen:'lock', stack:[], mode:'phone', phoneOpen:false,
  chat:null, camMode:null, face:null, remain:24*3600, remainRun:false, cdZero:null,
};
const pad = n => String(n).padStart(2,'0');
const hhmm = (m=S.min) => pad(Math.floor(m/60)%24)+':'+pad(m%60);
const nowTs = () => S.day*1440 + S.min;
const DAYS = {1:['12 Kasım Perşembe','Perşembe, 12 Kasım'], 2:['13 Kasım Cuma','Cuma, 13 Kasım']};
function setClock(h,m,day){ if(day) S.day=day; S.min=h*60+m; paintStatus(); refreshChips(); }
function paintStatus(){
  const t = S.frozen && S.mode==='3d' ? (Math.random()<.5?'02:47':'--:--') : hhmm();
  $('sbTime').textContent=t; $('lkClock').textContent=hhmm(); $('hmClock').textContent=hhmm();
  $('lkDate').textContent=DAYS[S.day][0]; $('hmDate').textContent=DAYS[S.day][1];
  $('sbBatT').textContent=S.battery+'%'; const b=$('sbBat'); b.style.setProperty('--b',S.battery+'%'); b.classList.toggle('low',S.battery<=15);
}
setInterval(()=>{ if(!S.frozen){ S.min++; } paintStatus(); }, 20000*SPEED);
setInterval(()=>{ if(S.battery>4){ S.battery--; paintStatus(); } }, 50000*SPEED);

/* =========================================================
   SES MOTORU
   ========================================================= */
const A = {
  ctx:null, master:null, nb:null,
  init(){
    try{ if(navigator.audioSession) navigator.audioSession.type='playback'; }catch(e){}
    try{ // iOS: medya kanalını açmak için kısa sessiz bir WAV çal (sessiz mod düğmesine rağmen ses gelsin)
      const n=4410, b=new ArrayBuffer(44+n*2), v=new DataView(b), w=(o,t)=>{ for(let i=0;i<t.length;i++) v.setUint8(o+i,t.charCodeAt(i)); };
      w(0,'RIFF'); v.setUint32(4,36+n*2,true); w(8,'WAVE'); w(12,'fmt '); v.setUint32(16,16,true); v.setUint16(20,1,true); v.setUint16(22,1,true); v.setUint32(24,44100,true); v.setUint32(28,88200,true); v.setUint16(32,2,true); v.setUint16(34,16,true); w(36,'data'); v.setUint32(40,n*2,true);
      const u=new Audio(URL.createObjectURL(new Blob([b],{type:'audio/wav'}))); u.setAttribute('playsinline',''); const pr=u.play(); if(pr&&pr.catch) pr.catch(()=>{});
    }catch(e){}
    if(this.ctx){ this.ctx.resume(); return; }
    const c=this.ctx=new (window.AudioContext||window.webkitAudioContext)();
    if(c.state==='suspended') c.resume();
    this.master=c.createGain(); this.master.gain.value=.9;
    const comp=c.createDynamicsCompressor(); this.master.connect(comp); comp.connect(c.destination);
    const n=c.sampleRate*2; this.nb=c.createBuffer(1,n,c.sampleRate);
    const d=this.nb.getChannelData(0); for(let i=0;i<n;i++) d[i]=Math.random()*2-1;
  },
  env(g,t,a,peak,r){ g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(peak,t+a); g.gain.exponentialRampToValueAtTime(.0001,t+a+r); },
  tone(f,dur,o={}){
    const c=this.ctx; if(!c) return; const t=c.currentTime+(o.delay||0);
    const os=c.createOscillator(); os.type=o.type||'sine'; os.frequency.setValueAtTime(f,t);
    if(o.to) os.frequency.exponentialRampToValueAtTime(o.to,t+dur);
    const g=c.createGain(); this.env(g,t,o.a||.005,o.gain||.2,dur);
    os.connect(g); g.connect(o.dest||this.master); os.start(t); os.stop(t+dur+.1);
  },
  noise(dur,o={}){
    const c=this.ctx; if(!c) return; const t=c.currentTime+(o.delay||0);
    const s=c.createBufferSource(); s.buffer=this.nb; s.loop=true;
    const f=c.createBiquadFilter(); f.type=o.type||'bandpass'; f.frequency.value=o.f||1000; f.Q.value=o.q||1;
    const g=c.createGain(); this.env(g,t,o.a||.005,o.gain||.2,dur);
    let out=g; if(o.pan!=null){ const p=c.createStereoPanner(); p.pan.value=o.pan; g.connect(p); out=p; }
    s.connect(f); f.connect(g); out.connect(this.master); s.start(t,Math.random()); s.stop(t+dur+.1);
  },
  pop(){ this.tone(1046,.06,{gain:.1}); this.tone(1568,.08,{gain:.08,delay:.06}); },
  send(){ this.tone(700,.05,{gain:.06,to:1100}); },
  key(){ this.noise(.02,{type:'highpass',f:3000,gain:.05}); },
  glitch(d=.3){ this.noise(d,{type:'highpass',f:2500,gain:.25}); this.tone(90,d,{type:'square',gain:.08,to:35}); },
  hangup(){ for(let i=0;i<3;i++) this.tone(425,.18,{type:'square',gain:.06,delay:i*.36}); },
  beat(v=.5){ this.tone(68,.22,{gain:v,to:40}); this.tone(62,.22,{gain:v*.6,to:38,delay:.27}); },
  shutter(){ this.noise(.05,{type:'highpass',f:2000,gain:.3}); this.noise(.07,{type:'bandpass',f:1200,gain:.25,delay:.08}); },
  buzz(dur=1.2){ this.tone(48,dur,{type:'sawtooth',gain:.12,a:.02}); this.noise(dur,{type:'lowpass',f:150,gain:.12}); },
  ringStart(muffled=false){
    this.ringStop();
    const play=()=>[880,1175,880,1175,0,880,1175,880,1175].forEach((f,i)=>f&&this.tone(muffled?f/2:f,.11,{type:'sine',gain:muffled?.05:.13,delay:i*.12}));
    play(); this.ringT=setInterval(play,2400);
    try{ navigator.vibrate&&navigator.vibrate([600,300,600,1000,600,300,600]); }catch(e){}
  },
  ringStop(){ clearInterval(this.ringT); try{ navigator.vibrate&&navigator.vibrate(0); }catch(e){} },
  lineOn(){ const c=this.ctx; if(!c||this.line) return; const s=c.createBufferSource(); s.buffer=this.nb; s.loop=true; const f=c.createBiquadFilter(); f.type='bandpass'; f.frequency.value=1600; f.Q.value=.7; const g=c.createGain(); g.gain.value=.018; s.connect(f); f.connect(g); g.connect(this.master); s.start(); this.line={s}; },
  lineOff(){ if(this.line){ this.line.s.stop(); this.line=null; } },
  humOn(){
    const c=this.ctx; if(!c||this.hum) return;
    if(SFX.has('hum')){ this.hum={file:SFX.loop('hum',.35)}; return; }
    const o1=c.createOscillator(); o1.type='sawtooth'; o1.frequency.value=100;
    const f=c.createBiquadFilter(); f.type='lowpass'; f.frequency.value=380;
    const g=c.createGain(); g.gain.value=.03; o1.connect(f); f.connect(g); g.connect(this.master); o1.start();
    const o2=c.createOscillator(); o2.frequency.value=50; const g2=c.createGain(); g2.gain.value=.05; o2.connect(g2); g2.connect(this.master); o2.start();
    const s=c.createBufferSource(); s.buffer=this.nb; s.loop=true; const bf=c.createBiquadFilter(); bf.type='bandpass'; bf.frequency.value=6200; bf.Q.value=5; const bg=c.createGain(); bg.gain.value=.012; s.connect(bf); bf.connect(bg); bg.connect(this.master); s.start();
    this.hum={g,g2,bg,nodes:[o1,o2,s]};
  },
  humSet(v){ if(!this.hum) return; const t=this.ctx.currentTime; if(this.hum.file){ this.hum.file.g.gain.setTargetAtTime(.35*v,t,.02); return; } this.hum.g.gain.setTargetAtTime(.03*v,t,.02); this.hum.g2.gain.setTargetAtTime(.05*v,t,.02); this.hum.bg.gain.setTargetAtTime(.012*v,t,.02); },
  humOff(){ if(!this.hum) return; if(this.hum.file) this.hum.file.stop(); else this.hum.nodes.forEach(n=>n.stop()); this.hum=null; },
  droneOn(v=.25){
    const c=this.ctx; if(!c||this.drone) return;
    if(SFX.has('drone')){ this.drone=SFX.loop('drone',v); return; }
    const o=c.createOscillator(); o.type='sawtooth'; o.frequency.value=41;
    const o2=c.createOscillator(); o2.type='sawtooth'; o2.frequency.value=41.7;
    const f=c.createBiquadFilter(); f.type='lowpass'; f.frequency.value=170;
    const g=c.createGain(); g.gain.value=0; g.gain.setTargetAtTime(.07*v/.25,c.currentTime,2);
    o.connect(f); o2.connect(f); f.connect(g); g.connect(this.master); o.start(); o2.start();
    this.drone={g,stop:()=>{ g.gain.setTargetAtTime(0,c.currentTime,1); setTimeout(()=>{o.stop();o2.stop();},3000); }};
  },
  droneOff(){ if(this.drone){ this.drone.stop(); this.drone=null; } },
};

/* ---------- efektler: dosya varsa dosya, yoksa kodla ---------- */
const MANIFEST = new Set();
const BUF = {};
async function loadAudio(){
  try{
    const r = await fetch('ses/manifest.json',{cache:'no-store'}); if(!r.ok) return;
    const list = await r.json();
    await Promise.all(list.map(async id=>{
      try{ const a=await fetch('ses/'+id+'.mp3'); if(!a.ok) return; const ab=await a.arrayBuffer(); BUF[id]=await new Promise((ok,no)=>{ const pr=A.ctx.decodeAudioData(ab,ok,no); if(pr&&pr.catch) pr.catch(no); }); MANIFEST.add(id); }catch(e){}
    }));
  }catch(e){}
}
function playBuf(id,{gain=1,pan=0,rate=1,phone=false,loop=false,dur=0}={}){
  const c=A.ctx, b=BUF[id]; if(!c||!b) return null;
  const s=c.createBufferSource(); s.buffer=b; s.playbackRate.value=rate; s.loop=loop;
  let node=s;
  if(phone){
    const hp=c.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=320;
    const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=3300;
    const pk=c.createBiquadFilter(); pk.type='peaking'; pk.frequency.value=1800; pk.gain.value=5;
    node.connect(hp); hp.connect(lp); lp.connect(pk); node=pk;
  }
  const g=c.createGain(); g.gain.value=gain; node.connect(g);
  const p=c.createStereoPanner(); p.pan.value=pan; g.connect(p); p.connect(A.master);
  s.start();
  if(dur){ const t=c.currentTime; g.gain.setValueAtTime(gain,t+dur); g.gain.linearRampToValueAtTime(0.0001,t+dur+.6); s.stop(t+dur+.7); }
  return {s,g,dur:b.duration/rate,stop(fade=0){ try{ if(fade){ const t=c.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value,t); g.gain.linearRampToValueAtTime(0.0001,t+fade); s.stop(t+fade+.05); } else s.stop(); }catch(e){} }};
}
/* ortam sesi: normal atmosfer (ev, sabah) ↔ gerilim (uğultu) arasında yumuşak geçiş */
const AMB={cur:null,name:null};
function ambience(name,gain=.55){
  if(AMB.name===name) return;
  if(AMB.cur) AMB.cur.stop(2.5);
  AMB.cur=null; AMB.name=name;
  if(!name) return;
  if(name==='drone'){ A.droneOn(.3); AMB.cur={stop:()=>A.droneOff()}; return; }
  if(!MANIFEST.has('sfx_'+name)) return;
  const h=playBuf('sfx_'+name,{gain:.0001,loop:true}); if(!h) return;
  h.g.gain.setValueAtTime(.0001,A.ctx.currentTime); h.g.gain.linearRampToValueAtTime(gain,A.ctx.currentTime+3);
  AMB.cur=h;
}
const SFX = {
  has:k=>MANIFEST.has('sfx_'+k),
  loop(k,gain){ return playBuf('sfx_'+k,{gain,loop:true}); },
  knock(pan=0){ if(this.has('knock')) return playBuf('sfx_knock',{gain:.9,pan}); for(let i=0;i<3;i++){ A.tone(85,.25,{gain:.55,to:50,delay:i*.75}); A.noise(.09,{type:'lowpass',f:500,gain:.45,delay:i*.75,pan}); } },
  whispers(pan=0,dur=4.5){ if(this.has('whispers')) return playBuf('sfx_whispers',{gain:.75,pan,dur});for(let i=0;i<14;i++) A.noise(.08+Math.random()*.15,{f:1700+Math.random()*2200,q:4,gain:.08,delay:i*.16,pan:Math.sin(i)*.8}); },
  sizzle(){ if(this.has('sizzle')) return playBuf('sfx_sizzle',{gain:.8}); A.noise(2.4,{type:'highpass',f:4500,gain:.16,a:.03}); A.noise(1.6,{type:'bandpass',f:7500,q:2,gain:.12,delay:.1}); },
  stinger(){ if(this.has('stinger')) return playBuf('sfx_stinger',{gain:1}); A.noise(.9,{type:'highpass',f:1200,gain:.6,a:.002}); [233,247,349,370,523].forEach(f=>A.tone(f,1.2,{type:'sawtooth',gain:.09,a:.002})); A.tone(55,1.4,{gain:.8,to:30,a:.002}); },
  chime(){ if(this.has('chime')) return playBuf('sfx_chime',{gain:.8}); A.tone(784,1.8,{gain:.28,type:'triangle'}); A.tone(622,2.4,{gain:.28,type:'triangle',delay:.6}); },
  stamp(){ if(this.has('stamp')) return playBuf('sfx_stamp',{gain:1}); A.tone(95,.45,{gain:.7,to:38}); A.noise(.18,{type:'lowpass',f:700,gain:.55}); },
  steps(pan=-.4){ if(this.has('steps')) return playBuf('sfx_steps',{gain:.85,pan,dur:5});for(let i=0;i<5;i++) A.noise(.12,{type:'lowpass',f:260,gain:.3+i*.06,delay:i*.65,pan}); },
};

/* ---------- seslendirme satırları ---------- */
const LINES = {
  teyze_d1:{t:'Canlarım, bu duayı herkes okusun! Okuyan ömrünü görüyormuş, ÇOK doğru çıkıyor. Benimki on iki yıl çıktı, maşallah! Hadi bakın, bakın.', p:1.25, r:1.05},
  emre_d1:{t:'Anne, bende bir gün yazıyor, bir gün! Yarın cenazeme gelirsiniz artık. Helvayı bol yapın.', p:.9, r:1.05},
  emre_vm:{t:'Deniz... Deniz aç telefonu. Kapıda biri var. Annemin sesiyle konuşuyor ama... annem içeride uyuyor. Linke bir daha girdim. Sıra bendeymiş. Görevler veriyor, Deniz... Yine çalıyor. Sakın sen girme. Sakın—', p:.85, r:.95, vol:.75},
  anne_d2:{t:'Deniz... Emre\'yi kaybettik yavrum. Teyzen perişan. Öğlen cenaze var. Hazırlan, seni de alalım.', p:1.1, r:.85},
  babaanne_d2:{t:'Deniz, yavrum... O linke bir daha girme. Bizim köyde de olurdu böyle şeyler. Sıra gelir, sıra geçer. Gece kapı çalarsa, adını söyleyen sesi tanısan bile... açma.', p:.8, r:.78},
  call_1:{t:'Deniz... yavrum, uyandın mı?', p:1.05, r:.88},
  call_2:{t:'Kapıdayım. Anahtarımı unutmuşum. Aç kapıyı yavrum... dışarısı çok soğuk.', p:1, r:.85},
  call_3a:{t:'Evdeyim yavrum. Kapının önündeyim.', p:.5, r:.7, wrong:true},
  call_3b:{t:'Acele et. Acele et, Deniz.', p:.55, r:.7, wrong:true},
  call_4:{t:'Sıran geldi, Deniz.', p:.1, r:.6, wrong:true},
  sys_intro:{t:'Sıra sizde. Kalan süreniz yirmi dört saattir. Sürenizi uzatmak için görevleri tamamlayın.', p:.9, r:.9},
  sys_t1:{t:'Görev bir. Bulunduğunuz odanın ışığını kapatın.', p:.9, r:.9},
  sys_t2:{t:'Görev iki. Gözlerinizi kapatın. On saniye boyunca açmayın.', p:.9, r:.9},
  sys_t3:{t:'Görev üç. Yüzünüzü gösterin.', p:.9, r:.9},
  sys_ok:{t:'Görev tamamlandı. Süreniz uzatıldı.', p:.9, r:.9},
  sys_fail:{t:'Görev başarısız. Süreniz kısaltıldı.', p:.9, r:.9},
  emre_whisper:{t:'Deniz... açma. Gözlerini açma. Ben arkandayım.', p:.6, r:.75, vol:.7},
  anons:{t:'Kırk yedi numara. Lütfen, sıfır numaralı gişeye.', p:.8, r:.85},
  memur_1:{t:'Kırk yedi numara. Evraklarınız eksik.', p:.4, r:.7},
  memur_kabul:{t:'İşleminiz tamamlanmıştır.', p:.4, r:.7},
  memur_bilinmeyen:{t:'Bu kişinin sırası... zaten gelmiştir.', p:.3, r:.65},
  babaanne_kursun:{t:'Kurşun döküyorum yavrum... Sesimi duyarsan, sesime gel.', p:.8, r:.75},
  emre_3d:{t:'Deniz... sen de mi baktın?', p:.5, r:.7, vol:.7},
  anne_3d:{t:'Deniz! Deniz uyan yavrum... ne olur uyan!', p:1.2, r:1},
};
let trVoice=null;
function loadVoices(){ const vs=speechSynthesis.getVoices(); trVoice=vs.find(v=>/^tr/i.test(v.lang))||null; }
if('speechSynthesis' in window){ loadVoices(); speechSynthesis.onvoiceschanged=loadVoices; }
const lineDur = id => BUF[id] ? BUF[id].duration : (1 + LINES[id].t.length*.075/(LINES[id].r||1));
let curVO=null;
/* VO.play(id) -> {done:Promise, stop()}  — dosya varsa ElevenLabs sesi, yoksa tarayıcı sesi */
function vo(id,{phone=false,pan=0,onprog}={}){
  if(curVO) curVO.stop();
  const L=LINES[id]; let stopped=false, raf;
  const h={stop(){ stopped=true; cancelAnimationFrame(raf); if(h._src) h._src.stop(); if('speechSynthesis' in window) speechSynthesis.cancel(); h._res&&h._res(); }};
  h.done=new Promise(res=>{
    h._res=res;
    const dur=lineDur(id)*(SPEED<1?SPEED:1);
    const t0=performance.now();
    const tick=()=>{ const p=Math.min(1,(performance.now()-t0)/1000/dur); onprog&&onprog(p); if(p<1&&!stopped) raf=requestAnimationFrame(tick); };
    if(BUF[id] && SPEED>=1){
      const src=playBuf(id,{phone,pan,gain:L.vol||1,rate:L.wrong&&phone?.92:1}); h._src=src;
      src.s.onended=()=>{ onprog&&onprog(1); res(); };
      tick();
    } else if(trVoice && SPEED>=1){
      const u=new SpeechSynthesisUtterance(L.t); u.lang='tr-TR'; u.voice=trVoice; u.pitch=L.p||1; u.rate=L.r||.9; u.volume=L.vol||1;
      u.onend=()=>{ onprog&&onprog(1); res(); }; u.onerror=()=>res();
      speechSynthesis.cancel(); speechSynthesis.speak(u); tick();
      setTimeout(res,(dur+6)*1000);
    } else { tick(); setTimeout(()=>{ onprog&&onprog(1); res(); }, dur*1000); }
  });
  h.done.then(()=>{ if(curVO===h) curVO=null; });
  curVO=h; return h;
}

/* =========================================================
   GÖRSELLER (canvas ile çiziliyor)
   ========================================================= */
/* Safari büyük boyutlu emojileri canvas'a çizemiyor: emojiyi küçük çizip ölçekle büyüt */
(()=>{ const P=CanvasRenderingContext2D.prototype, ft=P.fillText; let re; try{ re=new RegExp('\\p{Extended_Pictographic}','u'); }catch(e){ re=/[\uD83C-\uDBFF]/; }
  P.fillText=function(t,x,y,...r){ const m=/(\d+(?:\.\d+)?)px/.exec(this.font), sz=m?+m[1]:0;
    if(sz>32 && re.test(t)){ const k=sz/32; this.save(); this.font=this.font.replace(m[0],'32px'); this.translate(x,y); this.scale(k,k); ft.call(this,t,0,0,...r); this.restore(); }
    else ft.call(this,t,x,y,...r); }; })();
function cv(w,h,draw){ const c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); return c; }
function grain(g,w,h,a=.12){ const d=g.getImageData(0,0,w,h); for(let i=0;i<d.data.length;i+=4){ const n=(Math.random()-.5)*255*a; d.data[i]+=n; d.data[i+1]+=n; d.data[i+2]+=n; } g.putImageData(d,0,0); }
function avatar(c1,c2,emoji,{size=160,fs=86}={}){ return cv(size,size,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,w,h); gr.addColorStop(0,c1); gr.addColorStop(1,c2); g.fillStyle=gr; g.fillRect(0,0,w,h); g.font=`${fs}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(emoji,w/2,h/2+6); }).toDataURL(); }
const AV = {
  aile: avatar('#2f6b55','#173a2d','🏠'),
  anne: avatar('#f4c4d4','#c9708f','👩🏻'),
  baba: avatar('#a9bfdc','#4c678e','👨🏻'),
  emre: avatar('#36d1dc','#1d4f8f','⚽'),
  babaanne: avatar('#efe2c8','#a48c62','👵🏻'),
  okul: avatar('#ffd36e','#e08a2c','📚'),
  teyze: cv(160,160,(g,w,h)=>{ const gr=g.createRadialGradient(80,80,10,80,80,110); gr.addColorStop(0,'#ffe3ee'); gr.addColorStop(1,'#d9467a'); g.fillStyle=gr; g.fillRect(0,0,w,h); g.font='54px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.textAlign='center'; g.textBaseline='middle'; [['🌹',50,52],['🌸',112,48],['🌹',80,100],['🌷',40,118],['🌹',122,116]].forEach(([e,x,y])=>g.fillText(e,x,y)); }).toDataURL(),
  unknown: cv(160,160,(g,w,h)=>{ g.fillStyle='#6a7175'; g.fillRect(0,0,w,h); g.fillStyle='#cfd4d6'; g.beginPath(); g.arc(80,62,30,0,7); g.fill(); g.beginPath(); g.ellipse(80,150,58,48,0,Math.PI,0); g.fill(); }).toDataURL(),
};
const IMG = {
  gunaydin: cv(360,360,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,w,h); gr.addColorStop(0,'#ffd1e8'); gr.addColorStop(1,'#ff8fb8'); g.fillStyle=gr; g.fillRect(0,0,w,h); g.font='60px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.textAlign='center'; ['🌹','🌸','🌹','🌷','🌹'].forEach((e,i)=>g.fillText(e,40+i*70,86+(i%2)*18)); ['🌷','🌹','🌸','🌹','🌸'].forEach((e,i)=>g.fillText(e,40+i*70,330-(i%2)*14)); g.fillStyle='#a1003b'; g.font='italic bold 56px Georgia'; g.fillText('Günaydın',w/2,192); g.font='italic 23px Georgia'; g.fillStyle='#6d0028'; g.fillText('Hayırlı perşembeler ✨',w/2,234); }).toDataURL(),
  linkThumb: cv(500,260,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#1d3b2a'); gr.addColorStop(1,'#0b1a12'); g.fillStyle=gr; g.fillRect(0,0,w,h); g.strokeStyle='rgba(212,175,95,.55)'; g.lineWidth=3; for(let i=0;i<8;i++){ g.beginPath(); g.arc(w/2,h/2,30+i*22,0,7); g.stroke(); } g.fillStyle='#e9d39a'; g.font='italic 46px Georgia'; g.textAlign='center'; g.fillText('Cuma Duası',w/2,h/2+4); g.font='18px Georgia'; g.fillStyle='#bfa96d'; g.fillText('🤲  okuyan ömrünü görür  🤲',w/2,h/2+40); }).toDataURL(),
  ekmek: cv(300,300,(g,w,h)=>{ g.fillStyle='#4b2e1c'; g.fillRect(0,0,w,h); g.font='150px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.textAlign='center'; g.fillText('🥖',w/2,200); }).toDataURL(),
  mac: cv(300,300,(g,w,h)=>{ g.fillStyle='#1e5c2b'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(255,255,255,.4)'; g.lineWidth=3; g.strokeRect(20,20,260,260); g.beginPath(); g.arc(150,150,40,0,7); g.stroke(); g.font='70px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.textAlign='center'; g.fillText('⚽',150,175); }).toDataURL(),
  deniz: cv(300,300,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#8fd3ff'); gr.addColorStop(.55,'#2f86c9'); gr.addColorStop(.56,'#1f5f8f'); gr.addColorStop(1,'#e8d29a'); g.fillStyle=gr; g.fillRect(0,0,w,h); }).toDataURL(),
  kedi: cv(300,300,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#c98f4d'); gr.addColorStop(1,'#6b4426'); g.fillStyle=gr; g.fillRect(0,0,w,h); g.font='150px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.textAlign='center'; g.fillText('🐈',w/2,210); }).toDataURL(),
};
function siraCard(no,txt,sub){ return cv(360,420,(g,w,h)=>{ g.fillStyle='#f6efe0'; g.fillRect(0,0,w,h); g.strokeStyle='#d8c08a'; g.lineWidth=6; g.strokeRect(10,10,w-20,h-20); g.fillStyle='#7a5a1c'; g.font='italic 30px Georgia'; g.textAlign='center'; g.fillText('Cuma Duası',w/2,66); g.font='14px Georgia'; g.fillStyle='#9b8a68'; g.fillText('Kalan ömrünüz',w/2,130); g.fillStyle='#8b0f1f'; g.font='110px VT323, monospace'; g.fillText(txt,w/2,240); g.fillStyle='#7a5a1c'; g.font='22px Georgia'; g.fillText(sub,w/2,282); g.fillStyle='#b5a27c'; g.font='13px Georgia'; g.fillText('Sıra no: '+no+'   ·   e-sira.app',w/2,370); }).toDataURL(); }
IMG.emreShot = siraCard('12','1','gün');
IMG.myShot = siraCard('47','9','gün');

/* Emre'nin 03:11 videosu (canvas ile oynatılır) */
function emreFrame(g,w,h,t){
  g.fillStyle='#050608'; g.fillRect(0,0,w,h);
  const sx=Math.sin(t*7)*4+Math.sin(t*13)*2, sy=Math.cos(t*5)*4+Math.sin(t*17)*2;
  g.save(); g.translate(sx,sy);
  g.fillStyle='#101218'; g.fillRect(0,0,w,h*.84);
  g.fillStyle='#16181f'; g.fillRect(w*.26,h*.14,w*.48,h*.72);
  g.strokeStyle='#22252e'; g.lineWidth=6; g.strokeRect(w*.26,h*.14,w*.48,h*.72);
  g.fillStyle='#3a3628'; g.beginPath(); g.arc(w*.68,h*.52,7,0,7); g.fill();
  const flick = t>11 ? (Math.random()<.4?.2:1) : 1;
  const lg=g.createLinearGradient(0,h*.85,0,h*.9); lg.addColorStop(0,`rgba(255,215,150,${.6*flick})`); lg.addColorStop(1,'rgba(255,215,150,0)');
  g.fillStyle=lg; g.fillRect(w*.26,h*.855,w*.48,h*.05);
  if(t>5){ const a=Math.min(1,(t-5)/1.2); g.fillStyle=`rgba(0,0,0,${.92*a})`; g.fillRect(w*.37,h*.856,w*.09,h*.02); g.fillRect(w*.54,h*.856,w*.09,h*.02); }
  g.fillStyle='#0c0d10'; g.fillRect(0,h*.86,w,h*.14);
  g.restore();
  const d=g.getImageData(0,0,w,h); for(let i=0;i<d.data.length;i+=4){ const n=(Math.random()-.5)*42; d.data[i]+=n; d.data[i+1]+=n; d.data[i+2]+=n; } g.putImageData(d,0,0);
  const v=g.createRadialGradient(w/2,h/2,h*.2,w/2,h/2,h*.75); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(0,0,0,.85)'); g.fillStyle=v; g.fillRect(0,0,w,h);
  g.fillStyle='#ff3b30'; if(Math.floor(t*2)%2===0){ g.beginPath(); g.arc(24,30,7,0,7); g.fill(); }
  g.fillStyle='#fff'; g.font='16px Roboto, sans-serif'; g.fillText('REC',38,36);
  g.textAlign='right'; g.fillText('03:11:'+pad(Math.floor(t)),w-14,36); g.textAlign='left';
  if(t>13.1){ g.fillStyle='#000'; g.fillRect(0,0,w,h); }
}
IMG.emreThumb = cv(360,640,(g,w,h)=>emreFrame(g,w,h,6.5)).toDataURL();

/* =========================================================
   SOHBETLER
   ========================================================= */
const PEOPLE = {
  anne:{name:'Annem', color:'#f5a3c7', av:'anne'},
  baba:{name:'Babam', color:'#7fb2ff', av:'baba'},
  teyze:{name:'Nermin Teyze', color:'#ffb35c', av:'teyze'},
  emre:{name:'Emre', color:'#53bdeb', av:'emre'},
  babaanne:{name:'Babaanne', color:'#c79ef7', av:'babaanne'},
  bilinmeyen:{name:'+90 5•• ••• •• 47', color:'#f15c6d', av:'unknown'},
  ali:{name:'Ali', color:'#7ee0a1', av:'unknown'}, zeynep:{name:'Zeynep', color:'#ff8f8f', av:'unknown'},
};
const CH = {
  aile:{title:'Aile 🏠', av:'aile', group:true, sub:'Annem, Babam, Babaanne, Emre, Nermin Teyze, Sen', pinned:true},
  emre:{title:'Emre', av:'emre', sub:'son görülme dün 23:41'},
  anne:{title:'Annem', av:'anne', sub:'çevrimiçi'},
  baba:{title:'Babam', av:'baba', sub:'son görülme bugün 21:02'},
  okul:{title:'Sınıf 12-B 📚', av:'okul', group:true, sub:'Ali, Zeynep, +28 kişi', muted:true},
  bilinmeyen:{title:'+90 5•• ••• •• 47', av:'unknown', sub:'çevrimiçi', hidden:true},
};
const wrap=$('msgWrap');
for(const id in CH){ const c=CH[id]; c.id=id; c.el=document.createElement('div'); c.el.className='msgs'; wrap.appendChild(c.el); c.unread=0; c.lastTs=0; c.last=''; c.prev=null; c.lastDay=null; c.typing=null; c.pending=null; }
/* sohbet duvar kağıdı (doodle deseni) */
wrap.style.backgroundImage=`url(${cv(420,420,(g,w,h)=>{ g.strokeStyle='rgba(233,237,239,.05)'; g.lineWidth=2; g.lineCap='round'; const sh=[(x,y)=>{g.beginPath();g.arc(x,y,9,0,7);g.stroke();},(x,y)=>{g.beginPath();g.moveTo(x-8,y+6);g.lineTo(x,y-8);g.lineTo(x+8,y+6);g.closePath();g.stroke();},(x,y)=>{g.strokeRect(x-7,y-10,14,20);},(x,y)=>{g.beginPath();g.moveTo(x-9,y);g.quadraticCurveTo(x,y-14,x+9,y);g.quadraticCurveTo(x,y+14,x-9,y);g.stroke();},(x,y)=>{g.beginPath();g.moveTo(x,y-9);g.lineTo(x+3,y-2);g.lineTo(x+9,y-2);g.lineTo(x+4,y+3);g.lineTo(x+6,y+10);g.lineTo(x,y+6);g.lineTo(x-6,y+10);g.lineTo(x-4,y+3);g.lineTo(x-9,y-2);g.lineTo(x-3,y-2);g.closePath();g.stroke();},(x,y)=>{g.beginPath();g.arc(x,y,4,0,7);g.moveTo(x+10,y);g.arc(x,y,10,0,7);g.stroke();}]; for(let y=20;y<h;y+=46) for(let x=20+(y/46%2)*22;x<w;x+=44){ g.save(); g.translate(x,y); g.rotate(Math.random()*6); sh[Math.floor(Math.random()*sh.length)](0,0); g.restore(); } }).toDataURL()})`;

function previewOf(m,c){
  if(m.type==='e2e') return {t:c.last||'', mine:false};
  let t = m.type==='voice' ? '🎤 Sesli mesaj' : m.type==='image' ? '📷 '+(m.cap||'Fotoğraf') : m.type==='video' ? '🎥 Video' : m.type==='call' ? '📞 Cevapsız sesli arama' : m.type==='link' ? (m.text||m.url) : (m.text||'');
  if(m.type==='sys') return {t:m.text, mine:false};
  if(c.group && m.from!=='me') t = PEOPLE[m.from].name+': '+t;
  return {t, mine:m.from==='me'};
}
function dayLabel(d){ return d===S.day ? 'BUGÜN' : d===S.day-1 ? 'DÜN' : '11 KASIM'; }
function refreshChips(){ document.querySelectorAll('.chip[data-day]').forEach(e=>e.textContent=dayLabel(+e.dataset.day)); }

function post(cid, m){
  const c=CH[cid];
  m.day = m.day ?? S.day; m.time = m.time ?? hhmm(); m.ts = m.ts ?? nowTs();
  if(c.lastDay!==m.day){ const ch=document.createElement('div'); ch.className='chip'; ch.dataset.day=m.day; ch.textContent=dayLabel(m.day); c.el.appendChild(ch); c.lastDay=m.day; c.prev=null; }
  const el=renderMsg(c,m);
  c.el.appendChild(el); m.el=el;
  c.lastTs=Math.max(c.lastTs,m.ts); const pv=previewOf(m,c); c.last=pv.t; c.lastMine=pv.mine; c.lastTime=m.time; c.hidden=false;
  if(m.from!=='me' && m.type!=='sys' && !m.read) { if(!viewing(cid)) c.unread++; }
  renderList();
  if(S.chat===cid) wrap.scrollTop=wrap.scrollHeight;
  if(!m.silent && m.from!=='me') notify(cid,m);
  return el;
}
function viewing(cid){ return S.screen==='chat' && S.chat===cid && (S.mode==='phone'||S.phoneOpen); }

function renderMsg(c,m){
  if(m.type==='sys'){ const d=document.createElement('div'); d.className='sysm'+(m.bad?' bad':''); d.textContent=m.text; c.prev=null; return d; }
  if(m.type==='e2e'){ const d=document.createElement('div'); d.className='e2e'; d.innerHTML='🔒 Mesajlar ve aramalar uçtan uca şifrelidir. Bu sohbetin dışındaki hiç kimse, hatta Sohbet bile bunları okuyamaz ve dinleyemez.'; return d; }
  const out = m.from==='me';
  const first = !c.prev || c.prev!==m.from;
  c.prev = m.from;
  const row=document.createElement('div'); row.className='mrow '+(out?'out':'in')+(first?' first':'');
  let inner='';
  if(!out && c.group) row.innerHTML=`<img class="mav" src="${AV[PEOPLE[m.from].av]}">`;
  const nm = (!out && c.group && first && m.type!=='voice') ? `<div class="nm" style="color:${PEOPLE[m.from].color}">${esc(PEOPLE[m.from].name)}</div>` : '';
  const ticks = out ? `<span class="tk">${svg('ticks')}</span>` : '';
  const meta = `<span class="meta">${m.time}${ticks}</span>`;
  let cls='bub';
  if(m.type==='text'||!m.type){
    inner = nm + (m.quote?`<div class="q" style="--qc:${PEOPLE[m.quote.who]?.color||'#06cf9c'}"><b>${esc(m.quote.who==='me'?'Siz':PEOPLE[m.quote.who].name)}</b><span>${esc(m.quote.text)}</span></div>`:'') + `<span class="tx">${esc(m.text)}</span><span class="sp"></span>` + meta;
  } else if(m.type==='image'){
    cls+=' media'+(m.cap?' hascap':''); inner = (nm?`<div style="padding:2px 6px 3px">${nm}</div>`:'') + `<img src="${m.src}" alt="">` + (m.cap?`<div class="cap">${esc(m.cap)}<span class="sp"></span></div>`:'') + meta;
  } else if(m.type==='video'){
    cls+=' media'; inner = nm + `<div class="vthumb"><img src="${m.thumb}" alt="" style="height:330px;object-fit:cover"><span class="pbtn">${svg('play')}</span><span class="vd">${svg('video')}${m.dur}</span></div>` + meta;
  } else if(m.type==='voice'){
    const bars=Array.from({length:32},()=>`<s style="height:${Math.round(rnd(3,24))}px"></s>`).join('');
    const avk = out ? null : PEOPLE[m.from].av;
    inner = `<div class="vm">${avk?`<div class="vav"><img src="${AV[avk]}"><i>${svg('mic')}</i></div>`:''}<button class="vpl">${svg('play')}</button><div class="vw">${bars}<u></u></div></div><span class="vdur">${fmtDur(lineDur(m.vo))}</span>` + meta;
  } else if(m.type==='call'){
    inner = `<div class="callb"><span class="ci">${svg('missed')}</span><div><b>Cevapsız sesli arama</b><small>Geri aramak için dokunun</small></div></div>` + meta;
  } else if(m.type==='link'){
    inner = nm + `<div class="lp"><img src="${m.thumb}" alt=""><div><b>${esc(m.title)}</b><span>${esc(m.desc)}</span><small>${esc(m.domain)}</small></div></div><span class="tx">${m.text?esc(m.text)+'\n':''}<a>${esc(m.url)}</a></span><span class="sp"></span>` + meta;
  }
  const b=document.createElement('div'); b.className=cls; b.innerHTML=inner; row.appendChild(b);
  if(m.type==='image') b.querySelector('img').onclick=()=>openViewer({img:m.src, who:m.from==='me'?'Siz':PEOPLE[m.from].name, when:m.time});
  if(m.type==='video') b.querySelector('.vthumb').onclick=()=>openViewer({video:m.video, who:PEOPLE[m.from].name, when:m.time});
  if(m.type==='voice') setupVoice(b,m);
  if(m.type==='link'){ const go=()=>{ m.onTap&&m.onTap(); }; b.querySelector('.lp').onclick=go; b.querySelector('a').onclick=go; m.lp=b.querySelector('.lp'); }
  return row;
}
const fmtDur = s => Math.floor(s/60)+':'+pad(Math.round(s%60));
function setupVoice(b,m){
  const btn=b.querySelector('.vpl'), bars=[...b.querySelectorAll('.vw s')], dot=b.querySelector('.vw u'), vm=b.querySelector('.vm'), dur=b.querySelector('.vdur');
  let h=null;
  btn.onclick=()=>{
    if(h){ h.stop(); h=null; btn.innerHTML=svg('play'); return; }
    btn.innerHTML=svg('pause'); vm.classList.add('played'); m.listened=true;
    h=vo(m.vo,{onprog:p=>{ const k=Math.round(p*bars.length); bars.forEach((s,i)=>s.classList.toggle('p',i<k)); dot.style.left=(p*100)+'%'; dur.textContent=fmtDur(lineDur(m.vo)*p); }});
    if(m.onPlay) m.onPlay();
    h.done.then(()=>{ btn.innerHTML=svg('play'); h=null; dur.textContent=fmtDur(lineDur(m.vo)); m.onDone&&m.onDone(); });
  };
}

function renderList(){
  const l=$('clist'); l.innerHTML='';
  const arr=Object.values(CH).filter(c=>!c.hidden).sort((a,b)=>(b.pinned-a.pinned)||(b.lastTs-a.lastTs));
  let totalChats=0;
  for(const c of arr){
    if(c.unread) totalChats++;
    const r=document.createElement('button'); r.className='crow'+(c.unread?' un':'');
    const avsrc = c.avImg || AV[c.av];
    const line2 = c.typing ? `<p class="typing">${c.group?esc(PEOPLE[c.typing].name)+' ':''}yazıyor…</p>` : `<p>${c.lastMine?`<span class="tk">${svg('ticks')}</span>`:''}${esc(c.last)}</p>`;
    r.innerHTML=`<img src="${avsrc}" alt=""><div class="cm"><div class="l1"><b>${esc(c.title)}</b><span>${c.lastTime||''}</span></div><div class="l2">${line2}${c.muted?`<span class="ic mute">${svg('mute')}</span>`:''}${c.pinned&&!c.unread?`<span class="ic pin">${svg('pin')}</span>`:''}${c.unread?`<span class="ub">${c.unread}</span>`:''}</div></div>`;
    r.onclick=()=>openChat(c.id);
    l.appendChild(r);
  }
  $('chipUn').textContent = totalChats? totalChats : '';
  for(const id of ['navUn','bdWa2','bd3d']){ const e=$(id); e.textContent=totalChats; e.classList.toggle('on',totalChats>0); }
  const hb=document.querySelector('#hmGrid [data-open="wa"] .badge'); if(hb){ hb.textContent=totalChats; hb.classList.toggle('on',totalChats>0); }
}
function setTyping(cid, who){
  const c=CH[cid]; c.typing=who; renderList();
  if(S.chat===cid){ const s=$('cSub'); if(who){ s.textContent=(c.group?PEOPLE[who].name+' ':'')+'yazıyor…'; s.classList.add('typing'); } else { s.textContent=c.sub; s.classList.remove('typing'); } }
}
async function say(cid, from, m, o={}){
  if(typeof m==='string') m={type:'text', text:m};
  const typ = o.typing ?? (m.type==='voice' ? 2600 : Math.min(3000, 600 + (m.text||'').length*40));
  setTyping(cid, from); await sleep(typ); setTyping(cid, null);
  m.from=from; const el=post(cid,m);
  await sleep(o.after ?? 500);
  return m;
}
function sys(cid,text,bad){ post(cid,{type:'sys',text,bad,from:'sys'}); }

/* ---------- yanıt seçimi (klavye yerine hızlı yanıt paneli) ---------- */
function choose(cid, opts){
  return new Promise(res=>{
    CH[cid].pending={opts,res};
    if(S.chat===cid && S.screen==='chat') showReplies(cid);
    else toast(CH[cid], {from:null,text:'Yanıtını bekliyorlar…'}, ()=>openChat(cid));
  });
}
function showReplies(cid){
  const c=CH[cid], p=$('replyPanel'), l=$('rpList');
  if(!c.pending){ p.classList.remove('on'); return; }
  l.innerHTML=''; p.classList.add('on');
  c.pending.opts.forEach((o,i)=>{ const b=document.createElement('button'); b.textContent=o; b.onclick=()=>typeOut(cid,o,i); l.appendChild(b); });
  setTimeout(()=>wrap.scrollTop=wrap.scrollHeight,30);
}
async function typeOut(cid,text,i){
  const c=CH[cid], pend=c.pending; if(!pend) return;
  $('replyPanel').classList.remove('on');
  const f=$('fieldTxt'); f.classList.remove('ph'); f.textContent='';
  for(const ch of [...text]){ f.textContent+=ch; A.key(); await new Promise(r=>setTimeout(r,28*SPEED)); }
  const sb=$('sendBtn'); $('sendIc').innerHTML=svg('send'); sb.classList.add('go');
  await new Promise(r=>sb.onclick=r);
  sb.onclick=null; sb.classList.remove('go'); $('sendIc').innerHTML=svg('mic');
  f.textContent='Mesaj'; f.classList.add('ph');
  c.pending=null; A.send();
  post(cid,{from:'me',type:'text',text});
  pend.res(i);
}

/* ---------- bildirim ---------- */
let toastT;
function notifHTML(title, body, avsrc, {red=false, when='şimdi'}={}){
  return `<div class="nt${red?' red':''}"><img class="ntAv" src="${avsrc}"><div class="ntB"><div class="ntH"><span class="appdot">${svg(red?'web':'wa')}</span>${red?'e-Sıra':'Sohbet'} · ${when}</div><div class="ntT">${esc(title)}</div><div class="ntX">${esc(body)}</div></div></div>`;
}
function notify(cid,m){
  if(viewing(cid)){ A.pop(); return; }
  const c=CH[cid]; const pv=previewOf(m,c);
  if(m.type==='sys') return;
  A.pop(); try{ navigator.vibrate&&navigator.vibrate(60); }catch(e){}
  toast(c, {text:pv.t}, ()=>openChat(cid));
}
function toast(c, m, onTap){
  const t=$('toast');
  t.innerHTML = c.raw ? c.raw : notifHTML(c.title, m.text, c.avImg||AV[c.av]);
  t.onclick=()=>{ t.classList.remove('on'); onTap&&onTap(); };
  t.classList.add('on'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('on'),4200);
}

/* =========================================================
   EKRANLAR
   ========================================================= */
const LIGHT = new Set(['browser']);
function show(id, push=true){
  if(push && S.screen!==id && !['call','viewer'].includes(S.screen)) S.stack.push(S.screen);
  document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));
  S.screen=id;
  $('sb').classList.toggle('dark', LIGHT.has(id));
  if(id==='wa'){ renderList(); renderCalls(); }
  if(id==='gallery') renderGallery();
  if(id==='phone') renderPhone();
  if(id!=='chat'){ $('replyPanel').classList.remove('on'); }
}
function back(target){
  if(S.mode==='3d' && S.screen==='chat'){ closePhone3d(); return; }
  if(S.screen==='chat') S.chat=null;
  const to = target || S.stack.pop() || 'home';
  show(to,false);
}
document.addEventListener('click',e=>{
  const o=e.target.closest('[data-open]'); if(o){ show(o.dataset.open); return; }
  const b=e.target.closest('[data-back]'); if(b){ back(b.dataset.back||null); }
});
function openChat(cid){
  const c=CH[cid]; S.chat=cid;
  for(const k in CH) CH[k].el.classList.toggle('on',k===cid);
  $('cName').textContent=c.title; $('cAv').src=c.avImg||AV[c.av];
  $('cSub').textContent=c.typing?(c.group?PEOPLE[c.typing].name+' ':'')+'yazıyor…':c.sub; $('cSub').classList.toggle('typing',!!c.typing);
  c.el.querySelector('.undiv')?.remove();
  if(c.unread){ const rows=[...c.el.querySelectorAll('.mrow.in, .sysm')]; const at=rows[Math.max(0,rows.length-c.unread)]; if(at){ const d=document.createElement('div'); d.className='undiv'; d.textContent=c.unread+' OKUNMAMIŞ MESAJ'; c.el.insertBefore(d,at); } }
  c.unread=0; renderList();
  if(S.mode==='3d') openPhone3d();
  if(S.screen!=='chat') show('chat');
  showReplies(cid);
  requestAnimationFrame(()=>{ const d=c.el.querySelector('.undiv'); wrap.scrollTop = d ? d.offsetTop-80 : wrap.scrollHeight; });
  c.onOpen && c.onOpen();
}
$('lock').onclick=()=>{ if(S.lockTap) S.lockTap(); };
document.querySelectorAll('.waNav a').forEach(a=>a.onclick=()=>{
  document.querySelectorAll('.waNav a').forEach(x=>x.classList.toggle('on',x===a));
  const calls=a.dataset.tab==='calls';
  $('waChats').classList.toggle('hidden',calls); $('waCalls').classList.toggle('hidden',!calls); $('waFab').classList.toggle('hidden',calls);
  if(calls){ S.missedCalls=0; $('navCall').classList.remove('on'); }
});

/* ---------- ana ekran ---------- */
const HOME_APPS=[
  {id:'wa',label:'Sohbet',cls:'ic-wa',ic:'wa',badge:true},
  {id:'phone',label:'Telefon',cls:'ic-phone',ic:'call'},
  {id:'gallery',label:'Galeri',cls:'ic-gal',ic:'photo'},
  {id:'camera',label:'Kamera',cls:'ic-cam',ic:'camera'},
  {id:'camera',label:'Saat',cls:'ic-clock',ic:'clock'},
  {id:'camera',label:'Ayarlar',cls:'ic-set',ic:'settings'},
];
function renderHome(){
  $('hmGrid').innerHTML=HOME_APPS.map(a=>`<button class="app${a.isNew?' new':''}" ${a.action?`data-act="${a.action}"`:`data-open="${a.id}"`}><span class="ico ${a.cls}">${a.txt||svg(a.ic)}</span><b>${a.label}</b>${a.badge?'<i class="badge"></i>':''}</button>`).join('');
  document.querySelectorAll('.hmDock .ico').forEach((e,i)=>{ if(!e.firstChild) e.innerHTML=svg(['call','wa','photo','camera'][i]); });
  $('hmGrid').querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>ACTIONS[b.dataset.act]());
  renderList();
}
const ACTIONS={ sira:()=>openSira() };

/* ---------- aramalar listesi ---------- */
const CALLS=[ {who:'babaanne',kind:'in',t:'Dün 19:02'}, {who:'anne',kind:'out',t:'Dün 12:40'}, {who:'baba',kind:'in',t:'10 Kasım 18:15'} ];
function callRow(c){ const p=PEOPLE[c.who]; const ic=c.kind==='missed'?'missed':c.kind==='in'?'incoming':'outgoing'; return `<div class="clrow"><img src="${AV[p.av]}"><div class="cm"><b class="${c.kind==='missed'?'miss':''}">${esc(p.name)}${c.n>1?` (${c.n})`:''}</b><small><span class="ic ${c.kind==='missed'?'miss':'inc'}">${svg(ic)}</span>${esc(c.t)}</small></div><span class="ic">${svg('call')}</span></div>`; }
function renderCalls(){ $('callList').innerHTML=CALLS.map(callRow).join(''); }
function renderPhone(){ $('phList').innerHTML=CALLS.map(callRow).join(''); }
function addCall(c){ CALLS.unshift(c); if(c.kind==='missed'){ S.missedCalls=(S.missedCalls||0)+1; const e=$('navCall'); e.textContent=S.missedCalls; e.classList.add('on'); } renderCalls(); }

/* ---------- galeri ---------- */
const PHOTOS=[ {img:IMG.ekmek,when:'Dün'}, {img:IMG.mac,when:'10 Kasım'}, {img:IMG.deniz,when:'Ağustos'}, {img:IMG.kedi,when:'Temmuz'} ];
function renderGallery(){
  $('gGrid').innerHTML='';
  PHOTOS.forEach(p=>{ const d=document.createElement('div'); d.className='gi'; d.innerHTML=`<img src="${p.thumb||p.img}">${p.video?`<span>${svg('video')}0:14</span>`:''}`; d.onclick=()=>openViewer({img:p.video?null:p.img, video:p.video, who:p.who||'Galeri', when:p.when}); $('gGrid').appendChild(d); });
}

/* ---------- medya görüntüleyici / video oynatıcı ---------- */
let VP=null;
function openViewer({img,video,who,when}){
  $('vWho').textContent=who||''; $('vWhen').textContent=when||'';
  const im=$('vImg'), can=$('vCan');
  im.style.display=img?'block':'none'; can.style.display=video?'block':'none'; $('vCtl').style.display=video?'flex':'none'; $('vBig').style.display='none';
  if(img) im.src=img;
  show('viewer');
  if(video) startVideo(video);
}
$('vBack').onclick=()=>{ stopVideo(); back(); };
const VIDEOS={
  emre:{dur:14, frame:emreFrame, events:[
    [1.8,()=>SFX.knock(0)],
    [6.2,()=>A.noise(2.5,{type:'bandpass',f:500,q:.6,gain:.05})],
    [7.5,()=>SFX.whispers(0)],
    [9.6,()=>SFX.knock(0)],
    [12.4,()=>{ A.glitch(.5); A.tone(60,.6,{gain:.4,to:30}); }],
  ]},
};
function startVideo(key){
  stopVideo();
  const V=VIDEOS[key], can=$('vCan'), g=can.getContext('2d');
  VP={V,t:0,playing:true,last:performance.now(),fired:new Set()};
  $('vDur').textContent=fmtDur(V.dur); $('vPlay').innerHTML=svg('pause');
  const loop=now=>{
    if(!VP) return;
    const dt=(now-VP.last)/1000; VP.last=now;
    if(VP.playing){ VP.t+=dt; V.events.forEach(([at,fn],i)=>{ if(VP.t>=at && !VP.fired.has(i)){ VP.fired.add(i); fn(); } }); }
    if(VP.t>=V.dur){ VP.t=V.dur; VP.playing=false; $('vPlay').innerHTML=svg('play'); $('vBig').style.display='grid'; VP.ended=true; }
    V.frame(g,can.width,can.height,VP.t);
    $('vCur').textContent=fmtDur(VP.t); $('vFill').style.width=(VP.t/V.dur*100)+'%';
    VP.raf=requestAnimationFrame(loop);
  };
  VP.raf=requestAnimationFrame(loop);
  const toggle=()=>{ if(!VP) return; if(VP.ended){ VP.t=0; VP.fired.clear(); VP.ended=false; } VP.playing=!VP.playing; $('vPlay').innerHTML=svg(VP.playing?'pause':'play'); $('vBig').style.display=VP.playing?'none':'grid'; };
  $('vPlay').onclick=toggle; $('vBig').onclick=toggle; can.onclick=toggle;
  if(key==='emre') S.sawVideo=true;
}
function stopVideo(){ if(VP){ cancelAnimationFrame(VP.raf); VP=null; } }

/* =========================================================
   ARAMA EKRANI
   ========================================================= */
let callRes=null, callRejectable=true, callTimer, callSec=0;
function incomingCall(who,{rejectable=true}={}){
  return new Promise(res=>{
    callRes=res; callRejectable=rejectable;
    const p=PEOPLE[who];
    $('clName').textContent=p.name; $('clAv').src=AV[p.av]; $('clAv').classList.add('ring');
    $('clState').textContent='Gelen sesli arama'; $('clSub').textContent=''; $('clSub').classList.remove('wrong'); $('clChoices').innerHTML='';
    $('clIn').classList.remove('hidden'); $('clBar').classList.add('hidden');
    show('call'); A.ringStart();
  });
}
$('clAcc').onclick=()=>{ if(!callRes) return; A.ringStop(); const r=callRes; callRes=null; r('accept'); };
$('clRej').onclick=()=>{
  if(!callRes) return;
  if(!callRejectable){ const b=$('clRej'); b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); A.glitch(.12); return; }
  A.ringStop(); const r=callRes; callRes=null; r('reject');
};
$('clEnd').onclick=()=>A.glitch(.1);
function startTalk(){
  $('clIn').classList.add('hidden'); $('clBar').classList.remove('hidden'); $('clAv').classList.remove('ring');
  callSec=0; const up=()=>$('clState').textContent=pad(Math.floor(callSec/60))+':'+pad(callSec%60);
  up(); callTimer=setInterval(()=>{ callSec++; up(); },1000); A.lineOn();
}
function endTalk(){ clearInterval(callTimer); A.lineOff(); A.hangup(); $('clState').textContent='Arama sona erdi'; }
async function line(id,{after=500}={}){
  const L=LINES[id]; const s=$('clSub'); s.textContent='“'+L.t+'”'; s.classList.toggle('wrong',!!L.wrong);
  await vo(id,{phone:true}).done; await sleep(after);
}
function callChoose(opts){ return new Promise(res=>{ const box=$('clChoices'); box.innerHTML=''; opts.forEach((o,i)=>{ const b=document.createElement('button'); b.textContent=o; b.onclick=()=>{ box.innerHTML=''; $('clSub').textContent='Sen: '+o; A.send(); res(i); }; box.appendChild(b); }); }); }

/* =========================================================
   TARAYICI: e-SIRA
   ========================================================= */
function bLoad(){ const p=$('bProg'); p.style.transition='none'; p.style.width='0'; requestAnimationFrame(()=>{ p.style.transition='width .9s'; p.style.width='100%'; setTimeout(()=>{p.style.transition='none';p.style.width='0';},1100); }); }
async function duaFlow(){
  $('bTitle').textContent='Cuma Duası 🤲';
  const b=$('bBody');
  b.innerHTML=`<div class="dua"><div class="orn">✦ ✦ ✦</div><h2>Hayırlı Cumalar</h2><div class="sub">Okuyan ömrünü görür · 128.402 kişi okudu</div>
    <div class="card">Bu mübarek gecede sevdiklerinize sağlık, evinize huzur, ömrünüze bereket dileriz.<br><br>Okuyan herkes ömrünün ne kadar kaldığını görür.<br>Okuduktan sonra <b>Amin</b>'e dokunun.</div>
    <button class="amin" id="amin">AMİN 🤲</button>
    <small class="tiny">Devam ederek kullanım koşullarını ve sıra kaydınızın oluşturulmasını kabul etmiş olursunuz.</small></div>`;
  show('browser'); bLoad();
  await new Promise(r=>$('amin').onclick=r);
  A.send();
  const steps=['Okumanız kabul ediliyor…','Rehberiniz okunuyor…','Sıranız hesaplanıyor…'];
  b.innerHTML=`<div class="dua"><div class="orn">✦ ✦ ✦</div><div class="spin"></div><div class="res" id="stp">${steps[0]}</div></div>`;
  for(const s of steps){ $('stp').textContent=s; await sleep(1100); }
  SFX.chime();
  b.innerHTML=`<div class="dua"><div class="orn">✦ ✦ ✦</div><h2>Kalan ömrünüz</h2><div class="big">9</div><div class="res">gün</div>
    <div class="cnt">Sıra no: 47 · Kayıt: ${hhmm()}</div>
    <button class="share" id="shr">${svg('wa')}Aile grubunda paylaş</button>
    <small class="tiny">Sıranız değiştiğinde size bildirilecektir.</small></div>`;
  await new Promise(r=>$('shr').onclick=r);
}
function fmtHMS(s){ s=Math.max(0,Math.floor(s)); return pad(Math.floor(s/3600))+':'+pad(Math.floor(s%3600/60))+':'+pad(s%60); }
const TASKS=[
  {id:'light', title:'Işığı kapat', desc:'Bulunduğun odanın ışığını kapat.', gain:6*3600, state:'open'},
  {id:'eyes', title:'Gözlerini kapat', desc:'10 saniye boyunca gözlerini açma.', gain:6*3600, state:'lock'},
  {id:'face', title:'Yüzünü göster', desc:'Sıranın kime ait olduğunu doğrula.', gain:6*3600, state:'lock'},
];
let siraResolve=null;
function openSira(){
  $('bTitle').textContent='e-Sıra'; show('browser'); bLoad(); renderSira();
}
function renderSira(){
  const b=$('bBody');
  b.innerHTML=`<div class="sira"><h2>SIRA SİZDE</h2><div class="no">SIRA NO 047 · DENİZ</div>
    <div class="cd" id="sCd">${fmtHMS(S.remain)}</div><div class="cdl">KALAN SÜRE</div>
    <div class="msg">Sürenizi uzatmak için görevleri tamamlayın.<br>Görevler sırayla açılır.</div>
    ${TASKS.map((t,i)=>`<button class="tk1 ${t.state==='done'?'done':t.state==='fail'?'fail':t.state==='lock'?'lock':'next'}" data-t="${i}"><span class="n">${i+1}</span><span class="t"><b>${t.title}</b><span>${t.state==='lock'?'Kilitli':t.desc}</span></span><span class="r">${t.state==='fail'?'−3 saat':'+6 saat'}</span></button>`).join('')}
  </div>`;
  b.querySelectorAll('[data-t]').forEach(el=>el.onclick=()=>{ const t=TASKS[+el.dataset.t]; if(t.state==='open') runTask(+el.dataset.t); });
}
setInterval(()=>{ if(!S.remainRun) return; S.remain--; const e=$('sCd'); if(e) e.textContent=fmtHMS(S.remain); }, 1000);

/* =========================================================
   KAMERA GÖREVLERİ
   ========================================================= */
const CAM={stream:null};
let FL=null, flTried=false;
async function loadFace(){
  if(flTried) return FL; flTried=true;
  try{
    const V='0.10.14';
    const vision=await import(`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${V}/vision_bundle.mjs`);
    const fs=await vision.FilesetResolver.forVisionTasks(`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${V}/wasm`);
    FL=await vision.FaceLandmarker.createFromOptions(fs,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',delegate:'GPU'},outputFaceBlendshapes:true,runningMode:'VIDEO',numFaces:1});
  }catch(e){ console.warn('Yüz algılama yüklenemedi',e); FL=null; }
  return FL;
}
async function camStart(){
  if(CAM.stream) return true;
  try{
    CAM.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:480}},audio:false});
    const v=$('tVideo'); v.srcObject=CAM.stream; await v.play(); return true;
  }catch(e){ console.warn(e); CAM.stream=null; return false; }
}
function camStop(){ if(CAM.stream){ CAM.stream.getTracks().forEach(t=>t.stop()); CAM.stream=null; } $('tVideo').srcObject=null; }
const lumC=document.createElement('canvas'); lumC.width=48; lumC.height=36; const lumG=lumC.getContext('2d',{willReadFrequently:true});
function lum(){ const v=$('tVideo'); if(!v.videoWidth) return 128; lumG.drawImage(v,0,0,48,36); const d=lumG.getImageData(0,0,48,36).data; let s=0; for(let i=0;i<d.length;i+=4) s+=d[i]*.3+d[i+1]*.59+d[i+2]*.11; return s/(d.length/4); }
let lastFace=null;
function detect(){ const v=$('tVideo'); if(!FL||!v.videoWidth) return null; try{ const r=FL.detectForVideo(v,performance.now()); lastFace=r; return r; }catch(e){ return null; } }
function blinkOf(r){ const cats=r?.faceBlendshapes?.[0]?.categories; if(!cats) return null; const g=n=>cats.find(c=>c.categoryName===n)?.score||0; return (g('eyeBlinkLeft')+g('eyeBlinkRight'))/2; }

function taskUI({no,title,text,big='',stat='',meter=null,btns=[]}){
  $('tNo').textContent=no; $('tTitle').textContent=title; $('tText').textContent=text; $('tBig').textContent=big; $('tStat').textContent=stat;
  $('tMeter').style.display=meter==null?'none':'block'; if(meter!=null) $('tMeter').firstElementChild.style.width=(meter*100)+'%';
  const bot=$('tBot'); bot.innerHTML='';
  return btns.map(([label,cls])=>{ const b=document.createElement('button'); b.textContent=label; if(cls) b.className=cls; bot.appendChild(b); return b; });
}
const tapOnce = el => new Promise(r=>el.onclick=r);

async function askCamera(){
  if(S.camMode) return S.camMode;
  $('task').classList.add('on'); $('task').classList.remove('closed');
  const [ok,no]=taskUI({no:'e-SIRA',title:'Kamera izni',text:'Görevler kameranı kullanır. Görüntü yalnızca bu cihazda işlenir ve hiçbir yere gönderilmez.',btns:[['Kamerayı aç','red'],['Kamerasız oyna','ghost']]});
  const pick=await Promise.race([tapOnce(ok).then(()=>'cam'),tapOnce(no).then(()=>'nocam')]);
  if(pick==='cam'){
    taskUI({no:'e-SIRA',title:'Bekleniyor…',text:'Tarayıcının kamera izni sorusunu onayla.'});
    const okc=await camStart();
    S.camMode = okc ? 'cam' : 'nocam';
    if(okc) loadFace();
    else { taskUI({no:'e-SIRA',title:'Kamera açılamadı',text:'Bu cihazda ya da sayfada kameraya izin verilmedi. Görevler kamerasız devam edecek.'}); await sleep(2600); }
  } else S.camMode='nocam';
  return S.camMode;
}

async function runTask(i){
  const t=TASKS[i]; S.remainRun=true;
  const mode=await askCamera();
  if(mode==='cam' && !CAM.stream) await camStart();
  $('task').classList.add('on'); $('task').classList.remove('closed');
  ambience('drone');
  let ok=false;
  if(t.id==='light') ok=await taskLight(mode);
  if(t.id==='eyes') ok=await taskEyes(mode);
  if(t.id==='face') ok=await taskFace(mode);
  t.state = ok ? 'done' : 'fail';
  S.remain += ok ? t.gain : -3*3600;
  if(TASKS[i+1]) TASKS[i+1].state='open';
  await vo(ok?'sys_ok':'sys_fail').done;
  $('task').classList.remove('on');
  if(!TASKS.some(x=>x.state==='open'||x.state==='lock')) camStop();
  renderSira();
  if(siraResolve && TASKS.every(x=>x.state==='done'||x.state==='fail')) siraResolve();
}

async function taskLight(mode){
  vo('sys_t1');
  if(mode!=='cam'){
    const [b]=taskUI({no:'GÖREV 1/3',title:'Işığı kapat',text:'Bulunduğun odanın ışığını kapat. Kapattığında dokun.',btns:[['Kapattım','red']]});
    await tapOnce(b); SFX.whispers(rnd(-.6,.6)); await sleep(2500); return true;
  }
  taskUI({no:'GÖREV 1/3',title:'Işığı kapat',text:'Bulunduğun odanın ışığını kapat.',stat:'Ortam ölçülüyor…',meter:0});
  await sleep(1000);
  let base=0; for(let k=0;k<5;k++){ base+=lum(); await sleep(150); } base/=5;
  const target=Math.max(30,base*.45);
  let held=0, t0=performance.now(), skipShown=false, done=false, skipB=null;
  while(!done){
    await new Promise(r=>setTimeout(r,150));
    const l=lum(); const dark=l<target;
    held = dark ? held+.15 : Math.max(0,held-.3);
    const p=Math.min(1,held/2.5);
    $('tMeter').firstElementChild.style.width=(p*100)+'%';
    $('tStat').textContent = dark ? 'Karanlık… bekle.' : 'Oda hâlâ aydınlık.';
    if(dark && held>.3 && held<.5) SFX.whispers(rnd(-.7,.7));
    if(held>=2.5) done=true;
    if(!skipShown && performance.now()-t0>40000){ skipShown=true; [skipB]=taskUI({no:'GÖREV 1/3',title:'Işığı kapat',text:'Bulunduğun odanın ışığını kapat.',meter:p,btns:[['Kapattım','ghost']]}); skipB.onclick=()=>done=true; }
  }
  $('tStat').textContent='…'; await sleep(1800); return true;
}

async function taskEyes(mode){
  vo('sys_t2');
  const fl = mode==='cam' ? await Promise.race([loadFace(), new Promise(r=>setTimeout(()=>r(null),8000))]) : null;
  if(!fl){
    // dokun ve basılı tut modu
    taskUI({no:'GÖREV 2/3',title:'Gözlerini kapat',text:'Parmağını ekranda basılı tut ve gözlerini kapat. 10 saniye bırakma.',big:'10'});
    const el=$('task'); let t=0, holding=false, failed=false, iv;
    const res = await new Promise(res=>{
      el.onpointerdown=()=>{ if(holding) return; holding=true; el.classList.add('closed'); t=0; const fired=new Set();
        iv=setInterval(()=>{ t+=.1; $('tBig').textContent=Math.max(0,Math.ceil(10-t));
          if(t>2.5&&!fired.has(1)){ fired.add(1); vo('emre_whisper',{pan:-.6}); }
          if(t>6&&!fired.has(2)){ fired.add(2); SFX.steps(.5); }
          if(t>8.5&&!fired.has(3)){ fired.add(3); SFX.knock(.3); }
          if(t>=10){ clearInterval(iv); res(true); } },100*SPEED); };
      el.onpointerup=el.onpointercancel=()=>{ if(holding && t<10){ clearInterval(iv); holding=false; res(false); } };
    });
    el.onpointerdown=el.onpointerup=el.onpointercancel=null; el.classList.remove('closed');
    if(!res){ curVO?.stop(); SFX.stinger(); return false; }
    $('tBig').textContent=''; $('tTitle').textContent='Şimdi aç.'; await sleep(900); await scare(); return true;
  }
  taskUI({no:'GÖREV 2/3',title:'Gözlerini kapat',text:'Yüzünü kameraya göster ve gözlerini kapat.',big:'',stat:'Yüz aranıyor…'});
  let closedT=0, last=performance.now(), fired=new Set(), result=null, seenClosed=false;
  while(result===null){
    await new Promise(r=>requestAnimationFrame(r));
    const now=performance.now(), dt=(now-last)/1000; last=now;
    const r=detect(); const b=blinkOf(r);
    if(b==null){ $('tStat').textContent='Yüzünü göremiyorum.'; continue; }
    const closed=b>.45;
    if(closed){ seenClosed=true; closedT+=dt; $('task').classList.add('closed'); $('tStat').textContent=''; $('tBig').textContent=Math.max(0,Math.ceil(10-closedT)); }
    else { $('task').classList.remove('closed'); if(seenClosed && closedT>.4 && closedT<10){ result=false; break; } $('tStat').textContent='Gözlerini kapat.'; }
    if(closedT>2.5&&!fired.has(1)){ fired.add(1); vo('emre_whisper',{pan:-.6}); }
    if(closedT>6&&!fired.has(2)){ fired.add(2); SFX.steps(.5); }
    if(closedT>8.5&&!fired.has(3)){ fired.add(3); SFX.knock(.3); }
    if(closedT>=10) result=true;
  }
  if(!result){ curVO?.stop(); $('task').classList.remove('closed'); SFX.stinger(); taskUI({no:'GÖREV 2/3',title:'Gözlerini açtın.',text:''}); await sleep(1500); return false; }
  $('tBig').textContent=''; $('tTitle').textContent='Şimdi aç.';
  const t0=performance.now();
  while(performance.now()-t0<6000){ await new Promise(r=>requestAnimationFrame(r)); const b=blinkOf(detect()); if(b!=null&&b<.3) break; }
  $('task').classList.remove('closed');
  await scare(); return true;
}
/* gözünü açtığında, kameranın içinde arkanda bir figür belirir */
async function scare(){
  const c=$('tScare'), g=c.getContext('2d'), w=c.width, h=c.height;
  g.clearRect(0,0,w,h);
  const x=w*.74, y=h*.36;
  const gr=g.createRadialGradient(x,y,4,x,y,120); gr.addColorStop(0,'rgba(0,0,0,.95)'); gr.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=gr; g.fillRect(0,0,w,h);
  g.fillStyle='rgba(8,8,10,.96)'; g.beginPath(); g.ellipse(x,y,34,46,0,0,7); g.fill();
  g.beginPath(); g.moveTo(x-70,h); g.quadraticCurveTo(x-60,y+60,x,y+40); g.quadraticCurveTo(x+60,y+60,x+70,h); g.fill();
  g.fillStyle='#d9d4c8'; g.beginPath(); g.ellipse(x-12,y-4,4,6,0,0,7); g.ellipse(x+12,y-4,4,6,0,0,7); g.fill();
  c.style.transition='none'; c.style.opacity=1;
  SFX.stinger(); try{ navigator.vibrate&&navigator.vibrate([80,40,200]); }catch(e){}
  $('device').classList.add('shake');
  await new Promise(r=>setTimeout(r,420));
  $('device').classList.remove('shake');
  c.style.transition='opacity .8s'; c.style.opacity=0;
  await sleep(1200);
}
async function taskFace(mode){
  vo('sys_t3');
  if(mode!=='cam'){
    const [b]=taskUI({no:'GÖREV 3/3',title:'Yüzünü göster',text:'Kameran kapalı. Sıranın sahibi doğrulanıyor…',btns:[['Devam','red']]});
    await tapOnce(b); S.face=fakeFace(); return true;
  }
  await Promise.race([loadFace(), new Promise(r=>setTimeout(r,5000))]);
  taskUI({no:'GÖREV 3/3',title:'Yüzünü göster',text:'Telefonu yüzüne doğru tut. Kıpırdama.',stat:FL?'Yüz aranıyor…':''});
  const t0=performance.now();
  if(FL){ while(performance.now()-t0<12000){ await new Promise(r=>setTimeout(r,120)); const r=detect(); if(r?.faceLandmarks?.length){ break; } } }
  for(let k=3;k>0;k--){ $('tBig').textContent=k; A.tone(880,.08,{gain:.08}); await sleep(800); if(FL) detect(); }
  $('tBig').textContent=''; A.shutter(); $('white').style.transition='none'; $('white').style.opacity=.9; setTimeout(()=>{ $('white').style.transition='opacity .5s'; $('white').style.opacity=0; },60);
  S.face=processFace();
  $('tStat').textContent='Teşekkürler.'; await sleep(1500);
  return true;
}
function processFace(){
  const v=$('tVideo'), vw=v.videoWidth||640, vh=v.videoHeight||480, side=Math.min(vw,vh), sx=(vw-side)/2, sy=(vh-side)/2, O=400;
  const c=document.createElement('canvas'); c.width=c.height=O; const g=c.getContext('2d');
  g.translate(O,0); g.scale(-1,1); g.drawImage(v,sx,sy,side,side,0,0,O,O); g.setTransform(1,0,0,1,0,0);
  const d=g.getImageData(0,0,O,O); for(let i=0;i<d.data.length;i+=4){ let l=d.data[i]*.3+d.data[i+1]*.59+d.data[i+2]*.11; l=(l-128)*1.45+92+(Math.random()-.5)*34; d.data[i]=l*.95; d.data[i+1]=l; d.data[i+2]=l*.92; } g.putImageData(d,0,0);
  const lm=lastFace?.faceLandmarks?.[0];
  if(lm){
    const P=i=>({x:O-((lm[i].x*vw-sx)/side*O), y:(lm[i].y*vh-sy)/side*O});
    for(const [a,b2,t,bt] of [[33,133,159,145],[362,263,386,374]]){
      const A1=P(a),B=P(b2),T=P(t),Bo=P(bt); const cx=(A1.x+B.x)/2, cy=(T.y+Bo.y)/2, rw=Math.hypot(A1.x-B.x,A1.y-B.y)*.8;
      const gr=g.createRadialGradient(cx,cy,rw*.3,cx,cy,rw*1.25); gr.addColorStop(0,'rgba(0,0,0,1)'); gr.addColorStop(.6,'rgba(0,0,0,.95)'); gr.addColorStop(1,'rgba(0,0,0,0)');
      g.fillStyle=gr; g.beginPath(); g.ellipse(cx,cy+rw*.1,rw*1.25,rw*1.1,0,0,7); g.fill();
    }
    const M=P(13); g.fillStyle='rgba(0,0,0,.85)'; g.beginPath(); g.ellipse(M.x,M.y+8,10,22,0,0,7); g.fill();
  }
  const vg=g.createRadialGradient(O/2,O/2,O*.25,O/2,O/2,O*.72); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,.9)'); g.fillStyle=vg; g.fillRect(0,0,O,O);
  g.fillStyle='#ff9a2e'; g.font='22px VT323, monospace'; g.textAlign='right'; g.fillText('13.11  '+hhmm(),O-12,O-12);
  return c.toDataURL('image/jpeg',.85);
}
function fakeFace(){ return cv(400,400,(g,w,h)=>{ g.fillStyle='#0b0c0e'; g.fillRect(0,0,w,h); g.fillStyle='#4a4a46'; g.beginPath(); g.ellipse(200,190,92,122,0,0,7); g.fill(); g.fillStyle='#000'; for(const [x,y,rx,ry] of [[165,175,22,26],[235,175,22,26],[200,262,9,22]]){ g.beginPath(); g.ellipse(x,y,rx,ry,0,0,7); g.fill(); } grain(g,w,h,.3); g.fillStyle='#ff9a2e'; g.font='22px VT323, monospace'; g.textAlign='right'; g.fillText('13.11  '+hhmm(),w-12,h-12); }).toDataURL(); }

/* =========================================================
   ARA SAHNELER
   ========================================================= */
async function interlude(top,big,ms=2600){
  const e=$('inter'); $('inTop').textContent=top; $('inBig').textContent=big;
  e.classList.add('on'); await new Promise(r=>setTimeout(r,40)); e.style.opacity=1;
  await sleep(ms);
}
async function interOut(){ const e=$('inter'); e.style.opacity=0; await sleep(1000); e.classList.remove('on'); }
function lockNotifs(list){ $('lkNotifs').innerHTML=list.join(''); }
function waitUnlock(){ show('lock',false); S.stack=[]; return new Promise(r=>S.lockTap=()=>{ S.lockTap=null; r(); }); }
function waitFor(fn,ms=200){ return new Promise(r=>{ const iv=setInterval(()=>{ if(fn()){ clearInterval(iv); r(); } },ms); }); }

/* =========================================================
   HİKÂYE
   ========================================================= */
function history(){
  const silent={silent:true,read:true};
  post('aile',{type:'e2e',from:'sys',day:1,time:'07:00',ts:1440+420,...silent});
  post('aile',{from:'babaanne',type:'image',src:IMG.gunaydin,day:1,time:'07:12',ts:1440+432,...silent});
  post('aile',{from:'teyze',text:'Günaydın canlarım, hayırlı perşembeler 🌹🌹🌹',day:1,time:'07:31',ts:1440+451,...silent});
  post('aile',{from:'baba',text:'Kombi yine su kaçırıyor, yarın usta gelecek',day:1,time:'12:02',ts:1440+722,...silent});
  post('aile',{from:'anne',text:'Yarın akşam hepiniz bize gelin, mantı yapıyorum 🥟',day:1,time:'12:05',ts:1440+725,...silent});
  post('aile',{from:'emre',text:'geliyorum 😋 bol yoğurtlu olsun',day:1,time:'12:06',ts:1440+726,...silent});
  post('aile',{from:'me',text:'Ben de geliyorum 🙋',day:1,time:'12:10',ts:1440+730,...silent});
  post('emre',{type:'e2e',from:'sys',day:1,time:'00:00',ts:1440,...silent});
  post('emre',{from:'emre',text:'maçı izledin mi 😂😂',day:1,time:'20:12',ts:1440+1212,...silent});
  post('emre',{from:'me',text:'izledim kardeşim rezalet',day:1,time:'20:15',ts:1440+1215,...silent});
  post('emre',{from:'emre',type:'image',src:IMG.mac,day:1,time:'20:16',ts:1440+1216,...silent});
  post('anne',{from:'anne',text:'Ekmek aldın mı?',day:1,time:'18:44',ts:1440+1124,...silent});
  post('anne',{from:'me',text:'Aldım anne',day:1,time:'18:50',ts:1440+1130,...silent});
  post('baba',{from:'baba',text:'Arabanın sigortası bu ay bitiyor, hatırlat bana',day:1,time:'09:20',ts:1440+560,...silent});
  post('okul',{from:'ali',text:'yarın sınav var mı',day:1,time:'19:30',ts:1440+1170,...silent});
  post('okul',{from:'zeynep',text:'yok pazartesi',day:1,time:'19:31',ts:1440+1171,...silent});
  // teyzenin linki (okunmamış)
  post('aile',{from:'teyze',type:'voice',vo:'teyze_d1',day:1,time:'21:33',ts:1440+1293,silent:true});
  const link={from:'teyze',type:'link',url:'https://e-sira.app/cuma-duasi?ref=nermin',title:'Cuma Duası 🤲',desc:'Okuyan ömrünü görür. Herkes okusun, sevdiklerinize gönderin.',domain:'e-sira.app',thumb:IMG.linkThumb,day:1,time:'21:33',ts:1440+1293,silent:true};
  post('aile',link);
  S.link=link;
}

async function day1(){
  S.day=1; setClock(21,34,1);
  ambience('ev');
  history();
  lockNotifs([notifHTML('Aile 🏠','Nermin Teyze: 🎤 Sesli mesaj ('+fmtDur(lineDur('teyze_d1'))+')',AV.teyze,{when:'21:33'}), notifHTML('Aile 🏠','Nermin Teyze: https://e-sira.app/cuma-duasi?ref=nermin',AV.teyze,{when:'21:33'})]);
  A.pop();
  await waitUnlock();
  show('home'); await sleep(250); openChat('aile');
  await sleep(1800);
  await say('aile','anne','Nermin yine ne attın gece gece 😄');
  await say('aile','teyze','Okuyun okuyun 🙏 benimki 12 yıl çıktı maşallah');
  await say('aile','baba','Bende 24 yıl çıktı 😄 emekliliği görürüm inşallah');
  await say('aile','babaanne','Ben bakmam öyle şeylere. Ömrü Allah verir.');
  await say('aile','emre','anne bende 1 gün yazıyor 😂😂');
  await say('aile','emre',{type:'image',src:IMG.emreShot},{typing:1200});
  await say('aile','emre',{type:'voice',vo:'emre_d1'});
  await say('aile','anne','Tövbe tövbe! Öyle şaka mı olur Emre');
  await say('aile','teyze',{type:'text',text:'Deniz sen de bak yavrum 🙏',quote:{who:'teyze',text:'Cuma Duası 🤲'}});
  const c=await choose('aile',['Tamam teyze bakıyorum 🙂','Teyze bunlar hep uydurma 😅']);
  if(c===1) await say('aile','teyze','Uydurma değil yavrum, herkes baktı. Sen de bak 🙏');
  S.link.lp.classList.add('glow');
  await new Promise(r=>S.link.onTap=r); S.link.onTap=null; S.link.lp.classList.remove('glow');
  await duaFlow();
  back('chat'); openChat('aile'); await sleep(500);
  A.send(); post('aile',{from:'me',type:'image',src:IMG.myShot,cap:'9 gün 😅'});
  await sleep(800);
  await say('aile','emre','9 gün mü 😂 benden sonra sıra sende');
  await say('aile','teyze','Uzun ömürlü olun hepiniz 🙏🌹');
  await choose('aile',['Saçmalama Emre 😄','Yarın mantıda görüşürüz 🥟']);
  await say('aile','emre','tamam tamam 😂 iyi geceler millet');
  await say('aile','emre','yarın helvada görüşürüz 💀');
  await say('aile','anne','EMRE!');
  await sleep(2500);
}

async function night(){
  ambience(null);
  await interlude('PERŞEMBE GECESİ','UYKU',2200);
  ambience('drone');
  const sl=$('sleep'); sl.classList.add('on'); await interOut();
  $('slTxt').textContent='Uyuyorsun.';
  const calls=['03:12','03:13','03:14'];
  $('slClock').textContent='03:11'; await sleep(2500);
  for(const t of calls){
    $('slClock').textContent=t; $('slPhone').classList.add('buzz'); A.buzz(1.2); A.ringStart(true);
    await sleep(3200); A.ringStop(); $('slPhone').classList.remove('buzz'); await sleep(1300);
  }
  $('slClock').textContent='03:15'; A.tone(1046,.05,{gain:.03}); await sleep(2200);
  // gece olanlar (oyuncu uyurken)
  const d=2, base=2*1440;
  post('emre',{from:'emre',text:'deniz',day:d,time:'03:10',ts:base+190,silent:true});
  post('emre',{from:'emre',text:'uyanık mısın',day:d,time:'03:10',ts:base+190,silent:true});
  post('emre',{from:'emre',type:'video',video:'emre',thumb:IMG.emreThumb,dur:'0:14',day:d,time:'03:11',ts:base+191,silent:true});
  post('emre',{from:'emre',text:'kapının altına bak',day:d,time:'03:11',ts:base+191,silent:true});
  for(const [t,ts] of [['03:12',192],['03:13',193],['03:14',194]]) post('emre',{from:'emre',type:'call',day:d,time:t,ts:base+ts,silent:true});
  post('emre',{from:'emre',type:'voice',vo:'emre_vm',day:d,time:'03:15',ts:base+195,silent:true});
  addCall({who:'emre',kind:'missed',t:'Bugün 03:14',n:3});
  PHOTOS.unshift({video:'emre',thumb:IMG.emreThumb,who:'Emre',when:'Bugün 03:11'});
  CH.emre.sub='son görülme bugün 03:15';
  sl.classList.remove('on');
  await interlude('CUMA','07:48',2400);
  ambience('sabah');
  setClock(7,48,2);
  post('aile',{from:'baba',text:'Nermin\'in evine gidiyoruz. Emre fenalaşmış',day:2,time:'06:41',ts:base+401,silent:true});
  post('aile',{from:'anne',text:'Ambulans geldi',day:2,time:'06:52',ts:base+412,silent:true});
  post('aile',{from:'baba',text:'Emre\'yi kaybettik. Allah rahmet eylesin 😞',day:2,time:'07:20',ts:base+440,silent:true});
  post('aile',{from:'babaanne',text:'😭😭😭',day:2,time:'07:22',ts:base+442,silent:true});
  post('anne',{from:'anne',text:'Deniz uyandın mı? Ara beni',day:2,time:'07:40',ts:base+460,silent:true});
  addCall({who:'anne',kind:'missed',t:'Bugün 07:41'});
  lockNotifs([
    notifHTML('Emre','3 cevapsız sesli arama',AV.emre,{when:'03:14'}),
    notifHTML('Emre','🎤 Sesli mesaj ('+fmtDur(lineDur('emre_vm'))+')',AV.emre,{when:'03:15'}),
    notifHTML('Aile 🏠','Babam: Emre\'yi kaybettik. Allah rahmet eylesin 😞',AV.aile,{when:'07:20'}),
    notifHTML('Annem','Deniz uyandın mı? Ara beni',AV.anne,{when:'07:40'}),
  ]);
  await interOut();
}

async function day2(){
  await waitUnlock();
  show('home'); await sleep(300); show('wa');
  // Emre'nin sesli mesajı dinlenene (ya da 40 sn geçene) kadar bekle
  const t0=performance.now();
  await waitFor(()=>CH.emre.el.querySelector('.vm.played') || performance.now()-t0>45000*SPEED);
  await sleep(2500);
  await say('aile','anne',{type:'voice',vo:'anne_d2'});
  await say('aile','baba','Cenaze bugün ikindi namazından sonra. Karacaahmet\'e defnedilecek.');
  await choose('aile',['Başımız sağ olsun… 😔','Ne oldu ona? Dün gece beni aramış']);
  await say('aile','baba','Doktor kalp krizi dedi. 24 yaşında çocuk…');
  await sleep(1500);
  await say('aile','babaanne',{type:'voice',vo:'babaanne_d2'});
  await sleep(4000);
  // e-Sıra bildirimi
  const sira={raw:notifHTML('Sıranız değişti','Görüntülemek için dokunun.',AV.unknown,{red:true}),title:'e-Sıra',av:'unknown'};
  sira.raw=`<div class="nt red"><span class="ntAv" style="display:grid;place-items:center;background:#c8102e;font-family:VT323;font-size:22px;color:#fff">47</span><div class="ntB"><div class="ntH"><span class="appdot">${svg('web')}</span>e-Sıra · şimdi</div><div class="ntT">Sıranız değişti</div><div class="ntX">Şu an işlem gören: 12 · Görüntülemek için dokunun.</div></div></div>`;
  A.pop(); try{ navigator.vibrate&&navigator.vibrate([200,100,200]); }catch(e){}
  ambience('drone');
  HOME_APPS.push({id:'sira',label:'e-Sıra',cls:'ic-sira',txt:'47',action:'sira',isNew:true}); renderHome();
  await new Promise(r=>{ const again=()=>{ toast(sira,{},()=>{ clearInterval(iv); r(); }); }; again(); const iv=setInterval(()=>{ if(S.screen==='browser'){ clearInterval(iv); r(); } else again(); },9000); ACTIONS.sira=()=>{ clearInterval(iv); r(); }; });
  ACTIONS.sira=()=>openSira();
  S.remain=24*3600-1; openSira();
  await sleep(600); await vo('sys_intro').done;
  S.remainRun=true;
  await new Promise(r=>siraResolve=r);
  await sleep(1500);
  // yüz fotoğrafının sonuçları
  CH.aile.avImg=S.face; sys('aile','Emre bu grubun simgesini değiştirdi'); A.glitch(.3);
  CH.bilinmeyen.hidden=false; CH.bilinmeyen.avImg=S.face;
  PHOTOS.unshift({img:S.face,who:'Galeri',when:'Bugün '+hhmm()});
  await sleep(2500);
  await say('bilinmeyen','bilinmeyen',{type:'image',src:S.face},{typing:1500});
  await say('bilinmeyen','bilinmeyen','sıra sahibi doğrulandı');
  await say('bilinmeyen','bilinmeyen','şu an işlem gören: 13');
  const t1=performance.now();
  await waitFor(()=>S.chat==='bilinmeyen' || performance.now()-t1>20000*SPEED, 300);
  await sleep(3000);
}

async function nightCall(){
  await interlude('CUMA GECESİ','02:47',2600);
  setClock(2,47);
  show('home',false); await interOut();
  await sleep(1500);
  let r=await incomingCall('anne');
  if(r==='reject'){ addCall({who:'anne',kind:'missed',t:'Bugün 02:47'}); await sleep(2200); r=await incomingCall('anne');
    if(r==='reject'){ addCall({who:'anne',kind:'missed',t:'Bugün 02:48'}); await sleep(1800); await incomingCall('anne',{rejectable:false}); } }
  startTalk(); await sleep(1300);
  await line('call_1'); await line('call_2',{after:200});
  const cc=await callChoose(['Anne… sen evde değil misin?','Tamam, geliyorum.']);
  await sleep(2000);
  if(cc===0) await line('call_3a'); else await line('call_3b');
  A.glitch(.25); SFX.knock(0);
  await line('call_4',{after:500});
  endTalk(); addCall({who:'anne',kind:'in',t:'Bugün 02:49'});
  await sleep(1500);
  openChat('anne'); await sleep(1200);
  await say('anne','anne','Deniz telefonla kiminle konuşuyorsun gece gece?');
  await say('anne','anne','Ben odamdayım. Duvardan sesin geliyor.');
  const c3=await choose('anne',['Anne beni az önce SEN aradın','Kimseyle konuşmuyorum']);
  await say('anne','anne', c3===0 ? 'Ben seni aramadım yavrum. Telefonum şarjda.' : 'Duyuyorum ama. Biriyle konuşuyorsun.');
  await say('anne','anne','Kapıyı kimseye açma.');
  await sleep(2400);
  await say('bilinmeyen','bilinmeyen','şu an işlem gören: 46',{typing:900});
  // geri sayım çöküyor
  A.glitch(.5); $('glitch').classList.add('on'); setTimeout(()=>$('glitch').classList.remove('on'),500);
  S.remain=12; S.remainRun=true;
  toast({raw:`<div class="nt red"><span class="ntAv" style="display:grid;place-items:center;background:#c8102e;font-family:VT323;font-size:22px;color:#fff">47</span><div class="ntB"><div class="ntH"><span class="appdot">${svg('web')}</span>e-Sıra · şimdi</div><div class="ntT">Sıranız geldi</div><div class="ntX">Lütfen ayrılmayınız.</div></div></div>`},{},()=>openSira());
  await new Promise(r=>{ const iv=setInterval(()=>{
    if(S.remain<=10 && S.remain>0){ $('bigcd').classList.add('on'); $('bigcdN').textContent=S.remain; A.beat(.35+(10-S.remain)*.06); try{navigator.vibrate&&navigator.vibrate(80);}catch(e){} }
    if(S.remain<=0){ clearInterval(iv); $('bigcdN').textContent='0'; r(); }
  },1000*SPEED); });
  $('device').classList.add('shake'); $('glitch').classList.add('on');
  SFX.chime(); await vo('anons').done;
  A.glitch(.6); $('white').style.transition='opacity .2s'; $('white').style.opacity=1;
  await sleep(700);
  $('device').classList.remove('shake'); $('glitch').classList.remove('on'); $('bigcd').classList.remove('on');
  S.remainRun=false;
  await enter3D();
  await sleep(400); $('white').style.transition='opacity 2.5s'; $('white').style.opacity=0;
}

async function story(){
  if(Q.has('3d')){ history(); S.day=2; await enter3D(); return; }
  if(Q.has('gorev')){ history(); setClock(14,10,2); ambience('drone'); show('home'); S.remain=24*3600; S.remainRun=true; HOME_APPS.push({id:'sira',label:'e-Sıra',cls:'ic-sira',txt:'47',action:'sira'}); renderHome(); openSira(); await new Promise(r=>siraResolve=r); S.face=S.face||fakeFace(); await nightCall(); return; }
  if(!Q.has('gun2')){ await day1(); await night(); }
  else { history(); await night(); }
  await day2();
  await nightCall();
}

/* =========================================================
   3D — SEVİYE 0: BEKLEME SALONU
   ========================================================= */
const W=12, L=40, H=3.2;
let R=null;
function tex(w,h,draw,rx=1,ry=1){ const c=cv(w,h,draw); const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(rx,ry); t.anisotropy=4; return t; }
function textTex(lines,{w=512,h=160,bg='#f2efe4',fg='#222',font='bold 40px Roboto, sans-serif',border='#b3122b'}={}){
  return tex(w,h,(g)=>{ g.fillStyle=bg; g.fillRect(0,0,w,h); if(border){ g.strokeStyle=border; g.lineWidth=10; g.strokeRect(5,5,w-10,h-10); } g.fillStyle=fg; g.font=font; g.textAlign='center'; g.textBaseline='middle'; lines.forEach((l,i)=>g.fillText(l,w/2,h/2+(i-(lines.length-1)/2)*h/(lines.length+1))); });
}
function ledTex(n){ return tex(320,110,(g,w,h)=>{ g.fillStyle='#0a0a0a'; g.fillRect(0,0,w,h); g.fillStyle='#ff9a9a'; g.font='22px VT323, monospace'; g.textAlign='left'; g.fillText('SIRA NO',14,28); g.fillStyle='#ff2a2a'; g.shadowColor='#ff0000'; g.shadowBlur=14; g.font='96px VT323, monospace'; g.textAlign='right'; g.fillText(String(n).padStart(3,'0'),w-14,h-12); }); }
function makeFigure(coat, standing, faceless=false){
  const g=new THREE.Group();
  const coatMat=new THREE.MeshLambertMaterial({color:coat}), dark=new THREE.MeshLambertMaterial({color:0x1d1d22}), skin=new THREE.MeshLambertMaterial({color:0xcfc6b4}), eye=new THREE.MeshBasicMaterial({color:0x050505});
  const torso=new THREE.Mesh(new THREE.CylinderGeometry(.17,.22,.64,10),coatMat);
  const hp=new THREE.Group(); const head=new THREE.Mesh(new THREE.SphereGeometry(.12,16,12),skin); head.scale.set(1,1.2,1); hp.add(head);
  if(faceless){ const m=new THREE.Mesh(new THREE.SphereGeometry(.02,8,6),eye); m.position.set(0,-.06,.108); m.scale.set(1.2,2.6,.4); hp.add(m); }
  else for(const sx of [-.045,.045]){ const e=new THREE.Mesh(new THREE.SphereGeometry(.026,8,6),eye); e.position.set(sx,.005,.1); e.scale.set(1,1.9,.5); hp.add(e); }
  const box=(w,h,d,m,x,y,z)=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); b.position.set(x,y,z); g.add(b); return b; };
  if(standing){ torso.position.y=1.14; hp.position.y=1.62; box(.11,.82,.13,dark,-.08,.41,0); box(.11,.82,.13,dark,.08,.41,0); box(.07,.66,.08,coatMat,-.25,1.08,0); box(.07,.66,.08,coatMat,.25,1.08,0); }
  else { torso.position.y=.79; hp.position.y=1.26; box(.11,.11,.46,dark,-.08,.5,-.2); box(.11,.11,.46,dark,.08,.5,-.2); box(.1,.46,.11,dark,-.08,.24,-.42); box(.1,.46,.11,dark,.08,.24,-.42); box(.07,.07,.34,coatMat,-.2,.64,-.12); box(.07,.07,.34,coatMat,.2,.64,-.12); }
  g.add(torso); g.add(hp); g.userData.head=hp; return g;
}
async function enter3D(){
  await loadThree(); tmpQ=new THREE.Quaternion(); fwd=new THREE.Vector3(); tv=new THREE.Vector3();
  S.mode='3d'; S.frozen=true; S.min=2*60+47;
  $('screens').style.display='none'; $('three').style.display='block'; $('hud3d').classList.add('on');
  $('sb').style.color='#f3edd2';
  ambience(null); A.humOn(); build3D();
  setTimeout(()=>$('lvl').style.opacity=0,5000);
  level0Script();
}
function build3D(){
  const host=$('three');
  const renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.outputColorSpace=THREE.SRGBColorSpace; host.appendChild(renderer.domElement);
  const scene=new THREE.Scene(); const FOG=0x57533f; scene.background=new THREE.Color(FOG); scene.fog=new THREE.Fog(FOG,3,25);
  const cam=new THREE.PerspectiveCamera(72,1,.05,80); cam.rotation.order='YXZ'; cam.position.set(0,1.6,17);
  const hemi=new THREE.HemisphereLight(0xfff1c4,0x4a4535,2.2); scene.add(hemi);
  const floorT=tex(256,256,(g,w,h)=>{ g.fillStyle='#9a9070'; g.fillRect(0,0,w,h); for(let i=0;i<2500;i++){ g.fillStyle=`rgba(${Math.random()<.5?40:220},${Math.random()<.5?35:210},${Math.random()<.5?25:180},.25)`; g.fillRect(Math.random()*w,Math.random()*h,2,2);} g.strokeStyle='rgba(40,35,25,.5)'; g.lineWidth=2; g.strokeRect(0,0,w,h); for(let i=0;i<6;i++){ g.fillStyle='rgba(60,50,30,.12)'; g.beginPath(); g.arc(Math.random()*w,Math.random()*h,10+Math.random()*30,0,7); g.fill(); } }, W/2, L/2);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(W,L),new THREE.MeshLambertMaterial({map:floorT})); floor.rotation.x=-Math.PI/2; scene.add(floor);
  const wallDraw=(g,w,h)=>{ g.fillStyle='#d4cca8'; g.fillRect(0,0,w,h); g.fillStyle='#7d977e'; g.fillRect(0,h*.6,w,h*.4); g.fillStyle='#4a5847'; g.fillRect(0,h*.6-3,w,5); for(let i=0;i<14;i++){ g.fillStyle='rgba(50,45,30,.10)'; g.fillRect(Math.random()*w,h*.55+Math.random()*h*.4,8+Math.random()*30,2+Math.random()*4);} for(let i=0;i<3;i++){ const x=Math.random()*w; const gr=g.createLinearGradient(0,0,0,h*.5); gr.addColorStop(0,'rgba(90,70,30,.25)'); gr.addColorStop(1,'rgba(90,70,30,0)'); g.fillStyle=gr; g.fillRect(x,0,6+Math.random()*12,h*.5);} };
  const wallT=tex(256,256,wallDraw,L/4,1), endT=tex(256,256,wallDraw,W/4,1);
  const mk=(w,h,t,x,y,z,ry)=>{ const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshLambertMaterial({map:t})); m.position.set(x,y,z); m.rotation.y=ry; scene.add(m); return m; };
  mk(L,H,wallT,-W/2,H/2,0,Math.PI/2); mk(L,H,wallT,W/2,H/2,0,-Math.PI/2); mk(W,H,endT,0,H/2,-L/2,0); mk(W,H,endT,0,H/2,L/2,Math.PI);
  const ceilT=tex(256,256,(g,w,h)=>{ g.fillStyle='#c4bea2'; g.fillRect(0,0,w,h); g.strokeStyle='#8f8a73'; g.lineWidth=3; for(let i=0;i<=4;i++){ g.beginPath(); g.moveTo(i*64,0); g.lineTo(i*64,h); g.stroke(); g.beginPath(); g.moveTo(0,i*64); g.lineTo(w,i*64); g.stroke(); } for(let i=0;i<4;i++){ g.fillStyle='rgba(120,90,40,.18)'; g.beginPath(); g.arc(Math.random()*w,Math.random()*h,8+Math.random()*20,0,7); g.fill(); } }, W/2.4, L/2.4);
  const ceil=new THREE.Mesh(new THREE.PlaneGeometry(W,L),new THREE.MeshLambertMaterial({map:ceilT})); ceil.rotation.x=Math.PI/2; ceil.position.y=H; scene.add(ceil);
  const panelMat=new THREE.MeshBasicMaterial({color:0xfffbe6}), panelMat2=new THREE.MeshBasicMaterial({color:0xfffbe6}); const pGeo=new THREE.BoxGeometry(1.4,.04,.36);
  let k=0; for(let z=18; z>-20; z-=4) for(const x of [-2.6,2.6]){ const p=new THREE.Mesh(pGeo,(k++%5===3)?panelMat2:panelMat); p.position.set(x,H-.025,z); scene.add(p); }
  const colliders=[];
  const seatGeo=new THREE.BoxGeometry(.46,.06,.42), backGeo=new THREE.BoxGeometry(.46,.42,.05);
  const rowsZ=[]; for(let z=13; z>=-10; z-=2.4) rowsZ.push(z);
  const blocks=[-5.2,1.55], perBlock=7, sp=.55, n=rowsZ.length*blocks.length*perBlock;
  const seats=new THREE.InstancedMesh(seatGeo,new THREE.MeshLambertMaterial(),n), backs=new THREE.InstancedMesh(backGeo,new THREE.MeshLambertMaterial(),n);
  const m4=new THREE.Matrix4(), col=new THREE.Color(); const seatPos=[]; let i=0;
  for(const z of rowsZ) for(const bx of blocks){
    for(let c=0;c<perBlock;c++){ const x=bx+c*sp; m4.makeTranslation(x,.45,z); seats.setMatrixAt(i,m4); m4.makeTranslation(x,.7,z+.2); backs.setMatrixAt(i,m4); col.set(Math.random()<.75?0xc0592a:0x2f5f9a); seats.setColorAt(i,col); backs.setColorAt(i,col); seatPos.push({x,z,edge:(bx<0&&c===perBlock-1)||(bx>0&&c===0)}); i++; }
    const beam=new THREE.Mesh(new THREE.BoxGeometry(perBlock*sp,.05,.06),new THREE.MeshLambertMaterial({color:0x3a3a3a})); beam.position.set(bx+(perBlock-1)*sp/2,.4,z); scene.add(beam);
    for(const lx of [bx,bx+(perBlock-1)*sp]){ const leg=new THREE.Mesh(new THREE.BoxGeometry(.05,.4,.4),beam.material); leg.position.set(lx,.2,z); scene.add(leg); }
    colliders.push({x0:bx-.3,x1:bx+(perBlock-1)*sp+.3,z0:z-.32,z1:z+.3});
  }
  scene.add(seats); scene.add(backs);
  const counterMat=new THREE.MeshLambertMaterial({color:0x8a7b5c}), glassMat=new THREE.MeshLambertMaterial({color:0xb8d4d8,transparent:true,opacity:.22});
  let signZero=null;
  [1,2,0,3,4].forEach((nm,j)=>{ const x=-4.8+j*2.4;
    const c=new THREE.Mesh(new THREE.BoxGeometry(2.2,1.05,.7),counterMat); c.position.set(x,.525,-19.4); scene.add(c);
    const gl=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.1),glassMat); gl.position.set(x,1.6,-19.1); scene.add(gl);
    const sg=new THREE.Mesh(new THREE.PlaneGeometry(1.1,.32),new THREE.MeshBasicMaterial({map:textTex(['GİŞE '+nm],{w:256,h:76,font:'bold 44px Roboto, sans-serif',bg:nm===0?'#222':'#e9e4d2',fg:nm===0?'#444':'#222',border:null}),color:nm===0?0x666666:0xffffff}));
    sg.position.set(x,2.32,-19.95); scene.add(sg); if(nm===0) signZero=sg; });
  for(let j=0;j<=5;j++){ const d=new THREE.Mesh(new THREE.BoxGeometry(.06,2.3,1),counterMat); d.position.set(-6+j*2.4,1.15,-19.5); scene.add(d); }
  colliders.push({x0:-6,x1:6,z0:-20,z1:-18.75});
  const led=new THREE.Mesh(new THREE.PlaneGeometry(1.5,.52),new THREE.MeshBasicMaterial({map:ledTex(12)})); led.position.set(0,2.82,-19.96); scene.add(led);
  const led2=led.clone(); led2.material=led.material; led2.position.set(-5.97,2.4,0); led2.rotation.y=Math.PI/2; scene.add(led2);
  const poster=(lines,x,z,ry)=>{ const p=new THREE.Mesh(new THREE.PlaneGeometry(1.5,.75),new THREE.MeshLambertMaterial({map:textTex(lines,{w:384,h:192,font:'bold 30px Roboto, sans-serif'})})); p.position.set(x,1.9,z); p.rotation.y=ry; scene.add(p); return p; };
  poster(['SIRANIZI','BEKLEYİNİZ'],-5.97,9,Math.PI/2); poster(['CEP TELEFONU İLE','GÖRÜŞME YAPMAYINIZ'],5.97,4,-Math.PI/2); poster(['SIRA NUMARANIZI','KAYBETMEYİNİZ'],5.97,-8,-Math.PI/2); poster(['YÜZÜNÜZÜ','KAYBETMEYİNİZ'],-5.97,-6,Math.PI/2);
  // yüzünün fotoğrafı panoda asılı
  if(S.face){ const ft=new THREE.TextureLoader().load(S.face); ft.colorSpace=THREE.SRGBColorSpace; const fp=new THREE.Mesh(new THREE.PlaneGeometry(.55,.55),new THREE.MeshLambertMaterial({map:ft})); fp.position.set(-5.96,1.85,-3.6); fp.rotation.y=Math.PI/2; scene.add(fp); const lb=new THREE.Mesh(new THREE.PlaneGeometry(.7,.16),new THREE.MeshLambertMaterial({map:textTex(['SIRA 047'],{w:256,h:60,font:'bold 34px Roboto',border:null})})); lb.position.set(-5.96,1.48,-3.6); lb.rotation.y=Math.PI/2; scene.add(lb); }
  const door=new THREE.Mesh(new THREE.PlaneGeometry(1.3,2.25),new THREE.MeshLambertMaterial({color:0x3b2a1c})); door.position.set(0,1.125,19.97); door.rotation.y=Math.PI; scene.add(door);
  const memur=makeFigure(0x1b2230,true,true); memur.position.set(0,0,-19.85); memur.scale.setScalar(1.12); memur.visible=false; scene.add(memur);
  const giseLight=new THREE.PointLight(0xfff0c8,0,6,2); giseLight.position.set(0,2.2,-18.6); scene.add(giseLight);
  const coats=[0x3a3a40,0x4a3b2c,0x2b3440,0x55504a,0x2a2a2a,0x3d2f3a,0x404a3a,0x30303a];
  const pool=seatPos.filter(p=>p.z<11).sort(()=>Math.random()-.5); const waiters=[];
  for(let j=0;j<10;j++){ const p=pool[j]; const f=makeFigure(coats[j%coats.length],false); f.position.set(p.x,0,p.z); scene.add(f); waiters.push(f); }
  const ep=seatPos.find(p=>p.edge&&p.x<0&&Math.abs(p.z-6.8)<.1)||seatPos.find(p=>p.edge&&p.x<0);
  const emre=makeFigure(0x1d4f8f,false); emre.position.set(ep.x,0,ep.z); scene.add(emre);
  const paper=new THREE.Mesh(new THREE.PlaneGeometry(.26,.2),new THREE.MeshBasicMaterial({map:textTex(['12'],{w:128,h:96,font:'bold 70px VT323, monospace',bg:'#f4f0e4',fg:'#c8102e',border:null}),side:THREE.DoubleSide}));
  paper.position.set(0,.78,-.3); paper.rotation.x=-.5; paper.rotation.y=Math.PI; emre.add(paper); waiters.push(emre);
  const stalker=makeFigure(0x26262c,true); stalker.visible=false; scene.add(stalker);
  R={renderer,scene,cam,hemi,panelMat,panelMat2,colliders,led,memur,giseLight,signZero,waiters,emre,stalker,yaw:0,pitch:0,loop:0,number:12,giseOn:false,emreSpoke:false,flick:0,stalkT:0,last:performance.now(),running:true,blackout:0};
  const ro=new ResizeObserver(()=>{ const r=host.getBoundingClientRect(); renderer.setSize(r.width,r.height,false); cam.aspect=r.width/r.height; cam.updateProjectionMatrix(); }); ro.observe(host);
  requestAnimationFrame(loop3D);
}
function setNumber(n){ R.number=n; const t=ledTex(n); R.led.material.map.dispose(); R.led.material.map=t; R.led.material.needsUpdate=true; SFX.chime(); }
const keys={}; addEventListener('keydown',e=>keys[e.code]=true); addEventListener('keyup',e=>keys[e.code]=false);
const joy={id:null,sx:0,sy:0,dx:0,dy:0}, look={id:null,x:0,y:0}; const hud=$('hud3d');
hud.addEventListener('pointerdown',e=>{ if(e.target.closest('button')||!R) return; const r=hud.getBoundingClientRect(); const x=e.clientX-r.left, y=e.clientY-r.top;
  if(e.pointerType!=='mouse' && x<r.width/2 && joy.id===null){ joy.id=e.pointerId; joy.sx=x; joy.sy=y; joy.dx=joy.dy=0; const j=$('joy'); j.style.left=x+'px'; j.style.top=y+'px'; j.style.display='block'; j.firstElementChild.style.transform=''; }
  else if(look.id===null){ look.id=e.pointerId; look.x=e.clientX; look.y=e.clientY; }
  hud.setPointerCapture(e.pointerId); });
hud.addEventListener('pointermove',e=>{ if(!R) return;
  if(e.pointerId===joy.id){ const r=hud.getBoundingClientRect(); let dx=e.clientX-r.left-joy.sx, dy=e.clientY-r.top-joy.sy; const d=Math.hypot(dx,dy); if(d>50){ dx*=50/d; dy*=50/d; } joy.dx=dx/50; joy.dy=dy/50; $('joy').firstElementChild.style.transform=`translate(${dx}px,${dy}px)`; }
  else if(e.pointerId===look.id){ const s=e.pointerType==='mouse'?.0042:.0055; R.yaw-=(e.clientX-look.x)*s; R.pitch-=(e.clientY-look.y)*s; R.pitch=Math.max(-1.3,Math.min(1.3,R.pitch)); look.x=e.clientX; look.y=e.clientY; } });
const endPtr=e=>{ if(e.pointerId===joy.id){ joy.id=null; joy.dx=joy.dy=0; $('joy').style.display='none'; } if(e.pointerId===look.id) look.id=null; };
hud.addEventListener('pointerup',endPtr); hud.addEventListener('pointercancel',endPtr);
function openPhone3d(){ S.phoneOpen=true; $('screens').style.display='block'; }
function closePhone3d(){ S.phoneOpen=false; S.chat=null; $('screens').style.display='none'; }
$('phoneBtn').onclick=()=>{ const c=Object.values(CH).filter(c=>!c.hidden).sort((a,b)=>b.lastTs-a.lastTs)[0]; openChat(CH.aile.unread?'aile':c.id); };
let tmpQ, fwd, tv;
function blocked(x,z){ for(const c of R.colliders) if(x>c.x0-.25&&x<c.x1+.25&&z>c.z0-.25&&z<c.z1+.25) return true; return false; }
function loop3D(now){
  if(!R||!R.running) return; requestAnimationFrame(loop3D);
  const dt=Math.min(.05,(now-R.last)/1000); R.last=now; const cam=R.cam;
  if(!S.phoneOpen && !formOpen){
    let f=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)-joy.dy, s=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+joy.dx;
    const len=Math.hypot(f,s); if(len>1){ f/=len; s/=len; }
    const sp=2.3*dt, sy=Math.sin(R.yaw), cy=Math.cos(R.yaw); const mx=(-sy*f+cy*s)*sp, mz=(-cy*f-sy*s)*sp;
    const nx=Math.max(-W/2+.35,Math.min(W/2-.35,cam.position.x+mx)); if(!blocked(nx,cam.position.z)) cam.position.x=nx;
    const nz=Math.max(-L/2+.4,Math.min(L/2-.4,cam.position.z+mz)); if(!blocked(cam.position.x,nz)) cam.position.z=nz;
    if(len>.1) R.bob=(R.bob||0)+dt*7;
  }
  cam.position.y=1.6+Math.sin(R.bob||0)*.03; cam.rotation.set(R.pitch,R.yaw,0);
  for(const w of R.waiters){ if(!w.visible) continue; const hp=w.userData.head; const old=hp.quaternion.clone(); hp.lookAt(cam.position); tmpQ.copy(hp.quaternion); hp.quaternion.copy(old).slerp(tmpQ,dt*1.2); }
  if(R.memur.visible) R.memur.userData.head.lookAt(cam.position);
  R.flick-=dt; if(R.flick<=0){ R.flick=.05+Math.random()*(R.loop>=2?.4:1.5); const on=Math.random()>(R.loop>=2?.45:.2); R.panelMat2.color.setHex(on?0xfffbe6:0x3a382e); A.humSet(on?1:.4); }
  if(R.blackout>0){ R.blackout-=dt; R.hemi.intensity=.05; R.panelMat.color.setHex(0x222018); if(R.blackout<=0){ R.hemi.intensity=R.loop>=3?1.4:2.2; R.panelMat.color.setHex(0xfffbe6); } }
  if(R.stalker.visible){
    cam.getWorldDirection(fwd); tv.set(R.stalker.position.x-cam.position.x,0,R.stalker.position.z-cam.position.z); const dist=tv.length(); tv.normalize();
    const seen=fwd.x*tv.x+fwd.z*tv.z>.45; R.stalker.lookAt(cam.position.x,0,cam.position.z); R.stalkT-=dt;
    if(!seen && R.stalkT<=0 && dist>1.6){ R.stalkT=.9; const step=Math.min(2.2,dist-1.4); R.stalker.position.x-=tv.x*step; R.stalker.position.z-=tv.z*step; A.noise(.12,{type:'lowpass',f:200,gain:.25}); }
    if(dist<1.7 && seen){ SFX.whispers(0); R.blackout=.25; A.glitch(.2); R.stalker.position.set(cam.position.x>0?-3.6:3.6,0,cam.position.z-12); }
  }
  if(!R.emreSpoke && R.emre.visible && cam.position.distanceTo(R.emre.position)<2.2){ R.emreSpoke=true; SFX.whispers(-.5); sub3d('Emre: “'+LINES.emre_3d.t+'”',3500); vo('emre_3d',{pan:-.5}); }
  if(!R.giseOn && R.loop<3 && cam.position.z<-11) doLoop();
  const nearGise=R.giseOn && Math.abs(cam.position.x)<1.6 && cam.position.z<-16.5;
  $('actBtn').classList.toggle('on', nearGise && !formOpen);
  R.renderer.render(R.scene,cam);
}
function sub3d(t,ms=3000){ const e=$('sub3d'); e.textContent=t; clearTimeout(sub3d.t); sub3d.t=setTimeout(()=>e.textContent='',ms); }
function doLoop(){ R.blackout=.35; A.glitch(.3); R.cam.position.z+=27.5; R.loop++; const seq=[12,23,34,46]; setTimeout(()=>setNumber(seq[Math.min(R.loop,3)]),700); loopEvents(R.loop); }
function loopEvents(n){
  if(n===1){ for(const w of R.waiters) if(w!==R.emre) w.rotation.y=Math.PI; sub3d('…salon aynı. Ama bir şey değişti.',3000); setTimeout(()=>say('aile','teyze','Ben size demiştim 🙏'),2500); }
  if(n===2){ R.stalker.visible=true; R.stalker.position.set(-.2,0,R.cam.position.z-10); R.waiters.forEach((w,i)=>{ if(w!==R.emre && i%2) w.visible=false; }); setTimeout(()=>say('aile','anne','Nabzı var ama uyanmıyor'),2000); setTimeout(()=>say('bilinmeyen','bilinmeyen','lütfen sıranızı bekleyiniz'),6500); }
  if(n>=3){ R.waiters.forEach(w=>{ if(w!==R.emre) w.visible=false; }); R.scene.fog.near=2; R.scene.fog.far=18;
    setTimeout(()=>say('aile','babaanne',{type:'voice',vo:'babaanne_kursun',onPlay:()=>SFX.sizzle()}),1500); setTimeout(openGise,4000); }
}
function openGise(){
  if(R.giseOn) return; R.giseOn=true; setNumber(47);
  setTimeout(()=>vo('anons'),900);
  R.memur.visible=true; R.giseLight.intensity=6; R.signZero.material.color.setHex(0xffffff);
  R.signZero.material.map=textTex(['GİŞE 0'],{w:256,h:76,font:'bold 44px Roboto, sans-serif',bg:'#c8102e',fg:'#fff',border:null}); R.signZero.material.needsUpdate=true;
  sub3d('Gişe 0 açıldı.',3000); setTimeout(()=>say('bilinmeyen','bilinmeyen','sıranız geldi'),3000);
}
async function level0Script(){
  await sleep(4500); say('aile','anne',{type:'voice',vo:'anne_3d'});
  await sleep(8000); say('aile','baba','Ambulansı aradım, 10 dakikaya gelecekler');
  await sleep(14000); if(R.loop===0) sub3d('Gişelere doğru yürü.',3500);
  await sleep(150000); if(R && !R.giseOn){ R.loop=3; setNumber(46); loopEvents(3); }
}

/* =========================================================
   GİŞE VE SONLAR
   ========================================================= */
let formOpen=false;
$('actBtn').onclick=async()=>{ formOpen=true; $('actBtn').classList.remove('on'); sub3d('Memur: “'+LINES.memur_1.t+'”',4000); await vo('memur_1').done; showForm(); };
function showForm(){
  const f=$('fbox');
  f.innerHTML=`<h3>T.C. BEKLEME SALONU</h3><div class="fs">GİŞE 0 · SIRA NO 047 · DENİZ</div><div style="font-size:13px;margin-bottom:6px">Yapmak istediğiniz işlemi seçiniz:</div><button id="fDevir">▸ Sıramı devretmek istiyorum (Madde 14)</button><button id="fKabul">▸ Sıramı kabul ediyorum</button><div class="stampMark" id="stamp">İŞLEM TAMAM</div>`;
  $('form').classList.add('on'); $('fKabul').onclick=()=>endingKabul();
  $('fDevir').onclick=()=>{ f.innerHTML=`<h3>SIRA DEVRİ</h3><div class="fs">Devralan kişinin rızası aranmaz.</div>${['anne','baba','teyze','babaanne','bilinmeyen'].map(k=>`<button data-k="${k}">▸ ${PEOPLE[k].name}</button>`).join('')}<div class="stampMark" id="stamp">DEVREDİLDİ</div>`; f.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>endingDevir(b.dataset.k)); };
}
async function stampIt(){ await sleep(400); SFX.stamp(); $('stamp').classList.add('on'); $('device').classList.add('shake'); await sleep(160); $('device').classList.remove('shake'); await sleep(1600); }
function back2phone(){ R.running=false; A.humOff(); $('form').classList.remove('on'); $('three').style.display='none'; $('hud3d').classList.remove('on'); S.mode='phone'; S.phoneOpen=false; S.frozen=false; S.min=2*60+52; $('sb').style.color=''; $('screens').style.display='block'; paintStatus(); }
async function endingKabul(){
  await stampIt(); $('white').style.transition='opacity .1s'; $('white').style.background='#000'; $('white').style.opacity=1;
  await vo('memur_kabul').done; await sleep(1500);
  back2phone(); openChat('aile'); sys('aile','Deniz gruptan çıktı',true);
  $('white').style.transition='opacity 2s'; $('white').style.opacity=0; await sleep(2500);
  await say('aile','anne','Deniz'); await say('aile','anne','Deniz cevap ver',{after:2500});
  end('SON 1/3 — KABUL','Sıranı bekledin. İşlemin tamamlandı.<br>Aile grubunda adın artık gri.');
}
async function endingDevir(k){
  if(k==='bilinmeyen'){ $('fbox').innerHTML=`<h3>İŞLEM YAPILAMADI</h3><div class="fs">Bu kişinin sırası zaten gelmiştir.</div><div style="font-size:13px;line-height:1.5">Kayıtlı sıra no: <b>001</b><br>Kayıt tarihi: <b>—</b><br>Bu kişi uygulamayı ilk gönderen kişidir.</div><button id="fBack">▸ Geri</button>`; A.glitch(.4); vo('memur_bilinmeyen'); $('fBack').onclick=showForm; return; }
  await stampIt(); $('white').style.transition='opacity .1s'; $('white').style.background='#fff'; $('white').style.opacity=1; SFX.sizzle(); await sleep(2200);
  back2phone(); openChat('aile'); $('white').style.transition='opacity 2.5s'; $('white').style.opacity=0; await sleep(1500);
  await say('aile','anne','Uyandı!! Deniz uyandı 😭'); await say('aile','baba','Çok şükür'); await sleep(1500);
  sys('aile',PEOPLE[k].name+' gruptan çıktı',true); A.glitch(.3); await sleep(2200);
  await say('bilinmeyen','bilinmeyen','sıra numaranız: 48',{after:2500});
  end('SON 2/3 — DEVİR','Kurtuldun. Sıranı '+PEOPLE[k].name+' aldı.<br>Rızası aranmadı.');
}
function end(title,text){
  const o=$('overlay');
  o.innerHTML=`<h2>${title}</h2><p>${text}</p><p style="color:#6d777c;margin-top:8px">Üçüncü son: zinciri başlatan ilk kişiyi bul.<br><i>(Tam sürümde)</i></p><button class="big" id="again">BAŞTAN OYNA</button><small>SIRA · prototip</small>`;
  $('again').onclick=()=>location.reload();
  o.classList.remove('off'); o.style.opacity=0; o.style.transition='opacity 2s'; requestAnimationFrame(()=>o.style.opacity=1);
}

/* =========================================================
   BAŞLAT
   ========================================================= */
renderHome(); paintStatus(); renderList();
$('startBtn').onclick=async()=>{
  A.init();
  if('speechSynthesis' in window){ loadVoices(); const u=new SpeechSynthesisUtterance(' '); u.volume=0; speechSynthesis.speak(u); }
  $('startBtn').textContent='YÜKLENİYOR…';
  await Promise.race([loadAudio(), new Promise(r=>setTimeout(r,6000))]);
  document.querySelectorAll('.vm').forEach(()=>{});
  $('overlay').classList.add('off');
  story();
};
window.__S=S; window.__AMB=AMB; window.__M=MANIFEST; window.__R=()=>R; window.__CH=CH; window.__TASKS=TASKS;
