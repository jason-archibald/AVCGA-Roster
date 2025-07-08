const pool = require('../config/db');

// Using plain text password for development
const passwordColumn = 'password';

const findAll = async () => {
    const query = `
        SELECT u.id, u.avcga_member_id, u.first_name, u.last_name, u.email, u.role, u.status, f.name as flotilla_name
        FROM users u
        LEFT JOIN flotillas f ON u.flotilla_id = f.id
        ORDER BY u.last_name, u.first_name`;
    const result = await pool.query(query);
    return result.rows;
};

const findById = async (id) => {
    const query = `SELECT * FROM users WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const create = async (userData) => {
    const { email, password, first_name, last_name, role, status, avcga_member_id, flotilla_id } = userData;
    const query = `
        INSERT INTO users (email, ${passwordColumn}, first_name, last_name, role, status, avcga_member_id, flotilla_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, email, first_name, last_name;
    `;
    const result = await pool.query(query, [email, password, first_name, last_name, role, status, avcga_member_id, flotilla_id]);
    return result.rows[0];
};

const update = async (id, userData) => {
    const { first_name, last_name, email, role, status, avcga_member_id, flotilla_id, personal_notes } = userData;
    const query = `
        UPDATE users
        SET first_name = $1, last_name = $2, email = $3, role = $4, status = $5, avcga_member_id = $6, flotilla_id = $7, personal_notes = $8, updated_at = NOW()
        WHERE id = $9
        RETURNING *;
    `;
    const result = await pool.query(query, [first_name, last_name, email, role, status, avcga_member_id, flotilla_id, personal_notes, id]);
    return result.rows[0];
};

const remove = async (id) => {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
};
