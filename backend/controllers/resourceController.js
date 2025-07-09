const pool = require('../config/db');

const handleApiError = (res, err, entity) => {
    console.error(`Error in ${entity} controller:`, err.message);
    res.status(500).json({ message: err.message || 'Server Error' });
};

module.exports = {
    getAllFacilities: async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM facilities ORDER BY name');
            res.json(result.rows);
        } catch (err) {
            handleApiError(res, err, 'facilities');
        }
    },

    getAllEquipment: async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM equipment ORDER BY name');
            res.json(result.rows);
        } catch (err) {
            handleApiError(res, err, 'equipment');
        }
    },

    // Stub implementations for other methods
    createFacility: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    updateFacility: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    createEquipment: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    updateEquipment: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    assignResourceToRoster: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    getRosterResourceAssignments: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    removeResourceAssignment: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    checkResourceAvailability: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    setResourceAvailability: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    detectRosterResourceConflicts: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    getAvailableResources: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); }
};
