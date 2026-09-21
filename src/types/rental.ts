export interface RentalApplication {
  id: number;
  application_number: string;
  tenant_id: number;
  asset_id?: number;
  application_type?: string;
  purpose?: string;
  specific_needs?: any;
  status: string;
  start_date?: string;
  end_date?: string;
  signed_document_url?: string;
  official_letter_url?: string;
  created_at?: string;
  updated_at?: string;
  assets?: any;
  tenants?: any;
  contracts?: any;
  requires_payung?: boolean;
}
