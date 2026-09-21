import api from './api';
import { Invoice } from '../types/invoice';

export const invoiceService = {
  getAllInvoices: async (): Promise<Invoice[]> => {
    const response = await api.get('/invoices');
    return response.data.data;
  },

  getTenantInvoices: async (): Promise<Invoice[]> => {
    const response = await api.get('/invoices/tenant');
    return response.data.data;
  },

  getInvoiceById: async (id: number): Promise<Invoice> => {
    const response = await api.get(`/invoices/${id}`);
    return response.data.data;
  },

  payInvoice: async (id: number): Promise<Invoice> => {
    const response = await api.put(`/invoices/${id}/pay`);
    return response.data.data;
  },

  generateSkrd: async (contractId: number): Promise<Invoice> => {
    const response = await api.post(`/invoices/generate-skrd/${contractId}`);
    return response.data.data;
  },

  getUnbilledHanggarLogs: async (params?: { tenant_id?: number | string; start_date?: string; end_date?: string }): Promise<import('../types/invoice').UnbilledHanggarLog[]> => {
    const response = await api.get('/invoices/unbilled-hanggar', { params });
    return response.data.data;
  },

  generateHanggarCheckoutInvoice: async (logId: number, customRate?: number): Promise<Invoice> => {
    const response = await api.post('/invoices/generate-hanggar-checkout', { log_id: logId, custom_rate: customRate });
    return response.data.data;
  },

  generateHanggarPeriodicInvoice: async (payload: { tenant_id: number; log_ids: number[]; custom_rates?: Record<number, number> }): Promise<Invoice> => {
    const response = await api.post('/invoices/generate-hanggar-periodic', payload);
    return response.data.data;
  },

  generatePenaltyInvoice: async (id: number, payload?: { rate_percent_per_month?: number; notes?: string }): Promise<Invoice> => {
    const response = await api.post(`/invoices/${id}/generate-penalty`, payload || {});
    return response.data.data;
  },

  cancelInvoice: async (id: number, reason: string): Promise<Invoice> => {
    const response = await api.post(`/invoices/${id}/cancel`, { reason });
    return response.data.data;
  },

  reissueInvoice: async (id: number, payload: { new_amount?: number; new_due_date?: string; reason?: string }): Promise<Invoice> => {
    const response = await api.post(`/invoices/${id}/reissue`, payload);
    return response.data.data;
  },

  verifyPayment: async (id: number, payload?: { payment_method?: string; reference_number?: string; amount_paid?: number; status?: string }): Promise<Invoice> => {
    const response = await api.post(`/invoices/${id}/verify`, payload);
    return response.data.data;
  },

  uploadReceipt: async (id: number, formData: FormData): Promise<Invoice> => {
    const response = await api.post(`/invoices/${id}/upload-receipt`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  generateOverstaySkrd: async (logId: number): Promise<Invoice> => {
    const response = await api.post(`/invoices/generate-skrd-overstay/${logId}`);
    return response.data.data;
  }
};
