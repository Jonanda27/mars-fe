import api from './api';
import { RegisterTenantPayload, AuthResponse, LoginPayload, LoginResponse, UserData } from '../types/auth';

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', payload);
    return response.data;
  },

  registerTenant: async (payload: RegisterTenantPayload): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', payload);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Terjadi kesalahan saat pendaftaran');
      }
      throw new Error('Gagal terhubung ke server');
    }
  },

  getMe: async (): Promise<UserData> => {
    const response = await api.get('/auth/me');
    const user = response.data.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
    return user;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
};
