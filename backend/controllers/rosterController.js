const pool = require('../config/db');

const handleApiError = (res, err, entity) => {
    console.error(`Error in ${entity} controller:`, err.message);
    res.status(500).json({ message: err.message || 'Server Error' });
};

module.exports = {
    getAllRosters: async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT r.*, 
                       u.first_name || ' ' || u.last_name as created_by_name,
                       f.name as flotilla_name
                FROM rosters r
                LEFT JOIN users u ON r.created_by = u.id
                LEFT JOIN flotillas f ON r.flotilla_id = f.id
                ORDER BY r.start_datetime DESC
            `);
            res.json(result.rows);
        } catch (err) {
            handleApiError(res, err, 'roster');
        }
    },

    getRosterById: async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT r.*, 
                       u.first_name || ' ' || u.last_name as created_by_name,
                       f.name as flotilla_name
                FROM rosters r
                LEFT JOIN users u ON r.created_by = u.id
                LEFT JOIN flotillas f ON r.flotilla_id = f.id
                WHERE r.id = $1
            `, [req.params.id]);
            
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Roster not found' });
            }
            
            res.json(result.rows[0]);
        } catch (err) {
            handleApiError(res, err, 'roster');
        }
    },

    getShiftRoles: async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM shift_roles ORDER BY name');
            res.json(result.rows);
        } catch (err) {
            handleApiError(res, err, 'shift roles');
        }
    },

    // Stub implementations for other methods
    createRoster: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    updateRoster: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    deleteRoster: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    getRosterAssignments: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    assignMemberToRoster: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    updateRosterAssignment: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    removeRosterAssignment: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    createShiftOffer: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    getShiftOffers: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    updateShiftOffer: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    acceptShiftOffer: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    setMemberAvailability: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    getMemberAvailability: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); },
    getAvailableMembers: async (req, res) => { res.status(501).json({ message: 'Not implemented yet' }); }
};
