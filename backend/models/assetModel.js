const pool = require('../config/db');

const findAllVessels = async () => (await pool.query('SELECT * FROM vessels ORDER BY name')).rows;
const createVessel = async ({ name, call_sign, status }) => (await pool.query('INSERT INTO vessels (name, call_sign, status) VALUES ($1, $2, $3) RETURNING *', [name, call_sign, status])).rows[0];

const findAllVehicles = async () => (await pool.query('SELECT * FROM vehicles ORDER BY name')).rows;
const createVehicle = async ({ name, registration, status }) => (await pool.query('INSERT INTO vehicles (name, registration, status) VALUES ($1, $2, $3) RETURNING *', [name, registration, status])).rows[0];

module.exports = { findAllVessels, createVessel, findAllVehicles, createVehicle };
