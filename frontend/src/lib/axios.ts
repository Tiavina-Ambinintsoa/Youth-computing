import axios from 'axios';

import { authService } from '@/services/auth.service';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:1337',
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use((config) => {
    if (config.headers.Authorization) return config;
    const token = authService.getToken();
    if (token && !config.url?.includes('/api/auth/local')) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

api.interceptors.response.use(
    (response: import('axios').AxiosResponse) => response,
    (error) => Promise.reject(error)
);