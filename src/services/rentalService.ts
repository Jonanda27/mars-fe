import api from './api';
import { RentalApplication } from '../types/rental';

export const rentalService = {
  createApplication: async (data: FormData | Record<string, unknown>): Promise<RentalApplication> => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const response = await api.post('/rentals', data, isFormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : undefined);
    return response.data.data;
  },

  uploadOfficialLetter: async (id: number, formData: FormData): Promise<RentalApplication> => {
    const response = await api.post(`/rentals/${id}/upload-letter`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
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

  updateApplicationStatus: async (id: number, status: string, asset_id?: number, allocated_stand?: string): Promise<RentalApplication> => {
    const response = await api.put(`/rentals/${id}/status`, { status, asset_id, allocated_stand });
    return response.data.data;
  },

  verifyLetter: async (id: number, status: string): Promise<RentalApplication> => {
    const response = await api.patch(`/rentals/${id}/verify-letter`, { status });
    return response.data.data;
  },

  approveKadis: async (id: number): Promise<RentalApplication> => {
    const response = await api.patch(`/rentals/${id}/approve-kadis`);
    return response.data.data;
  },

  completeDetails: async (id: number, data: any): Promise<RentalApplication> => {
    const response = await api.patch(`/rentals/${id}/complete-details`, data);
    return response.data.data;
  },

  uploadPayungSignature: async (id: number, formData: FormData): Promise<RentalApplication> => {
    const response = await api.post(`/rentals/${id}/upload-payung-signature`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  uploadSignature: async (id: number, formData: FormData): Promise<RentalApplication> => {
    const response = await api.post(`/rentals/${id}/upload-signature`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  getApprovedRentals: async (): Promise<RentalApplication[]> => {
    const response = await api.get('/rentals/approved');
    return response.data.data;
  },

  requestExtension: async (id: number, data: { requested_end_date: string; reason: string }): Promise<RentalApplication> => {
    const response = await api.post(`/rentals/${id}/request-extension`, data);
    return response.data.data;
  },

  getPendingExtensions: async (): Promise<RentalApplication[]> => {
    const response = await api.get('/rentals/extensions/pending');
    return response.data.data;
  },

  getAssetAvailability: async (params?: { startDate?: string; endDate?: string; excludeApplicationId?: number; category?: string }): Promise<any[]> => {
    const response = await api.get('/rentals/assets-availability', { params });
    return response.data.data;
  },

  reviewExtension: async (id: number, data: { action: 'APPROVE' | 'REJECT'; target_asset_id?: number; admin_notes?: string }): Promise<RentalApplication> => {
    const response = await api.post(`/rentals/${id}/review-extension`, data);
    return response.data.data;
  },

  getMiniAirportStandAvailability: async (airportId: number, date?: string, excludeId?: number): Promise<StandAvailability[]> => {
    const response = await api.get('/rentals/mini-airport/stand-availability', {
      params: { airport_id: airportId, date, exclude_id: excludeId }
    });
    return response.data.data;
  }
};

export interface StandAvailability {
  stand: string;
  name: string;
  is_occupied: boolean;
  occupied_by: string | null;
  aircraft_type: string | null;
  status: string;
  source: string | null;
  notes: string;
}

