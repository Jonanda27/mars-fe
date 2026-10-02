import React from 'react';
import { RentalApplication } from '@/types/rental';
import { resolveUrl } from '@/utils/url';
import { formatRupiah } from '@/utils/formatCurrency';
import { getAircraftTariff, calculateHangarRentalTotal } from '@/utils/aircraftTariff';
import { FileText, Calendar, ChevronRight, Plane, Building2 } from 'lucide-react';
import RupiahIcon from '@/components/icons/RupiahIcon';
import dayjs from 'dayjs';

interface RentalPlanCardProps {
  app: RentalApplication;
  currentStep: number;
}

export const RentalPlanCard: React.FC<RentalPlanCardProps> = ({ app, currentStep }) => {
  const isMini = Boolean(
    app.application_type?.toLowerCase().includes('mini') ||
    (app.specific_needs && typeof app.specific_needs === 'object' && 'airport_name' in app.specific_needs)
  );

  const isHangar = Boolean(
    app.application_type?.toLowerCase().includes('hanggar') ||
    app.assets?.kategori?.toLowerCase().includes('hanggar') ||
    app.contracts?.contract_type === 'Payung'
  );

  const durasiMalam = (() => {
    if (!app.end_date || !app.start_date) return 1;
    const diff = dayjs(app.end_date).diff(dayjs(app.start_date), 'day');
    return diff === 0 ? 1 : diff;
  })();

  const durasiBulan = (() => {
    if (!app.end_date || !app.start_date) return 1;
    const start = new Date(app.start_date);
    const end = new Date(app.end_date);
    let diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (end.getDate() > start.getDate()) {
      diffMonths += 1;
    }
    return Math.max(1, diffMonths);
  })();

  const aircraftDetails = app.specific_needs?.aircraft_details || [];
  const hangarCalc = calculateHangarRentalTotal(aircraftDetails, durasiMalam);

  return (
    <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-[#3c8dbc] px-5 py-4 flex items-center gap-3">
        <FileText className="w-5 h-5 text-white" />
        <h2 className="text-white font-semibold tracking-wide">Rencana Sewa &amp; Spesifikasi</h2>
      </div>
      
      <div className="p-6">
        <div className="mb-6 bg-slate-50 border border-slate-200 rounded-none p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tujuan / Perihal</p>
          <p className="text-slate-800 font-bold text-lg">{app.purpose || '-'}</p>
        </div>

        {app.official_letter_url && (
          <div className="mb-6 bg-slate-50 border border-slate-200 rounded-none p-4 flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Dokumen Surat Permohonan Resmi</p>
              <p className="text-slate-700 font-medium text-sm">Lampiran permohonan yang ditandatangani.</p>
            </div>
            <a 
              href={resolveUrl(app.official_letter_url)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-[#3c8dbc] hover:bg-[#347ea8] text-white px-4 py-2 rounded-none text-sm font-bold flex items-center shadow-sm"
            >
              <FileText className="w-4 h-4 mr-2" /> Lihat PDF
            </a>
          </div>
        )}

        {/* Khusus untuk sewa selain Hanggar (seperti Ruangan), tampilkan dokumen PKS jika telah diunggah */}
        {!isHangar && !isMini && app.contracts?.signed_document_url && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-none p-4 flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Dokumen PKS (Telah Ditandatangani Tenant)</p>
              <p className="text-emerald-800 font-medium text-sm">Draft PKS yang telah ditandatangani dan diunggah oleh tenant.</p>
            </div>
            <a 
              href={resolveUrl(app.contracts.signed_document_url)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-none text-sm font-bold flex items-center shadow-sm"
            >
              <FileText className="w-4 h-4 mr-2" /> Lihat PDF PKS
            </a>
          </div>
        )}

        {/* Only show these details if tenant has completed them */}
        {currentStep >= 3 && app.application_type && (
          <>
            <div className="mb-6 bg-slate-50 border border-slate-200 rounded-none p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tipe Permohonan Layanan</p>
              <p className="text-slate-800 font-bold text-lg">{app.application_type}</p>
            </div>

            {/* Timeline Periode Sewa */}
            <div className="mb-8 bg-slate-50 p-5 rounded-none border border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" /> Periode Pemanfaatan
              </p>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-white p-3 rounded-none shadow-sm border border-slate-200">
                  <p className="text-[11px] text-slate-500 mb-1">Tanggal Mulai</p>
                  <p className="font-bold text-slate-800">
                    {app.start_date ? dayjs(app.start_date).format('DD MMMM YYYY') : '-'}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <div className="flex-1 bg-white p-3 rounded-none shadow-sm border border-slate-200">
                  <p className="text-[11px] text-slate-500 mb-1">Tanggal Selesai</p>
                  <p className="font-bold text-slate-800">
                    {app.end_date ? dayjs(app.end_date).format('DD MMMM YYYY') : '-'}
                  </p>
                </div>
                <div className="w-36 bg-[#3c8dbc] text-white p-3 rounded-none shadow-sm flex flex-col items-center justify-center flex-shrink-0">
                  <p className="text-[10px] text-white/80 uppercase tracking-wider mb-0.5">Durasi</p>
                  <p className="font-bold text-lg leading-tight">
                    {durasiMalam} Malam
                  </p>
                  {!isHangar && !isMini && (
                    <span className="text-[11px] text-white/90 font-semibold mt-0.5">({durasiBulan} Bulan)</span>
                  )}
                </div>
              </div>
            </div>

            {isMini ? (
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                    <Plane className="w-4 h-4 mr-1.5 text-[#3c8dbc]" /> Rincian Rencana Pendaratan &amp; Stand Apron Mini Airport
                  </p>
                  <div className="bg-slate-50 border border-slate-200 p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      <div className="bg-white p-3.5 border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Mini Airport Tujuan</span>
                        <div className="font-bold text-slate-900 text-sm">
                          {(app.specific_needs as any)?.airport_name || 'Lapangan Terbang Perintis'}
                        </div>
                        <div className="text-[11px] text-[#3c8dbc] font-mono font-bold mt-0.5">
                          Kode: {(app.specific_needs as any)?.airport_code || '-'} • {(app.specific_needs as any)?.airport_location || 'Papua Tengah'}
                        </div>
                      </div>

                      <div className="bg-white p-3.5 border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Armada Pesawat</span>
                        <div className="font-bold text-[#3c8dbc] text-sm font-mono">
                          {(app.specific_needs as any)?.registration_number || '-'}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          {(app.specific_needs as any)?.aircraft_type || 'Pesawat Perintis'} • Maks. {(app.specific_needs as any)?.aircraft_capacity || '-'} Pax
                        </div>
                      </div>

                      <div className="bg-white p-3.5 border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Jadwal &amp; Stand Apron</span>
                        <div className="font-bold text-slate-900 text-sm">
                          {(app.specific_needs as any)?.landing_date ? dayjs((app.specific_needs as any).landing_date).format('DD MMMM YYYY') : '-'}
                        </div>
                        <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                          Pukul {(app.specific_needs as any)?.landing_time || '-'} WIT • Posisi: {(app.specific_needs as any)?.allocated_stand || 'Menunggu Penetapan Admin'}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 font-medium">Manifes Penumpang: </span>
                        <strong className="text-slate-800">{(app.specific_needs as any)?.passengers_count || '-'} Orang Penumpang</strong>
                      </div>
                      <div className="text-slate-500 font-medium">
                        Keperluan: <strong className="text-slate-800">{(app.specific_needs as any)?.purpose || app.purpose || '-'}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : isHangar ? (
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                    <Plane className="w-4 h-4 mr-1.5" /> Kebutuhan Spesifik Aset (Armada Pesawat)
                  </p>
                  <ul className="space-y-3 bg-slate-50 p-4 rounded-none border border-slate-100 min-h-[80px]">
                    <li className="flex flex-col">
                      <span className="text-[11px] text-slate-500 mb-2">
                        Daftar Pesawat yang akan dimasukkan ke Hanggar (Registrasi - Tipe - Tarif Master)
                      </span>
                      {aircraftDetails && Array.isArray(aircraftDetails) && aircraftDetails.length > 0 ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                            {aircraftDetails.map((ac: any) => {
                              const dailyTariff = getAircraftTariff(ac);
                              return (
                                <div key={ac.id} className="text-sm font-medium text-slate-800 bg-white border border-slate-200 p-3 rounded-none shadow-sm flex flex-col justify-between">
                                  <div>
                                    <div className="flex justify-between items-start mb-1">
                                      <span className="font-bold text-[#3c8dbc]">{ac.registration_number}</span>
                                      {ac.aircraft_types?.luas_efektif_m2 && (
                                        <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-semibold">
                                          {ac.aircraft_types.luas_efektif_m2} m²
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-600">{ac.aircraft_type || ac.aircraft_types?.jenis_pesawat || '-'}</p>
                                  </div>
                                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Tarif Master:</span>
                                    <span className="font-bold text-[#3c8dbc] bg-blue-50 px-1.5 py-0.5 border border-blue-100">
                                      {formatRupiah(dailyTariff)} / malam
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Ringkasan Estimasi Biaya Sewa Hanggar */}
                          <div className="bg-[#f8fafc] border border-blue-100 p-3.5 rounded-none flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="text-xs text-slate-600">
                              <span className="font-bold text-slate-700">Total Tarif Harian ({aircraftDetails.length} Armada): </span>
                              <span className="font-semibold text-slate-800">{formatRupiah(hangarCalc.totalPerMalam)} / malam</span>
                            </div>
                            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <RupiahIcon className="w-4 h-4 text-[#3c8dbc]" />
                              <span>Total Estimasi ({durasiMalam} Malam): </span>
                              <span className="text-[14px] text-[#3c8dbc]">{formatRupiah(hangarCalc.totalEstimasi)}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="font-medium text-slate-800 italic text-sm">Belum ada armada pesawat yang dipilih</span>
                      )}
                    </li>
                    {app.specific_needs?.facilities && (
                      <li className="flex flex-col mt-4 pt-4 border-t border-slate-200">
                        <span className="text-[11px] text-slate-500">Ruang / Fasilitas Pendukung Khusus</span>
                        <span className="font-medium text-slate-800">{app.specific_needs.facilities}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {app.assets && (() => {
                  const tarif = Number(app.assets.master_tariffs?.tarif || app.assets.tarif_dasar || 0);
                  const luas = Number(app.assets.luas || 0);
                  const isPerM2 = (app.assets.master_tariffs?.satuan || app.assets.satuan || '').toLowerCase().includes('m2') ||
                                  (app.assets.master_tariffs?.satuan || app.assets.satuan || '').toLowerCase().includes('m²');
                  const totalPerBulan = isPerM2 ? tarif * luas : tarif;
                  const totalBiaya = totalPerBulan * durasiBulan;

                  return (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                        <Building2 className="w-4 h-4 mr-1.5 text-[#3c8dbc]" /> Spesifikasi Ruangan yang Dimohon
                      </p>
                      <div className="bg-slate-50 p-4 rounded-none border border-slate-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                          <div>
                            <p className="text-[11px] text-slate-500 mb-0.5">Nama & Kode Ruangan</p>
                            <p className="font-bold text-slate-800 text-sm">{app.assets.nama_aset}</p>
                            <p className="text-xs text-[#3c8dbc] font-semibold">{app.assets.kode_aset}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-slate-500 mb-0.5">Luas Ruangan</p>
                            <p className="font-bold text-slate-800 text-sm">{app.assets.luas || '-'} m²</p>
                            <p className="text-xs text-slate-500">{app.assets.lokasi || app.assets.kategori || 'Ruangan'}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-slate-500 mb-0.5">Tarif Dasar Resmi</p>
                            <p className="font-bold text-[#3c8dbc] text-sm">
                              {formatRupiah(tarif)}
                            </p>
                            <p className="text-xs text-slate-500">
                              per {app.assets.master_tariffs?.satuan || app.assets.satuan || 'm²/bulan'}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] text-slate-500 mb-0.5">Biaya per Bulan</p>
                            <p className="font-bold text-slate-800 text-sm">
                              {formatRupiah(totalPerBulan)}
                            </p>
                            <p className="text-xs text-slate-500">
                              {isPerM2 && luas > 0 ? `per bulan (${luas} m²)` : 'per bulan'}
                            </p>
                          </div>
                          <div className="bg-white p-2.5 border-2 border-[#3c8dbc]/80 shadow-xs rounded-none">
                            <p className="text-[10px] text-[#3c8dbc] font-bold uppercase tracking-wider mb-0.5 flex items-center">
                              <RupiahIcon className="w-3.5 h-3.5 mr-1 text-[#3c8dbc]" /> Total Biaya Sewa
                            </p>
                            <p className="font-black text-[#3c8dbc] text-base">
                              {formatRupiah(totalBiaya)}
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium">
                              {durasiBulan} Bulan ({durasiMalam} Malam)
                            </p>
                          </div>
                        </div>

                        {/* Rincian Ringkasan Rumus Total */}
                        <div className="mt-3.5 pt-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-white -mx-4 -mb-4 p-3 px-4 border-b-0">
                          <div className="text-xs text-slate-600 flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-700">Rincian Kalkulasi:</span>
                            <span className="bg-slate-100 px-2 py-0.5 border border-slate-200 text-slate-700 font-medium">
                              {luas} m² × {formatRupiah(tarif)} = <strong>{formatRupiah(totalPerBulan)}/bln</strong>
                            </span>
                            <span>×</span>
                            <span className="bg-blue-50 px-2 py-0.5 border border-blue-100 text-[#3c8dbc] font-bold">
                              {durasiBulan} Bulan ({durasiMalam} Malam)
                            </span>
                          </div>
                          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <span>Total Ketetapan:</span>
                            <span className="text-[15px] text-[#3c8dbc] font-black">{formatRupiah(totalBiaya)}</span>
                          </div>
                        </div>

                        {/* Banner Penetapan SKRD di Awal */}
                        <div className="mt-4 -mx-4 -mb-4 bg-blue-50 border-t border-blue-200 p-2.5 px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                          <span className="text-blue-900 font-medium flex items-center gap-1.5">
                            <RupiahIcon className="w-3.5 h-3.5 text-[#3c8dbc] flex-shrink-0" />
                            <span><strong>Penetapan SKRD di Awal:</strong> Ditetapkan sekaligus untuk keseluruhan masa sewa ({app.start_date ? dayjs(app.start_date).format('DD/MM/YYYY') : '-'} s.d. {app.end_date ? dayjs(app.end_date).format('DD/MM/YYYY') : '-'})</span>
                          </span>
                          <span className="bg-[#3c8dbc] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider flex-shrink-0">
                            SKRD Di Muka
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {(app.specific_needs?.facilities || (app.specific_needs as any)?.kebutuhan_ruang_pendukung) && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Kebutuhan / Fasilitas Pendukung Khusus
                    </p>
                    <div className="bg-slate-50 p-3.5 rounded-none border border-slate-200">
                      <p className="text-sm text-slate-800 font-medium">
                        {app.specific_needs.facilities || (app.specific_needs as any).kebutuhan_ruang_pendukung}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        
        {currentStep < 3 && (
          <div className="mt-4 bg-slate-100 border border-slate-200 rounded-none p-6 text-center text-slate-500">
            <p>Tenant belum melengkapi detail layanan sewa.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default RentalPlanCard;
