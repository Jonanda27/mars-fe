export interface Zone {
  id: number;
  airport_id: number;
  kode_zona: string;
  nama_zona: string;
  tipe_zona?: string;
  deskripsi?: string;
  created_at?: string;
  updated_at?: string;
  airports?: any;
}
