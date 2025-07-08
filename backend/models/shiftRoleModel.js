const pool = require('../config/db');

const findAll = async () => {
    const query = 'SELECT * FROM shift_roles ORDER BY name';
    const result = await pool.query(query);
    return result.rows;
};

const findById = async (id) => {
    const query = 'SELECT * FROM shift_roles WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const create = async (roleData) => {
    const { name, description, qualification_required_id } = roleData;
    const query = `
        INSERT INTO shift_roles (name, description, qualification_required_id)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const result = await pool.query(query, [name, description, qualification_required_id]);
    return result.rows[0];
};

const update = async (id, roleData) => {
    const { name, description, qualification_required_id } = roleData;
    const query = `
        UPDATE shift_roles
        SET name = $1, description = $2, qualification_required_id = $3
        WHERE id = $4
        RETURNING *
    `;
    const result = await pool.query(query, [name, description, qualification_required_id, id]);
    return result.rows[0];
};

const remove = async (id) => {
    await pool.query('DELETE FROM shift_roles WHERE id = $1', [id]);
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};
