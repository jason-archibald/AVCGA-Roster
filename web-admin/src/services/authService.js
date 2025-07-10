import api from './api';

const authService = {
    login: async (email, password) => {
        const response = await api.post('/api/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (e) {
            return null;
        }
    },
    
    // Password Management
    changePassword: async (currentPassword, newPassword) => {
        const response = await api.post('/api/auth/change-password', {
            currentPassword,
            newPassword
        });
        return response.data;
    },

    requestPasswordReset: async (email) => {
        const response = await api.post('/api/auth/request-reset', {
            email
        });
        return response.data;
    },

    resetPassword: async (token, newPassword) => {
        const response = await api.post('/api/auth/reset-password', {
            token,
            newPassword
        });
        return response.data;
    }
};

export default authService;
