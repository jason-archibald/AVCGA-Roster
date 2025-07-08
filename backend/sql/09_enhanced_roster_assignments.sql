-- Drop existing table to recreate with enhanced structure
DROP TABLE IF EXISTS roster_assignments CASCADE;
DROP TABLE IF EXISTS shift_offers CASCADE;
DROP TYPE IF EXISTS assignment_status CASCADE;
DROP TYPE IF EXISTS offer_status CASCADE;

-- Assignment status enum
CREATE TYPE assignment_status AS ENUM ('Assigned', 'Confirmed', 'Unavailable', 'Cancelled');

-- Offer status enum  
CREATE TYPE offer_status AS ENUM ('Open', 'Accepted', 'Declined', 'Cancelled');

-- Enhanced roster assignments table
CREATE TABLE roster_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roster_id UUID NOT NULL REFERENCES rosters(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shift_role_id UUID NOT NULL REFERENCES shift_roles(id) ON DELETE CASCADE,
    status assignment_status NOT NULL DEFAULT 'Assigned',
    assigned_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure one assignment per member per roster per role
    UNIQUE(roster_id, member_id, shift_role_id)
);

-- Shift offers table for offering shifts to other members
CREATE TABLE shift_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roster_assignment_id UUID NOT NULL REFERENCES roster_assignments(id) ON DELETE CASCADE,
    offered_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    offered_to UUID REFERENCES users(id) ON DELETE SET NULL, -- NULL means open to anyone
    status offer_status NOT NULL DEFAULT 'Open',
    reason TEXT,
    offered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    responded_at TIMESTAMPTZ,
    response_notes TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Member availability table for tracking when members are available
CREATE TABLE member_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    roster_id UUID NOT NULL REFERENCES rosters(id) ON DELETE CASCADE,
    is_available BOOLEAN NOT NULL DEFAULT true,
    availability_notes TEXT,
    updated_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- One availability record per member per roster
    UNIQUE(member_id, roster_id)
);

-- Indexes for performance
CREATE INDEX idx_roster_assignments_roster_id ON roster_assignments(roster_id);
CREATE INDEX idx_roster_assignments_member_id ON roster_assignments(member_id);
CREATE INDEX idx_roster_assignments_status ON roster_assignments(status);
CREATE INDEX idx_shift_offers_assignment_id ON shift_offers(roster_assignment_id);
CREATE INDEX idx_shift_offers_offered_to ON shift_offers(offered_to);
CREATE INDEX idx_shift_offers_status ON shift_offers(status);
CREATE INDEX idx_member_availability_member_id ON member_availability(member_id);
CREATE INDEX idx_member_availability_roster_id ON member_availability(roster_id);

-- Triggers for updated_at
CREATE TRIGGER update_roster_assignments_updated_at
BEFORE UPDATE ON roster_assignments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shift_offers_updated_at
BEFORE UPDATE ON shift_offers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_member_availability_updated_at
BEFORE UPDATE ON member_availability
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

\echo 'Enhanced roster assignment tables created.'
