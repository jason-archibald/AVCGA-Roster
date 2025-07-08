DROP TABLE IF EXISTS vessels CASCADE; DROP TABLE IF EXISTS vehicles CASCADE; DROP TYPE IF EXISTS asset_status CASCADE;
CREATE TYPE asset_status AS ENUM ('Operational', 'Maintenance', 'Decommissioned');
CREATE TABLE vessels (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name VARCHAR(100) UNIQUE NOT NULL, call_sign VARCHAR(20) UNIQUE, status asset_status NOT NULL DEFAULT 'Operational', notes TEXT);
CREATE TABLE vehicles (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name VARCHAR(100) UNIQUE NOT NULL, registration VARCHAR(20) UNIQUE, status asset_status NOT NULL DEFAULT 'Operational', notes TEXT);
\echo 'Tables "vessels" and "vehicles" created.'
