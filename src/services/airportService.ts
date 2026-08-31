import api from './api';
import { Airport } from '../types/airport';

export const airportService = {
  getAll: async () => {
    const response = await api.get('/airports');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/airports/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<Airport>) => {
    const response = await api.post('/airports', data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<Airport>) => {
    const response = await api.put(`/airports/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/airports/${id}`);
    return response.data;
  }
};
