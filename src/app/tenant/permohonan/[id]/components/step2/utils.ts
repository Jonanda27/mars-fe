import { Asset } from '@/types/asset';
import { Aircraft } from '@/types/aircraft';

export const calculateAircraftArea = (
  aircraft: Aircraft,
  masterAircraftTypes: { id: number; jenis_pesawat: string; luas_efektif_m2: string }[]
): number => {
  if (aircraft.custom_type_area) {
    return Number.parseFloat(aircraft.custom_type_area.toString());
  }
  if (aircraft.aircraft_types?.luas_efektif_m2) {
    return Number.parseFloat(aircraft.aircraft_types.luas_efektif_m2.toString());
  }
  if (aircraft.aircraft_type_id) {
    const masterType = masterAircraftTypes.find(t => t.id === aircraft.aircraft_type_id);
    if (masterType?.luas_efektif_m2) {
      return Number.parseFloat(masterType.luas_efektif_m2.toString());
    }
  }
  return 0;
};

export const calculateTotalLeaseEstimate = (asset: Asset | undefined, malam: number): string => {
  if (!asset?.master_tariffs?.tarif) return '-';
  const monthlyRate = Number(asset.master_tariffs.tarif) * Number(asset.luas || 0);
  if (malam > 0) {
    return (monthlyRate * Math.ceil(malam / 30)).toLocaleString('id-ID');
  }
  return monthlyRate.toLocaleString('id-ID');
};
