import apiClient from './axios-client';

export const register = (email: string, password: string) => {
  return apiClient.post('/api/auth/register', { email, password });
};

export const verifyEmail = (email: string, otp: string) => {
  return apiClient.post('/api/auth/verify-email', { email, otp });
};

export const resendOtp = (email: string) => {
  return apiClient.post('/api/auth/resend-otp', { email });
};

export const login = (email: string, password: string) => {
  return apiClient.post('/api/auth/login', { email, password });
};

export const logout = () => {
  return apiClient.post('/api/auth/logout');
};

export const getMe = () => {
  return apiClient.get('/api/auth/me');
};

export const forgotPassword = (email: string) => {
  return apiClient.post('/api/auth/forgot-password', { email });
};

export const resetPassword = (email: string, otp: string, newPassword: string) => {
  return apiClient.post('/api/auth/reset-password', { email, otp, newPassword });
};
