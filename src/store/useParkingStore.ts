import { create } from 'zustand';
import { 
  TicketBook, 
  WardenHandover, 
  ReconciliationReport, 
  CreateTicketBookDTO, 
  DispatchBookletDTO, 
  SettleHandoverDTO 
} from '../types/parking';
import { parkingService } from '../services/parkingService';

interface ParkingState {
  books: TicketBook[];
  availableBooks: TicketBook[];
  activeHandovers: WardenHandover[];
  handoverHistory: WardenHandover[];
  reconciliationReport: ReconciliationReport | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBooks: (params?: { airport_id?: number; status?: string; jenis_karcis?: string }) => Promise<void>;
  fetchAvailableBooks: (airport_id?: number) => Promise<void>;
  createBook: (data: CreateTicketBookDTO) => Promise<void>;
  fetchActiveHandovers: (airport_id?: number) => Promise<void>;
  fetchHandoverHistory: (params?: { airport_id?: number; status?: string; warden_name?: string; start_date?: string; end_date?: string }) => Promise<void>;
  dispatchBooklet: (data: DispatchBookletDTO) => Promise<void>;
  settleHandover: (id: number, data: SettleHandoverDTO) => Promise<void>;
  fetchReconciliationReport: (params?: { airport_id?: number; start_date?: string; end_date?: string }) => Promise<void>;
  clearError: () => void;
}

export const useParkingStore = create<ParkingState>((set, get) => ({
  books: [],
  availableBooks: [],
  activeHandovers: [],
  handoverHistory: [],
  reconciliationReport: null,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchBooks: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await parkingService.getAllBooks(params);
      set({ books: response.data || [], isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || error.message || 'Gagal memuat daftar buku karcis', 
        isLoading: false 
      });
    }
  },

  fetchAvailableBooks: async (airport_id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await parkingService.getAvailableBooks(airport_id);
      set({ availableBooks: response.data || [], isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || error.message || 'Gagal memuat stok karcis tersedia', 
        isLoading: false 
      });
    }
  },

  createBook: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await parkingService.createBook(data);
      // Refresh daftar buku & stok tersedia
      await get().fetchBooks();
      await get().fetchAvailableBooks();
      set({ isLoading: false });
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Gagal menambahkan buku karcis baru';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  fetchActiveHandovers: async (airport_id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await parkingService.getActiveHandovers(airport_id);
      set({ activeHandovers: response.data || [], isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || error.message || 'Gagal memuat penugasan aktif', 
        isLoading: false 
      });
    }
  },

  fetchHandoverHistory: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await parkingService.getHandoverHistory(params);
      set({ handoverHistory: response.data || [], isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || error.message || 'Gagal memuat riwayat serah terima', 
        isLoading: false 
      });
    }
  },

  dispatchBooklet: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await parkingService.dispatchBooklet(data);
      // Refresh data
      await get().fetchActiveHandovers();
      await get().fetchAvailableBooks();
      await get().fetchBooks();
      set({ isLoading: false });
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Gagal mengalokasikan karcis ke petugas';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  settleHandover: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await parkingService.settleHandover(id, data);
      // Refresh data terkait
      await get().fetchActiveHandovers();
      await get().fetchHandoverHistory();
      await get().fetchAvailableBooks();
      await get().fetchBooks();
      await get().fetchReconciliationReport();
      set({ isLoading: false });
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Gagal memproses setoran dan rekonsiliasi';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  fetchReconciliationReport: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await parkingService.getReconciliationReport(params);
      set({ reconciliationReport: response.data || null, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || error.message || 'Gagal memuat laporan rekonsiliasi', 
        isLoading: false 
      });
    }
  }
}));
