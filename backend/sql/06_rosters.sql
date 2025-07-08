DROP TABLE IF EXISTS rosters CASCADE;
DROP TYPE IF EXISTS roster_status CASCADE;

CREATE TYPE roster_status AS ENUM ('Draft', 'Published', 'Active', 'Completed', 'Cancelled');

CREATE TABLE rosters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    roster_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status roster_status NOT NULL DEFAULT 'Draft',
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    flotilla_id UUID REFERENCES flotillas(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rosters_date ON rosters(roster_date);
CREATE INDEX idx_rosters_status ON rosters(status);
CREATE INDEX idx_rosters_flotilla ON rosters(flotilla_id);

CREATE TRIGGER update_rosters_updated_at
BEFORE UPDATE ON rosters
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

\echo 'Table "rosters" created.'
