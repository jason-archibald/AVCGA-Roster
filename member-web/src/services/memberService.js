import axios from 'axios';

const api = axios.create();
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const getRosters = async () => {
    try {
        return (await api.get('/api/rosters/')).data;
    } catch (e) {
        throw new Error(e.response?.data?.message || 'Could not fetch rosters');
    }
};

const memberService = {
    getRosters,
};

export default memberService;
