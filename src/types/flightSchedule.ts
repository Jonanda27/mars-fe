import { Aircraft } from './aircraft';
import { Contract } from './contract';

export interface FlightSchedule {
  id: number;
  schedule_number: string;
  tenant_id: number;
  contract_id?: number | null;
  aircraft_id?: number | null;
  registration_number: string;
  aircraft_type?: string | null;
  parking_location: string;
  purpose?: string | null;
  estimated_arrival: string;
  estimated_departure?: string | null;
  estimated_nights: number;
  notes?: string | null;
  flight_plan_url?: string | null;
  status: 'Menunggu Verifikasi Petugas' | 'Disetujui' | 'Ditolak' | 'Checked-In' | 'Completed' | 'Selesai' | 'Cancelled';
  verified_by_officer_id?: number | null;
  officer_notes?: string | null;
  verified_at?: string | null;
  created_at: string;
  updated_at?: string | null;

  tenant?: {
    nama_perusahaan: string;
    tenant_id_str?: string;
  };
  aircraft?: Aircraft | null;
  contract?: Contract | null;
  verified_by_officer?: {
    username: string;
    role?: string;
  } | null;
}
