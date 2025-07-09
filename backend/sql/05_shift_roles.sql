-- Shift roles for roster assignments
DROP TABLE IF EXISTS shift_roles CASCADE;

CREATE TABLE shift_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    required_qualifications UUID[],
    min_experience_months INTEGER DEFAULT 0,
    max_per_roster INTEGER DEFAULT 1,
    is_leadership_role BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert standard shift roles
INSERT INTO shift_roles (name, description, min_experience_months, max_per_roster, is_leadership_role) VALUES
    ('Incident Commander', 'Overall command of operations', 60, 1, true),
    ('Coxswain', 'Vessel command and navigation', 24, 2, true),
    ('Crew Leader', 'Team leadership and coordination', 12, 3, true),
    ('Crew Member', 'General crew duties', 0, 8, false),
    ('First Aid Officer', 'Medical response and care', 6, 2, false),
    ('Engineer', 'Technical and mechanical support', 12, 2, false),
    ('Communications', 'Radio and communication duties', 3, 2, false),
    ('Observer', 'Training and assessment observer', 0, 3, false),
    ('Trainee', 'Member under training', 0, 5, false);

\echo 'Shift roles seeded.';
