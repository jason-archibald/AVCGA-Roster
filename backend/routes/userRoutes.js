const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    // updateUser,
    // deleteUser,
    getMyProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware'); // Assuming this exists

// Define reusable role arrays
const adminAccess = ['SuperAdmin', 'SquadronCommander', 'FlotillaExecutive'];

// --- Member-specific routes ---
router.get('/me/profile', protect, getMyProfile);

// --- Admin-only routes ---
router.route('/')
    .get(protect, authorize(...adminAccess), getAllUsers)
    .post(protect, authorize(...adminAccess), createUser);

router.route('/:id')
    .get(protect, authorize(...adminAccess), getUserById);
    // .put(protect, authorize(...adminAccess), updateUser)
    // .delete(protect, authorize(...adminAccess), deleteUser);

module.exports = router;
