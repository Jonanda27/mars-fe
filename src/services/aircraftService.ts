import api from './api';
import { Aircraft } from '../types/aircraft';

export const aircraftService = {
  getTenantAircrafts: async (): Promise<Aircraft[]> => {
    const response = await api.get('/aircrafts/tenant');
    return response.data.data;
  },

  createTenantAircraft: async (data: Omit<Aircraft, 'id'>): Promise<Aircraft> => {
    const response = await api.post('/aircrafts/tenant', data);
    return response.data.data;
  },

  updateTenantAircraft: async (id: number, data: Partial<Aircraft>): Promise<Aircraft> => {
    const response = await api.put(`/aircrafts/tenant/${id}`, data);
    return response.data.data;
  },

  deleteTenantAircraft: async (id: number): Promise<void> => {
    await api.delete(`/aircrafts/tenant/${id}`);
  },

  getAllAircrafts: async (): Promise<Aircraft[]> => {
    const response = await api.get('/aircrafts');
    return response.data.data;
  },

  getAircraftById: async (id: number): Promise<Aircraft> => {
    const response = await api.get(`/aircrafts/${id}`);
    return response.data.data;
  }
};
