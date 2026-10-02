"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, Plane, Users, Calendar, Clock, AlertTriangle, 
  ArrowRight, Loader2, Info, Check 
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { RentalApplication } from '@/types/rental';
import { Aircraft } from '@/types/aircraft';
import { MiniAirportItem } from './types';
import { rentalService } from '@/services/rentalService';
import { getErrorMessage } from '@/services/api';
import StatusBadge from '@/components/StatusBadge';

interface MiniAirportStep3ChooseServiceProps {
  app: RentalApplication;
  miniAirports: MiniAirportItem[];
  effectiveAircrafts: Aircraft[];
  onSuccess: (updatedApp: RentalApplication) => void;
  isReadOnly?: boolean;
}

export const MiniAirportStep3ChooseService: React.FC<MiniAirportStep3ChooseServiceProps> = ({
  app,
  miniAirports,
  effectiveAircrafts,
  onSuccess,
  isReadOnly = false
}) => {
  // Parse existing data if available
  const existingSpec = useMemo(() => {
    if (!app.specific_needs) return {};
    if (typeof app.specific_needs === 'string') {
      try {
        return JSON.parse(app.specific_needs);
      } catch (e) {
        return {};
      }
    }
    return app.specific_needs;
  }, [app.specific_needs]);

  const contractFasilitas = (app.contracts?.fasilitas as any) || {};
  const contractNumber = app.contracts?.contract_number;

  // Mini Airport tujuan yang sudah ditentukan sejak awal & diverifikasi Kadis
  const boundAirportId = existingSpec.airport_id || contractFasilitas.mini_airport_id || null;
  const boundAirportName = existingSpec.airport_name || contractFasilitas.airport_name;
  const boundAirportCode = (existingSpec.airport_code || contractFasilitas.airport_code || '').toUpperCase();
  const boundAirportLocation = existingSpec.airport_location || contractFasilitas.airport_location;

  const currentAirport = useMemo(() => {
    if (boundAirportId) {
      const found = miniAirports.find(a => a.id === Number(boundAirportId));
      if (found) return found;
    }
    if (boundAirportName || boundAirportCode) {
      return {
        id: Number(boundAirportId) || 1,
        nama_bandara: boundAirportName || 'Bandara Mini Airport',
        kode_bandara: boundAirportCode || 'MINI',
        lokasi: boundAirportLocation || 'Papua Tengah',
        deskripsi: '',
        status_operasional: 'Aktif'
      };
    }
    return miniAirports.length > 0 ? miniAirports[0] : null;
  }, [miniAirports, boundAirportId, boundAirportName, boundAirportCode, boundAirportLocation]);

  const [selectedAircraftId, setSelectedAircraftId] = useState<number | null>(
    existingSpec.aircraft_id || (effectiveAircrafts.length > 0 ? effectiveAircrafts[0].id : null)
  );
  const [landingDate, setLandingDate] = useState<string>(
    existingSpec.landing_date || dayjs().format('YYYY-MM-DD')
  );
  const [landingTime, setLandingTime] = useState<string>(
    existingSpec.landing_time || '08:30'
  );
  const [passengersCount, setPassengersCount] = useState<number>(
    existingSpec.passengers_count ?? 6
  );
  const [purpose, setPurpose] = useState<string>(
    existingSpec.purpose || 'Penerbangan Perintis & Angkutan Penumpang'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default aircraft jika belum terpilih atau jika armada yang sebelumnya dipilih sudah tidak tersedia
  useEffect(() => {
    if (effectiveAircrafts.length > 0) {
      const isCurrentValid = effectiveAircrafts.some(a => a.id === selectedAircraftId);
      if (!isCurrentValid) {
        setSelectedAircraftId(effectiveAircrafts[0].id);
      }
    } else {
      setSelectedAircraftId(null);
    }
  }, [effectiveAircrafts, selectedAircraftId]);

  const selectedAircraft = useMemo(() => {
    return effectiveAircrafts.find(a => a.id === selectedAircraftId) || null;
  }, [effectiveAircrafts, selectedAircraftId]);

  // Kapasitas armada terpilih
  const maxCapacity = selectedAircraft?.capacity && selectedAircraft.capacity > 0 ? Number(selectedAircraft.capacity) : null;
  const isPassengerOverCapacity = maxCapacity !== null && passengersCount > maxCapacity;

  // Auto-adjust passengers if exceeds newly chosen aircraft
  const handleSelectAircraft = (aircraftId: number) => {
    if (isReadOnly) return;
    setSelectedAircraftId(aircraftId);
    const chosen = effectiveAircrafts.find(a => a.id === aircraftId);
    if (chosen?.capacity && chosen.capacity > 0 && passengersCount > chosen.capacity) {
      setPassengersCount(chosen.capacity);
      toast.success(`Jumlah penumpang disesuaikan ke kapasitas ${chosen.registration_number} (Maks. ${chosen.capacity} Pax).`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!currentAirport) {
      toast.error('Data Bandara (Mini Airport) tujuan tidak ditemukan!');
      return;
    }
    if (!selectedAircraft) {
      toast.error('Pilih armada pesawat yang siap terbang!');
      return;
    }
    if (isPassengerOverCapacity) {
      toast.error(`Jumlah penumpang (${passengersCount}) melebihi kapasitas armada ${selectedAircraft.registration_number} (Maks. ${maxCapacity} Orang)!`);
      return;
    }
    if (passengersCount <= 0) {
      toast.error('Jumlah penumpang minimal 1 orang.');
      return;
    }

    try {
      setIsSubmitting(true);

      const specificNeedsData = {
        ...existingSpec,
        service_type: 'Mini Airport',
        airport_id: currentAirport.id,
        airport_name: currentAirport.nama_bandara,
        airport_code: currentAirport.kode_bandara,
        airport_location: currentAirport.lokasi || 'Papua Tengah',
        aircraft_id: selectedAircraft.id,
        registration_number: selectedAircraft.registration_number,
        aircraft_type: selectedAircraft.aircraft_types?.jenis_pesawat || selectedAircraft.custom_type_name || 'Pesawat Perintis',
        aircraft_capacity: maxCapacity,
        passengers_count: passengersCount,
        landing_date: landingDate,
        landing_time: landingTime,
        purpose: purpose,
        allocated_stand: existingSpec.allocated_stand || null
      };

      const payload = {
        application_type: 'Mini Airport',
        specific_needs: specificNeedsData,
        start_date: landingDate ? new Date(`${landingDate}T${landingTime}:00.000Z`).toISOString() : null,
        end_date: landingDate ? new Date(`${landingDate}T${landingTime}:00.000Z`).toISOString() : null
      };

      const updated = await rentalService.completeDetails(app.id, payload);
      toast.success(`Rencana operasional penerbangan ke ${currentAirport.nama_bandara} berhasil disimpan! Menunggu validasi admin.`);
      onSuccess(updated);
    } catch (err: any) {
      console.error('Error completing details:', err);
      toast.error(getErrorMessage(err) || 'Gagal menyimpan detail pendaratan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Container Card */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs">
        {/* Header Panel */}
        <div className="px-5 py-4 border-b border-[#f4f4f4] bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#333]">
              Tahap 3: Layanan &amp; Pemilihan Armada Pesawat
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Surat permohonan resmi dan Kontrak Payung Induk telah disahkan. Tentukan armada pesawat siap terbang, manifes penumpang, serta estimasi waktu kedatangan.
            </p>
          </div>
          <StatusBadge status="Surat Disetujui" />
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {/* KOTAK 1: KARTU INFORMASI BANDARA TUJUAN */}
          <div className="bg-gradient-to-r from-blue-50/70 via-sky-50/30 to-slate-50 border border-blue-200/80 rounded-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100/90 border border-blue-200 flex items-center justify-center text-[#3c8dbc] flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-[#3c8dbc]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Bandara Perintis Tujuan (PKS Payung)
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-bold font-mono bg-blue-100 text-[#3c8dbc] rounded-2xs border border-blue-200">
                    {currentAirport?.kode_bandara || 'MINI'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {currentAirport?.nama_bandara || 'Bandara Mini Airport'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span>Wilayah: <strong className="text-slate-700">{currentAirport?.lokasi || 'Papua Tengah'}</strong></span>
                  <span className="text-slate-300">•</span>
                  <span>No. PKS: <strong className="text-[#3c8dbc] font-mono">{contractNumber || 'PKS-PAYUNG/MINI/RESMI'}</strong></span>
                  <span className="text-slate-300">•</span>
                  <span>Skema: <strong className="text-slate-700">Retribusi Pasca-Flight (e-SKRD)</strong></span>
                </p>
              </div>
            </div>

            <div className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xs border border-emerald-200 self-start md:self-auto flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              PKS Induk Aktif &amp; Terverifikasi
            </div>
          </div>

          {/* DUA KOTAK UTAMA (KIRI & KANAN) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* KOTAK 2: PILIH ARMADA PESAWAT */}
            <div className="bg-white border border-[#d2d6de] rounded-xs p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-2xs">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Plane className="w-4 h-4 text-[#3c8dbc]" />
                    1. Pilih Armada Pesawat Siap Terbang <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-[#3c8dbc] font-bold">
                    {effectiveAircrafts.length} Armada Tersedia
                  </span>
                </div>

                {effectiveAircrafts.length === 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xs text-xs text-amber-800 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Tidak ada armada siap terbang yang tersedia.</span>
                      <p className="mt-0.5">Semua armada Anda saat ini sedang digunakan atau dipilih pada permohonan penerbangan lain, sedang beroperasi di apron bandara, atau dalam pemeliharaan.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                    {effectiveAircrafts.map((ac) => {
                      const isSelected = selectedAircraftId === ac.id;
                      const typeName = ac.aircraft_types?.jenis_pesawat || ac.custom_type_name || 'Pesawat Perintis';
                      const cap = ac.capacity && ac.capacity > 0 ? ac.capacity : '-';

                      return (
                        <div
                          key={ac.id}
                          onClick={() => !isReadOnly && handleSelectAircraft(ac.id)}
                          className={`p-3 rounded-xs border transition-all flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'border-[#3c8dbc] bg-blue-50/60 shadow-2xs ring-1 ring-[#3c8dbc]'
                              : isReadOnly
                              ? 'border-[#d2d6de] bg-slate-50/50 opacity-60 cursor-not-allowed'
                              : 'border-[#d2d6de] hover:border-slate-300 hover:bg-slate-50/70 bg-white cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected ? 'border-[#3c8dbc] bg-[#3c8dbc]' : 'border-slate-300'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-xs text-[#3c8dbc] bg-white px-2 py-0.5 rounded-2xs border border-blue-200">
                                  {ac.registration_number}
                                </span>
                                <span className="text-xs font-bold text-slate-800">
                                  {typeName}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1">
                                Kapasitas Angkut: <strong className="text-slate-700">{cap} Penumpang (Pax)</strong>
                              </p>
                            </div>
                          </div>

                          <span className="text-[10px] text-[#00a65a] bg-green-50 px-2 py-0.5 rounded-2xs border border-green-200 font-semibold whitespace-nowrap">
                            ● Siap Terbang
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Summary Bar Armada */}
              {selectedAircraft && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xs border border-slate-200">
                  <span className="text-slate-500">Armada Terpilih:</span>
                  <span className="font-bold text-[#3c8dbc] font-mono">
                    {selectedAircraft.registration_number} ({selectedAircraft.capacity || '-'} Kursi)
                  </span>
                </div>
              )}
            </div>

            {/* KOTAK 3: MANIFES PENUMPANG & WAKTU PENDARATAN */}
            <div className="bg-white border border-[#d2d6de] rounded-xs p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-2xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#3c8dbc]" />
                    2. Manifes &amp; Waktu Pendaratan <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">Waktu Indonesia Timur (WIT)</span>
                </div>

                {/* Input 1: Jumlah Penumpang */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700">
                      Jumlah Penumpang (Pax) <span className="text-red-500">*</span>
                    </label>
                    {maxCapacity !== null && (
                      <span className="text-[11px] font-semibold text-slate-500">
                        Batas Kapasitas: <strong className="text-[#3c8dbc]">{maxCapacity} Orang</strong>
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={maxCapacity || 99}
                      value={passengersCount}
                      disabled={isReadOnly}
                      onChange={(e) => !isReadOnly && setPassengersCount(Math.max(1, Number(e.target.value) || 0))}
                      className={`w-full text-xs font-bold p-2.5 pr-14 border rounded-xs outline-none ${
                        isReadOnly
                          ? 'bg-slate-100 text-slate-700 border-slate-300 cursor-not-allowed'
                          : isPassengerOverCapacity
                          ? 'border-red-500 text-red-700 focus:ring-1 focus:ring-red-500 bg-white'
                          : 'border-[#d2d6de] text-slate-800 focus:ring-1 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] bg-white'
                      }`}
                      required
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">
                      Orang
                    </span>
                  </div>

                  {isPassengerOverCapacity && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-xs text-[11px] text-red-700 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                      <span>
                        Jumlah penumpang ({passengersCount}) melebihi kapasitas {selectedAircraft?.registration_number} (Maks. {maxCapacity} Orang)!
                      </span>
                    </div>
                  )}
                </div>

                {/* Input 2: Tanggal & Jam Pendaratan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Jadwal Estimasi Mendarat <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="block text-[11px] text-slate-500 mb-1 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Tanggal Tiba:
                      </span>
                      <input
                        type="date"
                        value={landingDate}
                        min={dayjs().format('YYYY-MM-DD')}
                        disabled={isReadOnly}
                        onChange={(e) => !isReadOnly && setLandingDate(e.target.value)}
                        className={`w-full text-xs p-2 border rounded-xs font-medium outline-none ${
                          isReadOnly
                            ? 'bg-slate-100 text-slate-700 border-slate-300 cursor-not-allowed'
                            : 'border-[#d2d6de] bg-white text-slate-800 focus:ring-1 focus:ring-[#3c8dbc]'
                        }`}
                        required
                      />
                    </div>

                    <div>
                      <span className="block text-[11px] text-slate-500 mb-1 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Jam Tiba (WIT):
                      </span>
                      <input
                        type="time"
                        value={landingTime}
                        disabled={isReadOnly}
                        onChange={(e) => !isReadOnly && setLandingTime(e.target.value)}
                        className={`w-full text-xs p-2 border rounded-xs font-medium outline-none ${
                          isReadOnly
                            ? 'bg-slate-100 text-slate-700 border-slate-300 cursor-not-allowed'
                            : 'border-[#d2d6de] bg-white text-slate-800 focus:ring-1 focus:ring-[#3c8dbc]'
                        }`}
                        required
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 pt-0.5">
                    <Info className="w-3 h-3 text-[#3c8dbc] flex-shrink-0" />
                    Disarankan pagi hari (07:00 - 11:00 WIT) demi keselamatan cuaca pegunungan.
                  </p>
                </div>

                {/* Input 3: Keperluan Penerbangan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Keperluan Penerbangan Perintis <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={purpose}
                    disabled={isReadOnly}
                    onChange={(e) => !isReadOnly && setPurpose(e.target.value)}
                    className={`w-full text-xs p-2.5 border rounded-xs font-medium outline-none ${
                      isReadOnly
                        ? 'bg-slate-100 text-slate-700 border-slate-300 cursor-not-allowed'
                        : 'border-[#d2d6de] bg-white text-slate-800 focus:ring-1 focus:ring-[#3c8dbc] cursor-pointer'
                    }`}
                  >
                    <option value="Penerbangan Perintis & Angkutan Penumpang">Penerbangan Perintis &amp; Angkutan Penumpang</option>
                    <option value="Distribusi Logistik & Sembako Wilayah Pedalaman">Distribusi Logistik &amp; Sembako Wilayah Pedalaman</option>
                    <option value="Pelayanan Medis Darurat / Medevac">Pelayanan Medis Darurat / Medevac</option>
                    <option value="Penerbangan Kargo Khusus & Logistik Bencana">Penerbangan Kargo Khusus &amp; Logistik Bencana</option>
                  </select>
                </div>
              </div>

              {/* Status retribusi info bar di footer kotak 3 */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xs border border-slate-200">
                <span>Skema Retribusi:</span>
                <span className="font-semibold text-slate-700">e-SKRD Pasca-Flight</span>
              </div>
            </div>
          </div>

          {/* SECTION: BOTTOM REVIEW RIBBON & SUBMIT ACTION BAR */}
          <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs text-slate-600 bg-slate-50 px-3.5 py-2.5 rounded-xs border border-[#d2d6de] w-full sm:w-auto flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>
                Airport: <strong className="text-[#3c8dbc]">{currentAirport?.nama_bandara || '-'} ({currentAirport?.kode_bandara || '-'})</strong>
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span>
                Armada: <strong className="text-slate-800 font-mono">{selectedAircraft?.registration_number || '-'}</strong> ({passengersCount} Pax)
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span>
                Jadwal: <strong className="text-slate-700">{landingDate ? dayjs(landingDate).format('DD MMM YYYY') : '-'}, {landingTime} WIT</strong>
              </span>
            </div>

            {isReadOnly ? (
              <div className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-xs shadow-2xs whitespace-nowrap">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                Tahap 3 Selesai &bull; Rencana Operasional Terkunci Resmi
              </div>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || isPassengerOverCapacity || !currentAirport || !selectedAircraft}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#3c8dbc] hover:bg-[#367fa9] rounded-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan Rincian...
                  </>
                ) : (
                  <>
                    Lanjutkan ke Alokasi Stand Apron
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
