import axios from 'axios';

const baseURL = 'http://localhost:8000/api';

export const axiosAPI = axios.create({
    baseURL
});

axiosAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('Token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    console.log({ token });
    return config;
});
