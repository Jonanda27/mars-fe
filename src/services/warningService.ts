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

  sendWarningEmail: async (id: number, recipientEmail?: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/warnings/${id}/send-email`, { recipient_email: recipientEmail });
    return response.data;
  }
};
