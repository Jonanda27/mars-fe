export interface Airport {
  id: number;
  kode_bandara: string;
  nama_bandara: string;
  lokasi?: string;
  deskripsi?: string;
  created_at?: string;
  updated_at?: string;
  zones?: any[];
}
