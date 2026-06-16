/* ============================================================
   MrPhone — Repair360  ·  Schermate aggiuntive
   QRCode · SlotPicker (Google Cal) · PayScreen · NotificheScreen
   ============================================================ */

// ---- QR Code — deterministic SVG dal codice ticket ----
function QRCode({ value = 'PT-014', size = 150 }) {
  const N = 21;
  const cell = size / N;
  const seed = Array.from(value).reduce((a, c) => (Math.imul(31, a) + c.charCodeAt(0)) | 0, 0);
  const inFinder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= N - 7) || (r >= N - 7 && c < 7);
  const finderDark = (r, c) => {
    const fr = r >= N - 7 ? r - (N - 7) : r;
    const fc = c >= N - 7 ? c - (N - 7) : c;
    if (fr === 0 || fr === 6 || fc === 0 || fc === 6) return true;
    if (fr >= 2 && fr <= 4 && fc >= 2 && fc <= 4) return true;
    return false;
  };
  const isDark = (r, c) => inFinder(r, c) ? finderDark(r, c) : ((seed >> ((r * N + c) % 31)) & 1) === 1;
  const cells = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (isDark(r, c)) cells.push([r, c]);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" rx="8" />
      {cells.map(([r, c]) => <rect key={`${r}${c}`} x={c * cell + 1} y={r * cell + 1} width={cell - 1} height={cell - 1} fill="#0F172A" rx="1" />)}
    </svg>
  );
}

// ---- Slot Picker (Google Calendar style) ----
const SLOT_DAYS = [
  { s: 'Lun', d: 16, m: 'Giu' }, { s: 'Mar', d: 17, m: 'Giu' },
  { s: 'Mer', d: 18, m: 'Giu' }, { s: 'Gio', d: 19, m: 'Giu' },
  { s: 'Ven', d: 20, m: 'Giu' },
];
const SLOT_TIMES = [
  { id: 'mat', label: 'Mattina', time: '9:30–13:00', icon: 'zap' },
  { id: 'pom', label: 'Pomeriggio', time: '15:30–18:30', icon: 'clock' },
  { id: 'ser', label: 'Tardo pom.', time: '18:30–19:30', icon: 'bell' },
];
const SLOT_FULL = new Set(['1-0', '3-1', '0-2']);

function SlotPickerScreen() {
  const app = useApp();
  const [sel, setSel] = React.useState(null);

  const confirm = () => {
    if (!sel) return;
    const [di, ti] = sel.split('-').map(Number);
    const day = SLOT_DAYS[di]; const time = SLOT_TIMES[ti];
    app.set({ slot: { day: `${day.s} ${day.d} ${day.m}`, time: time.time, label: time.label } });
    app.nav('confirm');
  };

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Scegli il tuo slot" sub="Sincronizzato con Google Calendar" onBack={() => app.nav('tickettype')} />
      <div className="flex-1 overflow-y-auto no-scrollbar pb-28">
        <div className="px-4 pt-3">
          {/* Google Cal badge */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-50 border border-blue-200 mb-4">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#4285F4' }}><Icon name="calendar" size={17} className="text-white" /></span>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-[13.5px] text-ink leading-tight">Google Calendar · MrPhone</p>
              <p className="text-[11.5px] text-blue-600 font-bold flex items-center gap-1.5 mt-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Disponibilità in tempo reale · Google Workspace</p>
            </div>
          </div>

          {/* day headers */}
          <div className="grid grid-cols-5 gap-1 mb-4">
            {SLOT_DAYS.map((d, i) => (
              <div key={i} className="text-center">
                <p className="text-[10px] font-bold text-ink-faint uppercase">{d.s}</p>
                <div className="w-8 h-8 rounded-full mx-auto flex items-center justify-center" style={{ background: i === 0 ? '#DC2626' : 'transparent' }}>
                  <p className="text-[17px] font-black leading-none" style={{ color: i === 0 ? '#fff' : '#0F172A' }}>{d.d}</p>
                </div>
                <p className="text-[10px] font-semibold text-ink-faint">{d.m}</p>
              </div>
            ))}
          </div>

          {/* slot rows */}
          <div className="space-y-4">
            {SLOT_TIMES.map((sl, ti) => (
              <div key={sl.id}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-ink-mute flex items-center justify-center flex-shrink-0"><Icon name={sl.icon} size={13} /></span>
                  <p className="text-[12px] font-extrabold text-ink-soft uppercase tracking-wide">{sl.label}</p>
                  <span className="ml-auto text-[11px] font-bold text-ink-faint">{sl.time}</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {SLOT_DAYS.map((_, di) => {
                    const key = `${di}-${ti}`;
                    const full = SLOT_FULL.has(key);
                    const on = sel === key;
                    return (
                      <button key={di} disabled={full} onClick={() => setSel(on ? null : key)}
                        className="h-[44px] rounded-xl text-[11.5px] font-bold transition"
                        style={{ background: full ? '#F8FAFC' : on ? '#DC2626' : '#fff', color: full ? '#CBD5E1' : on ? '#fff' : '#334155', border: `2px solid ${full ? '#F1F5F9' : on ? '#DC2626' : '#E2E8F0'}` }}>
                        {full ? '×' : on ? '✓' : '○'}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {sel && (
            <div className="mt-5 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex gap-3 rs-pop">
              <Icon name="check-circle" size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                {(() => {
                  const [di, ti] = sel.split('-').map(Number);
                  const d = SLOT_DAYS[di]; const sl = SLOT_TIMES[ti];
                  return (<>
                    <p className="font-black text-[14.5px] text-emerald-800 leading-tight">Slot selezionato</p>
                    <p className="text-[13px] text-emerald-700 font-semibold mt-0.5">{d.s} {d.d} {d.m} · {sl.label} · {sl.time}</p>
                    <p className="text-[12px] text-emerald-600 font-bold mt-1 flex items-center gap-1.5"><Icon name="message" size={13} /> Conferma via SMS (Telnyx) + WhatsApp</p>
                  </>);
                })()}
              </div>
            </div>
          )}

          <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-3.5 flex gap-2.5">
            <Icon name="info" size={16} className="text-ink-faint flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-ink-soft font-semibold leading-relaxed">Lo slot riserva la tua fascia oraria e azzera l'attesa. Puoi venire anche walk-in, ma avrai la coda normale.</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-7 pt-3 bg-white border-t border-slate-100 space-y-2">
        <Btn variant="primary" iconRight="arrow-right" disabled={!sel} onClick={confirm}>Conferma appuntamento</Btn>
        <button onClick={() => app.nav('confirm')} className="w-full py-2 text-center text-[13.5px] font-bold text-ink-mute hover:text-ink transition">Salta · vengo senza prenotazione</button>
      </div>
    </div>
  );
}

// ---- Pagamento al ritiro ----
function PayScreen() {
  const app = useApp();
  const t = app.data.ticket || SEED_TICKETS[0];
  const q = app.data.quote || DEMO_QUOTE;
  const tier = QUALITY_TIERS.find(x => x.id === (q.tier || 'premium')) || QUALITY_TIERS[1];
  const prob = PROBLEMS.find(p => p.id === (q.problem || 'schermo')) || PROBLEMS[0];
  const base = Math.max(prob.from, tier.from);
  const deposit = t.deposit ? 10 : 0;
  const total = base - deposit;
  const [method, setMethod] = React.useState('pos');
  const [paying, setPaying] = React.useState(false);
  const [paid, setPaid] = React.useState(false);

  const pay = () => { setPaying(true); setTimeout(() => { setPaying(false); setPaid(true); }, 1300); };

  if (paid) return (
    <div className="flex flex-col h-full items-center justify-center px-8 text-center bg-gradient-to-b from-emerald-50 to-white">
      <span className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-5 rs-pop"><Icon name="check" size={40} strokeWidth={3} /></span>
      <h1 className="text-[28px] font-black text-ink tracking-tight">Pagamento ricevuto!</h1>
      <p className="mt-2 text-[15px] text-ink-mute font-medium">Grazie {app.data.customer?.nome || 'Mario'}. Buon uso!</p>
      <div className="mt-5 w-full card p-5 text-left">
        <p className="font-black text-[15px] text-ink mb-3">Ricevuta · {t.code}</p>
        <div className="space-y-2 text-[13.5px]">
          <div className="flex justify-between"><span className="text-ink-mute font-semibold">{tier.label} · {prob.label}</span><span className="font-bold text-ink">{base}€</span></div>
          {deposit > 0 && <div className="flex justify-between text-emerald-700 font-semibold"><span>Deposito già versato</span><span>-{deposit}€</span></div>}
          <div className="flex justify-between border-t border-slate-100 pt-2"><span className="font-black text-ink">Totale pagato</span><span className="font-black text-[18px] text-ink">{total}€</span></div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[12px] text-ink-faint font-bold">
          <Icon name="shield-check" size={13} className="text-emerald-500" /> Garanzia {tier.warranty} · Ricevuta su WhatsApp (Telnyx)
        </div>
      </div>
      <div className="mt-5 w-full"><Btn variant="primary" icon="home" onClick={() => app.nav(app.data.isExisting ? 'home' : 'home-new')}>Torna alla home</Btn></div>
    </div>
  );

  const methods = [
    { id: 'contanti', label: 'Contanti', icon: 'package', sub: 'Paghi al banco al ritiro' },
    { id: 'pos', label: 'POS / Carta', icon: 'shield-check', sub: 'Contactless o chip' },
    { id: 'paypal3', label: 'PayPal Pay in 3', icon: 'calendar', sub: `3 rate da ${Math.ceil(total / 3)}€ · zero interessi` },
  ];

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Pagamento al ritiro" sub={`${t.code} · ${t.device || 'iPhone 14 Pro'}`} onBack={() => app.nav('repair')} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-4 space-y-4">
        {/* receipt */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0"><Icon name="check-circle" size={22} /></span>
            <div><p className="font-black text-[15.5px] text-ink leading-tight">Pronto per il ritiro!</p><p className="text-[12.5px] text-ink-mute font-bold">{t.device || 'iPhone 14 Pro'} · {prob.label}</p></div>
          </div>
          <div className="space-y-2.5 text-[14px] border-t border-slate-100 pt-4">
            <div className="flex justify-between"><span className="text-ink-mute font-semibold">{tier.label}</span><span className="font-bold text-ink">{base}€</span></div>
            {deposit > 0 && <div className="flex justify-between text-emerald-700 font-semibold"><span>Deposito già versato</span><span>-{deposit}€</span></div>}
            <div className="flex justify-between pt-2.5 border-t border-dashed border-slate-200 items-center">
              <span className="font-black text-[16px] text-ink">Da pagare ora</span>
              <span className="font-black text-[26px] text-ink">{total}€</span>
            </div>
          </div>
        </div>

        {/* method */}
        <div>
          <p className="label-xs px-1 mb-2.5">Metodo di pagamento</p>
          <div className="space-y-2.5">
            {methods.map(m => {
              const on = method === m.id;
              return (
                <button key={m.id} onClick={() => setMethod(m.id)} className={`w-full flex items-center gap-3.5 p-4 rounded-2xl border-2 text-left transition ${on ? 'border-mr bg-mr-tint' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <span className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${on ? 'bg-mr text-white' : 'bg-slate-100 text-ink-soft'}`}><Icon name={m.icon} size={20} /></span>
                  <div className="flex-1"><p className="font-extrabold text-[15px] text-ink leading-tight">{m.label}</p><p className="text-[12.5px] text-ink-mute font-semibold">{m.sub}</p></div>
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${on ? 'border-mr bg-mr' : 'border-slate-300'}`}>{on && <Icon name="check" size={12} className="text-white" strokeWidth={3} />}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 flex gap-2.5">
          <Icon name="shield-check" size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-[12.5px] text-ink-soft font-semibold leading-relaxed">Garanzia <span className="font-black">{tier.warranty}</span> sul ricambio inclusa. Ricevuta digitale via WhatsApp.</p>
        </div>
      </div>

      <div className="px-6 pb-7 pt-3 bg-white border-t border-slate-100">
        {method === 'paypal3' ? (
          <button onClick={pay} disabled={paying} className="btn w-full rounded-2xl font-black text-[16px] text-[#003087] bg-[#FFC439] disabled:opacity-60">
            {paying ? <span className="w-5 h-5 rounded-full border-2 border-[#003087] border-t-transparent animate-spin" /> : <><span className="italic">Pay<span className="text-[#0070BA]">Pal</span></span> Pay in 3 · {Math.ceil(total / 3)}€/mese</>}
          </button>
        ) : (
          <Btn variant="primary" disabled={paying} onClick={pay}>
            {paying ? <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" /> : `Paga ${total}€ · ${method === 'contanti' ? 'Contanti' : 'POS'}`}
          </Btn>
        )}
      </div>
    </div>
  );
}

// ---- Notifiche Center ----
function NotificheScreen() {
  const app = useApp();
  const notifs = [
    { id: 1, icon: 'check-circle', tone: 'green', title: 'Pronto per il ritiro!', body: 'iPhone 14 Pro · PT-014 è pronto. Vieni in negozio quando vuoi.', time: 'Oggi 11:15', ch: 'WhatsApp', read: false, dest: 'payscreen' },
    { id: 2, icon: 'wrench',       tone: 'amber', title: 'Riparazione in corso',  body: 'Il tecnico ha iniziato la sostituzione schermo.',               time: 'Oggi 10:30', ch: 'SMS',       read: false, dest: 'repair'    },
    { id: 3, icon: 'search',       tone: 'blue',  title: 'Diagnosi completata',   body: 'Confermato: schermo rotto. Preventivo 89€. Procediamo?',         time: 'Oggi 09:48', ch: 'SMS',       read: true,  dest: 'repair'    },
    { id: 4, icon: 'package',      tone: 'slate', title: 'Dispositivo ricevuto',  body: 'iPhone 14 Pro preso in carico. Ti aggiorniamo a ogni passo.',     time: 'Oggi 09:24', ch: 'SMS',       read: true,  dest: 'repair'    },
    { id: 5, icon: 'star',         tone: 'green', title: 'Riparazione · iPad Air','body': 'Consegnato il 12 Mar. Come ti sei trovato? Lascia una recensione.', time: '12 Mar', ch: 'WhatsApp', read: true,  dest: 'home'      },
  ];
  const toneCls = { green: 'bg-emerald-50 text-emerald-600', amber: 'bg-amber-50 text-amber-600', blue: 'bg-blue-50 text-blue-600', slate: 'bg-slate-100 text-ink-soft' };
  const chCls = { WhatsApp: 'bg-emerald-100 text-emerald-700', SMS: 'bg-blue-100 text-blue-700' };

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Notifiche" right={<Chip tone="red">2 nuove</Chip>} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-4 space-y-2">
        {notifs.map(n => (
          <button key={n.id} onClick={() => { app.ensureTicket('PT'); app.nav(n.dest); }}
            className={`w-full flex items-start gap-3.5 p-4 rounded-2xl border text-left transition ${!n.read ? 'bg-mr-tint border-mr-light' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
            <span className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${toneCls[n.tone]}`}><Icon name={n.icon} size={19} /></span>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`font-extrabold text-[14px] leading-tight ${!n.read ? 'text-ink' : 'text-ink-soft'}`}>{n.title}</p>
                {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-mr flex-shrink-0 mt-0.5" />}
              </div>
              <p className="text-[12.5px] text-ink-mute font-medium mt-0.5 leading-snug">{n.body}</p>
              <p className="mt-1.5 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${chCls[n.ch]}`}>{n.ch}</span>
                <span className="text-[11px] font-bold text-ink-faint">{n.time}</span>
              </p>
            </div>
          </button>
        ))}
        <p className="text-center text-[12px] text-ink-faint font-semibold pt-3 pb-1">Notifiche via Telnyx SMS + WhatsApp Business (WABA)</p>
      </div>
      <BottomNav />
    </div>
  );
}

Object.assign(window, { QRCode, SlotPickerScreen, PayScreen, NotificheScreen });
