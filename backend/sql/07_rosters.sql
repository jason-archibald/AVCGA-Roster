-- Roster system with enhanced types
DROP TABLE IF EXISTS rosters CASCADE;
DROP TYPE IF EXISTS roster_status CASCADE;
DROP TYPE IF EXISTS roster_type CASCADE;
DROP TYPE IF EXISTS roster_category CASCADE;
DROP TYPE IF EXISTS roster_priority CASCADE;

CREATE TYPE roster_status AS ENUM ('Draft', 'Published', 'Active', 'Completed', 'Cancelled');
CREATE TYPE roster_type AS ENUM ('MSAR', 'Training', 'Meeting', 'DutyDay', 'FlotillaTraining');
CREATE TYPE roster_category AS ENUM ('Operational', 'Training', 'Administrative', 'Emergency');
CREATE TYPE roster_priority AS ENUM ('Low', 'Normal', 'High', 'Emergency');

CREATE TABLE rosters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    roster_type roster_type NOT NULL,
    category roster_category NOT NULL DEFAULT 'Operational',
    priority roster_priority NOT NULL DEFAULT 'Normal',
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    location VARCHAR(255),
    max_participants INTEGER,
    min_participants INTEGER DEFAULT 1,
    status roster_status NOT NULL DEFAULT 'Draft',
    weather_dependent BOOLEAN DEFAULT false,
    required_qualifications UUID[],
    equipment_required TEXT[],
    briefing_notes TEXT,
    safety_notes TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    flotilla_id UUID REFERENCES flotillas(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_datetime CHECK (end_datetime > start_datetime)
);

CREATE INDEX idx_rosters_start_datetime ON rosters(start_datetime);
CREATE INDEX idx_rosters_flotilla_id ON rosters(flotilla_id);
CREATE INDEX idx_rosters_status ON rosters(status);
CREATE INDEX idx_rosters_type ON rosters(roster_type);

CREATE TRIGGER update_rosters_updated_at
BEFORE UPDATE ON rosters
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

\echo 'Rosters table created.';
