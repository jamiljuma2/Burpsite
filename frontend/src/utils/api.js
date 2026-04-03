import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL
  || (process.env.NODE_ENV === 'production'
    ? 'https://burpsite.onrender.com/api'
    : 'http://localhost:5000/api');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor with exponential backoff retry for rate limits
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle 429 rate limit - retry with exponential backoff
    if (error.response?.status === 429) {
      const config = error.config;

      if (!config.retryCount) {
        config.retryCount = 0;
      }

      if (config.retryCount < MAX_RETRIES) {
        config.retryCount += 1;
        // Exponential backoff: 1s, 2s, 4s
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, config.retryCount - 1);

        console.warn(
          `Rate limited. Retrying ${config.retryCount}/${MAX_RETRIES} after ${delay}ms`,
          config.url
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
        return apiClient(config);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
