import api from './api';
import { Zone } from '../types/zone';

export const zoneService = {
  getAll: async (airport_id?: number) => {
    const params = airport_id ? { airport_id } : {};
    const response = await api.get('/zones', { params });
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/zones/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<Zone>) => {
    const response = await api.post('/zones', data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<Zone>) => {
    const response = await api.put(`/zones/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/zones/${id}`);
    return response.data;
  }
};
