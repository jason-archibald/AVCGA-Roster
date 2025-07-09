const express = require('express');
const router = express.Router();
const {
    getAllVessels,
    createVessel,
    getAllVehicles,
    createVehicle,
    updateVessel,
    updateVehicle,
    deleteVessel,
    deleteVehicle
} = require('../controllers/assetController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const adminAccess = ['SuperAdmin', 'SquadronCommander', 'FlotillaCommander'];

router.route('/vessels')
    .get(protect, getAllVessels)
    .post(protect, authorize(...adminAccess), createVessel);

router.route('/vessels/:id')
    .put(protect, authorize(...adminAccess), updateVessel)
    .delete(protect, authorize(...adminAccess), deleteVessel);

router.route('/vehicles')
    .get(protect, getAllVehicles)
    .post(protect, authorize(...adminAccess), createVehicle);

router.route('/vehicles/:id')
    .put(protect, authorize(...adminAccess), updateVehicle)
    .delete(protect, authorize(...adminAccess), deleteVehicle);

module.exports = router;
