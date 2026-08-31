export interface Contract {
  id?: number;
  contract_number: string;
  application_id: number;
  tenant_id: number;
  asset_id: number;
  status: string;
  start_date: string;
  end_date: string;
  jenis_pemanfaatan?: string;
  luas?: number;
  tarif_satuan?: number;
  periode_pembayaran?: string;
  deposit_jaminan?: number;
  fasilitas?: any;
  ketentuan_pembayaran?: string;
  denda?: string;
  total_amount?: number;
  file_url?: string;
  admin_signature?: string;
  tenant_signature?: string;
  created_at?: string;
  updated_at?: string;
  tenants?: any;
  assets?: any;
  rental_applications?: any;
}
