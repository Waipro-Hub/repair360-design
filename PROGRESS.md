# PROGRESS.md — RiparaSubito.tech · Repair360

> Stato vivo del progetto. Aggiornato a ogni milestone.
> Owner esecuzione: Head of Product + CTO executor (Claude) · Decisioni critiche: Cristian (CEO)
> Ultimo aggiornamento: **14 giu 2026**

---

## 0 · SCOPE & FONTI DI VERITÀ

| Layer | Dove vive | Chi lo tocca |
|---|---|---|
| **Demo / presentazione** | questo progetto (`mrphone/*.html`) | Claude (qui) — production-ready come asset commerciale |
| **Codebase reale** | `Waipro-Agency/riparosubito` (GitHub, privato) | Claude Code / dev team — solo lettura da qui |
| **Backend live** | `api.riparasubito.tech` · VPS `72.61.158.55` · PM2 `rs-custom-app` :3213 | dev team |
| **Storefront** | Shopify `mrphone3.myshopify.com` · tema `196970512709` | dev team |

⚠️ **Regola d'oro**: chiavi API (Telnyx, Yodeck, PayPal, Google Workspace) **mai nel client**. Restano lato server. Nel layer demo sono solo riferimenti d'architettura.

---

## 1 · AUDIT SINTETICO (stato al 14 giu 2026)

### ✅ Funzionante / consegnato (layer demo)
- **App PWA cliente** (`index.html`): OTP gate → wizard 8 step → prezzo "a partire da" → PT/WT → conferma → tracking → notifiche. Brand chiaro, mobile-first.
- **Hub operativo** (`repair.html`): clone di repair.riparasubito.tech + overlay device (Mac M1 / iPad 13" / iPhone / TV).
- **Marco 360°** (`journey.html`): gestionale 4 tab (Operativo/Clienti/Lab/Calendario), 6 stati interattivi.
- **Journey Map** (`journey-map.html`): 7 tappe × 3 percorsi (A/B/C), filtro, print mode, link live.
- **Partner onboarding** (`partner.html`): flusso tablet-first 4 step, stile a bassa frizione.
- **Yodeck signage** (`yodeck.html`): dual-panel, upload spot, slide YouTube, vista laterale, ticker, radio, TTS.
- **Demo Live** (`demo.html`): tour auto-riprodotto narrato — converte il cliente. ← Milestone 1.

### 🟠 Gap noti — codebase reale (da chiudere prima del go-live)
| # | Gap | Effort | Priorità |
|---|---|---|---|
| 01 | localStorage key errata: `app_session_token` → deve essere `app_session_mrphone` (multi-tenant) | 2h | 🔴 P0 |
| 02 | Deposito PT: prodotto Shopify + webhook `orders/paid` → promuove ticket a PT | 6–8h | 🔴 P0 |
| 03 | Collaudo Giorgia E2E: chiamata reale a +39 075 3690089, verifica 3 tool | 2–4h | 🟠 P1 |
| 04 | Garanzia incoerente (12 mesi / 6 mesi / 90 giorni su pagine diverse) → uniformare a 12 mesi | 1h | 🟠 P1 |
| 05 | Onboarding partner: questionario sito non collegato a login base account | 4–6h | 🟡 P2 |
| 06 | Saldo Telnyx basso (+3.42 USD, 11 giu) → ricarica prima del lancio SMS massivo | 15min | 🔴 P0 |

### ✅ Risolti
- Prezzi preventivo: iPhone 13 + schermo → LCD OLED 38,89€ (non più vetrino camera 3,49€). Fix `bak-matching-1142` live.
- `OTP_DEBUG=0` confermato in produzione.

---

## 2 · ROADMAP A MILESTONE

- [x] **M1 — Demo Live che converte** ✅ *(fatta)*
      Tour auto-riprodotto narrato dentro il sistema. Play/pause/restart, captions, CTA conversione.
- [ ] **M2 — Hardening auth & sessione** *(codebase reale)*
      Fix localStorage key multi-tenant · ricarica Telnyx · OTP rate-limit verificato in staging.
- [ ] **M3 — Monetizzazione coda (deposito PT)**
      Prodotto Shopify deposito 10€ · webhook orders/paid · promozione automatica WT→PT.
- [ ] **M4 — Agenti AI in produzione**
      Collaudo Giorgia E2E (voice + WhatsApp) · 3 tool live · fallback "da 29€" se API giù.
- [ ] **M5 — Coerenza contenuti & SEO**
      Garanzia uniforme 12 mesi · meta/SEO portale rete · pagine pubbliche Shopify.
- [ ] **M6 — QA & deploy checklist**
      E2E dei 3 percorsi A/B/C · smoke test display TV · `.env.example` · build/migration notes.

---

## 3 · TASK IN CORSO
- Nessuno attivo. M1 chiusa. In attesa di go su M2 (richiede accesso write al repo reale).

## 4 · BLOCKER
- **B-01**: deploy/migration/segreti richiedono accesso write al repo + conferma CEO (regola 10). Da qui posso solo preparare la checklist e il codice; l'esecuzione la fa il dev team / Claude Code.

## 5 · PROSSIMA AZIONE
1. Validare la **Demo Live** (`demo.html`) come asset commerciale → usarla in pitch B2B/PMI.
2. Su repo reale: aprire branch `m2-auth-hardening`, applicare fix #01 + #06, testare in staging.

---

## 6 · DEPLOY CHECKLIST (preparata, non eseguita)
```
[ ] .env.example completo (TELNYX_*, YODECK_*, PAYPAL_*, GOOGLE_*, DB_URL, SHOPIFY_*)
[ ] Telnyx: saldo ricaricato · mittente brandizzato per tenant
[ ] OTP_DEBUG=0 in prod (✅ già confermato)
[ ] DB: backup pre-migration · isolamento tenant_id verificato
[ ] Shopify: tema 196970512709 · prodotto deposito PT creato
[ ] Webhook orders/paid → endpoint /api/quick-entry/promote
[ ] Display TV: polling 10s · fallback offline
[ ] PWA: manifest + service worker · key localStorage = app_session_<tenant>
[ ] Smoke test 3 percorsi (A portale, B banco, C lead)
[ ] Giorgia E2E: 3 tool verificati
[ ] STOP → conferma CEO prima di deploy live
```

## 7 · COMANDI BUILD (stack reale, da repo)
```bash
# frontend (Vite) — Base44 export
npm install
npm run build           # → dist/ statici su Shopify CDN
# middleware
pm2 restart rs-custom-app   # porta 3213
```

---

## DECISIONE ARCHITETTURALE DEFINITIVA — 23 giu 2026 (verificata sul VPS)

**Problema vero:** non e lo stack, e la proliferazione di copie dello stesso prodotto
(Base44 + gestionale bespoke :3213 + monorepo Next + Twenty + Astro). Ogni doc nuovo ne aggiunge una.

**Stato reale (verificato):**
- :3213 LIVE (repair360-core stabile + rs-custom-app in crash-loop, da sistemare). Dati reali.
- NESSUN Next.js gira sul VPS -> "monorepo gia in produzione" e aspirazionale (repo, non deploy).
- Monorepo Waipro-Hub/riparasubito NON e boilerplate vuoto: pagine vere (dashboard repairs/customers/fatture/calendar/coda/partner/analytics/agents, marketing prezzi/ricondizionati/migrazione, onboarding, admin). 57 tsx, commit 17/06.
- Design canonico (look + dinamiche) = questo repo (screens-*.jsx), sync via design-sync.

**Decisione (LOCKED):**
1. Front UNICO = monorepo Next.js Waipro-Hub/riparasubito. UI dalle dinamiche di repair360-design (screens-*.jsx), NON da Base44.
2. :3213 resta DIETRO come backend dati/operativo (o migrazione Neon al kickoff).
3. Twenty headless = ABBANDONATO. Astro = ABBANDONATO. Base44 = purgare progressivamente.
4. Bespoke :3213 = prototipo: innestare le parti migliori (Quick Entry 8-step, lookup SIFAR, profili tenant, sblocco pattern) nel monorepo, non tenerlo come 3a copia.
5. Gap board produzione.html = mantenuto a mano (NON Base44): da verificare contro stato reale.
