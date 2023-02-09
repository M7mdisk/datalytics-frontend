import axios from 'axios';

export const BACKEND_URL = 'http://localhost:8000/';

const baseURL = BACKEND_URL + 'api';

export const axiosAPI = axios.create({
    baseURL
});

axiosAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('Token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});
