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
  }
};
