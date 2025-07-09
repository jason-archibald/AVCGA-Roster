-- Organization structure: Squadrons and Flotillas
DROP TABLE IF EXISTS flotillas CASCADE;
DROP TABLE IF EXISTS squadrons CASCADE;

CREATE TABLE squadrons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE flotillas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    squadron_id UUID REFERENCES squadrons(id) ON DELETE SET NULL,
    description TEXT,
    location VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_flotillas_squadron_id ON flotillas(squadron_id);

-- Insert default organization structure
INSERT INTO squadrons (name, description) VALUES 
    ('Victoria Squadron', 'Victorian division of AVCGA operations'),
    ('New South Wales Squadron', 'NSW division of AVCGA operations'),
    ('Queensland Squadron', 'QLD division of AVCGA operations');

INSERT INTO flotillas (name, squadron_id, description, location, contact_email) 
SELECT 
    'VF04 Westernport', 
    s.id, 
    'Westernport Flotilla - Marine Search and Rescue operations for Westernport Bay area',
    'Westernport Bay, Victoria',
    'westernport@avcga.org.au'
FROM squadrons s WHERE s.name = 'Victoria Squadron';

INSERT INTO flotillas (name, squadron_id, description, location, contact_email) 
SELECT 
    'VF01 Port Phillip', 
    s.id, 
    'Port Phillip Flotilla - Marine Search and Rescue operations for Port Phillip Bay',
    'Port Phillip Bay, Victoria',
    'portphillip@avcga.org.au'
FROM squadrons s WHERE s.name = 'Victoria Squadron';

\echo 'Organization structure created with squadrons and flotillas.';
