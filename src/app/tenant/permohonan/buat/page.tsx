"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { rentalService } from '@/services/rentalService';
import { assetService } from '@/services/assetService';
import { airportService } from '@/services/airportService';
import { Asset } from '@/types/asset';
import { Airport } from '@/types/airport';
import { aircraftService } from '@/services/aircraftService';
import { Aircraft } from '@/types/aircraft';
import { FileText, Save, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function BuatPermohonanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingAirports, setFetchingAirports] = useState(true);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [fetchingAssets, setFetchingAssets] = useState(true);
  const [allAvailableAssets, setAllAvailableAssets] = useState<Asset[]>([]);
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [tenantAircrafts, setTenantAircrafts] = useState<Aircraft[]>([]);
  const [fetchingAircrafts, setFetchingAircrafts] = useState(true);
  
  const [selectedAirportId, setSelectedAirportId] = useState('');
  
  const [formData, setFormData] = useState({
    asset_id: '',
    start_date: '',
    end_date: '',
    purpose: '',
  });

  const [specificNeeds, setSpecificNeeds] = useState({
    aircraft_id: '',
    jenis_pesawat: '',
    mtow: '',
    kebutuhan_ruang_pendukung: ''
  });

  useEffect(() => {
    airportService.getAll().then((data: any) => {
      setAirports(data.data || data); // Just in case it returns {data: [...]} or directly the array
      setFetchingAirports(false);
    }).catch((err: any) => {
      console.error(err);
      setFetchingAirports(false);
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
          if (spec && spec.aircraft_id) {
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

  const handleAirportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const airportId = e.target.value;
    setSelectedAirportId(airportId);
    setFormData(prev => ({ ...prev, asset_id: '' })); // reset asset selection

    if (airportId) {
      const filtered = allAvailableAssets.filter(a => a.airport_id?.toString() === airportId);
      setAvailableAssets(filtered);
    } else {
      setAvailableAssets(allAvailableAssets);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNeedsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'aircraft_id') {
      const selectedAircraft = tenantAircrafts.find(a => a.id.toString() === value);
      if (selectedAircraft) {
        setSpecificNeeds(prev => ({
          ...prev,
          aircraft_id: value,
          jenis_pesawat: selectedAircraft.aircraft_type,
          mtow: selectedAircraft.mtow?.toString() || ''
        }));
      } else {
        setSpecificNeeds(prev => ({
          ...prev,
          aircraft_id: '',
          jenis_pesawat: '',
          mtow: ''
        }));
      }
    } else {
      setSpecificNeeds(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
                <label className="block text-[13px] font-bold text-[#333] mb-1">Pilih Bandara <span className="text-red-500">*</span></label>
                <select required value={selectedAirportId} onChange={handleAirportChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-white">
                  <option value="">-- Semua Bandara --</option>
                  {fetchingAirports ? (
                    <option disabled>Memuat daftar bandara...</option>
                  ) : (
                    airports.map(airport => (
                      <option key={airport.id} value={airport.id}>
                        {airport.nama_bandara} ({airport.kode_bandara})
                      </option>
                    ))
                  )}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-[13px] font-bold text-[#333] mb-1">Objek Aset Utama yang Diminati <span className="text-red-500">*</span></label>
                <p className="text-[11px] text-[#777] mb-2">Pilih aset yang statusnya sedang tersedia saat ini. (Penetapan akhir akan diputuskan oleh Admin)</p>
                <select required name="asset_id" value={formData.asset_id} onChange={handleChange} disabled={!selectedAirportId && availableAssets.length > 0} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-white disabled:bg-gray-100 disabled:text-gray-500">
                  <option value="">-- Pilih Aset --</option>
                  {fetchingAssets ? (
                    <option disabled>Memuat daftar aset...</option>
                  ) : (
                    availableAssets.length === 0 && selectedAirportId ? (
                      <option disabled>Tidak ada aset tersedia di bandara ini</option>
                    ) : (
                      availableAssets.map(asset => (
                        <option key={asset.id} value={asset.id}>
                          {asset.kode_aset} - {asset.nama_aset} ({asset.jenis_aset}) - {asset.luas} {asset.satuan}
                        </option>
                      ))
                    )
                  )}
                </select>
                
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
                            <p><strong>Dimensi:</strong> {selectedAsset.luas} {selectedAsset.satuan}</p>
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
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[13px] font-bold text-[#333] mb-1">Tujuan Penggunaan Sewa <span className="text-red-500">*</span></label>
                <textarea required name="purpose" value={formData.purpose} onChange={handleChange} rows={3} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" placeholder="Deskripsikan untuk apa aset tersebut disewa..."></textarea>
              </div>

            </div>

            <div>
              <h4 className="font-bold text-[#333] mb-4 pb-2 border-b border-[#f4f4f4]">Rincian Kebutuhan Spesifik (Opsional)</h4>
              
              <div className="mb-4">
                <label className="block text-[13px] font-bold text-[#333] mb-1">Pilih Armada Pesawat</label>
                <select name="aircraft_id" value={specificNeeds.aircraft_id} onChange={handleNeedsChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-white">
                  <option value="">-- Pilih Pesawat --</option>
                  {fetchingAircrafts ? (
                    <option disabled>Memuat armada pesawat...</option>
                  ) : (
                    tenantAircrafts.map(aircraft => (
                      <option key={aircraft.id} value={aircraft.id}>
                        {aircraft.registration_number} - {aircraft.aircraft_type}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-[13px] font-bold text-[#333] mb-1">Jenis Pesawat</label>
                <input type="text" disabled value={specificNeeds.jenis_pesawat} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] bg-[#f4f4f4] text-[#777] outline-none" placeholder="Otomatis terisi saat memilih armada" />
              </div>

              <div className="mb-4">
                <label className="block text-[13px] font-bold text-[#333] mb-1">Estimasi MTOW (Max Take-Off Weight)</label>
                <div className="flex">
                  <input type="text" disabled value={specificNeeds.mtow} className="w-full border border-[#d2d6de] border-r-0 px-3 py-2 text-[14px] bg-[#f4f4f4] text-[#777] outline-none" placeholder="Otomatis terisi" />
                  <span className="bg-[#f4f4f4] border border-[#d2d6de] px-3 flex items-center text-[#777] font-bold">Kg</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[13px] font-bold text-[#333] mb-1">Kebutuhan Ruang Pendukung Khusus</label>
                <textarea name="kebutuhan_ruang_pendukung" value={specificNeeds.kebutuhan_ruang_pendukung} onChange={handleNeedsChange} rows={3} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" placeholder="Misal: Membutuhkan apron connection luas, ruang office, atau daya listrik besar..."></textarea>
              </div>

            </div>

          </div>

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-[#f4f4f4]">
            <button type="submit" disabled={loading} className="bg-[#00a65a] text-white px-5 py-2 text-[14px] font-bold hover:bg-[#008d4c] transition-colors rounded-sm flex items-center shadow-sm disabled:opacity-70">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Kirim Permohonan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
