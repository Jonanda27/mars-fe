import { Tenant } from './tenant';
import { Invoice } from './invoice';

export interface Warning {
  id: number;
  warning_number: string;
  tenant_id: number;
  invoice_id: number | null;
  type: string;
  message: string | null;
  status: string;
  created_at: string;
  tenants?: Tenant;
  invoices?: Invoice;
}
