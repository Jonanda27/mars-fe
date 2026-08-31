import { create } from 'zustand';
import { Zone } from '../types/zone';
import { zoneService } from '../services/zoneService';

interface ZoneState {
  zones: Zone[];
  currentZone: Zone | null;
  isLoading: boolean;
  error: string | null;
  fetchZones: (airport_id?: number) => Promise<void>;
  fetchZoneById: (id: number) => Promise<void>;
  createZone: (data: Partial<Zone>) => Promise<void>;
  updateZone: (id: number, data: Partial<Zone>) => Promise<void>;
  deleteZone: (id: number) => Promise<void>;
}

export const useZoneStore = create<ZoneState>((set) => ({
  zones: [],
  currentZone: null,
  isLoading: false,
  error: null,

  fetchZones: async (airport_id?: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await zoneService.getAll(airport_id);
      set({ zones: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchZoneById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await zoneService.getById(id);
      set({ currentZone: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createZone: async (data: Partial<Zone>) => {
    set({ isLoading: true, error: null });
    try {
      await zoneService.create(data);
      const response = await zoneService.getAll();
      set({ zones: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateZone: async (id: number, data: Partial<Zone>) => {
    set({ isLoading: true, error: null });
    try {
      await zoneService.update(id, data);
      const response = await zoneService.getAll();
      set({ zones: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteZone: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await zoneService.delete(id);
      const response = await zoneService.getAll();
      set({ zones: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));
