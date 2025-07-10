import axios from 'axios';

// Create axios instance with interceptor for auth token
const api = axios.create();
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const login = async (email, password) => {
    try {
        const response = await axios.post('/api/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

const logout = () => {
    localStorage.removeItem('token');
};

const getProfile = async () => {
    try {
        const response = await api.get('/api/users/me/profile');
        return response.data;
    } catch (error) {
        logout(); // Clear invalid token
        throw new Error('Session expired');
    }
};

// Password Management Functions
const changePassword = async (currentPassword, newPassword) => {
    try {
        const response = await api.post('/api/auth/change-password', {
            currentPassword,
            newPassword
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to change password');
    }
};

const requestPasswordReset = async (email) => {
    try {
        const response = await api.post('/api/auth/request-reset', {
            email
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to send reset email');
    }
};

const resetPassword = async (token, newPassword) => {
    try {
        const response = await api.post('/api/auth/reset-password', {
            token,
            newPassword
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
};

export default {
    login,
    logout,
    getProfile,
    changePassword,
    requestPasswordReset,
    resetPassword
};
