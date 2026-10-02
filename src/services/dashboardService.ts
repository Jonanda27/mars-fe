import api from './api';

export interface DashboardKPI {
  realisasi_pad: number;
  target_pad: number;
  achievement_percent: number;
  total_piutang: number;
  paid_invoices_count: number;
  overdue_invoices_count: number;
  total_tenants: number;
  pending_tenants: number;
  active_contracts_count: number;
  occupancy_rate: number;
  total_area_m2: number;
  used_area_m2: number;
}

export interface ActionQueue {
  pendingTenants: number;
  unbilledHanggarLogs: number;
  pendingPaymentReceipts: number;
  pendingFlightSchedules: number;
}

export interface ParkedAircraft {
  id: number | string;
  registration_number: string;
  aircraft_type: string;
  effective_area: number;
}

export interface VisualAsset {
  id: number;
  kode_aset: string;
  nama_aset: string;
  jenis_aset: string;
  lokasi: string;
  luas_total: number;
  luas_terpakai: number;
  sisa_luas: number;
  occupancy_percent: number;
  status: string;
  parked_aircrafts: ParkedAircraft[];
  current_tenant: {
    nama_perusahaan: string;
    contract_number: string;
    end_date: string;
  } | null;
}

export interface ExpiringContract {
  id: number;
  contract_number: string;
  tenant_name: string;
  asset_name: string;
  end_date: string;
  days_remaining: number;
  is_payung: boolean;
}

export interface OverdueInvoice {
  id: number;
  invoice_number: string;
  tenant_name: string;
  amount: number;
  due_date: string;
  days_overdue: number;
  status: string;
}

export interface MasterTariffItem {
  id: number;
  kode_tarif: string;
  jenis_layanan: string;
  objek: string;
  satuan: string;
  tarif: number;
  dasar_hukum?: string;
}

export interface AdminDashboardData {
  kpi: DashboardKPI;
  action_queue: ActionQueue;
  visual_assets: VisualAsset[];
  expiring_contracts: ExpiringContract[];
  top_overdue_invoices: OverdueInvoice[];
  master_tariffs: MasterTariffItem[];
}

export interface DinasKPI {
  realisasi_pad: number;
  target_pad: number;
  achievement_percent: number;
  total_piutang: number;
  paid_invoices_count: number;
  overdue_invoices_count: number;
  total_skrd_count: number;
  pending_applications_count: number;
  total_applications_count: number;
  pending_tenants_count: number;
  verified_tenants_count: number;
  active_contracts_count: number;
  pending_kadis_contracts_count: number;
  warning_letters_count: number;
}

export interface DinasActionQueue {
  pendingApplications: number;
  pendingTenants: number;
  unbilledHanggarLogs: number;
  pendingPaymentReceipts: number;
  pendingWarningLetters: number;
  pendingKadisContracts: number;
}

export interface RecentApplicationItem {
  id: number;
  application_number: string;
  tenant_name: string;
  asset_name: string;
  application_type: string;
  purpose: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
  created_at: string;
}

export interface DinasOverdueInvoice {
  id: number;
  invoice_number: string;
  tenant_name: string;
  amount: number;
  due_date: string;
  days_overdue: number;
  recommended_action: string;
  status: string;
}

export interface DinasRevenueBreakdown {
  hanggar: number;
  ruangan: number;
  denda: number;
  total: number;
}

export interface DinasDashboardData {
  kpi: DinasKPI;
  action_queue: DinasActionQueue;
  recent_applications: RecentApplicationItem[];
  top_overdue_invoices: DinasOverdueInvoice[];
  revenue_breakdown: DinasRevenueBreakdown;
}

export const dashboardService = {
  getAdminDashboardStats: async (): Promise<AdminDashboardData> => {
    const response = await api.get('/dashboard/admin');
    return response.data.data;
  },
  getDinasDashboardStats: async (): Promise<DinasDashboardData> => {
    const response = await api.get('/dashboard/dinas');
    return response.data.data;
  }
};
