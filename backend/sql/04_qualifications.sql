-- Qualifications and member qualifications
DROP TABLE IF EXISTS member_qualifications CASCADE;
DROP TABLE IF EXISTS qualifications CASCADE;

CREATE TABLE qualifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    validity_period_months INTEGER,
    required_for_roles TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE member_qualifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    qualification_id UUID NOT NULL REFERENCES qualifications(id) ON DELETE CASCADE,
    obtained_date DATE NOT NULL,
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, qualification_id)
);

CREATE INDEX idx_member_qualifications_user_id ON member_qualifications(user_id);
CREATE INDEX idx_member_qualifications_qualification_id ON member_qualifications(qualification_id);

-- Insert standard AVCGA qualifications
INSERT INTO qualifications (name, description, category, validity_period_months, required_for_roles) VALUES
    ('Marine Radio Operators Certificate', 'VHF radio operation certificate', 'Communication', 60, ARRAY['Coxswain', 'Crew Leader']),
    ('Senior First Aid', 'Advanced first aid certification', 'Medical', 36, ARRAY['First Aid Officer', 'Coxswain']),
    ('Coxswains Certificate', 'Vessel command qualification', 'Navigation', 60, ARRAY['Coxswain']),
    ('Crew Safety Training', 'Basic crew safety and procedures', 'Safety', 24, ARRAY['Crew Member']),
    ('MSAR Coordinator', 'Marine Search and Rescue coordination', 'Operations', 36, ARRAY['Incident Commander']),
    ('Instructor Qualification', 'Training delivery certification', 'Training', 48, ARRAY['Instructor']);

\echo 'Qualifications table created with standard AVCGA qualifications.';
