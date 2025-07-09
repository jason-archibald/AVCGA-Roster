const express = require('express');
const router = express.Router();
const {
    getSquadrons,
    getSquadronById,
    createSquadron,
    updateSquadron,
    deleteSquadron,
    getFlotillas,
    getFlotillaById,
    createFlotilla,
    updateFlotilla,
    deleteFlotilla
} = require('../controllers/organizationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const adminAccess = ['SuperAdmin', 'SquadronCommander'];

router.route('/squadrons')
    .get(protect, getSquadrons)
    .post(protect, authorize(...adminAccess), createSquadron);

router.route('/squadrons/:id')
    .get(protect, getSquadronById)
    .put(protect, authorize(...adminAccess), updateSquadron)
    .delete(protect, authorize(...adminAccess), deleteSquadron);

router.route('/flotillas')
    .get(protect, getFlotillas)
    .post(protect, authorize(...adminAccess), createFlotilla);

router.route('/flotillas/:id')
    .get(protect, getFlotillaById)
    .put(protect, authorize(...adminAccess), updateFlotilla)
    .delete(protect, authorize(...adminAccess), deleteFlotilla);

module.exports = router;
