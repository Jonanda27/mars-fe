import { Invoice } from '@/types/invoice';

/**
 * Data dummy realistis untuk mode simulasi panduan tutorial e-SKRD.
 * Digunakan saat daftar tagihan tenant masih kosong agar pengguna
 * dapat mempelajari tata letak dan fungsi kartu tagihan secara interaktif.
 */
export const DUMMY_TUTORIAL_INVOICES: Invoice[] = [
  {
    id: 9991,
    invoice_number: 'SKRD-2026-HNG-0089',
    contract_id: 881,
    tenant_id: 1,
    invoice_type: 'Sewa Hanggar',
    amount: 15000000,
    paid_amount: 0,
    due_date: '2026-11-15T00:00:00.000Z',
    status: 'Unpaid',
    penalty_amount: 0,
    created_at: '2026-10-01T08:00:00.000Z',
    contracts: {
      id: 881,
      contract_number: 'PKS-HN/UPBU/2026/045',
      application_id: 501,
      tenant_id: 1,
      asset_id: 12,
      status: 'Active',
      start_date: '2026-10-01T00:00:00.000Z',
      end_date: '2027-09-30T00:00:00.000Z',
      jenis_pemanfaatan: 'Sewa Hanggar & Apron',
      luas: 450,
      tarif_satuan: 33333,
      assets: {
        nama_aset: 'Hanggar B & Apron Parkir Pesawat Sisi Timur',
        jenis_aset: 'Hanggar Pesawat',
      },
    },
    details: [
      {
        registration_number: 'PK-MKM',
        aircraft_type: 'Cessna Grand Caravan 208B',
        parking_location: 'Hanggar Bay B-1',
        total_nights: 15,
        rate_per_night: 500000,
        subtotal: 7500000,
      },
      {
        registration_number: 'PK-TIM',
        aircraft_type: 'Pilatus Porter PC-6',
        parking_location: 'Hanggar Bay B-2',
        total_nights: 15,
        rate_per_night: 500000,
        subtotal: 7500000,
      },
    ],
  },
  {
    id: 9992,
    invoice_number: 'SKRD-2026-RNG-0042',
    contract_id: 882,
    tenant_id: 1,
    invoice_type: 'Sewa Ruangan',
    amount: 4500000,
    paid_amount: 4500000,
    due_date: '2026-10-25T00:00:00.000Z',
    status: 'Paid',
    penalty_amount: 0,
    payment_method: 'Transfer Bank Papua',
    payment_date: '2026-10-05T14:30:00.000Z',
    created_at: '2026-09-25T08:00:00.000Z',
    contracts: {
      id: 882,
      contract_number: 'PKS-RG/UPBU/2026/019',
      application_id: 502,
      tenant_id: 1,
      asset_id: 25,
      status: 'Active',
      start_date: '2026-10-01T00:00:00.000Z',
      end_date: '2027-09-30T00:00:00.000Z',
      jenis_pemanfaatan: 'Sewa Ruangan Kantor Operasional',
      luas: 36,
      tarif_satuan: 125000,
      assets: {
        nama_aset: 'Ruangan Tiket & Kantor Ops Lt. 1 Terminal Mozes Kilangin',
        jenis_aset: 'Ruangan Terminal',
      },
    },
  },
];
