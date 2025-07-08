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

export default {
    login,
    logout,
    getProfile
};
