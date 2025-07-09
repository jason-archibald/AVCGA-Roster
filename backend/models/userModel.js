const pool = require('../config/db');

const userModel = {
    findAll: async () => {
        const result = await pool.query(`
            SELECT u.id, u.avcga_member_id, u.email, u.first_name, u.last_name, 
                   u.phone_primary, u.phone_secondary, u.role, u.status, u.join_date, 
                   u.address, u.postal_code, u.emergency_contact_name, u.emergency_contact_phone,
                   f.name as flotilla_name, s.name as squadron_name,
                   u.last_login, u.created_at, u.updated_at
            FROM users u
            LEFT JOIN flotillas f ON u.flotilla_id = f.id
            LEFT JOIN squadrons s ON f.squadron_id = s.id
            ORDER BY u.last_name, u.first_name
        `);
        return result.rows;
    },

    findById: async (id) => {
        const result = await pool.query(`
            SELECT u.*, f.name as flotilla_name, s.name as squadron_name
            FROM users u
            LEFT JOIN flotillas f ON u.flotilla_id = f.id
            LEFT JOIN squadrons s ON f.squadron_id = s.id
            WHERE u.id = $1
        `, [id]);
        return result.rows[0];
    },

    findByEmail: async (email) => {
        const result = await pool.query(`
            SELECT u.*, f.name as flotilla_name, s.name as squadron_name
            FROM users u
            LEFT JOIN flotillas f ON u.flotilla_id = f.id
            LEFT JOIN squadrons s ON f.squadron_id = s.id
            WHERE u.email = $1
        `, [email]);
        return result.rows[0];
    },

    create: async (userData) => {
        const {
            avcga_member_id, email, password, first_name, last_name,
            phone_primary, phone_secondary, role, status, join_date,
            emergency_contact_name, emergency_contact_phone,
            address, postal_code, personal_notes, flotilla_id
        } = userData;

        const result = await pool.query(`
            INSERT INTO users (
                avcga_member_id, email, password, first_name, last_name,
                phone_primary, phone_secondary, role, status, join_date,
                emergency_contact_name, emergency_contact_phone,
                address, postal_code, personal_notes, flotilla_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING *
        `, [
            avcga_member_id, email, password, first_name, last_name,
            phone_primary, phone_secondary, role || 'Member', status || 'Active', 
            join_date || new Date(), emergency_contact_name, emergency_contact_phone,
            address, postal_code, personal_notes, flotilla_id
        ]);
        return result.rows[0];
    },

    update: async (id, userData) => {
        const fields = [];
        const values = [];
        let paramCount = 1;

        Object.keys(userData).forEach(key => {
            if (userData[key] !== undefined && key !== 'id') {
                fields.push(`${key} = $${paramCount}`);
                values.push(userData[key]);
                paramCount++;
            }
        });

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        values.push(id);
        const result = await pool.query(`
            UPDATE users 
            SET ${fields.join(', ')}, updated_at = NOW()
            WHERE id = $${paramCount}
            RETURNING *
        `, values);
        
        return result.rows[0];
    },

    delete: async (id) => {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
    },

    updateLastLogin: async (id) => {
        await pool.query(`
            UPDATE users 
            SET last_login = NOW() 
            WHERE id = $1
        `, [id]);
    }
};

module.exports = userModel;
