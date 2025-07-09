const pool = require('../config/db');

const organizationModel = {
    // Squadron methods
    findAllSquadrons: async () => {
        const result = await pool.query(`
            SELECT s.*, 
                   COUNT(f.id) as flotilla_count,
                   COUNT(u.id) as member_count
            FROM squadrons s
            LEFT JOIN flotillas f ON s.id = f.squadron_id
            LEFT JOIN users u ON f.id = u.flotilla_id
            GROUP BY s.id, s.name, s.description, s.created_at, s.updated_at
            ORDER BY s.name
        `);
        return result.rows;
    },

    findSquadronById: async (id) => {
        const result = await pool.query(`
            SELECT s.*,
                   json_agg(
                       json_build_object(
                           'id', f.id,
                           'name', f.name,
                           'description', f.description,
                           'location', f.location
                       )
                   ) FILTER (WHERE f.id IS NOT NULL) as flotillas
            FROM squadrons s
            LEFT JOIN flotillas f ON s.id = f.squadron_id
            WHERE s.id = $1
            GROUP BY s.id
        `, [id]);
        return result.rows[0];
    },

    createSquadron: async (data) => {
        const { name, description } = data;
        const result = await pool.query(`
            INSERT INTO squadrons (name, description)
            VALUES ($1, $2)
            RETURNING *
        `, [name, description]);
        return result.rows[0];
    },

    updateSquadron: async (id, data) => {
        const { name, description } = data;
        const result = await pool.query(`
            UPDATE squadrons 
            SET name = $1, description = $2, updated_at = NOW()
            WHERE id = $3
            RETURNING *
        `, [name, description, id]);
        return result.rows[0];
    },

    deleteSquadron: async (id) => {
        // Check if squadron has flotillas
        const flotillaCheck = await pool.query(
            'SELECT COUNT(*) FROM flotillas WHERE squadron_id = $1', [id]
        );
        
        if (parseInt(flotillaCheck.rows[0].count) > 0) {
            throw new Error('Cannot delete squadron: flotillas still assigned');
        }
        
        await pool.query('DELETE FROM squadrons WHERE id = $1', [id]);
    },

    // Flotilla methods
    findAllFlotillas: async () => {
        const result = await pool.query(`
            SELECT f.*, s.name as squadron_name,
                   COUNT(u.id) as member_count
            FROM flotillas f
            LEFT JOIN squadrons s ON f.squadron_id = s.id
            LEFT JOIN users u ON f.id = u.flotilla_id
            GROUP BY f.id, s.name
            ORDER BY s.name, f.name
        `);
        return result.rows;
    },

    findFlotillaById: async (id) => {
        const result = await pool.query(`
            SELECT f.*, s.name as squadron_name,
                   json_agg(
                       json_build_object(
                           'id', u.id,
                           'name', u.first_name || ' ' || u.last_name,
                           'email', u.email,
                           'role', u.role,
                           'status', u.status
                       )
                   ) FILTER (WHERE u.id IS NOT NULL) as members
            FROM flotillas f
            LEFT JOIN squadrons s ON f.squadron_id = s.id
            LEFT JOIN users u ON f.id = u.flotilla_id
            WHERE f.id = $1
            GROUP BY f.id, s.name
        `, [id]);
        return result.rows[0];
    },

    createFlotilla: async (data) => {
        const { name, squadron_id, description, location, contact_phone, contact_email } = data;
        const result = await pool.query(`
            INSERT INTO flotillas (name, squadron_id, description, location, contact_phone, contact_email)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [name, squadron_id, description, location, contact_phone, contact_email]);
        return result.rows[0];
    },

    updateFlotilla: async (id, data) => {
        const { name, squadron_id, description, location, contact_phone, contact_email } = data;
        const result = await pool.query(`
            UPDATE flotillas 
            SET name = $1, squadron_id = $2, description = $3, 
                location = $4, contact_phone = $5, contact_email = $6, updated_at = NOW()
            WHERE id = $7
            RETURNING *
        `, [name, squadron_id, description, location, contact_phone, contact_email, id]);
        return result.rows[0];
    },

    deleteFlotilla: async (id) => {
        // Check if flotilla has members
        const memberCheck = await pool.query(
            'SELECT COUNT(*) FROM users WHERE flotilla_id = $1', [id]
        );
        
        if (parseInt(memberCheck.rows[0].count) > 0) {
            throw new Error('Cannot delete flotilla: members still assigned');
        }
        
        await pool.query('DELETE FROM flotillas WHERE id = $1', [id]);
    }
};

module.exports = organizationModel;
