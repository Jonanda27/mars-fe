import api from './api';
import { UserAccount, AirportOptionsData, CreateUserPayload, UpdateUserPayload } from '../types/user';

export const userService = {
  getUsers: async (): Promise<UserAccount[]> => {
    const response = await api.get('/users');
    return response.data?.data || [];
  },

  getAirportOptions: async (): Promise<AirportOptionsData> => {
    const response = await api.get('/users/airport-options');
    return response.data?.data || { all_options: [], main_airports: [], mini_airports: [] };
  },

  createUser: async (payload: CreateUserPayload): Promise<UserAccount> => {
    const response = await api.post('/users', payload);
    return response.data?.data;
  },

  updateUser: async (id: number, payload: UpdateUserPayload): Promise<UserAccount> => {
    const response = await api.put(`/users/${id}`, payload);
    return response.data?.data;
  },

  deleteUser: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};
