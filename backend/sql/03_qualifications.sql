DROP TABLE IF EXISTS qualifications CASCADE;
CREATE TABLE qualifications (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name VARCHAR(255) UNIQUE NOT NULL, description TEXT, expiry_period_months INTEGER);
\echo 'Table "qualifications" created.'
