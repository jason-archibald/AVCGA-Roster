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

const adminAccess = ['SuperAdmin', 'SquadronCommander'];

router.get('/me', protect, getUserPermissions);
router.get('/', protect, authorize(...adminAccess), getAllPermissions);
router.get('/categories', protect, authorize(...adminAccess), getPermissionCategories);
router.get('/roles/:roleName', protect, authorize(...adminAccess), getRolePermissions);
router.post('/users/:userId/grant', protect, authorize(...adminAccess), grantUserPermission);
router.post('/users/:userId/revoke', protect, authorize(...adminAccess), revokeUserPermission);

module.exports = router;
