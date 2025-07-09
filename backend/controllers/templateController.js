const pool = require('../config/db');

const handleApiError = (res, err, entity) => {
    console.error(`Error in ${entity} controller:`, err.message);
    res.status(500).json({ message: err.message || 'Server Error' });
};

module.exports = {
    getAllTemplates: async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM roster_templates ORDER BY name');
            res.json(result.rows);
        } catch (err) {
            handleApiError(res, err, 'template');
        }
    },

    getTemplateById: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    createTemplate: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    updateTemplate: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    deleteTemplate: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    createRosterFromTemplate: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); }
};
