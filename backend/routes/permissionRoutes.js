const express = require('express');
const router = express.Router();
const {
    getUserPermissions,
    getAllPermissions,
    getPermissionCategories,
    getRolePermissions,
    grantUserPermission,
    revokeUserPermission
} = require('../controllers/permissionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Admin access required for most permission operations
const adminAccess = ['SuperAdmin', 'SquadronCommander'];

// User's own permissions
router.get('/my-permissions', protect, getUserPermissions);

// All permissions and categories (for admin interfaces)
router.get('/', protect, authorize(...adminAccess), getAllPermissions);
router.get('/categories', protect, authorize(...adminAccess), getPermissionCategories);

// Role permissions
router.get('/roles/:roleName', protect, authorize(...adminAccess), getRolePermissions);

// User permission overrides
router.post('/users/:userId/grant', protect, authorize(...adminAccess), grantUserPermission);
router.post('/users/:userId/revoke', protect, authorize(...adminAccess), revokeUserPermission);

module.exports = router;
