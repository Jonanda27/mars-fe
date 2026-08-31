import { create } from 'zustand';
import { tenantService } from '../services/tenantService';
import { Tenant } from '../types/tenant';

interface TenantState {
  tenants: Tenant[];
  currentTenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
  fetchTenants: () => Promise<void>;
  fetchTenantById: (id: number) => Promise<void>;
  verifyTenant: (id: number, status: string) => Promise<void>;
  uploadLegalitas: (id: number, documentType: string, file: File) => Promise<void>;
}

export const useTenantStore = create<TenantState>((set, get) => ({
  tenants: [],
  currentTenant: null,
  isLoading: false,
  error: null,

  fetchTenants: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await tenantService.getTenants();
      set({ tenants: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch tenants', isLoading: false });
    }
  },

  fetchTenantById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await tenantService.getTenantById(id);
      set({ currentTenant: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch tenant details', isLoading: false });
    }
  },

  verifyTenant: async (id: number, status: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTenant = await tenantService.verifyTenant(id, status);
      // Update local state
      const { tenants, currentTenant } = get();
      set({
        tenants: tenants.map(t => t.id === id ? { ...t, status_verifikasi: status } : t),
        currentTenant: currentTenant?.id === id ? { ...currentTenant, status_verifikasi: status } : currentTenant,
        isLoading: false
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to verify tenant', isLoading: false });
      throw err;
    }
  },

  uploadLegalitas: async (id: number, documentType: string, file: File) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTenant = await tenantService.uploadLegalitas(id, documentType, file);
      const { tenants, currentTenant } = get();
      set({
        tenants: tenants.map(t => t.id === id ? updatedTenant : t),
        currentTenant: currentTenant?.id === id ? updatedTenant : currentTenant,
        isLoading: false
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to upload document', isLoading: false });
      throw err;
    }
  }
}));
