On deploy the Postgres DB (Production) needs to be updated to include
created
last_activity_date

timestamp type fields

last_activity_date can be null

created can be backfilled with today's date for all old records
