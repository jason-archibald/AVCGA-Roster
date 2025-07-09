-- Roster assignments and availability
DROP TABLE IF EXISTS shift_offers CASCADE;
DROP TABLE IF EXISTS member_availability CASCADE;
DROP TABLE IF EXISTS roster_assignments CASCADE;
DROP TYPE IF EXISTS assignment_status CASCADE;
DROP TYPE IF EXISTS offer_status CASCADE;
DROP TYPE IF EXISTS availability_status CASCADE;

CREATE TYPE assignment_status AS ENUM ('Assigned', 'Confirmed', 'Declined', 'Completed', 'NoShow');
CREATE TYPE offer_status AS ENUM ('Open', 'Accepted', 'Declined', 'Cancelled');
CREATE TYPE availability_status AS ENUM ('Available', 'Unavailable', 'Maybe', 'OnLeave');

CREATE TABLE roster_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roster_id UUID NOT NULL REFERENCES rosters(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shift_role_id UUID NOT NULL REFERENCES shift_roles(id) ON DELETE CASCADE,
    status assignment_status NOT NULL DEFAULT 'Assigned',
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    assigned_by UUID NOT NULL REFERENCES users(id),
    confirmed_at TIMESTAMPTZ,
    notes TEXT,
    UNIQUE(roster_id, user_id, shift_role_id)
);

CREATE TABLE member_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    roster_id UUID NOT NULL REFERENCES rosters(id) ON DELETE CASCADE,
    status availability_status NOT NULL,
    notes TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, roster_id)
);

CREATE TABLE shift_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES roster_assignments(id) ON DELETE CASCADE,
    offered_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    offered_to UUID REFERENCES users(id) ON DELETE CASCADE,
    status offer_status NOT NULL DEFAULT 'Open',
    reason TEXT,
    offered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    responded_at TIMESTAMPTZ,
    notes TEXT
);

CREATE INDEX idx_roster_assignments_roster_id ON roster_assignments(roster_id);
CREATE INDEX idx_roster_assignments_user_id ON roster_assignments(user_id);
CREATE INDEX idx_member_availability_user_id ON member_availability(user_id);
CREATE INDEX idx_member_availability_roster_id ON member_availability(roster_id);
CREATE INDEX idx_shift_offers_assignment_id ON shift_offers(assignment_id);

\echo 'Enhanced roster assignment tables created.';
