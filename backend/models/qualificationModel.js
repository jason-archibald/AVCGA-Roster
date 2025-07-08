const pool = require('../config/db');

const findAll = async () => {
    const query = 'SELECT * FROM qualifications ORDER BY name';
    const result = await pool.query(query);
    return result.rows;
};

const findById = async (id) => {
    const query = 'SELECT * FROM qualifications WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const create = async (qualificationData) => {
    const { name, description, expiry_period_months } = qualificationData;
    const query = `
        INSERT INTO qualifications (name, description, expiry_period_months)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const result = await pool.query(query, [name, description, expiry_period_months]);
    return result.rows[0];
};

const update = async (id, qualificationData) => {
    const { name, description, expiry_period_months } = qualificationData;
    const query = `
        UPDATE qualifications
        SET name = $1, description = $2, expiry_period_months = $3
        WHERE id = $4
        RETURNING *
    `;
    const result = await pool.query(query, [name, description, expiry_period_months, id]);
    return result.rows[0];
};

const remove = async (id) => {
    await pool.query('DELETE FROM qualifications WHERE id = $1', [id]);
};

const findMemberQualifications = async (memberId) => {
    const query = `
        SELECT q.*, mq.date_achieved, mq.expiry_date,
               CASE WHEN mq.expiry_date < NOW() THEN true ELSE false END as is_expired
        FROM qualifications q
        JOIN member_qualifications mq ON q.id = mq.qualification_id
        WHERE mq.member_id = $1
        ORDER BY q.name
    `;
    const result = await pool.query(query, [memberId]);
    return result.rows;
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
    findMemberQualifications
};
