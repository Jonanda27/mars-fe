export interface RentalApplication {
  id: number;
  application_number: string;
  tenant_id: number;
  asset_id?: number;
  purpose?: string;
  specific_needs?: any;
  status: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  assets?: any;
  tenants?: any;
  contracts?: any;
}
