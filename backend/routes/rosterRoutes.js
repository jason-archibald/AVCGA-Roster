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

// Define access roles
const adminAccess = ['SuperAdmin', 'SquadronCommander', 'FlotillaExecutive'];
const memberAccess = ['SuperAdmin', 'SquadronCommander', 'FlotillaExecutive', 'Member'];

// Basic roster CRUD routes
router.route('/')
    .get(protect, getAllRosters)
    .post(protect, authorize(...adminAccess), createRoster);

router.route('/:id')
    .get(protect, getRosterById)
    .put(protect, authorize(...adminAccess), updateRoster)
    .delete(protect, authorize(...adminAccess), deleteRoster);

// Assignment management routes
router.route('/:id/assignments')
    .get(protect, getRosterAssignments)
    .post(protect, authorize(...adminAccess), assignMemberToRoster);

router.route('/:id/assignments/:assignmentId')
    .put(protect, authorize(...adminAccess), updateRosterAssignment)
    .delete(protect, authorize(...adminAccess), removeRosterAssignment);

// Shift offering routes
router.route('/:id/assignments/:assignmentId/offer')
    .post(protect, authorize(...memberAccess), createShiftOffer);

router.route('/:id/offers')
    .get(protect, authorize(...memberAccess), getShiftOffers);

router.route('/:id/offers/:offerId')
    .put(protect, authorize(...memberAccess), updateShiftOffer);

router.route('/:id/offers/:offerId/accept')
    .post(protect, authorize(...memberAccess), acceptShiftOffer);

// Availability management routes
router.route('/:id/availability/:memberId')
    .put(protect, authorize(...memberAccess), setMemberAvailability);

router.route('/:id/availability')
    .get(protect, authorize(...adminAccess), getMemberAvailability);

router.route('/:id/available-members')
    .get(protect, authorize(...adminAccess), getAvailableMembers);

// Shift roles route
router.get('/shift-roles', protect, getShiftRoles);

module.exports = router;
