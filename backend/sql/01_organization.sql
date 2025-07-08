DROP TABLE IF EXISTS flotillas CASCADE;
DROP TABLE IF EXISTS squadrons CASCADE;
CREATE TABLE squadrons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);
CREATE TABLE flotillas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    squadron_id UUID REFERENCES squadrons(id) ON DELETE SET NULL,
    description TEXT
);
\echo 'Tables "squadrons" and "flotillas" created.'
