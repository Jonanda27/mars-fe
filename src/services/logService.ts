import api from './api';
import { OperationalLog, OverstayLogItem } from '../types/log';

export const logService = {
  getAllLogs: async (): Promise<OperationalLog[]> => {
    const response = await api.get('/logs');
    return response.data.data;
  },

  getActiveLogs: async (): Promise<OperationalLog[]> => {
    const response = await api.get('/logs/active');
    return response.data.data;
  },

  getOverstayLogs: async (): Promise<OverstayLogItem[]> => {
    const response = await api.get('/logs/overstay');
    return response.data.data;
  },

  createEntryLog: async (data: FormData | Record<string, unknown>): Promise<OperationalLog> => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const response = await api.post('/logs/entry', data, isFormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : undefined);
    return response.data.data;
  },

  emergencyCheckin: async (data: FormData | Record<string, unknown>): Promise<any> => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const response = await api.post('/logs/emergency-checkin', data, isFormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : undefined);
    return response.data.data;
  },

  createExitLog: async (id: number, payload: { exit_time?: string; notes?: string }): Promise<OperationalLog> => {
    const response = await api.put(`/logs/exit/${id}`, payload);
    return response.data.data;
  }
};
