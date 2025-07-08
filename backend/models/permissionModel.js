const pool = require('../config/db');

const getUserPermissions = async (userId) => {
    const query = `
        WITH role_perms AS (
            SELECT p.code, p.name, p.description, 'role' as source
            FROM users u
            JOIN role_permissions rp ON u.role = rp.role_name
            JOIN permissions p ON rp.permission_id = p.id
            WHERE u.id = $1
        ),
        user_overrides AS (
            SELECT p.code, p.name, p.description, 
                   CASE WHEN upo.granted THEN 'granted' ELSE 'revoked' END as source
            FROM user_permission_overrides upo
            JOIN permissions p ON upo.permission_id = p.id
            WHERE upo.user_id = $1
        )
        SELECT code, name, description, source
        FROM role_perms
        WHERE code NOT IN (SELECT code FROM user_overrides WHERE source = 'revoked')
        UNION
        SELECT code, name, description, source
        FROM user_overrides
        WHERE source = 'granted'
        ORDER BY name
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

const hasPermission = async (userId, permissionCode) => {
    const permissions = await getUserPermissions(userId);
    return permissions.some(p => p.code === permissionCode);
};

const getAllPermissions = async () => {
    const query = `
        SELECT p.*, pc.name as category_name
        FROM permissions p
        JOIN permission_categories pc ON p.category_id = pc.id
        ORDER BY pc.name, p.name
    `;
    const result = await pool.query(query);
    return result.rows;
};

const getPermissionCategories = async () => {
    const query = 'SELECT * FROM permission_categories ORDER BY name';
    const result = await pool.query(query);
    return result.rows;
};

const getRolePermissions = async (roleName) => {
    const query = `
        SELECT p.code, p.name, p.description
        FROM role_permissions rp
        JOIN permissions p ON rp.permission_id = p.id
        WHERE rp.role_name = $1
        ORDER BY p.name
    `;
    const result = await pool.query(query, [roleName]);
    return result.rows;
};

const grantUserPermission = async (userId, permissionCode, grantedBy, notes = null) => {
    const permQuery = 'SELECT id FROM permissions WHERE code = $1';
    const permResult = await pool.query(permQuery, [permissionCode]);
    
    if (permResult.rows.length === 0) {
        throw new Error('Permission not found');
    }
    
    const query = `
        INSERT INTO user_permission_overrides (user_id, permission_id, granted, granted_by, notes)
        VALUES ($1, $2, true, $3, $4)
        ON CONFLICT (user_id, permission_id)
        DO UPDATE SET granted = true, granted_by = $3, granted_at = NOW(), notes = $4
        RETURNING *
    `;
    const result = await pool.query(query, [userId, permResult.rows[0].id, grantedBy, notes]);
    return result.rows[0];
};

const revokeUserPermission = async (userId, permissionCode, revokedBy, notes = null) => {
    const permQuery = 'SELECT id FROM permissions WHERE code = $1';
    const permResult = await pool.query(permQuery, [permissionCode]);
    
    if (permResult.rows.length === 0) {
        throw new Error('Permission not found');
    }
    
    const query = `
        INSERT INTO user_permission_overrides (user_id, permission_id, granted, granted_by, notes)
        VALUES ($1, $2, false, $3, $4)
        ON CONFLICT (user_id, permission_id)
        DO UPDATE SET granted = false, granted_by = $3, granted_at = NOW(), notes = $4
        RETURNING *
    `;
    const result = await pool.query(query, [userId, permResult.rows[0].id, revokedBy, notes]);
    return result.rows[0];
};

module.exports = {
    getUserPermissions,
    hasPermission,
    getAllPermissions,
    getPermissionCategories,
    getRolePermissions,
    grantUserPermission,
    revokeUserPermission
};
