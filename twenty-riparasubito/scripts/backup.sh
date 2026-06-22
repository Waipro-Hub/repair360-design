#!/usr/bin/env bash
# ============================================================
#  Twenty CRM — backup giornaliero  ·  riparasubito.tech
#  pg_dump + snapshot volume server → Wasabi (S3), rotazione 14gg
#  Cron consigliato:  15 3 * * *  /opt/twenty/scripts/backup.sh
# ============================================================
set -euo pipefail

# ── Config (override via .env nella stessa cartella) ──
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -f "${SCRIPT_DIR}/../.env" ] && set -a && . "${SCRIPT_DIR}/../.env" && set +a

DB_CONTAINER="${DB_CONTAINER:-twenty-db}"
PG_USER="${PG_DATABASE_USER:-twenty}"
PG_DB="${PG_DATABASE_NAME:-default}"
S3_BUCKET="${BACKUP_S3_BUCKET:-riparasubito-twenty-backups}"
S3_ENDPOINT="${STORAGE_S3_ENDPOINT:-https://s3.eu-central-2.wasabisys.com}"
RETENTION="${BACKUP_RETENTION_DAYS:-14}"
WORKDIR="${WORKDIR:-/tmp/twenty-backup}"
STAMP="$(date +%Y%m%d-%H%M%S)"
LOG="/var/log/twenty-backup.log"

log(){ echo "[$(date '+%F %T')] $*" | tee -a "$LOG"; }
fail(){ log "ERRORE: $*"; exit 1; }

command -v aws >/dev/null 2>&1 || fail "aws-cli non installato"
docker ps --format '{{.Names}}' | grep -q "^${DB_CONTAINER}$" || fail "container ${DB_CONTAINER} non attivo"

mkdir -p "$WORKDIR"
DUMP="${WORKDIR}/twenty-db-${STAMP}.sql.gz"
VOLTAR="${WORKDIR}/twenty-server-local-${STAMP}.tar.gz"

# ── 1. Dump database ──
log "pg_dump di ${PG_DB} da ${DB_CONTAINER}…"
docker exec "$DB_CONTAINER" pg_dump -U "$PG_USER" -d "$PG_DB" --no-owner --clean --if-exists \
  | gzip > "$DUMP" || fail "pg_dump fallito"
log "dump OK ($(du -h "$DUMP" | cut -f1))"

# ── 2. Snapshot volume allegati locali ──
log "snapshot volume twenty_server-local-data…"
docker run --rm -v twenty_server-local-data:/data:ro -v "${WORKDIR}:/out" alpine \
  tar czf "/out/$(basename "$VOLTAR")" -C /data . || log "WARN: snapshot volume saltato (vuoto?)"

# ── 3. Upload su Wasabi ──
for f in "$DUMP" "$VOLTAR"; do
  [ -f "$f" ] || continue
  log "upload $(basename "$f") → s3://${S3_BUCKET}/"
  aws --endpoint-url "$S3_ENDPOINT" s3 cp "$f" "s3://${S3_BUCKET}/$(basename "$f")" \
    || fail "upload fallito per $f"
done

# ── 4. Rotazione (locale + remoto) ──
log "rotazione: tengo ultimi ${RETENTION} giorni"
find "$WORKDIR" -name 'twenty-*' -mtime +"$RETENTION" -delete 2>/dev/null || true
CUTOFF="$(date -d "-${RETENTION} days" +%Y%m%d 2>/dev/null || date -v-"${RETENTION}"d +%Y%m%d)"
aws --endpoint-url "$S3_ENDPOINT" s3 ls "s3://${S3_BUCKET}/" | awk '{print $4}' | while read -r key; do
  [ -z "$key" ] && continue
  kdate="$(echo "$key" | grep -oE '[0-9]{8}' | head -1)"
  [ -n "$kdate" ] && [ "$kdate" -lt "$CUTOFF" ] && \
    aws --endpoint-url "$S3_ENDPOINT" s3 rm "s3://${S3_BUCKET}/${key}" && log "rimosso vecchio: $key"
done

log "BACKUP COMPLETATO ✓"
