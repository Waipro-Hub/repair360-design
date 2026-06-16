/* ============================================================
   MrPhone — Repair360  ·  Mock data
   (Italian copy; prices framed "a partire da", never exact)
   ============================================================ */

// ---- Device categories ----
const DEVICES = [
  { id: 'smartphone', label: 'Smartphone', icon: 'smartphone' },
  { id: 'tablet', label: 'Tablet', icon: 'tablet' },
  { id: 'smartwatch', label: 'Smartwatch', icon: 'watch' },
];

// ---- Brands (wordmark rendered with brand color) ----
const BRANDS = [
  { id: 'apple', label: 'Apple', color: '#0F172A', mark: '' },
  { id: 'samsung', label: 'Samsung', color: '#1428A0' },
  { id: 'xiaomi', label: 'Xiaomi', color: '#FF6900' },
  { id: 'huawei', label: 'Huawei', color: '#C7000B' },
  { id: 'google', label: 'Google', color: '#1A73E8' },
  { id: 'oneplus', label: 'OnePlus', color: '#EB0029' },
  { id: 'oppo', label: 'OPPO', color: '#1BA784' },
  { id: 'motorola', label: 'Motorola', color: '#0B5CFF' },
];

// ---- Models per brand+device ----
const MODELS = {
  apple: ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13', 'iPhone 13 mini', 'iPhone 12', 'iPhone 11', 'iPhone SE (2022)'],
  samsung: ['Galaxy S24 Ultra', 'Galaxy S24', 'Galaxy S23', 'Galaxy S22', 'Galaxy A55', 'Galaxy A54', 'Galaxy A34', 'Galaxy Z Flip5', 'Galaxy Note 20'],
  xiaomi: ['Redmi Note 13 Pro', 'Redmi Note 13', 'Redmi Note 12', '13T Pro', 'Mi 11', 'Poco X6 Pro', 'Poco X5'],
  huawei: ['P60 Pro', 'P50', 'P40 Lite', 'Mate 50', 'Nova 11', 'Nova 9'],
  google: ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7a', 'Pixel 7', 'Pixel 6'],
  oneplus: ['12', '11', 'Nord 3', 'Nord CE 3', '10 Pro'],
  oppo: ['Find X6 Pro', 'Reno 10', 'Reno 8', 'A98', 'A78'],
  motorola: ['Edge 40 Pro', 'Edge 40', 'Moto G84', 'Moto G54', 'Razr 40'],
};
const TABLET_MODELS = {
  apple: ['iPad Pro 12.9"', 'iPad Air', 'iPad 10', 'iPad mini'],
  samsung: ['Galaxy Tab S9', 'Galaxy Tab A9', 'Galaxy Tab S8'],
};
const WATCH_MODELS = {
  apple: ['Apple Watch Series 9', 'Apple Watch SE', 'Apple Watch Ultra 2'],
  samsung: ['Galaxy Watch 6', 'Galaxy Watch 5'],
};
function modelsFor(brand, device) {
  if (device === 'tablet') return TABLET_MODELS[brand] || ['Modello generico'];
  if (device === 'smartwatch') return WATCH_MODELS[brand] || ['Modello generico'];
  return MODELS[brand] || ['Modello generico'];
}

// ---- Problems (8 tiles) ----
const PROBLEMS = [
  { id: 'schermo', label: 'Schermo', icon: 'smartphone', from: 49, desc: 'Vetro o display rotto, touch che non risponde' },
  { id: 'batteria', label: 'Batteria', icon: 'battery', from: 39, desc: 'Si scarica in fretta, si spegne da sola' },
  { id: 'non_carica', label: 'Non Carica', icon: 'zap', from: 35, desc: 'Connettore o porta di ricarica' },
  { id: 'non_accende', label: 'Non si Accende', icon: 'power', from: 29, desc: 'Schermo nero, nessun segno di vita' },
  { id: 'audio', label: 'Audio', icon: 'volume', from: 39, desc: 'Altoparlante, microfono, capsula' },
  { id: 'fotocamera', label: 'Fotocamera', icon: 'camera', from: 45, desc: 'Foto sfocate, vetro camera rotto' },
  { id: 'software', label: 'Software', icon: 'cpu', from: 29, desc: 'Blocchi, aggiornamenti, ripristino' },
  { id: 'liquidi', label: 'Danni Liquidi', icon: 'droplet', from: 49, desc: 'Caduta in acqua, ossidazione' },
];

// ---- Unlock code options ----
const UNLOCK = [
  { id: 'nessuno', label: 'Nessuno', icon: 'check-circle', desc: 'Il dispositivo non ha blocco' },
  { id: 'pin', label: 'PIN', icon: 'hash', desc: 'Codice numerico' },
  { id: 'segno', label: 'Segno', icon: 'grid', desc: 'Sequenza 3×3' },
];

// ---- Good–Better–Best ricambi (per problema "schermo" come esempio guida) ----
const QUALITY_TIERS = [
  { id: 'compatibile', label: 'Compatibile', badge: 'Conveniente', from: 49, warranty: '6 mesi', desc: 'Ricambio di qualità selezionata, testato uno per uno.' },
  { id: 'premium', label: 'Compatibile Premium', badge: 'Più scelto', from: 69, warranty: '12 mesi', desc: 'Resa colore e luminosità vicine all’originale.' },
  { id: 'originale', label: 'Originale', badge: 'Top', from: 99, warranty: '12 mesi', desc: 'Componente originale del produttore.' },
];

const ONLINE_DISCOUNT = 15; // leva "non paghi i 15€ di gestione"

// ---- Customer recognized via OTP lookup ----
const KNOWN_CUSTOMER = {
  nome: 'Mario', cognome: 'Rossi', telefono: '333 1234567', email: 'mario.rossi@gmail.com',
  status: 'cliente', since: '2023', visite: 4,
};

// ---- Existing customer's tickets / history ----
const SEED_TICKETS = [
  { code: 'PT-014', type: 'PT', device: 'iPhone 14 Pro', brand: 'apple', problem: 'Schermo', status: 'in_lavorazione', created: 'Oggi, 09:24', tier: 'premium', estimate: 89, ahead: 2 },
];
const HISTORY = [
  { code: 'WT-198', device: 'iPhone 13', problem: 'Batteria', status: 'consegnato', date: '12 Mar 2026', price: 59 },
  { code: 'WT-142', device: 'iPad Air', problem: 'Schermo', status: 'consegnato', date: '04 Nov 2025', price: 119 },
  { code: 'WT-090', device: 'iPhone 13', problem: 'Non Carica', status: 'consegnato', date: '21 Lug 2025', price: 45 },
];

// ---- Repair status flow (Italian) ----
const STATUS_FLOW = [
  { id: 'ricevuto', label: 'Ricevuto', icon: 'package', desc: 'Abbiamo preso in carico il tuo dispositivo' },
  { id: 'diagnosi', label: 'Diagnosi', icon: 'search', desc: 'Stiamo individuando il problema' },
  { id: 'in_lavorazione', label: 'In lavorazione', icon: 'wrench', desc: 'Il tecnico sta riparando' },
  { id: 'pronto', label: 'Pronto', icon: 'check-circle', desc: 'Puoi venire a ritirarlo' },
];
const STATUS_LABEL = { ricevuto: 'Ricevuto', diagnosi: 'Diagnosi', in_lavorazione: 'In lavorazione', pronto: 'Pronto' };

// ---- Live queue (PT before WT) ----
const SEED_QUEUE = [
  { code: 'PT-014', type: 'PT', name: 'M. Rossi', state: 'in_corso' },
  { code: 'PT-015', type: 'PT', name: 'L. Bianchi', state: 'attesa' },
  { code: 'WT-003', type: 'WT', name: 'G. Verdi', state: 'attesa' },
  { code: 'WT-004', type: 'WT', name: 'A. Ferrari', state: 'attesa' },
  { code: 'WT-005', type: 'WT', name: 'S. Conti', state: 'attesa' },
];

// ---- Giorgia chat quick replies + scripted answers ----
const GIORGIA_GREETING = 'Ciao! Sono Giorgia di MrPhone 👋 Posso darti un’idea di prezzo, prenotare un posto in coda o farti richiamare. Dimmi pure!';
const GIORGIA_QUICK = [
  { id: 'prezzo', label: '💶 Quanto costa?', tool: 'calcola_prezzo' },
  { id: 'coda', label: '🎟️ Prenota in coda', tool: 'prenota_coda' },
  { id: 'orari', label: '🕑 Orari e dove siete', tool: null },
  { id: 'lead', label: '📞 Fatemi richiamare', tool: 'salva_lead' },
];

// ---- Demo quote seed (used by ensureQuote + PayScreen) ----
const DEMO_QUOTE = { phone: '333 1234567', mode: 'riparazione', device: 'smartphone', brand: 'apple', model: 'iPhone 14 Pro', problem: 'schermo', unlock: 'pin', tier: 'premium', online: true, photos: [], invoice: false };


// expose
Object.assign(window, {
  DEVICES, BRANDS, MODELS, modelsFor, PROBLEMS, UNLOCK, QUALITY_TIERS, ONLINE_DISCOUNT,
  KNOWN_CUSTOMER, SEED_TICKETS, HISTORY, STATUS_FLOW, STATUS_LABEL, SEED_QUEUE,
  GIORGIA_GREETING, GIORGIA_QUICK, DEMO_QUOTE,
});

// ---- Brand wordmark tile ----
function BrandMark({ brand, size = 'md' }) {
  const big = size === 'lg';
  return (
    <span className="font-black tracking-tight" style={{ color: brand.color, fontSize: big ? 22 : 18, letterSpacing: '-0.03em' }}>
      {brand.label}
    </span>
  );
}
window.BrandMark = BrandMark;
