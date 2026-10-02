export interface Aircraft {
  id: number;
  registration_number: string;
  aircraft_type_id?: number;
  aircraft_types?: {
    id: number;
    jenis_pesawat: string;
    luas_efektif_m2: string;
  };
  aircraft_owner?: string;
  operator?: string;
  mtow?: number;
  status: string;
  tenant_id?: number;
  asset_id?: number;
  capacity?: number;
  foto?: string;
  custom_type_name?: string;
  custom_type_area?: string;
  assets?: {
    nama_aset: string;
    kode_aset: string;
  };
  is_tied_to_rental?: boolean;
  rental_application?: {
    appId: number;
    application_number: string;
    status: string;
  } | null;
  is_in_use?: boolean;
  is_available?: boolean;
}
