import { create } from 'zustand';
import { rentalService } from '../services/rentalService';
import { RentalApplication } from '../types/rental';

interface RentalState {
  applications: RentalApplication[];
  tenantApplications: RentalApplication[];
  currentApplication: RentalApplication | null;
  isLoading: boolean;
  error: string | null;
  fetchAllApplications: () => Promise<void>;
  fetchTenantApplications: () => Promise<void>;
  fetchApplicationById: (id: number) => Promise<void>;
  createApplication: (data: any) => Promise<void>;
  updateApplicationStatus: (id: number, status: string, asset_id?: number) => Promise<void>;
}

export const useRentalStore = create<RentalState>((set, get) => ({
  applications: [],
  tenantApplications: [],
  currentApplication: null,
  isLoading: false,
  error: null,

  fetchAllApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await rentalService.getAllApplications();
      set({ applications: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch applications', isLoading: false });
    }
  },

  fetchTenantApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await rentalService.getTenantApplications();
      set({ tenantApplications: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch tenant applications', isLoading: false });
    }
  },

  fetchApplicationById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await rentalService.getApplicationById(id);
      set({ currentApplication: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch application details', isLoading: false });
    }
  },

  createApplication: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const newApp = await rentalService.createApplication(data);
      set((state) => ({
        tenantApplications: [newApp, ...state.tenantApplications],
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to create application', isLoading: false });
      throw err;
    }
  },

  updateApplicationStatus: async (id: number, status: string, asset_id?: number) => {
    set({ isLoading: true, error: null });
    try {
      const updatedApp = await rentalService.updateApplicationStatus(id, status, asset_id);
      const { applications, currentApplication } = get();
      set({
        applications: applications.map(a => a.id === id ? updatedApp : a),
        currentApplication: currentApplication?.id === id ? updatedApp : currentApplication,
        isLoading: false
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to update application status', isLoading: false });
      throw err;
    }
  }
}));
