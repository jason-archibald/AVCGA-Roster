const express = require('express');
const router = express.Router();
const {
    getAllFacilities,
    createFacility,
    updateFacility,
    getAllEquipment,
    createEquipment,
    updateEquipment,
    assignResourceToRoster,
    getRosterResourceAssignments,
    removeResourceAssignment,
    checkResourceAvailability,
    setResourceAvailability,
    detectRosterResourceConflicts,
    getAvailableResources
} = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Define access roles
const adminAccess = ['SuperAdmin', 'SquadronCommander', 'FlotillaCommander'];
const resourceManageAccess = ['SuperAdmin', 'SquadronCommander'];

// Facilities routes
router.route('/facilities')
    .get(protect, getAllFacilities)
    .post(protect, authorize(...resourceManageAccess), createFacility);

router.route('/facilities/:id')
    .put(protect, authorize(...resourceManageAccess), updateFacility);

// Equipment routes
router.route('/equipment')
    .get(protect, getAllEquipment)
    .post(protect, authorize(...resourceManageAccess), createEquipment);

router.route('/equipment/:id')
    .put(protect, authorize(...resourceManageAccess), updateEquipment);

// Resource assignment routes
router.route('/rosters/:rosterId/assignments')
    .get(protect, getRosterResourceAssignments)
    .post(protect, authorize(...adminAccess), assignResourceToRoster)
    .delete(protect, authorize(...adminAccess), removeResourceAssignment);

// Availability and conflict routes
router.route('/availability/:resourceType/:resourceId')
    .get(protect, checkResourceAvailability)
    .post(protect, authorize(...adminAccess), setResourceAvailability);

router.get('/rosters/:rosterId/conflicts', protect, authorize(...adminAccess), detectRosterResourceConflicts);
router.get('/available/:resourceType', protect, authorize(...adminAccess), getAvailableResources);

module.exports = router;
