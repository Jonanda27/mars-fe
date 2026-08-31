export interface Asset {
  id: number;
  airport_id?: number | null;
  zone_id?: number | null;
  kode_aset: string;
  jenis_aset: string;
  nama_aset: string;
  lokasi?: string;
  zona?: string;
  koordinat_gis?: string;
  luas?: number;
  satuan?: string;
  kapasitas?: string;
  kondisi?: string;
  status?: string;
  master_tariff_id?: number | null;
  foto?: string;
  dokumen_kepemilikan?: string;
  spesifikasi_detail?: any;
  created_at?: string;
  updated_at?: string;
  airports?: any;
  zones?: any;
  master_tariffs?: any;
}

