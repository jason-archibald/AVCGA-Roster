const pool = require('../config/db');
// In a real app, these would be in a rosterModel.js
const getRosters = async (req, res) => {
    const result = await pool.query('SELECT r.id, r.roster_date, r.shift_name, f.name as flotilla_name FROM rosters r LEFT JOIN flotillas f ON r.flotilla_id = f.id ORDER BY r.roster_date DESC');
    res.json(result.rows);
};
const createRoster = async (req, res) => {
    const { roster_date, shift_name, flotilla_id } = req.body;
    const result = await pool.query('INSERT INTO rosters (roster_date, shift_name, flotilla_id) VALUES ($1, $2, $3) RETURNING *', [roster_date, shift_name, flotilla_id]);
    res.status(201).json(result.rows[0]);
};
module.exports = { getRosters, createRoster };
