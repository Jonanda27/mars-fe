import { Contract } from './contract';

export interface Invoice {
  id: number;
  invoice_number: string;
  contract_id: number;
  tenant_id: number;
  amount: number | string;
  due_date: string;
  status: string;
  payment_method?: string | null;
  payment_receipt?: string | null;
  payment_date?: string | null;
  penalty_amount?: string | number | null;
  created_at: string;
  contracts?: Contract;
  tenants?: any;
}
