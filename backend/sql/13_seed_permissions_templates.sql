-- Seed permission categories
INSERT INTO permission_categories (name, description) VALUES
    ('User Management', 'Permissions related to managing users and members'),
    ('Roster Management', 'Permissions for creating and managing rosters'),
    ('Asset Management', 'Permissions for managing vessels, vehicles, and equipment'),
    ('Training Management', 'Permissions for managing training programs'),
    ('MSAR Operations', 'Permissions for marine search and rescue operations'),
    ('Administrative', 'Administrative and system permissions'),
    ('Reporting', 'Access to reports and analytics')
ON CONFLICT (name) DO NOTHING;

-- Seed individual permissions
WITH categories AS (
    SELECT id, name FROM permission_categories
)
INSERT INTO permissions (category_id, name, code, description)
SELECT 
    c.id,
    p.name,
    p.code,
    p.description
FROM categories c
CROSS JOIN (VALUES
    -- User Management
    ('User Management', 'View Users', 'users.view', 'View user profiles and information'),
    ('User Management', 'Create Users', 'users.create', 'Create new user accounts'),
    ('User Management', 'Edit Users', 'users.edit', 'Edit user profiles and settings'),
    ('User Management', 'Delete Users', 'users.delete', 'Delete user accounts'),
    ('User Management', 'Manage Roles', 'users.roles', 'Assign and modify user roles'),
    
    -- Roster Management
    ('Roster Management', 'View Rosters', 'rosters.view', 'View roster schedules'),
    ('Roster Management', 'Create Rosters', 'rosters.create', 'Create new rosters'),
    ('Roster Management', 'Edit Rosters', 'rosters.edit', 'Edit existing rosters'),
    ('Roster Management', 'Delete Rosters', 'rosters.delete', 'Delete rosters'),
    ('Roster Management', 'Manage Assignments', 'rosters.assignments', 'Assign members to rosters'),
    ('Roster Management', 'Manage Templates', 'rosters.templates', 'Create and manage roster templates'),
    
    -- Asset Management
    ('Asset Management', 'View Assets', 'assets.view', 'View vessels, vehicles, and equipment'),
    ('Asset Management', 'Manage Assets', 'assets.manage', 'Add, edit, and remove assets'),
    ('Asset Management', 'Schedule Assets', 'assets.schedule', 'Schedule asset usage and maintenance'),
    ('Asset Management', 'Manage Facilities', 'facilities.manage', 'Manage facilities and rooms'),
    
    -- Training Management
    ('Training Management', 'View Training', 'training.view', 'View training schedules and records'),
    ('Training Management', 'Conduct Training', 'training.conduct', 'Conduct training sessions'),
    ('Training Management', 'Manage Training', 'training.manage', 'Create and manage training programs'),
    ('Training Management', 'Assess Trainees', 'training.assess', 'Assess and certify trainees'),
    
    -- MSAR Operations
    ('MSAR Operations', 'View MSAR', 'msar.view', 'View MSAR incidents and operations'),
    ('MSAR Operations', 'Create MSAR', 'msar.create', 'Create MSAR incident rosters'),
    ('MSAR Operations', 'Command MSAR', 'msar.command', 'Act as incident commander'),
    ('MSAR Operations', 'Manage MSAR', 'msar.manage', 'Manage MSAR operations and resources'),
    
    -- Administrative
    ('Administrative', 'View Reports', 'admin.reports', 'Access reports and analytics'),
    ('Administrative', 'System Admin', 'admin.system', 'System administration access'),
    ('Administrative', 'Manage Organization', 'admin.organization', 'Manage organizational structure'),
    
    -- Reporting
    ('Reporting', 'Member Reports', 'reports.members', 'Generate member reports'),
    ('Reporting', 'Activity Reports', 'reports.activity', 'Generate activity reports'),
    ('Reporting', 'Asset Reports', 'reports.assets', 'Generate asset utilization reports')
) AS p(category_name, name, code, description)
WHERE c.name = p.category_name
ON CONFLICT (code) DO NOTHING;

-- Assign permissions to roles
WITH perms AS (
    SELECT id, code FROM permissions
)
INSERT INTO role_permissions (role_name, permission_id)
SELECT 
    r.role_name::user_role,
    p.id
FROM (VALUES
    -- Member permissions
    ('Member', 'rosters.view'),
    ('Member', 'assets.view'),
    ('Member', 'training.view'),
    
    -- CrewLeader permissions (inherits Member + additional)
    ('CrewLeader', 'rosters.view'),
    ('CrewLeader', 'rosters.assignments'),
    ('CrewLeader', 'assets.view'),
    ('CrewLeader', 'training.view'),
    ('CrewLeader', 'training.conduct'),
    
    -- Trainer permissions
    ('Trainer', 'rosters.view'),
    ('Trainer', 'rosters.create'),
    ('Trainer', 'training.view'),
    ('Trainer', 'training.conduct'),
    ('Trainer', 'training.manage'),
    ('Trainer', 'training.assess'),
    
    -- FlotillaCommander permissions
    ('FlotillaCommander', 'users.view'),
    ('FlotillaCommander', 'users.edit'),
    ('FlotillaCommander', 'rosters.view'),
    ('FlotillaCommander', 'rosters.create'),
    ('FlotillaCommander', 'rosters.edit'),
    ('FlotillaCommander', 'rosters.assignments'),
    ('FlotillaCommander', 'rosters.templates'),
    ('FlotillaCommander', 'assets.view'),
    ('FlotillaCommander', 'assets.schedule'),
    ('FlotillaCommander', 'training.view'),
    ('FlotillaCommander', 'training.manage'),
    ('FlotillaCommander', 'msar.view'),
    ('FlotillaCommander', 'msar.create'),
    ('FlotillaCommander', 'msar.command'),
    ('FlotillaCommander', 'reports.members'),
    ('FlotillaCommander', 'reports.activity'),
    
    -- SquadronCommander permissions (inherits FlotillaCommander + additional)
    ('SquadronCommander', 'users.view'),
    ('SquadronCommander', 'users.create'),
    ('SquadronCommander', 'users.edit'),
    ('SquadronCommander', 'users.roles'),
    ('SquadronCommander', 'rosters.view'),
    ('SquadronCommander', 'rosters.create'),
    ('SquadronCommander', 'rosters.edit'),
    ('SquadronCommander', 'rosters.delete'),
    ('SquadronCommander', 'rosters.assignments'),
    ('SquadronCommander', 'rosters.templates'),
    ('SquadronCommander', 'assets.view'),
    ('SquadronCommander', 'assets.manage'),
    ('SquadronCommander', 'assets.schedule'),
    ('SquadronCommander', 'facilities.manage'),
    ('SquadronCommander', 'training.view'),
    ('SquadronCommander', 'training.manage'),
    ('SquadronCommander', 'msar.view'),
    ('SquadronCommander', 'msar.create'),
    ('SquadronCommander', 'msar.command'),
    ('SquadronCommander', 'msar.manage'),
    ('SquadronCommander', 'admin.organization'),
    ('SquadronCommander', 'reports.members'),
    ('SquadronCommander', 'reports.activity'),
    ('SquadronCommander', 'reports.assets'),
    
    -- SuperAdmin permissions (all permissions)
    ('SuperAdmin', 'users.view'),
    ('SuperAdmin', 'users.create'),
    ('SuperAdmin', 'users.edit'),
    ('SuperAdmin', 'users.delete'),
    ('SuperAdmin', 'users.roles'),
    ('SuperAdmin', 'rosters.view'),
    ('SuperAdmin', 'rosters.create'),
    ('SuperAdmin', 'rosters.edit'),
    ('SuperAdmin', 'rosters.delete'),
    ('SuperAdmin', 'rosters.assignments'),
    ('SuperAdmin', 'rosters.templates'),
    ('SuperAdmin', 'assets.view'),
    ('SuperAdmin', 'assets.manage'),
    ('SuperAdmin', 'assets.schedule'),
    ('SuperAdmin', 'facilities.manage'),
    ('SuperAdmin', 'training.view'),
    ('SuperAdmin', 'training.conduct'),
    ('SuperAdmin', 'training.manage'),
    ('SuperAdmin', 'training.assess'),
    ('SuperAdmin', 'msar.view'),
    ('SuperAdmin', 'msar.create'),
    ('SuperAdmin', 'msar.command'),
    ('SuperAdmin', 'msar.manage'),
    ('SuperAdmin', 'admin.reports'),
    ('SuperAdmin', 'admin.system'),
    ('SuperAdmin', 'admin.organization'),
    ('SuperAdmin', 'reports.members'),
    ('SuperAdmin', 'reports.activity'),
    ('SuperAdmin', 'reports.assets')
) AS r(role_name, permission_code)
JOIN perms p ON p.code = r.permission_code
ON CONFLICT (role_name, permission_id) DO NOTHING;

-- Seed roster templates
INSERT INTO roster_templates (
    name, description, roster_type, category, priority, duration_hours,
    min_participants, max_participants, required_roles, required_equipment,
    required_assets, default_location, weather_dependent, template_notes, created_by
)
SELECT 
    t.name,
    t.description,
    t.roster_type::roster_type,
    t.category::roster_category,
    t.priority::roster_priority,
    t.duration_hours,
    t.min_participants,
    t.max_participants,
    t.required_roles::jsonb,
    t.required_equipment,
    t.required_assets,
    t.default_location,
    t.weather_dependent,
    t.template_notes,
    u.id
FROM (VALUES
    -- MSAR Templates
    ('MSAR - Person in Water', 'Standard response for person in water incidents', 'MSAR', 'Operational', 'Emergency', 4.0, 3, 8, 
     '[{"role": "Incident Commander", "count": 1}, {"role": "Coxswain", "count": 1}, {"role": "Crew Member", "count": 2}, {"role": "First Aid Officer", "count": 1}]',
     ARRAY['First Aid Kit', 'Rescue Equipment', 'Communication Radio', 'GPS'], 
     ARRAY['Primary Rescue Vessel'], 'Base Operations', true, 'Immediate response template for person in water emergencies'),
    
    ('MSAR - Vessel Breakdown', 'Response for vessel breakdown or mechanical failure', 'MSAR', 'Operational', 'High', 3.0, 2, 6,
     '[{"role": "Coxswain", "count": 1}, {"role": "Engineer", "count": 1}, {"role": "Crew Member", "count": 1}]',
     ARRAY['Tool Kit', 'Spare Parts', 'Tow Rope', 'Communication Radio'],
     ARRAY['Response Vessel'], 'Marina Area', false, 'Standard response for vessel mechanical issues'),
    
    -- Training Templates  
    ('Basic Navigation Training', 'Introduction to marine navigation principles', 'Training', 'Training', 'Normal', 4.0, 5, 15,
     '[{"role": "Instructor", "count": 1}, {"role": "Assistant Instructor", "count": 1}]',
     ARRAY['Charts', 'Compass', 'Plotting Tools', 'GPS Units'],
     ARRAY['Training Room', 'Training Vessel'], 'Training Center', false, 'Basic navigation course for new members'),
    
    ('First Aid Certification', 'Marine first aid certification course', 'Training', 'Training', 'High', 8.0, 8, 16,
     '[{"role": "Certified Instructor", "count": 1}, {"role": "Assistant", "count": 1}]',
     ARRAY['First Aid Mannequins', 'Medical Supplies', 'Training Materials'],
     ARRAY['Training Room'], 'Medical Training Room', false, 'Full first aid certification with assessment'),
    
    ('Radio Operator Training', 'Marine radio operation and procedures', 'Training', 'Training', 'Normal', 3.0, 4, 12,
     '[{"role": "Radio Instructor", "count": 1}]',
     ARRAY['Marine Radios', 'Training Materials', 'Log Books'],
     ARRAY['Communications Room'], 'Communications Center', false, 'Basic radio operation training'),
    
    -- Meeting Templates
    ('Monthly Committee Meeting', 'Regular monthly committee meeting', 'Meeting', 'Administrative', 'Normal', 2.0, 5, 15,
     '[{"role": "Chairperson", "count": 1}, {"role": "Secretary", "count": 1}]',
     ARRAY['Meeting Papers', 'Projector', 'Laptop'],
     ARRAY['Meeting Room'], 'Flotilla HQ', false, 'Standard monthly committee meeting format'),
    
    ('Emergency Briefing', 'Emergency response briefing', 'Meeting', 'Operational', 'High', 1.0, 3, 20,
     '[{"role": "Incident Commander", "count": 1}, {"role": "Safety Officer", "count": 1}]',
     ARRAY['Situation Maps', 'Communication Equipment'],
     ARRAY['Briefing Room'], 'Operations Center', false, 'Emergency situation briefing template'),
    
    -- Duty Day Templates
    ('Regular Patrol Duty', 'Standard patrol duty day', 'DutyDay', 'Operational', 'Normal', 6.0, 3, 5,
     '[{"role": "Coxswain", "count": 1}, {"role": "Crew Member", "count": 2}]',
     ARRAY['Safety Equipment', 'Navigation Equipment', 'Communication Radio', 'Fuel'],
     ARRAY['Patrol Vessel'], 'Marina Base', true, 'Standard patrol duty configuration'),
    
    ('Training Patrol', 'Training patrol for new members', 'DutyDay', 'Training', 'Normal', 4.0, 3, 6,
     '[{"role": "Training Coxswain", "count": 1}, {"role": "Trainee", "count": 2}, {"role": "Observer", "count": 1}]',
     ARRAY['Training Materials', 'Safety Equipment', 'Assessment Forms'],
     ARRAY['Training Vessel'], 'Training Area', true, 'Training patrol for skill development'),
    
    -- Flotilla Training Templates
    ('Full Flotilla Exercise', 'Large scale flotilla training exercise', 'FlotillaTraining', 'Training', 'High', 8.0, 15, 50,
     '[{"role": "Exercise Director", "count": 1}, {"role": "Safety Officer", "count": 2}, {"role": "Instructor", "count": 3}]',
     ARRAY['Multiple Radios', 'Safety Boats', 'First Aid Stations', 'Exercise Materials'],
     ARRAY['Multiple Vessels', 'Training Area', 'Briefing Room'], 'Training Waters', true, 'Major flotilla-wide training exercise'),
    
    ('Monthly Skills Assessment', 'Monthly member skills assessment', 'FlotillaTraining', 'Training', 'Normal', 6.0, 10, 25,
     '[{"role": "Assessor", "count": 2}, {"role": "Safety Officer", "count": 1}]',
     ARRAY['Assessment Forms', 'Practical Equipment', 'Safety Gear'],
     ARRAY['Training Vessels', 'Assessment Area'], 'Training Center', false, 'Regular skills assessment for all members')
) AS t(name, description, roster_type, category, priority, duration_hours, min_participants, max_participants, 
       required_roles, required_equipment, required_assets, default_location, weather_dependent, template_notes)
CROSS JOIN (SELECT id FROM users WHERE role = 'SuperAdmin' LIMIT 1) u
ON CONFLICT DO NOTHING;

-- Seed basic facilities
INSERT INTO facilities (name, facility_type, capacity, location, equipment_available, notes)
VALUES
    ('Main Training Room', 'Training Room', 30, 'Flotilla HQ - Ground Floor', 
     ARRAY['Projector', 'Whiteboard', 'Tables', 'Chairs', 'Audio System'], 'Primary training facility'),
    ('Briefing Room', 'Meeting Room', 15, 'Flotilla HQ - First Floor',
     ARRAY['Conference Table', 'Video Conference', 'Presentation Screen'], 'Command briefing room'),
    ('Communications Center', 'Operations', 5, 'Flotilla HQ - Operations Wing',
     ARRAY['Marine Radios', 'Computer Systems', 'Weather Station'], 'Main communications hub'),
    ('Workshop', 'Maintenance', 8, 'Marina - Workshop Building',
     ARRAY['Tools', 'Workbenches', 'Parts Storage', 'Lifting Equipment'], 'Equipment maintenance facility'),
    ('Medical Training Room', 'Training Room', 20, 'Flotilla HQ - Medical Wing',
     ARRAY['First Aid Equipment', 'Training Mannequins', 'Medical Supplies'], 'Specialized medical training')
ON CONFLICT DO NOTHING;

-- Seed basic equipment
INSERT INTO equipment (name, equipment_type, model, status, location, notes)
VALUES
    ('VHF Radio CH1', 'Communication', 'Icom IC-M423G', 'Available', 'Communications Center', 'Primary communication radio'),
    ('VHF Radio CH2', 'Communication', 'Icom IC-M423G', 'Available', 'Communications Center', 'Backup communication radio'),
    ('GPS Unit Alpha', 'Navigation', 'Garmin GPSMAP 8612xsv', 'Available', 'Equipment Store', 'Portable GPS for training'),
    ('GPS Unit Bravo', 'Navigation', 'Garmin GPSMAP 8612xsv', 'Available', 'Equipment Store', 'Portable GPS for training'),
    ('First Aid Kit A', 'Medical', 'Marine First Aid Kit', 'Available', 'Medical Store', 'Comprehensive marine first aid kit'),
    ('First Aid Kit B', 'Medical', 'Marine First Aid Kit', 'Available', 'Medical Store', 'Comprehensive marine first aid kit'),
    ('Training Mannequin', 'Medical', 'CPR Annie', 'Available', 'Medical Training Room', 'CPR training mannequin'),
    ('Projector Main', 'Audio Visual', 'Epson EB-2155W', 'Available', 'Main Training Room', 'Main training room projector'),
    ('Laptop Training', 'Computing', 'Dell Latitude 5520', 'Available', 'Equipment Store', 'Training laptop for presentations')
ON CONFLICT DO NOTHING;

\echo 'Permissions, templates, facilities, and equipment seeded.'
