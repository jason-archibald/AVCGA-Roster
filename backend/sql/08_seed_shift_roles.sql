-- Seed data for shift roles
INSERT INTO shift_roles (name, description) VALUES 
    ('Coxswain', 'Boat operator and crew leader'),
    ('Crew Member', 'General crew member'),
    ('Radio Operator', 'Communications specialist'),
    ('First Aid Officer', 'Medical response specialist'),
    ('Navigator', 'Navigation and chart specialist'),
    ('Engineer', 'Mechanical and technical specialist')
ON CONFLICT (name) DO NOTHING;

\echo 'Shift roles seeded.'
