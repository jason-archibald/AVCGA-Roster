const rosterModel = require('../models/rosterModel');
const shiftRoleModel = require('../models/shiftRoleModel');

const handleApiError = (res, err, entity) => {
    console.error(`Error in ${entity} controller:`, err.message);
    if (err.code === '23505') {
        return res.status(400).json({ message: `A ${entity} with this identifier already exists.` });
    }
    if (err.code === '23503') {
        return res.status(400).json({ message: 'Referenced record does not exist.' });
    }
    res.status(500).json({ message: err.message || 'Server Error' });
};

module.exports = {
    // BASIC ROSTER CRUD
    getAllRosters: async (req, res) => {
        try {
            const rosters = await rosterModel.findAll();
            res.json(rosters);
        } catch (err) {
            handleApiError(res, err, 'roster');
        }
    },

    getRosterById: async (req, res) => {
        try {
            const roster = await rosterModel.findById(req.params.id);
            if (!roster) {
                return res.status(404).json({ message: 'Roster not found' });
            }
            res.json(roster);
        } catch (err) {
            handleApiError(res, err, 'roster');
        }
    },

    createRoster: async (req, res) => {
        try {
            const rosterData = { ...req.body, created_by: req.user.id };
            const roster = await rosterModel.create(rosterData);
            res.status(201).json(roster);
        } catch (err) {
            handleApiError(res, err, 'roster');
        }
    },

    updateRoster: async (req, res) => {
        try {
            const roster = await rosterModel.update(req.params.id, req.body);
            if (!roster) {
                return res.status(404).json({ message: 'Roster not found' });
            }
            res.json(roster);
        } catch (err) {
            handleApiError(res, err, 'roster');
        }
    },

    deleteRoster: async (req, res) => {
        try {
            await rosterModel.remove(req.params.id);
            res.status(204).send();
        } catch (err) {
            handleApiError(res, err, 'roster');
        }
    },

    // ASSIGNMENT MANAGEMENT
    getRosterAssignments: async (req, res) => {
        try {
            const assignments = await rosterModel.findAssignments(req.params.id);
            res.json(assignments);
        } catch (err) {
            handleApiError(res, err, 'roster assignment');
        }
    },

    assignMemberToRoster: async (req, res) => {
        try {
            const assignmentData = { ...req.body, assigned_by: req.user.id };
            const assignment = await rosterModel.createAssignment(req.params.id, assignmentData);
            res.status(201).json(assignment);
        } catch (err) {
            handleApiError(res, err, 'roster assignment');
        }
    },

    updateRosterAssignment: async (req, res) => {
        try {
            const assignment = await rosterModel.updateAssignment(req.params.assignmentId, req.body);
            if (!assignment) {
                return res.status(404).json({ message: 'Assignment not found' });
            }
            res.json(assignment);
        } catch (err) {
            handleApiError(res, err, 'roster assignment');
        }
    },

    removeRosterAssignment: async (req, res) => {
        try {
            await rosterModel.removeAssignment(req.params.assignmentId);
            res.status(204).send();
        } catch (err) {
            handleApiError(res, err, 'roster assignment');
        }
    },

    // SHIFT OFFERING SYSTEM
    createShiftOffer: async (req, res) => {
        try {
            const offerData = { ...req.body, offered_by: req.user.id };
            const offer = await rosterModel.createShiftOffer(req.params.assignmentId, offerData);
            res.status(201).json(offer);
        } catch (err) {
            handleApiError(res, err, 'shift offer');
        }
    },

    getShiftOffers: async (req, res) => {
        try {
            const offers = await rosterModel.findShiftOffers(req.params.id, req.query.userId);
            res.json(offers);
        } catch (err) {
            handleApiError(res, err, 'shift offer');
        }
    },

    updateShiftOffer: async (req, res) => {
        try {
            const updateData = { ...req.body, responded_at: new Date() };
            const offer = await rosterModel.updateShiftOffer(req.params.offerId, updateData);
            if (!offer) {
                return res.status(404).json({ message: 'Shift offer not found' });
            }
            res.json(offer);
        } catch (err) {
            handleApiError(res, err, 'shift offer');
        }
    },

    acceptShiftOffer: async (req, res) => {
        try {
            const result = await rosterModel.acceptShiftOffer(req.params.offerId, req.user.id);
            res.json(result);
        } catch (err) {
            handleApiError(res, err, 'shift offer acceptance');
        }
    },

    // AVAILABILITY MANAGEMENT
    setMemberAvailability: async (req, res) => {
        try {
            const availabilityData = { ...req.body, updated_by: req.user.id };
            const availability = await rosterModel.setMemberAvailability(
                req.params.memberId, 
                req.params.id, 
                availabilityData
            );
            res.json(availability);
        } catch (err) {
            handleApiError(res, err, 'member availability');
        }
    },

    getMemberAvailability: async (req, res) => {
        try {
            const availability = await rosterModel.getMemberAvailability(req.params.id);
            res.json(availability);
        } catch (err) {
            handleApiError(res, err, 'member availability');
        }
    },

    getAvailableMembers: async (req, res) => {
        try {
            const members = await rosterModel.getAvailableMembers(req.params.id);
            res.json(members);
        } catch (err) {
            handleApiError(res, err, 'available members');
        }
    },

    // SHIFT ROLES MANAGEMENT
    getShiftRoles: async (req, res) => {
        try {
            const roles = await shiftRoleModel.findAll();
            res.json(roles);
        } catch (err) {
            handleApiError(res, err, 'shift role');
        }
    }
};
