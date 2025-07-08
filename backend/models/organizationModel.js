const pool = require('../config/db');

module.exports = {
    // Squadron operations
    findAllSquadrons: async () => {
        const query = 'SELECT * FROM squadrons ORDER BY name';
        const result = await pool.query(query);
        return result.rows;
    },

    findSquadronById: async (id) => {
        const query = 'SELECT * FROM squadrons WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    createSquadron: async ({ name, description }) => {
        const query = 'INSERT INTO squadrons (name, description) VALUES ($1, $2) RETURNING *';
        const result = await pool.query(query, [name, description || null]);
        return result.rows[0];
    },

    updateSquadron: async (id, { name, description }) => {
        const query = 'UPDATE squadrons SET name = $1, description = $2 WHERE id = $3 RETURNING *';
        const result = await pool.query(query, [name, description, id]);
        return result.rows[0];
    },

    deleteSquadron: async (id) => {
        // First check if squadron has flotillas
        const flotillaCheck = await pool.query('SELECT COUNT(*) FROM flotillas WHERE squadron_id = $1', [id]);
        if (parseInt(flotillaCheck.rows[0].count) > 0) {
            throw new Error('Cannot delete squadron with associated flotillas');
        }
        await pool.query('DELETE FROM squadrons WHERE id = $1', [id]);
    },

    // Flotilla operations
    findAllFlotillas: async () => {
        const query = `
            SELECT f.id, f.name, f.description, f.squadron_id, s.name as squadron_name
            FROM flotillas f
            LEFT JOIN squadrons s ON f.squadron_id = s.id
            ORDER BY f.name
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    findFlotillaById: async (id) => {
        const query = `
            SELECT f.*, s.name as squadron_name
            FROM flotillas f
            LEFT JOIN squadrons s ON f.squadron_id = s.id
            WHERE f.id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    createFlotilla: async ({ name, description, squadron_id }) => {
        const query = 'INSERT INTO flotillas (name, description, squadron_id) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(query, [name, description || null, squadron_id]);
        return result.rows[0];
    },

    updateFlotilla: async (id, { name, description, squadron_id }) => {
        const query = 'UPDATE flotillas SET name = $1, description = $2, squadron_id = $3 WHERE id = $4 RETURNING *';
        const result = await pool.query(query, [name, description, squadron_id, id]);
        return result.rows[0];
    },

    deleteFlotilla: async (id) => {
        // First check if flotilla has members
        const memberCheck = await pool.query('SELECT COUNT(*) FROM users WHERE flotilla_id = $1', [id]);
        if (parseInt(memberCheck.rows[0].count) > 0) {
            throw new Error('Cannot delete flotilla with associated members');
        }
        await pool.query('DELETE FROM flotillas WHERE id = $1', [id]);
    }
};
