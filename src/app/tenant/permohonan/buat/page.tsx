"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { rentalService } from '@/services/rentalService';
import { assetService } from '@/services/assetService';
import { Asset } from '@/types/asset';
import { aircraftService } from '@/services/aircraftService';
import { Aircraft } from '@/types/aircraft';
import { contractService } from '@/services/contractService';
import { FileText, Save, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';

export default function BuatPermohonanPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [fetchingAssets, setFetchingAssets] = useState(true);
  const [allAvailableAssets, setAllAvailableAssets] = useState<Asset[]>([]);
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [tenantAircrafts, setTenantAircrafts] = useState<Aircraft[]>([]);
  const [fetchingAircrafts, setFetchingAircrafts] = useState(true);
  
  const [checkingContract, setCheckingContract] = useState(true);
  const [hasActiveContract, setHasActiveContract] = useState(false);
  const [activeContractId, setActiveContractId] = useState<number | null>(null);
  
  // Hangar Capacity State
  const [assetCapacity, setAssetCapacity] = useState<{ isHangar: boolean, totalArea: number, usedArea: number, remainingArea: number } | null>(null);
  const [fetchingCapacity, setFetchingCapacity] = useState(false);
  
  const [formData, setFormData] = useState({
    asset_id: '',
    start_date: '',
    end_date: '',
    purpose: '',
  });

  const [specificNeeds, setSpecificNeeds] = useState({
    aircraft_ids: [] as string[],
    kebutuhan_ruang_pendukung: ''
  });

  useEffect(() => {
    // Check if tenant has an active contract
    contractService.getTenantContracts().then((contracts) => {
      const active = contracts.find(c => c.status === 'Active');
      if (active && active.id !== undefined) {
        setHasActiveContract(true);
        setActiveContractId(active.id);
      } else {
        setHasActiveContract(false);
      }
      setCheckingContract(false);
    }).catch(err => {
      console.error("Error checking contracts:", err);
      setCheckingContract(false);
    });

    // Ambil daftar aset yang Available
    assetService.getAssets().then(data => {
      const available = data.filter(a => a.status === 'Available' || a.status === 'Tersedia');
      setAllAvailableAssets(available);
      setAvailableAssets(available);
      setFetchingAssets(false);
    }).catch(err => {
      console.error(err);
      setFetchingAssets(false);
    });

    // Ambil pesawat dan filter yang sedang digunakan di permohonan aktif/kontrak
    Promise.all([
      aircraftService.getTenantAircrafts(),
      rentalService.getTenantApplications() // we need to ensure this function exists in rentalService
    ]).then(([aircrafts, applications]) => {
      // Cari ID pesawat yang sudah ada di permohonan yang aktif (bukan Rejected/Terminated)
      const usedAircraftIds = new Set();
      
      applications.forEach((app: any) => {
        // Anggap status yang mem-block pesawat adalah selain Rejected, Terminated, Expired
        if (app.status !== 'Rejected' && app.status !== 'Terminated' && app.status !== 'Expired') {
          // Atau jika sudah jadi kontrak, cek status kontrak
          if (app.contracts && ['Terminated', 'Expired', 'Rejected'].includes(app.contracts.status)) {
            return;
          }

          const spec = app.specific_needs;
          if (spec && Array.isArray(spec.aircraft_ids)) {
            spec.aircraft_ids.forEach((id: string) => usedAircraftIds.add(id.toString()));
          } else if (spec && spec.aircraft_id) { // Fallback for old data
            usedAircraftIds.add(spec.aircraft_id.toString());
          }
        }
      });

      const availableAircrafts = aircrafts.filter((a: any) => !usedAircraftIds.has(a.id.toString()));
      setTenantAircrafts(availableAircrafts);
      setFetchingAircrafts(false);
    }).catch(err => {
      console.error(err);
      setFetchingAircrafts(false);
    });
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Fetch capacity if asset is changed
    if (name === 'asset_id' && value) {
      setFetchingCapacity(true);
      try {
        const capacity = await assetService.getAssetCapacity(parseInt(value));
        setAssetCapacity(capacity);
      } catch (err) {
        console.error('Failed to fetch capacity', err);
        setAssetCapacity(null);
      } finally {
        setFetchingCapacity(false);
      }
    } else if (name === 'asset_id' && !value) {
      setAssetCapacity(null);
    }
  };

  const handleNeedsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSpecificNeeds(prev => ({ ...prev, [name]: value }));
  };

  // Calculate required area based on selected aircrafts
  const calculateRequiredArea = () => {
    let area = 0;
    specificNeeds.aircraft_ids.forEach(idStr => {
      const aircraft = tenantAircrafts.find(a => a.id.toString() === idStr);
      if (aircraft && aircraft.aircraft_types && aircraft.aircraft_types.luas_efektif_m2) {
        area += parseFloat(aircraft.aircraft_types.luas_efektif_m2.toString());
      }
    });
    return area;
  };
  const requiredArea = calculateRequiredArea();
  const isOverCapacity = assetCapacity?.isHangar && requiredArea > assetCapacity.remainingArea;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOverCapacity) return;
    
    setLoading(true);
    try {
      const payload = {
        ...formData,
        specific_needs: specificNeeds
      };
      await rentalService.createApplication(payload);
      router.push('/tenant/permohonan');
    } catch (error: any) {
      alert('Gagal mengajukan permohonan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingContract) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#3c8dbc]" />
      </div>
    );
  }

  if (!hasActiveContract) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white border-t-4 border-yellow-500 shadow-md p-8 text-center rounded">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Kontrak Payung Diperlukan</h2>
          <p className="text-gray-600 mb-6">
            Anda belum memiliki Kontrak Pemanfaatan Aset (Kontrak Payung) yang berstatus Aktif. 
            Sesuai prosedur operasional, Anda diwajibkan memiliki Kontrak Payung 1 Tahun sebelum dapat mengajukan permohonan jadwal kedatangan sewa.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/tenant" 
              className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded hover:bg-gray-300 transition-colors"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333] flex items-center">
          Buat Permohonan Sewa Baru
        </h1>
      </header>

      <div className="bg-white border-t-[3px] border-[#00a65a] shadow-sm rounded-sm">
        <div className="p-3 border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50">
          <h3 className="text-[16px] text-[#444] font-bold flex items-center">
            <FileText className="w-5 h-5 mr-2 text-[#00a65a]" /> Formulir Pengajuan
          </h3>
          <Link href="/tenant/permohonan" className="bg-[#f4f4f4] text-[#444] border border-[#d2d6de] px-3 py-1.5 text-[12px] hover:bg-[#e0e0e0] transition-colors flex items-center rounded-sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <h4 className="font-bold text-[#333] mb-4 pb-2 border-b border-[#f4f4f4]">Pemilihan Aset & Periode</h4>
              
              <div className="mb-4">
                <label className="block text-[13px] font-bold text-[#333] mb-1">Objek Aset Utama yang Diminati <span className="text-red-500">*</span></label>
                <p className="text-[11px] text-[#777] mb-2">Pilih aset yang statusnya sedang tersedia saat ini. (Penetapan akhir akan diputuskan oleh Admin)</p>
                <select required name="asset_id" value={formData.asset_id} onChange={handleChange} disabled={fetchingAssets} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-white disabled:bg-gray-100 disabled:text-gray-500">
                  <option value="">-- Pilih Aset --</option>
                  {fetchingAssets ? (
                    <option disabled>Memuat daftar aset...</option>
                  ) : (
                    availableAssets.length === 0 ? (
                      <option disabled>Tidak ada aset tersedia</option>
                    ) : (
                      availableAssets.map(asset => (
                        <option key={asset.id} value={asset.id}>
                          {asset.kode_aset} - {asset.nama_aset} ({asset.jenis_aset}) - {asset.luas} {asset.satuan}
                        </option>
                      ))
                    )
                  )}
                </select>
                
                {/* Hangar Capacity Display */}
                {fetchingCapacity && <div className="mt-2 text-sm text-gray-500 flex items-center"><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Mengecek kapasitas...</div>}
                {assetCapacity?.isHangar && !fetchingCapacity && (
                  <div className={`mt-3 p-3 border rounded-sm ${isOverCapacity ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[13px] font-bold text-gray-700">Kapasitas Hanggar:</span>
                      <span className={`text-[13px] font-bold ${isOverCapacity ? 'text-red-600' : 'text-blue-600'}`}>
                        Sisa: {Math.max(0, assetCapacity.remainingArea - requiredArea)} m²
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div className={`h-2.5 rounded-full ${isOverCapacity ? 'bg-red-600' : 'bg-blue-600'}`} style={{ width: `${Math.min(100, ((assetCapacity.usedArea + requiredArea) / assetCapacity.totalArea) * 100)}%` }}></div>
                    </div>
                    <div className="text-[11px] text-gray-500 flex justify-between">
                      <span>Terpakai: {assetCapacity.usedArea + requiredArea} m²</span>
                      <span>Total: {assetCapacity.totalArea} m²</span>
                    </div>
                  </div>
                )}
                
                {/* Menampilkan Detail Aset & Bandara yang Terpilih */}
                {formData.asset_id && (() => {
                  const selectedAsset = availableAssets.find(a => a.id.toString() === formData.asset_id);
                  if (!selectedAsset) return null;
                  
                  const isHangar = selectedAsset.jenis_aset === 'Hanggar';
                  const spec = selectedAsset.spesifikasi_detail || {};
                  const airport = selectedAsset.airports;

                  return (
                    <div className="mt-4 border border-[#00a65a] rounded-sm bg-[#f9fffb] overflow-hidden">
                      <div className="bg-[#00a65a] text-white px-3 py-2 text-xs font-bold uppercase tracking-wider">
                        Rincian Objek Sewa
                      </div>
                      <div className="p-4 text-sm text-[#444]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-bold text-[#00a65a] mb-2 border-b border-green-200 pb-1">Data Bandara</h5>
                            <p><strong>Nama:</strong> {airport?.nama_bandara || '-'}</p>
                            <p><strong>Kode:</strong> {airport?.kode_bandara || '-'}</p>
                            <p><strong>Lokasi:</strong> {airport?.lokasi || '-'}</p>
                          </div>
                          <div>
                            <h5 className="font-bold text-[#00a65a] mb-2 border-b border-green-200 pb-1">Data Aset Utama</h5>
                            <p><strong>Nama Aset:</strong> {selectedAsset.nama_aset}</p>
                            {!isHangar && <p><strong>Dimensi:</strong> {selectedAsset.luas} {selectedAsset.satuan}</p>}
                            <p><strong>Kapasitas:</strong> {selectedAsset.kapasitas || '-'}</p>
                          </div>
                        </div>

                        {isHangar && spec && Object.keys(spec).length > 0 && (
                          <div className="mt-4 pt-3 border-t border-green-100">
                            <h5 className="font-bold text-[#00a65a] mb-2">Spesifikasi Detail Hanggar</h5>
                            <div className="grid grid-cols-2 text-xs gap-y-2 gap-x-4 bg-white p-3 border border-green-50 rounded">
                              <div><span className="text-gray-500">Tinggi Bangunan:</span> <br className="hidden sm:block"/> <span className="font-medium">{spec.tinggi_bangunan || '-'}</span></div>
                              <div><span className="text-gray-500">Pintu Hanggar:</span> <br className="hidden sm:block"/> <span className="font-medium">{spec.pintu_hanggar || '-'}</span></div>
                              <div><span className="text-gray-500">Listrik:</span> <br className="hidden sm:block"/> <span className="font-medium">{spec.fasilitas_listrik || '-'}</span></div>
                              <div><span className="text-gray-500">Air:</span> <br className="hidden sm:block"/> <span className="font-medium">{spec.fasilitas_air || '-'}</span></div>
                              <div><span className="text-gray-500">Fire Safety:</span> <br className="hidden sm:block"/> <span className="font-medium">{spec.fire_safety || '-'}</span></div>
                              <div><span className="text-gray-500">Koneksi Apron:</span> <br className="hidden sm:block"/> <span className="font-medium">{spec.apron_connection || '-'}</span></div>
                              <div className="col-span-2"><span className="text-gray-500">Office & Toilet:</span> <br className="hidden sm:block"/> <span className="font-medium">{spec.office || '-'}, {spec.toilet || '-'}</span></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="mb-4">
                <label className="block text-[13px] font-bold text-[#333] mb-2">Periode Rencana Sewa <span className="text-red-500">*</span></label>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="block text-[11px] text-[#777] mb-1">Tanggal Mulai</label>
                    <input required type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc] transition-colors" />
                  </div>
                  <span className="text-[#999] font-medium text-[14px] mb-2">s/d</span>
                  <div className="flex-1">
                    <label className="block text-[11px] text-[#777] mb-1">Tanggal Selesai</label>
                    <input required type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc] transition-colors" />
                  </div>
                  <div className="w-24">
                    <label className="block text-[11px] text-[#777] mb-1 text-center">Durasi</label>
                    {(() => {
                      if (formData.start_date && formData.end_date) {
                        const start = new Date(formData.start_date);
                        const end = new Date(formData.end_date);
                        if (end >= start) {
                          const diffTime = end.getTime() - start.getTime();
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          const nights = diffDays === 0 ? 1 : diffDays;
                          return (
                            <div className="w-full bg-[#f4f4f4] border border-[#d2d6de] px-3 py-2 text-[14px] font-bold text-[#333] text-center h-[38px] flex items-center justify-center">
                              {nights} Malam
                            </div>
                          );
                        }
                      }
                      return (
                        <div className="w-full bg-[#f4f4f4] border border-[#d2d6de] px-3 py-2 text-[14px] font-medium text-[#999] text-center h-[38px] flex items-center justify-center">
                          -
                        </div>
                      );
                    })()}
                  </div>
                </div>
                {formData.start_date && formData.end_date && new Date(formData.end_date) < new Date(formData.start_date) && (
                  <div className="mt-2 text-red-500 text-[11px] font-bold">
                    Tanggal selesai tidak boleh mendahului tanggal mulai.
                  </div>
                )}
              </div>
            </div>

            <div>
              {user?.jenis_tenant === 'Maskapai' && (
              <div>
                <h4 className="font-bold text-[#333] mb-4 pb-2 border-b border-[#f4f4f4]">Rincian Kebutuhan Spesifik (Opsional)</h4>
                
                <div className="mb-4">
                  <label className="block text-[13px] font-bold text-[#333] mb-2">Pilih Armada Pesawat</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto p-1">
                    {fetchingAircrafts ? (
                      <div className="text-sm text-gray-500 col-span-2">Memuat armada pesawat...</div>
                    ) : tenantAircrafts.length === 0 ? (
                      <div className="text-sm text-gray-500 col-span-2">Tidak ada armada pesawat tersedia yang belum terkait kontrak.</div>
                    ) : (
                      tenantAircrafts.map(aircraft => {
                        const isSelected = specificNeeds.aircraft_ids.includes(aircraft.id.toString());
                        return (
                          <label 
                            key={aircraft.id} 
                            className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                              isSelected 
                                ? 'border-[#00a65a] bg-[#00a65a]/10 shadow-sm' 
                                : 'border-gray-200 bg-white hover:border-[#00a65a]/50 hover:bg-gray-50'
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              className="sr-only"
                              checked={isSelected}
                              onChange={(e) => {
                                 if (e.target.checked) {
                                   setSpecificNeeds(prev => ({ ...prev, aircraft_ids: [...prev.aircraft_ids, aircraft.id.toString()] }));
                                 } else {
                                   setSpecificNeeds(prev => ({ ...prev, aircraft_ids: prev.aircraft_ids.filter(id => id !== aircraft.id.toString()) }));
                                 }
                              }}
                            />
                            <div className={`mt-0.5 p-1.5 rounded-md mr-3 flex-shrink-0 ${isSelected ? 'bg-[#00a65a] text-white' : 'bg-gray-100 text-gray-500'}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7l-1.2 3.6c-.1.4 0 .9.4 1.1l7.3 4.2-2.9 2.9-3.7-.7c-.4-.1-.9.2-1.1.6l-.6 1.8c-.1.4.1.8.4 1l4.2 1.4 1.4 4.2c.2.3.6.5 1 .4l1.8-.6c.4-.2.7-.7.6-1.1l-.7-3.7 2.9-2.9 4.2 7.3c.2.4.7.5 1.1.4l3.6-1.2c.5-.2.8-.6.7-1.1z"/></svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`font-bold text-[14px] leading-tight truncate ${isSelected ? 'text-[#00a65a]' : 'text-gray-800'}`}>
                                {aircraft.registration_number}
                              </div>
                              <div className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                                {aircraft.aircraft_types?.jenis_pesawat}
                              </div>
                              <div className="flex items-center gap-2 mt-1.5 text-[10px] font-semibold">
                                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                                  MTOW: {aircraft.mtow || '-'} Kg
                                </span>
                                {aircraft.aircraft_types?.luas_efektif_m2 && (
                                  <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">
                                    Luas: {aircraft.aircraft_types.luas_efektif_m2} m²
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Checkmark icon for selected state */}
                            {isSelected && (
                              <div className="ml-2 text-[#00a65a]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                            )}
                          </label>
                        );
                      })
                    )}
                  </div>
                  {specificNeeds.aircraft_ids.length > 0 && (
                     <div className="mt-2 text-[11px] text-[#00a65a] font-bold bg-[#e8f5e9] p-2 rounded flex justify-between">
                       <span>{specificNeeds.aircraft_ids.length} armada dipilih. Tarif akan diakumulasikan.</span>
                       <span>Luas dibutuhkan: {requiredArea} m²</span>
                     </div>
                  )}
                  {isOverCapacity && (
                    <div className="mt-2 text-[11px] text-red-600 font-bold bg-red-50 border border-red-200 p-2 rounded flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1"/> Kapasitas hanggar tidak mencukupi untuk jumlah pesawat yang dipilih!
                    </div>
                  )}
                </div>
              </div>
              )}

              <div className="mb-4">
                <label className="block text-[13px] font-bold text-[#333] mb-1">Kebutuhan Ruang Pendukung Khusus</label>
                <textarea name="kebutuhan_ruang_pendukung" value={specificNeeds.kebutuhan_ruang_pendukung} onChange={handleNeedsChange} rows={3} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" placeholder="Misal: Membutuhkan apron connection luas, ruang office, atau daya listrik besar..."></textarea>
              </div>

            </div>

          </div>

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-[#f4f4f4]">
            <button type="submit" disabled={loading || isOverCapacity} className={`px-5 py-2 text-[14px] font-bold transition-colors rounded-sm flex items-center shadow-sm disabled:opacity-70 ${isOverCapacity ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#00a65a] text-white hover:bg-[#008d4c]'}`}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Kirim Permohonan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
