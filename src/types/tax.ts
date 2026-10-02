export interface MasterTax {
  id: number;
  kode_tax: string;
  nama_tax: string;
  kategori: 'Pendaratan' | 'Penumpang' | 'Parkir' | 'Nginap' | 'Airport' | string;
  aircraft_type_id?: number | null;
  satuan: string;
  tarif: number | string;
  tipe_tarif?: 'Fixed' | 'Persentase' | string;
  persentase?: number | string | null;
  dasar_hukum?: string | null;
  deskripsi?: string | null;
  status: 'Active' | 'Inactive' | string;
  created_at?: string;
  updated_at?: string;
  aircraft_types?: {
    id: number;
    jenis_pesawat: string;
    luas_efektif_m2: number | string;
  } | null;
}
