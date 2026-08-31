import { create } from 'zustand';
import { invoiceService } from '../services/invoiceService';
import { Invoice } from '../types/invoice';

interface InvoiceState {
  invoices: Invoice[];
  tenantInvoices: Invoice[];
  currentInvoice: Invoice | null;
  isLoading: boolean;
  error: string | null;
  fetchAllInvoices: () => Promise<void>;
  fetchTenantInvoices: () => Promise<void>;
  fetchInvoiceById: (id: number) => Promise<void>;
  payInvoice: (id: number) => Promise<void>;
}

export const useInvoiceStore = create<InvoiceState>((set, get) => ({
  invoices: [],
  tenantInvoices: [],
  currentInvoice: null,
  isLoading: false,
  error: null,

  fetchAllInvoices: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await invoiceService.getAllInvoices();
      set({ invoices: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch invoices', isLoading: false });
    }
  },

  fetchTenantInvoices: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await invoiceService.getTenantInvoices();
      set({ tenantInvoices: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch tenant invoices', isLoading: false });
    }
  },

  fetchInvoiceById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await invoiceService.getInvoiceById(id);
      set({ currentInvoice: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch invoice details', isLoading: false });
    }
  },

  payInvoice: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const updatedInvoice = await invoiceService.payInvoice(id);
      const { invoices, tenantInvoices, currentInvoice } = get();
      set({
        invoices: invoices.map(i => i.id === id ? updatedInvoice : i),
        tenantInvoices: tenantInvoices.map(i => i.id === id ? updatedInvoice : i),
        currentInvoice: currentInvoice?.id === id ? updatedInvoice : currentInvoice,
        isLoading: false
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to pay invoice', isLoading: false });
      throw err;
    }
  }
}));
