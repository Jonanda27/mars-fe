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

export interface InvoiceWarning {
  id: number;
  warning_number: string;
  tenant_id: number;
  invoice_id?: number | null;
  type: string;
  message?: string | null;
  status?: string | null;
  created_at: string;
  tenants?: any;
  invoices?: any;
}

export interface InvoicePayment {
  id: number;
  invoice_id: number;
  amount: number | string;
  payment_method?: string | null;
  payment_receipt?: string | null;
  payment_date?: string | null;
  status: 'Pending' | 'Verified' | 'Rejected' | string;
  ocr_status?: 'Pending' | 'Success' | 'Failed' | 'Skipped' | string | null;
  ocr_data?: {
    amount_detected?: number | null;
    sender_name?: string | null;
    sender_bank?: string | null;
    destination_bank?: string | null;
    destination_account?: string | null;
    account_match?: boolean;
    reference_number?: string | null;
    transaction_date?: string | null;
    transfer_status?: string | null;
    confidence_score?: string | null;
    notes?: string | null;
    [key: string]: any;
  } | null;
  verified_by_id?: number | null;
  verified_at?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  contract_id?: number | null;
  tenant_id: number;
  invoice_type?: string | null; // 'Sewa Ruangan' | 'Sewa Hanggar' | 'SKRD Denda' | 'SKRD Overstay'
  amount: number | string;
  paid_amount?: string | number | null;
  due_date: string;
  status: string;
  payment_method?: string | null;
  payment_receipt?: string | null;
  payment_date?: string | null;
  penalty_amount?: string | number | null;
  payment_history?: any;
  details?: any;
  created_at: string;
  contracts?: Contract | null;
  tenants?: any;
  operational_logs?: any[];
  warnings?: InvoiceWarning[];
  invoice_payments?: InvoicePayment[];
}
