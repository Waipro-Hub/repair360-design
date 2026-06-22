# Twenty CRM — riparasubito.tech

Configurazione completa Twenty CRM v2.14.0 self-hosted per officina riparazioni device.

## File
| File | Cosa |
|------|------|
| `pricing-wall.html` | Web app preventivo A+B+C standalone (LIVE su /preventivo) |
| `docker-compose.yml` | Stack: twenty-server + worker + postgres16 + redis |
| `.env.example` | Tutte le variabili (app, DB, Redis, Wasabi, SMTP) |
| `scripts/backup.sh` | pg_dump + volumi → Wasabi, rotazione 14gg |
| `twenty-schema.json` | Custom objects Riparazione + Ricambio |
| `workflows.json` | 4 workflow: notifica stato, invio preventivo, reminder, auto-capture email |

## Deploy
1. Copia `.env.example` → `.env`, compila i segreti.
2. `docker compose up -d` (o via Coolify).
3. Crea i custom objects da `twenty-schema.json` (Settings > Data model).
4. Ricrea i workflow da `workflows.json` (Settings > Workflows).
5. Collega mailbox info@riparasubito.tech per l'auto-capture (WF4).
6. Cron backup: `15 3 * * * /opt/twenty/scripts/backup.sh`

Dominio: https://crm.riparasubito.tech
