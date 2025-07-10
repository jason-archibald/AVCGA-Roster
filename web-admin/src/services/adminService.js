import api, { handleApiError } from './api';

const adminService = {
    // Member Management (Assumed to exist)
    getAllMembers: async () => { try { return (await api.get('/api/users')).data; } catch(e) { handleApiError(e, 'Could not fetch members'); } },
    getMemberById: async (id) => { try { return (await api.get(`/api/users/${id}`)).data; } catch(e) { handleApiError(e, 'Could not fetch member details'); } },
    createMember: async (data) => { try { return (await api.post('/api/users', data)).data; } catch(e) { handleApiError(e, 'Could not create member'); } },
    updateMember: async (id, data) => { try { return (await api.put(`/api/users/${id}`, data)).data; } catch(e) { handleApiError(e, 'Could not update member'); } },
    deleteMember: async (id) => { try { return (await api.delete(`/api/users/${id}`)).data; } catch(e) { handleApiError(e, 'Could not delete member'); } },

    // Organization Management
    getSquadrons: async () => { try { return (await api.get('/api/organization/squadrons')).data; } catch (e) { handleApiError(e); } },
    createSquadron: async (data) => { try { return (await api.post('/api/organization/squadrons', data)).data; } catch (e) { handleApiError(e); } },
    updateSquadron: async (id, data) => { try { return (await api.put(`/api/organization/squadrons/${id}`, data)).data; } catch (e) { handleApiError(e); } },
    deleteSquadron: async (id) => { try { return (await api.delete(`/api/organization/squadrons/${id}`)).data; } catch (e) { handleApiError(e); } },
    getFlotillas: async () => { try { return (await api.get('/api/organization/flotillas')).data; } catch (e) { handleApiError(e); } },
    createFlotilla: async (data) => { try { return (await api.post('/api/organization/flotillas', data)).data; } catch (e) { handleApiError(e); } },
    updateFlotilla: async (id, data) => { try { return (await api.put(`/api/organization/flotillas/${id}`, data)).data; } catch (e) { handleApiError(e); } },
    deleteFlotilla: async (id) => { try { return (await api.delete(`/api/organization/flotillas/${id}`)).data; } catch (e) { handleApiError(e); } },

    // Asset Management
    getAllVessels: async () => { try { return (await api.get('/api/assets/vessels')).data; } catch (e) { handleApiError(e); } },
    createVessel: async (data) => { try { return (await api.post('/api/assets/vessels', data)).data; } catch (e) { handleApiError(e); } },
    updateVessel: async (id, data) => { try { return (await api.put(`/api/assets/vessels/${id}`, data)).data; } catch (e) { handleApiError(e); } },
    deleteVessel: async (id) => { try { return (await api.delete(`/api/assets/vessels/${id}`)).data; } catch (e) { handleApiError(e); } },
    getAllVehicles: async () => { try { return (await api.get('/api/assets/vehicles')).data; } catch (e) { handleApiError(e); } },
    createVehicle: async (data) => { try { return (await api.post('/api/assets/vehicles', data)).data; } catch (e) { handleApiError(e); } },
    updateVehicle: async (id, data) => { try { return (await api.put(`/api/assets/vehicles/${id}`, data)).data; } catch (e) { handleApiError(e); } },
    deleteVehicle: async (id) => { try { return (await api.delete(`/api/assets/vehicles/${id}`)).data; } catch (e) { handleApiError(e); } },
    getAllEquipment: async () => { try { return (await api.get('/api/assets/equipment')).data; } catch (e) { handleApiError(e, 'Could not fetch equipment'); } },
    createEquipment: async (data) => { try { return (await api.post('/api/assets/equipment', data)).data; } catch (e) { handleApiError(e, 'Could not create equipment'); } },
    updateEquipment: async (id, data) => { try { return (await api.put(`/api/assets/equipment/${id}`, data)).data; } catch (e) { handleApiError(e, 'Could not update equipment'); } },
    deleteEquipment: async (id) => { try { return (await api.delete(`/api/assets/equipment/${id}`)).data; } catch (e) { handleApiError(e, 'Could not delete equipment'); } },
    getAllFacilities: async () => { try { return (await api.get('/api/assets/facilities')).data; } catch (e) { handleApiError(e, 'Could not fetch facilities'); } },
    createFacility: async (data) => { try { return (await api.post('/api/assets/facilities', data)).data; } catch (e) { handleApiError(e, 'Could not create facility'); } },
    updateFacility: async (id, data) => { try { return (await api.put(`/api/assets/facilities/${id}`, data)).data; } catch (e) { handleApiError(e, 'Could not update facility'); } },
    deleteFacility: async (id) => { try { return (await api.delete(`/api/assets/facilities/${id}`)).data; } catch (e) { handleApiError(e, 'Could not delete facility'); } },

    // Roster Management
    getRosters: async () => { try { return (await api.get('/api/rosters')).data; } catch (e) { handleApiError(e); } },
    createRoster: async (data) => { try { return (await api.post('/api/rosters', data)).data; } catch (e) { handleApiError(e); } },
    updateRoster: async (id, data) => { try { return (await api.put(`/api/rosters/${id}`, data)).data; } catch (e) { handleApiError(e); } },
    deleteRoster: async (id) => { try { return (await api.delete(`/api/rosters/${id}`)).data; } catch (e) { handleApiError(e, 'Could not delete roster'); } },
    assignMemberToRoster: async (rosterId, memberId, assignmentData) => { try { return (await api.post(`/api/rosters/${rosterId}/assignments`, { member_id: memberId, ...assignmentData })).data; } catch (e) { handleApiError(e, 'Could not assign member'); } },
    removeMemberFromRoster: async (rosterId, assignmentId) => { try { return (await api.delete(`/api/rosters/${rosterId}/assignments/${assignmentId}`)).data; } catch (e) { handleApiError(e, 'Could not remove member'); } }
};

export default adminService;
