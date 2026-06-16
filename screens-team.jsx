/* ============================================================
   MrPhone — Repair360 · RBAC Team Management
   Marco (admin/titolare) assegna ruoli ai collaboratori
   Stile: Paolo Borsacchiello — chiaro, visuale, essenziale
   ============================================================ */

const TEAM = [
  { id: 'marco',    name: 'Marco',    surname: 'R.',     email: 'help@mrphone.tech',       role: 'titolare',     avatar: 'MR', since: 'Gen 2023', active: true },
  { id: 'federico', name: 'Federico', surname: 'C.',     email: 'federico@mrphone.tech',    role: 'tecnico',      avatar: 'FC', since: 'Mar 2024', active: true },
];

const ROLES = {
  titolare:     { label: 'Titolare',     color: '#DC2626', bg: '#FEF2F2', desc: 'Tutto — admin assoluto' },
  responsabile: { label: 'Responsabile', color: '#D97706', bg: '#FFFBEB', desc: 'Tutto eccetto impostazioni' },
  tecnico:      { label: 'Tecnico',      color: '#7C3AED', bg: '#F5F3FF', desc: 'Solo laboratorio e ticket' },
  reception:    { label: 'Reception',    color: '#0891B2', bg: '#ECFEFF', desc: 'Coda, clienti, calendario' },
};

const ROLE_PERMS = {
  titolare:     { laboratorio:true,  clienti:true,  coda:true,  preventivi:true,  report:true,  impostazioni:true,  team:true  },
  responsabile: { laboratorio:true,  clienti:true,  coda:true,  preventivi:true,  report:true,  impostazioni:false, team:false },
  tecnico:      { laboratorio:true,  clienti:false, coda:false, preventivi:false, report:false, impostazioni:false, team:false },
  reception:    { laboratorio:false, clienti:true,  coda:true,  preventivi:false, report:false, impostazioni:false, team:false },
};

const PERM_LABELS = {
  laboratorio:  ['🔧', 'Laboratorio',        'Ticket, stati, riparazioni'],
  clienti:      ['👥', 'Clienti',            'Anagrafica e contatti'],
  coda:         ['📋', 'Coda',               'Gestione queue e slot'],
  preventivi:   ['💶', 'Preventivi e prezzi','Importi, tier, sconti'],
  report:       ['📊', 'Report',             'Statistiche e fatturato'],
  impostazioni: ['⚙️',  'Impostazioni',       'Configurazione negozio'],
  team:         ['👑', 'Team',               'Gestione collaboratori'],
};

// =================================================================
//  ADMIN LOGIN (Marco e staff — separato dal flusso OTP clienti)
// =================================================================
function AdminLoginScreen() {
  const app = useApp();
  const [email, setEmail] = React.useState('help@mrphone.tech');
  const [pass, setPass]   = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState('');

  const STAFF_DB = {
    'help@mrphone.tech':       { ...TEAM[0] },
    'federico@mrphone.tech':   { ...TEAM[1] },
  };

  const login = () => {
    const staff = STAFF_DB[email.toLowerCase().trim()];
    if (!staff) { setErr('Email non riconosciuta.'); return; }
    if (!pass)  { setErr('Inserisci la password.'); return; }
    setErr(''); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      app.set({ staffUser: staff, isAdmin: staff.role === 'titolare' });
      if (staff.role === 'titolare') {
        app.set({ isExisting: true, customer: KNOWN_CUSTOMER, verified: true });
        app.notifyMarco('verified');
        app.setMarcoOpen(true);
        app.nav('home');
      } else {
        app.nav('staff-view');
      }
    }, 750);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-5 h-[58px]">
        <button onClick={() => app.nav('login')} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-ink-soft hover:bg-slate-100"><Icon name="arrow-left" size={22}/></button>
        <Logo size={20}/>
        <span className="w-10"/>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-4 pb-8">
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-ink text-white shadow-lg mb-5"><Icon name="shield-check" size={28} strokeWidth={2.3}/></span>
        <h1 className="text-[28px] font-black tracking-tight text-ink leading-tight">Accesso staff</h1>
        <p className="mt-2 text-[15px] text-ink-mute font-medium leading-relaxed">Accesso riservato al team MrPhone. I clienti entrano con il numero di telefono.</p>

        <div className="mt-7 space-y-3.5">
          <div>
            <span className="label-xs block mb-2">Email aziendale</span>
            <input value={email} onChange={e=>{setEmail(e.target.value);setErr('');}} type="email" autoComplete="email"
              className="form-input" placeholder="nome@mrphone.tech"/>
          </div>
          <div>
            <span className="label-xs block mb-2">Password</span>
            <input value={pass} onChange={e=>{setPass(e.target.value);setErr('');}} type="password"
              className="form-input" placeholder="La tua password" onKeyDown={e=>e.key==='Enter'&&login()}/>
          </div>
          {err && <p className="text-[13px] font-bold text-mr flex items-center gap-1.5"><Icon name="info" size={14}/>{err}</p>}
        </div>

        <div className="mt-5 rounded-2xl bg-amber-50 border border-amber-200 p-3.5 flex gap-2.5">
          <Icon name="info" size={17} className="text-amber-600 flex-shrink-0 mt-0.5"/>
          <div className="text-[12.5px] text-amber-800 font-semibold leading-relaxed space-y-1">
            <p><span className="font-black">Marco (titolare):</span> help@mrphone.tech · qualsiasi password</p>
            <p><span className="font-black">Federico (tecnico):</span> federico@mrphone.tech · qualsiasi password</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-7 pt-3 bg-white border-t border-slate-100 space-y-2.5">
        <Btn variant="dark" iconRight="arrow-right" disabled={!email||!pass||loading} onClick={login}>
          {loading ? <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"/> : 'Entra come staff'}
        </Btn>
        <button onClick={()=>app.nav('login')} className="w-full py-2.5 text-center text-[14px] font-bold text-ink-mute hover:text-ink transition">
          Sono un cliente → accedi con il numero
        </button>
      </div>
    </div>
  );
}

// =================================================================
//  TEAM MANAGE (Marco vede, invita, cambia ruoli)
// =================================================================
function TeamManageScreen() {
  const app = useApp();
  const [members, setMembers] = React.useState(TEAM.map(m=>({...m})));
  const [editing, setEditing]  = React.useState(null);
  const [showInvite, setShowInvite] = React.useState(false);
  const [invEmail, setInvEmail] = React.useState('');
  const [invRole, setInvRole]   = React.useState('tecnico');

  const invite = () => {
    if (!invEmail.includes('@')) return;
    const initials = invEmail.split('@')[0].slice(0,2).toUpperCase();
    setMembers(m=>[...m, { id: Date.now(), name: invEmail.split('@')[0], surname:'', email: invEmail, role: invRole, avatar: initials, since:'Oggi', active:false }]);
    setShowInvite(false); setInvEmail('');
  };

  // --- role-edit sub-screen ---
  if (editing) {
    const perms = ROLE_PERMS[editing.role] || {};
    return (
      <div className="flex flex-col h-full">
        <AppHeader title={editing.name} sub={ROLES[editing.role]?.label} onBack={()=>setEditing(null)}/>
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-8 space-y-3">
          <p className="text-[14px] text-ink-mute font-semibold px-1">Cosa può vedere {editing.name}?</p>
          {Object.entries(PERM_LABELS).map(([key,[ico,lbl,desc]])=>{
            const on = !!perms[key];
            return (
              <div key={key} className={`flex items-center gap-3.5 p-4 rounded-2xl border-2 ${on?'border-emerald-200 bg-emerald-50':'border-slate-200 bg-white'}`}>
                <span className="text-[22px] w-9 text-center flex-shrink-0">{ico}</span>
                <div className="flex-1"><p className="font-extrabold text-[15px] text-ink leading-tight">{lbl}</p><p className="text-[12px] text-ink-mute font-medium">{desc}</p></div>
                <span className={`px-3 py-1.5 rounded-xl font-black text-[12px] ${on?'bg-emerald-500 text-white':'bg-slate-100 text-ink-faint'}`}>{on?'Sì':'No'}</span>
              </div>
            );
          })}
          <p className="label-xs px-1 pt-2">Cambia ruolo</p>
          <div className="space-y-2">
            {Object.entries(ROLES).map(([rid,rv])=>(
              <button key={rid} onClick={()=>setEditing(e=>({...e,role:rid}))} className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition ${editing.role===rid?'border-mr bg-mr-tint':'border-slate-200 bg-white hover:border-slate-300'}`}>
                <span className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-[13px]" style={{background:rv.bg,color:rv.color}}>{rv.label[0]}</span>
                <div className="flex-1"><p className="font-extrabold text-[14px] text-ink">{rv.label}</p><p className="text-[12px] text-ink-mute font-medium">{rv.desc}</p></div>
                {editing.role===rid&&<Icon name="check-circle" size={20} className="text-mr"/>}
              </button>
            ))}
          </div>
          <Btn variant="primary" onClick={()=>{setMembers(ms=>ms.map(m=>m.id===editing.id?{...m,role:editing.role}:m));setEditing(null);}}>Salva ruolo</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Team" sub="Chi accede e cosa vede" onBack={()=>app.nav('home')}
        right={<button onClick={()=>setShowInvite(v=>!v)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-ink text-white text-[13px] font-extrabold active:scale-95 transition"><Icon name="plus" size={15}/>Invita</button>}/>
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-5 pb-10 space-y-5">
        {/* Role legend */}
        <div className="grid grid-cols-2 gap-2.5">
          {Object.entries(ROLES).map(([rid,rv])=>(
            <div key={rid} className="rounded-2xl p-3 flex items-start gap-2.5" style={{background:rv.bg}}>
              <span className="font-black text-[13px] leading-tight" style={{color:rv.color}}>{rv.label}</span>
              <span className="text-[11px] text-ink-mute font-semibold leading-tight">{rv.desc}</span>
            </div>
          ))}
        </div>
        {/* Members */}
        <div>
          <p className="label-xs px-1 mb-2.5">Collaboratori</p>
          <div className="card overflow-hidden divide-y divide-slate-100">
            {members.map(m=>{
              const r=ROLES[m.role]; const isMe=m.email==='help@mrphone.tech';
              return (
                <button key={m.id} onClick={()=>!isMe&&setEditing({...m})}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 hover:bg-slate-50 transition text-left" style={{cursor:isMe?'default':'pointer'}}>
                  <span className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-[15px] text-white flex-shrink-0" style={{background:isMe?'#DC2626':'#0F172A'}}>{m.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-[15px] text-ink leading-tight">{m.name} {m.surname}{isMe&&<span className="text-[11px] font-bold text-ink-faint"> · tu</span>}</p>
                    <p className="text-[12px] text-ink-faint font-medium truncate">{m.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[12px] font-extrabold" style={{background:r.bg,color:r.color}}>{r.label}</span>
                    {!isMe&&<Icon name="chevron-right" size={16} className="text-ink-faint"/>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        {/* Invite form */}
        {showInvite&&(
          <div className="rounded-2xl border-2 border-mr bg-mr-tint p-4 space-y-3 rs-pop">
            <p className="font-black text-[15px] text-ink">Invita un collaboratore</p>
            <input value={invEmail} onChange={e=>setInvEmail(e.target.value)} type="email" placeholder="nome@mrphone.tech" className="form-input"/>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(ROLES).filter(([k])=>k!=='titolare').map(([rid,rv])=>(
                <button key={rid} onClick={()=>setInvRole(rid)} className={`p-3 rounded-xl border-2 text-left transition ${invRole===rid?'border-mr bg-white':'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <p className="font-extrabold text-[13px]" style={{color:rv.color}}>{rv.label}</p>
                  <p className="text-[10.5px] text-ink-mute font-medium">{rv.desc}</p>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Btn variant="primary" onClick={invite} style={{minHeight:44,fontSize:14}}>Invia invito</Btn>
              <button onClick={()=>setShowInvite(false)} className="px-4 py-2 rounded-xl border-2 border-slate-200 font-bold text-[14px] text-ink-mute">Annulla</button>
            </div>
          </div>
        )}
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex gap-3">
          <Icon name="lock" size={18} className="text-ink-mute flex-shrink-0 mt-0.5"/>
          <p className="text-[12.5px] text-ink-soft font-semibold leading-relaxed">Permessi basati su ruoli (<span className="font-black">RBAC</span>). Sincronizzati con WordPress e Repair360. Marco (titolare) revoca accessi in qualsiasi momento.</p>
        </div>
      </div>
    </div>
  );
}

// =================================================================
//  STAFF VIEW (Federico — solo Laboratorio)
// =================================================================
function StaffViewScreen() {
  const app = useApp();
  const staff   = app.data.staffUser || TEAM[1];
  const r       = ROLES[staff.role]  || ROLES.tecnico;

  const MY_TICKETS = [
    { code:'RP-2026-0049', device:'OPPO / Realme A94', problem:'Schermo Rotto',  status:'in_lavorazione' },
    { code:'RP-2026-0051', device:'Samsung Galaxy A54', problem:'Batteria',       status:'in_attesa' },
    { code:'RP-2026-0055', device:'iPhone 12',          problem:'Non Carica',     status:'in_attesa' },
  ];
  const [sts, setSts] = React.useState(()=>Object.fromEntries(MY_TICKETS.map(t=>[t.code,t.status])));

  const SM = {
    in_attesa:      { label:'In Attesa',     color:'#F97316', next:'in_lavorazione', btn:'Inizia riparazione' },
    in_lavorazione: { label:'In Lavorazione',color:'#DC2626', next:'pronto',         btn:'Segna pronto' },
    pronto:         { label:'Pronto ✓',      color:'#16A34A', next:null,             btn:null },
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <Logo size={18}/>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-[12px] font-extrabold" style={{background:r.bg,color:r.color}}>{r.label}</span>
            <button onClick={()=>app.nav('admin-login')} className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center font-black text-[12px] shadow-sm">{staff.avatar}</button>
          </div>
        </div>
        <h1 className="text-[22px] font-black text-ink">Ciao {staff.name}.</h1>
        <p className="mt-1 text-[14px] text-ink-mute font-medium">I tuoi ticket in laboratorio.</p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-5 pb-10 space-y-3">
        {MY_TICKETS.map(t=>{
          const s=sts[t.code]; const sm=SM[s];
          return (
            <div key={t.code} className="card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="font-extrabold text-[15.5px] text-ink leading-tight">{t.device}</p>
                  <p className="text-[13px] text-ink-mute font-semibold mt-0.5">{t.problem} · <span className="font-black text-ink-soft">{t.code}</span></p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[11.5px] font-black flex-shrink-0" style={{background:sm.color+'20',color:sm.color}}>{sm.label}</span>
              </div>
              {sm.btn&&(
                <button onClick={()=>setSts(p=>({...p,[t.code]:sm.next}))}
                  className="w-full py-3.5 rounded-xl font-extrabold text-[15px] text-white active:scale-[0.98] transition"
                  style={{background:sm.color, boxShadow:`0 8px 20px -6px ${sm.color}60`}}>
                  {sm.btn}
                </button>
              )}
              {!sm.btn&&<p className="flex items-center gap-1.5 text-emerald-600 font-bold text-[13.5px] mt-1"><Icon name="check-circle" size={16}/> Completato — in attesa del cliente</p>}
            </div>
          );
        })}

        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex gap-3 mt-2">
          <Icon name="lock" size={18} className="text-ink-mute flex-shrink-0 mt-0.5"/>
          <p className="text-[12.5px] text-ink-soft font-semibold leading-relaxed">
            Accesso limitato al <span className="font-black">Laboratorio</span>. Per clienti, prezzi o report contatta Marco (admin).
          </p>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminLoginScreen, TeamManageScreen, StaffViewScreen, TEAM, ROLES, ROLE_PERMS });
