import api from './api';
import { 
  TicketBook, 
  WardenHandover, 
  ReconciliationReport, 
  CreateTicketBookDTO, 
  DispatchBookletDTO, 
  SettleHandoverDTO 
} from '../types/parking';

export const parkingService = {
  // 1. Buku Karcis
  getAllBooks: async (params?: { airport_id?: number; status?: string; jenis_karcis?: string }) => {
    const response = await api.get('/parking/books', { params });
    return response.data;
  },

  getAvailableBooks: async (airport_id?: number) => {
    const params = airport_id ? { airport_id } : {};
    const response = await api.get('/parking/books/available', { params });
    return response.data;
  },

  createBook: async (data: CreateTicketBookDTO) => {
    const response = await api.post('/parking/books', data);
    return response.data;
  },

  // 2. Serah Terima & Rekonsiliasi Juru Parkir
  dispatchBooklet: async (data: DispatchBookletDTO) => {
    const response = await api.post('/parking/handovers', data);
    return response.data;
  },

  getActiveHandovers: async (airport_id?: number) => {
    const params = airport_id ? { airport_id } : {};
    const response = await api.get('/parking/handovers/active', { params });
    return response.data;
  },

  getHandoverHistory: async (params?: { 
    airport_id?: number; 
    status?: string; 
    warden_name?: string; 
    start_date?: string; 
    end_date?: string; 
  }) => {
    const response = await api.get('/parking/handovers/history', { params });
    return response.data;
  },

  settleHandover: async (id: number, data: SettleHandoverDTO) => {
    const response = await api.put(`/parking/handovers/${id}/settle`, data);
    return response.data;
  },

  // 3. Laporan Rekonsiliasi & Deteksi Kebocoran
  getReconciliationReport: async (params?: { 
    airport_id?: number; 
    start_date?: string; 
    end_date?: string; 
  }) => {
    const response = await api.get('/parking/reports/reconciliation', { params });
    return response.data;
  }
};
