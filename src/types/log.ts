export interface OperationalLog {
  id: number;
  aircraft_id?: number | null;
  registration_number: string;
  aircraft_type?: string;
  tenant_id: number;
  entry_time: string;
  exit_time?: string | null;
  parking_location?: string;
  notes?: string | null;
  officer_id: number;
  billing_status?: string;
  created_at: string;
  contracts?: any;
  tenants?: {
    id: number;
    nama_perusahaan: string;
    pic_nama?: string;
    telepon?: string;
  };
  aircrafts?: {
    id: number;
    registration_number: string;
    aircraft_type?: string;
    mtow?: number;
  };
  officer?: {
    id: number;
    username: string;
    role: string;
  };
}

export interface OverstayLogItem extends OperationalLog {
  overstay_hours?: number;
  overstay_days?: number;
  penalty_estimated?: number;
}
