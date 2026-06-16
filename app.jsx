/* ============================================================
   MrPhone — Repair360  ·  Store · Router · App shell · mount
   ============================================================ */

const STORE_KEY = 'mrphone_repair360_v1';
const DEMO_KEY = 'mrphone_demo_state';
// DEMO_QUOTE comes from data.jsx (global)
// Demo mode: index.html?demo=1 reads an isolated state key and never persists,
// so the Demo Live tour can drive screens without polluting the real web app.
const _params = new URLSearchParams(location.search);
const IS_DEMO = _params.get('demo') === '1' || location.hash.indexOf('demo') !== -1;
const ACTIVE_KEY = IS_DEMO ? DEMO_KEY : STORE_KEY;

const SCREENS = {
  index: SitemapScreen, login: LoginScreen, otp: OtpScreen,
  home: HomeExisting, 'home-new': HomeNew, profile: ProfileScreen,
  wizard: WizardScreen, pricegate: PriceGateScreen, tickettype: TicketTypeScreen,
  slotpicker: SlotPickerScreen, confirm: ConfirmScreen,
  repair: RepairScreen, payscreen: PayScreen,
  notifiche: NotificheScreen, blueprint: BlueprintScreen,
  'admin-login': AdminLoginScreen, 'staff-view': StaffViewScreen, team: TeamManageScreen,
};
const SHOW_CHAT = new Set(['index', 'home', 'home-new', 'profile', 'repair', 'blueprint']);

function App() {
  const restored = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem(ACTIVE_KEY)) || {}; } catch { return {}; }
  }, []);

  // 'queue' is a kiosk/TV screen — never a valid entry point for the consumer app.
  // On a normal load, boot to the sitemap hub instead of getting stuck on it.
  const bootScreen = (() => {
    const s = restored.screen || 'index';
    if (!IS_DEMO && s === 'queue') return 'index';
    return s;
  })();
  const [screen, setScreen] = React.useState(bootScreen);
  const [data, setData] = React.useState(restored.data || { phone: '', isExisting: true, customer: null, verified: false, quote: null, ticket: null, tickets: null });
  const [chatOpen, setChatOpen] = React.useState(false);
  const [marcoOpen, setMarcoOpen] = React.useState(false);
  const [marcoEvent, setMarcoEvent] = React.useState('idle');
  const histRef = React.useRef([screen]);
  const scrollRef = React.useRef(null);

  // persist (skipped in demo mode so the tour never pollutes the real app state)
  React.useEffect(() => {
    if (IS_DEMO) return;
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ screen, data })); } catch {}
  }, [screen, data]);

  // scroll to top on screen change
  React.useEffect(() => { scrollRef.current?.scrollTo({ top: 0 }); }, [screen]);

  const nav = (s, p) => {
    if (s !== screen) { histRef.current.push(s); }
    setChatOpen(false);
    setScreen(s);
  };
  const back = () => {
    histRef.current.pop();
    setScreen(histRef.current[histRef.current.length - 1] || 'index');
  };
  const set = (partial) => setData((d) => ({ ...d, ...partial }));
  const notifyMarco = (ev) => setMarcoEvent(ev);

  const ensureQuote = () => { setData((d) => (d.quote ? d : { ...d, quote: DEMO_QUOTE, verified: true })); };
  const ensureTicket = (type = 'PT', extra = {}) => {
    setData((d) => {
      const q = d.quote || DEMO_QUOTE;
      const brand = BRANDS.find((b) => b.id === q.brand);
      const prob = PROBLEMS.find((p) => p.id === q.problem);
      const device = `${brand?.label || 'Apple'} ${q.model || 'iPhone 14 Pro'}`;
      const code = type === 'PT' ? 'PT-014' : 'WT-003';
      const ahead = type === 'PT' ? 2 : 5;
      const existing = extra.status ? extra : {};
      return { ...d, quote: q, verified: true, ticket: { code, type, ahead, status: 'ricevuto', device, problem: prob?.label || 'Schermo', ...extra, ...existing } };
    });
  };

  const api = { screen, data, nav, back, set, notifyMarco, ensureQuote, ensureTicket, chatOpen, setChatOpen, marcoOpen, setMarcoOpen, marcoEvent };

  const Screen = SCREENS[screen] || SitemapScreen;
  const isQueue = screen === 'queue';

  return (
    <MrCtx.Provider value={api}>
      {isQueue ? (
        <QueueScreen />
      ) : (
        <div className="rs-app min-h-screen flex flex-col">
          {/* prototype toolbar */}
          <div className="flex items-center justify-between px-4 sm:px-6 h-[52px] bg-white border-b border-slate-200 z-30">
            <button onClick={() => nav('index')} className="flex items-center gap-2.5 group">
              <Logo size={18} />
              <span className="hidden sm:inline text-[12px] font-bold text-ink-faint group-hover:text-ink-mute">Repair360 · anteprima</span>
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => nav('index')} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12.5px] font-extrabold text-ink-soft hover:bg-slate-100 transition whitespace-nowrap"><Icon name="list" size={15} /> <span className="hidden sm:inline">Mappa</span></button>
              <button onClick={() => setMarcoOpen(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12.5px] font-extrabold text-white bg-ink hover:bg-ink-soft transition whitespace-nowrap"><Icon name="headset" size={15} /> Vista Marco</button>
            </div>
          </div>

          {/* centered device frame */}
          <div className="flex-1 flex items-stretch sm:items-start justify-center sm:py-6 bg-slate-200">
            <div className="relative w-full sm:w-[428px] flex flex-col bg-white overflow-hidden sm:rounded-[40px] sm:shadow-2xl sm:shadow-slate-400/40 sm:border-[10px] sm:border-ink"
              style={{ height: 'calc(100vh - 52px)', maxHeight: '900px' }}>
              <StatusBar />
              <div ref={scrollRef} className="flex-1 min-h-0 flex flex-col relative">
                <Screen />
              </div>
              {SHOW_CHAT.has(screen) && <GiorgiaChat />}
            </div>
          </div>
        </div>
      )}

      {/* Giorgia chat is rendered inside frame above */}
      <MarcoPanel />
    </MrCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
