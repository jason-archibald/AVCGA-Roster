-- Enable UUID generation extension
-- This must run before any tables that use uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
\echo 'UUID extension enabled.'
