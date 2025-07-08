const pool = require('../config/db');
module.exports = {
    findAllSquadrons: async () => (await pool.query('SELECT * FROM squadrons ORDER BY name')).rows,
    createSquadron: async ({ name, description }) => (await pool.query('INSERT INTO squadrons (name, description) VALUES ($1, $2) RETURNING *', [name, description || null])).rows[0],
    findAllFlotillas: async () => (await pool.query('SELECT f.id, f.name, f.description, s.name as squadron_name FROM flotillas f LEFT JOIN squadrons s ON f.squadron_id = s.id ORDER BY f.name')).rows,
    createFlotilla: async ({ name, description, squadron_id }) => (await pool.query('INSERT INTO flotillas (name, description, squadron_id) VALUES ($1, $2, $3) RETURNING *', [name, description || null, squadron_id])).rows[0],
};
