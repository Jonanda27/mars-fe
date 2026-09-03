export interface AirportRef {
  id: number;
  kode_bandara: string;
  nama_bandara: string;
}

export type TicketBookStatus = 'STOK' | 'ACTIVE' | 'HABIS';
export type HandoverStatus = 'DISTRIBUTED' | 'SETTLED';

export interface TicketBook {
  id: number;
  airport_id: number;
  kode_buku: string;
  jenis_karcis: string; // 'Roda 2' | 'Roda 4' | 'VIP' | 'Inap'
  seri_awal: number;
  seri_akhir: number;
  nominal_per_lembar: number | string;
  status: TicketBookStatus;
  created_at?: string;
  updated_at?: string;
  effective_serial_start?: number;
  remaining_sheets?: number;
  airports?: AirportRef;
  _count?: {
    handovers: number;
  };
}

export interface WardenHandover {
  id: number;
  airport_id: number;
  book_id: number;
  warden_name: string;
  dispatched_serial_start: number;
  dispatched_serial_end: number;
  last_returned_serial?: number | null;
  sold_qty?: number | null;
  expected_amount?: number | string | null;
  actual_cash_settled?: number | string | null;
  unmatched_amount?: number | string | null;
  notes?: string | null;
  status: HandoverStatus;
  dispatch_time?: string | null;
  settle_time?: string | null;
  ticket_books?: TicketBook;
  airports?: AirportRef;
}

export interface ReconciliationSummary {
  total_active_shifts: number;
  total_settled_shifts: number;
  total_sold_qty: number;
  total_expected_amount: number;
  total_actual_cash: number;
  total_unmatched_amount: number;
  leakage_rate_pct: number;
  deficit_count: number;
  surplus_count: number;
  balanced_count: number;
}

export interface WardenBreakdown {
  warden_name: string;
  shifts_count: number;
  total_sold: number;
  total_expected: number;
  total_actual: number;
  total_unmatched: number;
  deficits: number;
}

export interface AirportBreakdown {
  kode_bandara: string;
  nama_bandara: string;
  total_sold: number;
  total_expected: number;
  total_actual: number;
  total_unmatched: number;
}

export interface VehicleBreakdown {
  jenis_karcis: string;
  total_sold: number;
  total_amount: number;
}

export interface ReconciliationReport {
  summary: ReconciliationSummary;
  warden_breakdown: WardenBreakdown[];
  airport_breakdown: AirportBreakdown[];
  vehicle_breakdown: VehicleBreakdown[];
  recent_settlements: WardenHandover[];
}

export interface CreateTicketBookDTO {
  kode_buku: string;
  jenis_karcis: string;
  seri_awal: number;
  seri_akhir: number;
  nominal_per_lembar: number;
  airport_id?: number;
}

export interface DispatchBookletDTO {
  book_id: number;
  warden_name: string;
  dispatched_serial_start: number;
  dispatched_serial_end: number;
}

export interface SettleHandoverDTO {
  last_returned_serial: number;
  actual_cash_settled: number;
  notes?: string;
}
