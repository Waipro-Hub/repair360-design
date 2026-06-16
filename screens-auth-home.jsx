/* ============================================================
   MrPhone — Repair360  ·  Auth · Home · Profilo · Sitemap
   ============================================================ */

// ---------- small toggle ----------
function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} className="relative w-[52px] h-[30px] rounded-full transition-colors flex-shrink-0" style={{ background: on ? '#DC2626' : '#CBD5E1' }}>
      <span className="absolute top-[3px] left-[3px] w-6 h-6 rounded-full bg-white shadow transition-transform" style={{ transform: on ? 'translateX(22px)' : 'none' }} />
    </button>
  );
}

// =================================================================
//  SITEMAP / INDEX
// =================================================================
function SitemapScreen() {
  const app = useApp();
  const go = (s, p) => () => app.nav(s, p);
  const Group = ({ title, items }) => (
    <div className="mb-7">
      <p className="label-xs px-1 mb-2.5">{title}</p>
      <div className="card overflow-hidden divide-y divide-slate-100">
        {items.map((it) => (
          <button key={it.label} onClick={it.act} className="w-full flex items-center gap-3.5 px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 transition text-left">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: it.bg || '#FEF2F2', color: it.fg || '#DC2626' }}>
              <Icon name={it.icon} size={20} strokeWidth={2.2} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-bold text-[15px] text-ink leading-tight">{it.label}</span>
              {it.sub && <span className="block text-[12.5px] text-ink-mute font-medium truncate">{it.sub}</span>}
            </span>
            <Icon name="chevron-right" size={18} className="text-ink-faint" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-5 bg-gradient-to-b from-mr-tint to-white border-b border-slate-100">
        <Logo size={24} />
        <h1 className="mt-5 text-[26px] font-black tracking-tight text-ink leading-[1.1]">Repair360 — Flusso completo</h1>
        <p className="mt-2 text-[14px] text-ink-mute font-medium">Prototipo cliente navigabile. Tocca una voce per aprire la schermata.</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-6 pb-10">
        <Group title="1 · Accesso" items={[
          { label: 'Login OTP', sub: 'Numero +39 → invio codice', icon: 'phone', act: go('login') },
          { label: 'Verifica OTP', sub: '6 cifre · reinvio 60s · codice test 000000', icon: 'shield-check', act: () => { app.set({ phone: '333 1234567' }); app.nav('otp'); } },
        ]} />
        <Group title="2 · Home cliente" items={[
          { label: 'Home — cliente esistente', sub: 'Saluto, ticket attivi, storico', icon: 'home', act: () => { app.set({ isExisting: true, customer: KNOWN_CUSTOMER, phone: KNOWN_CUSTOMER.telefono }); app.nav('home'); } },
          { label: 'Home — nuovo cliente', sub: 'Benvenuto + prima riparazione', icon: 'sparkles', act: () => { app.set({ isExisting: false, customer: null }); app.nav('home-new'); } },
        ]} />
        <Group title="3 · Preventivo" items={[
          { label: 'Wizard preventivo', sub: '8 step · telefono prima del prezzo', icon: 'list', act: go('wizard') },
          { label: 'Gate prezzo', sub: '“a partire da” · leva 15€ · good-better-best', icon: 'eye', bg: '#FEF2F2', act: () => { app.ensureQuote(); app.nav('pricegate'); } },
        ]} />
        <Group title="4 · Preventivo & ticket" items={[
          { label: 'Scelta ticket PT / WT', sub: 'Priorità o walk-in · deposito PayPal', icon: 'zap', act: () => { app.ensureQuote(); app.nav('tickettype'); } },
          { label: 'Slot Google Calendar', sub: 'Scegli giorno e fascia oraria', icon: 'calendar', bg: '#EFF6FF', fg: '#4285F4', act: () => { app.ensureQuote(); app.nav('slotpicker'); } },
          { label: 'Conferma ticket', sub: 'Codice gigante + QR · persone in coda', icon: 'check-circle', bg: '#ECFDF5', fg: '#16A34A', act: () => { app.ensureTicket('PT'); app.nav('confirm'); } },
          { label: 'Stato riparazione', sub: 'Ricevuto → Diagnosi → Pronto', icon: 'wrench', act: () => { app.ensureTicket('PT'); app.nav('repair'); } },
          { label: 'Pagamento al ritiro', sub: 'Contanti · POS · PayPal Pay in 3', icon: 'package', bg: '#FFFBEB', fg: '#D97706', act: () => { app.ensureTicket('PT'); app.nav('payscreen'); } },
          { label: 'Coda live (TV negozio)', sub: 'Stile Poste · PT precede WT · Vetrina360', icon: 'list', bg: '#0F172A', fg: '#fff', act: go('queue') },
        ]} />
        <Group title="5 · Account & assistenza" items={[
          { label: 'Notifiche', sub: 'SMS + WhatsApp · Telnyx WABA', icon: 'bell', bg: '#FEF2F2', fg: '#DC2626', act: () => { app.set({ isExisting: true, customer: KNOWN_CUSTOMER }); app.nav('notifiche'); } },
          { label: 'Profilo', sub: 'Dati, storico, preferenze notifiche', icon: 'user', act: () => { app.set({ isExisting: true, customer: KNOWN_CUSTOMER }); app.nav('profile'); } },
          { label: 'Chat Giorgia', sub: 'Bot WhatsApp Business · risposte rapide', icon: 'message', bg: '#ECFDF5', fg: '#16A34A', act: () => app.setChatOpen(true) },
          { label: 'Vista Marco (gestionale)', sub: 'Cosa vede il negozio in parallelo', icon: 'headset', bg: '#EFF6FF', fg: '#2563EB', act: () => app.setMarcoOpen(true) },
          { label: 'Blueprint servizio', sub: 'Architettura: Telnyx · WABA · Shopify · Vetrina360', icon: 'settings', bg: '#F5F3FF', fg: '#7C3AED', act: go('blueprint') },
        ]} />
      </div>
    </div>
  );
}

// =================================================================
//  LOGIN (phone)
// =================================================================
function LoginScreen() {
  const app = useApp();
  const [phone, setPhone] = React.useState(app.data.phone || '');
  const [sim, setSim] = React.useState(app.data.isExisting === false ? 'new' : 'existing');
  const digits = phone.replace(/\D/g, '');
  const valid = digits.length >= 9;

  const fmt = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 10);
    return d.replace(/(\d{3})(\d{0,3})(\d{0,4})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' '));
  };

  const submit = () => {
    if (!valid) return;
    const existing = sim === 'existing';
    app.set({ phone, isExisting: existing, customer: existing ? { ...KNOWN_CUSTOMER, telefono: phone } : null });
    app.nav('otp');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 h-[58px]">
        <button onClick={() => app.nav('index')} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-ink-soft hover:bg-slate-100"><Icon name="arrow-left" size={22} /></button>
        <Logo size={20} />
        <span className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-6 pb-8">
        <div className="rs-pop">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-mr text-white shadow-lg shadow-mr/30 mb-5">
            <Icon name="phone" size={28} strokeWidth={2.3} />
          </span>
          <h1 className="text-[30px] font-black tracking-tight text-ink leading-[1.08]">Entra o prenota<br />in 30 secondi</h1>
          <p className="mt-3 text-[15px] text-ink-mute font-medium leading-relaxed">Ti mandiamo un codice via SMS. Nessuna password, nessun pensiero.</p>

          <div className="mt-7">
            <span className="label-xs block mb-2">Il tuo numero di cellulare</span>
            <div className="flex gap-2.5">
              <div className="flex items-center gap-1.5 px-4 rounded-2xl border-2 border-slate-200 bg-slate-50 font-extrabold text-ink text-[17px]">
                🇮🇹 +39
              </div>
              <input
                value={phone} onChange={(e) => setPhone(fmt(e.target.value))}
                type="tel" inputMode="numeric" autoFocus placeholder="333 123 4567"
                className="form-input flex-1 tracking-wide" style={{ fontSize: 19 }}
              />
            </div>
            <p className="mt-2 text-[12px] text-ink-faint font-medium flex items-center gap-1.5"><Icon name="lock" size={13} /> Il numero serve solo per identificarti e avvisarti sulla riparazione.</p>
          </div>

          {/* demo toggle: existing vs new */}
          <div className="mt-5 p-1 rounded-2xl bg-slate-100 flex">
            {[['existing', 'Cliente esistente'], ['new', 'Nuovo cliente']].map(([v, l]) => (
              <button key={v} onClick={() => setSim(v)} className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition ${sim === v ? 'bg-white text-ink shadow-sm' : 'text-ink-mute'}`}>{l}</button>
            ))}
          </div>
          <p className="mt-1.5 text-[11px] text-ink-faint text-center">Solo per la demo: sceglie quale Home mostrare dopo l’OTP.</p>
        </div>
      </div>

      <div className="px-6 pb-7 pt-3 bg-white border-t border-slate-100">
        <Btn variant="primary" iconRight="arrow-right" disabled={!valid} onClick={submit}>Mandami il codice</Btn>
        <p className="mt-3 text-center text-[11.5px] text-ink-faint font-medium">Continuando accetti i Termini e l’Informativa privacy.</p>
      </div>
    </div>
  );
}

// =================================================================
//  OTP VERIFY
// =================================================================
function OtpScreen() {
  const app = useApp();
  const LEN = 6;
  const [code, setCode] = React.useState(Array(LEN).fill(''));
  const [error, setError] = React.useState('');
  const [attempts, setAttempts] = React.useState(0);
  const [resends, setResends] = React.useState(0);
  const [seconds, setSeconds] = React.useState(60);
  const [verifying, setVerifying] = React.useState(false);
  const refs = React.useRef([]);
  const blocked = attempts >= 5;
  const rateLimited = resends >= 3;

  React.useEffect(() => { refs.current[0]?.focus(); }, []);
  React.useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const value = code.join('');
  const setDigit = (i, v) => {
    const d = v.replace(/\D/g, '');
    if (!d && v !== '') return;
    const next = [...code];
    if (d.length > 1) { // paste
      d.slice(0, LEN).split('').forEach((ch, k) => { if (i + k < LEN) next[i + k] = ch; });
      setCode(next); setError('');
      const last = Math.min(i + d.length, LEN - 1); refs.current[last]?.focus();
      return;
    }
    next[i] = d; setCode(next); setError('');
    if (d && i < LEN - 1) refs.current[i + 1]?.focus();
  };
  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) refs.current[i - 1]?.focus();
  };

  React.useEffect(() => {
    if (value.length === LEN && !blocked && !verifying) verify();
  }, [value]);

  const verify = () => {
    setVerifying(true);
    setTimeout(() => {
      if (value === '000000') {
        app.set({ verified: true });
        app.nav(app.data.isExisting ? 'home' : 'home-new');
        app.notifyMarco('verified');
      } else {
        const a = attempts + 1;
        setAttempts(a);
        setError(a >= 5 ? 'Troppi tentativi. Riprova tra 15 minuti.' : `Codice errato. Tentativi rimasti: ${5 - a}`);
        setCode(Array(LEN).fill('')); refs.current[0]?.focus();
      }
      setVerifying(false);
    }, 550);
  };

  const resend = () => {
    if (seconds > 0 || rateLimited) return;
    setResends((r) => r + 1); setSeconds(60); setError(''); setCode(Array(LEN).fill('')); refs.current[0]?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-5 h-[58px]">
        <button onClick={() => app.nav('login')} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-ink-soft hover:bg-slate-100"><Icon name="arrow-left" size={22} /></button>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-4 pb-8">
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-mr-light text-mr mb-5"><Icon name="shield-check" size={28} strokeWidth={2.2} /></span>
        <h1 className="text-[28px] font-black tracking-tight text-ink leading-tight">Inserisci il codice</h1>
        <p className="mt-2 text-[15px] text-ink-mute font-medium">Te l’abbiamo inviato via SMS al <span className="font-bold text-ink">+39 {app.data.phone || '333 123 4567'}</span></p>

        <div className="mt-7 flex gap-2 justify-between" style={{ pointerEvents: blocked ? 'none' : 'auto' }}>
          {code.map((d, i) => (
            <input key={i} ref={(el) => (refs.current[i] = el)} value={d}
              onChange={(e) => setDigit(i, e.target.value)} onKeyDown={(e) => onKey(i, e)}
              type="tel" inputMode="numeric" maxLength={LEN}
              className="w-[46px] h-[60px] text-center rounded-2xl border-2 font-black text-[26px] text-ink outline-none transition"
              style={{ borderColor: error ? '#DC2626' : d ? '#0F172A' : '#E2E8F0', background: blocked ? '#F1F5F9' : '#fff' }}
            />
          ))}
        </div>

        <div className="mt-4 min-h-[24px]">
          {verifying && <p className="text-[13px] font-bold text-ink-mute flex items-center gap-2"><span className="w-4 h-4 rounded-full border-2 border-mr border-t-transparent animate-spin" /> Verifica in corso…</p>}
          {error && !verifying && <p className="text-[13.5px] font-bold text-mr flex items-center gap-1.5"><Icon name="info" size={15} /> {error}</p>}
        </div>

        <div className="mt-3 rounded-2xl bg-amber-50 border border-amber-200 p-3.5 flex gap-2.5">
          <Icon name="info" size={17} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[12.5px] text-amber-800 font-semibold leading-relaxed">Per la demo il codice valido è <span className="font-black tracking-wider">000000</span>. Reinvio dopo 60s, max 3 invii ogni 10 min, blocco dopo 5 errori.</p>
        </div>

        <div className="mt-6 text-center">
          {rateLimited ? (
            <p className="text-[13px] font-bold text-ink-mute">Limite invii raggiunto. Riprova più tardi.</p>
          ) : seconds > 0 ? (
            <p className="text-[13.5px] text-ink-mute font-medium">Non hai ricevuto il codice? Reinvio tra <span className="font-extrabold text-ink tabular-nums">0:{String(seconds).padStart(2, '0')}</span></p>
          ) : (
            <button onClick={resend} className="text-[14px] font-extrabold text-mr inline-flex items-center gap-1.5"><Icon name="refresh" size={15} /> Invia di nuovo il codice</button>
          )}
        </div>
      </div>
      <div className="px-6 pb-7 pt-3 bg-white border-t border-slate-100">
        <Btn variant="primary" disabled={value.length !== LEN || blocked || verifying} onClick={verify}>Verifica e continua</Btn>
      </div>
    </div>
  );
}

// =================================================================
//  HOME — existing customer
// =================================================================
function HomeExisting() {
  const app = useApp();
  const c = app.data.customer || KNOWN_CUSTOMER;
  const active = app.data.tickets?.length ? app.data.tickets : SEED_TICKETS;

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-5 pb-6 bg-gradient-to-b from-mr-tint to-white">
        <div className="flex items-center justify-between">
          <Logo size={20} />
          <button onClick={() => app.nav('profile')} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-ink-soft shadow-sm"><Icon name="user" size={19} /></button>
        </div>
        <h1 className="mt-6 text-[28px] font-black tracking-tight text-ink leading-tight">Ciao {c.nome}.</h1>
        <p className="mt-1 text-[15px] text-ink-mute font-medium">Bentornato in MrPhone. Cosa ti serve oggi?</p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-36 -mt-2">
        {/* active tickets */}
        {active.length > 0 && (
          <div className="mb-6">
            <p className="label-xs px-1 mb-2.5">Riparazione in corso</p>
            {active.map((t) => <ActiveTicketCard key={t.code} t={t} onClick={() => { app.ensureTicket(t.type, t); app.nav('repair'); }} />)}
          </div>
        )}

        {/* primary CTA */}
        <button onClick={() => app.nav('wizard')} className="w-full text-left rounded-[24px] p-5 bg-mr text-white shadow-xl shadow-mr/25 relative overflow-hidden active:scale-[0.99] transition">
          <div className="absolute -right-6 -bottom-8 opacity-15"><Icon name="wrench" size={140} /></div>
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-white/20 mb-3"><Icon name="plus" size={24} strokeWidth={2.6} /></span>
          <p className="text-[20px] font-black leading-tight">Prenota una riparazione</p>
          <p className="mt-1 text-[13.5px] text-white/80 font-semibold">Preventivo gratuito in 1 minuto · niente impegno</p>
        </button>

        {/* history */}
        <div className="mt-7">
          <p className="label-xs px-1 mb-2.5">Le tue riparazioni</p>
          <div className="card overflow-hidden divide-y divide-slate-100">
            {HISTORY.map((h) => (
              <div key={h.code} className="flex items-center gap-3.5 px-4 py-3.5">
                <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0"><Icon name="check-circle" size={19} /></span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[14.5px] text-ink leading-tight">{h.device} · {h.problem}</p>
                  <p className="text-[12.5px] text-ink-mute font-medium">{h.date} · {h.code}</p>
                </div>
                <span className="font-extrabold text-[15px] text-ink">{h.price}€</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function ActiveTicketCard({ t, onClick }) {
  const idx = STATUS_FLOW.findIndex((s) => s.id === t.status);
  const pct = Math.round(((idx + 1) / STATUS_FLOW.length) * 100);
  return (
    <button onClick={onClick} className="w-full text-left card p-4 rs-pop active:scale-[0.99] transition shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-ink text-white flex items-center justify-center flex-shrink-0 font-black text-[12px] leading-none flex-col">
            <Icon name={t.type === 'PT' ? 'zap' : 'store'} size={18} />
          </span>
          <div>
            <p className="font-extrabold text-[16px] text-ink leading-tight">{t.device}</p>
            <p className="text-[13px] text-ink-mute font-semibold">{t.problem} · <span className="font-black text-ink">{t.code}</span></p>
          </div>
        </div>
        <Chip tone="amber" icon="wrench">{STATUS_LABEL[t.status]}</Chip>
      </div>
      <div className="mt-3.5">
        <div className="flex justify-between text-[11px] font-bold text-ink-faint mb-1.5"><span>Ricevuto</span><span>Pronto</span></div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-mr transition-all" style={{ width: `${pct}%` }} /></div>
      </div>
      {typeof t.ahead === 'number' && t.ahead > 0 && (
        <p className="mt-3 text-[13px] font-bold text-ink-soft flex items-center gap-1.5"><Icon name="list" size={14} className="text-mr" /> {t.ahead} persone davanti a te in coda</p>
      )}
    </button>
  );
}

// =================================================================
//  HOME — new customer
// =================================================================
function HomeNew() {
  const app = useApp();
  const points = [
    { icon: 'search', t: 'Diagnosi gratuita', d: 'Controlliamo il guasto senza impegno.' },
    { icon: 'shield-check', t: 'Garanzia inclusa', d: 'Fino a 12 mesi sul ricambio.' },
    { icon: 'zap', t: 'Prezzo onesto', d: 'Te lo diciamo prima di iniziare.' },
  ];
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 h-[58px]"><Logo size={20} /><button onClick={() => app.nav('index')} className="text-[13px] font-bold text-ink-mute">Esci</button></div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-4 pb-28">
        <div className="rs-pop">
          <Chip tone="red" icon="sparkles">Benvenuto in MrPhone</Chip>
          <h1 className="mt-4 text-[32px] font-black tracking-tight text-ink leading-[1.06]">Il tuo telefono,<br />come nuovo.</h1>
          <p className="mt-3 text-[15.5px] text-ink-mute font-medium leading-relaxed">Schermo, batteria, danni da liquidi: pensiamo a tutto noi. Prenota la tua prima riparazione e scopri il prezzo prima di decidere.</p>
        </div>
        <div className="mt-7 space-y-3">
          {points.map((p) => (
            <div key={p.t} className="flex items-center gap-3.5 card p-4 shadow-sm rs-pop">
              <span className="w-11 h-11 rounded-2xl bg-mr-light text-mr flex items-center justify-center flex-shrink-0"><Icon name={p.icon} size={20} /></span>
              <div><p className="font-extrabold text-[15px] text-ink leading-tight">{p.t}</p><p className="text-[13px] text-ink-mute font-medium">{p.d}</p></div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 pb-7 pt-3 bg-white border-t border-slate-100">
        <Btn variant="primary" icon="plus" onClick={() => app.nav('wizard')}>Prenota la tua prima riparazione</Btn>
        <p className="mt-3 text-center text-[12px] text-ink-faint font-semibold">Gratis e senza impegno · 1 minuto</p>
      </div>
    </div>
  );
}

// =================================================================
//  PROFILO
// =================================================================
function ProfileScreen() {
  const app = useApp();
  const c = app.data.customer || KNOWN_CUSTOMER;
  const [sms, setSms] = React.useState(true);
  const [wa, setWa] = React.useState(true);
  const [email, setEmail] = React.useState(false);

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Profilo" onBack={() => app.nav('home')} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-5 pb-4">
        <div className="flex items-center gap-4 mb-6 px-1">
          <span className="w-16 h-16 rounded-3xl bg-mr text-white flex items-center justify-center font-black text-[24px]">{(c.nome || 'M')[0]}{(c.cognome || 'R')[0]}</span>
          <div>
            <p className="font-black text-[20px] text-ink leading-tight">{c.nome} {c.cognome}</p>
            <p className="text-[13.5px] text-ink-mute font-semibold">Cliente dal {c.since || '2023'} · {c.visite || 4} riparazioni</p>
          </div>
        </div>

        <p className="label-xs px-1 mb-2.5">Dati di contatto</p>
        <div className="card overflow-hidden divide-y divide-slate-100 mb-6">
          {[['phone', 'Telefono', `+39 ${c.telefono || '333 1234567'}`], ['message', 'Email', c.email || 'mario.rossi@gmail.com']].map(([ic, l, v]) => (
            <div key={l} className="flex items-center gap-3.5 px-4 py-3.5">
              <span className="w-9 h-9 rounded-xl bg-slate-100 text-ink-soft flex items-center justify-center"><Icon name={ic} size={17} /></span>
              <div className="flex-1"><p className="text-[12px] font-bold text-ink-faint uppercase tracking-wide">{l}</p><p className="font-bold text-[15px] text-ink">{v}</p></div>
              <Icon name="edit" size={17} className="text-ink-faint" />
            </div>
          ))}
        </div>

        <p className="label-xs px-1 mb-2.5">Preferenze notifiche</p>
        <div className="card overflow-hidden divide-y divide-slate-100 mb-6">
          {[['SMS', 'Aggiornamenti via SMS', sms, setSms], ['WhatsApp', 'Aggiornamenti su WhatsApp', wa, setWa], ['Email', 'Riepiloghi via email', email, setEmail]].map(([l, d, v, set]) => (
            <div key={l} className="flex items-center gap-3.5 px-4 py-3.5">
              <div className="flex-1"><p className="font-bold text-[15px] text-ink leading-tight">{l}</p><p className="text-[12.5px] text-ink-mute font-medium">{d}</p></div>
              <Toggle on={v} onChange={set} />
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex gap-3 mb-6">
          <Icon name="lock" size={18} className="text-ink-mute flex-shrink-0 mt-0.5" />
          <p className="text-[12.5px] text-ink-soft font-semibold leading-relaxed">Le foto del danno e le fatture che carichi vengono <span className="font-black">eliminate automaticamente dopo 24 ore</span>. Usate solo per il preventivo.</p>
        </div>

        <button onClick={() => app.nav('login')} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-mr font-extrabold text-[15px] hover:bg-mr-tint transition"><Icon name="logout" size={18} /> Esci</button>
      </div>
      <BottomNav />
    </div>
  );
}

Object.assign(window, { Toggle, SitemapScreen, LoginScreen, OtpScreen, HomeExisting, HomeNew, ProfileScreen, ActiveTicketCard });
