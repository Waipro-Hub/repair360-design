# ▶ RIPARASUBITO — START HERE

> **Quando Cristian scrive "RiparaSubito", si parte da QUI.**
> Punto di partenza unico, account-indipendente, su GitHub. Qualunque account/agente Claude apre questo file e sa esattamente dove andare. Niente si perde cambiando sessione.

## La regola (LOCKED — non si riapre)
Un solo prodotto: **Repair360**, multi-tenant. Ogni cliente = un **tenant** (come MrPhone, TEC, RiparaSubito). Si costruisce **UN core completo** → si **replica come template**. I clienti personalizzano sopra, non si riscrive niente.
- **Gestionale** = backend `:3213` (multi-tenant, dati reali: ~4.965 ticket / 3.817 clienti / 4.931 fatture)
- **Front** = monorepo Next `Waipro-Hub/riparasubito`
- **Vetrine** = Shopify (solo e-commerce, NON il gestionale)
- **Base44** (`Waipro-Hub/riparosubito`, col typo) = revisore + prototipo (43 schermate). Nessun file perso.
- **Astro** = morto · **Twenty** = opzione motore-dati, decisione al kickoff

## Dove sta tutto (le case)
| Cosa | Dove |
|---|---|
| 🚪 Porta d'ingresso / menu | https://workspace.riparasubito.tech |
| 📓 Diario di bordo | https://workspace.riparasubito.tech/start |
| 🗺️ Mappa del Servizio (blueprint live) | https://api.riparasubito.tech/design/blueprint/ |
| 🚶 Percorso del Cliente (journey live) | https://api.riparasubito.tech/design/journey/ |
| 🎨 Design System (token brand) | questo repo → `design-system/` + claude.ai/design |
| 🖥️ Gestionale live | https://repair360.riparasubito.tech |
| 💻 Front (codice) | github.com/Waipro-Hub/riparasubito |
| 🤖 Prototipo Base44 | github.com/Waipro-Hub/riparosubito |

## Documenti chiave (sul server `/root/WAIPRO/clients/riparasubito/`)
- `SPEC-TEMPLATE-CORE-23GIU.md` — la specifica del template: 4 ruoli, onboarding wizard auto-popolante (GMB/scraping/logo), invito collaboratori email+SMS, markup fornitore, i 4 buchi da chiudere.
- `PLAN-DEFINITIVO-RECUPERATO-23GIU.md` — il piano di sviluppo.
- `BENCHMARK-REPAIRDESK-23GIU.md` — i 10 pattern da copiare.

## Design System — come usarlo (frizione zero)
La fondazione brand è in `design-system/` (`styles.css` + `tokens/` + `README.md`). Multi-tenant: cambi brand con `data-brand="riparasubito|mrphone|tec"`. Aggiungere un cliente = un blocco brand in più. Principio: **frizione zero, l'AI viene incontro all'utente** (stile Paolo Borzacchiello).

## I 4 buchi del core da chiudere
1. Carta fedeltà · 2. B2B operativo · 3. Ruoli/accessi strutturati · 4. Pagamenti cablati.
Prossimo passo prodotto: **Accessi + inviti + onboarding** (il modulo che rende il template vendibile).

---
*Questo file è la fonte durevole. Aggiornarlo qui quando cambia la strategia. GitHub = verità, non i singoli account.*
