const assetModel = require('../models/assetModel');

const handleApiError = (res, err, entity) => {
    console.error(`Error in ${entity} controller:`, err.message);
    if (err.code === '23505') {
        return res.status(400).json({ message: `A ${entity} with this name already exists.` });
    }
    res.status(500).json({ message: 'Server Error' });
};

module.exports = {
    // Vessel controllers
    getAllVessels: async (req, res) => {
        try {
            const vessels = await assetModel.findAllVessels();
            res.json(vessels);
        } catch (err) {
            handleApiError(res, err, 'vessel');
        }
    },

    createVessel: async (req, res) => {
        try {
            const vessel = await assetModel.createVessel(req.body);
            res.status(201).json(vessel);
        } catch (err) {
            handleApiError(res, err, 'vessel');
        }
    },

    updateVessel: async (req, res) => {
        try {
            const vessel = await assetModel.updateVessel(req.params.id, req.body);
            if (!vessel) {
                return res.status(404).json({ message: 'Vessel not found' });
            }
            res.json(vessel);
        } catch (err) {
            handleApiError(res, err, 'vessel');
        }
    },

    deleteVessel: async (req, res) => {
        try {
            await assetModel.deleteVessel(req.params.id);
            res.status(204).send();
        } catch (err) {
            handleApiError(res, err, 'vessel');
        }
    },

    // Vehicle controllers
    getAllVehicles: async (req, res) => {
        try {
            const vehicles = await assetModel.findAllVehicles();
            res.json(vehicles);
        } catch (err) {
            handleApiError(res, err, 'vehicle');
        }
    },

    createVehicle: async (req, res) => {
        try {
            const vehicle = await assetModel.createVehicle(req.body);
            res.status(201).json(vehicle);
        } catch (err) {
            handleApiError(res, err, 'vehicle');
        }
    },

    updateVehicle: async (req, res) => {
        try {
            const vehicle = await assetModel.updateVehicle(req.params.id, req.body);
            if (!vehicle) {
                return res.status(404).json({ message: 'Vehicle not found' });
            }
            res.json(vehicle);
        } catch (err) {
            handleApiError(res, err, 'vehicle');
        }
    },

    deleteVehicle: async (req, res) => {
        try {
            await assetModel.deleteVehicle(req.params.id);
            res.status(204).send();
        } catch (err) {
            handleApiError(res, err, 'vehicle');
        }
    }
};
