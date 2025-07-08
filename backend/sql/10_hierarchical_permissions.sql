-- Drop existing types to recreate with enhanced hierarchy
DROP TYPE IF EXISTS user_role CASCADE;

-- Enhanced user role hierarchy
CREATE TYPE user_role AS ENUM (
    'Member',                    -- Base member
    'CrewLeader',               -- Can lead small teams
    'Trainer',                  -- Can conduct training
    'AssistantFlotillaCommander', -- Deputy flotilla leadership
    'FlotillaCommander',        -- Flotilla leadership
    'AssistantSquadronCommander', -- Deputy squadron leadership  
    'SquadronCommander',        -- Squadron leadership
    'RegionalCommander',        -- Regional oversight
    'SuperAdmin'                -- System administration
);

-- Permission categories
CREATE TABLE permission_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Individual permissions
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES permission_categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Role permissions mapping
CREATE TABLE role_permissions (
    role_name user_role NOT NULL,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (role_name, permission_id)
);

-- User-specific permission overrides
CREATE TABLE user_permission_overrides (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    granted BOOLEAN NOT NULL DEFAULT true,
    granted_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT,
    PRIMARY KEY (user_id, permission_id)
);

-- Organizational hierarchy
CREATE TABLE organizational_hierarchy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES organizational_hierarchy(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('Region', 'Squadron', 'Flotilla', 'Unit')),
    entity_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    commander_id UUID REFERENCES users(id) ON DELETE SET NULL,
    deputy_commander_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_permissions_category ON permissions(category_id);
CREATE INDEX idx_role_permissions_role ON role_permissions(role_name);
CREATE INDEX idx_user_overrides_user ON user_permission_overrides(user_id);
CREATE INDEX idx_org_hierarchy_parent ON organizational_hierarchy(parent_id);
CREATE INDEX idx_org_hierarchy_entity ON organizational_hierarchy(entity_type, entity_id);

\echo 'Hierarchical permission system created.'
