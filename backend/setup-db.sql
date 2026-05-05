-- One-time setup script — run as postgres superuser before first deploy.
-- Replace STRONG_PASSWORD_HERE with a real password that matches POSTGRES_PASSWORD in your .env.
--
-- Example:
--   psql -U postgres -f setup-db.sql
--
-- Generate a strong password:
--   openssl rand -base64 32

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'electromall') THEN
    CREATE ROLE electromall WITH LOGIN PASSWORD 'STRONG_PASSWORD_HERE';
  END IF;
END
$$;

CREATE DATABASE electromall_vendors OWNER electromall;

-- Grant only what is needed — not superuser or all global privileges
GRANT CONNECT ON DATABASE electromall_vendors TO electromall;
GRANT CREATE ON DATABASE electromall_vendors TO electromall;
