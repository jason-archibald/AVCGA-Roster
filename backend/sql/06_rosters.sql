DROP TABLE IF EXISTS rosters CASCADE;
CREATE TABLE rosters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roster_date DATE NOT NULL,
    shift_name VARCHAR(100) NOT NULL,
    start_time TIME,
    end_time TIME,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    flotilla_id UUID REFERENCES flotillas(id) ON DELETE SET NULL,
    vessel_id UUID REFERENCES vessels(id) ON DELETE SET NULL,

    -- This constraint is required for the ON CONFLICT clause in the seed script to work.
    -- It ensures that you cannot have two shifts with the same name on the same date for the same flotilla.
    CONSTRAINT unique_roster_shift UNIQUE (roster_date, shift_name, flotilla_id)
);
\echo 'Table "rosters" created with unique constraint.'
