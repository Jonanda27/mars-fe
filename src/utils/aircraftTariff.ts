import { formatRupiah } from './formatCurrency';

export interface OfficialTariffItem {
  category: 'Helicopter (Rotary Wing)' | 'Pesawat Terbang (Fixed Wing)';
  type: string;
  aliases: string[];
  tarif: number;
  satuan: string;
}

export const OFFICIAL_HANGAR_TARIFFS: OfficialTariffItem[] = [
  // Rotary Wing (Helicopter)
  {
    category: 'Helicopter (Rotary Wing)',
    type: 'AS350 Series',
    aliases: ['as350', 'as 350', 'ecureuil', 'h125'],
    tarif: 3500000,
    satuan: 'per unit pesawat, per malam',
  },
  {
    category: 'Helicopter (Rotary Wing)',
    type: 'Bell 206 – Bell 407 Series',
    aliases: ['bell 206', 'bell206', 'bell 407', 'bell407', 'b206', 'b407'],
    tarif: 3500000,
    satuan: 'per unit pesawat, per malam',
  },
  {
    category: 'Helicopter (Rotary Wing)',
    type: 'Bell 412 – Bell 212',
    aliases: ['bell 412', 'bell412', 'bell 212', 'bell212', 'b412', 'b212'],
    tarif: 4500000,
    satuan: 'per unit pesawat, per malam',
  },
  {
    category: 'Helicopter (Rotary Wing)',
    type: 'Kamov - MI',
    aliases: ['kamov', 'ka-32', 'ka32', 'mi-8', 'mi8', 'mi-17', 'mi17', 'mi'],
    tarif: 6000000,
    satuan: 'per unit pesawat, per malam',
  },

  // Fixed Wing (Pesawat Terbang)
  {
    category: 'Pesawat Terbang (Fixed Wing)',
    type: 'Cessna Caravan C208',
    aliases: ['cessna', 'c208', 'caravan', 'c-208', 'cessna 208'],
    tarif: 3500000,
    satuan: 'per unit pesawat, per malam',
  },
  {
    category: 'Pesawat Terbang (Fixed Wing)',
    type: 'PAC 750 XL',
    aliases: ['pac 750', 'pac750', 'pac 750 xl', 'pac-750'],
    tarif: 3500000,
    satuan: 'per unit pesawat, per malam',
  },
  {
    category: 'Pesawat Terbang (Fixed Wing)',
    type: 'DHC-6 Series',
    aliases: ['dhc-6', 'dhc6', 'twin otter', 'viking', 'dhc 6'],
    tarif: 4500000,
    satuan: 'per unit pesawat, per malam',
  },
  {
    category: 'Pesawat Terbang (Fixed Wing)',
    type: 'ATR Series',
    aliases: ['atr', 'atr 42', 'atr 72', 'atr42', 'atr72', 'atr-42', 'atr-72'],
    tarif: 6000000,
    satuan: 'per unit pesawat, per malam',
  },
];

/**
 * Mendapatkan tarif sewa hanggar harian per unit pesawat (Rp / malam)
 * Berdasarkan master_tariffs database atau pencocokan tipe armada resmi.
 */
export const getAircraftTariff = (aircraft: any): number => {
  if (!aircraft) return 3500000;

  // 1. Ambil dari relasi master_tariffs di database jika ada
  if (aircraft.aircraft_types?.master_tariffs && Array.isArray(aircraft.aircraft_types.master_tariffs) && aircraft.aircraft_types.master_tariffs.length > 0) {
    const rawTarif = aircraft.aircraft_types.master_tariffs[0]?.tarif;
    if (rawTarif !== undefined && rawTarif !== null) {
      const parsed = Number(rawTarif);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }

  // 2. Ambil dari relasi langsung master_tariffs
  if (aircraft.master_tariffs?.tarif) {
    const parsed = Number(aircraft.master_tariffs.tarif);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }

  // 3. Ambil dari string tipe pesawat / custom_type_name
  const rawTypeName = (
    aircraft.custom_type_name ||
    aircraft.aircraft_types?.jenis_pesawat ||
    aircraft.aircraft_type ||
    aircraft.type ||
    ''
  ).toLowerCase();

  for (const item of OFFICIAL_HANGAR_TARIFFS) {
    if (rawTypeName === item.type.toLowerCase()) {
      return item.tarif;
    }
    for (const alias of item.aliases) {
      if (rawTypeName.includes(alias)) {
        return item.tarif;
      }
    }
  }

  // Fallback standar
  return 3500000;
};

/**
 * Format string tarif per malam untuk satu unit pesawat
 */
export const formatAircraftDailyTariff = (aircraft: any): string => {
  const tarif = getAircraftTariff(aircraft);
  return `${formatRupiah(tarif)} / malam`;
};

/**
 * Hitung kalkulasi tarif hanggar keseluruhan untuk armada dan durasi malam tertentu
 */
export const calculateHangarRentalTotal = (aircrafts: any[], totalMalam: number) => {
  const durasi = Math.max(1, totalMalam || 1);
  let totalPerMalam = 0;

  const breakdown = (aircrafts || []).map((ac) => {
    const tarifMalam = getAircraftTariff(ac);
    const subtotal = tarifMalam * durasi;
    totalPerMalam += tarifMalam;
    return {
      aircraft: ac,
      tarifPerMalam: tarifMalam,
      durasiMalam: durasi,
      subtotal,
    };
  });

  const totalEstimasi = totalPerMalam * durasi;

  return {
    durasiMalam: durasi,
    totalPerMalam,
    totalEstimasi,
    breakdown,
  };
};
