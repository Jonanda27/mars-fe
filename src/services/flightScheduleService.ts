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
  verifySchedule: async (scheduleId: number, data: { status: 'Disetujui' | 'Ditolak'; parking_location?: string; officer_notes?: string }): Promise<FlightSchedule> => {
    const response = await api.put(`/schedules/${scheduleId}/verify`, data);
    return response.data.data;
  },

  // Officer check-in directly from approved schedule
  checkInFromSchedule: async (scheduleId: number, data?: { parking_location?: string; notes?: string }): Promise<any> => {
    const response = await api.post(`/schedules/${scheduleId}/check-in`, data || {});
    return response.data.data;
  }
};
