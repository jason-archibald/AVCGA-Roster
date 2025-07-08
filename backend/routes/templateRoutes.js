const express = require('express');
const router = express.Router();
const {
    getAllTemplates,
    getTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    createRosterFromTemplate
} = require('../controllers/templateController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Define access roles
const adminAccess = ['SuperAdmin', 'SquadronCommander', 'FlotillaCommander'];
const templateManageAccess = ['SuperAdmin', 'SquadronCommander'];

// Template CRUD routes
router.route('/')
    .get(protect, getAllTemplates)
    .post(protect, authorize(...templateManageAccess), createTemplate);

router.route('/:id')
    .get(protect, getTemplateById)
    .put(protect, authorize(...templateManageAccess), updateTemplate)
    .delete(protect, authorize(...templateManageAccess), deleteTemplate);

// Create roster from template
router.post('/:id/create-roster', protect, authorize(...adminAccess), createRosterFromTemplate);

module.exports = router;
