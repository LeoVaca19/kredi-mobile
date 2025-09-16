import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_CONFIG } from '../config';
import { showErrorToast } from '../utils/toast';

class HttpClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        
        // Add auth token if available
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      async (error) => {
        console.error('❌ Response Error:', error.response?.data || error.message);
        
        // Handle specific error cases
        if (error.response?.status === 401) {
          // Clear auth data
          await AsyncStorage.removeItem('auth_token');
          showErrorToast('Sesión expirada. Por favor, vuelve a conectar tu wallet.');
        } else if (error.response?.status >= 500) {
          showErrorToast('Error del servidor. Inténtalo más tarde.');
        } else if (error.code === 'NETWORK_ERROR') {
          showErrorToast('Error de conexión. Verifica tu internet.');
        }

        return Promise.reject(error);
      }
    );
  }

  // Retry mechanism
  async requestWithRetry(config, retries = API_CONFIG.RETRY_ATTEMPTS) {
    try {
      const response = await this.client(config);
      return response;
    } catch (error) {
      if (retries > 0 && this.shouldRetry(error)) {
        console.log(`🔄 Retrying request... (${retries} attempts left)`);
        await this.delay(1000); // Wait 1 second before retry
        return this.requestWithRetry(config, retries - 1);
      }
      throw error;
    }
  }

  shouldRetry(error) {
    return (
      error.code === 'TIMEOUT' ||
      (error.response && error.response.status >= 500)
    );
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  get(url, config = {}) {
    return this.requestWithRetry({ ...config, method: 'GET', url });
  }

  post(url, data, config = {}) {
    return this.requestWithRetry({ ...config, method: 'POST', url, data });
  }

  put(url, data, config = {}) {
    return this.requestWithRetry({ ...config, method: 'PUT', url, data });
  }

  delete(url, config = {}) {
    return this.requestWithRetry({ ...config, method: 'DELETE', url });
  }
}

export default new HttpClient();