DROP TABLE IF EXISTS shift_roles CASCADE;
CREATE TABLE shift_roles (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name VARCHAR(100) UNIQUE NOT NULL, description TEXT, qualification_required_id UUID REFERENCES qualifications(id) ON DELETE SET NULL);
\echo 'Table "shift_roles" created.'
