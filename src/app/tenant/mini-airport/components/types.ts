export interface MiniAirportItem {
  id: number;
  kode_bandara: string;
  nama_bandara: string;
  lokasi?: string | null;
  deskripsi?: string | null;
}

export interface SubmittedSchedulePlan {
  airportName: string;
  airportCode: string;
  airportLocation: string;
  registrationNumber: string;
  aircraftType: string;
  aircraftCapacity?: number | null;
  landingDate: string;
  landingTime: string;
  purpose: string;
  passengersCount: number;
  slotNumber: string;
  submittedAt: string;
  notes?: string | null;
  scheduleNumber?: string;
}

export const getStepFromStatus = (status?: string): number => {
  const s = (status || '').toLowerCase().trim();
  switch (s) {
    case 'pengajuan baru':
    case 'menunggu verifikasi kadis':
    case 'pending':
    case 'menunggu ttd kontrak payung':
    case 'menunggu ttd tenant':
    case 'menunggu pengesahan kadis':
      return 2;
    case 'surat disetujui':
      return 3;
    case 'menunggu validasi admin':
    case 'validasi aset':
      return 4;
    case 'draft kontrak':
    case 'disetujui':
    case 'signed':
    case 'aktif':
    case 'active':
    case 'telah mendarat':
    case 'direalisasikan':
      return 5;
    default:
      return 1;
  }
};
