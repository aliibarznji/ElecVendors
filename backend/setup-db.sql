-- Run as postgres superuser
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'electromall') THEN
    CREATE ROLE electromall WITH LOGIN PASSWORD 'secret';
  END IF;
END
$$;

CREATE DATABASE electromall_vendors OWNER electromall;
GRANT ALL PRIVILEGES ON DATABASE electromall_vendors TO electromall;
