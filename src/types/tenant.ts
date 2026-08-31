export interface Tenant {
  id: number;
  user_id: number | null;
  tenant_id_str: string | null;
  nama_perusahaan: string;
  nib: string | null;
  npwp: string | null;
  pic: string | null;
  email: string | null;
  nomor_telepon: string | null;
  alamat: string | null;
  status_verifikasi: string;
  created_at: string;
  legalitas?: Record<string, string>;
  informasi_bank?: {
    nama_rekening?: string;
    bank?: string;
    nomor_rekening?: string;
  };
  risk_profile?: {
    total_tagihan: number;
    tunggakan: number;
    umur_piutang: number;
    status_kontrak: string;
    status_pembayaran: string;
  };
}
