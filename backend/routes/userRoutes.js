const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getMyProfile,
    updateMyProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    getFlotillas
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Define access roles
const adminAccess = ['SuperAdmin', 'SquadronCommander', 'FlotillaCommander'];
const seniorAdminAccess = ['SuperAdmin', 'SquadronCommander'];

// Public routes
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Member routes
router.get('/me/profile', protect, getMyProfile);
router.put('/me/profile', protect, updateMyProfile);
router.put('/me/password', protect, changePassword);

// Utility routes
router.get('/flotillas', protect, getFlotillas);

// Admin routes
router.route('/')
    .get(protect, authorize(...adminAccess), getAllUsers)
    .post(protect, authorize(...adminAccess), createUser);

router.route('/:id')
    .get(protect, authorize(...adminAccess), getUserById)
    .put(protect, authorize(...adminAccess), updateUser)
    .delete(protect, authorize(...seniorAdminAccess), deleteUser);

router.put('/:id/password', protect, authorize(...adminAccess), changePassword);

module.exports = router;
