# Database Backup Guideline

## PostgreSQL backup (container)
```bash
docker compose exec -T postgres pg_dumpall -U "$POSTGRES_USER" > backups/all-databases.sql
```

## Restore
```bash
cat backups/all-databases.sql | docker compose exec -T postgres psql -U "$POSTGRES_USER"
```

## Recommended schedule
- Daily full backup.
- Retain 7 daily, 4 weekly, 6 monthly.
- Encrypt backup artifact before offsite upload.
