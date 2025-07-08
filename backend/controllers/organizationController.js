const orgModel = require('../models/organizationModel');

const handleApiError = (res, err, entity) => {
    console.error(`Error in ${entity} controller:`, err.message);
    if (err.code === '23505') {
        return res.status(400).json({ message: `A ${entity} with this name already exists.` });
    }
    if (err.message.includes('Cannot delete')) {
        return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server Error' });
};

module.exports = {
    // Squadron controllers
    getSquadrons: async (req, res) => {
        try {
            const squadrons = await orgModel.findAllSquadrons();
            res.json(squadrons);
        } catch (err) {
            handleApiError(res, err, 'squadron');
        }
    },

    getSquadronById: async (req, res) => {
        try {
            const squadron = await orgModel.findSquadronById(req.params.id);
            if (!squadron) {
                return res.status(404).json({ message: 'Squadron not found' });
            }
            res.json(squadron);
        } catch (err) {
            handleApiError(res, err, 'squadron');
        }
    },

    createSquadron: async (req, res) => {
        try {
            const squadron = await orgModel.createSquadron(req.body);
            res.status(201).json(squadron);
        } catch (err) {
            handleApiError(res, err, 'squadron');
        }
    },

    updateSquadron: async (req, res) => {
        try {
            const squadron = await orgModel.updateSquadron(req.params.id, req.body);
            if (!squadron) {
                return res.status(404).json({ message: 'Squadron not found' });
            }
            res.json(squadron);
        } catch (err) {
            handleApiError(res, err, 'squadron');
        }
    },

    deleteSquadron: async (req, res) => {
        try {
            await orgModel.deleteSquadron(req.params.id);
            res.status(204).send();
        } catch (err) {
            handleApiError(res, err, 'squadron');
        }
    },

    // Flotilla controllers
    getFlotillas: async (req, res) => {
        try {
            const flotillas = await orgModel.findAllFlotillas();
            res.json(flotillas);
        } catch (err) {
            handleApiError(res, err, 'flotilla');
        }
    },

    getFlotillaById: async (req, res) => {
        try {
            const flotilla = await orgModel.findFlotillaById(req.params.id);
            if (!flotilla) {
                return res.status(404).json({ message: 'Flotilla not found' });
            }
            res.json(flotilla);
        } catch (err) {
            handleApiError(res, err, 'flotilla');
        }
    },

    createFlotilla: async (req, res) => {
        try {
            const flotilla = await orgModel.createFlotilla(req.body);
            res.status(201).json(flotilla);
        } catch (err) {
            handleApiError(res, err, 'flotilla');
        }
    },

    updateFlotilla: async (req, res) => {
        try {
            const flotilla = await orgModel.updateFlotilla(req.params.id, req.body);
            if (!flotilla) {
                return res.status(404).json({ message: 'Flotilla not found' });
            }
            res.json(flotilla);
        } catch (err) {
            handleApiError(res, err, 'flotilla');
        }
    },

    deleteFlotilla: async (req, res) => {
        try {
            await orgModel.deleteFlotilla(req.params.id);
            res.status(204).send();
        } catch (err) {
            handleApiError(res, err, 'flotilla');
        }
    }
};
