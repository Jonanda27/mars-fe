import api from './api';

export interface ReportFilterParams {
  period_type?: 'monthly' | 'quarterly' | 'semester' | 'annual' | 'custom';
  year?: number;
  month?: number;
  quarter?: number;
  semester?: number;
  start_date?: string;
  end_date?: string;
  service_type?: 'ALL' | 'HANGGAR' | 'RUANGAN' | 'DENDA';
  tenant_id?: number | string;
  status?: string;
}

export interface AccountBreakdownItem {
  account_code: string;
  account_name: string;
  realisasi_pokok: number;
  realisasi_denda: number;
  total_realisasi: number;
  piutang_menunggak: number;
  total_ketetapan_terbit: number;
  jumlah_skrd_lunas: number;
  jumlah_skrd_piutang: number;
  jumlah_skrd_batal: number;
}

export interface ReportInvoiceItem {
  id: number;
  invoice_number: string;
  account_code: string;
  account_name: string;
  service_category: 'HANGGAR' | 'RUANGAN' | 'DENDA';
  tenant_name: string;
  contract_number: string | null;
  asset_name: string;
  amount: number;
  penalty_amount: number;
  total_amount: number;
  status: string;
  created_at: string;
  due_date: string;
  payment_date?: string | null;
  payment_method?: string | null;
  payment_receipt?: string | null;
  details?: any;
}

export interface RetributionReportData {
  meta: {
    period_type: string;
    period_label: string;
    start_date: string;
    end_date: string;
    generated_at: string;
    year: number;
  };
  summary: {
    total_realisasi_kas_masuk: number;
    total_piutang_menunggak: number;
    total_ketetapan_terbit: number;
    total_denda_terkumpul: number;
    total_skrd_count: number;
  };
  account_breakdown: AccountBreakdownItem[];
  invoices: ReportInvoiceItem[];
}

export const reportService = {
  getRetributionReport: async (params: ReportFilterParams): Promise<RetributionReportData> => {
    const response = await api.get('/reports/retribution', { params });
    return response.data.data;
  }
};
