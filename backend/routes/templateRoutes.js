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

const adminAccess = ['SuperAdmin', 'SquadronCommander', 'FlotillaCommander'];

router.route('/')
    .get(protect, getAllTemplates)
    .post(protect, authorize(...adminAccess), createTemplate);

router.route('/:id')
    .get(protect, getTemplateById)
    .put(protect, authorize(...adminAccess), updateTemplate)
    .delete(protect, authorize(...adminAccess), deleteTemplate);

router.post('/:id/create-roster', protect, authorize(...adminAccess), createRosterFromTemplate);

module.exports = router;
