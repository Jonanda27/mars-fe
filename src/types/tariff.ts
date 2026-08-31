export interface MasterTariff {
  id: number;
  kode_tarif: string;
  jenis_layanan: string;
  objek: string;
  satuan: string;
  tarif: number | string;
  dasar_hukum?: string;
  valid_from?: string;
  valid_to?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}
