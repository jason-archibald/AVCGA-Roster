const express = require('express');
const router = express.Router();
const {
    getAllRosters,
    getRosterById,
    createRoster,
    updateRoster,
    deleteRoster,
    getRosterAssignments,
    assignMemberToRoster,
    updateRosterAssignment,
    removeRosterAssignment,
    createShiftOffer,
    getShiftOffers,
    updateShiftOffer,
    acceptShiftOffer,
    setMemberAvailability,
    getMemberAvailability,
    getAvailableMembers,
    getShiftRoles
} = require('../controllers/rosterController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const adminAccess = ['SuperAdmin', 'SquadronCommander', 'FlotillaCommander'];
const memberAccess = ['SuperAdmin', 'SquadronCommander', 'FlotillaCommander', 'Member'];

router.route('/')
    .get(protect, getAllRosters)
    .post(protect, authorize(...adminAccess), createRoster);

router.route('/:id')
    .get(protect, getRosterById)
    .put(protect, authorize(...adminAccess), updateRoster)
    .delete(protect, authorize(...adminAccess), deleteRoster);

router.get('/shift-roles', protect, getShiftRoles);

// Stub routes for future implementation
router.route('/:id/assignments')
    .get(protect, getRosterAssignments)
    .post(protect, authorize(...adminAccess), assignMemberToRoster);

module.exports = router;
