import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.stevenpatino.dev',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
   
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      requestData: error.config?.data,
    });
    
    // Log más detallado para errores 500
    if (error.response?.status === 500) {
      console.error('Error 500 - Detalles completos:', {
        fullError: error,
        responseText: error.response?.data,
        requestPayload: error.config?.data,
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;