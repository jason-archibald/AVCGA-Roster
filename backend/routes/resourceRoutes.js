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

const adminAccess = ['SuperAdmin', 'SquadronCommander', 'FlotillaCommander'];

router.route('/facilities')
    .get(protect, getAllFacilities)
    .post(protect, authorize(...adminAccess), createFacility);

router.route('/equipment')
    .get(protect, getAllEquipment)
    .post(protect, authorize(...adminAccess), createEquipment);

module.exports = router;
