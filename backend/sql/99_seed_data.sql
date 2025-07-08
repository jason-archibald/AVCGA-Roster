-- This script runs last to populate all tables with initial data.
BEGIN;
\echo '--- Seeding Initial Data ---'

-- Seed Organization
\echo '--> Seeding Organization...'
INSERT INTO squadrons (name, description) VALUES ('QF1', 'Gold Coast') ON CONFLICT (name) DO NOTHING;
-- Use a WITH clause to safely capture the flotilla ID for use later
WITH new_flotilla AS (
    INSERT INTO flotillas (name, squadron_id, description)
    SELECT 'QF1 Southport', id, 'The primary Gold Coast Flotilla'
    FROM squadrons WHERE name = 'QF1'
    ON CONFLICT (name) DO NOTHING
    RETURNING id
)
-- Seed Super Admin "God Mode" User, linking to the flotilla created above
\echo '--> Seeding or Updating "God Mode" Super Admin User...'
INSERT INTO users (
    email, password, first_name, last_name, role, avcga_member_id, status,
    phone_primary, join_date, emergency_contact_name, emergency_contact_phone, personal_notes, flotilla_id
)
VALUES (
    'jason.archibald@archis-marine.online',
    'Archie1977',
    'Jason',
    'Archibald',
    'SuperAdmin',
    'AVCGA-001',
    'Active',
    '0400 123 456',
    '2022-01-15',
    'Jane Doe',
    '0411 987 654',
    'GOD member. Certified systems administrator.',
    (SELECT id FROM flotillas WHERE name = 'QF1 Southport')
)
ON CONFLICT (email) DO UPDATE SET
    password = EXCLUDED.password,
    role = EXCLUDED.role,
    status = EXCLUDED.status,
    flotilla_id = EXCLUDED.flotilla_id,
    updated_at = NOW();

\echo '--- Data Seeding Complete ---'
COMMIT;
