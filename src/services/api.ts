import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Otomatis kirim token di setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Logout otomatis jika token kadaluarsa
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

export default api;