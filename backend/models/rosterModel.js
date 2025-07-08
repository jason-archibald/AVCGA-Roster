const pool = require('../config/db');

const findAll = async () => {
    const query = `
        SELECT r.*, f.name as flotilla_name, v.name as vessel_name
        FROM rosters r
        LEFT JOIN flotillas f ON r.flotilla_id = f.id
        LEFT JOIN vessels v ON r.vessel_id = v.id
        ORDER BY r.roster_date DESC, r.start_time ASC
    `;
    return (await pool.query(query)).rows;
};

const findById = async (id) => {
    const query = `SELECT * FROM rosters WHERE id = $1`;
    return (await pool.query(query, [id])).rows[0];
};

const create = async (rosterData) => {
    const { roster_date, shift_name, notes, flotilla_id, vessel_id } = rosterData;
    const query = 'INSERT INTO rosters (roster_date, shift_name, notes, flotilla_id, vessel_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    return (await pool.query(query, [roster_date, shift_name, notes, flotilla_id, vessel_id])).rows[0];
};

// Add functions for roster assignments here later
// const assignMemberToRoster = async (rosterId, memberId, roleId) => { ... };

module.exports = { findAll, findById, create };
