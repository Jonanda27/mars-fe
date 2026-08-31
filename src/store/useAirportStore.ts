import { create } from 'zustand';
import { Airport } from '../types/airport';
import { airportService } from '../services/airportService';

interface AirportState {
  airports: Airport[];
  currentAirport: Airport | null;
  isLoading: boolean;
  error: string | null;
  fetchAirports: () => Promise<void>;
  fetchAirportById: (id: number) => Promise<void>;
  createAirport: (data: Partial<Airport>) => Promise<void>;
  updateAirport: (id: number, data: Partial<Airport>) => Promise<void>;
  deleteAirport: (id: number) => Promise<void>;
}

export const useAirportStore = create<AirportState>((set) => ({
  airports: [],
  currentAirport: null,
  isLoading: false,
  error: null,

  fetchAirports: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await airportService.getAll();
      set({ airports: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchAirportById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await airportService.getById(id);
      set({ currentAirport: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createAirport: async (data: Partial<Airport>) => {
    set({ isLoading: true, error: null });
    try {
      await airportService.create(data);
      const response = await airportService.getAll();
      set({ airports: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateAirport: async (id: number, data: Partial<Airport>) => {
    set({ isLoading: true, error: null });
    try {
      await airportService.update(id, data);
      const response = await airportService.getAll();
      set({ airports: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteAirport: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await airportService.delete(id);
      const response = await airportService.getAll();
      set({ airports: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));
