/* ============================================================
   MrPhone — Repair360  ·  Icons + UI primitives + App context
   ============================================================ */

// ---- Global app context (created early; consumed at render time) ----
window.MrCtx = React.createContext(null);
window.useApp = () => React.useContext(window.MrCtx);

// ---- Icon set (outline, 24x24, currentColor) ----
const _FILLED = new Set(['zap', 'star', 'sparkles', 'bolt-fill']);
const ICONS = {
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  'shield-check': <g><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></g>,
  'arrow-left': <g><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></g>,
  'arrow-right': <g><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></g>,
  check: <polyline points="20 6 9 17 4 12" />,
  'check-circle': <g><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></g>,
  'chevron-right': <polyline points="9 18 15 12 9 6" />,
  'chevron-left': <polyline points="15 18 9 12 15 6" />,
  'chevron-down': <polyline points="6 9 12 15 18 9" />,
  smartphone: <g><rect x="5" y="2" width="14" height="20" rx="2.5" /><line x1="12" y1="18" x2="12.01" y2="18" /></g>,
  tablet: <g><rect x="4" y="2" width="16" height="20" rx="2.5" /><line x1="12" y1="18" x2="12.01" y2="18" /></g>,
  watch: <g><rect x="6" y="6" width="12" height="12" rx="3.5" /><path d="M9 6l.9-3.4A1 1 0 0 1 10.86 2h2.28a1 1 0 0 1 .96.6L15 6M15 18l-.9 3.4a1 1 0 0 1-.96.6h-2.28a1 1 0 0 1-.96-.6L9 18" /></g>,
  battery: <g><rect x="2" y="7" width="16" height="10" rx="2.5" /><line x1="22" y1="11" x2="22" y2="13" /></g>,
  zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  bolt: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  power: <g><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line x1="12" y1="2" x2="12" y2="12" /></g>,
  volume: <g><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></g>,
  camera: <g><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></g>,
  cpu: <g><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" /></g>,
  droplet: <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />,
  store: <path d="M3 9l1.5-5h15L21 9M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M3 9h18" />,
  lock: <g><rect x="3" y="11" width="18" height="11" rx="2.5" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></g>,
  grid: <g><circle cx="5" cy="5" r="1.4" /><circle cx="12" cy="5" r="1.4" /><circle cx="19" cy="5" r="1.4" /><circle cx="5" cy="12" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="19" cy="12" r="1.4" /><circle cx="5" cy="19" r="1.4" /><circle cx="12" cy="19" r="1.4" /><circle cx="19" cy="19" r="1.4" /></g>,
  hash: <g><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" /></g>,
  image: <g><rect x="3" y="3" width="18" height="18" rx="2.5" /><circle cx="8.5" cy="8.5" r="1.6" /><path d="M21 15l-5-5L5 21" /></g>,
  upload: <g><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></g>,
  'file-text': <g><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="13" y2="17" /></g>,
  message: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  user: <g><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></g>,
  clock: <g><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></g>,
  bell: <g><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></g>,
  info: <g><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></g>,
  x: <g><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></g>,
  search: <g><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></g>,
  send: <g><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></g>,
  plus: <g><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></g>,
  minus: <line x1="5" y1="12" x2="19" y2="12" />,
  sparkles: <path d="M12 2l2.2 6.3L20.5 10l-6.3 1.7L12 18l-2.2-6.3L3.5 10l6.3-1.7z" />,
  star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  calendar: <g><rect x="3" y="4" width="18" height="18" rx="2.5" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></g>,
  'map-pin': <g><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></g>,
  refresh: <g><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></g>,
  edit: <g><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" /></g>,
  home: <g><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></g>,
  list: <g><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></g>,
  eye: <g><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></g>,
  wrench: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6z" />,
  package: <g><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></g>,
  settings: <g><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></g>,
  logout: <g><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></g>,
  headset: <g><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></g>,
  shop: <path d="M3 9l1.5-5h15L21 9M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M3 9h18M9 20v-6h6v6" />,
};

function Icon({ name, size = 22, className = '', style, strokeWidth = 2 }) {
  const filled = _FILLED.has(name);
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style} aria-hidden="true"
    >
      {ICONS[name] || null}
    </svg>
  );
}

// ---- MrPhone wordmark ----
function Logo({ size = 22, light = false }) {
  return (
    <div className="inline-flex items-center gap-2 select-none" style={{ fontSize: size }}>
      <span
        className="inline-flex items-center justify-center rounded-[10px] font-black"
        style={{ width: size * 1.55, height: size * 1.55, background: light ? '#fff' : '#DC2626', color: light ? '#DC2626' : '#fff', fontSize: size * 0.95 }}
      >
        <Icon name="smartphone" size={size * 0.92} strokeWidth={2.4} />
      </span>
      <span className="font-black tracking-tight" style={{ color: light ? '#fff' : '#0F172A', letterSpacing: '-0.02em' }}>
        Mr<span style={{ color: light ? '#fff' : '#DC2626' }}>Phone</span>
      </span>
    </div>
  );
}

// ---- Giant button ----
function Btn({ variant = 'primary', icon, iconRight, children, className = '', ...p }) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...p}>
      {icon && <Icon name={icon} size={21} strokeWidth={2.4} />}
      {children}
      {iconRight && <Icon name={iconRight} size={21} strokeWidth={2.4} />}
    </button>
  );
}

// ---- Labeled field ----
function Field({ label, hint, children }) {
  return (
    <label className="block">
      {label && <span className="label-xs block mb-2">{label}</span>}
      {children}
      {hint && <span className="block mt-1.5 text-[12px] font-medium text-ink-faint">{hint}</span>}
    </label>
  );
}

// ---- Phone status bar (cosmetic) ----
function StatusBar({ dark = false }) {
  const c = dark ? '#fff' : '#0F172A';
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[13px] font-bold" style={{ color: c }}>
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <Icon name="bell" size={13} strokeWidth={2.6} />
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none"><rect x="0.5" y="2" width="16" height="8" rx="2" stroke={c} /><rect x="2" y="3.5" width="11" height="5" rx="1" fill={c} /><rect x="17.5" y="4.5" width="1.5" height="3" rx="1" fill={c} /></svg>
      </div>
    </div>
  );
}

// ---- Sticky app header with optional back ----
function AppHeader({ title, onBack, right, sub }) {
  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="flex items-center gap-3 px-5 h-[58px]">
        {onBack && (
          <button onClick={onBack} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-ink-soft hover:bg-slate-100 active:scale-90 transition">
            <Icon name="arrow-left" size={22} strokeWidth={2.4} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="font-extrabold text-[17px] text-ink truncate leading-tight">{title}</h1>
          {sub && <p className="text-[12px] text-ink-mute font-medium truncate">{sub}</p>}
        </div>
        {right}
      </div>
    </div>
  );
}

// ---- Progress dots/bar for the wizard ----
function StepBar({ step, total }) {
  return (
    <div className="flex items-center gap-1.5 px-5 pt-3 pb-4">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="h-1.5 rounded-full flex-1 transition-all duration-300" style={{ background: i <= step ? '#DC2626' : '#E2E8F0' }} />
      ))}
    </div>
  );
}

// ---- Small pill / chip ----
function Chip({ children, tone = 'slate', icon }) {
  const tones = {
    slate: 'bg-slate-100 text-ink-soft',
    red: 'bg-mr-light text-mr-dark',
    green: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    blue: 'bg-blue-100 text-blue-700',
    dark: 'bg-ink text-white',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold ${tones[tone]}`}>
      {icon && <Icon name={icon} size={12} strokeWidth={2.6} />}
      {children}
    </span>
  );
}

// ---- BottomNav: screens that show it ----
const SHOW_BN_SCREENS = new Set(['home', 'repair', 'notifiche', 'profile']);

function BottomNav() {
  const app = useApp();
  const s = app.screen;
  const items = [
    { id: 'home',      icon: 'home',    label: 'Home' },
    { id: 'repair',    icon: 'wrench',  label: 'Ticket' },
    { id: 'notifiche', icon: 'bell',    label: 'Avvisi', badge: 2 },
    { id: 'profile',   icon: 'user',    label: 'Profilo' },
  ];
  const active = (id) => s === id;
  const go = (id) => {
    if (id === 'home') app.nav(app.data.isExisting ? 'home' : 'home-new');
    else if (id === 'repair') { app.ensureTicket('PT'); app.nav('repair'); }
    else app.nav(id);
  };
  return (
    <div className="flex-shrink-0 bg-white/95 border-t border-slate-100 flex items-center" style={{ height: 60 }}>
      {items.map(it => {
        const on = active(it.id);
        return (
          <button key={it.id} onClick={() => go(it.id)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 h-full active:bg-slate-50 transition"
            style={{ color: on ? '#DC2626' : '#94A3B8' }}>
            <div className="relative">
              <Icon name={it.icon} size={22} strokeWidth={on ? 2.6 : 2} />
              {it.badge && !on && (
                <span className="absolute -top-0.5 -right-2 w-[15px] h-[15px] rounded-full bg-mr text-white text-[9px] font-black flex items-center justify-center">{it.badge}</span>
              )}
            </div>
            <span className="text-[10.5px] font-bold leading-none">{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// expose
Object.assign(window, { Icon, Logo, Btn, Field, StatusBar, AppHeader, StepBar, Chip, BottomNav, SHOW_BN_SCREENS });
