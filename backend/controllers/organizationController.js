const pool = require('../config/db');

const handleApiError = (res, err, entity) => {
    console.error(`Error in ${entity} controller:`, err.message);
    if (err.code === '23505') {
        return res.status(400).json({ message: `A ${entity} with this name already exists.` });
    }
    res.status(500).json({ message: 'Server Error' });
};

module.exports = {
    getSquadrons: async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT s.*, COUNT(f.id) as flotilla_count
                FROM squadrons s
                LEFT JOIN flotillas f ON s.id = f.squadron_id
                GROUP BY s.id
                ORDER BY s.name
            `);
            res.json(result.rows);
        } catch (err) {
            handleApiError(res, err, 'squadron');
        }
    },

    getFlotillas: async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT f.*, s.name as squadron_name
                FROM flotillas f
                LEFT JOIN squadrons s ON f.squadron_id = s.id
                ORDER BY s.name, f.name
            `);
            res.json(result.rows);
        } catch (err) {
            handleApiError(res, err, 'flotilla');
        }
    },

    getSquadronById: async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM squadrons WHERE id = $1', [req.params.id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Squadron not found' });
            }
            res.json(result.rows[0]);
        } catch (err) {
            handleApiError(res, err, 'squadron');
        }
    },

    getFlotillaById: async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT f.*, s.name as squadron_name
                FROM flotillas f
                LEFT JOIN squadrons s ON f.squadron_id = s.id
                WHERE f.id = $1
            `, [req.params.id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Flotilla not found' });
            }
            res.json(result.rows[0]);
        } catch (err) {
            handleApiError(res, err, 'flotilla');
        }
    },

    createSquadron: async (req, res) => {
        try {
            const { name, description } = req.body;
            const result = await pool.query(`
                INSERT INTO squadrons (name, description)
                VALUES ($1, $2)
                RETURNING *
            `, [name, description]);
            res.status(201).json(result.rows[0]);
        } catch (err) {
            handleApiError(res, err, 'squadron');
        }
    },

    createFlotilla: async (req, res) => {
        try {
            const { name, squadron_id, description, location, contact_phone, contact_email } = req.body;
            const result = await pool.query(`
                INSERT INTO flotillas (name, squadron_id, description, location, contact_phone, contact_email)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `, [name, squadron_id, description, location, contact_phone, contact_email]);
            res.status(201).json(result.rows[0]);
        } catch (err) {
            handleApiError(res, err, 'flotilla');
        }
    },

    updateSquadron: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    deleteSquadron: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    updateFlotilla: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    deleteFlotilla: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); }
};
