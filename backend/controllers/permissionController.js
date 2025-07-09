const pool = require('../config/db');

const handleApiError = (res, err, entity) => {
    console.error(`Error in ${entity} controller:`, err.message);
    res.status(500).json({ message: err.message || 'Server Error' });
};

module.exports = {
    getUserPermissions: async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT p.code, p.name, pc.name as category
                FROM role_permissions rp
                JOIN permissions p ON p.id = rp.permission_id
                JOIN permission_categories pc ON pc.id = p.category_id
                WHERE rp.role_name = $1
                ORDER BY pc.name, p.name
            `, [req.user.role]);
            res.json(result.rows);
        } catch (err) {
            handleApiError(res, err, 'user permissions');
        }
    },

    getAllPermissions: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    getPermissionCategories: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    getRolePermissions: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    grantUserPermission: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    revokeUserPermission: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); }
};
