const resourceModel = require('../models/resourceModel');

const handleApiError = (res, err, entity) => {
    console.error(`Error in ${entity} controller:`, err.message);
    if (err.code === '23505') {
        return res.status(400).json({ message: `A ${entity} with this name already exists.` });
    }
    res.status(500).json({ message: err.message || 'Server Error' });
};

module.exports = {
    // FACILITIES
    getAllFacilities: async (req, res) => {
        try {
            const facilities = await resourceModel.findAllFacilities();
            res.json(facilities);
        } catch (err) {
            handleApiError(res, err, 'facility');
        }
    },

    createFacility: async (req, res) => {
        try {
            const facility = await resourceModel.createFacility(req.body);
            res.status(201).json(facility);
        } catch (err) {
            handleApiError(res, err, 'facility');
        }
    },

    updateFacility: async (req, res) => {
        try {
            const facility = await resourceModel.updateFacility(req.params.id, req.body);
            if (!facility) {
                return res.status(404).json({ message: 'Facility not found' });
            }
            res.json(facility);
        } catch (err) {
            handleApiError(res, err, 'facility');
        }
    },

    // EQUIPMENT
    getAllEquipment: async (req, res) => {
        try {
            const equipment = await resourceModel.findAllEquipment();
            res.json(equipment);
        } catch (err) {
            handleApiError(res, err, 'equipment');
        }
    },

    createEquipment: async (req, res) => {
        try {
            const equipment = await resourceModel.createEquipment(req.body);
            res.status(201).json(equipment);
        } catch (err) {
            handleApiError(res, err, 'equipment');
        }
    },

    updateEquipment: async (req, res) => {
        try {
            const equipment = await resourceModel.updateEquipment(req.params.id, req.body);
            if (!equipment) {
                return res.status(404).json({ message: 'Equipment not found' });
            }
            res.json(equipment);
        } catch (err) {
            handleApiError(res, err, 'equipment');
        }
    },

    // RESOURCE ASSIGNMENTS
    assignResourceToRoster: async (req, res) => {
        try {
            const { resourceType, resourceId, assignmentRole, notes } = req.body;
            const assignment = await resourceModel.assignResourceToRoster(
                req.params.rosterId,
                resourceType,
                resourceId,
                assignmentRole,
                req.user.id,
                notes
            );
            res.status(201).json(assignment);
        } catch (err) {
            handleApiError(res, err, 'resource assignment');
        }
    },

    getRosterResourceAssignments: async (req, res) => {
        try {
            const assignments = await resourceModel.getRosterResourceAssignments(req.params.rosterId);
            res.json(assignments);
        } catch (err) {
            handleApiError(res, err, 'resource assignments');
        }
    },

    removeResourceAssignment: async (req, res) => {
        try {
            const { resourceType, resourceId, assignmentRole } = req.body;
            await resourceModel.removeResourceAssignment(
                req.params.rosterId,
                resourceType,
                resourceId,
                assignmentRole
            );
            res.status(204).send();
        } catch (err) {
            handleApiError(res, err, 'resource assignment');
        }
    },

    // AVAILABILITY AND CONFLICTS
    checkResourceAvailability: async (req, res) => {
        try {
            const { resourceType, resourceId } = req.params;
            const { startDatetime, endDatetime } = req.query;
            const conflicts = await resourceModel.checkResourceAvailability(
                resourceType,
                resourceId,
                startDatetime,
                endDatetime
            );
            res.json(conflicts);
        } catch (err) {
            handleApiError(res, err, 'resource availability');
        }
    },

    setResourceAvailability: async (req, res) => {
        try {
            const { resourceType, resourceId } = req.params;
            const { startDatetime, endDatetime, availabilityType, reason } = req.body;
            const availability = await resourceModel.setResourceAvailability(
                resourceType,
                resourceId,
                startDatetime,
                endDatetime,
                availabilityType,
                reason,
                req.user.id
            );
            res.status(201).json(availability);
        } catch (err) {
            handleApiError(res, err, 'resource availability');
        }
    },

    detectRosterResourceConflicts: async (req, res) => {
        try {
            const conflicts = await resourceModel.detectResourceConflicts(req.params.rosterId);
            res.json(conflicts);
        } catch (err) {
            handleApiError(res, err, 'resource conflicts');
        }
    },

    getAvailableResources: async (req, res) => {
        try {
            const { resourceType } = req.params;
            const { startDatetime, endDatetime } = req.query;
            const resources = await resourceModel.getAvailableResources(
                resourceType,
                startDatetime,
                endDatetime
            );
            res.json(resources);
        } catch (err) {
            handleApiError(res, err, 'available resources');
        }
    }
};
