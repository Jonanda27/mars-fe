import api from './api';
import { RentalApplication } from '../types/rental';

export const rentalService = {
  createApplication: async (data: any): Promise<RentalApplication> => {
    const response = await api.post('/rentals', data);
    return response.data.data;
  },

  getTenantApplications: async (): Promise<RentalApplication[]> => {
    const response = await api.get('/rentals/tenant');
    return response.data.data;
  },

  getAllApplications: async (): Promise<RentalApplication[]> => {
    const response = await api.get('/rentals/admin');
    return response.data.data;
  },

  getApplicationById: async (id: number): Promise<RentalApplication> => {
    const response = await api.get(`/rentals/${id}`);
    return response.data.data;
  },

  updateApplicationStatus: async (id: number, status: string, asset_id?: number): Promise<RentalApplication> => {
    const response = await api.put(`/rentals/${id}/status`, { status, asset_id });
    return response.data.data;
  }
};
