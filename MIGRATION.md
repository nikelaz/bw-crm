## Migration

```bash
podman exec -it <container_name_or_id> psql -U <username> -d bw
```

```sql
ALTER TABLE "user"
ADD COLUMN created TIMESTAMP NOT NULL DEFAULT now(),
ADD COLUMN last_activity_date TIMESTAMP NULL;
```

```sql
UPDATE "user"
SET created = now()
WHERE created IS NULL;
```

## Verification

```sql
SELECT * FROM "user" LIMIT 5;
```

## Description

Two new columns in the `user` table:

- `created` - timestamp; backfilled with today's date for old records;
- last_activity_date - timestamp;
