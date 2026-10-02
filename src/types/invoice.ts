import { Contract } from './contract';

export interface InvoiceDetailItem {
  log_id?: number;
  registration_number: string;
  aircraft_type: string;
  tariff_code?: string;
  parking_location: string;
  entry_time: string;
  exit_time?: string | null;
  is_overnight?: boolean;
  verified_nights?: number;
  total_nights: number;
  rate_per_night: number;
  subtotal: number;
  evidence_photos?: string[];
  tenant_id?: number;
  tenant_name?: string;
}

export interface UnbilledHanggarLog {
  log_id: number;
  registration_number: string;
  aircraft_type: string;
  tariff_code: string;
  parking_location: string;
  entry_time: string;
  exit_time?: string | null;
  is_overnight: boolean;
  verified_nights: number;
  total_nights: number;
  rate_per_night: number;
  subtotal: number;
  evidence_photos: string[];
  tenant_id: number;
  tenant_name: string;
  is_emergency?: boolean;
  contract_type?: string;
  contract_number?: string | null;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  contract_id?: number | null;
  tenant_id: number;
  invoice_type?: string | null; // 'Sewa Ruangan' | 'Sewa Hanggar' | 'SKRD Denda' | 'SKRD Overstay'
  amount: number | string;
  due_date: string;
  status: string;
  payment_method?: string | null;
  payment_receipt?: string | null;
  payment_date?: string | null;
  penalty_amount?: string | number | null;
  details?: any;
  created_at: string;
  contracts?: Contract | null;
  tenants?: any;
  operational_logs?: any[];
}
