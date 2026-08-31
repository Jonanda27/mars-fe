import api from './api';
import { Contract } from '../types/contract';

export const contractService = {
  getContracts: async (): Promise<Contract[]> => {
    const response = await api.get('/contracts');
    return response.data.data;
  },

  getContractById: async (id: number): Promise<Contract> => {
    const response = await api.get(`/contracts/${id}`);
    return response.data.data;
  },

  updateContractStatusByTenant: async (id: number, payload: any): Promise<any> => {
    const response = await api.put(`/contracts/tenant/${id}/status`, payload);
    return response.data.data;
  },

  terminateContract: async (id: number): Promise<any> => {
    const response = await api.put(`/contracts/${id}/terminate`);
    return response.data.data;
  },

  updateContract: async (id: number, payload: Partial<Contract>): Promise<Contract> => {
    const response = await api.put(`/contracts/${id}`, payload);
    return response.data.data;
  },

  // Tenant methods
  getTenantContracts: async (): Promise<Contract[]> => {
    const response = await api.get('/contracts/tenant');
    return response.data.data;
  },

  getTenantContractById: async (id: number): Promise<Contract> => {
    const response = await api.get(`/contracts/tenant/${id}`);
    return response.data.data;
  },

  updateTenantContractStatus: async (id: number, payload: { status: string, tenant_signature?: string }): Promise<Contract> => {
    const response = await api.put(`/contracts/tenant/${id}/status`, payload);
    return response.data.data;
  },

  extendContract: async (id: number, durationMonths: number): Promise<any> => {
    const response = await api.post(`/contracts/tenant/${id}/extend`, { duration_months: durationMonths });
    return response.data;
  }
};
