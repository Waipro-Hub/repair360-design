/* ============================================================
   MrPhone — Repair360  ·  Gate prezzo · PT/WT · Conferma · Stato · Coda TV
   ============================================================ */

// =================================================================
//  GATE PREZZO  (telefono prima del prezzo · "a partire da" · leva 15€)
// =================================================================
function PriceGateScreen() {
  const app = useApp();
  const q = app.data.quote || {};
  const prob = PROBLEMS.find((p) => p.id === q.problem) || PROBLEMS[0];
  const brand = BRANDS.find((b) => b.id === q.brand);
  const [tier, setTier] = React.useState('premium');
  const [explain, setExplain] = React.useState(false);
  const [online, setOnline] = React.useState(true);

  // ---- price LOCKED until OTP-verified ----
  if (!app.data.verified) {
    return (
      <div className="flex flex-col h-full">
        <AppHeader title="Il tuo preventivo" onBack={() => app.nav('wizard')} />
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <span className="w-20 h-20 rounded-3xl bg-mr-light text-mr flex items-center justify-center mb-5"><Icon name="lock" size={36} /></span>
          <h2 className="text-[23px] font-black text-ink leading-tight">Il prezzo è quasi pronto</h2>
          <p className="mt-2.5 text-[15px] text-ink-mute font-medium leading-relaxed">Per mostrartelo verifichiamo che il numero sia tuo. Un codice SMS, gratis e immediato.</p>
          <div className="mt-7 w-full"><Btn variant="primary" icon="shield-check" onClick={() => app.nav('otp')}>Verifica il numero</Btn></div>
        </div>
      </div>
    );
  }

  const t = QUALITY_TIERS.find((x) => x.id === tier);
  const base = Math.max(prob.from, t.from);

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Il tuo preventivo" onBack={() => app.nav('wizard')} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-4">
        {/* device recap */}
        <div className="flex items-center gap-3 mb-4 px-1">
          <span className="w-11 h-11 rounded-2xl bg-slate-100 text-ink-soft flex items-center justify-center flex-shrink-0"><Icon name={prob.icon} size={22} /></span>
          <div className="flex-1 min-w-0"><p className="font-black text-[16px] text-ink leading-tight truncate">{brand?.label} {q.model || ''}</p><p className="text-[13px] text-ink-mute font-bold">{prob.label}</p></div>
        </div>

        {/* HERO "a partire da" — MAI esatto */}
        <div className="rounded-3xl bg-ink text-white p-6 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 opacity-10"><Icon name="zap" size={150} /></div>
          <p className="text-[13px] font-bold text-white/60 uppercase tracking-wide">Riparazione {prob.label.toLowerCase()}</p>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-[15px] font-bold text-white/70 mb-2">a partire da</span>
            <span className="text-[56px] font-black leading-none tracking-tight">{base}€</span>
          </div>
          <p className="mt-2 text-[13.5px] text-white/70 font-semibold leading-relaxed">Il prezzo finale lo confermiamo dopo la <span className="text-white font-bold">diagnosi gratuita</span>. Nessun impegno fino ad allora.</p>
        </div>

        {/* LEVA: prenoti online non paghi i 15€ */}
        <button onClick={() => setOnline((v) => !v)} className={`w-full mt-3 flex items-center gap-3.5 p-4 rounded-2xl border-2 text-left transition ${online ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
          <span className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${online ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-ink-soft'}`}><Icon name={online ? 'check' : 'store'} size={21} strokeWidth={online ? 3 : 2} /></span>
          <div className="flex-1">
            <p className="font-black text-[15px] text-ink leading-tight">Prenoti online? Non paghi i 15€ di gestione</p>
            <p className="text-[12.5px] font-bold mt-0.5">
              {online ? <span className="text-emerald-700">Stai risparmiando 15€ · costo gestione azzerato</span> : <span className="text-ink-mute">In negozio senza prenotazione: <span className="line-through">+15€</span></span>}
            </p>
          </div>
          <Toggle on={online} onChange={setOnline} />
        </button>

        {/* GOOD-BETTER-BEST */}
        <div className="mt-5 flex items-center justify-between px-1 mb-2.5">
          <p className="label-xs">Scegli la qualità del ricambio</p>
          <button onClick={() => setExplain((v) => !v)} className="inline-flex items-center gap-1 text-[12px] font-extrabold text-mr"><Icon name="info" size={14} /> Spiegami</button>
        </div>
        {explain && (
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 mb-3 rs-pop text-[12.5px] text-ink-soft font-semibold leading-relaxed space-y-1.5">
            <p><span className="font-black text-ink">Compatibile:</span> ricambio nuovo non originale, testato singolarmente. Ottimo rapporto qualità-prezzo.</p>
            <p><span className="font-black text-ink">Originale:</span> stesso componente del produttore. Resa identica, costo più alto.</p>
            <p className="text-ink-mute">Ti diciamo sempre la verità: per molti modelli il compatibile premium è indistinguibile.</p>
          </div>
        )}
        <div className="space-y-2.5">
          {QUALITY_TIERS.map((x) => {
            const on = tier === x.id;
            return (
              <button key={x.id} onClick={() => setTier(x.id)} className={`w-full flex items-center gap-3.5 p-4 rounded-2xl border-2 text-left transition ${on ? 'border-mr bg-mr-tint' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${on ? 'border-mr bg-mr' : 'border-slate-300'}`}>{on && <Icon name="check" size={13} className="text-white" strokeWidth={3} />}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><p className="font-black text-[15px] text-ink leading-tight">{x.label}</p><Chip tone={x.id === 'premium' ? 'red' : 'slate'}>{x.badge}</Chip></div>
                  <p className="text-[12.5px] text-ink-mute font-semibold mt-0.5">{x.desc}</p>
                  <p className="text-[12px] text-ink-faint font-bold mt-1 flex items-center gap-1.5"><Icon name="shield-check" size={13} /> Garanzia {x.warranty}</p>
                </div>
                <div className="text-right flex-shrink-0"><p className="text-[11px] font-bold text-ink-faint">da</p><p className="font-black text-[18px] text-ink leading-none">{x.from}€</p></div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 flex gap-2.5">
          <Icon name="check-circle" size={17} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-[12.5px] text-emerald-800 font-semibold leading-relaxed">Diagnosi gratuita e non vincolante. Paghi solo se decidi di riparare, mai prima.</p>
        </div>
      </div>

      <div className="px-6 pb-7 pt-3 bg-white border-t border-slate-100">
        <Btn variant="primary" iconRight="arrow-right" onClick={() => { app.set({ quote: { ...q, tier, online } }); app.nav('tickettype'); }}>Scegli come portarlo</Btn>
      </div>
    </div>
  );
}

// =================================================================
//  SCELTA TICKET  PT / WT
// =================================================================
function TicketTypeScreen() {
  const app = useApp();
  const [sel, setSel] = React.useState('PT');
  const [deposit, setDeposit] = React.useState(false);
  const [paying, setPaying] = React.useState(false);

  const confirm = () => {
    app.ensureTicket(sel, { deposit: sel === 'PT' && deposit });
    app.notifyMarco('ticket');
    app.nav('slotpicker');
  };

  const payDeposit = () => {
    setPaying(true);
    setTimeout(() => { setPaying(false); setDeposit(true); }, 1100);
  };

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Come lo porti?" onBack={() => app.nav('pricegate')} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-4">
        <p className="text-[15px] text-ink-mute font-medium px-1 mb-4">Due modi per consegnarci il dispositivo. Scegli quello che preferisci.</p>

        {/* PT card */}
        <button onClick={() => setSel('PT')} className={`w-full text-left rounded-3xl border-2 p-5 transition relative overflow-hidden ${sel === 'PT' ? 'border-mr bg-mr-tint' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-start gap-3.5">
            <span className="w-13 h-13 rounded-2xl bg-mr text-white flex items-center justify-center flex-shrink-0" style={{ width: 52, height: 52 }}><Icon name="zap" size={26} /></span>
            <div className="flex-1">
              <div className="flex items-center gap-2"><p className="font-black text-[18px] text-ink leading-tight">Priority Ticket</p><Chip tone="red">PT</Chip></div>
              <p className="text-[13.5px] text-ink-soft font-semibold mt-1">Salti la fila: vieni quando vuoi, hai la <span className="font-black text-mr">precedenza</span> sui walk-in.</p>
            </div>
            <span className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${sel === 'PT' ? 'border-mr bg-mr' : 'border-slate-300'}`}>{sel === 'PT' && <Icon name="check" size={15} className="text-white" strokeWidth={3} />}</span>
          </div>
        </button>

        {/* PT deposit (optional, non-binding, PayPal) */}
        {sel === 'PT' && (
          <div className="mt-2.5 ml-1 rs-pop rounded-2xl border-2 border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-[14px] text-ink">Vuoi bloccare la priorità?</p>
              <Chip tone="green" icon="shield-check">Garantito</Chip>
            </div>
            <p className="text-[12.5px] text-ink-mute font-semibold mt-1 leading-relaxed">Deposito facoltativo di <span className="font-black text-ink">10€</span>, scalato dal totale. <span className="font-bold text-ink">Non vincolante</span>: rimborsato se non procedi.</p>
            {deposit ? (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-3 text-emerald-700 font-bold text-[14px]"><Icon name="check-circle" size={18} /> Deposito di 10€ confermato via PayPal</div>
            ) : (
              <button onClick={payDeposit} disabled={paying} className="mt-3 w-full h-12 rounded-xl flex items-center justify-center gap-2 font-black text-[15px] text-[#003087] bg-[#FFC439] disabled:opacity-60 active:scale-[0.98] transition">
                {paying ? <span className="w-5 h-5 rounded-full border-2 border-[#003087] border-t-transparent animate-spin" /> : <><span className="italic">Pay<span className="text-[#0070BA]">Pal</span></span> · deposita 10€</>}
              </button>
            )}
            <p className="mt-2 text-[11px] text-ink-faint font-semibold text-center">Puoi anche saltare e pagare tutto al ritiro.</p>
          </div>
        )}

        {/* WT card */}
        <button onClick={() => setSel('WT')} className={`w-full text-left rounded-3xl border-2 p-5 transition mt-3 ${sel === 'WT' ? 'border-ink bg-slate-50' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-start gap-3.5">
            <span className="rounded-2xl bg-ink text-white flex items-center justify-center flex-shrink-0" style={{ width: 52, height: 52 }}><Icon name="store" size={25} /></span>
            <div className="flex-1">
              <div className="flex items-center gap-2"><p className="font-black text-[18px] text-ink leading-tight">Walk-in Ticket</p><Chip tone="dark">WT</Chip></div>
              <p className="text-[13.5px] text-ink-soft font-semibold mt-1">Passi in negozio quando capita. Ti servia in ordine d’arrivo, dopo i Priority.</p>
            </div>
            <span className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${sel === 'WT' ? 'border-ink bg-ink' : 'border-slate-300'}`}>{sel === 'WT' && <Icon name="check" size={15} className="text-white" strokeWidth={3} />}</span>
          </div>
        </button>
      </div>

      <div className="px-6 pb-7 pt-3 bg-white border-t border-slate-100">
        <Btn variant={sel === 'PT' ? 'primary' : 'dark'} iconRight="arrow-right" onClick={confirm}>Conferma {sel === 'PT' ? 'Priority Ticket' : 'Walk-in Ticket'}</Btn>
      </div>
    </div>
  );
}

// =================================================================
//  CONFERMA TICKET  (codice gigante stile Poste)
// =================================================================
function ConfirmScreen() {
  const app = useApp();
  const t = app.data.ticket || { code: 'PT-014', type: 'PT', ahead: 2 };
  const isPT = t.type === 'PT';

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-emerald-50 to-white">
      <div className="flex items-center justify-end px-5 h-[58px]"><button onClick={() => app.nav(app.data.isExisting ? 'home' : 'home-new')} className="w-10 h-10 rounded-full flex items-center justify-center text-ink-soft hover:bg-white/60"><Icon name="x" size={22} /></button></div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-6 flex flex-col items-center text-center">
        <span className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-4 rs-pop"><Icon name="check" size={34} strokeWidth={3} /></span>
        <h1 className="text-[24px] font-black text-ink leading-tight">Tutto pronto!</h1>
        <p className="mt-1.5 text-[15px] text-ink-mute font-semibold">Ecco il tuo numero. Mostralo all’arrivo.</p>

        {/* GIANT ticket code + QR */}
        <div className="mt-6 w-full rounded-[28px] bg-white border border-slate-200 shadow-xl shadow-slate-300/30 p-6 rs-flip" style={{ transformOrigin: 'top' }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${isPT ? 'bg-mr' : 'bg-ink'}`}><Icon name={isPT ? 'zap' : 'store'} size={16} /></span>
            <span className="label-xs" style={{ color: isPT ? '#DC2626' : '#0F172A' }}>{isPT ? 'Priority Ticket' : 'Walk-in Ticket'}</span>
          </div>
          <p className="font-black tracking-tight leading-none" style={{ fontSize: 76, color: isPT ? '#DC2626' : '#0F172A' }}>{t.code}</p>
          {/* QR code */}
          <div className="mt-4 flex justify-center">
            <div className="p-3 rounded-2xl border-2" style={{ borderColor: isPT ? '#FECACA' : '#E2E8F0' }}>
              <QRCode value={t.code} size={120} />
            </div>
          </div>
          {app.data.slot && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[13px] font-bold text-emerald-700">
              <Icon name="calendar" size={14} className="text-emerald-500" />
              {app.data.slot.day} · {app.data.slot.time}
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-dashed border-slate-200 flex items-center justify-center gap-2 text-ink-soft">
            <Icon name="list" size={18} className="text-mr" />
            <span className="font-bold text-[15px]"><span className="font-black text-ink">{t.ahead}</span> persone davanti a te</span>
          </div>
        </div>

        <div className="mt-4 w-full space-y-2.5">
          <div className="flex items-center gap-3 rounded-2xl bg-white border border-slate-200 p-3.5 text-left">
            <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0"><Icon name="message" size={17} /></span>
            <p className="text-[13px] text-ink-soft font-semibold leading-snug">Conferma inviata via <span className="font-black text-ink">SMS</span> (Telnyx) e <span className="font-black text-ink">WhatsApp</span>. Ti avvisiamo a ogni cambio di stato.</p>
          </div>
          {t.deposit && (
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-left">
              <span className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0"><Icon name="shield-check" size={17} /></span>
              <p className="text-[13px] text-emerald-800 font-semibold leading-snug">Deposito di 10€ registrato. Priorità garantita.</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pb-7 pt-3 bg-white border-t border-slate-100 space-y-2.5">
        <Btn variant="primary" icon="wrench" onClick={() => app.nav('repair')}>Segui la riparazione</Btn>
        <Btn variant="ghost" icon="list" onClick={() => app.nav('queue')}>Guarda la coda in negozio</Btn>
      </div>
    </div>
  );
}

// =================================================================
//  STATO RIPARAZIONE
// =================================================================
function RepairScreen() {
  const app = useApp();
  const t = app.data.ticket || SEED_TICKETS[0];
  const [idx, setIdx] = React.useState(() => Math.max(0, STATUS_FLOW.findIndex((s) => s.id === (t.status || 'in_lavorazione'))));
  const [log, setLog] = React.useState(() => STATUS_FLOW.slice(0, idx + 1).map((s, i) => ({ label: s.label, ch: i === 0 ? 'SMS' : i % 2 ? 'WhatsApp' : 'SMS', time: ['09:24', '09:48', '10:30', '11:15'][i] })));

  const advance = () => {
    if (idx >= STATUS_FLOW.length - 1) return;
    const n = idx + 1;
    setIdx(n);
    setLog((l) => [...l, { label: STATUS_FLOW[n].label, ch: n % 2 ? 'WhatsApp' : 'SMS', time: ['09:24', '09:48', '10:30', '11:15'][n] }]);
    app.set({ ticket: { ...t, status: STATUS_FLOW[n].id } });
  };

  const pct = ((idx + 1) / STATUS_FLOW.length) * 100;
  const isPT = (t.type || 'PT') === 'PT';

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="La tua riparazione" sub={`${t.code} · ${t.device || 'iPhone 14 Pro'}`} onBack={() => app.nav(app.data.isExisting ? 'home' : 'home-new')} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-5 pb-28">
        {/* hero status */}
        <div className="rounded-3xl bg-ink text-white p-5 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-8 opacity-10"><Icon name={STATUS_FLOW[idx].icon} size={130} /></div>
          <div className="flex items-center gap-2 mb-2 whitespace-nowrap"><span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isPT ? 'bg-mr' : 'bg-white/20'}`}><Icon name={isPT ? 'zap' : 'store'} size={15} /></span><span className="font-black text-[15px]">{t.code}</span></div>
          <p className="text-[13px] text-white/60 font-bold uppercase tracking-wide">Stato attuale</p>
          <p className="text-[28px] font-black leading-tight mt-0.5">{STATUS_FLOW[idx].label}</p>
          <p className="text-[13.5px] text-white/70 font-semibold mt-1">{STATUS_FLOW[idx].desc}</p>
          <div className="mt-4 h-2 rounded-full bg-white/15 overflow-hidden"><div className="h-full rounded-full bg-mr transition-all duration-500" style={{ width: `${pct}%` }} /></div>
        </div>

        {/* stepper */}
        <div className="mt-6 space-y-1">
          {STATUS_FLOW.map((s, i) => {
            const done = i < idx, active = i === idx;
            return (
              <div key={s.id} className="flex gap-3.5">
                <div className="flex flex-col items-center">
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition ${done ? 'bg-emerald-500 text-white' : active ? 'bg-mr text-white' : 'bg-slate-100 text-ink-faint'}`}>
                    {done ? <Icon name="check" size={18} strokeWidth={3} /> : <Icon name={s.icon} size={18} />}
                  </span>
                  {i < STATUS_FLOW.length - 1 && <span className="w-0.5 flex-1 my-1 rounded-full" style={{ background: i < idx ? '#10B981' : '#E2E8F0', minHeight: 22 }} />}
                </div>
                <div className={`pb-4 pt-1.5 ${active ? '' : 'opacity-90'}`}>
                  <p className={`font-extrabold text-[15.5px] leading-tight ${active ? 'text-mr' : done ? 'text-ink' : 'text-ink-faint'}`}>{s.label}</p>
                  <p className="text-[12.5px] text-ink-mute font-semibold">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* notifiche inviate */}
        <p className="label-xs px-1 mt-3 mb-2.5">Notifiche inviate</p>
        <div className="card overflow-hidden divide-y divide-slate-100">
          {log.map((n, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${n.ch === 'WhatsApp' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}><Icon name="message" size={15} /></span>
              <p className="flex-1 text-[13.5px] font-bold text-ink">“{n.label}” <span className="font-semibold text-ink-mute">via {n.ch}</span></p>
              <span className="text-[12px] font-bold text-ink-faint tabular-nums">{n.time}</span>
            </div>
          ))}
        </div>
      </div>

      {idx < STATUS_FLOW.length - 1 && (
        <div className="px-6 pb-7 pt-3 bg-white border-t border-slate-100">
          <Btn variant="ghost" icon="refresh" onClick={advance}>Demo: avanza stato →  {STATUS_FLOW[idx + 1].label}</Btn>
        </div>
      )}
      {idx >= STATUS_FLOW.length - 1 && (
        <div className="px-6 pb-4 pt-3 bg-white border-t border-slate-100">
          <Btn variant="primary" icon="package" onClick={() => app.nav('payscreen')}>Paga e ritira il dispositivo</Btn>
        </div>
      )}
      <BottomNav />
    </div>
  );
}

Object.assign(window, { PriceGateScreen, TicketTypeScreen, ConfirmScreen, RepairScreen });
