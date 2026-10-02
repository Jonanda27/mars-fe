import api from './api';

export interface UnbilledMiniAirportLog {
  log_id: number;
  application_id: number;
  application_number: string;
  tenant_name: string;
  tenant_id: number;
  contract_id: number;
  contract_number: string;
  registration_number: string;
  aircraft_type: string;
  airport_name: string;
  airport_code: string;
  parking_location: string;
  entry_time: string;
  exit_time: string | null;
  is_overnight: boolean;
  overnight_nights: number;
  passengers_count: number;
  evidence_photo: string | null;
  officer_name: string;
  remarks: string;
  taxes: Array<{
    kode_tax: string;
    nama_tax: string;
    kategori: string;
    satuan: string;
    dasar_hukum?: string;
    tarif: number;
    qty: number;
    subtotal: number;
  }>;
  total_amount: number;
}

export const miniAirportLogService = {
  getEligibleApplications: async () => {
    const response = await api.get('/mini-airport-logs/eligible-applications');
    return response.data.data;
  },

  createMiniAirportLog: async (formData: FormData) => {
    const response = await api.post('/mini-airport-logs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  getUnbilledLogs: async (): Promise<UnbilledMiniAirportLog[]> => {
    const response = await api.get('/mini-airport-logs/unbilled');
    return response.data.data;
  },

  getAllLogs: async () => {
    const response = await api.get('/mini-airport-logs');
    return response.data.data;
  },

  checkoutMiniAirportLog: async (logId: number, formData: FormData) => {
    const response = await api.patch(`/mini-airport-logs/${logId}/checkout`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  }
};

