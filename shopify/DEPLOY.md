# Shopify Liquid — Deploy Guide
# Repair360 · MrPhone · mrphone3.myshopify.com · tema 196970512709

## Struttura files da caricare in Shopify Admin > Temi > Modifica codice

```
shopify/
├── assets/
│   ├── repair360.css          → assets/repair360.css
│   └── repair360-partner.css  → assets/repair360-partner.css
├── sections/
│   ├── r360-hub.liquid        → sections/r360-hub.liquid
│   ├── r360-partner.liquid    → sections/r360-partner.liquid
│   └── r360-demo.liquid       → sections/r360-demo.liquid
└── templates/
    ├── page.r360-hub.json     → templates/page.r360-hub.json
    ├── page.r360-partner.json → templates/page.r360-partner.json
    └── page.r360-demo.json    → templates/page.r360-demo.json
```

## Step deploy

1. Apri Shopify Admin → Temi → "..." → Modifica codice
2. Per ogni file in `sections/`: click "+ Aggiungi sezione", incolla il contenuto
3. Per ogni file in `templates/`: click "+ Aggiungi template", scegli tipo "page", incolla JSON
4. Per ogni file in `assets/`: click "+ Aggiungi asset", carica il file CSS/JS
5. Crea le pagine Shopify:
   - Page handle: `repair360` → assegna template `page.r360-hub`
   - Page handle: `partner` → assegna template `page.r360-partner`
   - Page handle: `demo` → assegna template `page.r360-demo`
6. Aggiungi metafield allo store: `repair360.tenant_id` = `mrphone`

## Variabili Liquid usate nelle sezioni

| Variabile | Valore per MrPhone |
|---|---|
| `{{ shop.name }}` | MrPhone |
| `{{ shop.metafields.repair360.tenant_id.value }}` | mrphone |
| `{{ shop.metafields.repair360.api_base.value }}` | https://api.riparasubito.tech |
| `{{ section.settings.hero_headline }}` | Configurabile da tema customizer |
| `{{ section.settings.partner_url }}` | /pages/partner |
| `{{ 'repair360.css' \| asset_url }}` | CDN Shopify |

## Build da Base44 (per assets React)

```bash
# Nel repo Waipro-Agency/riparosubito
npm install
npm run build
# Copiare dist/assets/*.js e dist/assets/*.css in shopify/assets/
```
