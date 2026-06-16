# 🎨 Repair360 — DESIGN SOURCE (modello canonico 1:1)

> Questo è il **modello preciso** di come deve essere fatto il prodotto Repair360.
> Salvato in git apposta: se l'account Claude/design si blocca, QUALSIASI account
> riparte da qui e vede il design esatto. NON cancellare.

## Cosa c'è qui
- `index.html` — il **tailwind.config** ufficiale: token colore `mr` (#DC2626…) e `ink` (#0F172A), font Inter. È la base di tutto.
- `screens-auth-home.jsx` — Login (telefono+OTP), Home, Profilo, Sitemap
- `screens-wizard.jsx` — Wizard preventivo (marca→modello→guasto→prezzo)
- `screens-ticket-queue.jsx` — Conferma ticket, Coda
- `screens-extra.jsx` — Traccia riparazione
- `screens-team.jsx` / `chat-marco.jsx` — Gestionale Marco
- `repair.html` — Hub Repair360
- `partner.html` / `partner.live.html` — Landing partner B2B
- `journey.html` / `journey-map.html` — Service blueprint / journey
- `yodeck.html` — Signage TV (Vetrina360)
- `produzione.html` — Centro di produzione
- `manifest.json` — PWA
- `shopify/` — template Liquid + sezioni di riferimento

## Palette per tenant (stessa struttura, cambia solo il colore `mr`)
| Tenant | mr (primario) | sfondo |
|---|---|---|
| RiparaSubito | #FF6B00 (hover #ea580c) | crema #FFF7ED |
| MrPhone | #DC2626 | bianco |
| TEC Perugia | #1E40AF | bianco |

## Dove gira il prodotto VERO (non qui)
- App live: `app.mrphone.tech/app?tenant=<slug>` (middleware Node, PM2 `rs-custom-app`)
- Sorgente runtime: `clients/riparasubito/4-Sviluppo/custom-app-runtime/routes/app.js`
- Stato/consegna: `clients/mrphone/PRODOTTO-FINITO-MRPHONE.md` + `clients/riparasubito/AGGIORNAMENTO-LIVE.md`

## Origine
Pacchetto Claude AI "MrPhone — Repair360 Flusso Completo" + ZIP handoff. Copiato qui il 2026-06-16.
