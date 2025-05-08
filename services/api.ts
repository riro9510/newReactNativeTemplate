

import axios from 'axios';
import Config from 'react-native-config';

const {
  API_URL_PROD, 
  API_URL_DEV, 
  API_TOKEN, 
  USE_COOKIES,
  NODE_ENV
} = Config;

const isDev = NODE_ENV === 'development';
const baseURL = isDev ? API_URL_DEV : API_URL_PROD;

interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  withCredentials?: boolean;
}

const apiConfig: ApiConfig = {
  baseURL:baseURL!,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
  },
};

if (USE_COOKIES === 'true') {
  apiConfig.withCredentials = true;
} else if (API_TOKEN) {
  apiConfig.headers.Authorization = `Bearer ${API_TOKEN}`;
}

const api = axios.create(apiConfig);


api.interceptors.request.use(
  (config) => {
    if (isDev) {
      console.log('Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (isDev) {
      console.log('Response:', response.status, response.config.url);
    }
    return response.data;
  },
  (error) => {
    if (isDev) {
      console.error('API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    
    const apiError = {
      message: error.response?.data?.message || error.message,
      code: error.response?.status || 500,
      data: error.response?.data,
    };
    
    return Promise.reject(apiError);
  }
);

export default api;
