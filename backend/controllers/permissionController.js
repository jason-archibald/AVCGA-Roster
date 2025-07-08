const permissionModel = require('../models/permissionModel');

const handleApiError = (res, err, entity) => {
    console.error(`Error in ${entity} controller:`, err.message);
    res.status(500).json({ message: err.message || 'Server Error' });
};

module.exports = {
    getUserPermissions: async (req, res) => {
        try {
            const permissions = await permissionModel.getUserPermissions(req.user.id);
            res.json(permissions);
        } catch (err) {
            handleApiError(res, err, 'user permissions');
        }
    },

    getAllPermissions: async (req, res) => {
        try {
            const permissions = await permissionModel.getAllPermissions();
            res.json(permissions);
        } catch (err) {
            handleApiError(res, err, 'permissions');
        }
    },

    getPermissionCategories: async (req, res) => {
        try {
            const categories = await permissionModel.getPermissionCategories();
            res.json(categories);
        } catch (err) {
            handleApiError(res, err, 'permission categories');
        }
    },

    getRolePermissions: async (req, res) => {
        try {
            const permissions = await permissionModel.getRolePermissions(req.params.roleName);
            res.json(permissions);
        } catch (err) {
            handleApiError(res, err, 'role permissions');
        }
    },

    grantUserPermission: async (req, res) => {
        try {
            const { permissionCode, notes } = req.body;
            const result = await permissionModel.grantUserPermission(
                req.params.userId, 
                permissionCode, 
                req.user.id, 
                notes
            );
            res.json(result);
        } catch (err) {
            handleApiError(res, err, 'grant permission');
        }
    },

    revokeUserPermission: async (req, res) => {
        try {
            const { permissionCode, notes } = req.body;
            const result = await permissionModel.revokeUserPermission(
                req.params.userId, 
                permissionCode, 
                req.user.id, 
                notes
            );
            res.json(result);
        } catch (err) {
            handleApiError(res, err, 'revoke permission');
        }
    }
};
