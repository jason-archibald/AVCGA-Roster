import axios from 'axios';

// This helper creates an axios instance that automatically attaches the auth token.
const api = axios.create();
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// This helper provides consistent error messages.
const handleApiError = (error, defaultMsg) => {
    throw new Error(error.response?.data?.message || defaultMsg);
};

const adminService = {
    // User Management
    getAllUsers: async () => { 
        try { 
            return (await api.get('/api/users/')).data; 
        } catch (e) { 
            handleApiError(e, 'Could not fetch users'); 
        }
    },
    getUserById: async (id) => { 
        try { 
            return (await api.get(`/api/users/${id}`)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not fetch user'); 
        }
    },
    createUser: async (data) => { 
        try { 
            return (await api.post('/api/users/', data)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not create user'); 
        }
    },
    updateUser: async (id, data) => { 
        try { 
            return (await api.put(`/api/users/${id}`, data)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not update user'); 
        }
    },
    deleteUser: async (id) => { 
        try { 
            return (await api.delete(`/api/users/${id}`)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not delete user'); 
        }
    },
    
    // Organization Management - Squadrons
    getSquadrons: async () => { 
        try { 
            return (await api.get('/api/organization/squadrons')).data; 
        } catch (e) { 
            handleApiError(e, 'Could not fetch squadrons'); 
        }
    },
    getSquadronById: async (id) => { 
        try { 
            return (await api.get(`/api/organization/squadrons/${id}`)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not fetch squadron'); 
        }
    },
    createSquadron: async (data) => { 
        try { 
            return (await api.post('/api/organization/squadrons', data)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not create squadron'); 
        }
    },
    updateSquadron: async (id, data) => { 
        try { 
            return (await api.put(`/api/organization/squadrons/${id}`, data)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not update squadron'); 
        }
    },
    deleteSquadron: async (id) => { 
        try { 
            return (await api.delete(`/api/organization/squadrons/${id}`)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not delete squadron'); 
        }
    },

    // Organization Management - Flotillas
    getFlotillas: async () => { 
        try { 
            return (await api.get('/api/organization/flotillas')).data; 
        } catch (e) { 
            handleApiError(e, 'Could not fetch flotillas'); 
        }
    },
    getFlotillaById: async (id) => { 
        try { 
            return (await api.get(`/api/organization/flotillas/${id}`)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not fetch flotilla'); 
        }
    },
    createFlotilla: async (data) => { 
        try { 
            return (await api.post('/api/organization/flotillas', data)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not create flotilla'); 
        }
    },
    updateFlotilla: async (id, data) => { 
        try { 
            return (await api.put(`/api/organization/flotillas/${id}`, data)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not update flotilla'); 
        }
    },
    deleteFlotilla: async (id) => { 
        try { 
            return (await api.delete(`/api/organization/flotillas/${id}`)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not delete flotilla'); 
        }
    },

    // Asset Management - Vessels
    getAllVessels: async () => { 
        try { 
            return (await api.get('/api/assets/vessels')).data; 
        } catch (e) { 
            handleApiError(e, 'Could not fetch vessels'); 
        }
    },
    createVessel: async (data) => { 
        try { 
            return (await api.post('/api/assets/vessels', data)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not create vessel'); 
        }
    },
    updateVessel: async (id, data) => { 
        try { 
            return (await api.put(`/api/assets/vessels/${id}`, data)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not update vessel'); 
        }
    },
    deleteVessel: async (id) => { 
        try { 
            return (await api.delete(`/api/assets/vessels/${id}`)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not delete vessel'); 
        }
    },

    // Asset Management - Vehicles
    getAllVehicles: async () => { 
        try { 
            return (await api.get('/api/assets/vehicles')).data; 
        } catch (e) { 
            handleApiError(e, 'Could not fetch vehicles'); 
        }
    },
    createVehicle: async (data) => { 
        try { 
            return (await api.post('/api/assets/vehicles', data)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not create vehicle'); 
        }
    },
    updateVehicle: async (id, data) => { 
        try { 
            return (await api.put(`/api/assets/vehicles/${id}`, data)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not update vehicle'); 
        }
    },
    deleteVehicle: async (id) => { 
        try { 
            return (await api.delete(`/api/assets/vehicles/${id}`)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not delete vehicle'); 
        }
    },

    // Roster Management
    getRosters: async () => { 
        try { 
            return (await api.get('/api/rosters/')).data; 
        } catch (e) { 
            handleApiError(e, 'Could not fetch rosters'); 
        }
    },
    getRosterById: async (id) => { 
        try { 
            return (await api.get(`/api/rosters/${id}`)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not fetch roster'); 
        }
    },
    createRoster: async (data) => { 
        try { 
            return (await api.post('/api/rosters/', data)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not create roster'); 
        }
    },
    updateRoster: async (id, data) => { 
        try { 
            return (await api.put(`/api/rosters/${id}`, data)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not update roster'); 
        }
    },
    deleteRoster: async (id) => { 
        try { 
            return (await api.delete(`/api/rosters/${id}`)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not delete roster'); 
        }
    },

    // Roster Assignment Management
    getRosterAssignments: async (rosterId) => { 
        try { 
            return (await api.get(`/api/rosters/${rosterId}/assignments`)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not fetch roster assignments'); 
        }
    },
    assignMemberToRoster: async (rosterId, assignmentData) => { 
        try { 
            return (await api.post(`/api/rosters/${rosterId}/assignments`, assignmentData)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not assign member to roster'); 
        }
    },
    updateRosterAssignment: async (rosterId, assignmentId, updateData) => { 
        try { 
            return (await api.put(`/api/rosters/${rosterId}/assignments/${assignmentId}`, updateData)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not update roster assignment'); 
        }
    },
    removeRosterAssignment: async (rosterId, assignmentId) => { 
        try { 
            return (await api.delete(`/api/rosters/${rosterId}/assignments/${assignmentId}`)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not remove roster assignment'); 
        }
    },

    // Shift Offering System
    createShiftOffer: async (assignmentId, offerData) => { 
        try { 
            return (await api.post(`/api/rosters/assignments/${assignmentId}/offer`, offerData)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not create shift offer'); 
        }
    },
    getShiftOffers: async (rosterId, userId = null) => { 
        try { 
            const params = userId ? { userId } : {};
            return (await api.get(`/api/rosters/${rosterId}/offers`, { params })).data; 
        } catch (e) { 
            handleApiError(e, 'Could not fetch shift offers'); 
        }
    },
    updateShiftOffer: async (rosterId, offerId, updateData) => { 
        try { 
            return (await api.put(`/api/rosters/${rosterId}/offers/${offerId}`, updateData)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not update shift offer'); 
        }
    },
    acceptShiftOffer: async (rosterId, offerId) => { 
        try { 
            return (await api.post(`/api/rosters/${rosterId}/offers/${offerId}/accept`)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not accept shift offer'); 
        }
    },

    // Availability Management
    setMemberAvailability: async (rosterId, memberId, availabilityData) => { 
        try { 
            return (await api.put(`/api/rosters/${rosterId}/availability/${memberId}`, availabilityData)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not set member availability'); 
        }
    },
    getMemberAvailability: async (rosterId) => { 
        try { 
            return (await api.get(`/api/rosters/${rosterId}/availability`)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not fetch member availability'); 
        }
    },
    getAvailableMembers: async (rosterId) => { 
        try { 
            return (await api.get(`/api/rosters/${rosterId}/available-members`)).data; 
        } catch (e) { 
            handleApiError(e, 'Could not fetch available members'); 
        }
    },

    // Shift Roles
    getShiftRoles: async () => { 
        try { 
            return (await api.get('/api/rosters/shift-roles')).data; 
        } catch (e) { 
            handleApiError(e, 'Could not fetch shift roles'); 
        }
    }
};

export default adminService;
