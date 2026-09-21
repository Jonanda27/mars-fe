import api from './api';

export interface OvernightItem {
  id?: number;
  report_id?: number;
  operational_log_id?: number | null;
  registration_number: string;
  tenant_id?: number | null;
  tenant_name?: string;
  asset_id?: number | null;
  asset_name?: string;
  aircraft_type?: string;
  parking_location?: string;
  evidence_photo?: string | null;
  initial_evidence_photo?: string | null;
  photo_file?: File | null;
  photo_preview?: string | null;
  is_adhoc?: boolean;
  is_staying?: boolean;
  notes?: string;
  entry_time?: string;
  tenant?: any;
  asset?: any;
  operational_log?: any;
}

export interface OvernightReport {
  id: number;
  report_date: string;
  officer_id: number;
  total_aircraft_staying: number;
  general_notes?: string | null;
  general_evidence_photo?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  officer?: {
    id: number;
    username: string;
    role: string;
  };
  items: OvernightItem[];
}

export interface DraftRosterResponse {
  report_date: string;
  is_already_submitted: boolean;
  existing_report: OvernightReport | null;
  candidate_roster: OvernightItem[];
}

export const overnightReportService = {
  getTodayDraftRoster: async (date?: string): Promise<DraftRosterResponse> => {
    const response = await api.get('/overnight-reports/draft-today', {
      params: date ? { date } : undefined
    });
    return response.data.data;
  },

  submitDailyOvernightReport: async (formData: FormData): Promise<OvernightReport> => {
    const response = await api.post('/overnight-reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  getAllOvernightReports: async (params?: { start_date?: string; end_date?: string; officer_id?: number }): Promise<OvernightReport[]> => {
    const response = await api.get('/overnight-reports', { params });
    return response.data.data;
  },

  getOvernightReportById: async (id: number): Promise<OvernightReport> => {
    const response = await api.get(`/overnight-reports/${id}`);
    return response.data.data;
  }
};
