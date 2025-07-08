-- Facilities and rooms
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    facility_type VARCHAR(100), -- Training room, office, workshop, etc.
    capacity INTEGER,
    location VARCHAR(255),
    equipment_available TEXT[],
    booking_rules TEXT,
    contact_person_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Equipment inventory
CREATE TABLE equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    equipment_type VARCHAR(100), -- Radio, GPS, Medical, Safety, etc.
    model VARCHAR(100),
    serial_number VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Available', -- Available, In Use, Maintenance, Decommissioned
    location VARCHAR(255),
    last_service_date DATE,
    next_service_date DATE,
    responsible_person_id UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Resource assignments to rosters
CREATE TABLE roster_resource_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roster_id UUID NOT NULL REFERENCES rosters(id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('vessel', 'vehicle', 'facility', 'equipment')),
    resource_id UUID NOT NULL,
    assignment_role VARCHAR(100), -- Primary, Backup, Training, etc.
    assigned_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT,
    
    -- Ensure one assignment per resource per roster per role
    UNIQUE(roster_id, resource_type, resource_id, assignment_role)
);

-- Resource availability and scheduling
CREATE TABLE resource_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('vessel', 'vehicle', 'facility', 'equipment')),
    resource_id UUID NOT NULL,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    availability_type VARCHAR(50) DEFAULT 'Available', -- Available, Unavailable, Maintenance, Reserved
    reason TEXT,
    updated_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Prevent overlapping availability records
    EXCLUDE USING gist (
        resource_type WITH =,
        resource_id WITH =,
        tstzrange(start_datetime, end_datetime) WITH &&
    )
);

-- Resource conflicts and reservations
CREATE TABLE resource_conflicts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID NOT NULL,
    primary_roster_id UUID NOT NULL REFERENCES rosters(id) ON DELETE CASCADE,
    conflicting_roster_id UUID NOT NULL REFERENCES rosters(id) ON DELETE CASCADE,
    conflict_type VARCHAR(50), -- Scheduling, Maintenance, Availability
    status VARCHAR(50) DEFAULT 'Unresolved', -- Unresolved, Resolved, Deferred
    resolution_notes TEXT,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Resource maintenance schedules
CREATE TABLE resource_maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('vessel', 'vehicle', 'equipment')),
    resource_id UUID NOT NULL,
    maintenance_type VARCHAR(100), -- Routine, Emergency, Annual Service, etc.
    scheduled_date DATE NOT NULL,
    estimated_duration_hours DECIMAL(5,2),
    maintenance_provider VARCHAR(255),
    cost_estimate DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'Scheduled', -- Scheduled, In Progress, Completed, Cancelled
    technician_notes TEXT,
    completed_date DATE,
    actual_cost DECIMAL(10,2),
    next_service_date DATE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance and conflict detection
CREATE INDEX idx_roster_resources_roster ON roster_resource_assignments(roster_id);
CREATE INDEX idx_roster_resources_type_id ON roster_resource_assignments(resource_type, resource_id);
CREATE INDEX idx_resource_availability_type_id ON resource_availability(resource_type, resource_id);
CREATE INDEX idx_resource_availability_datetime ON resource_availability(start_datetime, end_datetime);
CREATE INDEX idx_resource_conflicts_resource ON resource_conflicts(resource_type, resource_id);
CREATE INDEX idx_resource_maintenance_resource ON resource_maintenance(resource_type, resource_id);
CREATE INDEX idx_resource_maintenance_date ON resource_maintenance(scheduled_date);
CREATE INDEX idx_facilities_type ON facilities(facility_type);
CREATE INDEX idx_equipment_type ON equipment(equipment_type);
CREATE INDEX idx_equipment_status ON equipment(status);

-- Triggers for updated_at
CREATE TRIGGER update_facilities_updated_at
BEFORE UPDATE ON facilities
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at
BEFORE UPDATE ON equipment
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resource_availability_updated_at
BEFORE UPDATE ON resource_availability
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resource_maintenance_updated_at
BEFORE UPDATE ON resource_maintenance
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

\echo 'Asset and resource assignment system created.'
