import { create } from 'zustand';
import { warningService } from '../services/warningService';
import { Warning } from '../types/warning';

interface WarningState {
  warnings: Warning[];
  tenantWarnings: Warning[];
  isLoading: boolean;
  error: string | null;
  fetchAllWarnings: () => Promise<void>;
  fetchTenantWarnings: () => Promise<void>;
}

export const useWarningStore = create<WarningState>((set) => ({
  warnings: [],
  tenantWarnings: [],
  isLoading: false,
  error: null,

  fetchAllWarnings: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await warningService.getAllWarnings();
      set({ warnings: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch warnings', isLoading: false });
    }
  },

  fetchTenantWarnings: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await warningService.getTenantWarnings();
      set({ tenantWarnings: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch tenant warnings', isLoading: false });
    }
  }
}));
