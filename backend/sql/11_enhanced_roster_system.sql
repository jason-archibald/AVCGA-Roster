-- Roster types and categories
DROP TYPE IF EXISTS roster_type CASCADE;
DROP TYPE IF EXISTS roster_category CASCADE;
DROP TYPE IF EXISTS roster_priority CASCADE;

CREATE TYPE roster_type AS ENUM (
    'MSAR',                     -- Marine Search and Rescue
    'Training',                 -- Training sessions
    'Meeting',                  -- Meetings and briefings
    'DutyDay',                  -- Regular duty day
    'FlotillaTraining',         -- Full flotilla training
    'Maintenance',              -- Equipment/vessel maintenance
    'Community',                -- Community events
    'Administrative',           -- Administrative tasks
    'Emergency'                 -- Emergency response
);

CREATE TYPE roster_category AS ENUM (
    'Operational',              -- Active operations
    'Training',                 -- Training and development
    'Administrative',           -- Admin and planning
    'Social',                   -- Social and community
    'Maintenance'               -- Maintenance activities
);

CREATE TYPE roster_priority AS ENUM (
    'Low',
    'Normal', 
    'High',
    'Critical',
    'Emergency'
);

-- Enhanced rosters table
ALTER TABLE rosters ADD COLUMN IF NOT EXISTS roster_type roster_type DEFAULT 'DutyDay';
ALTER TABLE rosters ADD COLUMN IF NOT EXISTS category roster_category DEFAULT 'Operational';
ALTER TABLE rosters ADD COLUMN IF NOT EXISTS priority roster_priority DEFAULT 'Normal';
ALTER TABLE rosters ADD COLUMN IF NOT EXISTS max_participants INTEGER;
ALTER TABLE rosters ADD COLUMN IF NOT EXISTS min_participants INTEGER;
ALTER TABLE rosters ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE rosters ADD COLUMN IF NOT EXISTS weather_dependent BOOLEAN DEFAULT false;
ALTER TABLE rosters ADD COLUMN IF NOT EXISTS requires_certification VARCHAR(255);
ALTER TABLE rosters ADD COLUMN IF NOT EXISTS equipment_required TEXT[];
ALTER TABLE rosters ADD COLUMN IF NOT EXISTS briefing_time TIME;
ALTER TABLE rosters ADD COLUMN IF NOT EXISTS debrief_time TIME;
ALTER TABLE rosters ADD COLUMN IF NOT EXISTS safety_officer_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE rosters ADD COLUMN IF NOT EXISTS incident_commander_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Roster templates
CREATE TABLE roster_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    roster_type roster_type NOT NULL,
    category roster_category NOT NULL,
    priority roster_priority DEFAULT 'Normal',
    duration_hours DECIMAL(4,2),
    min_participants INTEGER,
    max_participants INTEGER,
    required_roles JSONB, -- JSON array of required roles with counts
    required_equipment TEXT[],
    required_assets TEXT[], -- vessels, vehicles, rooms
    default_location VARCHAR(255),
    weather_dependent BOOLEAN DEFAULT false,
    requires_certification VARCHAR(255),
    template_notes TEXT,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MSAR specific data
CREATE TABLE msar_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roster_id UUID NOT NULL REFERENCES rosters(id) ON DELETE CASCADE,
    incident_number VARCHAR(50),
    incident_type VARCHAR(100), -- Person in water, vessel breakdown, etc.
    urgency_level INTEGER CHECK (urgency_level BETWEEN 1 AND 5),
    location_description TEXT,
    coordinates_lat DECIMAL(10, 8),
    coordinates_lng DECIMAL(11, 8),
    weather_conditions TEXT,
    sea_conditions TEXT,
    visibility VARCHAR(50),
    persons_involved INTEGER,
    vessels_involved INTEGER,
    initial_report_time TIMESTAMPTZ,
    response_time TIMESTAMPTZ,
    incident_commander_id UUID REFERENCES users(id) ON DELETE SET NULL,
    outcome TEXT,
    lessons_learned TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Training specific data
CREATE TABLE training_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roster_id UUID NOT NULL REFERENCES rosters(id) ON DELETE CASCADE,
    training_type VARCHAR(100), -- Navigation, First Aid, Radio, etc.
    certification_level VARCHAR(50), -- Basic, Intermediate, Advanced
    instructor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    training_materials TEXT[],
    assessment_required BOOLEAN DEFAULT false,
    practical_component BOOLEAN DEFAULT false,
    theory_component BOOLEAN DEFAULT false,
    prerequisites TEXT[],
    learning_objectives TEXT[],
    assessment_criteria TEXT[],
    pass_requirements TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Meeting specific data
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roster_id UUID NOT NULL REFERENCES rosters(id) ON DELETE CASCADE,
    meeting_type VARCHAR(100), -- Committee, Briefing, Planning, etc.
    agenda TEXT[],
    chairperson_id UUID REFERENCES users(id) ON DELETE SET NULL,
    secretary_id UUID REFERENCES users(id) ON DELETE SET NULL,
    meeting_papers TEXT[], -- Links to documents
    decisions_made TEXT[],
    action_items JSONB, -- JSON with action items and assignees
    next_meeting_date DATE,
    minutes_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Duty day specific data
CREATE TABLE duty_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roster_id UUID NOT NULL REFERENCES rosters(id) ON DELETE CASCADE,
    duty_type VARCHAR(100), -- Regular patrol, standby, training, etc.
    primary_vessel_id UUID REFERENCES vessels(id) ON DELETE SET NULL,
    backup_vessel_id UUID REFERENCES vessels(id) ON DELETE SET NULL,
    patrol_area TEXT,
    communication_plan TEXT,
    fuel_required DECIMAL(8,2),
    weather_limits TEXT,
    equipment_checklist TEXT[],
    safety_equipment_verified BOOLEAN DEFAULT false,
    pre_departure_briefing TEXT,
    post_duty_report TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_rosters_type ON rosters(roster_type);
CREATE INDEX idx_rosters_category ON rosters(category);
CREATE INDEX idx_rosters_priority ON rosters(priority);
CREATE INDEX idx_roster_templates_type ON roster_templates(roster_type);
CREATE INDEX idx_msar_incidents_roster ON msar_incidents(roster_id);
CREATE INDEX idx_training_sessions_roster ON training_sessions(roster_id);
CREATE INDEX idx_meetings_roster ON meetings(roster_id);
CREATE INDEX idx_duty_days_roster ON duty_days(roster_id);

-- Triggers for updated_at
CREATE TRIGGER update_roster_templates_updated_at
BEFORE UPDATE ON roster_templates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_msar_incidents_updated_at
BEFORE UPDATE ON msar_incidents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_sessions_updated_at
BEFORE UPDATE ON training_sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at
BEFORE UPDATE ON meetings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_duty_days_updated_at
BEFORE UPDATE ON duty_days
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

\echo 'Enhanced roster system with types and templates created.'
