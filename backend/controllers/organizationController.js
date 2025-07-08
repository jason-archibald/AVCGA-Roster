const orgModel = require('../models/organizationModel');
const handleApiError = (res, err, entity) => {
    console.error(`Error in ${entity} controller:`, err.message);
    if (err.code === '23505') return res.status(400).json({ message: `A ${entity} with this name already exists.` });
    res.status(500).send('Server Error');
};
module.exports = {
    getSquadrons: async (req, res) => { try { res.json(await orgModel.findAllSquadrons()); } catch (e) { handleApiError(res, e, 'squadron'); }},
    createSquadron: async (req, res) => { try { res.status(201).json(await orgModel.createSquadron(req.body)); } catch (e) { handleApiError(res, e, 'squadron'); }},
    getFlotillas: async (req, res) => { try { res.json(await orgModel.findAllFlotillas()); } catch (e) { handleApiError(res, e, 'flotilla'); }},
    createFlotilla: async (req, res) => { try { res.status(201).json(await orgModel.createFlotilla(req.body)); } catch (e) { handleApiError(res, e, 'flotilla'); }},
};
