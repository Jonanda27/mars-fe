"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plane, LogIn, LogOut, Search, Clock, 
  MapPin, CheckCircle2, AlertCircle, Camera, Loader2, X
} from 'lucide-react';
import api from '@/services/api';
import dayjs from 'dayjs';

export default function PetugasDashboardPage() {
  const [activeLogs, setActiveLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // For Check-In
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<string>('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [parkingLocation, setParkingLocation] = useState('Hanggar');
  const [evidencePhoto, setEvidencePhoto] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // For Check-Out
  const [isCheckingOut, setIsCheckingOut] = useState<number | null>(null);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [checkOutLogId, setCheckOutLogId] = useState<number | null>(null);
  const [checkOutRegistration, setCheckOutRegistration] = useState('');
  const [checkOutNotes, setCheckOutNotes] = useState('');

  useEffect(() => {
    fetchActiveLogs();
    fetchActiveApplications();
  }, []);

  const fetchActiveLogs = async () => {
    try {
      const res = await api.get('/logs/active');
      setActiveLogs(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActiveApplications = async () => {
    try {
      const res = await api.get('/rentals/approved');
      setApplications(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplication || !registrationNumber || !evidencePhoto) {
      alert('Mohon lengkapi semua data dan foto bukti');
      return;
    }

    const app = applications.find(a => a.id.toString() === selectedApplication);

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('application_id', selectedApplication);
      if (app.contract_id) {
        formData.append('contract_id', app.contract_id.toString());
      }
      formData.append('registration_number', registrationNumber.toUpperCase());
      formData.append('tenant_id', app.tenant_id.toString());
      if (app.asset_id) {
        formData.append('asset_id', app.asset_id.toString());
      }
      formData.append('parking_location', parkingLocation);
      if (notes) {
        formData.append('notes', notes);
      }
      formData.append('entry_time', new Date().toISOString());
      formData.append('log_evidence', evidencePhoto);

      await api.post('/logs/entry', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Check-In Pesawat Berhasil!');
      setShowCheckInModal(false);
      setRegistrationNumber('');
      setEvidencePhoto(null);
      setNotes('');
      setShowCheckInModal(false);
      fetchActiveLogs();
    } catch (error) {
      console.error(error);
      alert('Gagal check-in pesawat');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCheckOutModal = (id: number, regNumber: string) => {
    setCheckOutLogId(id);
    setCheckOutRegistration(regNumber);
    setCheckOutNotes('');
    setShowCheckOutModal(true);
  };

  const submitCheckOut = async () => {
    if (!checkOutLogId) return;
    
    if (!confirm(`Konfirmasi check-out untuk pesawat ${checkOutRegistration}?`)) return;

    try {
      setIsCheckingOut(checkOutLogId);
      await api.put(`/logs/check-out/${checkOutLogId}`, {
        exit_time: new Date().toISOString(),
        notes: checkOutNotes
      });
      fetchActiveLogs();
      setShowCheckOutModal(false);
    } catch (error) {
      console.error(error);
      alert('Gagal melakukan check-out');
    } finally {
      setIsCheckingOut(null);
      setCheckOutLogId(null);
    }
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4 pb-20">
      <header className="bg-[#3c8dbc] -mx-4 -mt-4 p-6 text-white shadow-md">
        <h1 className="text-2xl font-bold">Warden Dashboard</h1>
        <p className="text-blue-100 mt-1">Manajemen Pengawasan Hanggar</p>
      </header>

      {/* Stats/Action Cards */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-[#00a65a] flex flex-col items-center text-center justify-center">
          <h3 className="text-3xl font-bold text-[#333]">{activeLogs.length}</h3>
          <p className="text-gray-500 text-sm mt-1">Pesawat di Hanggar</p>
        </div>
        <button 
          onClick={() => setShowCheckInModal(true)}
          className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white p-4 rounded-lg shadow flex flex-col items-center justify-center transition-colors"
        >
          <LogIn className="w-8 h-8 mb-2" />
          <span className="font-bold">Check-In Pesawat</span>
        </button>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-bold text-gray-700 mb-3 flex items-center">
          <Plane className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Sedang Parkir
        </h2>

        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#3c8dbc] w-8 h-8" /></div>
        ) : activeLogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p>Tidak ada pesawat di hanggar saat ini</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeLogs.map((log) => (
              <div key={log.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{log.registration_number}</h3>
                    <p className="text-sm text-gray-500">{log.tenants?.nama_perusahaan}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">IN USE</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded">
                  <div>
                    <span className="block text-xs text-gray-400 uppercase">Waktu Masuk</span>
                    <span className="font-medium flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> {dayjs(log.entry_time).format('DD MMM, HH:mm')}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 uppercase">Batas Sewa (Booking)</span>
                    <span className="font-medium text-orange-600">
                      {log.rental_applications?.end_date ? dayjs(log.rental_applications.end_date).format('DD MMM YYYY') : '-'}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => openCheckOutModal(log.id, log.registration_number)}
                  disabled={isCheckingOut === log.id}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center disabled:opacity-70 transition-colors"
                >
                  {isCheckingOut === log.id ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <LogOut className="w-5 h-5 mr-2" />
                  )}
                  Tarik Keluar (Check-Out)
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Check-In Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all">
            <div className="p-5 bg-[#3c8dbc] text-white flex justify-between items-center flex-shrink-0 border-b border-[#367fa9]">
              <h2 className="font-bold text-xl flex items-center tracking-wide">
                <LogIn className="w-6 h-6 mr-3" /> Check-In Pesawat Baru
              </h2>
              <button onClick={() => setShowCheckInModal(false)} className="text-blue-100 hover:text-white bg-[#367fa9] hover:bg-[#286090] p-1.5 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
              <form id="checkin-form" onSubmit={handleCheckIn} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Surat Permohonan Sewa (Booking)</label>
                    <select 
                      required
                      value={selectedApplication}
                      onChange={(e) => {
                        const appId = e.target.value;
                        setSelectedApplication(appId);
                        
                        // Auto-fill Registration Number if available
                        const app = applications.find(a => a.id.toString() === appId);
                        if (app?.specific_needs?.aircraft_details && Array.isArray(app.specific_needs.aircraft_details)) {
                          const firstAircraft = app.specific_needs.aircraft_details[0];
                          if (firstAircraft?.registration_number) {
                            setRegistrationNumber(firstAircraft.registration_number);
                            return;
                          }
                        }
                        // Reset if no aircraft detail is found, so user can type manually
                        setRegistrationNumber('');
                      }}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 border text-base"
                    >
                      <option value="">-- Pilih Permohonan Aktif --</option>
                      {applications.map(app => (
                        <option key={app.id} value={app.id}>
                          {app.application_number} - {app.tenants?.nama_perusahaan}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Registrasi Pesawat (Tail Number)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: PK-GIA"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 border uppercase text-base"
                    />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Lokasi Parkir Fisik</label>
                  <div className="flex gap-4">
                    <label className={`flex items-center justify-center gap-3 cursor-pointer px-5 py-4 rounded-xl flex-1 transition-all border-2
                      ${parkingLocation === 'Hanggar' ? 'border-[#3c8dbc] bg-blue-50 text-[#3c8dbc]' : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    >
                      <input 
                        type="radio" 
                        name="parking_location" 
                        value="Hanggar"
                        checked={parkingLocation === 'Hanggar'}
                        onChange={(e) => setParkingLocation(e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="font-bold text-base">Dalam Hanggar</span>
                    </label>
                    <label className={`flex items-center justify-center gap-3 cursor-pointer px-5 py-4 rounded-xl flex-1 transition-all border-2
                      ${parkingLocation === 'Apron' ? 'border-[#3c8dbc] bg-blue-50 text-[#3c8dbc]' : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    >
                      <input 
                        type="radio" 
                        name="parking_location" 
                        value="Apron"
                        checked={parkingLocation === 'Apron'}
                        onChange={(e) => setParkingLocation(e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="font-bold text-base">Luar Hanggar (Apron)</span>
                    </label>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Foto Bukti Kedatangan (Kamera/Galeri)</label>
                  <div className="mt-1 flex justify-center px-6 pt-6 pb-8 border-2 border-gray-300 border-dashed rounded-xl relative overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors">
                    {evidencePhoto ? (
                      <div className="text-center w-full">
                        <img 
                          src={URL.createObjectURL(evidencePhoto)} 
                          alt="Preview" 
                          className="mx-auto h-48 w-full max-w-sm object-cover mb-3 rounded-lg shadow-sm border border-gray-200"
                        />
                        <button 
                          type="button" 
                          onClick={() => setEvidencePhoto(null)}
                          className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 transition-colors text-sm"
                        >
                          <X className="w-4 h-4 mr-1" /> Hapus Foto
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 text-center w-full">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-500">
                          <Camera className="h-8 w-8" />
                        </div>
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label className="relative cursor-pointer bg-white rounded-lg font-bold text-[#3c8dbc] hover:text-[#286090] border border-[#3c8dbc] px-4 py-2 hover:bg-blue-50 transition-colors shadow-sm">
                            <span>Ambil/Pilih Foto</span>
                            <input 
                              type="file" 
                              className="sr-only" 
                              accept="image/*"
                              capture="environment"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setEvidencePhoto(e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">Format: JPG/PNG. Wajib untuk bukti lapangan.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Catatan Petugas (Opsional)</label>
                  <textarea 
                    rows={2}
                    placeholder="Contoh: Pesawat masuk telat karena cuaca, dsb."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 border text-base"
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 flex items-start mt-4">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p>Waktu Check-In akan otomatis tercatat berdasarkan waktu sistem saat ini ({dayjs().format('HH:mm')}).</p>
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3 flex-shrink-0">
              <button 
                type="button"
                onClick={() => setShowCheckInModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 font-bold hover:bg-gray-100"
              >
                Batal
              </button>
              <button 
                type="submit"
                form="checkin-form"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded font-bold shadow flex justify-center items-center disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan & Masuk'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Check-Out Confirmation Modal */}
      {showCheckOutModal && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <h3 className="font-bold text-lg text-gray-800">Konfirmasi Check-Out</h3>
              <button onClick={() => setShowCheckOutModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 text-sm text-gray-600">
              <p className="mb-4">
                Apakah Anda yakin ingin melakukan check-out untuk pesawat <strong className="text-gray-900">{checkOutRegistration}</strong>?
              </p>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Catatan Check-Out (Opsional)</label>
                <textarea 
                  rows={3}
                  placeholder="Contoh: Pesawat diperpanjang 1 malam, atau keterangan lainnya."
                  value={checkOutNotes}
                  onChange={(e) => setCheckOutNotes(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>

              <div className="bg-orange-50 p-3 rounded text-sm text-orange-800 flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <p>Pesawat yang di-check-out akan dihapus dari daftar aktif ini dan perhitungan tagihan akan segera diproses.</p>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3 flex-shrink-0">
              <button 
                type="button"
                onClick={() => setShowCheckOutModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 font-bold hover:bg-gray-100"
              >
                Batal
              </button>
              <button 
                type="button"
                onClick={submitCheckOut}
                disabled={isCheckingOut !== null}
                className="flex-1 px-4 py-2 bg-[#ff851b] hover:bg-[#e08e0b] text-white rounded font-bold shadow flex justify-center items-center disabled:opacity-70"
              >
                {isCheckingOut !== null ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Check-Out Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
