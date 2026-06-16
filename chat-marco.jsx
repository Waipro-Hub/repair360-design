/* ============================================================
   MrPhone — Repair360  ·  Coda TV (insegna Vetrina360) · Chat Giorgia
   · Vista Marco (Repair360 desktop) · Blueprint servizio
   ============================================================ */

// =================================================================
//  CODA LIVE — TV negozio (stile Poste · PT precede WT · signage)
//  v2: sfondo Vetrina360 rosso · slide 8s (promo/YouTube/express) ·
//      ticker · radio · TTS sul numero · fulmine strip animata
// =================================================================

// inject keyframes once
if (!document.getElementById('qs-kf')) {
  const st = document.createElement('style');
  st.id = 'qs-kf';
  st.textContent = `
    @keyframes qs-bolt{0%{transform:translateX(-100%)}100%{transform:translateX(100vw)}}
    @keyframes qs-ticker{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}
    @keyframes qs-flash{0%,100%{opacity:1}50%{opacity:.35}}
    .qs-bolt-span{position:absolute;top:50%;transform:translateY(-50%);font-size:22px;animation:qs-bolt linear infinite;white-space:nowrap}
    .qs-ticker-inner{display:inline-block;white-space:nowrap;animation:qs-ticker 22s linear infinite}
  `;
  document.head.appendChild(st);
}

function QueueScreen() {
  const app = useApp();
  const [list, setList] = React.useState(() => SEED_QUEUE.map((x) => ({ ...x })));
  const [slide, setSlide] = React.useState(0);
  const [flash, setFlash] = React.useState(false);
  const [radioOn, setRadioOn] = React.useState(false);
  const audioRef = React.useRef(null);

  const sortWaiting = (arr) => [...arr].sort((a, b) => (a.type === b.type ? 0 : a.type === 'PT' ? -1 : 1));
  const served = list.find((x) => x.state === 'in_corso');
  const waiting = sortWaiting(list.filter((x) => x.state === 'attesa'));
  const isPT = served?.type === 'PT';

  // queue polling every 4.5s
  React.useEffect(() => {
    const t = setInterval(() => {
      setFlash(true); setTimeout(() => setFlash(false), 700);
      setList((prev) => {
        const arr = prev.filter((x) => x.state !== 'in_corso');
        const w = sortWaiting(arr.filter((x) => x.state === 'attesa'));
        if (w.length === 0) return SEED_QUEUE.map((x) => ({ ...x }));
        return arr.map((x) => (x.code === w[0].code ? { ...x, state: 'in_corso' } : x));
      });
    }, 4500);
    return () => clearInterval(t);
  }, []);

  // Vetrina360 slide rotation every 8s
  React.useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % 3), 8000);
    return () => clearInterval(t);
  }, []);

  // TTS — legge il numero in italiano
  const speakNumber = (code) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const digits = code.replace(/(\w+)-(\d+)/, (_, type, num) =>
      `${type === 'PT' ? 'Priority' : 'Walk-in'} ${num.split('').join(' zero').replace(/^/, 'zero ')}`
        .replace('zero P', 'P').replace('zero W', 'W')
    );
    const utter = new SpeechSynthesisUtterance(
      `Numero ${code.replace('-', ' ')}, prego accomodarsi alla cassa`
    );
    utter.lang = 'it-IT'; utter.rate = 0.92; utter.pitch = 1;
    const voices = speechSynthesis.getVoices();
    const itVoice = voices.find(v => v.lang.startsWith('it'));
    if (itVoice) utter.voice = itVoice;
    window.speechSynthesis.speak(utter);
  };

  // Radio toggle
  const toggleRadio = () => {
    if (!audioRef.current) return;
    if (radioOn) { audioRef.current.pause(); setRadioOn(false); }
    else { audioRef.current.play().catch(() => {}); setRadioOn(true); }
  };

  // Vetrina360 slides content
  const slides = [
    // Slide 0 — image-slot (promo)
    <div key="s0" className="absolute inset-0 flex flex-col">
      <image-slot id="mrphone-spot-1" style={{ width: '100%', flex: 1, display: 'block' }} shape="rect" fit="cover" placeholder="Spot promo — trascina un'immagine" />
      <div className="absolute bottom-14 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent z-10">
        <p className="text-white font-black text-[16px]">Spazio promo del negozio</p>
        <p className="text-white/70 text-[12px] font-bold">Pellicole · cover · usato garantito · Vetrina360</p>
      </div>
    </div>,

    // Slide 1 — YouTube embed (Umbria Energy spot)
    <div key="s1" className="absolute inset-0 bg-black flex flex-col items-center justify-center">
      <iframe
        src="https://www.youtube.com/embed/MWop5sYrdY0?autoplay=1&mute=1&loop=1&playlist=MWop5sYrdY0&controls=0&modestbranding=1"
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{ width: '100%', height: '100%', border: 'none', position: 'absolute', inset: 0 }}
        title="Be Green Be Umbria Energy"
      />
      <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-black uppercase tracking-widest">
        Partner spot
      </div>
    </div>,

    // Slide 2 — Express promo (rosso + fulmini)
    <div key="s2" className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg,#C62828,#E53935)' }}>
      {/* bolt rain */}
      {[0,1,2,3,4].map(i => (
        <span key={i} className="qs-bolt-span" style={{ animationDuration: `${1.2 + i * 0.4}s`, animationDelay: `${i * 0.25}s`, top: `${15 + i * 16}%` }}>
          ⚡⚡⚡
        </span>
      ))}
      <div className="relative z-10 text-center px-6">
        <p className="text-white/80 font-black text-[13px] uppercase tracking-[0.2em] mb-3">MrPhone · Via Roma 14</p>
        <p className="text-white font-black leading-[1.0]" style={{ fontSize: 'clamp(28px,5vw,48px)', textShadow: '0 4px 20px rgba(0,0,0,.4)' }}>
          Riparazione Express ⚡
        </p>
        <p className="text-white font-black text-[26px] mt-2">Pronta in 30 min</p>
        <div className="mt-4 inline-block px-5 py-2 rounded-full bg-white/20 border-2 border-white/40 text-white font-black text-[14px]">
          🔧 RiparaSubito.tech
        </div>
      </div>
    </div>,
  ];

  // bolt strip shared style
  const boltStripStyle = {
    position: 'relative', overflow: 'hidden', height: 32,
    background: 'linear-gradient(90deg,#B71C1C,#E53935,#B71C1C)',
    display: 'flex', alignItems: 'center',
  };

  return (
    <div className="fixed inset-0 bg-slate-100 flex flex-col z-[60]">
      {/* hidden radio */}
      <audio ref={audioRef} src="https://radioitalia.leanstream.co/radioitalia" preload="none" loop />

      {/* top bar */}
      <div className="flex items-center justify-between px-7 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-4">
          <Logo size={24} />
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-[12px] font-bold text-ink-mute whitespace-nowrap">
            <Icon name="store" size={13} /> Via Roma 14 · Cassa 1
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-[12px] font-bold text-ink-faint">powered by RiparaSubito.tech</span>
          <Clock />
          <button onClick={() => app.nav('index')} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-ink-soft hover:bg-slate-200">
            <Icon name="x" size={18} />
          </button>
        </div>
      </div>

      {/* main grid */}
      <div className="flex-1 grid lg:grid-cols-5 gap-5 p-5 overflow-hidden">

        {/* LEFT — serving + queue */}
        <div className="lg:col-span-3 flex flex-col gap-5 min-h-0">
          {/* number card — click = TTS */}
          <button
            onClick={() => served && speakNumber(served.code)}
            className={`flex-1 rounded-[32px] flex flex-col items-center justify-center text-center transition-colors active:scale-[0.99] ${isPT ? 'bg-mr' : 'bg-ink'}`}
            style={{ minHeight: 220, cursor: served ? 'pointer' : 'default' }}
            title="Clicca per annuncio vocale"
          >
            <p className="text-[13px] font-black uppercase tracking-[0.2em] text-white/60 flex items-center gap-2">
              Stiamo servendo
              {served && <span className="text-[11px] opacity-50">🔊 tocca per annuncio</span>}
            </p>
            <p className={`font-black tracking-tight text-white leading-none ${flash ? 'rs-pop' : ''}`}
               style={{ fontSize: 'clamp(72px, 14vw, 150px)' }}>
              {served?.code || '—'}
            </p>
            <div className="mt-3 flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white font-bold text-[15px]">
              <Icon name={isPT ? 'zap' : 'store'} size={18} />
              {isPT ? 'Priority' : 'Walk-in'} · {served?.name}
            </div>
          </button>

          {/* waiting chips */}
          <div className="rounded-[28px] bg-white border border-slate-200 p-5">
            <p className="label-xs mb-3">In attesa · i Priority hanno la precedenza</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {waiting.slice(0, 4).map((x, i) => (
                <button key={x.code} onClick={() => speakNumber(x.code)}
                  className={`rounded-2xl p-3 text-center border-2 active:scale-95 transition ${x.type === 'PT' ? 'border-mr-light bg-mr-tint' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Icon name={x.type === 'PT' ? 'zap' : 'store'} size={13} style={{ color: x.type === 'PT' ? '#DC2626' : '#0F172A' }} />
                    <span className="text-[10px] font-black uppercase" style={{ color: x.type === 'PT' ? '#DC2626' : '#64748B' }}>{x.type}</span>
                  </div>
                  <p className="font-black text-[24px] tracking-tight leading-none" style={{ color: x.type === 'PT' ? '#DC2626' : '#0F172A' }}>{x.code}</p>
                  <p className="text-[11px] font-bold text-ink-faint mt-1">{i === 0 ? 'prossimo' : `${i + 1}º`}</p>
                </button>
              ))}
            </div>
          </div>

          {/* TICKER */}
          <div style={{ background: '#0F172A', borderRadius: 16, overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ padding: '8px 0', position: 'relative', overflow: 'hidden' }}>
              <span className="qs-ticker-inner" style={{ fontSize: 13, fontWeight: 800, color: '#fff', paddingLeft: '100%' }}>
                ⚡ Riparazione rapida come un fulmine &nbsp;·&nbsp; {waiting[0]?.code || 'WT-004'} in lavorazione &nbsp;·&nbsp; Tempo medio: 28 minuti &nbsp;·&nbsp; 🔧 RiparaSubito.tech &nbsp;·&nbsp; ⚡ Priority passa sempre prima &nbsp;·&nbsp; 📱 Salva la web app sul tuo telefono &nbsp;·&nbsp; 🌟 Garanzia 12 mesi su ogni ricambio &nbsp;·&nbsp;
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT — Vetrina360 panel (rosso) */}
        <div className="lg:col-span-2 rounded-[32px] relative overflow-hidden min-h-0 flex flex-col"
             style={{ background: '#E53935', minHeight: 220 }}>

          {/* slide dots */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {[0, 1, 2].map(i => (
              <button key={i} onClick={() => setSlide(i)}
                style={{ width: slide === i ? 20 : 7, height: 7, borderRadius: 4, background: slide === i ? '#fff' : 'rgba(255,255,255,.4)', border: 'none', cursor: 'pointer', transition: 'all .3s ease' }} />
            ))}
          </div>

          {/* radio button */}
          <button onClick={toggleRadio}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition"
            style={{ background: radioOn ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.2)', color: radioOn ? '#E53935' : '#fff' }}
            title={radioOn ? 'Ferma radio' : 'Avvia Radio Italia'}>
            <span style={{ fontSize: 14 }}>🎵</span>
          </button>

          {/* VETRINA360 LIVE badge */}
          <div className="absolute top-3 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-[11px] font-black text-ink z-10 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 rs-ping" /> VETRINA360 · LIVE
          </div>

          {/* slides */}
          <div className="relative flex-1" style={{ overflow: 'hidden' }}>
            {slides.map((sl, i) => (
              <div key={i} style={{ position: 'absolute', inset: 0, opacity: slide === i ? 1 : 0, transition: 'opacity .8s ease', pointerEvents: slide === i ? 'auto' : 'none' }}>
                {sl}
              </div>
            ))}
          </div>

          {/* ⚡ bolt strip animata */}
          <div style={boltStripStyle}>
            {[0,1,2,3].map(i => (
              <span key={i} className="qs-bolt-span"
                style={{ animationDuration: `${1.4 + i * 0.35}s`, animationDelay: `${i * 0.3}s`, top: '50%', fontSize: 18 }}>
                ⚡⚡⚡⚡⚡
              </span>
            ))}
            <span style={{ position: 'relative', zIndex: 2, width: '100%', textAlign: 'center', fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,.6)', letterSpacing: '.15em', textTransform: 'uppercase', pointerEvents: 'none' }}>
              Veloce come un fulmine · MrPhone
            </span>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="px-7 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-[12.5px] font-bold text-ink-mute">
        <span className="flex items-center gap-1.5">
          <Icon name="refresh" size={14} className="text-emerald-500" /> Aggiornamento automatico in tempo reale
        </span>
        <span className="flex items-center gap-1.5">
          <Icon name="list" size={14} /> {waiting.length} in attesa
          {radioOn && <span className="ml-3 text-emerald-600 flex items-center gap-1">🎵 Radio Italia ON</span>}
        </span>
      </div>
    </div>
  );
}

function Clock() {
  const [t, setT] = React.useState(new Date());
  React.useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  return <span className="font-black text-[18px] text-ink tabular-nums">{String(t.getHours()).padStart(2, '0')}:{String(t.getMinutes()).padStart(2, '0')}</span>;
}

// =================================================================
//  CHAT GIORGIA  (WhatsApp Business · risposte rapide · tools)
// =================================================================
function GiorgiaChat() {
  const app = useApp();
  const open = app.chatOpen;
  const [msgs, setMsgs] = React.useState([{ role: 'bot', text: GIORGIA_GREETING }]);
  const [input, setInput] = React.useState('');
  const [typing, setTyping] = React.useState(false);
  const scroller = React.useRef(null);

  React.useEffect(() => { scroller.current?.scrollTo({ top: 99999, behavior: 'smooth' }); }, [msgs, typing]);

  const push = (m) => setMsgs((x) => [...x, m]);
  const botSay = (text, tool) => {
    setTyping(true);
    setTimeout(() => { setTyping(false); push({ role: 'bot', text, tool }); }, 750);
  };

  const handleQuick = (q) => {
    push({ role: 'me', text: q.label.replace(/^[^\w]+/, '') });
    if (q.id === 'prezzo') botSay('Dimmi marca e problema (es. “iPhone 14 schermo”) e ti do una stima. Per un iPhone lo schermo parte da ~49€, lo confermiamo con diagnosi gratuita.', 'calcola_prezzo');
    else if (q.id === 'coda') {
      botSay('Fatto! Ti ho messo in coda walk-in. Il tuo numero è WT-006, ci sono 3 persone davanti. Ti avviso su WhatsApp quando è quasi il tuo turno.', 'prenota_coda');
      app.notifyMarco('chat-lead');
    } else if (q.id === 'orari') botSay('Siamo in Via Roma 14, aperti 9:30–13 / 15:30–19:30, dal lunedì al sabato. Vuoi che ti prenoti un posto?');
    else if (q.id === 'lead') { botSay('Perfetto, lasciami il numero e un tecnico ti richiama entro 30 minuti. Ho già salvato la richiesta.', 'salva_lead'); app.notifyMarco('chat-lead'); }
  };

  const send = () => {
    const t = input.trim(); if (!t) return;
    push({ role: 'me', text: t }); setInput('');
    botSay('Grazie! Un attimo che controllo… Intanto puoi usare i pulsanti rapidi qui sotto per un preventivo o per metterti in coda.');
  };

  return (
    <>
      {/* FAB — offset above BottomNav when visible */}
      {!open && (
        <button onClick={() => app.setChatOpen(true)} className="absolute right-5 z-40 flex items-center gap-2.5 pl-4 pr-5 py-3.5 rounded-full text-white shadow-2xl active:scale-95 transition" style={{ background: '#16A34A', bottom: SHOW_BN_SCREENS.has(app.screen) ? 76 : 20 }}>
          <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-white/20"><Icon name="message" size={17} /><span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-mr border-2 border-white" /></span>
          <span className="font-extrabold text-[14px]">Giorgia</span>
        </button>
      )}

      {/* sheet */}
      <div className={`absolute inset-0 z-50 transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/30 transition-opacity" style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }} onClick={() => app.setChatOpen(false)} />
        <div className="absolute inset-x-0 bottom-0 top-10 bg-[#ECE5DD] rounded-t-3xl flex flex-col overflow-hidden shadow-2xl transition-transform duration-300" style={{ transform: open ? 'translateY(0)' : 'translateY(100%)' }}>
          {/* header */}
          <div className="flex items-center gap-3 px-4 py-3 text-white" style={{ background: '#075E54' }}>
            <button onClick={() => app.setChatOpen(false)} className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center hover:bg-white/10"><Icon name="chevron-down" size={22} /></button>
            <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black">G</span>
            <div className="flex-1">
              <p className="font-black text-[15px] leading-tight">Giorgia · MrPhone</p>
              <p className="text-[11.5px] text-white/70 font-semibold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> WhatsApp Business · online</p>
            </div>
            <Icon name="headset" size={20} className="text-white/70" />
          </div>

          {/* messages */}
          <div ref={scroller} className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-4 space-y-2.5" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.025) 1px, transparent 1px)', backgroundSize: '18px 18px' }}>
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[14px] font-medium leading-snug shadow-sm ${m.role === 'me' ? 'bg-[#DCF8C6] text-ink rounded-tr-sm' : 'bg-white text-ink rounded-tl-sm'}`}>
                  {m.tool && <span className="flex items-center gap-1.5 text-[11px] font-black text-emerald-600 mb-1 uppercase tracking-wide"><Icon name="settings" size={12} /> tool · {m.tool}</span>}
                  {m.text}
                </div>
              </div>
            ))}
            {typing && <div className="flex justify-start"><div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex gap-1"><Dot /><Dot d={0.15} /><Dot d={0.3} /></div></div>}
          </div>

          {/* quick replies */}
          <div className="px-3 pt-2.5 flex gap-2 overflow-x-auto no-scrollbar bg-[#ECE5DD]">
            {GIORGIA_QUICK.map((q) => (
              <button key={q.id} onClick={() => handleQuick(q)} className="flex-shrink-0 px-3.5 py-2 rounded-full bg-white border border-emerald-200 text-[12.5px] font-bold text-emerald-700 active:scale-95 transition">{q.label}</button>
            ))}
          </div>

          {/* input */}
          <div className="p-2.5 bg-[#ECE5DD] flex items-center gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Scrivi un messaggio…" className="flex-1 bg-white rounded-full px-4 py-3 text-[14px] font-medium outline-none" />
            <button onClick={send} className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: '#16A34A' }}><Icon name="send" size={19} /></button>
          </div>
        </div>
      </div>
    </>
  );
}
function Dot({ d = 0 }) { return <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${d}s` }} />; }

// =================================================================
//  VISTA MARCO — Repair360 full gestionale (4 tab)
// =================================================================
const MARCO_TICKETS_DATA = [
  { code:'RP-0049', sub:'Schermo Rotto', device:'OPPO Realme a94', client:'Marco P.', phone:'393 5928069', price:'€154', stato:3, date:'12 feb · 11:43' },
  { code:'RP-0048', sub:'Batteria scarica', device:'iPhone 13',       client:'Laura B.',  phone:'335 1234567', price:'€59',  stato:2, date:'12 feb · 10:15' },
  { code:'RP-0047', sub:'Non Carica',       device:'Samsung S23',     client:'Giulio M.', phone:'347 9876543', price:'€45',  stato:4, date:'11 feb · 16:40' },
  { code:'RP-0046', sub:'Fotocamera rotta', device:'Xiaomi 13T',      client:'Sara C.',   phone:'329 1111222', price:'€49',  stato:1, date:'11 feb · 14:22' },
];
const MARCO_STATI = ['Ricevuto','Diagnosi','In Lavorazione','Pezzi Arrivo','Pronto','Consegnato'];
const MARCO_STATI_COLORS = ['#EF4444','#3B82F6','#3B82F6','#F97316','#10B981','#0F172A'];
const MARCO_STATI_ICONS = ['package','search','wrench','package','check-circle','logout'];

const MARCO_EVENTS = {
  idle:    { tag:'In attesa',           text:'Nessuna attivita. Banco libero.',                             tone:'slate', icon:'store'  },
  verified:{ tag:'Cliente identificato',text:'Mario Rossi ha verificato il numero +39 333 1234567.',        tone:'green', icon:'user'   },
  quote:   { tag:'Preventivo richiesto',text:'Mario Rossi · iPhone 14 Pro · Schermo. In attesa prezzo.',   tone:'amber', icon:'list'   },
  ticket:  { tag:'Nuovo ticket',        text:'PT-014 creato. Priority: precede i walk-in.',                 tone:'red',   icon:'zap'    },
  'chat-lead':{ tag:'Lead da Giorgia',  text:'Richiesta dal bot WhatsApp. Cliente da richiamare.',          tone:'green', icon:'message'},
};

function MarcoPanel() {
  const app = useApp();
  const open = app.marcoOpen;
  const [activeTab, setActiveTab] = React.useState('operativo');
  const [selTk, setSelTk] = React.useState(0);
  const [tks, setTks] = React.useState(MARCO_TICKETS_DATA.map(t => ({ ...t })));
  const ev = MARCO_EVENTS[app.marcoEvent || 'idle'];
  const toneBg = { slate:'rgba(255,255,255,.06)', green:'rgba(22,163,74,.12)', amber:'rgba(245,158,11,.12)', red:'rgba(220,38,38,.12)' }[ev.tone];
  const toneFg = { slate:'#94A3B8', green:'#4ADE80', amber:'#FCD34D', red:'#F87171' }[ev.tone];

  const changeStato = (tkIdx, statoIdx) => {
    setTks(prev => prev.map((t, i) => i === tkIdx ? { ...t, stato: statoIdx } : t));
    if (tkIdx === selTk) setSelTk(selTk);
  };

  const tk = tks[selTk];

  const Tab = ({ id, label }) => (
    <button onClick={() => setActiveTab(id)}
      className="flex-1 py-2 text-[12px] font-bold rounded-lg transition"
      style={{ background: activeTab === id ? 'rgba(255,255,255,.1)' : 'transparent', color: activeTab === id ? '#fff' : 'rgba(255,255,255,.4)' }}>
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-[70] transition" style={{ pointerEvents: open ? 'auto' : 'none' }}>
      <div className="absolute inset-0 bg-ink/50 transition-opacity" style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }} onClick={() => app.setMarcoOpen(false)} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-[520px] flex flex-col transition-transform duration-300" style={{ transform: open ? 'translateX(0)' : 'translateX(100%)', background: '#0D1117', borderLeft: '1px solid rgba(255,255,255,.08)' }}>

        {/* Header */}
        <div style={{ background: '#111827', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 40, height: 40, borderRadius: 12, background: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="wrench" size={18} className="text-white" /></span>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 900, fontSize: 14, color: 'white', lineHeight: 1.2 }}>Marco 360° · Gestionale</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', fontWeight: 600 }}>MrPhone · Repair360</p>
          </div>
          <button onClick={() => app.setMarcoOpen(false)} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="x" size={16} className="text-white" />
          </button>
        </div>

        {/* Live event */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,.07)', background: toneBg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: toneFg + '25', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={ev.icon} size={14} style={{ color: toneFg }} /></span>
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: toneFg }}>{ev.tag}</span>
            <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.3)', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />live</span>
          </div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.8)', lineHeight: 1.4 }}>{ev.text}</p>
        </div>

        {/* Tabs */}
        <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,.07)', display: 'flex', gap: 2, background: 'rgba(255,255,255,.02)' }}>
          <Tab id="operativo" label="✦ Operativo" />
          <Tab id="clienti"   label="👥 Clienti" />
          <Tab id="lab"       label="🔧 Lab" />
          <Tab id="cal"       label="📅 Slot" />
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* OPERATIVO */}
          {activeTab === 'operativo' && (
            <div>
              {tks.map((t, i) => (
                <button key={t.code} onClick={() => setSelTk(i)} style={{ width: '100%', textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,.05)', background: i === selTk ? 'rgba(220,38,38,.08)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, border: 'none' }}>
                  <span style={{ width: 36, height: 36, borderRadius: 10, background: MARCO_STATI_COLORS[t.stato] + '25', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={MARCO_STATI_ICONS[t.stato]} size={16} style={{ color: MARCO_STATI_COLORS[t.stato] }} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 900, color: 'white' }}>{t.code}</span>
                      <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 100, background: MARCO_STATI_COLORS[t.stato] + '25', color: MARCO_STATI_COLORS[t.stato] }}>{MARCO_STATI[t.stato]}</span>
                    </div>
                    <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,.4)', fontWeight: 600, margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.device} · {t.sub}</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,.6)', flexShrink: 0 }}>{t.price}</span>
                </button>
              ))}

              {/* Selected ticket detail */}
              {tk && (
                <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,.07)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color: 'white' }}>{tk.code}</span>
                    <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 100, background: MARCO_STATI_COLORS[tk.stato] + '25', color: MARCO_STATI_COLORS[tk.stato] }}>{MARCO_STATI[tk.stato]}</span>
                  </div>
                  {/* Progress */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
                    {MARCO_STATI.map((s, i) => (
                      <React.Fragment key={s}>
                        {i > 0 && <div style={{ flex: 1, height: 2, background: i <= tk.stato ? MARCO_STATI_COLORS[i] : 'rgba(255,255,255,.08)' }} />}
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: i < tk.stato ? '#10B981' : i === tk.stato ? MARCO_STATI_COLORS[i] : 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', flexShrink: 0, fontWeight: 900 }}>
                          {i < tk.stato ? '✓' : i === tk.stato ? '●' : ''}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  {/* Cliente */}
                  <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '12px 14px', marginBottom: 12, border: '1px solid rgba(255,255,255,.06)' }}>
                    <p style={{ fontSize: 15, fontWeight: 900, color: 'white', margin: '0 0 2px' }}>{tk.client}</p>
                    <p style={{ fontSize: 13, color: '#DC2626', fontWeight: 700, margin: '0 0 10px' }}>{tk.phone}</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={{ background: '#16A34A', color: 'white', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>💬 WhatsApp</button>
                      <button style={{ background: 'rgba(255,255,255,.08)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>📞 Chiama</button>
                    </div>
                  </div>
                  {/* Cambia stato */}
                  <p style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Cambia Stato</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {MARCO_STATI.map((s, i) => (
                      <button key={s} onClick={() => changeStato(selTk, i)}
                        style={{ padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 800, textAlign: 'left', background: i === tk.stato ? MARCO_STATI_COLORS[i] : 'rgba(255,255,255,.05)', color: i === tk.stato ? 'white' : 'rgba(255,255,255,.5)', transition: 'all .15s ease' }}>
                        {s} {i === tk.stato && '✓'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CLIENTI */}
          {activeTab === 'clienti' && (
            <div style={{ padding: 14 }}>
              <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Icon name="search" size={15} style={{ color: 'rgba(255,255,255,.4)' }} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.3)', fontWeight: 500 }}>Cerca cliente…</span>
              </div>
              {[{n:'Mario Rossi',p:'+39 333 1234567',v:4,s:'€282',a:'MR',c:'#DC2626'},{n:'Laura Bianchi',p:'+39 335 9876543',v:2,s:'€118',a:'LB',c:'#7C3AED'},{n:'Giulio Manzoni',p:'+39 347 5551234',v:8,s:'€540',a:'GM',c:'#0891B2'}].map(cl => (
                <div key={cl.n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 4px', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: cl.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: 'white', flexShrink: 0 }}>{cl.a}</div>
                  <div style={{ flex: 1 }}><p style={{ fontWeight: 800, fontSize: 14, color: 'white', margin: '0 0 2px' }}>{cl.n}</p><p style={{ fontSize: 11.5, color: 'rgba(255,255,255,.4)', fontWeight: 600, margin: 0 }}>{cl.p}</p></div>
                  <div style={{ textAlign: 'right' }}><p style={{ fontWeight: 900, fontSize: 15, color: 'white', margin: '0 0 2px' }}>{cl.s}</p><p style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', fontWeight: 600, margin: 0 }}>{cl.v} visite</p></div>
                </div>
              ))}
            </div>
          )}

          {/* LABORATORIO */}
          {activeTab === 'lab' && (
            <div style={{ padding: 14 }}>
              {[['Ricevuto',0,'#EF4444'],['In Diagnosi',1,'#3B82F6'],['In Lav.',2,'#F97316'],['Pronto',4,'#10B981']].map(([col, statoFilter, color]) => {
                const items = tks.filter(t => t.stato === statoFilter);
                return (
                  <div key={col} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'rgba(255,255,255,.5)' }}>{col}</span>
                      <span style={{ background: 'rgba(255,255,255,.08)', padding: '1px 7px', borderRadius: 8, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.5)' }}>{items.length}</span>
                    </div>
                    {items.map(t => (
                      <div key={t.code} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, padding: '10px 12px', marginBottom: 6 }}>
                        <p style={{ fontSize: 12.5, fontWeight: 800, color: 'white', margin: '0 0 2px' }}>{t.code} · {t.device}</p>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', fontWeight: 600, margin: 0 }}>{t.sub} · {t.price}</p>
                      </div>
                    ))}
                    {items.length === 0 && <p style={{ fontSize: 12, color: 'rgba(255,255,255,.2)', fontWeight: 600, textAlign: 'center', padding: '12px 0' }}>Nessun ticket</p>}
                  </div>
                );
              })}
            </div>
          )}

          {/* CALENDARIO */}
          {activeTab === 'cal' && (
            <div style={{ padding: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Slot questa settimana</p>
              {['Lun 16','Mar 17','Mer 18','Gio 19','Ven 20'].map((day, di) => {
                const slots = [['9:30',di===0||di===2],['11:30',di===1],['14:30',di===3],['16:30',di===0||di===4]];
                return (
                  <div key={day} style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 11.5, fontWeight: 800, color: 'rgba(255,255,255,.5)', marginBottom: 6 }}>{day}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {slots.map(([h, booked]) => (
                        <span key={h} style={{ padding: '5px 10px', borderRadius: 8, fontSize: 11.5, fontWeight: 700, background: booked ? 'rgba(220,38,38,.2)' : 'rgba(16,185,129,.15)', color: booked ? '#F87171' : '#4ADE80', border: booked ? '1px solid rgba(220,38,38,.3)' : '1px solid rgba(16,185,129,.3)' }}>
                          {h} {booked ? '●' : '+'}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
        <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,.07)', textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.2)' }}>
          Sincronizzato live · Base44 · Telnyx
        </div>
      </aside>
    </div>
  );
}

// =================================================================
//  BLUEPRINT SERVIZIO — architettura visuale ecosistema
// =================================================================
function BlueprintScreen() {
  const app = useApp();

  const Node = ({ label, sub, color, icon }) => (
    <div className="rounded-2xl border-2 flex flex-col items-center justify-center text-center p-2.5 gap-1"
      style={{ borderColor: color + '50', background: color + '18', minHeight: 68 }}>
      <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ background: color }}><Icon name={icon} size={14} /></span>
      <p className="font-extrabold text-[11px] text-ink leading-tight">{label}</p>
      {sub && <p className="text-[9.5px] text-ink-faint font-bold leading-tight">{sub}</p>}
    </div>
  );
  const Arrow = () => (
    <div className="flex justify-center my-1.5">
      <div className="flex flex-col items-center"><div className="w-px h-3 bg-slate-300" /><span className="text-slate-400 text-[10px] leading-none">&#9660;</span></div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Blueprint servizio" sub="Architettura RiparaSubito.tech" onBack={() => app.nav('index')} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-10">

        <div className="rounded-3xl bg-ink text-white p-5 mb-4 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-6 opacity-10"><Icon name="settings" size={110} /></div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-lg bg-mr text-white text-[11px] font-black">Piattaforma SaaS</span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/80 text-[11px] font-black">Multi-tenant</span>
          </div>
          <p className="text-[22px] font-black leading-tight">RiparaSubito.tech</p>
          <p className="text-[12.5px] text-white/70 font-semibold mt-1">Ogni PMI &egrave; un tenant isolato. MrPhone &egrave; il tenant pilota.</p>
        </div>

        <p className="label-xs px-1 mb-2">Canali di accesso cliente</p>
        <div className="grid grid-cols-4 gap-2 mb-1">
          <Node label="PWA Mobile" sub="iOS · Android" color="#DC2626" icon="smartphone" />
          <Node label="Tablet banco" sub="Repair360" color="#0F172A" icon="store" />
          <Node label="PC Shopify" sub="Standalone" color="#7C3AED" icon="package" />
          <Node label="TV Vetrina360" sub="Signage" color="#F97316" icon="list" />
        </div>
        <Arrow />

        <p className="label-xs px-1 mb-2">Identita &amp; messaggi</p>
        <div className="grid grid-cols-4 gap-2 mb-1">
          <Node label="OTP SMS" sub="Telnyx" color="#0EA5E9" icon="shield-check" />
          <Node label="Voice AI" sub="Telnyx" color="#0EA5E9" icon="headset" />
          <Node label="WhatsApp" sub="WABA" color="#16A34A" icon="message" />
          <Node label="Notifiche" sub="Telnyx" color="#16A34A" icon="bell" />
        </div>
        <Arrow />

        <p className="label-xs px-1 mb-2">Core platform — Base44</p>
        <div className="grid grid-cols-3 gap-2 mb-1">
          <Node label="Giorgia AI" sub="booking · lead" color="#7C3AED" icon="sparkles" />
          <Node label="Repair360" sub="ticket · coda" color="#DC2626" icon="wrench" />
          <Node label="Marco" sub="gestionale" color="#2563EB" icon="user" />
        </div>
        <Arrow />

        <p className="label-xs px-1 mb-2">Integrazioni e memoria di servizio</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Node label="Google Cal" sub="Workspace" color="#4285F4" icon="calendar" />
          <Node label="PayPal" sub="Dep. · Pay3" color="#003087" icon="shield-check" />
          <Node label="Shopify" sub="Catalogo" color="#96BF48" icon="package" />
        </div>

        <p className="label-xs px-1 mb-2">Tenant attivi sulla piattaforma</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[['MrPhone Pilota', '#DC2626'], ['PMI Milano', '#0F172A'], ['TechFix Roma', '#7C3AED'], ['+ Aggiungi', '#94A3B8']].map(([l, c]) => (
            <span key={l} className="px-3 py-1.5 rounded-xl border-2 text-[12px] font-extrabold" style={{ borderColor: c + '40', color: c, background: c + '12' }}>{l}</span>
          ))}
        </div>

        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5 flex gap-2.5">
          <Icon name="lock" size={17} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[12.5px] text-amber-800 font-semibold leading-relaxed">Chiavi API (Telnyx, Vetrina360, PayPal, Google) <span className="font-black">mai nel client</span> — solo server-side quando converti in Liquid.</p>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { QueueScreen, GiorgiaChat, MarcoPanel, BlueprintScreen });
