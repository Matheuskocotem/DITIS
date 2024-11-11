import axios from "axios";
import router from '@/router'
import { isPublicRoute } from "@/utils/public-routes";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
    "Content-type": "application/json",
    'Access-Control-Allow-Origin': '*',
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  } else if (!isPublicRoute(config.url)) {
    localStorage.removeItem('token');
    router.replace({ name: 'login' });
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {  
    if (error.response.data.message === 'Unauthenticated.') {
      router.replace({ name: 'login' });
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }

    return Promise.reject(error)
  },
)

export { api };
