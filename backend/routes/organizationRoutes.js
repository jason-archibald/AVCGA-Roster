const router = require('express').Router();
const { getSquadrons, createSquadron, getFlotillas, createFlotilla } = require('../controllers/organizationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const adminAccess = ['SuperAdmin', 'SquadronCommander'];
router.route('/squadrons').get(protect, getSquadrons).post(protect, authorize(...adminAccess), createSquadron);
router.route('/flotillas').get(protect, getFlotillas).post(protect, authorize(...adminAccess), createFlotilla);
module.exports = router;
