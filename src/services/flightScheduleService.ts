import api from './api';
import { FlightSchedule } from '../types/flightSchedule';

export const flightScheduleService = {
  // Tenant submit jadwal
  createSchedule: async (formData: FormData): Promise<FlightSchedule> => {
    const response = await api.post('/schedules', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  },

  // Tenant fetch jadwal sendiri
  getTenantSchedules: async (): Promise<FlightSchedule[]> => {
    const response = await api.get('/schedules/tenant');
    return response.data.data;
  },

  // Officer & Admin fetch all schedules
  getAllSchedules: async (params?: { status?: string; tenant_id?: number | string; parking_location?: string }): Promise<FlightSchedule[]> => {
    const response = await api.get('/schedules', { params });
    return response.data.data;
  },

  // Officer fetch expected arrivals for today
  getTodayExpectedArrivals: async (): Promise<FlightSchedule[]> => {
    const response = await api.get('/schedules/expected-today');
    return response.data.data;
  },

  // Officer verify schedule (Disetujui / Ditolak)
  verifySchedule: async (scheduleId: number, data: FormData | { status: 'Disetujui' | 'Ditolak'; parking_location?: string; officer_notes?: string }): Promise<FlightSchedule> => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const response = await api.put(`/schedules/${scheduleId}/verify`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
    });
    return response.data.data;
  },

  // Officer check-in directly from approved schedule
  checkInFromSchedule: async (scheduleId: number, data?: { parking_location?: string; notes?: string }): Promise<any> => {
    const response = await api.post(`/schedules/${scheduleId}/check-in`, data || {});
    return response.data.data;
  },

  // Officer resend entry permit e-ticket to tenant email
  resendEntryPermit: async (scheduleId: number): Promise<{ success: boolean; message: string; email: string }> => {
    const response = await api.post(`/schedules/${scheduleId}/resend-ticket`);
    return response.data;
  },

  // Public fetch ticket without requiring authentication (direct link / QR code)
  getPublicTicket: async (scheduleId: number | string): Promise<FlightSchedule> => {
    const response = await api.get(`/schedules/public/ticket/${scheduleId}`);
    return response.data.data;
  }
};
