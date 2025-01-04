import axios from 'axios';
import { handleUnauthorized } from './auth-utils';
import { backendUrl } from './config';

const api = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we're currently handling an unauthorized response
let isHandlingUnauthorized = false;

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Check for unauthorized response
    if (error.response?.status === 401 && !isHandlingUnauthorized) {
      isHandlingUnauthorized = true;
      try {
        await handleUnauthorized();
      } finally {
        isHandlingUnauthorized = false;
      }
      return Promise.reject(new Error('Unauthorized'));
    }

    // Handle network errors that might indicate an expired session
    if (error.message === 'Network Error' && !isHandlingUnauthorized) {
      isHandlingUnauthorized = true;
      try {
        await handleUnauthorized();
      } finally {
        isHandlingUnauthorized = false;
      }
      return Promise.reject(new Error('Unauthorized'));
    }

    return Promise.reject(error);
  }
);

export default api; 