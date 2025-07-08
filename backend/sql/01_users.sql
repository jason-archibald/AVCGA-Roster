-- This is the single, definitive schema for the users table.

DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;

CREATE TYPE user_role AS ENUM ('Member', 'FlotillaExecutive', 'SquadronCommander', 'SuperAdmin');
CREATE TYPE user_status AS ENUM ('Active', 'OnLeave', 'Pending', 'Resigned');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    avcga_member_id VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Plain text for development
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_primary VARCHAR(50),
    phone_secondary VARCHAR(50),
    role user_role NOT NULL DEFAULT 'Member',
    status user_status NOT NULL DEFAULT 'Active',
    join_date DATE,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    personal_notes TEXT,
    flotilla_id UUID REFERENCES flotillas(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_avcga_member_id ON users(avcga_member_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

\echo 'Definitive "users" table schema created successfully.'
