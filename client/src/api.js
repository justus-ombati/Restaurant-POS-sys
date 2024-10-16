import axios from 'axios';

const api = axios.create({
  baseURL: 'https://restrant-pos-server-bca59bfb00dd.herokuapp.com',
  
});
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;