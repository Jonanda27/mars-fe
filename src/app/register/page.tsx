"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { RegisterTenantPayload } from '@/types/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { registerTenant, isLoading, error, registerSuccess, resetState } = useAuthStore();

  const [formData, setFormData] = useState<RegisterTenantPayload>({
    username: '',
    password: '',
    nama_perusahaan: '',
    pic: '',
    nomor_telepon: '',
    email: '',
    nib: '',
    npwp: '',
    alamat: ''
  });

  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (localError) setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.password || formData.password.length < 6) {
      setLocalError('Password minimal 6 karakter');
      return;
    }
    
    await registerTenant(formData);
    const state = useAuthStore.getState();
    if (state.registerSuccess) {
      // Auto login
      const loggedIn = await state.loginUser({ username: formData.username, password: formData.password });
      if (loggedIn) {
        router.push('/tenant/profil');
      } else {
        alert('Pendaftaran berhasil. Silakan login.');
        router.push('/login');
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#3c8dbc] flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-gray-900">MARS</span>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="text-sm font-bold text-gray-500 hover:text-[#3c8dbc] uppercase tracking-widest transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="w-full max-w-4xl bg-white border border-gray-200 shadow-sm p-8 md:p-12">
          
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Registrasi Mitra (Tenant)</h1>
            <p className="text-gray-500 font-light">Lengkapi informasi di bawah ini untuk bergabung dalam ekosistem operasional MARS.</p>
          </div>

          {(error || localError) && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-600 text-red-800 text-sm font-medium">
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Section 1: Informasi Akun */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 bg-gray-100 text-[#3c8dbc] font-bold flex items-center justify-center shrink-0">1</div>
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Informasi Kredensial</h2>
                <div className="h-px bg-gray-200 flex-1 ml-2"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Username <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:outline-none focus:border-[#3c8dbc] focus:bg-white transition-colors rounded-none"
                    placeholder="Masukkan username unik"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Password <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:outline-none focus:border-[#3c8dbc] focus:bg-white transition-colors rounded-none"
                    placeholder="Minimal 6 karakter"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Alamat Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:outline-none focus:border-[#3c8dbc] focus:bg-white transition-colors rounded-none"
                    placeholder="email@perusahaan.com"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Data Perusahaan */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 bg-gray-100 text-[#3c8dbc] font-bold flex items-center justify-center shrink-0">2</div>
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Data Perusahaan</h2>
                <div className="h-px bg-gray-200 flex-1 ml-2"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Nama Perusahaan / Institusi <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="nama_perusahaan"
                    required
                    value={formData.nama_perusahaan}
                    onChange={handleChange}
                    className="w-full border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:outline-none focus:border-[#3c8dbc] focus:bg-white transition-colors rounded-none"
                    placeholder="Contoh: PT. Dirgantara Aviasi"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Nama Penanggung Jawab (PIC) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="pic"
                    required
                    value={formData.pic}
                    onChange={handleChange}
                    className="w-full border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:outline-none focus:border-[#3c8dbc] focus:bg-white transition-colors rounded-none"
                    placeholder="Nama lengkap PIC"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Nomor Telepon Aktif <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    name="nomor_telepon"
                    required
                    value={formData.nomor_telepon}
                    onChange={handleChange}
                    className="w-full border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:outline-none focus:border-[#3c8dbc] focus:bg-white transition-colors rounded-none"
                    placeholder="0812-XXXX-XXXX"
                  />
                </div>
              </div>
            </section>

            {/* Section 3: Legalitas & Alamat */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 bg-gray-100 text-[#3c8dbc] font-bold flex items-center justify-center shrink-0">3</div>
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Legalitas & Alamat</h2>
                <div className="h-px bg-gray-200 flex-1 ml-2"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Nomor Induk Berusaha (NIB) <span className="text-gray-400 font-normal normal-case">(Opsional)</span></label>
                  <input
                    type="text"
                    name="nib"
                    value={formData.nib}
                    onChange={handleChange}
                    className="w-full border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:outline-none focus:border-[#3c8dbc] focus:bg-white transition-colors rounded-none"
                    placeholder="Nomor NIB"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">NPWP Perusahaan <span className="text-gray-400 font-normal normal-case">(Opsional)</span></label>
                  <input
                    type="text"
                    name="npwp"
                    value={formData.npwp}
                    onChange={handleChange}
                    className="w-full border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:outline-none focus:border-[#3c8dbc] focus:bg-white transition-colors rounded-none"
                    placeholder="Nomor Pokok Wajib Pajak"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Alamat Lengkap Kantor</label>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:outline-none focus:border-[#3c8dbc] focus:bg-white transition-colors rounded-none resize-none"
                    placeholder="Alamat domisili operasional perusahaan..."
                  />
                </div>
              </div>
            </section>

            {/* Submit Area */}
            <div className="pt-6 mt-10 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full font-bold py-4 px-8 tracking-widest uppercase text-sm rounded-none transition-colors ${
                  isLoading 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-[#3c8dbc] text-white hover:bg-[#367fa9]'
                }`}
              >
                {isLoading ? 'Memproses Data...' : 'Kirim Pendaftaran'}
              </button>
              
              <div className="text-center mt-6">
                <span className="text-gray-500 text-sm font-light">Sudah memiliki akun mitra? </span>
                <button 
                  type="button" 
                  onClick={() => router.push('/login')} 
                  className="text-[#3c8dbc] font-bold text-sm hover:underline transition-colors ml-1 uppercase tracking-wider"
                >
                  Login
                </button>
              </div>
            </div>

          </form>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-6 text-center text-sm text-gray-400">
        &copy; 2026 Dinas Perhubungan Kabupaten Mimika
      </footer>
    </div>
  );
}
