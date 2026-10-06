import api from './api';
import { Warning } from '../types/warning';

export const warningService = {
  getAllWarnings: async (): Promise<Warning[]> => {
    const response = await api.get('/warnings');
    return response.data.data;
  },

  getTenantWarnings: async (): Promise<Warning[]> => {
    const response = await api.get('/warnings/tenant');
    return response.data.data;
  },

  sendWarningEmail: async (
    id: number, 
    payload?: string | { recipient_email?: string; pdf_base64?: string; filename?: string }
  ): Promise<{ success: boolean; message: string }> => {
    const body = typeof payload === 'string' ? { recipient_email: payload } : (payload || {});
    const response = await api.post(`/warnings/${id}/send-email`, body);
    return response.data;
  },

  triggerWarningCheck: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/warnings/trigger-check');
    return response.data;
  }
};
