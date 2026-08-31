import api from './api';
import { MasterTariff } from '../types/tariff';

export const tariffService = {
  getAll: async () => {
    const response = await api.get('/tariffs');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/tariffs/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<MasterTariff>) => {
    const response = await api.post('/tariffs', data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<MasterTariff>) => {
    const response = await api.put(`/tariffs/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/tariffs/${id}`);
    return response.data;
  }
};
