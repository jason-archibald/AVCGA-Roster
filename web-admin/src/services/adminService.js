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
    getAllUsers: async () => { try { return (await api.get('/api/users/')).data; } catch (e) { handleApiError(e, 'Could not fetch users'); }},
    getUserById: async (id) => { try { return (await api.get(`/api/users/${id}`)).data; } catch (e) { handleApiError(e, 'Could not fetch user'); }},
    createUser: async (data) => { try { return (await api.post('/api/users/', data)).data; } catch (e) { handleApiError(e, 'Could not create user'); }},
    updateUser: async (id, data) => { try { return (await api.put(`/api/users/${id}`, data)).data; } catch (e) { handleApiError(e, 'Could not update user'); }},
    deleteUser: async (id) => { try { return (await api.delete(`/api/users/${id}`)).data; } catch (e) { handleApiError(e, 'Could not delete user'); }},
    
    // Organization Management
    getSquadrons: async () => { try { return (await api.get('/api/organization/squadrons')).data; } catch (e) { handleApiError(e, 'Could not fetch squadrons'); }},
    createSquadron: async (data) => { try { return (await api.post('/api/organization/squadrons', data)).data; } catch (e) { handleApiError(e, 'Could not create squadron'); }},
    getFlotillas: async () => { try { return (await api.get('/api/organization/flotillas')).data; } catch (e) { handleApiError(e, 'Could not fetch flotillas'); }},
    createFlotilla: async (data) => { try { return (await api.post('/api/organization/flotillas', data)).data; } catch (e) { handleApiError(e, 'Could not create flotilla'); }},

    // Roster Management
    getRosters: async () => { try { return (await api.get('/api/rosters/')).data; } catch (e) { handleApiError(e, 'Could not fetch rosters'); }},
};

export default adminService;
