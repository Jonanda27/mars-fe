import { create } from 'zustand';
import { aircraftService } from '../services/aircraftService';
import { Aircraft } from '../types/aircraft';

interface AircraftState {
  aircrafts: Aircraft[];
  tenantAircrafts: Aircraft[];
  currentAircraft: Aircraft | null;
  isLoading: boolean;
  error: string | null;
  fetchAllAircrafts: () => Promise<void>;
  fetchTenantAircrafts: () => Promise<void>;
  fetchAircraftById: (id: number) => Promise<void>;
  createTenantAircraft: (data: Omit<Aircraft, 'id'>) => Promise<void>;
  updateTenantAircraft: (id: number, data: Partial<Aircraft>) => Promise<void>;
  deleteTenantAircraft: (id: number) => Promise<void>;
}

export const useAircraftStore = create<AircraftState>((set, get) => ({
  aircrafts: [],
  tenantAircrafts: [],
  currentAircraft: null,
  isLoading: false,
  error: null,

  fetchAllAircrafts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await aircraftService.getAllAircrafts();
      set({ aircrafts: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch aircrafts', isLoading: false });
    }
  },

  fetchTenantAircrafts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await aircraftService.getTenantAircrafts();
      set({ tenantAircrafts: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch tenant aircrafts', isLoading: false });
    }
  },

  fetchAircraftById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await aircraftService.getAircraftById(id);
      set({ currentAircraft: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch aircraft details', isLoading: false });
    }
  },

  createTenantAircraft: async (data: Omit<Aircraft, 'id'>) => {
    set({ isLoading: true, error: null });
    try {
      const newAircraft = await aircraftService.createTenantAircraft(data);
      set((state) => ({
        tenantAircrafts: [newAircraft, ...state.tenantAircrafts],
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to create aircraft', isLoading: false });
      throw err;
    }
  },

  updateTenantAircraft: async (id: number, data: Partial<Aircraft>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedAircraft = await aircraftService.updateTenantAircraft(id, data);
      const { tenantAircrafts, currentAircraft } = get();
      set({
        tenantAircrafts: tenantAircrafts.map(a => a.id === id ? updatedAircraft : a),
        currentAircraft: currentAircraft?.id === id ? updatedAircraft : currentAircraft,
        isLoading: false
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to update aircraft', isLoading: false });
      throw err;
    }
  },

  deleteTenantAircraft: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await aircraftService.deleteTenantAircraft(id);
      set((state) => ({
        tenantAircrafts: state.tenantAircrafts.filter(a => a.id !== id),
        currentAircraft: state.currentAircraft?.id === id ? null : state.currentAircraft,
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete aircraft', isLoading: false });
      throw err;
    }
  }
}));
