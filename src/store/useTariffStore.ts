import { create } from 'zustand';
import { MasterTariff } from '../types/tariff';
import { tariffService } from '../services/tariffService';

interface TariffState {
  tariffs: MasterTariff[];
  currentTariff: MasterTariff | null;
  isLoading: boolean;
  error: string | null;
  fetchTariffs: () => Promise<void>;
  fetchTariffById: (id: number) => Promise<void>;
  createTariff: (data: Partial<MasterTariff>) => Promise<void>;
  updateTariff: (id: number, data: Partial<MasterTariff>) => Promise<void>;
  deleteTariff: (id: number) => Promise<void>;
}

export const useTariffStore = create<TariffState>((set) => ({
  tariffs: [],
  currentTariff: null,
  isLoading: false,
  error: null,

  fetchTariffs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await tariffService.getAll();
      set({ tariffs: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchTariffById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tariffService.getById(id);
      set({ currentTariff: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createTariff: async (data: Partial<MasterTariff>) => {
    set({ isLoading: true, error: null });
    try {
      await tariffService.create(data);
      const response = await tariffService.getAll();
      set({ tariffs: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateTariff: async (id: number, data: Partial<MasterTariff>) => {
    set({ isLoading: true, error: null });
    try {
      await tariffService.update(id, data);
      const response = await tariffService.getAll();
      set({ tariffs: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteTariff: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await tariffService.delete(id);
      const response = await tariffService.getAll();
      set({ tariffs: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));
