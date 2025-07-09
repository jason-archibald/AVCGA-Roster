-- Assets: Vessels and Vehicles
DROP TABLE IF EXISTS vessels CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TYPE IF EXISTS asset_status CASCADE;

CREATE TYPE asset_status AS ENUM ('Operational', 'Maintenance', 'Decommissioned');

CREATE TABLE vessels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    call_sign VARCHAR(20) UNIQUE,
    registration VARCHAR(50),
    vessel_type VARCHAR(100),
    length_meters DECIMAL(5,2),
    max_passengers INTEGER,
    status asset_status NOT NULL DEFAULT 'Operational',
    home_port VARCHAR(100),
    last_service_date DATE,
    next_service_date DATE,
    notes TEXT,
    flotilla_id UUID REFERENCES flotillas(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    registration VARCHAR(20) UNIQUE,
    vehicle_type VARCHAR(100),
    max_passengers INTEGER,
    status asset_status NOT NULL DEFAULT 'Operational',
    base_location VARCHAR(100),
    last_service_date DATE,
    next_service_date DATE,
    notes TEXT,
    flotilla_id UUID REFERENCES flotillas(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vessels_status ON vessels(status);
CREATE INDEX idx_vehicles_status ON vehicles(status);

-- Create update triggers
CREATE TRIGGER update_vessels_updated_at
BEFORE UPDATE ON vessels
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
BEFORE UPDATE ON vehicles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert sample assets for VF04 Westernport
INSERT INTO vessels (name, call_sign, registration, vessel_type, length_meters, max_passengers, home_port, flotilla_id) 
SELECT 
    'Westernport Rescue', 'VF04-01', 'VF04-RESCUE-01', 'Rescue Vessel', 8.5, 8, 'Westernport Marina', f.id
FROM flotillas f WHERE f.name = 'VF04 Westernport';

INSERT INTO vehicles (name, registration, vehicle_type, max_passengers, base_location, flotilla_id) 
SELECT 
    'VF04 Response Vehicle', 'VF04-RV1', 'Response Vehicle', 5, 'Westernport HQ', f.id
FROM flotillas f WHERE f.name = 'VF04 Westernport';

\echo 'Tables "vessels" and "vehicles" created with VF04 Westernport assets.';
