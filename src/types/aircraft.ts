export interface Aircraft {
  id: number;
  registration_number: string;
  aircraft_type: string;
  aircraft_owner?: string;
  operator?: string;
  mtow?: number;
  status: string;
  tenant_id?: number;
  asset_id?: number;
  capacity?: number;
  foto?: string;
  created_at?: string;
}
