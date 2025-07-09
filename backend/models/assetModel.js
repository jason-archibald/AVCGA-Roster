const pool = require('../config/db');

const assetModel = {
    // Vessel methods
    findAllVessels: async () => {
        const result = await pool.query(`
            SELECT * FROM vessels ORDER BY name
        `);
        return result.rows;
    },

    createVessel: async (data) => {
        const { name, call_sign, registration, vessel_type, length_meters, max_passengers, status, home_port, notes } = data;
        const result = await pool.query(`
            INSERT INTO vessels (name, call_sign, registration, vessel_type, length_meters, max_passengers, status, home_port, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `, [name, call_sign, registration, vessel_type, length_meters, max_passengers, status || 'Operational', home_port, notes]);
        return result.rows[0];
    },

    updateVessel: async (id, data) => {
        const fields = [];
        const values = [];
        let paramCount = 1;

        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && key !== 'id') {
                fields.push(`${key} = $${paramCount}`);
                values.push(data[key]);
                paramCount++;
            }
        });

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        values.push(id);
        const result = await pool.query(`
            UPDATE vessels 
            SET ${fields.join(', ')}, updated_at = NOW()
            WHERE id = $${paramCount}
            RETURNING *
        `, values);
        
        return result.rows[0];
    },

    deleteVessel: async (id) => {
        await pool.query('DELETE FROM vessels WHERE id = $1', [id]);
    },

    // Vehicle methods
    findAllVehicles: async () => {
        const result = await pool.query(`
            SELECT * FROM vehicles ORDER BY name
        `);
        return result.rows;
    },

    createVehicle: async (data) => {
        const { name, registration, vehicle_type, max_passengers, status, base_location, notes } = data;
        const result = await pool.query(`
            INSERT INTO vehicles (name, registration, vehicle_type, max_passengers, status, base_location, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [name, registration, vehicle_type, max_passengers, status || 'Operational', base_location, notes]);
        return result.rows[0];
    },

    updateVehicle: async (id, data) => {
        const fields = [];
        const values = [];
        let paramCount = 1;

        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && key !== 'id') {
                fields.push(`${key} = $${paramCount}`);
                values.push(data[key]);
                paramCount++;
            }
        });

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        values.push(id);
        const result = await pool.query(`
            UPDATE vehicles 
            SET ${fields.join(', ')}, updated_at = NOW()
            WHERE id = $${paramCount}
            RETURNING *
        `, values);
        
        return result.rows[0];
    },

    deleteVehicle: async (id) => {
        await pool.query('DELETE FROM vehicles WHERE id = $1', [id]);
    }
};

module.exports = assetModel;
