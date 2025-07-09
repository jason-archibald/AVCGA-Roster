-- Comprehensive data seeding
INSERT INTO permission_categories (name, description) VALUES
    ('User Management', 'Permissions related to managing users and members'),
    ('Roster Management', 'Permissions for creating and managing rosters'),
    ('Asset Management', 'Permissions for managing vessels, vehicles, and equipment'),
    ('Training Management', 'Permissions for managing training programs'),
    ('MSAR Operations', 'Permissions for marine search and rescue operations'),
    ('Administrative', 'Administrative and system permissions'),
    ('Reporting', 'Access to reports and analytics')
ON CONFLICT (name) DO NOTHING;

-- Seed permissions
WITH categories AS (SELECT id, name FROM permission_categories)
INSERT INTO permissions (category_id, name, code, description)
SELECT c.id, p.name, p.code, p.description
FROM categories c
CROSS JOIN (VALUES
    ('User Management', 'View Users', 'users.view', 'View user profiles'),
    ('User Management', 'Create Users', 'users.create', 'Create new users'),
    ('User Management', 'Edit Users', 'users.edit', 'Edit user profiles'),
    ('User Management', 'Delete Users', 'users.delete', 'Delete users'),
    ('Roster Management', 'View Rosters', 'rosters.view', 'View rosters'),
    ('Roster Management', 'Create Rosters', 'rosters.create', 'Create rosters'),
    ('Asset Management', 'View Assets', 'assets.view', 'View assets'),
    ('Asset Management', 'Manage Assets', 'assets.manage', 'Manage assets'),
    ('Administrative', 'System Admin', 'admin.system', 'System administration')
) AS p(category_name, name, code, description)
WHERE c.name = p.category_name
ON CONFLICT (code) DO NOTHING;

-- Assign permissions to roles
WITH perms AS (SELECT id, code FROM permissions)
INSERT INTO role_permissions (role_name, permission_id)
SELECT r.role_name::user_role, p.id
FROM (VALUES
    ('Member', 'rosters.view'), ('Member', 'assets.view'),
    ('FlotillaCommander', 'users.view'), ('FlotillaCommander', 'users.edit'),
    ('FlotillaCommander', 'rosters.view'), ('FlotillaCommander', 'rosters.create'),
    ('SquadronCommander', 'users.view'), ('SquadronCommander', 'users.create'),
    ('SquadronCommander', 'users.edit'), ('SquadronCommander', 'rosters.view'),
    ('SquadronCommander', 'rosters.create'), ('SquadronCommander', 'assets.view'),
    ('SquadronCommander', 'assets.manage'),
    ('SuperAdmin', 'users.view'), ('SuperAdmin', 'users.create'),
    ('SuperAdmin', 'users.edit'), ('SuperAdmin', 'users.delete'),
    ('SuperAdmin', 'rosters.view'), ('SuperAdmin', 'rosters.create'),
    ('SuperAdmin', 'assets.view'), ('SuperAdmin', 'assets.manage'),
    ('SuperAdmin', 'admin.system')
) AS r(role_name, permission_code)
JOIN perms p ON p.code = r.permission_code
ON CONFLICT (role_name, permission_id) DO NOTHING;

-- Seed facilities for VF04 Westernport
INSERT INTO facilities (name, facility_type, capacity, location, equipment_available, notes, flotilla_id)
SELECT 
    t.name, t.facility_type, t.capacity, t.location, t.equipment_available, t.notes, f.id
FROM (VALUES
    ('VF04 Main Training Room', 'Training Room', 25, 'Westernport HQ - Training Wing', 
     ARRAY['Projector', 'Whiteboard', 'Tables', 'Chairs'], 'Primary training facility'),
    ('VF04 Briefing Room', 'Meeting Room', 12, 'Westernport HQ - Operations Centre',
     ARRAY['Conference Table', 'Video Conference', 'Screen'], 'Command briefing room')
) AS t(name, facility_type, capacity, location, equipment_available, notes)
CROSS JOIN (SELECT id FROM flotillas WHERE name = 'VF04 Westernport') f
ON CONFLICT DO NOTHING;

-- Seed equipment for VF04 Westernport
INSERT INTO equipment (name, equipment_type, model, status, location, notes, flotilla_id)
SELECT 
    t.name, t.equipment_type, t.model, t.status, t.location, t.notes, f.id
FROM (VALUES
    ('VF04 VHF Radio CH1', 'Communication', 'Icom IC-M423G', 'Available', 'Communications Centre', 'Primary radio'),
    ('VF04 GPS Unit Alpha', 'Navigation', 'Garmin GPSMAP', 'Available', 'Equipment Store', 'Portable GPS'),
    ('VF04 First Aid Kit A', 'Medical', 'Marine First Aid Kit', 'Available', 'Medical Store', 'Comprehensive kit')
) AS t(name, equipment_type, model, status, location, notes)
CROSS JOIN (SELECT id FROM flotillas WHERE name = 'VF04 Westernport') f
ON CONFLICT DO NOTHING;

\echo 'All data seeded successfully for VF04 Westernport.';
