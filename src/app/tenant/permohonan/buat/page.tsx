"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { rentalService } from '@/services/rentalService';
import { assetService } from '@/services/assetService';
import { Asset } from '@/types/asset';
import { aircraftService } from '@/services/aircraftService';
import { Aircraft } from '@/types/aircraft';
import { FileText, Save, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function BuatPermohonanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingAssets, setFetchingAssets] = useState(true);
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [tenantAircrafts, setTenantAircrafts] = useState<Aircraft[]>([]);
  const [fetchingAircrafts, setFetchingAircrafts] = useState(true);
  
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
    // Ambil daftar aset yang Available
    assetService.getAssets().then(data => {
      const available = data.filter(a => a.status === 'Available' || a.status === 'Tersedia');
      setAvailableAssets(available);
      setFetchingAssets(false);
    }).catch(err => {
      console.error(err);
      setFetchingAssets(false);
    });

    aircraftService.getTenantAircrafts().then(data => {
      setTenantAircrafts(data);
      setFetchingAircrafts(false);
    }).catch(err => {
      console.error(err);
      setFetchingAircrafts(false);
    });
  }, []);

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
                <label className="block text-[13px] font-bold text-[#333] mb-1">Objek Aset Utama yang Diminati <span className="text-red-500">*</span></label>
                <p className="text-[11px] text-[#777] mb-2">Pilih aset yang statusnya sedang tersedia saat ini. (Penetapan akhir akan diputuskan oleh Admin)</p>
                <select required name="asset_id" value={formData.asset_id} onChange={handleChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-white">
                  <option value="">-- Pilih Aset --</option>
                  {fetchingAssets ? (
                    <option disabled>Memuat daftar aset...</option>
                  ) : (
                    availableAssets.map(asset => (
                      <option key={asset.id} value={asset.id}>
                        {asset.kode_aset} - {asset.nama_aset} ({asset.jenis_aset}) - {asset.luas} {asset.satuan}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Rencana Tanggal Mulai <span className="text-red-500">*</span></label>
                  <input required type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Rencana Tanggal Selesai <span className="text-red-500">*</span></label>
                  <input required type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" />
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
