/* ============================================================
   MrPhone — Repair360  ·  Wizard preventivo (8 step) + Gate prezzo
   REGOLA: telefono PRIMA del prezzo. Prezzo bloccato finché
   il numero non è verificato via OTP.
   ============================================================ */

function WizardScreen() {
  const app = useApp();
  const [step, setStep] = React.useState(0);
  const TOTAL = 8;
  const [f, setF] = React.useState(() => ({
    phone: app.data.verified ? (app.data.phone || '333 1234567') : '',
    mode: '', device: '', brand: '', model: '', problem: '', unlock: '', pin: '', pattern: [],
    photos: [], invoice: false,
    ...(app.data.quote || {}),
  }));
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const next = () => setStep((s) => Math.min(s + 1, TOTAL - 1));
  const back = () => (step === 0 ? app.nav(app.data.isExisting ? 'home' : 'home-new') : setStep((s) => s - 1));

  const finish = () => {
    app.set({ quote: f });
    app.notifyMarco('quote');
    app.nav('pricegate');
  };

  const canNext = [
    f.phone.replace(/\D/g, '').length >= 9,
    !!f.mode, !!f.device, !!f.brand, !!f.model, !!f.problem, !!f.unlock, true,
  ][step];

  const titles = ['Il tuo numero', 'Cosa ti serve', 'Che dispositivo', 'Marca', 'Modello', 'Qual è il problema', 'Codice di sblocco', 'Riepilogo'];

  return (
    <div className="flex flex-col h-full">
      <AppHeader title={titles[step]} sub={`Passo ${step + 1} di ${TOTAL}`} onBack={back} />
      <StepBar step={step} total={TOTAL} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-4">
        {step === 0 && <StepPhone f={f} set={set} verified={app.data.verified} />}
        {step === 1 && <StepMode f={f} set={set} onPick={() => setTimeout(next, 160)} />}
        {step === 2 && <StepDevice f={f} set={set} onPick={() => setTimeout(next, 160)} />}
        {step === 3 && <StepBrand f={f} set={set} onPick={() => setTimeout(next, 160)} />}
        {step === 4 && <StepModel f={f} set={set} />}
        {step === 5 && <StepProblem f={f} set={set} onPick={() => setTimeout(next, 160)} />}
        {step === 6 && <StepUnlock f={f} set={set} />}
        {step === 7 && <StepSummary f={f} set={set} app={app} />}
      </div>
      <div className="px-6 pb-7 pt-3 bg-white border-t border-slate-100">
        {step === 7 ? (
          <Btn variant="primary" icon="eye" onClick={finish}>Vedi il prezzo</Btn>
        ) : (
          <Btn variant="primary" iconRight="arrow-right" disabled={!canNext} onClick={next}>Continua</Btn>
        )}
      </div>
    </div>
  );
}

// ---- Step 0 · telefono + lookup verde ----
function StepPhone({ f, set, verified }) {
  const fmt = (v) => v.replace(/\D/g, '').slice(0, 10).replace(/(\d{3})(\d{0,3})(\d{0,4})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' '));
  const digits = f.phone.replace(/\D/g, '');
  const found = digits.length >= 9; // demo: any valid number "matches" Mario
  return (
    <div className="pt-1 rs-pop">
      <p className="text-[15px] text-ink-mute font-medium mb-5">Iniziamo dal telefono: così riconosciamo subito chi sei e teniamo da parte il tuo preventivo.</p>
      <span className="label-xs block mb-2">Numero di cellulare</span>
      <div className="flex gap-2.5">
        <div className="flex items-center gap-1.5 px-4 rounded-2xl border-2 border-slate-200 bg-slate-50 font-extrabold text-ink text-[17px]">🇮🇹 +39</div>
        <input value={f.phone} onChange={(e) => set('phone', fmt(e.target.value))} type="tel" inputMode="numeric" autoFocus placeholder="333 123 4567" className="form-input flex-1" style={{ fontSize: 19 }} />
      </div>

      {found && (
        <div className="mt-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3 rs-pop">
          <span className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0"><Icon name="check" size={22} strokeWidth={3} /></span>
          <div>
            <p className="font-black text-[16px] text-emerald-800 leading-tight">Mario Rossi</p>
            <p className="text-[13px] text-emerald-700 font-bold">Cliente esistente · 4 riparazioni</p>
          </div>
        </div>
      )}

      <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-3.5 flex gap-2.5">
        <Icon name={verified ? 'shield-check' : 'lock'} size={17} className={verified ? 'text-emerald-600' : 'text-ink-mute'} style={{ flexShrink: 0, marginTop: 2 }} />
        <p className="text-[12.5px] text-ink-soft font-semibold leading-relaxed">
          {verified ? 'Numero verificato. Vedrai il prezzo alla fine del preventivo.' : 'Il prezzo resta nascosto finché non verifichi il numero con un codice SMS. È gratis e immediato.'}
        </p>
      </div>
    </div>
  );
}

// ---- Step 1 · Riparazione / Diagnosi ----
function StepMode({ f, set, onPick }) {
  const opts = [
    { id: 'riparazione', t: 'Riparazione', d: 'So già cosa non funziona', icon: 'wrench' },
    { id: 'diagnosi', t: 'Diagnosi', d: 'Controllate voi cosa c’è che non va', icon: 'search' },
  ];
  return (
    <div className="pt-1 space-y-3 rs-pop">
      <p className="text-[15px] text-ink-mute font-medium mb-4">Hai già un guasto preciso o vuoi che lo individuiamo noi?</p>
      {opts.map((o) => (
        <button key={o.id} onClick={() => { set('mode', o.id); onPick(); }} className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition ${f.mode === o.id ? 'border-mr bg-mr-tint' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
          <span className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${f.mode === o.id ? 'bg-mr text-white' : 'bg-slate-100 text-ink-soft'}`}><Icon name={o.icon} size={26} /></span>
          <div className="flex-1"><p className="font-black text-[17px] text-ink leading-tight">{o.t}</p><p className="text-[13.5px] text-ink-mute font-semibold">{o.d}</p></div>
          <Icon name="chevron-right" size={20} className="text-ink-faint" />
        </button>
      ))}
      <div className="mt-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 flex gap-2.5">
        <Icon name="check-circle" size={17} className="text-emerald-600 flex-shrink-0 mt-0.5" />
        <p className="text-[12.5px] text-emerald-800 font-semibold leading-relaxed">La diagnosi è sempre <span className="font-black">gratuita e non vincolante</span>: decidi tu se procedere.</p>
      </div>
    </div>
  );
}

// ---- Step 2 · dispositivo ----
function StepDevice({ f, set, onPick }) {
  return (
    <div className="pt-1 rs-pop">
      <p className="text-[15px] text-ink-mute font-medium mb-4">Che tipo di dispositivo dobbiamo guardare?</p>
      <div className="grid grid-cols-3 gap-3">
        {DEVICES.map((d) => (
          <button key={d.id} onClick={() => { set('device', d.id); onPick(); }} className={`flex flex-col items-center gap-2.5 py-6 rounded-2xl border-2 transition ${f.device === d.id ? 'border-mr bg-mr-tint' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
            <span className={`w-14 h-14 rounded-2xl flex items-center justify-center ${f.device === d.id ? 'bg-mr text-white' : 'bg-slate-100 text-ink-soft'}`}><Icon name={d.icon} size={28} /></span>
            <span className="font-bold text-[13.5px] text-ink">{d.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}


// ---- Step 3 · marca — glass tiles, grey metallico di default, colore al click ----
const BRAND_SVGS = {
  apple:    '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M23.7 17.1c0-3.2 2.6-4.7 2.7-4.8-1.5-2.2-3.8-2.5-4.6-2.5-2-.2-3.8 1.2-4.8 1.2-1 0-2.5-1.2-4.2-1.1-2.1 0-4.1 1.2-5.2 3.1-2.2 3.9-.6 9.6 1.6 12.8 1.1 1.5 2.3 3.3 3.9 3.2 1.6-.1 2.2-1 4.1-1s2.5 1 4.2 1c1.7 0 2.8-1.6 3.8-3.1 1.2-1.8 1.7-3.5 1.7-3.6-.1 0-3.2-1.2-3.2-4.3zm-3-8.2c.9-1.1 1.5-2.6 1.3-4.1-1.3.1-2.8.8-3.7 1.9-.8 1-1.5 2.5-1.3 4 1.4.1 2.8-.7 3.7-1.8z"/></svg>',
  samsung:  '<svg viewBox="0 0 80 24" fill="currentColor"><text x="0" y="19" font-family="Arial" font-weight="700" font-size="18" letter-spacing=".5">SAMSUNG</text></svg>',
  xiaomi:   '<svg viewBox="0 0 60 28" fill="currentColor"><rect x="0" y="4" width="20" height="20" rx="5"/><rect x="4" y="8" width="12" height="12" rx="3" fill="var(--bg,#07090F)"/><text x="24" y="20" font-family="Arial" font-weight="700" font-size="16">mi</text></svg>',
  huawei:   '<svg viewBox="0 0 80 24" fill="currentColor"><text x="0" y="19" font-family="Arial" font-weight="700" font-size="15" letter-spacing=".3">HUAWEI</text></svg>',
  google:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" stroke="none"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" stroke="none"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="currentColor" stroke="none"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" stroke="none"/></svg>',
  oneplus:  '<svg viewBox="0 0 80 28" fill="currentColor"><text x="0" y="21" font-family="Arial" font-weight="900" font-size="18" letter-spacing="-.5">OnePlus</text></svg>',
  oppo:     '<svg viewBox="0 0 70 28" fill="currentColor"><text x="0" y="21" font-family="Arial" font-weight="900" font-size="20" letter-spacing="1">OPPO</text></svg>',
  motorola: '<svg viewBox="0 0 32 32" fill="currentColor"><circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 16l4-8 4 8 4-8 4 8"/></svg>',
};
const BRAND_COLORS = {
  apple:'#0F172A', samsung:'#1428A0', xiaomi:'#FF6900', huawei:'#C7000B',
  google:'#EA4335', oneplus:'#EB0029', oppo:'#1BA784', motorola:'#0B5CFF',
};
function StepBrand({ f, set, onPick }) {
  const [hov, setHov] = React.useState(null);
  return (
    <div className="pt-1 rs-pop">
      <p className="text-[15px] text-ink-mute font-medium mb-4">Scegli la marca. Tutte uguali fino alla scelta — poi prendono vita.</p>
      <div className="grid grid-cols-2 gap-3">
        {BRANDS.map((b) => {
          const sel = f.brand === b.id;
          const color = BRAND_COLORS[b.id] || '#0F172A';
          return (
            <button
              key={b.id}
              onClick={() => { set('brand', b.id); set('model', ''); onPick(); }}
              onMouseEnter={() => setHov(b.id)}
              onMouseLeave={() => setHov(null)}
              className="h-[86px] rounded-2xl flex flex-col items-center justify-center gap-2 transition-all"
              style={{
                border: sel ? `2px solid ${color}` : '2px solid #E2E8F0',
                background: sel
                  ? `${color}18`
                  : hov === b.id
                    ? `${color}0D`
                    : 'linear-gradient(145deg,#F0F3F8,#E8ECF2)',
                boxShadow: sel ? `0 0 0 3px ${color}25, 0 4px 16px ${color}20` : 'none',
              }}
            >
              <div
                className="w-11 h-11 flex items-center justify-center"
                style={{
                  color: sel ? color : hov === b.id ? color : '#94A3B8',
                  transition: 'color .2s ease',
                }}
                dangerouslySetInnerHTML={{ __html: BRAND_SVGS[b.id] || '' }}
              />
              <span
                className="font-extrabold text-[12.5px] leading-none"
                style={{ color: sel ? color : hov === b.id ? color : '#94A3B8', transition: 'color .2s ease' }}
              >
                {b.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}


// ---- Step 4 · modello — ricerca + "non trovo il mio modello" ----
function StepModel({ f, set }) {
  const [q, setQ] = React.useState('');
  const [custom, setCustom] = React.useState(false);
  const [customVal, setCustomVal] = React.useState('');
  const list = modelsFor(f.brand, f.device).filter((m) => m.toLowerCase().includes(q.toLowerCase()));

  const pickCustom = () => {
    if (!customVal.trim()) return;
    set('model', customVal.trim());
  };

  return (
    <div className="pt-1 rs-pop flex flex-col" style={{ minHeight: 0 }}>
      <div className="relative mb-3">
        <Icon name="search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input value={q} onChange={(e) => { setQ(e.target.value); setCustom(false); }} autoFocus placeholder="Cerca il modello…" className="form-input pl-11" />
      </div>
      <div className="space-y-2">
        {list.map((m) => (
          <button key={m} onClick={() => set('model', m)} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 text-left transition ${f.model === m ? 'border-mr bg-mr-tint' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
            <span className="font-bold text-[15.5px] text-ink">{m}</span>
            {f.model === m ? <Icon name="check-circle" size={20} className="text-mr" /> : <Icon name="chevron-right" size={18} className="text-ink-faint" />}
          </button>
        ))}
        {list.length === 0 && !custom && (
          <p className="text-center text-[14px] text-ink-mute font-semibold py-6">Nessun modello trovato per "{q}"</p>
        )}
      </div>
      {/* Always show add-custom at bottom */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        {!custom ? (
          <button onClick={() => setCustom(true)} className="w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 border-dashed border-slate-300 text-left hover:border-mr hover:bg-mr-tint transition">
            <span className="w-9 h-9 rounded-xl bg-slate-100 text-ink-mute flex items-center justify-center flex-shrink-0"><Icon name="plus" size={18} /></span>
            <div><p className="font-bold text-[14px] text-ink leading-tight">Non trovi il tuo modello?</p><p className="text-[12px] text-ink-mute font-medium">Aggiungilo manualmente — lo identifichiamo noi</p></div>
          </button>
        ) : (
          <div className="rs-pop">
            <span className="label-xs block mb-2">Scrivi il modello esatto</span>
            <div className="flex gap-2">
              <input
                autoFocus
                value={customVal}
                onChange={(e) => setCustomVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && pickCustom()}
                placeholder="es. Samsung Galaxy A15 5G"
                className="form-input flex-1"
              />
              <button onClick={pickCustom} disabled={!customVal.trim()} className="btn btn-primary" style={{ minHeight: 48, width: 56, padding: 0, borderRadius: 14 }}>
                <Icon name="check" size={20} strokeWidth={3} />
              </button>
            </div>
            {f.model && f.model === customVal.trim() && (
              <div className="mt-3 flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                <Icon name="check-circle" size={16} className="text-emerald-600" />
                <span className="font-bold text-[13px] text-emerald-800">Aggiunto: {f.model}</span>
              </div>
            )}
            <p className="mt-2 text-[11.5px] text-ink-faint font-semibold text-center">Puoi anche continuare: lo confermiamo in negozio.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Step 5 · problema (8 icone) — tile grandi, iconiche, touch-first ----
const PROBLEM_COLORS = {
  schermo:    ['#DC2626', '#F87171'],
  batteria:   ['#F59E0B', '#FCD34D'],
  non_carica: ['#EA580C', '#FB923C'],
  non_accende:['#475569', '#94A3B8'],
  audio:      ['#7C3AED', '#A78BFA'],
  fotocamera: ['#2563EB', '#60A5FA'],
  software:   ['#0D9488', '#2DD4BF'],
  liquidi:    ['#0891B2', '#22D3EE'],
};
function StepProblem({ f, set, onPick }) {
  return (
    <div className="pt-1 rs-pop">
      <p className="text-[15px] text-ink-mute font-medium mb-4">Tocca il problema. Niente da scrivere — solo l’icona.</p>
      <div className="grid grid-cols-2 gap-3">
        {PROBLEMS.map((p) => {
          const [c1, c2] = PROBLEM_COLORS[p.id] || ['#DC2626', '#F87171'];
          const on = f.problem === p.id;
          return (
            <button
              key={p.id}
              onClick={() => { set('problem', p.id); onPick(); }}
              className="relative flex flex-col items-center text-center gap-2.5 px-3 pt-5 pb-4 rounded-[22px] border-2 transition-all overflow-hidden active:scale-95"
              style={{
                minHeight: 148,
                borderColor: on ? c1 : '#E8ECF2',
                background: on ? `linear-gradient(160deg, ${c1}10, ${c2}08)` : '#fff',
                boxShadow: on ? `0 0 0 3px ${c1}22, 0 12px 28px ${c1}26` : '0 1px 2px rgba(15,23,42,.04)',
                transform: on ? 'translateY(-2px)' : 'none',
              }}
            >
              {/* gloss */}
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,.5), transparent)' }} />
              <span
                className="relative flex items-center justify-center rounded-[18px] transition-transform"
                style={{
                  width: 60, height: 60,
                  background: `linear-gradient(150deg, ${c1}, ${c2})`,
                  boxShadow: `0 8px 18px ${c1}40`,
                  transform: on ? 'scale(1.08)' : 'scale(1)',
                }}
              >
                <Icon name={p.icon} size={30} className="text-white" strokeWidth={2.1} />
              </span>
              <span className="relative font-black text-[15px] text-ink leading-tight">{p.label}</span>
              <span className="relative inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-black" style={{ background: `${c1}14`, color: c1 }}>da {p.from}€</span>
              {on && (
                <span className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: c1 }}>
                  <Icon name="check" size={14} className="text-white" strokeWidth={3.2} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---- Step 6 · codice sblocco ----
function StepUnlock({ f, set }) {
  const togglePattern = (n) => {
    const has = f.pattern.includes(n);
    set('pattern', has ? f.pattern.filter((x) => x !== n) : [...f.pattern, n]);
  };
  return (
    <div className="pt-1 rs-pop">
      <p className="text-[15px] text-ink-mute font-medium mb-4">Per testare il dispositivo dopo la riparazione potremmo aver bisogno di sbloccarlo.</p>
      <div className="space-y-2.5">
        {UNLOCK.map((u) => (
          <button key={u.id} onClick={() => set('unlock', u.id)} className={`w-full flex items-center gap-3.5 p-4 rounded-2xl border-2 text-left transition ${f.unlock === u.id ? 'border-mr bg-mr-tint' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
            <span className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${f.unlock === u.id ? 'bg-mr text-white' : 'bg-slate-100 text-ink-soft'}`}><Icon name={u.icon} size={21} /></span>
            <div className="flex-1"><p className="font-extrabold text-[15.5px] text-ink leading-tight">{u.label}</p><p className="text-[12.5px] text-ink-mute font-semibold">{u.desc}</p></div>
            <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${f.unlock === u.id ? 'border-mr bg-mr' : 'border-slate-300'}`}>{f.unlock === u.id && <Icon name="check" size={14} className="text-white" strokeWidth={3} />}</span>
          </button>
        ))}
      </div>

      {f.unlock === 'pin' && (
        <div className="mt-4 rs-pop">
          <span className="label-xs block mb-2">Codice PIN</span>
          <input value={f.pin} onChange={(e) => set('pin', e.target.value.replace(/\D/g, '').slice(0, 8))} type="tel" inputMode="numeric" placeholder="••••" className="form-input tracking-[0.5em] text-center font-black" style={{ fontSize: 22 }} />
        </div>
      )}
      {f.unlock === 'segno' && (
        <div className="mt-4 rs-pop">
          <span className="label-xs block mb-2">Disegna la sequenza (tocca i punti in ordine)</span>
          <div className="w-[180px] mx-auto grid grid-cols-3 gap-5 p-5 rounded-3xl bg-slate-50 border-2 border-slate-200">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
              const order = f.pattern.indexOf(n);
              return (
                <button key={n} onClick={() => togglePattern(n)} className="w-9 h-9 rounded-full flex items-center justify-center transition" style={{ background: order >= 0 ? '#DC2626' : '#fff', border: '2px solid', borderColor: order >= 0 ? '#DC2626' : '#CBD5E1' }}>
                  {order >= 0 && <span className="text-white font-black text-[13px]">{order + 1}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-3.5 flex gap-2.5">
        <Icon name="lock" size={17} className="text-ink-mute flex-shrink-0 mt-0.5" />
        <p className="text-[12.5px] text-ink-soft font-semibold leading-relaxed">Il codice serve solo a testare il dispositivo. <span className="font-black">Non viene salvato</span> e resta riservato al tecnico.</p>
      </div>
    </div>
  );
}

// ---- Step 7 · riepilogo + foto/fattura ----
function StepSummary({ f, set, app }) {
  const brand = BRANDS.find((b) => b.id === f.brand);
  const prob = PROBLEMS.find((p) => p.id === f.problem);
  const dev = DEVICES.find((d) => d.id === f.device);
  const fileRef = React.useRef(null);
  const invRef = React.useRef(null);

  const addPhotos = (e) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((file) => URL.createObjectURL(file));
    set('photos', [...f.photos, ...urls].slice(0, 4));
  };

  const rows = [
    ['Cliente', 'Mario Rossi · +39 ' + (f.phone || '333 1234567')],
    ['Intervento', f.mode === 'diagnosi' ? 'Diagnosi' : 'Riparazione'],
    ['Dispositivo', dev?.label],
    ['Modello', `${brand?.label} ${f.model}`],
    ['Problema', prob?.label],
    ['Sblocco', f.unlock === 'nessuno' ? 'Nessuno' : f.unlock === 'pin' ? 'PIN' : 'Segno 3×3'],
  ];

  return (
    <div className="pt-1 rs-pop">
      <div className="card overflow-hidden divide-y divide-slate-100 mb-5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-4 py-3">
            <span className="text-[13px] font-bold text-ink-mute">{k}</span>
            <span className="text-[14.5px] font-extrabold text-ink text-right">{v}</span>
          </div>
        ))}
      </div>

      {/* foto del danno (Billo/Fiverr style) */}
      <p className="label-xs px-1 mb-2">Foto del danno <span className="text-ink-faint normal-case font-semibold tracking-normal">(facoltative, aiutano il preventivo)</span></p>
      <div className="grid grid-cols-4 gap-2.5 mb-2">
        {f.photos.map((src, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200">
            <img src={src} alt="" className="w-full h-full object-cover" />
            <button onClick={() => set('photos', f.photos.filter((_, k) => k !== i))} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"><Icon name="x" size={12} strokeWidth={3} /></button>
          </div>
        ))}
        {f.photos.length < 4 && (
          <button onClick={() => fileRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 text-ink-mute hover:border-mr hover:text-mr transition">
            <Icon name="camera" size={22} /><span className="text-[10px] font-bold">Aggiungi</span>
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={addPhotos} />
      </div>

      <button onClick={() => { invRef.current?.click(); }} className={`w-full mt-2 flex items-center gap-3 p-3.5 rounded-2xl border-2 transition ${f.invoice ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.invoice ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-ink-soft'}`}><Icon name={f.invoice ? 'check' : 'file-text'} size={19} strokeWidth={f.invoice ? 3 : 2} /></span>
        <div className="flex-1 text-left"><p className="font-bold text-[14.5px] text-ink leading-tight">{f.invoice ? 'Fattura allegata' : 'Allega fattura d’acquisto'}</p><p className="text-[12px] text-ink-mute font-semibold">Per la garanzia (facoltativo)</p></div>
        <input ref={invRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={() => set('invoice', true)} />
      </button>

      <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-3.5 flex gap-2.5">
        <Icon name="lock" size={16} className="text-ink-mute flex-shrink-0 mt-0.5" />
        <p className="text-[12px] text-ink-soft font-semibold leading-relaxed">Foto e fatture vengono <span className="font-black">eliminate dopo 24 ore</span> e usate solo per il preventivo.</p>
      </div>
    </div>
  );
}

Object.assign(window, { WizardScreen, StepPhone, StepMode, StepDevice, StepBrand, StepModel, StepProblem, StepUnlock, StepSummary });
