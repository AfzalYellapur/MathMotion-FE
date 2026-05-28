import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error;
    const requestUrl = error.config?.url || '';

    if (status === 401) {
      const skipRedirectUrls = ['/api/auth/me'];
      const skipRedirectPages = ['/', '/login', '/register', '/verify-email', '/forgot-password', '/reset-password'];
      const isSessionCheck = skipRedirectUrls.some(url => requestUrl.includes(url));
      const isOnSkipPage = skipRedirectPages.includes(window.location.pathname);

      if (!isSessionCheck && !isOnSkipPage) {
        window.location.href = '/login';
      }
    } else if (status === 403 && message?.includes('not verified')) {
      // Email not verified
      window.location.href = '/verify-email';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
