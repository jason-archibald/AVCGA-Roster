-- Facilities and equipment management
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;

CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    facility_type VARCHAR(100),
    capacity INTEGER,
    location VARCHAR(255),
    equipment_available TEXT[],
    booking_rules TEXT,
    contact_person_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    flotilla_id UUID REFERENCES flotillas(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    equipment_type VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Available',
    location VARCHAR(255),
    last_service_date DATE,
    next_service_date DATE,
    responsible_person_id UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    flotilla_id UUID REFERENCES flotillas(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_facilities_type ON facilities(facility_type);
CREATE INDEX idx_equipment_type ON equipment(equipment_type);
CREATE INDEX idx_equipment_status ON equipment(status);

\echo 'Facilities and equipment management tables created.';
