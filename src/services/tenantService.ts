import api from './api';
import { Tenant } from '../types/tenant';

export const tenantService = {
  getTenants: async (): Promise<Tenant[]> => {
    const response = await api.get('/tenants');
    return response.data.data;
  },

  getTenantById: async (id: number): Promise<Tenant & { legalitas?: any }> => {
    const response = await api.get(`/tenants/${id}`);
    return response.data.data;
  },

  verifyTenant: async (id: number, status: string): Promise<Tenant> => {
    const response = await api.put(`/tenants/${id}/verify`, { status });
    return response.data.data;
  },

  uploadLegalitas: async (id: number, documentType: string, file: File): Promise<Tenant> => {
    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('file', file);
    
    const response = await api.post(`/tenants/${id}/legalitas`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }
};
