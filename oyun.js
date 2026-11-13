/* three.js yalnızca Bekleme Salonu'na girerken yüklenir (eski Safari'de import map desteği yok) */
let THREE=null;
const loadThree=async()=>{ if(!THREE) THREE=await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'); return THREE; };

/* =========================================================
   YARDIMCILAR
   ========================================================= */
const $ = id => document.getElementById(id);
const Q = new URLSearchParams(location.search);
const SPEED = Q.has('hizli') ? (parseFloat(Q.get('hizli'))||0.2) : 1;
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
  fwd:'M14 8V4l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z',
  tick1:'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
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
const SIRA_NO = Math.max(1, parseInt(new URLSearchParams(location.search).get('sira'))||47);
const S = {
  day:1, min:21*60+34, frozen:false, battery:64,
  screen:'lock', stack:[], mode:'phone', phoneOpen:false,
  chat:null, camMode:null, face:null, remain:24*3600, remainRun:false, cdZero:null,
};
const pad = n => String(n).padStart(2,'0');
const hhmm = (m=S.min) => pad(Math.floor(m/60)%24)+':'+pad(m%60);
const nowTs = () => S.day*1440 + S.min;
const DAYS = {1:['12 Kasım Perşembe','Perşembe, 12 Kasım'], 2:['13 Kasım Cuma','Cuma, 13 Kasım'], 3:['14 Kasım Cumartesi','Cumartesi, 14 Kasım']};
const DATES = {0:'11 KASIM',1:'12 KASIM',2:'13 KASIM',3:'14 KASIM'};
function setClock(h,m,day){ if(day) S.day=day; S.min=h*60+m; paintStatus(); refreshChips(); }
function paintStatus(){
  const t = S.frozen && S.mode==='3d' ? (Math.random()<.5?'02:47':'--:--') : hhmm();
  $('sbTime').textContent=t; $('lkClock').textContent=hhmm(); $('hmClock').textContent=hhmm();
  $('lkDate').textContent=DAYS[S.day][0]; $('hmDate').textContent=DAYS[S.day][1];
  $('sbBatT').textContent=S.battery+'%'; const b=$('sbBat'); b.style.setProperty('--b',S.battery+'%'); b.classList.toggle('low',S.battery<=15);
}
setInterval(()=>{ if(!S.frozen){ S.min++; } paintStatus(); }, 20000*SPEED);
setInterval(()=>{ if(S.battery>3){ S.battery--; paintStatus(); if(S.battery===15||S.battery===5) lowBattery(); } }, 70000*SPEED);
function lowBattery(){ if(S.mode!=='phone') return; A.tone(880,.12,{gain:.06}); A.tone(660,.18,{gain:.06,delay:.15}); toast({raw:`<div class="nt"><span class="ntAv" style="display:grid;place-items:center;background:#e8590c;font-size:20px">🔋</span><div class="ntB"><div class="ntH">Sistem · şimdi</div><div class="ntT">Pil zayıf · %${S.battery}</div><div class="ntX">${S.day>=2?'Telefonun kapanmadan önce sıranı tamamla.':'Telefonu şarja takın.'}</div></div></div>`},{}); }

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
const ALOG=window.__alog=[];
function alog(ev,id){ ALOG.push({ev,id,t:Math.round(performance.now()),rev:!!S.revealed,scr:S.screen}); if(ALOG.length>400) ALOG.shift(); }
function playBuf(id,{gain=1,pan=0,rate=1,phone=false,loop=false,dur=0}={}){
  const c=A.ctx, b=BUF[id]; if(!c||!b) return null;
  alog('play',id);
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
  s.addEventListener('ended',()=>alog('end',id));
  return {s,g,dur:b.duration/rate,stop(fade=0){ alog('stop',id); try{ if(fade){ const t=c.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value,t); g.gain.linearRampToValueAtTime(0.0001,t+fade); s.stop(t+fade+.05); } else s.stop(); }catch(e){} }};
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
  teyze_d1:{t:'Canlarım, bu testi herkes yapsın! Doğum tarihini giriyorsun, ne kadar ömrün kaldığını söylüyor, ÇOK doğru çıkıyor. Benimki on iki yıl çıktı, ay çok sevindim! Hadi bakın, bakın.', p:1.25, r:1.05},
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
      alog('tts',id);
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
    if(sz>32 && re.test(t)){ const k=sz/32; this.save(); this.fillStyle='#000'; this.font=this.font.replace(m[0],'32px'); this.translate(x,y); this.scale(k,k); ft.call(this,t,0,0,...r); this.restore(); }
    else if(re.test(t) && typeof this.fillStyle!=='string'){ this.save(); this.fillStyle='#000'; ft.call(this,t,x,y,...r); this.restore(); }
    else ft.call(this,t,x,y,...r); }; })();
function cv(w,h,draw){ const c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); return c; }
function grain(g,w,h,a=.12){ const d=g.getImageData(0,0,w,h); for(let i=0;i<d.data.length;i+=4){ const n=(Math.random()-.5)*255*a; d.data[i]+=n; d.data[i+1]+=n; d.data[i+2]+=n; } g.putImageData(d,0,0); }
function avatar(c1,c2,emoji,{size=160,fs=86}={}){ return cv(size,size,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,w,h); gr.addColorStop(0,c1); gr.addColorStop(1,c2); g.fillStyle=gr; g.fillRect(0,0,w,h); g.font=`${fs}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(emoji,w/2,h/2+6); }).toDataURL(); }
const AV = {
  aile: avatar('#2f6b55','#173a2d','🏠'),
  anne: 'img/anne.jpg',
  baba: 'img/baba.jpg',
  emre: 'img/emre.jpg',
  babaanne: 'img/babaanne.jpg',
  okul: avatar('#ffd36e','#e08a2c','📚'),
  teyze: 'img/teyze.jpg',
  kuzen: avatar('#3b5bdb','#1a2a6c','👊'),
  apt: avatar('#8aa1b1','#3d4f5c','🏢'),
  saha: avatar('#2e8b57','#14532d','⚽'),
  kargo: avatar('#ffb347','#e8590c','📦'),
  eniste: avatar('#3d8b3d','#1d4d1d','⚽'),
  yenge: avatar('#ff9a9e','#c2185b','🌹'),
  dayi: cv(160,160,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#f6a35c'); gr.addColorStop(.5,'#f7d488'); gr.addColorStop(.51,'#5d7d4a'); gr.addColorStop(1,'#2f4a25'); g.fillStyle=gr; g.fillRect(0,0,w,h); g.fillStyle='#fff3c4'; g.beginPath(); g.arc(110,62,16,0,7); g.fill(); g.fillStyle='#3b5530'; g.beginPath(); g.moveTo(0,90); g.quadraticCurveTo(50,60,90,88); g.quadraticCurveTo(130,70,160,92); g.lineTo(160,160); g.lineTo(0,160); g.fill(); }).toDataURL(),
  selin: avatar('#f8c8dc','#d980a8','💅'),
  burak: avatar('#5ec8f2','#1e6fa8','🎮'),
  mert: avatar('#38d9a9','#0b7285','😎'),
  zeynep: avatar('#e5dbff','#9775fa','🌸'),
  komsu: avatar('#ffe066','#f08c00','🌼'),
  yonetici: avatar('#a5b4c4','#495867','🔑'),
  kaan: avatar('#ffa8a8','#c92a2a','🏃'),
  unknown: cv(160,160,(g,w,h)=>{ g.fillStyle='#6a7175'; g.fillRect(0,0,w,h); g.fillStyle='#cfd4d6'; g.beginPath(); g.arc(80,62,30,0,7); g.fill(); g.beginPath(); g.ellipse(80,150,58,48,0,Math.PI,0); g.fill(); }).toDataURL(),
};
const IMG = {
  gunaydin: cv(360,360,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,w,h); gr.addColorStop(0,'#ffd1e8'); gr.addColorStop(1,'#ff8fb8'); g.fillStyle=gr; g.fillRect(0,0,w,h); g.font='60px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.textAlign='center'; ['🌹','🌸','🌹','🌷','🌹'].forEach((e,i)=>g.fillText(e,40+i*70,86+(i%2)*18)); ['🌷','🌹','🌸','🌹','🌸'].forEach((e,i)=>g.fillText(e,40+i*70,330-(i%2)*14)); g.fillStyle='#a1003b'; g.font='italic bold 56px Georgia'; g.fillText('Günaydın',w/2,192); g.font='italic 23px Georgia'; g.fillStyle='#6d0028'; g.fillText('Güzel bir gün olsun ✨',w/2,234); }).toDataURL(),
  linkThumb: cv(500,260,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,w,h); gr.addColorStop(0,'#3a0d4f'); gr.addColorStop(1,'#c2185b'); g.fillStyle=gr; g.fillRect(0,0,w,h); for(let i=0;i<40;i++){ g.fillStyle=`rgba(255,255,255,${Math.random()*.25})`; g.beginPath(); g.arc(Math.random()*w,Math.random()*h,Math.random()*3,0,7); g.fill(); } g.font='86px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.textAlign='center'; g.fillText('⏳',w/2-150,h/2+30); g.fillStyle='#fff'; g.font='bold 48px Roboto, sans-serif'; g.fillText('ÖMÜR TESTİ',w/2+40,h/2-6); g.font='20px Roboto, sans-serif'; g.fillStyle='#ffd6e7'; g.fillText('Doğum tarihine göre kalan ömrün',w/2+40,h/2+30); g.font='bold 18px Roboto, sans-serif'; g.fillStyle='#ffeb3b'; g.fillText('%98 DOĞRU ÇIKIYOR 😱',w/2+40,h/2+62); }).toDataURL(),
  ekmek: cv(300,300,(g,w,h)=>{ g.fillStyle='#4b2e1c'; g.fillRect(0,0,w,h); g.font='150px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.textAlign='center'; g.fillText('🥖',w/2,200); }).toDataURL(),
  mac: cv(300,300,(g,w,h)=>{ g.fillStyle='#1e5c2b'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(255,255,255,.4)'; g.lineWidth=3; g.strokeRect(20,20,260,260); g.beginPath(); g.arc(150,150,40,0,7); g.stroke(); g.font='70px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.textAlign='center'; g.fillText('⚽',150,175); }).toDataURL(),
  deniz: cv(300,300,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#8fd3ff'); gr.addColorStop(.55,'#2f86c9'); gr.addColorStop(.56,'#1f5f8f'); gr.addColorStop(1,'#e8d29a'); g.fillStyle=gr; g.fillRect(0,0,w,h); }).toDataURL(),
  kedi: cv(300,300,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#c98f4d'); gr.addColorStop(1,'#6b4426'); g.fillStyle=gr; g.fillRect(0,0,w,h); g.font='150px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.textAlign='center'; g.fillText('🐈',w/2,210); }).toDataURL(),
};
function siraCard(no,txt,sub){ return cv(360,420,(g,w,h)=>{ g.fillStyle='#f6efe0'; g.fillRect(0,0,w,h); g.strokeStyle='#d8c08a'; g.lineWidth=6; g.strokeRect(10,10,w-20,h-20); g.fillStyle='#7a5a1c'; g.font='bold 30px Roboto, sans-serif'; g.textAlign='center'; g.fillText('⏳ ÖMÜR TESTİ',w/2,66); g.font='14px Georgia'; g.fillStyle='#9b8a68'; g.fillText('Kalan ömrünüz',w/2,130); g.fillStyle='#8b0f1f'; g.font='110px VT323, monospace'; g.fillText(txt,w/2,240); g.fillStyle='#7a5a1c'; g.font='22px Georgia'; g.fillText(sub,w/2,282); g.fillStyle='#b5a27c'; g.font='13px Georgia'; g.fillText('Sıra no: '+no+'   ·   e-sira.app',w/2,370); }).toDataURL(); }
IMG.gunaydin2 = cv(360,360,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#fff3d6'); gr.addColorStop(1,'#f5b971'); g.fillStyle=gr; g.fillRect(0,0,w,h); g.font='120px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.textAlign='center'; g.fillText('☕',w/2,170); g.fillStyle='#7a3e00'; g.font='italic bold 54px Georgia'; g.fillText('Günaydın',w/2,250); g.font='italic 22px Georgia'; g.fillStyle='#8a5a22'; g.fillText('Sevdiklerimle güzel bir gün 🌼',w/2,292); }).toDataURL();
IMG.yemek = cv(360,300,(g,w,h)=>{ g.fillStyle='#7b4a2a'; g.fillRect(0,0,w,h); for(let y=0;y<h;y+=30) for(let x=0;x<w;x+=30){ g.fillStyle=((x+y)/30)%2?'#c0392b':'#f3e5d8'; g.globalAlpha=.25; g.fillRect(x,y,30,30); } g.globalAlpha=1; g.fillStyle='#d9d4c9'; g.beginPath(); g.ellipse(w/2,h/2+10,140,100,0,0,7); g.fill(); g.font='64px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.textAlign='center'; ['🫑','🍅','🫑','🍅','🫑'].forEach((e,i)=>g.fillText(e,70+i*55,h/2+(i%2?-10:30))); grain(g,w,h,.08); }).toDataURL();
IMG.oda = cv(360,480,(g,w,h)=>{ g.fillStyle='#07080a'; g.fillRect(0,0,w,h); const gr=g.createLinearGradient(0,h*.78,0,h*.82); gr.addColorStop(0,'rgba(255,190,110,0)'); gr.addColorStop(.5,'rgba(255,190,110,.35)'); gr.addColorStop(1,'rgba(255,190,110,0)'); g.fillStyle=gr; g.fillRect(w*.55,h*.78,w*.4,h*.04); g.fillStyle='#14161b'; g.fillRect(20,h*.5,w*.55,h*.3); g.fillStyle='#1d2027'; g.beginPath(); g.ellipse(w*.3,h*.55,w*.2,h*.06,0,0,7); g.fill(); g.fillStyle='#2a2d33'; g.beginPath(); g.ellipse(w*.12,h*.53,18,14,0,0,7); g.fill(); grain(g,w,h,.22); g.fillStyle='rgba(255,154,46,.85)'; g.font='22px VT323, monospace'; g.textAlign='right'; g.fillText('13.11  03:11',w-14,h-14); }).toDataURL();
IMG.emreShot = siraCard('12','1','gün');
IMG.myShot = siraCard(String(SIRA_NO),'9','gün');

IMG.emreThumb = 'video/emre_kapi.jpg';

/* =========================================================
   SOHBETLER
   ========================================================= */
const PEOPLE = {
  anne:{name:'Annem', color:'#f5a3c7', av:'anne', spd:105},
  baba:{name:'Babam', color:'#7fb2ff', av:'baba', spd:120},
  teyze:{name:'Nermin Teyze', color:'#ffb35c', av:'teyze', spd:150},
  emre:{name:'Emre', color:'#53bdeb', av:'emre', spd:55},
  babaanne:{name:'Babaanne', color:'#c79ef7', av:'babaanne', spd:230},
  eniste:{name:'Hüseyin Enişte', color:'#8fd18f', av:'eniste', spd:135},
  yenge:{name:'Gülay Yenge', color:'#f28b82', av:'yenge', spd:125},
  dayi:{name:'Kemal Dayı', color:'#e3c16f', av:'dayi', spd:145},
  selin:{name:'Selin', color:'#ff8fb1', av:'selin', spd:45},
  burak:{name:'Burak', color:'#5ec8f2', av:'burak', spd:50},
  mert:{name:'Mert', color:'#38d9a9', av:'mert', spd:45},
  zeynep:{name:'Zeynep', color:'#b197fc', av:'zeynep', spd:50},
  ali:{name:'Ali', color:'#7ee0a1', av:'unknown', spd:50},
  kaan:{name:'Kaan', color:'#ffa8a8', av:'kaan', spd:50},
  komsu:{name:'Ayten Hanım D.6', color:'#ffd43b', av:'komsu', spd:170},
  yonetici:{name:'Cengiz Bey Yönetici', color:'#9fd3e6', av:'yonetici', spd:140},
  kargo:{name:'Kargo Takip', color:'#ffb347', av:'kargo', spd:30},
  bilinmeyen:{name:'+90 5•• ••• •• 47', color:'#f15c6d', av:'unknown', spd:60},
};
const CH = {
  aile:{title:'Kocaman Ailemiz ❤️', av:'aile', group:true, sub:'Annem, Babam, Babaanne, Emre, Gülay Yenge, Hüseyin Enişte, Kemal Dayı, Nermin Teyze, Selin, Sen', pinned:true},
  kuzen:{title:'Kuzenler 👊', av:'kuzen', group:true, sub:'Burak, Emre, Selin, Sen'},
  emre:{title:'Emre', av:'emre', sub:'son görülme dün 23:41'},
  anne:{title:'Annem', av:'anne', sub:'çevrimiçi'},
  baba:{title:'Babam', av:'baba', sub:'son görülme bugün 21:02'},
  mert:{title:'Mert', av:'mert', sub:'son görülme bugün 22:10'},
  okul:{title:'12-B 📚', av:'okul', group:true, sub:'Ali, Kaan, Zeynep, +27 kişi', muted:true},
  saha:{title:'Perşembe Halı Saha ⚽', av:'saha', group:true, sub:'Kaan, Mert, Ali, +8 kişi', muted:true},
  apt:{title:'B Blok Sakinleri 🏢', av:'apt', group:true, sub:'Cengiz Bey Yönetici, Ayten Hanım D.6, +19 kişi', muted:true},
  zeynep:{title:'Zeynep', av:'zeynep', sub:'son görülme dün 23:02'},
  kargo:{title:'Kargo Takip', av:'kargo', sub:'İşletme hesabı'},
  bilinmeyen:{title:'+90 5•• ••• •• 47', av:'unknown', sub:'çevrimiçi', hidden:true},
  teyze:{title:'Nermin Teyze', av:'teyze', sub:'son görülme bugün 01:12', hidden:true},
  babaanne:{title:'Babaanne', av:'babaanne', sub:'son görülme dün 21:40', hidden:true},
};
const wrap=$('msgWrap');
for(const id in CH){ const c=CH[id]; c.id=id; c.el=document.createElement('div'); c.el.className='msgs'; wrap.appendChild(c.el); c.unread=0; c.lastTs=0; c.last=''; c.prev=null; c.lastDay=null; c.typing=null; c.pending=null; c.list=[]; }
/* sohbet duvar kağıdı (doodle deseni) */
wrap.style.backgroundImage=`url(${cv(420,420,(g,w,h)=>{ g.strokeStyle='rgba(233,237,239,.05)'; g.lineWidth=2; g.lineCap='round'; const sh=[(x,y)=>{g.beginPath();g.arc(x,y,9,0,7);g.stroke();},(x,y)=>{g.beginPath();g.moveTo(x-8,y+6);g.lineTo(x,y-8);g.lineTo(x+8,y+6);g.closePath();g.stroke();},(x,y)=>{g.strokeRect(x-7,y-10,14,20);},(x,y)=>{g.beginPath();g.moveTo(x-9,y);g.quadraticCurveTo(x,y-14,x+9,y);g.quadraticCurveTo(x,y+14,x-9,y);g.stroke();},(x,y)=>{g.beginPath();g.moveTo(x,y-9);g.lineTo(x+3,y-2);g.lineTo(x+9,y-2);g.lineTo(x+4,y+3);g.lineTo(x+6,y+10);g.lineTo(x,y+6);g.lineTo(x-6,y+10);g.lineTo(x-4,y+3);g.lineTo(x-9,y-2);g.lineTo(x-3,y-2);g.closePath();g.stroke();},(x,y)=>{g.beginPath();g.arc(x,y,4,0,7);g.moveTo(x+10,y);g.arc(x,y,10,0,7);g.stroke();}]; for(let y=20;y<h;y+=46) for(let x=20+(y/46%2)*22;x<w;x+=44){ g.save(); g.translate(x,y); g.rotate(Math.random()*6); sh[Math.floor(Math.random()*sh.length)](0,0); g.restore(); } }).toDataURL()})`;

function previewOf(m,c){
  if(m.type==='e2e') return {t:c.last||'', mine:false};
  let t = m.type==='voice' ? '🎤 Sesli mesaj' : m.type==='image' ? '📷 '+(m.cap||'Fotoğraf') : m.type==='video' ? '🎥 Video' : m.type==='call' ? '📞 Cevapsız sesli arama' : m.type==='link' ? (m.text||m.url) : (m.text||'');
  if(m.type==='sys') return {t:m.text, mine:false};
  if(m.deleted) t='🚫 Bu mesaj silindi';
  if(c.group && m.from!=='me') t = PEOPLE[m.from].name+': '+t;
  return {t, mine:m.from==='me'};
}
function dayLabel(d){ return d===S.day ? 'BUGÜN' : d===S.day-1 ? 'DÜN' : (DATES[d]||'11 KASIM'); }
function refreshChips(){ document.querySelectorAll('.chip[data-day]').forEach(e=>e.textContent=dayLabel(+e.dataset.day)); }

function post(cid, m){
  const c=CH[cid];
  m.day = m.day ?? S.day; m.time = m.time ?? hhmm(); m.ts = m.ts ?? nowTs();
  if(c.lastDay!==m.day){ const ch=document.createElement('div'); ch.className='chip'; ch.dataset.day=m.day; ch.textContent=dayLabel(m.day); c.el.appendChild(ch); c.lastDay=m.day; c.prev=null; }
  const el=renderMsg(c,m);
  c.el.appendChild(el); m.el=el; m.cid=cid; c.list.push(m);
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
  const ticks = out ? (m.flipped||m.delivered ? `<span class="tk one">${svg('ticks')}</span>` : m.day>=2 ? `<span class="tk one">${svg('tick1')}</span>` : `<span class="tk">${svg('ticks')}</span>`) : '';
  const meta = `<span class="meta">${m.time}${ticks}</span>`;
  let cls='bub';
  if(m.deleted){
    inner = nm + `<span class="tx del">🚫 ${out?'Bu mesajı sildiniz':'Bu mesaj silindi'}</span><span class="sp"></span>` + meta;
  } else if(m.type==='text'||!m.type){
    inner = nm + (m.fwd?`<div class="fwd">${svg('fwd')}${m.fwd==='cok'?'Çok kez iletildi':'İletildi'}</div>`:'') + (m.quote?`<div class="q" style="--qc:${PEOPLE[m.quote.who]?.color||'#06cf9c'}"><b>${esc(m.quote.who==='me'?'Siz':PEOPLE[m.quote.who].name)}</b><span>${esc(m.quote.text)}</span></div>`:'') + `<span class="tx">${esc(m.text)}</span><span class="sp"></span>` + meta;
  } else if(m.type==='image'){
    cls+=' media'+(m.cap?' hascap':''); inner = (nm?`<div style="padding:2px 6px 3px">${nm}</div>`:'') + `<img src="${m.src}" alt="">` + (m.cap?`<div class="cap">${esc(m.cap)}<span class="sp"></span></div>`:'') + meta;
  } else if(m.type==='video'){
    cls+=' media'; inner = nm + `<div class="vthumb"><img src="${m.thumb}" alt="" style="height:330px;object-fit:cover"><span class="pbtn">${svg('play')}</span><span class="vd">${svg('video')}${m.dur}</span></div>` + meta;
  } else if(m.type==='voice'){
    const bars=Array.from({length:32},()=>`<s style="height:${Math.round(rnd(3,24))}px"></s>`).join('');
    const avk = out ? null : PEOPLE[m.from].av;
    inner = `<div class="vm">${avk?`<div class="vav"><img src="${AV[avk]}"><i>${svg('mic')}</i></div>`:''}<button class="vpl">${svg('play')}</button><div class="vw">${bars}<u></u></div></div><span class="vdur">${fmtDur(m.alt?9:lineDur(m.vo))}</span>` + meta;
  } else if(m.type==='call'){
    inner = out ? `<div class="callb"><span class="ci out">${svg('outgoing')}</span><div><b>Giden sesli arama</b><small>Cevaplanmadı</small></div></div>` + meta
               : `<div class="callb"><span class="ci">${svg('missed')}</span><div><b>Cevapsız sesli arama</b><small>Geri aramak için dokunun</small></div></div>` + meta;
  } else if(m.type==='link'){
    inner = nm + `<div class="lp"><img src="${m.thumb}" alt=""><div><b>${esc(m.title)}</b><span>${esc(m.desc)}</span><small>${esc(m.domain)}</small></div></div><span class="tx">${m.text?esc(m.text)+'\n':''}<a>${esc(m.url)}</a></span><span class="sp"></span>` + meta;
  }
  const b=document.createElement('div'); b.className=cls; b.innerHTML=inner; row.appendChild(b);
  if(m.deleted) return row;
  if(m.type==='image') b.querySelector('img').onclick=()=>openViewer({img:m.src, who:m.from==='me'?'Siz':PEOPLE[m.from].name, when:m.time});
  if(m.type==='video') b.querySelector('.vthumb').onclick=()=>openViewer({video:m.video, who:m.from==='me'?'Siz':PEOPLE[m.from].name, when:m.time});
  if(m.type==='voice') setupVoice(b,m);
  if(m.type==='call') b.querySelector('.callb').onclick=()=>outgoingCall(out?c.id:m.from);
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
    const D=m.alt?9:lineDur(m.vo), pr=p=>{ const k=Math.round(p*bars.length); bars.forEach((s,i)=>s.classList.toggle('p',i<k)); dot.style.left=(p*100)+'%'; dur.textContent=fmtDur(D*p); };
    h = m.alt ? recVO(9,pr) : vo(m.vo,{onprog:pr});
    if(m.onPlay) m.onPlay();
    h.done.then(()=>{ btn.innerHTML=svg('play'); h=null; dur.textContent=fmtDur(m.alt?9:lineDur(m.vo)); m.onDone&&m.onDone(); });
  };
}

function renderList(){
  const l=$('clist'); l.innerHTML='';
  const arr=Object.values(CH).filter(c=>!c.hidden && !c.archived && (chipF==='all' || (chipF==='un'&&c.unread>0) || (chipF==='fav'&&c.pinned) || (chipF==='grp'&&c.group))).sort((a,b)=>(b.pinned-a.pinned)||(b.lastTs-a.lastTs));
  let totalChats=0;
  for(const c of arr){
    if(c.unread) totalChats++;
    const r=document.createElement('button'); r.className='crow'+(c.unread?' un':'');
    const avsrc = c.avImg || AV[c.av];
    const line2 = c.typing ? `<p class="typing">${esc(typingLabel(c,c.typing))}</p>` : `<p>${c.lastMine?`<span class="tk">${svg('ticks')}</span>`:''}${esc(c.last)}</p>`;
    r.innerHTML=`<img src="${avsrc}" alt=""><div class="cm"><div class="l1"><b>${esc(c.title)}</b><span>${c.lastTime||''}</span></div><div class="l2">${line2}${c.muted?`<span class="ic mute">${svg('mute')}</span>`:''}${c.pinned&&!c.unread?`<span class="ic pin">${svg('pin')}</span>`:''}${c.unread?`<span class="ub">${c.unread}</span>`:''}</div></div>`;
    r.onclick=()=>openChat(c.id);
    l.appendChild(r);
  }
  $('chipUn').textContent = totalChats? totalChats : '';
  for(const id of ['navUn','bdWa2','bd3d']){ const e=$(id); e.textContent=totalChats; e.classList.toggle('on',totalChats>0); }
  const hb=document.querySelector('#hmGrid [data-open="wa"] .badge'); if(hb){ hb.textContent=totalChats; hb.classList.toggle('on',totalChats>0); }
}
const typingLabel=(c,who)=>(c.group?PEOPLE[who].name+' ':'')+(c.typingRec?'ses kaydediyor…':'yazıyor…');
function setTyping(cid, who, rec=false){
  const c=CH[cid]; c.typing=who; c.typingRec=!!(who&&rec); renderList();
  if(S.chat===cid){ const s=$('cSub'); if(who){ s.textContent=typingLabel(c,who); s.classList.add('typing'); } else { s.textContent=c.sub; s.classList.remove('typing'); } }
}
/* Mesaj temposu: herkes kendi hızında yazar (PEOPLE.spd = harf başına ms). Büyütürsen her şey yavaşlar. */
const TEMPO=1;
async function say(cid, from, m, o={}){
  if(typeof m==='string') m={type:'text', text:m};
  const len=(m.text||'').length, spd=PEOPLE[from]?.spd||90;
  let typ;
  if(o.typing!=null) typ=o.typing;
  else if(m.type==='voice') typ=lineDur(m.vo)*1000+1500;          // kayıt süresi kadar "ses kaydediyor…"
  else if(m.type==='image'||m.type==='video') typ=3200;
  else if(m.type==='link') typ=1800;
  else typ=Math.min(11000, 1400 + len*spd);                        // yaşlılar yavaş, gençler hızlı yazar
  const same = CH[cid].prev===from;
  const gap = o.gap ?? (same ? rnd(700,2200) : rnd(3500,8500));    // başkasının mesajını okuyup cevap verme arası
  await sleep(gap*TEMPO);
  setTyping(cid, from, m.type==='voice'); await sleep(typ*TEMPO); setTyping(cid, null);
  m.from=from; post(cid,m);
  await sleep((o.after ?? 900)*TEMPO);
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
  l.innerHTML=''; p.classList.add('on'); $('rpT').textContent='Yanıtını seç';
  c.pending.opts.forEach((o,i)=>{ const b=document.createElement('button'); b.textContent=o; b.onclick=()=>typeOut(cid,o,i); l.appendChild(b); });
  setTimeout(()=>wrap.scrollTop=wrap.scrollHeight,30);
}
/* mesaj kutusuna dokununca: bekleyen seçim yoksa o sohbete o an yazılabilecekler */
function showFree(cid){
  const c=CH[cid], p=$('replyPanel'), l=$('rpList');
  if(c.pending){ showReplies(cid); return; }
  l.innerHTML=''; p.classList.add('on');
  const opts=(c.free||[]).filter(o=>!o.used);
  if(!opts.length){ $('rpT').textContent='Ne yazacağını bilemiyorsun.'; setTimeout(()=>{ if(!c.pending) p.classList.remove('on'); },1800); return; }
  $('rpT').textContent='Yaz';
  opts.forEach(o=>{ const b=document.createElement('button'); b.textContent=o.t; b.onclick=()=>{ o.used=true; typeOut(cid,o.t,-1,o); }; l.appendChild(b); });
}
$('fieldTxt').parentElement.addEventListener('click',()=>{ if(S.chat && !$('sendBtn').classList.contains('go')) showFree(S.chat); });
function kbWords(){ return S.day>=2 && Math.random()<.5 ? ['sıra','sende','uyan'] : ['Tamam','Peki','😂']; }
async function typeOut(cid,text,i,free){
  const c=CH[cid], pend=c.pending; if(!pend && !free) return;
  $('replyPanel').classList.remove('on');
  const f=$('fieldTxt'); f.classList.remove('ph'); f.textContent='';
  const kb=$('kbSug'); kb.innerHTML=kbWords().map(w=>`<span>${esc(w)}</span>`).join(''); kb.classList.add('on');
  for(const ch of [...text]){ f.textContent+=ch; A.key(); await new Promise(r=>setTimeout(r,32*SPEED)); }
  const sb=$('sendBtn'); $('sendIc').innerHTML=svg('send'); sb.classList.add('go');
  await new Promise(r=>sb.onclick=r);
  sb.onclick=null; sb.classList.remove('go'); $('sendIc').innerHTML=svg('mic'); kb.classList.remove('on');
  f.textContent='Mesaj'; f.classList.add('ph');
  A.send();
  if(free){ const m={from:'me',type:'text',text}; post(cid,m); free.on&&free.on(m); return; }
  c.pending=null;
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
  const prev=S.screen;
  document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));
  S.screen=id;
  $('sb').classList.toggle('dark', LIGHT.has(id));
  if(S.camOn && id!=='camera'){ S.camOn=false; camLeave(); }
  if(id==='wa'){ renderList(); renderCalls(); }
  if(id==='gallery') renderGallery();
  if(id==='phone') renderPhone();
  if(id==='clockApp') renderClock();
  if(id==='settings') renderSettings();
  if(id==='camera'){ S.camOn=true; camOpen(); }
  if(id!=='phone') S.pickChat=false;
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
  $('cSub').textContent=c.typing?typingLabel(c,c.typing):c.sub; $('cSub').classList.toggle('typing',!!c.typing);
  c.el.querySelector('.undiv')?.remove();
  if(c.unread){ const rows=[...c.el.querySelectorAll('.mrow.in, .sysm')]; const at=rows[Math.max(0,rows.length-c.unread)]; if(at){ const d=document.createElement('div'); d.className='undiv'; d.textContent=c.unread+' OKUNMAMIŞ MESAJ'; c.el.insertBefore(d,at); } }
  c.unread=0; renderList();
  if(S.mode==='3d') openPhone3d();
  if(S.screen!=='chat') show('chat');
  showReplies(cid);
  requestAnimationFrame(()=>{ const d=c.el.querySelector('.undiv'); wrap.scrollTop = d ? d.offsetTop-80 : wrap.scrollHeight; });
  c.onOpen && c.onOpen();
  if(S.revealed && c.revealPending) revealAnim(cid);
}
$('lock').onclick=()=>{ if(S.lockTap) S.lockTap(); };

/* ---------- ana ekran ---------- */
const HOME_APPS=[
  {id:'wa',label:'Sohbet',cls:'ic-wa',ic:'wa',badge:true},
  {id:'phone',label:'Telefon',cls:'ic-phone',ic:'call'},
  {id:'gallery',label:'Galeri',cls:'ic-gal',ic:'photo'},
  {id:'camera',label:'Kamera',cls:'ic-cam',ic:'camera'},
  {id:'clockApp',label:'Saat',cls:'ic-clock',ic:'clock'},
  {id:'settings',label:'Ayarlar',cls:'ic-set',ic:'settings'},
];
function renderHome(){
  $('hmGrid').innerHTML=HOME_APPS.map(a=>`<button class="app${a.isNew?' new':''}${a.locked?' lock':''}" ${a.action?`data-act="${a.action}"`:`data-open="${a.id}"`}><span class="ico ${a.cls}">${a.txt||svg(a.ic)}</span><b>${a.label}</b>${a.badge?'<i class="badge"></i>':''}</button>`).join('');
  document.querySelectorAll('.hmDock .ico').forEach((e,i)=>{ if(!e.firstChild) e.innerHTML=svg(['call','wa','photo','camera'][i]); });
  $('hmGrid').querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>ACTIONS[b.dataset.act]());
  renderList();
}
const ACTIONS={ sira:()=>openSira() };

/* ---------- aramalar listesi ---------- */
const CALLS=[ {who:'babaanne',kind:'in',t:'Dün 19:02'}, {who:'anne',kind:'out',t:'Dün 12:40'}, {who:'baba',kind:'in',t:'10 Kasım 18:15'} ];
function callRow(c){ const p=PEOPLE[c.who]; const ic=c.kind==='missed'?'missed':c.kind==='in'?'incoming':'outgoing'; return `<div class="clrow" data-call="${c.who}"><img src="${AV[p.av]}"><div class="cm"><b class="${c.kind==='missed'?'miss':''}">${esc(p.name)}${c.n>1?` (${c.n})`:''}</b><small><span class="ic ${c.kind==='missed'?'miss':'inc'}">${svg(ic)}</span>${esc(c.t)}</small></div><span class="ic">${svg('call')}</span></div>`; }
function renderCalls(){ $('callList').innerHTML=CALLS.map(callRow).join(''); }
function addCall(c){ CALLS.unshift(c); if(c.kind==='missed'){ S.missedCalls=(S.missedCalls||0)+1; const e=$('navCall'); e.textContent=S.missedCalls; e.classList.add('on'); } renderCalls(); }

/* ---------- galeri ---------- */
const PHOTOS=[ {img:IMG.ekmek,when:'Dün'}, {img:IMG.mac,when:'10 Kasım'}, {img:IMG.deniz,when:'Ağustos'}, {img:IMG.kedi,when:'Temmuz'} ];
function renderGallery(){
  $('gGrid').innerHTML='';
  PHOTOS.forEach(p=>{ const d=document.createElement('div'); d.className='gi'; d.innerHTML=`<img src="${p.thumb||p.img}">${p.video?`<span>${svg('video')}0:10</span>`:''}`; d.onclick=()=>openViewer({img:p.video?null:p.img, video:p.video, who:p.who||'Galeri', when:p.when}); $('gGrid').appendChild(d); });
}

/* ---------- medya görüntüleyici / video oynatıcı ---------- */
const VIDEOS={ emre:{src:'video/emre_kapi.mp4'} };
function openViewer({img,video,who,when}){
  $('vWho').textContent=who||''; $('vWhen').textContent=when||'';
  const im=$('vImg'), vv=$('vVid');
  im.style.display=img?'block':'none'; vv.style.display=video?'block':'none'; $('vCtl').style.display=video?'flex':'none'; $('vBig').style.display='none';
  if(img) im.src=img;
  show('viewer');
  if(video) startVideo(video);
}
$('vBack').onclick=()=>{ stopVideo(); back(); };
function startVideo(key){
  const V=VIDEOS[key], vv=$('vVid');
  if(vv.getAttribute('src')!==V.src) vv.src=V.src;
  vv.currentTime=0; vv.muted=false; vv.volume=1;
  const p=vv.play(); if(p&&p.catch) p.catch(()=>{ $('vBig').style.display='grid'; });
  $('vPlay').innerHTML=svg('pause');
  vv.ontimeupdate=()=>{ const d=vv.duration||10; $('vCur').textContent=fmtDur(vv.currentTime); $('vDur').textContent=fmtDur(d); $('vFill').style.width=(vv.currentTime/d*100)+'%'; };
  vv.onended=()=>{ $('vPlay').innerHTML=svg('play'); $('vBig').style.display='grid'; A.glitch(.4); };
  const toggle=()=>{ if(vv.paused){ vv.play(); $('vPlay').innerHTML=svg('pause'); $('vBig').style.display='none'; } else { vv.pause(); $('vPlay').innerHTML=svg('play'); $('vBig').style.display='grid'; } };
  $('vPlay').onclick=toggle; $('vBig').onclick=toggle; vv.onclick=toggle;
  if(key==='emre') S.sawVideo=true;
}
function stopVideo(){ const vv=$('vVid'); try{ vv.pause(); }catch(e){} }

/* =========================================================
   UYGULAMALAR: ana ekran çubuğu, saat, ayarlar, kamera, telefon, durumlar
   ========================================================= */
$('homeBar').onclick=()=>{
  if(S.mode!=='phone' || ['call','game','lock'].includes(S.screen) || $('task').classList.contains('on')) return;
  if(S.screen==='viewer') stopVideo();
  if(S.screen==='chat') S.chat=null;
  S.stack=[]; show('home',false);
};

/* ---------- saat ---------- */
const ALARMS=[{t:'07:00',d:'Hafta içi',on:false},{t:'03:11',d:'Her gün',on:true,lock:true},{t:'10:30',d:'Cumartesi',on:false}];
function renderClock(){
  const d2=S.day>=2;
  $('clkBody').innerHTML=`<div class="clkBig">${hhmm()}</div><div class="clkDate">${DAYS[S.day][1]}</div>
    <div class="clkSec">Alarmlar</div>
    ${ALARMS.map((a,i)=>`<div class="alm${a.on?' on':''}" data-a="${i}"><div><b>${a.t}</b><span>${a.d}${a.lock&&d2?' · <em>SIRA</em>':''}</span></div><button class="tgl"><i></i></button></div>`).join('')}
    <small class="clkNote" id="clkNote"></small>`;
  $('clkBody').querySelectorAll('.alm').forEach(r=>r.querySelector('.tgl').onclick=()=>{
    const a=ALARMS[+r.dataset.a]; a.on=!a.on; A.key(); renderClock();
    if(a.lock && !a.on) setTimeout(()=>{ a.on=true; A.glitch(.2); if(S.screen==='clockApp'){ renderClock(); $('clkNote').textContent='Bu alarm kapatılamaz.'; } },900);
  });
}

/* ---------- ayarlar ---------- */
function renderSettings(){
  const d2=S.day>=2;
  $('setBody').innerHTML=`<div class="setMe"><img src="${S.faceRaw||S.face||AV.unknown}" alt=""><div><b>Deniz</b><span>+90 532 ••• •• 47</span></div></div>
    <div class="setRow"><span>🔋</span><div><b>Pil</b><small>%${S.battery} · ${S.battery<20?'Düşük güç modu önerilir':'Normal kullanım'}</small></div></div>
    <div class="setRow"><span>⏱️</span><div><b>Ekran süresi</b><small>Bugün</small></div></div>
    <div class="setUse"><div><i style="width:64%"></i><b>Sohbet</b><em>3 sa 41 dk</em></div><div><i style="width:16%"></i><b>Galeri</b><em>24 dk</em></div>${d2?`<div class="red"><i style="width:100%"></i><b>e-Sıra</b><em>47 sa 00 dk</em></div>`:`<div><i style="width:6%"></i><b>Tarayıcı</b><em>9 dk</em></div>`}</div>
    <div class="setRow"><span>🌙</span><div><b>Uyku modu</b><small>23:30 – 07:00</small></div></div>
    <div class="setRow"><span>🔔</span><div><b>Bildirimler</b><small>${d2?'e-Sıra bildirimleri kapatılamaz':'Açık'}</small></div></div>
    <div class="setRow"><span>📱</span><div><b>Telefon hakkında</b><small>Deniz'in telefonu</small></div></div>`;
}

/* ---------- kamera ---------- */
async function camOpen(){
  const v=$('camVid'), msg=$('camMsg'); msg.textContent=''; $('camScare').style.opacity=0; v.style.display='none';
  $('camLast').style.backgroundImage = PHOTOS[0] ? `url(${PHOTOS[0].thumb||PHOTOS[0].img})` : 'none';
  if(S.camMode==='nocam'){ msg.textContent='Kameraya izin vermedin.'; return; }
  msg.textContent='Kamera açılıyor…';
  const ok = CAM.stream ? true : await camStart();
  if(S.screen!=='camera') return;
  if(!ok){ msg.textContent='Kamera başlatılamadı.'; if(!S.camMode) S.camMode='nocam'; return; }
  if(!S.camMode){ S.camMode='cam'; loadFace(); }
  msg.textContent=''; v.srcObject=CAM.stream; v.style.display='block'; try{ await v.play(); }catch(e){}
  if(S.day>=2 && !S.camScared){ S.camScared=true; setTimeout(()=>{ if(S.screen==='camera') camGhost(.32,260); },5200); }
}
function drawFigure(g,w,h,x,y,a=1,s=1){
  g.save(); g.globalAlpha=a;
  const gr=g.createRadialGradient(x,y,4,x,y,120*s); gr.addColorStop(0,'rgba(0,0,0,.9)'); gr.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gr; g.fillRect(0,0,w,h);
  g.fillStyle='rgba(8,8,10,.96)'; g.beginPath(); g.ellipse(x,y,34*s,46*s,0,0,7); g.fill();
  g.beginPath(); g.moveTo(x-70*s,h); g.quadraticCurveTo(x-60*s,y+60*s,x,y+40*s); g.quadraticCurveTo(x+60*s,y+60*s,x+70*s,h); g.fill();
  g.fillStyle='#d9d4c8'; g.beginPath(); g.ellipse(x-12*s,y-4*s,4*s,6*s,0,0,7); g.ellipse(x+12*s,y-4*s,4*s,6*s,0,0,7); g.fill();
  g.restore();
}
function camGhost(op,ms){ const c=$('camScare'), g=c.getContext('2d'); g.clearRect(0,0,c.width,c.height); drawFigure(g,c.width,c.height,c.width*.78,c.height*.38,1,1); c.style.transition='none'; c.style.opacity=op; A.noise(.3,{type:'lowpass',f:300,gain:.08}); setTimeout(()=>{ c.style.transition='opacity .4s'; c.style.opacity=0; },ms); }
$('camShot').onclick=()=>{
  const v=$('camVid'); if(!v.videoWidth){ A.key(); return; }
  A.shutter(); $('white').style.transition='none'; $('white').style.background='#fff'; $('white').style.opacity=.85; setTimeout(()=>{ $('white').style.transition='opacity .4s'; $('white').style.opacity=0; },60);
  const w=360, h=Math.round(360*v.videoHeight/v.videoWidth)||480;
  const c=cv(w,h,(g)=>{ g.translate(w,0); g.scale(-1,1); g.drawImage(v,0,0,w,h); g.setTransform(1,0,0,1,0,0); if(S.day>=2) drawFigure(g,w,h,w*.8,h*.36,.55,.8); });
  const img=c.toDataURL('image/jpeg',.85); PHOTOS.unshift({img,who:'Siz',when:'Bugün '+hhmm()});
  $('camLast').style.backgroundImage=`url(${img})`;
};
$('camLast').onclick=()=>{ if(PHOTOS[0]) openViewer({img:PHOTOS[0].video?null:PHOTOS[0].img, video:PHOTOS[0].video, who:PHOTOS[0].who||'Galeri', when:PHOTOS[0].when}); };
function camLeave(){ const v=$('camVid'); try{ v.pause(); }catch(e){} v.srcObject=null; if(!$('task').classList.contains('on') && S.screen!=='game') camStop(); }

/* ---------- telefon uygulaması ve aramalar ---------- */
let phTab='son';
document.querySelectorAll('.phTabs a').forEach(a=>a.onclick=()=>{ phTab=a.dataset.ph; document.querySelectorAll('.phTabs a').forEach(x=>x.classList.toggle('on',x===a)); renderPhone(); });
const CONTACTS=['anne','baba','babaanne','emre','teyze','eniste','yenge','dayi','selin','burak','mert','zeynep'];
function renderPhone(){
  $('phList').innerHTML = phTab==='kisi'
    ? CONTACTS.map(k=>`<div class="clrow" data-call="${k}"><img src="${AV[PEOPLE[k].av]}"><div class="cm"><b>${esc(PEOPLE[k].name)}</b><small>${S.pickChat?'Sohbet başlat':'Mobil'}</small></div><span class="ic">${svg(S.pickChat?'chats':'call')}</span></div>`).join('')
    : CALLS.map(callRow).join('');
}
document.addEventListener('click',e=>{
  const r=e.target.closest('[data-call]'); if(!r) return;
  const k=r.dataset.call;
  if(S.pickChat && S.screen==='phone'){ S.pickChat=false; if(CH[k]){ CH[k].hidden=false; openChat(k); } else { if(!CH[k]) newChat(k); openChat(k); } return; }
  outgoingCall(k);
});
function newChat(k){ const p=PEOPLE[k]; const c=CH[k]={title:p.name, av:p.av, sub:'çevrimiçi değil'}; c.id=k; c.el=document.createElement('div'); c.el.className='msgs'; wrap.appendChild(c.el); c.unread=0; c.lastTs=0; c.last=''; c.prev=null; c.lastDay=null; c.typing=null; c.pending=null; c.list=[]; }
$('waFab').onclick=()=>{ S.pickChat=true; phTab='kisi'; document.querySelectorAll('.phTabs a').forEach(x=>x.classList.toggle('on',x.dataset.ph==='kisi')); show('phone'); };
document.querySelectorAll('.cHead .ic[data-i="call"], .cHead .ic[data-i="video"]').forEach(b=>b.onclick=()=>{ const c=CH[S.chat]; if(!c||c.group) { A.key(); return; } outgoingCall(S.chat); });
let outCall=null;
async function outgoingCall(who){
  if(outCall || callRes || S.screen==='call' || !PEOPLE[who]) return;
  const p=PEOPLE[who], oc=outCall={who,ended:false};
  $('clName').textContent=p.name; $('clAv').src=AV[p.av]; $('clAv').classList.remove('ring');
  $('clState').textContent='Aranıyor…'; $('clSub').textContent=''; $('clSub').classList.remove('wrong'); $('clChoices').innerHTML='';
  $('clIn').classList.add('hidden'); $('clBar').classList.remove('hidden');
  show('call');
  $('clEnd').onclick=()=>{ oc.ended=true; };
  const wait=async ms=>{ const t0=performance.now(); while(performance.now()-t0<ms){ if(oc.ended) return false; await new Promise(r=>setTimeout(r,100)); } return true; };
  const rb=()=>A.tone(425,1,{gain:.045}); rb(); const ringT=setInterval(rb,3000);
  let res='noans';
  if(who==='bilinmeyen'){ await wait(1600); res='invalid'; }
  else if(who==='emre' && S.day>=2 && !S.emreAnswered){ if(await wait(8000)) res='emre'; }
  else if(await wait(15000)) res='noans';
  clearInterval(ringT);
  if(!oc.ended){
    if(res==='invalid'){ $('clState').textContent='Bu numara kullanılmamaktadır.'; A.hangup(); await wait(2600); }
    else if(res==='emre'){
      S.emreAnswered=true; callSec=0; const up=()=>$('clState').textContent=pad(Math.floor(callSec/60))+':'+pad(callSec%60); up(); callTimer=setInterval(()=>{ callSec++; up(); },1000); A.lineOn();
      const br=setInterval(()=>A.noise(1.2,{type:'lowpass',f:500,gain:.05,a:.5}),2600);
      await wait(4500); $('clSub').textContent='…'; SFX.whispers(0,3);
      if(await wait(3500)){ $('clSub').textContent='“'+LINES.emre_whisper.t+'”'; $('clSub').classList.add('wrong'); const h=vo('emre_whisper',{phone:true}); await Promise.race([h.done, (async()=>{ while(!oc.ended) await new Promise(r=>setTimeout(r,100)); })()]); h.stop(); }
      clearInterval(br); clearInterval(callTimer); A.lineOff(); A.hangup(); $('clState').textContent='Arama sona erdi'; await wait(1600);
    } else { $('clState').textContent = S.day>=2 && ['anne','baba','teyze','eniste'].includes(who) ? 'Şu anda ulaşılamıyor' : 'Cevap yok'; A.hangup(); await wait(1900); }
  } else A.hangup();
  clearInterval(callTimer); A.lineOff();
  addCall({who,kind:'out',t:'Bugün '+hhmm()});
  $('clEnd').onclick=()=>A.glitch(.1);
  outCall=null; if(S.screen==='call') back();
}

/* ---------- Sohbet sekmeleri, filtreler, arşiv, durumlar ---------- */
let chipF='all';
document.querySelectorAll('.chips b').forEach((b,i)=>b.onclick=()=>{ chipF=['all','un','fav','grp'][i]; document.querySelectorAll('.chips b').forEach(x=>x.classList.toggle('on',x===b)); renderList(); });
$('waArch').onclick=()=>{ const l=$('archList'); l.classList.toggle('hidden'); if(!l.classList.contains('hidden')) renderArch(); };
function renderArch(){ const l=$('archList'); l.innerHTML=''; Object.values(CH).filter(c=>c.archived).forEach(c=>{ const r=document.createElement('button'); r.className='crow'; r.innerHTML=`<img src="${c.avImg||AV[c.av]}" alt=""><div class="cm"><div class="l1"><b>${esc(c.title)}</b><span>${c.lastTime||''}</span></div><div class="l2"><p>${esc(c.last)}</p></div></div>`; r.onclick=()=>openChat(c.id); l.appendChild(r); }); }
document.querySelectorAll('.waNav a').forEach(a=>a.onclick=()=>{
  document.querySelectorAll('.waNav a').forEach(x=>x.classList.toggle('on',x===a));
  const t=a.dataset.tab;
  $('waChats').classList.toggle('hidden',t!=='chats'); $('waCalls').classList.toggle('hidden',t!=='calls'); $('waUpd').classList.toggle('hidden',t!=='updates'); $('waComm').classList.toggle('hidden',t!=='comm');
  $('waFab').classList.toggle('hidden',t!=='chats');
  $('waTitle').textContent={chats:'Sohbet',updates:'Güncellemeler',comm:'Topluluklar',calls:'Aramalar'}[t];
  if(t==='calls'){ S.missedCalls=0; $('navCall').classList.remove('on'); renderCalls(); }
  if(t==='updates') renderUpd();
});
IMG.memleket = cv(360,640,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#f7b267'); gr.addColorStop(.45,'#f4845f'); gr.addColorStop(.46,'#4f772d'); gr.addColorStop(1,'#31572c'); g.fillStyle=gr; g.fillRect(0,0,w,h); g.fillStyle='rgba(255,240,200,.9)'; g.beginPath(); g.arc(250,200,40,0,7); g.fill(); g.fillStyle='#3a5a2a'; g.beginPath(); g.moveTo(0,330); g.quadraticCurveTo(120,250,220,320); g.quadraticCurveTo(300,280,360,320); g.lineTo(360,640); g.lineTo(0,640); g.fill(); grain(g,w,h,.07); }).toDataURL();
IMG.selinSt = cv(360,640,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,w,h); gr.addColorStop(0,'#fbc2eb'); gr.addColorStop(1,'#a6c1ee'); g.fillStyle=gr; g.fillRect(0,0,w,h); g.font='120px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.textAlign='center'; g.fillText('☕',w/2,300); g.font='60px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.fillText('📚💅',w/2,400); }).toDataURL();
const STATUS=[
  {who:'teyze', img:IMG.gunaydin, cap:'Günaydın canlarım 🌹', t:'Bugün 07:31'},
  {who:'selin', img:IMG.selinSt, cap:'perşembe modu', t:'Bugün 16:40'},
  {who:'dayi', img:IMG.memleket, cap:'Memleket 🍂', t:'Dün 18:20'},
];
let MY_STATUS=null;
function renderUpd(){
  const l=$('waUpd'), myAv=S.faceRaw||S.face||AV.unknown;
  l.innerHTML=`<div class="stSecT">Durum</div>
    <button class="stRow" id="stMine"><span class="stRing ${MY_STATUS?'':'none'}"><img src="${myAv}" alt=""></span><div><b>Durumum</b><small>${MY_STATUS?MY_STATUS.t:'Durum güncellemesi eklemek için dokunun'}</small></div></button>
    <div class="stSec">Son güncellemeler</div>
    ${STATUS.map((st,i)=>`<button class="stRow" data-st="${i}"><span class="stRing${st.seen?' seen':''}"><img src="${AV[PEOPLE[st.who].av]}" alt=""></span><div><b>${esc(PEOPLE[st.who].name)}</b><small>${esc(st.t)}</small></div></button>`).join('')}`;
  $('stMine').onclick=()=>{ if(MY_STATUS) openStatus(MY_STATUS,'Durumum',myAv); else A.key(); };
  l.querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>{ const st=STATUS[+b.dataset.st]; st.seen=true; openStatus(st,PEOPLE[st.who].name,AV[PEOPLE[st.who].av]); if(st.onView) st.onView(); });
}
let stT=null;
function openStatus(st,name,av){
  $('stWho').textContent=name; $('stWhen').textContent=st.t; $('stAv').src=av; $('stImg').src=st.img; $('stCap').textContent=st.cap||'';
  const f=$('stFill'); f.style.transition='none'; f.style.width='0'; show('status');
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ f.style.transition='width 5s linear'; f.style.width='100%'; }));
  clearTimeout(stT); stT=setTimeout(()=>{ if(S.screen==='status') back(); },5100);
}
$('stBack').onclick=()=>{ clearTimeout(stT); back(); };

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
async function testFlow(){
  $('bTitle').textContent='Ömür Testi ⏳';
  const b=$('bBody');
  const gun=[...Array(31)].map((_,i)=>`<option${i===13?' selected':''}>${i+1}</option>`).join('');
  const ay=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'].map((a,i)=>`<option${i===4?' selected':''}>${a}</option>`).join('');
  const yil=[...Array(70)].map((_,i)=>`<option${2006-i===2002?' selected':''}>${2006-i}</option>`).join('');
  b.innerHTML=`<div class="dua"><div class="orn">⏳</div><h2>Ömür Testi</h2><div class="sub">Doğum tarihine göre kalan ömrünü öğren · 128.402 kişi baktı</div>
    <div class="card">Doğum tarihini seç, sistem hesaplasın.<br>Sonuçlar <b>%98 doğru</b> çıkıyor 😱
      <div class="dt"><select id="dg">${gun}</select><select id="da">${ay}</select><select id="dy">${yil}</select></div></div>
    <button class="amin" id="hesap">HESAPLA</button>
    <small class="tiny">Devam ederek kullanım koşullarını ve sıra kaydınızın oluşturulmasını kabul etmiş olursunuz.</small></div>`;
  show('browser'); bLoad();
  await new Promise(r=>$('hesap').onclick=r);
  A.send();
  const steps=['Doğum tarihiniz işleniyor…','Rehberiniz okunuyor…','Sıranız hesaplanıyor…'];
  b.innerHTML=`<div class="dua"><div class="orn">⏳</div><div class="spin"></div><div class="res" id="stp">${steps[0]}</div></div>`;
  for(const st of steps){ $('stp').textContent=st; await sleep(1100); }
  SFX.chime();
  b.innerHTML=`<div class="dua"><div class="orn">⏳</div><h2>Kalan ömrünüz</h2><div class="big">9</div><div class="res">gün</div>
    <div class="cnt">Sıra no: ${SIRA_NO} · Kayıt: ${hhmm()}</div>
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
  b.innerHTML=`<div class="sira"><h2>SIRA SİZDE</h2><div class="no">SIRA NO ${String(SIRA_NO).padStart(3,'0')} · DENİZ</div>
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
  S.faceRaw=captureRaw(); S.face=processFace();
  $('tStat').textContent='Teşekkürler.'; await sleep(1500);
  return true;
}
function captureRaw(){
  const v=$('tVideo'), vw=v.videoWidth||640, vh=v.videoHeight||480, side=Math.min(vw,vh), sx=(vw-side)/2, sy=(vh-side)/2, O=320;
  return cv(O,O,g=>{ g.translate(O,0); g.scale(-1,1); g.drawImage(v,sx,sy,side,side,0,0,O,O); }).toDataURL('image/jpeg',.88);
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
  e.style.pointerEvents='auto'; e.classList.add('on'); await new Promise(r=>setTimeout(r,40)); e.style.opacity=1;
  await sleep(ms);
}
async function interOut(){ const e=$('inter'); e.style.pointerEvents='none'; e.style.opacity=0; await sleep(1000); e.classList.remove('on'); }
function lockNotifs(list){ $('lkNotifs').innerHTML=list.join(''); }
function waitUnlock(){ show('lock',false); S.stack=[]; return new Promise(r=>S.lockTap=()=>{ S.lockTap=null; r(); }); }
function waitFor(fn,ms=200){ return new Promise(r=>{ const iv=setInterval(()=>{ if(fn()){ clearInterval(iv); r(); } },ms); }); }

/* =========================================================
   TELEFON OYUNLARI (e-Sıra'nın "bekleme süresi için" yüklediği)
   ========================================================= */
const loadImg = src => new Promise(r=>{ if(!src) return r(null); const i=new Image(); i.onload=()=>r(i); i.onerror=()=>r(null); i.src=src; });
function gameShell(title, info=''){
  show('game'); $('gmTitle').textContent=title; $('gmInfo').textContent=info; $('gmMsg').textContent='';
  $('gmStage').className='gmStage'; $('gmCtl').innerHTML=''; $('gmStage').onpointerdown=$('gmStage').onpointerup=null;
  return $('gmCan');
}
const gmMsg = t => $('gmMsg').textContent=t;
let keyDir=null;
const KEYMAP={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],KeyW:[0,-1],KeyS:[0,1],KeyA:[-1,0],KeyD:[1,0]};
addEventListener('keydown',e=>{ const m=KEYMAP[e.code]; if(m && S.screen==='game' && keyDir){ e.preventDefault(); keyDir(m[0],m[1],true); } });
addEventListener('keyup',e=>{ const m=KEYMAP[e.code]; if(m && S.screen==='game' && keyDir) keyDir(m[0],m[1],false); });
function dpad(onDir, center){
  const d=document.createElement('div'); d.className='pad';
  d.innerHTML=`<button class="u">▲</button><button class="l">◀</button>${center?`<button class="c">${center}</button>`:''}<button class="r">▶</button><button class="d">▼</button>`;
  const map={u:[0,-1],d:[0,1],l:[-1,0],r:[1,0]};
  for(const k in map){ const b=d.querySelector('.'+k);
    b.addEventListener('pointerdown',e=>{ e.preventDefault(); onDir(map[k][0],map[k][1],true); });
    b.addEventListener('pointerup',()=>onDir(map[k][0],map[k][1],false));
    b.addEventListener('pointerleave',()=>onDir(map[k][0],map[k][1],false)); }
  $('gmCtl').appendChild(d); return d;
}
function swipe(el, cb){ let sx=0,sy=0; el.onpointerdown=e=>{ sx=e.clientX; sy=e.clientY; }; el.onpointerup=e=>{ const dx=e.clientX-sx, dy=e.clientY-sy; if(Math.max(Math.abs(dx),Math.abs(dy))<24) return; if(Math.abs(dx)>Math.abs(dy)) cb(Math.sign(dx),0,true); else cb(0,Math.sign(dy),true); }; }
let gameVid=null;
async function gameCam(){
  if(S.camMode!=='cam') return null;
  if(!CAM.stream && !(await camStart())) return null;
  if(!gameVid){ gameVid=document.createElement('video'); gameVid.muted=true; gameVid.playsInline=true; gameVid.setAttribute('playsinline','');
    Object.assign(gameVid.style,{position:'absolute',left:'0',top:'0',width:'2px',height:'2px',opacity:'0.01',pointerEvents:'none'}); $('device').appendChild(gameVid); }
  gameVid.srcObject=CAM.stream; try{ await gameVid.play(); }catch(e){}
  return gameVid;
}
function drawCircleImg(g, src, cx, cy, r, mirror=false){
  const w=src.videoWidth||src.naturalWidth||src.width, h=src.videoHeight||src.naturalHeight||src.height; if(!w||!h) return;
  const side=Math.min(w,h), sx=(w-side)/2, sy=(h-side)/2;
  g.save(); g.beginPath(); g.arc(cx,cy,r,0,7); g.clip();
  if(mirror){ g.translate(cx,cy); g.scale(-1,1); g.drawImage(src,sx,sy,side,side,-r,-r,2*r,2*r); }
  else g.drawImage(src,sx,sy,side,side,cx-r,cy-r,2*r,2*r);
  g.restore();
}

/* ---------- 1) YILAN: başı senin kamera görüntün, yemler Emre ---------- */
async function gameYilan(){
  const c=gameShell('YILAN','SKOR 0'); c.width=300; c.height=300; const g=c.getContext('2d');
  const N=15, C=20, BG='#c4cfa1', FG='#43523d';
  const emreImg=await loadImg('img/emre.jpg');
  const faceImg=await loadImg(S.faceRaw||S.face||fakeFace());
  const vid=await gameCam();
  const letters=['D','E','N','İ','Z'];
  let snake, dir, nd, food=null, eaten=0, chaser=null, phase='normal', t0=0, over=false, raf, started=false;
  const occupied=(x,y)=>snake.some(p=>p.x===x&&p.y===y)||(chaser&&chaser.some(p=>p.x===x&&p.y===y));
  const placeFood=()=>{ let x,y; do{ x=1+Math.floor(Math.random()*(N-2)); y=1+Math.floor(Math.random()*(N-2)); }while(occupied(x,y)); food={x,y}; };
  const reset=()=>{ snake=[{x:7,y:8},{x:6,y:8},{x:5,y:8}]; dir={x:1,y:0}; nd=dir; started=false; if(phase==='normal') placeFood(); };
  const turn=(dx,dy,down=true)=>{ if(!down||over) return; if(dx===-dir.x&&dy===-dir.y) return; nd={x:dx,y:dy}; if(!started){ started=true; if(phase==='normal') gmMsg(letters.slice(0,eaten).join(' ')); } };
  if(Q.has('hizli')) window.__yilan={get food(){return food}, get head(){return snake[0]}, get dir(){return dir}, turn};
  // tanıtım: yılanın başı sensin
  g.fillStyle=BG; g.fillRect(0,0,300,300); if(faceImg) drawCircleImg(g,faceImg,150,135,84); g.strokeStyle=FG; g.lineWidth=4; g.beginPath(); g.arc(150,135,84,0,7); g.stroke();
  g.fillStyle=FG; g.font='30px VT323, monospace'; g.textAlign='center'; g.fillText('BU SENSİN',150,258); A.tone(523,.12,{type:'square',gain:.06}); A.tone(392,.2,{type:'square',gain:.06,delay:.14});
  await sleep(2800);
  reset(); dpad(turn); keyDir=turn; swipe($('gmStage'),turn);
  gmMsg('Başlamak için yön seç');
  const draw=()=>{
    g.fillStyle=BG; g.fillRect(0,0,300,300);
    g.fillStyle='rgba(67,82,61,.07)'; for(let i=0;i<N;i++) for(let j=0;j<N;j++) if((i+j)%2) g.fillRect(i*C,j*C,C,C);
    if(food && emreImg){ const fx=food.x*C+C/2, fy=food.y*C+C/2, r=C*.78, k=eaten/4;
      drawCircleImg(g,emreImg,fx+(eaten>=3?(Math.random()-.5)*2:0),fy,r);
      g.fillStyle=`rgba(${50+eaten*35},0,0,${.1+k*.5})`; g.beginPath(); g.arc(fx,fy,r,0,7); g.fill();
      if(eaten>=3){ g.fillStyle='#000'; g.fillRect(fx-C*.3,fy-C*.12,C*.2,C*.16); g.fillRect(fx+C*.1,fy-C*.12,C*.2,C*.16); } }
    g.fillStyle=FG; snake.slice(1).forEach(p=>g.fillRect(p.x*C+2,p.y*C+2,C-4,C-4));
    const hd=snake[0], hx=hd.x*C+C/2, hy=hd.y*C+C/2;
    const HR=C*1.05;
    if(phase==='chase' && vid && vid.videoWidth) drawCircleImg(g,vid,hx,hy,HR,true); else if(faceImg) drawCircleImg(g,faceImg,hx,hy,HR); else { g.fillStyle=FG; g.beginPath(); g.arc(hx,hy,C*.6,0,7); g.fill(); }
    g.strokeStyle=FG; g.lineWidth=2; g.beginPath(); g.arc(hx,hy,HR,0,7); g.stroke();
    if(chaser){ g.fillStyle='#0b0d0a'; chaser.slice(1).forEach(p=>g.fillRect(p.x*C+1,p.y*C+1,C-2,C-2));
      const ch=chaser[0], cx=ch.x*C+C/2, cy=ch.y*C+C/2; if(emreImg) drawCircleImg(g,emreImg,cx,cy,C*.9);
      g.fillStyle='rgba(0,0,0,.7)'; g.beginPath(); g.arc(cx,cy,C*.9,0,7); g.fill();
      g.fillStyle='#ff2020'; g.fillRect(cx-6,cy-3,3,3); g.fillRect(cx+3,cy-3,3,3); }
  };
  return new Promise(resolve=>{
    let last=performance.now(), acc=0, speed=240;
    const endGame=async text=>{
      if(over) return; over=true; cancelAnimationFrame(raf);
      SFX.stinger(); try{ navigator.vibrate&&navigator.vibrate([100,50,300]); }catch(e){}
      $('device').classList.add('shake'); setTimeout(()=>$('device').classList.remove('shake'),450);
      draw(); g.fillStyle='rgba(25,0,0,.78)'; g.fillRect(0,0,300,300);
      g.fillStyle='#ff2a3d'; g.font='60px VT323, monospace'; g.textAlign='center'; g.fillText(text,150,165);
      gmMsg(''); await sleep(3000); keyDir=null; resolve();
    };
    const startChase=()=>{
      phase='chase'; food=null; A.glitch(.6); SFX.whispers(0,3);
      $('glitch').classList.add('on'); setTimeout(()=>$('glitch').classList.remove('on'),450);
      chaser=[]; for(let i=0;i<6;i++) chaser.push({x:N-1,y:Math.min(N-1,i)});
      speed=175; t0=performance.now(); gmMsg(''); setTimeout(()=>{ if(!over) gmMsg('Arkanda.'); },1600);
    };
    const step=()=>{
      if(!started) return;
      dir=nd; const h={x:snake[0].x+dir.x, y:snake[0].y+dir.y};
      if(h.x<0||h.y<0||h.x>=N||h.y>=N||snake.some(p=>p.x===h.x&&p.y===h.y)){
        if(phase==='chase'){ endGame('SIRA SENDE'); return; }
        A.glitch(.2); reset(); gmMsg('Bir daha. Yön seç.'); return; }
      snake.unshift(h);
      if(food && h.x===food.x && h.y===food.y){
        eaten++; A.tone(660,.08,{type:'square',gain:.07});
        $('gmInfo').textContent = eaten<5 ? 'SKOR '+eaten : 'SKOR '+SIRA_NO;
        gmMsg(letters.slice(0,eaten).join(' '));
        if(eaten===5) startChase(); else placeFood();
      } else snake.pop();
      if(chaser){
        const ch=chaser[0], t=snake[0], dx=Math.sign(t.x-ch.x), dy=Math.sign(t.y-ch.y), opts=[];
        if(dx) opts.push({x:ch.x+dx,y:ch.y}); if(dy) opts.push({x:ch.x,y:ch.y+dy});
        const nx=opts[Math.floor(Math.random()*opts.length)]||ch; chaser.unshift(nx); chaser.pop();
        if(snake.some(p=>p.x===nx.x&&p.y===nx.y)){ endGame('SIRA SENDE'); return; }
        if(performance.now()-t0>16000){ endGame('KAÇAMAZSIN'); return; }
      }
    };
    const loop=now=>{ if(over) return; acc+=now-last; last=now; while(acc>speed){ acc-=speed; step(); if(over) return; } draw(); raf=requestAnimationFrame(loop); };
    raf=requestAnimationFrame(loop);
  });
}

/* ---------- 2) EMRE'Yİ BESLE: sanal hayvan ---------- */
async function gameBesle(){
  const c=gameShell("EMRE'Yİ BESLE",'KALAN: 1 GÜN'); $('gmStage').classList.add('egg'); c.width=160; c.height=160;
  const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  const emreImg=await loadImg('img/emre.jpg');
  const pix=document.createElement('canvas'); pix.width=pix.height=32; const pg=pix.getContext('2d',{willReadFrequently:true});
  const SH=[[30,42,22],[63,85,48],[125,148,96],[196,207,161]];
  let d=0, dark=false, actions=0, ending=false;
  const render=mode=>{
    pg.clearRect(0,0,32,32);
    if(emreImg){ const w=emreImg.naturalWidth, side=w*.63; pg.drawImage(emreImg,w*.12,w*.045,side,side,0,0,32,32); }
    const id=pg.getImageData(0,0,32,32), p=id.data;
    for(let i=0;i<p.length;i+=4){ let l=(p[i]*.3+p[i+1]*.59+p[i+2]*.11)/255; l=Math.max(0,Math.min(.999,(l-.12)*1.45-d*.06)); const s=SH[Math.min(3,Math.floor(l*4))]; p[i]=s[0]; p[i+1]=s[1]; p[i+2]=s[2]; p[i+3]=255; }
    pg.putImageData(id,0,0);
    if(d>=3){ pg.fillStyle='#0b0f08'; pg.fillRect(11,14,5,3); pg.fillRect(19,15,5,3); }
    if(mode==='back'){ pg.fillStyle='#3f5530'; pg.fillRect(0,0,32,32); pg.fillStyle='#1e2a16'; pg.beginPath(); pg.ellipse(16,13,9,11,0,0,7); pg.fill(); pg.fillRect(6,24,20,8); }
    if(mode==='black'){ pg.fillStyle='#0b0f08'; pg.fillRect(0,0,32,32); pg.fillStyle='#e8f5c8'; pg.fillRect(13,15,2,2); pg.fillRect(21,16,2,2); }
    g.fillStyle = dark ? '#0b0f08' : '#c4cfa1'; g.fillRect(0,0,160,160);
    if(!dark || mode==='black') g.drawImage(pix,24,6,112,112);
    else { g.fillStyle='#e8f5c8'; g.fillRect(24+13*3.5,6+15*3.5,5,5); g.fillRect(24+21*3.5,6+16*3.5,5,5); }
    g.fillStyle = dark ? '#3f5530' : '#1e2a16'; g.font='16px VT323, monospace';
    const full=Math.max(0,3-Math.floor(d/2)); g.textAlign='left'; g.fillText('♥'.repeat(full)+'♡'.repeat(3-full),8,152);
    g.textAlign='right'; g.fillText('1 GÜN',152,152);
  };
  render('face'); gmMsg('Emre seni bekliyordu.');
  return new Promise(resolve=>{
    const finish=async()=>{
      if(ending) return; ending=true; $('gmCtl').querySelectorAll('button').forEach(b=>b.disabled=true);
      dark=false; render('face'); await sleep(900);
      render('back'); gmMsg('Emre arkasını döndü.'); SFX.steps(0); await sleep(2400);
      render('black'); A.glitch(.4);
      const t='neden açmadın'; for(let i=1;i<=t.length;i++){ gmMsg(t.slice(0,i)); A.key(); await sleep(150); }
      playBuf('emre_d1',{rate:.55,gain:.9,dur:3.2}); await sleep(2600);
      SFX.stinger(); try{ navigator.vibrate&&navigator.vibrate([60,40,200]); }catch(e){}
      dark=true; render('face'); await sleep(900);
      for(let p=0;p<=10;p++){ gmMsg('SİLİNİYOR '+'█'.repeat(p)+'░'.repeat(10-p)); await sleep(170); }
      const i=HOME_APPS.findIndex(a=>a.id==='g_besle'); if(i>=0) HOME_APPS.splice(i,1);
      resolve();
    };
    const act=kind=>{
      if(ending) return; actions++; d=Math.min(5,d+1);
      if(kind==='besle'){ A.tone(880,.06,{type:'square',gain:.06}); A.tone(660,.08,{type:'square',gain:.06,delay:.08});
        gmMsg(['Emre yedi. Mutlu ♥','Emre yedi.','Emre aç değil.','Emre aç değil. Seni bekliyor.','Emre yemiyor.'][Math.min(4,d-1)]); }
      if(kind==='oyna'){ A.tone(440,.08,{type:'square',gain:.06});
        gmMsg(['Emre topla oynadı.','Emre oynamak istemiyor.','Emre kapıyı dinliyor.','Emre kapının altına bakıyor.','Emre oynamıyor.'][Math.min(4,d-1)]); }
      if(kind==='isik'){ dark=!dark; A.tone(220,.05,{type:'square',gain:.05});
        if(dark){ SFX.whispers(0,2.5); gmMsg('Emre uyumuyor.'); } else gmMsg('Emre sana bakıyor.'); }
      render('face');
      if(actions>=6) setTimeout(finish,1300);
    };
    for(const [label,k] of [['🍙 Besle','besle'],['⚽ Oyna','oyna'],['💡 Işık','isik']]){ const b=document.createElement('button'); b.className='gbtn'; b.textContent=label; b.onclick=()=>act(k); $('gmCtl').appendChild(b); }
    setTimeout(()=>{ if(!ending) finish(); },60000);
  });
}

/* ---------- 3) SAKLAMBAÇ: ebe annen, ev senin evin ---------- */
const EV=[
"###############",
"#B...#........#",
"#B...#..SSS...#",
"#....#.......P#",
"#W...#........#",
"###.###.#######",
"D.............#",
"#.............#",
"###.###.###.###",
"#bb.#....#....#",
"#...#.TT.#..K.#",
"#.W.#....#....#",
"###############"];
async function gameSakla(){
  const T=20, W=15, H=13;
  const c=gameShell('SAKLAMBAÇ','EBE: ANNEM'); c.width=W*T; c.height=H*T; const g=c.getContext('2d');
  const tile=(x,y)=>(EV[y]||'')[x]||'#';
  const HIDE='WPK', walk=(x,y)=>'.D'.includes(tile(x,y));
  const rooms=[['DENİZ',1,1],['SALON',9,1],['KORİDOR',9,6],['ANNEMİN ODASI',1,9],['MUTFAK',5,9],['BANYO',10,9]];
  let me={x:8,y:7}, an={x:5,y:10}, hidden=false, hideAt=null, over=false, path=[], msgT=0, moveDir=null, sitting=false;
  const bfs=(sx,sy,tx,ty,toHide=false)=>{
    const K=(x,y)=>y*W+x, prev=new Map([[K(sx,sy),null]]), q=[[sx,sy]];
    while(q.length){ const [x,y]=q.shift(); if(x===tx&&y===ty) break;
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=x+dx, ny=y+dy;
        if((walk(nx,ny)||(toHide&&nx===tx&&ny===ty)) && !prev.has(K(nx,ny))){ prev.set(K(nx,ny),[x,y]); q.push([nx,ny]); } } }
    if(!prev.has(K(tx,ty))) return [];
    const out=[]; let cur=[tx,ty]; while(cur && !(cur[0]===sx&&cur[1]===sy)){ out.unshift({x:cur[0],y:cur[1]}); cur=prev.get(K(cur[0],cur[1])); }
    return out;
  };
  const draw=()=>{
    for(let y=0;y<H;y++) for(let x=0;x<W;x++){ const t=tile(x,y), X=x*T, Y=y*T;
      g.fillStyle = t==='#' ? '#16181e' : '#353944'; g.fillRect(X,Y,T,T);
      if(t!=='#' && (x+y)%2){ g.fillStyle='rgba(255,255,255,.03)'; g.fillRect(X,Y,T,T); }
      if(t==='D'){ g.fillStyle='#5a3a22'; g.fillRect(X,Y+2,T-6,T-4); }
      if(t==='B'){ g.fillStyle='#55648a'; g.fillRect(X+2,Y,T-4,T); }
      if(t==='b'){ g.fillStyle='#8a5566'; g.fillRect(X,Y+2,T,T-4); }
      if(t==='S'){ g.fillStyle='#6b5b45'; g.fillRect(X,Y+4,T,T-6); }
      if(t==='T'){ g.fillStyle='#7a6a50'; g.fillRect(X+1,Y+1,T-2,T-2); }
      if(t==='W'){ g.fillStyle='#4a3626'; g.fillRect(X+1,Y+1,T-2,T-2); g.fillStyle='#24180f'; g.fillRect(X+T/2-1,Y+3,2,T-6); }
      if(t==='P'){ g.fillStyle='#7a2a3a'; g.fillRect(X+2,Y,T-8,T); }
      if(t==='K'){ g.fillStyle='#cfd8dc'; g.fillRect(X+1,Y+3,T-2,T-6); }
    }
    // Deniz'in yatağında yatan beden
    g.fillStyle='#c9b8a6'; g.beginPath(); g.arc(T+T/2,T+T/2,5,0,7); g.fill(); g.fillStyle='#3a4560'; g.fillRect(T+4,T+T-2,T-8,T+2);
    g.fillStyle='rgba(255,255,255,.33)'; g.font='9px Roboto, sans-serif'; g.textAlign='left'; rooms.forEach(([n,x,y])=>g.fillText(n,x*T+2,y*T+9));
    // annem
    const ax=an.x*T-(sitting?7:0), ay=an.y*T+(sitting?3:0);
    g.fillStyle='#0b0b0f'; g.fillRect(ax+4,ay+7,T-8,T-(sitting?10:7)); g.fillStyle='#d8ccc0'; g.beginPath(); g.arc(ax+T/2,ay+6,5,0,7); g.fill();
    g.fillStyle='#000'; if(sitting){ g.fillRect(ax+T/2-4,ay+5,2,2); g.fillRect(ax+T/2-1,ay+5,2,2); } else { g.fillRect(ax+T/2-3,ay+5,2,2); g.fillRect(ax+T/2+1,ay+5,2,2); }
    if(!hidden){ g.fillStyle='#f2f2f2'; g.fillRect(me.x*T+6,me.y*T+8,T-12,T-9); g.fillStyle='#ffd7b5'; g.beginPath(); g.arc(me.x*T+T/2,me.y*T+6,4,0,7); g.fill(); }
    else if(!sitting){ const cx=hideAt.x*T+T/2, cy=hideAt.y*T+T/2, gr=g.createRadialGradient(cx,cy,8,cx,cy,95); gr.addColorStop(0,'rgba(0,0,0,0)'); gr.addColorStop(1,'rgba(0,0,0,.95)'); g.fillStyle=gr; g.fillRect(0,0,W*T,H*T); }
  };
  const nearHide=()=>{ for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) if(HIDE.includes(tile(me.x+dx,me.y+dy))) return {x:me.x+dx,y:me.y+dy}; return null; };
  const pd=dpad((dx,dy,down)=>{ moveDir = down && !hidden && !over ? [dx,dy] : null; if(moveDir) stepMe(); },'SAKLAN');
  keyDir=(dx,dy,down)=>{ moveDir = down && !hidden && !over ? [dx,dy] : null; if(moveDir) stepMe(); };
  const hideBtn=pd.querySelector('.c'); hideBtn.disabled=true;
  function stepMe(){
    if(!moveDir||hidden||over) return;
    const nx=me.x+moveDir[0], ny=me.y+moveDir[1];
    if(walk(nx,ny)){ me={x:nx,y:ny}; A.noise(.03,{type:'lowpass',f:300,gain:.05}); }
    if(me.x<=2 && me.y<=4 && Date.now()-msgT>5000){ msgT=Date.now(); gmMsg('Yatakta biri yatıyor. Nefes almıyor.'); }
    hideBtn.disabled=!nearHide();
  }
  hideBtn.onclick=()=>{ if(over) return;
    if(!hidden){ const h=nearHide(); if(!h) return; hidden=true; hideAt=h; hideBtn.textContent='ÇIK'; moveDir=null; A.noise(.25,{type:'lowpass',f:400,gain:.15}); gmMsg('Nefesini tut.'); }
    else { hidden=false; hideBtn.textContent='SAKLAN'; gmMsg(''); } };
  const moveTimer=setInterval(stepMe,170);
  let alive=true; const dl=()=>{ if(!alive) return; draw(); requestAnimationFrame(dl); }; dl();
  return new Promise(async resolve=>{
    for(let i=10;i>0;i--){ $('gmInfo').textContent='ANNEM SAYIYOR: '+i; A.tone(330,.05,{gain:.05}); await sleep(1000); }
    $('gmInfo').textContent='ANNEM ARIYOR'; gmMsg('');
    if(!playBuf('call_1',{gain:.9,pan:-.3})) vo('call_1');
    const targets=[{x:9,y:3},{x:2,y:10},{x:11,y:10},{x:7,y:7},{x:12,y:3}];
    let ti=0, phase='search', seenT=0, wait=0; path=bfs(an.x,an.y,targets[0].x,targets[0].y);
    const tick=setInterval(async()=>{
      if(over) return;
      if(wait>0){ wait--; return; }
      if(!path.length){
        if(phase==='search'){ ti++; wait=5;
          if(ti===2) playBuf('call_1',{gain:.6,pan:Math.max(-1,Math.min(1,(an.x-me.x)/8)),rate:.92});
          if(ti<targets.length) path=bfs(an.x,an.y,targets[ti].x,targets[ti].y);
          else { phase='bed'; path=bfs(an.x,an.y,2,2); } }
        else if(phase==='bed'){
          over=true; clearInterval(tick); clearInterval(moveTimer); moveDir=null; sitting=true; hideBtn.disabled=true;
          await sleep(1400); gmMsg('Annem yatağın kenarına oturdu.'); await sleep(3000);
          gmMsg('“Uyan yavrum.”'); playBuf('anne_3d',{gain:.45,phone:true,dur:2.6}); await sleep(3800);
          gmMsg('Annem seni bulamadı.'); await sleep(4200);
          alive=false; keyDir=null; resolve(); return; }
      }
      const n=path.shift(); if(n) an=n;
      const ref=hidden?hideAt:me, dist=Math.abs(an.x-ref.x)+Math.abs(an.y-ref.y);
      A.noise(.09,{type:'lowpass',f:220,gain:Math.max(.02,.3-dist*.02),pan:Math.max(-1,Math.min(1,(an.x-ref.x)/7))});
      if(!hidden && Date.now()-seenT>5000){
        if(an.x===me.x&&an.y===me.y){ seenT=Date.now(); A.glitch(.1); gmMsg('Annem içinden geçti.'); }
        else if(dist<=2){ seenT=Date.now(); gmMsg('Annem seni görmüyor.'); }
      }
    },420);
  });
}

/* ---------- oyunların yüklenmesi ---------- */
const REENTRY={
  g_yilan:[
    ()=>sysToast('Yılan','Bu oyun için hakkınız doldu.'),
    ()=>post('bilinmeyen',{from:'bilinmeyen',type:'text',text:'skorun hâlâ 47'}),
    ()=>post('emre',{from:'emre',type:'text',text:'bir daha oynama'}),
    ()=>post('bilinmeyen',{from:'bilinmeyen',type:'image',src:S.faceRaw||S.face}),
    ()=>sysToast('Yılan','Yılan seni bekliyor.'),
  ],
  g_besle:[ ()=>post('emre',{from:'emre',type:'text',text:'aç değilim'}) ],
  g_sakla:[
    ()=>post('anne',{from:'anne',type:'text',text:'Yine mi saklanıyorsun?',truth:'Yine mi uyuyorsun yavrum?'}),
    ()=>sysToast('Saklambaç','Ebe sensin.'),
    ()=>post('anne',{from:'anne',type:'text',text:'Yatağında yoksun',truth:'Yatağının başındayım'}),
    ()=>post('babaanne',{from:'babaanne',type:'text',text:'SAKLANMA YAVRUM GEL'}),
  ],
};
const reN={};
async function reentry(id){
  const n=reN[id]=(reN[id]||0)+1, list=REENTRY[id]||[];
  // oyun bir anlığına açılır: son karesi donmuş
  const c=gameShell(id==='g_yilan'?'YILAN':'SAKLAMBAÇ', id==='g_yilan'?'SKOR '+SIRA_NO:'EBE: SEN'); c.width=300; c.height=300; const g=c.getContext('2d');
  g.fillStyle=id==='g_yilan'?'#2b0a0a':'#16181e'; g.fillRect(0,0,300,300);
  const im=await loadImg(S.faceRaw||S.face||fakeFace()); if(im) drawCircleImg(g,im,150,130,70);
  g.fillStyle='#ff2a3d'; g.font='44px VT323, monospace'; g.textAlign='center'; g.fillText(id==='g_yilan'?'SIRA SENDE':'BULUNDUN',150,250);
  A.glitch(.4); $('device').classList.add('shake'); setTimeout(()=>$('device').classList.remove('shake'),300);
  await sleep(1300); keyDir=null; show('home',false);
  await sleep(1800);
  const f=list[(n-1)%list.length]; if(f) f();
}
async function gamesPhase(){
  await sleep(4000);
  A.pop(); try{ navigator.vibrate&&navigator.vibrate([150,80,150]); }catch(e){}
  toast({raw:`<div class="nt red"><span class="ntAv" style="display:grid;place-items:center;background:#c8102e;font-family:VT323;font-size:22px;color:#fff">${SIRA_NO}</span><div class="ntB"><div class="ntH"><span class="appdot">${svg('web')}</span>e-Sıra · şimdi</div><div class="ntT">3 uygulama yüklendi</div><div class="ntX">Bekleme süreniz boyunca eğlenmeniz için. Ana ekrana dönün.</div></div></div>`},{},()=>show('home'));
  const defs=[
    {id:'g_yilan',label:'Yılan',cls:'ic-yilan',txt:'🐍',run:gameYilan},
    {id:'g_besle',label:"Emre'yi Besle",cls:'ic-besle',txt:'🥚',run:gameBesle},
    {id:'g_sakla',label:'Saklambaç',cls:'ic-sakla',txt:'🙈',run:gameSakla},
  ];
  let idx=0, running=false;
  return new Promise(resolve=>{
    defs.forEach((d,i)=>{
      HOME_APPS.push({id:d.id,label:d.label,cls:d.cls,txt:d.txt,action:d.id,isNew:true,locked:i>0});
      ACTIONS[d.id]=async()=>{
        if(running) return;
        if(i<idx){ reentry(d.id); return; }
        if(i!==idx){ sysToast(d.label,'Önce '+defs[idx].label+' oyununu bitir.'); return; }
        if(running) return; running=true;
        await d.run(); idx++; running=false;
        const nx=defs[idx] && HOME_APPS.find(x=>x.id===defs[idx].id); if(nx) nx.locked=false;
        HOME_APPS.forEach(a=>a.isNew=false); renderHome(); show('home');
        if(idx>=defs.length){ CAM.stream && camStop(); setTimeout(resolve,7000*SPEED); }
      };
    });
    renderHome();
  });
}

/* =========================================================
   FİNAL: gerçek ortaya çıkıyor
   ========================================================= */
async function scrambleTo(el,txt){
  const chars='█▓▒░#%&@ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ', old=el.textContent, L=Math.max(old.length,txt.length);
  for(let f=1;f<=14;f++){ let o=''; for(let i=0;i<L;i++) o += i < (f/14)*L ? (txt[i]||'') : (Math.random()<.6 ? chars[Math.floor(Math.random()*chars.length)] : (old[i]||'')); el.textContent=o; if(f%3===0) A.key(); await new Promise(r=>setTimeout(r,55)); }
  el.textContent=txt;
}
/* gerçek ortaya çıktıktan sonra: her sohbet, oyuncu açtığında gözünün önünde değişir */
let revealBusy=false;
function rerender(c,m,nm){ const keep=c.prev; c.prev=null; const row=renderMsg(c,nm); m.el.replaceWith(row); Object.assign(m,nm,{el:row}); c.prev=keep; return row; }
function prepReveal(){
  S.revealed=true; stopAllVoices();
  // Deniz'in hiç iletilmeyen (tek gri tikli) mesajları birden iletildi
  for(const id in CH) for(const m of CH[id].list) if(m.from==='me' && m.day>=2 && !m.flip && !m.flipped && !m.delivered && m.type!=='sys'){ m.delivered=true; const tk=m.el.querySelector('.tk'); if(tk) tk.innerHTML=svg('ticks'); }
  // yalan sesli mesajlar silinmiş görünür
  for(const id in CH) for(const m of CH[id].list) if(m.lie && !m.deleted) rerender(CH[id],m,{...m,deleted:true});
  // arama kaydı: Emre seni aramadı, sen onu aradın
  for(const c of CALLS) if(c.who==='emre' && c.kind==='missed'){ c.kind='out'; c.flipped=true; }
  renderCalls();
  const ph=PHOTOS.find(p=>p.video==='emre'); if(ph) ph.who='Siz';
  const si=STATUS.findIndex(x=>x.flip); if(si>=0){ MY_STATUS=STATUS[si]; STATUS.splice(si,1); }
  CH.emre.sub='çevrimiçi';
  for(const id in CH){ const c=CH[id]; c.revealPending=c.list.some(m=>(m.truth&&m.text!==m.truth)||(m.flip&&!m.flipped)); }
}
async function revealAnim(cid){
  const c=CH[cid]; if(!c || !c.revealPending || revealBusy) return;
  revealBusy=true; c.revealPending=false;
  c.el.querySelector('.undiv')?.remove();
  await new Promise(r=>setTimeout(r,1100));
  let first=true;
  for(const m of c.list){
    const need=(m.truth&&m.text!==m.truth)||(m.flip&&!m.flipped); if(!need) continue;
    const live=viewing(cid);
    if(live){ if(first){ SFX.whispers(0,2.5); first=false; } m.el.scrollIntoView({block:'center',behavior:'smooth'}); await new Promise(r=>setTimeout(r,550)); }
    if(m.truth && m.text!==m.truth){
      const tx=m.el.querySelector('.tx')||m.el;
      if(live){ A.glitch(.12); await scrambleTo(tx,m.truth); } else tx.textContent=m.truth;
      m.text=m.truth;
      if(live) await new Promise(r=>setTimeout(r,800));
    } else {
      const nm={...m,from:'me',flipped:true}; if(typeof m.flip==='string') nm.text=m.flip; if(m.type==='voice') nm.alt='kapi';
      const row=rerender(c,m,nm); if(live){ row.classList.add('flipping'); A.glitch(.1); await new Promise(r=>setTimeout(r,500)); }
    }
  }
  c.revealedSeen=true;
  if(cid==='emre'){ $('cSub').textContent=c.sub; }
  revealBusy=false;
}
/* Deniz'in gece kaydettiği sesli mesaj: kapının vurulması, nefes */
function recVO(seconds,onprog){
  let stopped=false, res; const t0=performance.now(), tm=[];
  const br=setInterval(()=>A.noise(1.1,{type:'lowpass',f:450,gain:.06,a:.4}),1700);
  tm.push(setTimeout(()=>SFX.knock(.2),2000), setTimeout(()=>SFX.knock(.2),6000));
  const h={done:new Promise(r=>res=r), stop(){ stopped=true; clearInterval(br); tm.forEach(clearTimeout); res(); }};
  const tick=()=>{ if(stopped) return; const p=Math.min(1,(performance.now()-t0)/1000/seconds); onprog&&onprog(p); if(p<1) requestAnimationFrame(tick); else h.stop(); };
  tick(); return h;
}
const LINK_DENIZ={type:'link',url:'https://e-sira.app/omur-testi?ref=deniz',title:'Ömür Testi ⏳ Ne kadar ömrün kaldı?',desc:'Doğum tarihini gir, kalan ömrünü öğren. %98 doğru çıkıyor 😱',domain:'e-sira.app'};
async function takerAlive(k,fm){
  const T=fm?fm.time:'03:11', link={...LINK_DENIZ,thumb:IMG.linkThumb};
  const L = !fm ? ['Gece beni 3 kere aramış, video atmış. Uyuyordum, görmedim 😔','Son açtığı şey annemin attığı link.',link,'Ben de açtım.','Bende de 1 gün yazıyor.']
    : {emre:[`Bana da Deniz'den bir link gelmiş. Saat ${T}.`,'O saatte telefonu benim cebimdeydi 😳',link,'Açtım.','1 gün yazıyor.'],
       anne:[`Deniz'den bana bir link geldi. Saat ${T}.`,'O saatte başındaydım. Gözleri kapalıydı.',link,'Açtım.','Bende 1 gün yazıyor.'],
       baba:[`Deniz'in numarasından bana bir link gelmiş, ${T}'de.`,'Telefonu Emre\'deydi o saatte.',link,'Açtım, bakayım dedim.','1 gün yazıyor.'],
       teyze:['Benim attığım link bana geri geldi 😳',`Deniz'in numarasından, saat ${T}.`,link,'Açtım yine.','Bu sefer 1 gün yazıyor.'],
       babaanne:['Deniz bana bir şey göndermiş yavrum.',`Saat ${T}. Ben uyuyordum.`,link,'Torunum açtı bana.','Bir gün yazıyor. Sıra bende demek.']}[k];
  for(let i=0;i<L.length;i++) await say('aile',k,L[i], i===L.length-1?{after:2200}:{});
  SFX.chime();
  toast({raw:`<div class="nt red"><span class="ntAv" style="display:grid;place-items:center;background:#c8102e;font-family:VT323;font-size:22px;color:#fff">${SIRA_NO+1}</span><div class="ntB"><div class="ntH"><span class="appdot">${svg('web')}</span>e-Sıra · şimdi</div><div class="ntT">Yeni kayıt: ${esc(PEOPLE[k].name)}</div><div class="ntX">Sıra numarası ${SIRA_NO+1} · Kalan süre: 23:59:59</div></div></div>`},{});
  await sleep(4500);
}
function finalScreen(title,text,taker){
  const o=$('overlay'), next=SIRA_NO+2, url=location.origin+location.pathname+'?sira='+next;
  o.innerHTML=`<h2>${title}</h2><p>${text}</p>
    <div class="shareBox"><b>SIRADAKİ NUMARA: ${next}</b>
      <p>${SIRA_NO+1} numarayı ${esc(taker)} aldı.<br>Bu oyunu bir yakınına gönderirsen ${next} numara onun olur.</p>
      <button class="big" id="devret">SIRAMI DEVRET</button>
      <button class="ghostBtn" id="devretme">Devretme</button>
      <small id="devretNot"></small></div>
    <button class="ghostBtn" id="again">Baştan oyna</button>`;
  $('devret').onclick=async()=>{
    const data={title:'SIRA',text:'Sıra numaranı öğren 😱 %98 doğru çıkıyor',url};
    try{ if(navigator.share){ await navigator.share(data); $('devretNot').textContent='Sıran devredildi.'; return; } }catch(e){ if(e&&e.name==='AbortError') return; }
    try{ await navigator.clipboard.writeText(url); $('devretNot').textContent='Link kopyalandı. Kime göndereceğin sana kalmış.'; }
    catch(e){ $('devretNot').textContent=url; }
  };
  $('devretme').onclick=()=>{ $('devretNot').textContent='Sıran seni bekliyor.'; A.glitch(.3); };
  $('again').onclick=()=>location.href=location.pathname;
  o.classList.remove('off'); o.style.opacity=0; o.style.transition='opacity 2s'; requestAnimationFrame(()=>o.style.opacity=1);
}

/* =========================================================
   SON SAHNE: yoğun bakım (gişe yerine)
   ========================================================= */
const MON={on:false,flat:false,bpm:64,t:null,br:null,beatAt:-1e9};
function monStart(bpm=64){
  MON.on=true; MON.flat=false; MON.bpm=bpm;
  const tick=()=>{ if(!MON.on||MON.flat) return; A.tone(988,.11,{gain:.08}); MON.beatAt=performance.now(); $('finBpm').textContent='♥ '+MON.bpm; MON.t=setTimeout(tick,60000/MON.bpm*(.94+Math.random()*.12)); };
  tick();
  const breath=()=>A.noise(1.5,{type:'lowpass',f:420,gain:.035,a:.6}); breath(); MON.br=setInterval(breath,4300);
}
function monFlat(){ MON.flat=true; clearTimeout(MON.t); $('finBpm').textContent='---'; A.tone(988,4.6,{gain:.07,a:.02}); }
function monStop(){ MON.on=false; clearTimeout(MON.t); clearInterval(MON.br); }
const ECG={raf:0,x:0,last:0,prevY:null};
function ecgStart(){
  const c=$('finEcg'), g=c.getContext('2d'), H=c.height, base=H*.62; g.clearRect(0,0,c.width,H); ECG.x=0; ECG.prevY=null; ECG.last=performance.now();
  const val=now=>{ if(MON.flat||!MON.on) return 0; const d=now-MON.beatAt; if(d<0||d>420) return 0; if(d<40) return -.12; if(d<80) return 1; if(d<115) return -.35; if(d<160) return 0; if(d<340) return .18*Math.sin((d-160)/180*Math.PI); return 0; };
  const step=now=>{
    const dt=Math.min(50,now-ECG.last); ECG.last=now; const nx=ECG.x+dt*.09, y=base-val(now)*H*.5;
    g.clearRect(nx,0,18,H);
    g.strokeStyle='#3fe07a'; g.lineWidth=2; g.shadowColor='#3fe07a'; g.shadowBlur=6;
    g.beginPath(); g.moveTo(ECG.x,ECG.prevY??y); g.lineTo(nx,y); g.stroke();
    ECG.prevY=y; ECG.x=nx; if(ECG.x>c.width){ ECG.x=0; ECG.prevY=null; }
    ECG.raf=requestAnimationFrame(step);
  };
  ECG.raf=requestAnimationFrame(step);
}
function ecgStop(){ cancelAnimationFrame(ECG.raf); }
function finSet(top,t,s=''){ $('finTop').textContent=top; $('finT').textContent=t; $('finS').textContent=s; }
function detectV(v){ if(!FL||!v||!v.videoWidth) return null; try{ return FL.detectForVideo(v,performance.now()); }catch(e){ return null; } }
function camOff(){ camStop(); if(gameVid){ gameVid.pause(); gameVid.srcObject=null; } }
function backToPhone(){ S.mode='phone'; S.phoneOpen=false; S.frozen=false; $('form').classList.remove('on'); $('screens').style.display='block'; $('sb').style.color=''; paintStatus(); }
function whiteTo(color,op,ms){ const w=$('white'); w.style.background=color; w.style.transition=`opacity ${ms}ms`; w.style.opacity=op; return sleep(ms); }

function forwardPicker(){
  return new Promise(res=>{
    const box=$('finFwd'), who=['emre','anne','baba','teyze','babaanne']; let sel=null;
    box.innerHTML=`<div class="fwH"><span class="ic">${svg('close')}</span><div><b>Şuraya ilet…</b><small>Ömür Testi ⏳ bağlantısı</small></div></div>
      <div class="fwSec">Son sohbetler</div>
      <div class="fwList">${who.map(k=>`<button class="fwRow" data-k="${k}"><img src="${AV[PEOPLE[k].av]}" alt=""><b>${esc(PEOPLE[k].name)}</b><i></i></button>`).join('')}</div>
      <div class="fwBot"><button class="fwNo">Gönderme</button><span id="fwSel"></span><button class="fwGo" disabled>${svg('send')}</button></div>`;
    box.classList.add('on');
    box.querySelectorAll('.fwRow').forEach(r=>r.onclick=()=>{ sel=r.dataset.k; box.querySelectorAll('.fwRow').forEach(x=>x.classList.toggle('on',x===r)); box.querySelector('.fwGo').disabled=false; $('fwSel').textContent=PEOPLE[sel].name; A.key(); });
    box.querySelector('.fwGo').onclick=()=>{ if(!sel) return; A.send(); box.classList.remove('on'); res(sel); };
    box.querySelector('.fwNo').onclick=()=>{ box.classList.remove('on'); res(null); };
  });
}

async function finale(){
  stopAllVoices();
  const f=$('fin'); finSet('','',''); f.classList.add('on');
  $('bigcd').classList.remove('on'); $('device').classList.remove('shake'); $('glitch').classList.remove('on');
  S.remainRun=false; ambience(null);
  await sleep(3500);
  monStart(64); ecgStart();
  await sleep(6000);
  finSet('','Bir makine ötüyor.'); await sleep(4500);
  finSet('',''); await sleep(2000);
  // kamera ya da basılı tutma
  const vid=await gameCam();
  const fl=vid ? await Promise.race([loadFace(), new Promise(r=>setTimeout(()=>r(null),8000))]) : null;
  let held=false;
  f.onpointerdown=()=>{ held=true; }; f.onpointerup=f.onpointercancel=()=>{ held=false; };
  const sense=()=>{ if(held) return 'closed'; if(fl){ const b=blinkOf(detectV(vid)); if(b==null) return null; return b>.45?'closed':'open'; } return 'open'; };
  const frame=()=>new Promise(r=>setTimeout(r,50));
  const hint = fl ? 'Telefonu yüzüne doğru tut.' : 'Parmağını ekrana bas ve basılı tut.';
  A.pop(); try{ navigator.vibrate&&navigator.vibrate([150,80,150]); }catch(e){}
  finSet('e-Sıra · Sıranız geldi.','Gözlerini kapat.',hint);
  // A) gözlerin kapanmasını bekle
  let cl=0, nf=0, lt=performance.now();
  const step=()=>{ const n=performance.now(), d=Math.min(.25,(n-lt)/1000); lt=n; return d; };
  while(true){ await frame(); const s=sense(), dt=step();
    if(s==='closed'){ cl+=dt; if(cl>.6) break; }
    else { cl=0; if(s===null){ nf+=dt; $('finS').textContent = nf>20 ? 'Yüzünü göremiyorum. Parmağını ekrana basılı da tutabilirsin.' : 'Yüzünü göremiyorum.'; } else $('finS').textContent=hint; } }
  // B) gözler kapalı: dışarıdan sesler
  finSet('','',''); let t=0, op=0, opened=false; const fired=new Set();
  const ev=(at,fn)=>{ if(t>=at && !fired.has(at)){ fired.add(at); fn(); } };
  lt=performance.now();
  while(true){ await frame(); const s=sense(), dt=step();
    if(s==='closed'){ t+=dt; op=0; } else if(s==='open'){ op+=dt; if(op>.35){ opened=true; break; } } else t+=dt*.5;
    ev(1,()=>{ MON.bpm=58; });
    ev(3,()=>vo('anne_3d',{pan:-.35}));
    ev(9,()=>SFX.sizzle());
    ev(10.5,()=>vo('babaanne_kursun',{pan:.35}));
    ev(17,()=>{ MON.bpm=46; vo('emre_whisper',{pan:-.7}); });
    ev(21,()=>{ MON.bpm=34; });
    ev(23.5,()=>{ MON.bpm=22; });
    if(t>=26) break;
  }
  f.onpointerdown=f.onpointerup=f.onpointercancel=null;
  if(opened){
    curVO?.stop(); MON.bpm=112; $('finBpm').textContent='♥ 112';
    await whiteTo('#fff',.92,250); await whiteTo('#fff',0,2500);
    finSet('','Gözlerin açık.'); await sleep(3000);
    A.pop(); finSet('e-Sıra · şimdi','Sıra boş kalamaz.'); await sleep(3000);
    finSet('e-Sıra · şimdi','Uyanmak istiyorsan sıranı birine devret.'); await sleep(3500);
    const k=await forwardPicker();
    if(k){ const fm={from:'me',...LINK_DENIZ,thumb:IMG.linkThumb,silent:true}; post(k,fm); return endDevir(k,fm); }
    finSet('','Gözlerin kapanıyor.'); MON.bpm=40; await sleep(3500); MON.bpm=24; await sleep(3500);
  }
  return endKabul();
}
async function afterWake(color){
  $('fin').classList.remove('on'); camOff(); backToPhone(); setClock(6,12,3); prepReveal(); ambience('drone');
  post('aile',{from:'baba',text:'Deniz\'in telefonundan mesajlar geldi?!',silent:true});
  lockNotifs([notifHTML('Kocaman Ailemiz ❤️','Babam: Deniz\'in telefonundan mesajlar geldi?!',AV.aile,{when:'06:11'}), notifHTML('Emre','3 giden sesli arama',AV.emre,{when:'03:14'})]);
  show('lock',false); S.stack=[];
  await sleep(1500); await whiteTo(color,0,2500);
  await waitUnlock(); show('home');
  await say('aile','anne','Hepsi şimdi düştü. Dünden beri yazdıkları…',{gap:5000});
  await say('aile','emre','Telefon bende. Elimde. Kimse bir şey yazmadı.');
  await waitChat('aile',60000);
  await waitFor(()=>!revealBusy,300);
}
async function nudgeEmre(){
  if(CH.emre.revealedSeen) return;
  A.pop(); toast({raw:notifHTML('Emre','Gece gönderilen mesajlar · 03:10–03:15',AV.emre,{when:'şimdi'})},{},()=>openChat('emre'));
  const t0=performance.now(); await waitFor(()=>CH.emre.revealedSeen || performance.now()-t0>45000*SPEED,400);
  await waitFor(()=>!revealBusy,300); await sleep(3000);
}
async function endKabul(){
  monFlat(); finSet('','',''); await sleep(5000);
  monStop(); ecgStop(); await whiteTo('#000',1,800);
  await afterWake('#000');
  await say('aile','anne','Deniz…');
  await say('aile','anne','Deniz\'i kaybettik.',{after:2200});
  sys('aile','Deniz gruptan çıktı',true); A.glitch(.3); await sleep(3000);
  await takerAlive('emre',null);
  await nudgeEmre();
  finalScreen('SON: KABUL','Gözlerini açmadın. Sıran tamamlandı.<br>O gece Emre seni hiç aramadı; arayan sendin.<br>Ama link hâlâ dolaşıyor.','Emre');
}
async function endDevir(k,fm){
  MON.bpm=96; finSet('','Uyanıyorsun.'); await sleep(2500);
  await whiteTo('#fff',1,2000); monStop(); ecgStop(); SFX.sizzle();
  await afterWake('#fff');
  await say('aile','anne','Deniz gözlerini açtı!! 😭');
  await say('aile','babaanne','Kurşun tuttu yavrum. Döndün.');
  await say('aile','baba','Oh be! Yaşıyor 😭',{after:2400});
  await takerAlive(k,fm);
  await nudgeEmre();
  finalScreen('SON: DEVİR','Uyandın. Sıranı '+esc(PEOPLE[k].name)+' aldı.<br>Linki ona sen gönderdin; o sırada telefonun Emre\'nin cebindeydi.<br>Ama link hâlâ dolaşıyor.',PEOPLE[k].name);
}

/* ---------- hikâye yardımcıları ---------- */
function hpost(cid,from,day,time,m){
  if(typeof m==='string') m={text:m};
  const [h,mi]=time.split(':').map(Number);
  post(cid,{from,type:'text',...m,day,time,ts:day*1440+h*60+mi,silent:true,read:true});
}
function renotify(cid){ const c=CH[cid]; const m=[...c.list].reverse().find(x=>x.from!=='me'&&x.type!=='sys'&&x.type!=='e2e'); if(m) notify(cid,m); }
/* oyuncu o sohbeti açana kadar bekle; arada bildirimi hatırlat */
async function waitChat(cid,max=90000,nudge=30000){
  const t0=performance.now(); let ln=t0;
  await waitFor(()=>{ const now=performance.now();
    if(viewing(cid)) return true;
    if(now-t0>max*SPEED) return true;
    if(now-ln>nudge*SPEED && S.screen!=='call' && S.screen!=='game' && !$('task').classList.contains('on')){ ln=now; renotify(cid); }
    return false; },400);
}
/* oyuncu bir şeyin ortasında değilken devam et (tarayıcı, video, arama, oyun) */
async function waitCalm(max=40000){ const t0=performance.now(); await waitFor(()=>!['browser','viewer','call','game','camera','status'].includes(S.screen) || performance.now()-t0>max*SPEED,500); }
function stopAllVoices(){ try{ curVO&&curVO.stop(); }catch(e){} try{ 'speechSynthesis' in window && speechSynthesis.cancel(); }catch(e){} }
function sysToast(title,body,onTap){ A.pop(); toast({raw:`<div class="nt red"><span class="ntAv" style="display:grid;place-items:center;background:#c8102e;font-family:VT323;font-size:22px;color:#fff">${SIRA_NO}</span><div class="ntB"><div class="ntH"><span class="appdot">${svg('web')}</span>e-Sıra · şimdi</div><div class="ntT">${esc(title)}</div><div class="ntX">${esc(body)}</div></div></div>`},{},onTap); }
async function ghostType(cid,who,ms){ setTyping(cid,who); await sleep(ms); setTyping(cid,null); }

/* =========================================================
   HİKÂYE
   ========================================================= */
function history(){
  const h=hpost;
  // --- aile grubu
  h('aile','sys',0,'07:00',{type:'e2e'});
  h('aile','teyze',0,'07:52',{type:'image',src:IMG.gunaydin2});
  h('aile','yenge',0,'08:05','Günaydın canlarım 🌹🌹🌹');
  h('aile','babaanne',0,'08:40','GUNAYDIN');
  h('aile','dayi',0,'08:41','Günaydın 👍');
  h('aile','anne',0,'13:18',{type:'image',src:IMG.yemek,cap:'Bugünkü menü 😋'});
  h('aile','yenge',0,'13:22','Ellerine sağlık Sevgi\'ciğim 😍');
  h('aile','teyze',0,'13:25','Ellerine sağlık kardeşim 👏👏 bize de saklayın');
  h('aile','babaanne',0,'13:41','ELINE SAGLIK KIZIM');
  h('aile','eniste',0,'19:45',{fwd:'cok',text:'‼️SON DAKİKA‼️ Yarından itibaren WhatsApp ücretli oluyor. Bu mesajı 10 kişiye gönderin, hesabınız ücretsiz kalsın. Gönderiyoruz arkadaşlar 🙏🙏'});
  h('aile','emre',0,'19:52','baba bu yalan 😂😂');
  h('aile','selin',0,'19:53','babaa 🤦‍♀️');
  h('aile','eniste',0,'19:58','Ben dikkat edin diye attım');
  h('aile','baba',0,'20:10','😄');
  h('aile','teyze',1,'07:31',{type:'image',src:IMG.gunaydin});
  h('aile','babaanne',1,'07:33','Gunaydin yavrularim');
  h('aile','yenge',1,'07:40','Günaydın 🌸☕');
  h('aile','baba',1,'12:02','Kombi yine su kaçırıyor, yarın usta gelecek');
  h('aile','anne',1,'12:05','Yarın akşam hepiniz bize gelin, mantı yapıyorum 🥟');
  h('aile','emre',1,'12:06','geliyorum 😋 bol yoğurtlu olsun');
  h('aile','teyze',1,'12:08','Emre\'m mantı deyince koşar 😄 Ben de börek getiririm');
  h('aile','yenge',1,'12:11','Biz de geliyoruz, tatlı benden 🍰');
  h('aile','dayi',1,'12:14','Ben işten çıkınca gelirim, 8 gibi');
  h('aile','me',1,'12:20','Ben de varım 🙋');
  h('aile','babaanne',1,'17:02','SEVGI KIZIM ILACLARIMI ALDINMI');
  h('aile','anne',1,'17:10','Aldım anne, akşam getiriyorum');
  h('aile','babaanne',1,'17:11','👍👍');
  // --- kuzenler
  h('kuzen','sys',0,'00:00',{type:'e2e'});
  h('kuzen','burak',0,'20:31','akşam maç var izleyen?');
  h('kuzen','emre',0,'20:33','ben izlicem');
  h('kuzen','selin',0,'20:34','ilgilenmiyorum 💅');
  h('kuzen','me',0,'20:40','ben de bakarım');
  h('kuzen','burak',0,'22:58','rezaletti 🤦‍♂️');
  h('kuzen','emre',1,'15:12','yarın mantıdan sonra çıkalım mı');
  h('kuzen','burak',1,'15:20','olur');
  h('kuzen','me',1,'15:31','olur bence de');
  h('kuzen','emre',1,'21:20','annem yine gruba bişey atıcak hissediyorum 😂');
  // --- özel sohbetler
  h('emre','sys',1,'00:00',{type:'e2e'});
  h('emre','emre',1,'20:12','maçı izledin mi 😂😂');
  h('emre','me',1,'20:15','izledim kuzen rezalet');
  h('emre','emre',1,'20:16',{type:'image',src:IMG.mac});
  h('emre','emre',1,'20:16','şu pozisyona bak');
  h('anne','anne',1,'18:44','Ekmek aldın mı?');
  h('anne','me',1,'18:50','Aldım anne');
  h('anne','anne',1,'18:51','Aferin 😘 bir de çamaşırları as');
  h('anne','me',1,'18:58','Tamam');
  h('baba','baba',0,'09:20','Arabanın sigortası bu ay bitiyor, hatırlat bana');
  h('baba','me',1,'08:10','Baba sigorta');
  h('baba','baba',1,'08:30','Tamam 👍');
  h('mert','mert',1,'16:05','kanka yarın halı saha var gelcen mi');
  h('mert','me',1,'16:20','bilmiyorum akrabalar gelecek');
  h('mert','mert',1,'16:21','😒');
  h('mert','mert',1,'16:21','tamam kaçırırsın');
  h('zeynep','zeynep',0,'21:40','fizik notlarını atar mısın');
  h('zeynep','me',0,'21:55','yarın okulda veririm');
  h('zeynep','zeynep',0,'22:01','tamam 🙏');
  // --- kalabalık gruplar
  h('okul','kaan',1,'19:28','fizik ödevi kimde var');
  h('okul','ali',1,'19:30','yarın sınav var mı');
  h('okul','zeynep',1,'19:31','yok pazartesi');
  h('okul','ali',1,'19:31','oh be');
  h('saha','kaan',1,'14:00','Cuma 21:00 kadro:\n1. Kaan\n2. Mert\n3. Ali\n4. Berk\n5.\n6.');
  h('saha','mert',1,'14:05','Deniz gel kanka eksik var');
  h('apt','yonetici',0,'10:15','Değerli komşularımız, asansör bakımı yarın 10:00-12:00 arası yapılacaktır. Bilginize.');
  h('apt','komsu',0,'10:40','Teşekkürler Cengiz Bey');
  h('apt','yonetici',1,'18:30','Kasım aidatlarını yatırmayan komşularımızın en kısa sürede yatırmasını rica ederim.');
  CH.kargo.archived=true;
  h('kargo','kargo',1,'10:12','Sayın müşterimiz, 4711823 takip numaralı gönderiniz dağıtıma çıkmıştır.');
  // --- teyzenin linki (okunmamış)
  post('aile',{from:'teyze',type:'voice',vo:'teyze_d1',day:1,time:'21:33',ts:1440+1293,silent:true});
  const link={from:'teyze',type:'link',url:'https://e-sira.app/omur-testi?ref=nermin',title:'Ömür Testi ⏳ Ne kadar ömrün kaldı?',desc:'Doğum tarihini gir, kalan ömrünü öğren. %98 doğru çıkıyor 😱',domain:'e-sira.app',thumb:IMG.linkThumb,day:1,time:'21:33',ts:1440+1293,silent:true};
  post('aile',link);
  S.link=link;
}

async function day1(){
  S.day=1; setClock(21,34,1);
  ambience('ev');
  history();
  lockNotifs([notifHTML('Kocaman Ailemiz ❤️','Nermin Teyze: 🎤 Sesli mesaj ('+fmtDur(lineDur('teyze_d1'))+')',AV.teyze,{when:'21:33'}), notifHTML('Kocaman Ailemiz ❤️','Nermin Teyze: https://e-sira.app/omur-testi?ref=nermin',AV.teyze,{when:'21:33'}), notifHTML('Kuzenler 👊','Emre: annem yine gruba bişey atıcak hissediyorum 😂',AV.emre,{when:'21:20'})]);
  A.pop();
  await waitUnlock();
  show('home');
  // oyuncu serbest: aile grubunu açınca konuşma başlar
  await waitChat('aile',70000);
  await sleep(3000);
  await say('aile','anne','Nermin yine ne attın gece gece 😄');
  await say('aile','teyze','Bakın bakın çok doğru çıkıyor 😍');
  await say('aile','teyze','Benimki 12 yıl çıktı, az kalmış 😂');
  await say('aile','yenge','Ayy Nermin abla korkuttun beni 😅');
  await say('aile','eniste','Bunlar hep bilgi toplamak için. Doğum tarihi falan girmeyin.');
  await say('aile','teyze','Hüseyin sen her şeye karışma 🙄');
  await say('aile','baba','Bende 24 yıl çıktı 😄 emekliliği görürüz herhalde');
  await say('aile','babaanne','BEN BAKMAM OYLE SEYLERE UGURSUZLUK GETIRIR');
  await say('aile','dayi','31 yıl 💪');
  await say('aile','emre','anne bende 1 gün yazıyo 😂😂');
  await say('aile','emre',{type:'image',src:IMG.emreShot});
  await say('aile','emre',{type:'voice',vo:'emre_d1'});
  await say('aile','teyze','Emre ağzından yel alsın 😠 öyle şaka mı olur');
  await say('aile','selin','anne şaka yapıyo abim 🙄 her şeye inanma');
  await say('aile','teyze',{type:'text',text:'Deniz sen de bak yavrum 😘',quote:{who:'teyze',text:'Ömür Testi ⏳ Ne kadar ömrün kaldı?'}});
  const c=await choose('aile',['Tamam teyze bakıyorum 🙂','Teyze bunlar hep uydurma 😅']);
  if(c===1){ await say('aile','teyze','Uydurma değil yavrum, herkes baktı. Sen de bak 😘'); await say('aile','eniste','Bakma Deniz.'); }
  S.link.lp.classList.add('glow');
  let tapped=false; const tapP=new Promise(r=>S.link.onTap=()=>{ tapped=true; r(); });
  (async()=>{ await sleep(45000); if(!tapped) await say('aile','teyze','Deniz baktın mı yavrum? 😘'); await sleep(50000); if(!tapped) await say('aile','yenge','Deniz\'inki kaç çıktı merak ettim 😄'); })();
  await tapP; S.link.onTap=null; S.link.lp.classList.remove('glow');
  await testFlow();
  back('chat'); openChat('aile'); await sleep(500);
  A.send(); post('aile',{from:'me',type:'image',src:IMG.myShot,cap:'9 gün 😅'});
  await say('aile','emre','9 gün mü 😂 benden sonra sıra sende');
  await say('aile','yenge','Uzun ömürlü olun hepiniz 🌹🌹');
  await choose('aile',['Saçmalama Emre 😄','Yarın mantıda görüşürüz 🥟']);
  await say('aile','emre','tamam tamam 😂 iyi geceler millet');
  await say('aile','emre','yarın helvada görüşürüz 💀');
  await say('aile','teyze','EMRE!');
  await say('aile','eniste','Emre bırak telefonu yat 😠');
  await say('aile','dayi','Çocuklar yatın artık, yarın okul var');
  // kuzenler, sonra Emre özelden
  await say('kuzen','burak','emre ne yazdın gruba 😂',{gap:9000});
  await say('kuzen','emre','şaka lan 😂');
  await say('emre','emre','kuzen cidden 1 gün yazıyo bende',{gap:12000});
  await say('emre','emre','sayfayı kapattım ama bi tane daha açıldı kendi kendine');
  await say('emre','emre','sıra no 12 yazıyo');
  const r=await choose('emre',['Şaka yapma 😄','Ss at bakayım']);
  await say('emre','emre', r===1 ? 'attım ya grupta' : 'şaka değil valla');
  await say('emre','emre','neyse yatıyorum ben');
  await say('emre','emre','iyi geceler kuzen');
  // annem
  await say('anne','anne','Deniz yat artık, yarın erken kalkacaksın',{gap:16000});
  await say('anne','anne','Odanın ışığı hâlâ yanıyor, kapının altından görüyorum 😠');
  const a=await choose('anne',['Tamam anne yatıyorum','5 dk 🙏']);
  await say('anne','anne', a===0 ? '👍 İyi geceler' : '5 dk diyorsun 1 saat oluyor');
  await sleep(14000);
  await waitCalm();
  await sleep(4000);
}

async function night(){
  ambience(null); stopAllVoices();
  await interlude('PERŞEMBE GECESİ','UYKU',3200);
  ambience('drone');
  const sl=$('sleep'); sl.classList.add('on'); await interOut();
  $('slTxt').textContent='Uyuyorsun.';
  $('slClock').textContent='03:09'; await sleep(5000);
  $('slClock').textContent='03:10'; A.tone(1046,.05,{gain:.03}); await sleep(4000);
  $('slClock').textContent='03:11'; A.tone(1046,.05,{gain:.03}); await sleep(3500);
  for(const t of ['03:12','03:13','03:14']){
    $('slClock').textContent=t; $('slPhone').classList.add('buzz'); A.buzz(1.2); A.ringStart(true);
    await sleep(3600); A.ringStop(); $('slPhone').classList.remove('buzz'); await sleep(1800);
  }
  $('slClock').textContent='03:15'; A.tone(1046,.05,{gain:.03}); await sleep(2600);
  SFX.knock(.3); await sleep(3500);
  $('slClock').textContent='03:16'; await sleep(2500);
  // gece olanlar (oyuncu uyurken)
  const d=2, base=2*1440;
  post('emre',{from:'emre',text:'deniz',flip:'emre',day:d,time:'03:10',ts:base+190,silent:true});
  post('emre',{from:'emre',text:'uyanık mısın',flip:'uyanık mısın',day:d,time:'03:10',ts:base+190,silent:true});
  post('emre',{from:'emre',type:'video',video:'emre',thumb:IMG.emreThumb,dur:'0:10',flip:true,day:d,time:'03:11',ts:base+191,silent:true});
  post('emre',{from:'emre',text:'kapının altına bak',flip:'kapının altına bak',day:d,time:'03:11',ts:base+191,silent:true});
  for(const [t,ts] of [['03:12',192],['03:13',193],['03:14',194]]) post('emre',{from:'emre',type:'call',flip:true,day:d,time:t,ts:base+ts,silent:true});
  post('emre',{from:'emre',type:'voice',vo:'emre_vm',flip:true,day:d,time:'03:15',ts:base+195,silent:true});
  post('kuzen',{from:'emre',text:'uyanık olan var mı',flip:'uyanık olan var mı',day:d,time:'03:12',ts:base+192,silent:true});
  post('kuzen',{from:'emre',text:'deniz telefonu aç',flip:'emre telefonu aç',day:d,time:'03:13',ts:base+193,silent:true});
  post('apt',{from:'komsu',text:'Yukarı katlarda biri kapıları tek tek çalıyor, duyan var mı?',day:d,time:'03:16',ts:base+196,silent:true});
  post('apt',{from:'komsu',text:'Gözetliyorum kimse yok ama hâlâ çalıyor',day:d,time:'03:18',ts:base+198,silent:true});
  addCall({who:'emre',kind:'missed',t:'Bugün 03:14',n:3});
  PHOTOS.unshift({video:'emre',thumb:IMG.emreThumb,who:'Emre',when:'Bugün 03:11'});
  PHOTOS.unshift({img:IMG.oda,who:'Kamera',when:'Bugün 03:11'});
  STATUS.unshift({who:'emre',img:IMG.emreThumb,cap:'kapıyı açma',t:'Bugün 03:11',flip:true});
  CH.emre.sub='son görülme bugün 03:15';
  sl.classList.remove('on');
  await interlude('CUMA','07:48',3200);
  ambience('sabah');
  setClock(7,48,2);
  post('aile',{from:'baba',text:'Nermin\'in evine gidiyoruz. Emre fenalaşmış',truth:'Deniz\'in odasına girdik. Deniz uyanmıyor',day:2,time:'06:41',ts:base+401,silent:true});
  post('aile',{from:'anne',text:'Ambulans geldi',day:2,time:'06:52',ts:base+412,silent:true});
  post('aile',{from:'yenge',text:'Ne oldu Sevgi?? Haber verin',day:2,time:'06:58',ts:base+418,silent:true});
  post('aile',{from:'baba',text:'Emre\'yi kaybettik 😞 Başımız sağ olsun',truth:'Deniz\'i yoğun bakıma aldılar 😞',day:2,time:'07:20',ts:base+440,silent:true});
  post('aile',{from:'babaanne',text:'😭😭😭',day:2,time:'07:22',ts:base+442,silent:true});
  post('aile',{from:'dayi',text:'Ne diyorsunuz?! Geliyorum hemen',day:2,time:'07:24',ts:base+444,silent:true});
  post('aile',{from:'yenge',text:'İnanamıyorum 😭😭',day:2,time:'07:25',ts:base+445,silent:true});
  post('kuzen',{from:'burak',text:'Selin ne oluyor?',day:2,time:'07:35',ts:base+455,silent:true});
  post('kuzen',{from:'selin',text:'abim…',truth:'Deniz…',day:2,time:'07:44',ts:base+464,silent:true});
  post('anne',{from:'anne',text:'Deniz uyandın mı? Ara beni',truth:'Deniz uyan. Ne olur uyan.',day:2,time:'07:40',ts:base+460,silent:true});
  post('mert',{from:'mert',text:'kanka duydum.. başın sağ olsun 😔',truth:'kanka annen yazdı, hastanedeymişsin?? iyi misin 😟',day:2,time:'07:46',ts:base+466,silent:true});
  post('okul',{from:'zeynep',text:'Deniz bugün gelmiyor mu?',day:2,time:'07:50',ts:base+470,silent:true});
  post('okul',{from:'ali',text:'kuzeni ölmüş galiba',truth:'hastaneye kaldırılmış galiba',day:2,time:'07:52',ts:base+472,silent:true});
  addCall({who:'anne',kind:'missed',t:'Bugün 07:41'});
  lockNotifs([
    notifHTML('Emre','3 cevapsız sesli arama',AV.emre,{when:'03:14'}),
    notifHTML('Emre','🎤 Sesli mesaj ('+fmtDur(lineDur('emre_vm'))+')',AV.emre,{when:'03:15'}),
    notifHTML('B Blok Sakinleri 🏢','Ayten Hanım D.6: Yukarı katlarda biri kapıları tek tek çalıyor…',AV.apt,{when:'03:16'}),
    notifHTML('Kocaman Ailemiz ❤️','Babam: Emre\'yi kaybettik 😞 Başımız sağ olsun',AV.aile,{when:'07:20'}),
    notifHTML('Annem','Deniz uyandın mı? Ara beni',AV.anne,{when:'07:40'}),
    notifHTML('Mert','kanka duydum.. başın sağ olsun 😔',AV.mert,{when:'07:46'}),
  ]);
  await interOut();
}

async function day2(){
  // o gün yazılabilecekler (cevapsız kalırlar: tek gri tik)
  CH.emre.free=[{t:'Emre?'},{t:'Bu nasıl şaka?'},{t:'Gece ne oldu?'}];
  CH.anne.free=[{t:'Anne neredesiniz?'},{t:'Anne ben iyiyim, cevap ver'}];
  CH.aile.free=[{t:'Ne oluyor? Kimse cevap vermiyor'}];
  CH.mert.free=[{t:'Sağ ol kanka'}];
  CH.kuzen.free=[{t:'Selin ne oldu?'}];
  await waitUnlock();
  show('home');
  // Emre'nin sesli mesajı dinlenene ya da bir süre geçene kadar bekle
  const t0=performance.now();
  await waitFor(()=>CH.emre.el.querySelector('.vm.played') || performance.now()-t0>70000*SPEED);
  await sleep(7000);
  await say('aile','anne',{type:'voice',vo:'anne_d2',lie:true});
  await say('aile','baba',{type:'text',text:'Cenaze yarın öğlen. Hepimiz Nermin\'lerde toplanıyoruz.',truth:'Doktorlar bekleyeceğiz diyor. Hepimiz hastanedeyiz.'});
  await say('aile','dayi',{type:'text',text:'Hüseyin\'e ulaşamıyorum, telefonu kapalı',truth:'İçeri sadece bir kişi alıyorlarmış'});
  await say('aile','yenge',{type:'text',text:'Başımız sağ olsun 😔 Nermin\'in yanına gidiyorum',truth:'Geçmiş olsun 😔 Sevgi\'nin yanına gidiyorum'});
  await ghostType('aile','teyze',7000);
  await choose('aile',['Başımız sağ olsun… 😔','Ne oldu ona? Dün gece beni aramış']);
  await say('aile','baba',{type:'text',text:'Doktor kalp krizi dedi. 19 yaşında çocuk…',truth:'Doktor "derin uyku" dedi. Uyanabilir de, uyanmayabilir de…'});
  await sleep(2500);
  await say('aile','babaanne',{type:'voice',vo:'babaanne_d2'});
  await sleep(9000);
  // Emre'nin sohbetinde bir an "yazıyor…"
  CH.emre.sub='çevrimiçi'; if(S.chat==='emre') $('cSub').textContent='çevrimiçi';
  await ghostType('emre','emre',5200);
  CH.emre.sub='son görülme bugün 03:15'; if(S.chat==='emre') $('cSub').textContent=CH.emre.sub;
  await sleep(12000);
  await waitCalm();
  // e-Sıra bildirimi: oyuncu dokunana ya da uygulamayı açana kadar tekrar eder
  const sira={raw:`<div class="nt red"><span class="ntAv" style="display:grid;place-items:center;background:#c8102e;font-family:VT323;font-size:22px;color:#fff">${SIRA_NO}</span><div class="ntB"><div class="ntH"><span class="appdot">${svg('web')}</span>e-Sıra · şimdi</div><div class="ntT">Sıranız değişti</div><div class="ntX">Görüntülemek için dokunun.</div></div></div>`};
  A.pop(); try{ navigator.vibrate&&navigator.vibrate([200,100,200]); }catch(e){}
  ambience('drone');
  HOME_APPS.push({id:'sira',label:'e-Sıra',cls:'ic-sira',txt:String(SIRA_NO),action:'sira',isNew:true}); renderHome();
  await new Promise(r=>{ const again=()=>{ if(S.screen!=='call') toast(sira,{},()=>{ clearInterval(iv); r(); }); }; again(); const iv=setInterval(again,15000); ACTIONS.sira=()=>{ clearInterval(iv); r(); }; });
  ACTIONS.sira=()=>openSira();
  S.remain=24*3600-1; openSira();
  await sleep(600); await vo('sys_intro').done;
  S.remainRun=true;
  await new Promise(r=>siraResolve=r);
  await sleep(6000);
  // yüz fotoğrafının sonuçları
  CH.aile.avImg=S.face; post('aile',{type:'sys',from:'sys',text:'Emre bu grubun simgesini değiştirdi',truth:'Deniz bu grubun simgesini değiştirdi'}); A.glitch(.3);
  CH.bilinmeyen.hidden=false; CH.bilinmeyen.avImg=S.face;
  PHOTOS.unshift({img:S.face,who:'Galeri',when:'Bugün '+hhmm()});
  await sleep(7000);
  CH.bilinmeyen.free=[
    {t:'Kimsin sen?', on:()=>say('bilinmeyen','bilinmeyen','sıra sahibi',{gap:4000})},
    {t:'Ne istiyorsun?', on:()=>say('bilinmeyen','bilinmeyen','sıranı',{gap:4000})},
    {t:'Emre sen misin?', on:()=>say('bilinmeyen','bilinmeyen','12 geçti',{gap:6000})},
  ];
  await say('bilinmeyen','bilinmeyen',{type:'image',src:S.face},{typing:1500});
  await say('bilinmeyen','bilinmeyen','sıra sahibi doğrulandı');
  await say('bilinmeyen','bilinmeyen','şu an işlem gören: 13');
  const t1=performance.now();
  await waitFor(()=>S.chat==='bilinmeyen' || performance.now()-t1>40000*SPEED, 300);
  await sleep(12000);
  await waitCalm();
  await gamesPhase();
}

async function nightCall(){
  await waitCalm(30000);
  stopAllVoices();
  await interlude('CUMA GECESİ','02:47',3200);
  setClock(2,47,3);
  S.stack=[]; show('home',false); await interOut();
  await sleep(6000);
  await waitFor(()=>!outCall,300);
  let r=await incomingCall('anne');
  if(r==='reject'){ addCall({who:'anne',kind:'missed',t:'Bugün 02:47'}); await sleep(5000); r=await incomingCall('anne');
    if(r==='reject'){ addCall({who:'anne',kind:'missed',t:'Bugün 02:48'}); await sleep(4000); await incomingCall('anne',{rejectable:false}); } }
  startTalk(); await sleep(1300);
  await line('call_1'); await line('call_2',{after:200});
  const cc=await callChoose(['Anne… sen evde değil misin?','Tamam, geliyorum.']);
  await sleep(2000);
  if(cc===0) await line('call_3a'); else await line('call_3b');
  A.glitch(.25); SFX.knock(0);
  await line('call_4',{after:500});
  endTalk(); addCall({who:'anne',kind:'in',t:'Bugün 02:49'});
  await sleep(1500); back();
  await sleep(5000);
  await say('anne','anne',{type:'text',text:'Deniz telefonla kiminle konuşuyorsun gece gece?',truth:'Deniz, hemşire telefonundan ses geliyor dedi.'});
  await say('anne','anne',{type:'text',text:'Ben odamdayım. Duvardan sesin geliyor.',truth:'Başındayım yavrum. Sesini duyuyorum sanki.'});
  const c3=await choose('anne',['Anne beni az önce SEN aradın','Kimseyle konuşmuyorum']);
  await say('anne','anne', c3===0 ? 'Ben seni aramadım yavrum. Telefonum şarjda.' : 'Duyuyorum ama. Biriyle konuşuyorsun.');
  await say('anne','anne',{type:'text',text:'Kapıyı kimseye açma.',truth:'Gözlerini aç.'});
  await sleep(6000);
  await say('bilinmeyen','bilinmeyen','şu an işlem gören: 46',{typing:900});
  await sleep(4000);
  // geri sayım çöküyor
  A.glitch(.5); $('glitch').classList.add('on'); setTimeout(()=>$('glitch').classList.remove('on'),500);
  S.remain=12; S.remainRun=true;
  toast({raw:`<div class="nt red"><span class="ntAv" style="display:grid;place-items:center;background:#c8102e;font-family:VT323;font-size:22px;color:#fff">${SIRA_NO}</span><div class="ntB"><div class="ntH"><span class="appdot">${svg('web')}</span>e-Sıra · şimdi</div><div class="ntT">SIRANIZ GELDİ</div><div class="ntX">Lütfen bulunduğunuz yerden ayrılmayın.</div></div></div>`},{});
  await new Promise(r=>{ const iv=setInterval(()=>{
    if(S.remain<=10 && S.remain>0){ $('bigcd').classList.add('on'); $('bigcdN').textContent=S.remain; A.beat(.35+(10-S.remain)*.06); try{navigator.vibrate&&navigator.vibrate(80);}catch(e){} }
    if(S.remain<=0){ clearInterval(iv); $('bigcdN').textContent='0'; r(); }
  },1000*SPEED); });
  A.glitch(.6); $('device').classList.remove('shake'); $('glitch').classList.remove('on'); $('bigcd').classList.remove('on');
  S.remainRun=false;
  if(S.screen==='call'||S.screen==='game') back();
  await finale();
}

async function story(){
  if(Q.has('sakla')){ history(); setClock(16,0,2); show('home'); await gameSakla(); show('home'); return; }
  if(Q.has('oyun')){ history(); setClock(16,0,2); ambience('drone'); show('home'); await gamesPhase(); await nightCall(); return; }
  if(Q.has('final')){ history(); await night(); S.face=fakeFace();
    post('aile',{from:'anne',type:'voice',vo:'anne_d2',lie:true,silent:true});
    post('aile',{from:'baba',text:'Cenaze yarın öğlen. Hepimiz Nermin\'lerde toplanıyoruz.',truth:'Doktorlar bekleyeceğiz diyor. Hepimiz hastanedeyiz.',silent:true});
    post('aile',{from:'me',text:'Başımız sağ olsun… 😔'}); post('emre',{from:'me',text:'Emre?'});
    setClock(2,58,3); show('home',false); await finale(); return; }
  if(Q.has('gorev')){ history(); setClock(14,10,2); ambience('drone'); show('home'); S.remain=24*3600; S.remainRun=true; HOME_APPS.push({id:'sira',label:'e-Sıra',cls:'ic-sira',txt:String(SIRA_NO),action:'sira'}); renderHome(); openSira(); await new Promise(r=>siraResolve=r); S.face=S.face||fakeFace(); await gamesPhase(); await nightCall(); return; }
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
function doLoop(){ R.blackout=.35; A.glitch(.3); R.cam.position.z+=27.5; R.loop++; const seq=[12,23,34,SIRA_NO-1]; setTimeout(()=>setNumber(seq[Math.min(R.loop,3)]),700); loopEvents(R.loop); }
function loopEvents(n){
  if(n===1){ for(const w of R.waiters) if(w!==R.emre) w.rotation.y=Math.PI; sub3d('…salon aynı. Ama bir şey değişti.',3000); setTimeout(()=>say('aile','teyze','Ben size demiştim 🌹'),2500); }
  if(n===2){ R.stalker.visible=true; R.stalker.position.set(-.2,0,R.cam.position.z-10); R.waiters.forEach((w,i)=>{ if(w!==R.emre && i%2) w.visible=false; }); setTimeout(()=>say('aile','anne','Nabzı var ama uyanmıyor'),2000); setTimeout(()=>say('bilinmeyen','bilinmeyen','lütfen sıranızı bekleyiniz'),6500); }
  if(n>=3){ R.waiters.forEach(w=>{ if(w!==R.emre) w.visible=false; }); R.scene.fog.near=2; R.scene.fog.far=18;
    setTimeout(()=>say('aile','babaanne',{type:'voice',vo:'babaanne_kursun',onPlay:()=>SFX.sizzle()}),1500); setTimeout(openGise,4000); }
}
function openGise(){
  if(R.giseOn) return; R.giseOn=true; setNumber(SIRA_NO);
  setTimeout(()=>vo('anons'),900);
  R.memur.visible=true; R.giseLight.intensity=6; R.signZero.material.color.setHex(0xffffff);
  R.signZero.material.map=textTex(['GİŞE 0'],{w:256,h:76,font:'bold 44px Roboto, sans-serif',bg:'#c8102e',fg:'#fff',border:null}); R.signZero.material.needsUpdate=true;
  sub3d('Gişe 0 açıldı.',3000); setTimeout(()=>say('bilinmeyen','bilinmeyen','sıranız geldi'),3000);
}
async function level0Script(){
  await sleep(4500); say('aile','anne',{type:'voice',vo:'anne_3d'});
  await sleep(8000); say('aile','baba','Ambulansı aradım, 10 dakikaya gelecekler');
  await sleep(14000); if(R.loop===0) sub3d('Gişelere doğru yürü.',3500);
  await sleep(150000); if(R && !R.giseOn){ R.loop=3; setNumber(SIRA_NO-1); loopEvents(3); }
}

/* =========================================================
   BAŞLAT
   ========================================================= */
renderHome(); paintStatus(); renderList();
if(new URLSearchParams(location.search).get('sira')) document.querySelector('#overlay p').innerHTML='Bir yakının sırasını <b>sana devretti</b>.<br>Sıra numaran: '+SIRA_NO+'.';
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
