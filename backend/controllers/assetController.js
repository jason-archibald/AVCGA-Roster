const pool = require('../config/db');

const handleApiError = (res, err, entity) => {
    console.error(`Error in ${entity} controller:`, err.message);
    res.status(500).json({ message: 'Server Error' });
};

module.exports = {
    getAllVessels: async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT v.*, f.name as flotilla_name, s.name as squadron_name
                FROM vessels v
                LEFT JOIN flotillas f ON v.flotilla_id = f.id
                LEFT JOIN squadrons s ON f.squadron_id = s.id
                ORDER BY v.name
            `);
            res.json(result.rows);
        } catch (err) {
            handleApiError(res, err, 'vessel');
        }
    },

    getAllVehicles: async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT v.*, f.name as flotilla_name, s.name as squadron_name
                FROM vehicles v
                LEFT JOIN flotillas f ON v.flotilla_id = f.id
                LEFT JOIN squadrons s ON f.squadron_id = s.id
                ORDER BY v.name
            `);
            res.json(result.rows);
        } catch (err) {
            handleApiError(res, err, 'vehicle');
        }
    },

    createVessel: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    createVehicle: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    updateVessel: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    updateVehicle: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    deleteVessel: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    deleteVehicle: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); }
};
