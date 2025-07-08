const templateModel = require('../models/templateModel');

const handleApiError = (res, err, entity) => {
    console.error(`Error in ${entity} controller:`, err.message);
    if (err.code === '23505') {
        return res.status(400).json({ message: `A ${entity} with this name already exists.` });
    }
    res.status(500).json({ message: err.message || 'Server Error' });
};

module.exports = {
    getAllTemplates: async (req, res) => {
        try {
            const { rosterType } = req.query;
            const templates = await templateModel.findAll(rosterType);
            res.json(templates);
        } catch (err) {
            handleApiError(res, err, 'template');
        }
    },

    getTemplateById: async (req, res) => {
        try {
            const template = await templateModel.findById(req.params.id);
            if (!template) {
                return res.status(404).json({ message: 'Template not found' });
            }
            res.json(template);
        } catch (err) {
            handleApiError(res, err, 'template');
        }
    },

    createTemplate: async (req, res) => {
        try {
            const templateData = { ...req.body, created_by: req.user.id };
            const template = await templateModel.create(templateData);
            res.status(201).json(template);
        } catch (err) {
            handleApiError(res, err, 'template');
        }
    },

    updateTemplate: async (req, res) => {
        try {
            const template = await templateModel.update(req.params.id, req.body);
            if (!template) {
                return res.status(404).json({ message: 'Template not found' });
            }
            res.json(template);
        } catch (err) {
            handleApiError(res, err, 'template');
        }
    },

    deleteTemplate: async (req, res) => {
        try {
            await templateModel.remove(req.params.id);
            res.status(204).send();
        } catch (err) {
            handleApiError(res, err, 'template');
        }
    },

    createRosterFromTemplate: async (req, res) => {
        try {
            const rosterData = { ...req.body, created_by: req.user.id };
            const roster = await templateModel.createRosterFromTemplate(req.params.id, rosterData);
            res.status(201).json(roster);
        } catch (err) {
            handleApiError(res, err, 'roster from template');
        }
    }
};
