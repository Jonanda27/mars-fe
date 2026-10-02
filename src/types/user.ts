export interface AirportSummary {
  id: number;
  kode_bandara: string;
  nama_bandara: string;
  type: 'main' | 'mini';
  label: string;
}

export interface UserAccount {
  id: number;
  username: string;
  role: string;
  airport_id?: number | null;
  mini_airport_id?: number | null;
  airport?: AirportSummary | null;
  created_at: string;
}

export interface AirportOptionItem {
  id: number;
  kode: string;
  nama: string;
  lokasi?: string | null;
  type: 'main' | 'mini';
  value: string;
  label: string;
}

export interface AirportOptionsData {
  all_options: AirportOptionItem[];
  main_airports: Array<{ id: number; kode_bandara: string; nama_bandara: string; lokasi?: string | null }>;
  mini_airports: Array<{ id: number; kode_bandara: string; nama_bandara: string; lokasi?: string | null }>;
}

export interface CreateUserPayload {
  username: string;
  password: string;
  role: string;
  airport_type?: 'main' | 'mini' | 'none';
  airport_id?: number | null;
  mini_airport_id?: number | null;
}

export interface UpdateUserPayload {
  username?: string;
  password?: string;
  role?: string;
  airport_type?: 'main' | 'mini' | 'none';
  airport_id?: number | null;
  mini_airport_id?: number | null;
}
