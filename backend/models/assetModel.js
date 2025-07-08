const pool = require('../config/db');

// Vessel operations
const findAllVessels = async () => {
    const result = await pool.query('SELECT * FROM vessels ORDER BY name');
    return result.rows;
};

const createVessel = async ({ name, call_sign, status, notes }) => {
    const query = 'INSERT INTO vessels (name, call_sign, status, notes) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await pool.query(query, [name, call_sign, status || 'Operational', notes]);
    return result.rows[0];
};

const updateVessel = async (id, { name, call_sign, status, notes }) => {
    const query = 'UPDATE vessels SET name = $1, call_sign = $2, status = $3, notes = $4 WHERE id = $5 RETURNING *';
    const result = await pool.query(query, [name, call_sign, status, notes, id]);
    return result.rows[0];
};

const deleteVessel = async (id) => {
    await pool.query('DELETE FROM vessels WHERE id = $1', [id]);
};

// Vehicle operations
const findAllVehicles = async () => {
    const result = await pool.query('SELECT * FROM vehicles ORDER BY name');
    return result.rows;
};

const createVehicle = async ({ name, registration, status, notes }) => {
    const query = 'INSERT INTO vehicles (name, registration, status, notes) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await pool.query(query, [name, registration, status || 'Operational', notes]);
    return result.rows[0];
};

const updateVehicle = async (id, { name, registration, status, notes }) => {
    const query = 'UPDATE vehicles SET name = $1, registration = $2, status = $3, notes = $4 WHERE id = $5 RETURNING *';
    const result = await pool.query(query, [name, registration, status, notes, id]);
    return result.rows[0];
};

const deleteVehicle = async (id) => {
    await pool.query('DELETE FROM vehicles WHERE id = $1', [id]);
};

module.exports = {
    findAllVessels,
    createVessel,
    updateVessel,
    deleteVessel,
    findAllVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle
};
