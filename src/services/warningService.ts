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
  }
};
