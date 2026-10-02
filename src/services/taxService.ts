import api from './api';
import { MasterTax } from '../types/tax';

export const taxService = {
  getAll: async (params?: { kategori?: string; status?: string }) => {
    const response = await api.get('/master-taxes', { params });
    return response.data.data as MasterTax[];
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/master-taxes/${id}`);
    return response.data.data as MasterTax;
  },
  
  create: async (data: Partial<MasterTax>) => {
    const response = await api.post('/master-taxes', data);
    return response.data.data as MasterTax;
  },
  
  update: async (id: number, data: Partial<MasterTax>) => {
    const response = await api.put(`/master-taxes/${id}`, data);
    return response.data.data as MasterTax;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/master-taxes/${id}`);
    return response.data;
  }
};
