DROP TABLE IF EXISTS member_qualifications;
DROP TABLE IF EXISTS roster_assignments;
CREATE TABLE member_qualifications (member_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, qualification_id UUID NOT NULL REFERENCES qualifications(id) ON DELETE CASCADE, date_achieved DATE NOT NULL, expiry_date DATE, PRIMARY KEY (member_id, qualification_id));
CREATE TABLE roster_assignments (roster_id UUID NOT NULL REFERENCES rosters(id) ON DELETE CASCADE, member_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, shift_role_id UUID NOT NULL REFERENCES shift_roles(id) ON DELETE CASCADE, notes TEXT, PRIMARY KEY (roster_id, member_id, shift_role_id));
\echo 'Junction tables created.'
