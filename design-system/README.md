# WAIPRO · Repair360 — Design System (fondazione multi-tenant)

Sistema **un solo design, N account**. Ogni design che costruisci deve essere on-brand usando i token di `styles.css`. Per cambiare brand imposta `data-brand` sull'elemento radice: `riparasubito` (default), `mrphone`, `tec`. Aggiungere un nuovo cliente = aggiungere un blocco `[data-brand="<slug>"]` in `styles.css`.

## Come costruire (frizione zero, stile Paolo Borzacchiello)
- **Una sola azione primaria per schermata.** Bottoni grandi e netti (`.rd-btn`, min 56px), etichetta chiara.
- L'AI/UI viene incontro all'utente: default intelligenti, microcopy educativo (ⓘ Spiegami), empty-state guidati.
- Mobile-first; le web-app cliente sono percepite native (PWA), identità = numero di cellulare (+39 precompilato) + OTP.

## Token (usa SEMPRE questi, non inventare)
- **Colore brand:** `var(--brand)`, `var(--brand-ink)`, `var(--brand-soft)`, `var(--brand-strong)`.
- **Superfici:** `var(--surface)`, `var(--surface-2)`, `var(--bg-app)`. **Neutri:** `var(--ink)`, `var(--muted)`, `var(--line)`.
- **Stato:** `var(--ok)`, `var(--warn)`, `var(--bad)`, `var(--info)`.
- **Tipo:** `var(--font-sans)` (Inter), pesi `--font-regular…--font-black`, scala `--text-xs…--text-4xl`.
- **Raggio:** `--radius-sm…--radius-xl`, `--radius-full`. **Spazi:** `--space-1…--space-12`. **Ombre:** `--shadow-sm/md/lg`.
- **Raggio card per brand:** `var(--card-radius)` (RiparaSubito 2rem, MrPhone/TEC 1.5rem).

## Primitive pronte
`.rd-btn` (primario) · `.rd-btn--ghost` (secondario) · `.rd-card` · `.rd-pill`.

## Regole brand LOCKED (non violare)
- **RiparaSubito:** arancio `#FF6B00`, crema `#fff7ed`, card bianche radius 2rem, stile Vodafone (bottoni grandi/netti).
- **MrPhone:** rosso `#DC2626`. Le schermate **app/gestionale sono SEMPRE tema chiaro** (il sito mrphone.tech è scuro a parte). Mascotte solo nell'header del sito, mai nelle schermate app.
- **TEC Perugia:** multiservizi, accent blu `#0F4C81` (da confermare col tema reale TEC).
- Display TV/coda: sfondo chiaro, numero gigante, contrasto alto, zero caos (stile Poste).
- Loghi marca nei wizard: lineari, nitidi, NON colorati.

## Keyword prezzi (applica proattivamente)
diagnosi gratuita non vincolante · soglia di scostamento · good-better-best · microcopy educativo (ⓘ Spiegami).
