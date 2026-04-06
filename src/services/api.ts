import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fintrack:token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.startsWith('/auth');

    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('fintrack:token');
      localStorage.removeItem('fintrack:user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);

export default api;
