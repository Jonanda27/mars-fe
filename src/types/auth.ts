export interface LoginPayload {
  username: string;
  password: string;
}

export interface UserData {
  id: number;
  username: string;
  role: string;
  airport_id?: number | null;
  mini_airport_id?: number | null;
  airport_name?: string | null;
  airport_code?: string | null;
  airport_type?: 'main' | 'mini' | null;
  tenant_id?: number | null;
  tenant_id_str?: string | null;
  nama_perusahaan?: string | null;
  jenis_tenant?: string | null;
  status_verifikasi?: string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: UserData;
  };
}

export interface RegisterTenantPayload {
  username: string;
  password?: string; // Optional depending on if we send it securely
  nama_perusahaan: string;
  jenis_tenant?: string;
  nib?: string;
  npwp?: string;
  alamat?: string;
  pic: string;
  nomor_telepon: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: number;
      username: string;
      role: string;
    };
    tenant: {
      id: number;
      user_id: number;
      nama_perusahaan: string;
      status_verifikasi: string;
      // ... other fields
    };
  };
}
