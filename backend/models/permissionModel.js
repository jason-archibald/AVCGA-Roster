const pool = require('../config/db');

const permissionModel = {
    getUserPermissions: async (userId) => {
        const result = await pool.query(`
            WITH user_role_permissions AS (
                SELECT p.code, p.name, pc.name as category, 'role' as source
                FROM users u
                JOIN role_permissions rp ON rp.role_name = u.role
                JOIN permissions p ON p.id = rp.permission_id
                JOIN permission_categories pc ON pc.id = p.category_id
                WHERE u.id = $1
            ),
            user_override_permissions AS (
                SELECT p.code, p.name, pc.name as category, 
                       CASE WHEN upo.is_granted THEN 'granted' ELSE 'revoked' END as source
                FROM user_permission_overrides upo
                JOIN permissions p ON p.id = upo.permission_id
                JOIN permission_categories pc ON pc.id = p.category_id
                WHERE upo.user_id = $1
            )
            SELECT DISTINCT code, name, category, source
            FROM (
                SELECT * FROM user_role_permissions
                UNION ALL
                SELECT * FROM user_override_permissions WHERE source = 'granted'
                EXCEPT
                SELECT urp.code, urp.name, urp.category, urp.source 
                FROM user_role_permissions urp
                JOIN user_override_permissions uop ON urp.code = uop.code
                WHERE uop.source = 'revoked'
            ) combined_permissions
            ORDER BY category, name
        `, [userId]);
        return result.rows;
    },

    getAllPermissions: async () => {
        const result = await pool.query(`
            SELECT p.*, pc.name as category_name
            FROM permissions p
            JOIN permission_categories pc ON pc.id = p.category_id
            ORDER BY pc.name, p.name
        `);
        return result.rows;
    },

    getPermissionCategories: async () => {
        const result = await pool.query(`
            SELECT pc.*, 
                   json_agg(
                       json_build_object(
                           'id', p.id,
                           'name', p.name,
                           'code', p.code,
                           'description', p.description
                       ) ORDER BY p.name
                   ) as permissions
            FROM permission_categories pc
            LEFT JOIN permissions p ON pc.id = p.category_id
            GROUP BY pc.id
            ORDER BY pc.name
        `);
        return result.rows;
    },

    getRolePermissions: async (roleName) => {
        const result = await pool.query(`
            SELECT p.*, pc.name as category_name
            FROM role_permissions rp
            JOIN permissions p ON p.id = rp.permission_id
            JOIN permission_categories pc ON pc.id = p.category_id
            WHERE rp.role_name = $1
            ORDER BY pc.name, p.name
        `, [roleName]);
        return result.rows;
    },

    grantUserPermission: async (userId, permissionCode, grantedBy, notes) => {
        // Get permission ID
        const permResult = await pool.query(
            'SELECT id FROM permissions WHERE code = $1', [permissionCode]
        );
        
        if (permResult.rows.length === 0) {
            throw new Error('Permission not found');
        }
        
        const permissionId = permResult.rows[0].id;
        
        const result = await pool.query(`
            INSERT INTO user_permission_overrides (user_id, permission_id, is_granted, granted_by, notes)
            VALUES ($1, $2, true, $3, $4)
            ON CONFLICT (user_id, permission_id) 
            DO UPDATE SET is_granted = true, granted_by = $3, granted_at = NOW(), notes = $4
            RETURNING *
        `, [userId, permissionId, grantedBy, notes]);
        
        return result.rows[0];
    },

    revokeUserPermission: async (userId, permissionCode, revokedBy, notes) => {
        // Get permission ID
        const permResult = await pool.query(
            'SELECT id FROM permissions WHERE code = $1', [permissionCode]
        );
        
        if (permResult.rows.length === 0) {
            throw new Error('Permission not found');
        }
        
        const permissionId = permResult.rows[0].id;
        
        const result = await pool.query(`
            INSERT INTO user_permission_overrides (user_id, permission_id, is_granted, granted_by, notes)
            VALUES ($1, $2, false, $3, $4)
            ON CONFLICT (user_id, permission_id) 
            DO UPDATE SET is_granted = false, granted_by = $3, granted_at = NOW(), notes = $4
            RETURNING *
        `, [userId, permissionId, revokedBy, notes]);
        
        return result.rows[0];
    }
};

module.exports = permissionModel;
