import axios from 'axios';

// Create an axios instance with a base URL for your backend
const api = axios.create({
  // IMPORTANT: Make sure this URL matches your backend server's address
  baseURL: 'http://localhost:3000/api', 
});

// Use an interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;