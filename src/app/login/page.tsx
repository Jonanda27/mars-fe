"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { LoginPayload } from '@/types/auth';
import { Eye, EyeOff } from 'lucide-react';
import { isTenantRole, isAdminRole, isEksekutifRole, isPetugasRole } from '@/utils/routeGuard';

export default function LoginPage() {
  const router = useRouter();
  const { loginUser, isLoading, error } = useAuthStore();

  const [formData, setFormData] = useState<LoginPayload>({
    username: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginUser(formData);
    
    if (success) {
      const { user } = useAuthStore.getState();
      const role = user?.role;
      
      if (isTenantRole(role)) {
        if (user?.status_verifikasi === 'Pending') {
          router.push('/tenant/profil');
        } else {
          router.push('/tenant');
        }
      } else if (isAdminRole(role)) {
        router.push('/admin');
      } else if (isEksekutifRole(role)) {
        router.push('/eksekutif');
      } else if (isPetugasRole(role)) {
        router.push('/petugas');
      } else {
        router.push('/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      
      {/* 1. SISI KIRI (FOTO TERMINAL BANDARA - BERSIH & ESTETIK) */}
      <div className="relative hidden lg:block lg:w-1/2 xl:w-7/12 bg-slate-900 select-none overflow-hidden">
        <img
          src="/images/bandara/mozes-kilangin-terminal.jpg"
          alt="Bandara Mozes Kilangin Terminal"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-10 left-10 right-10 text-white z-10">
          <h2 className="text-2xl xl:text-3xl font-bold tracking-tight">Bandara Mozes Kilangin</h2>
          <p className="text-white/80 text-sm mt-1">UPBU Mozes Kilangin • Dinas Perhubungan Kabupaten Mimika</p>
        </div>
      </div>

      {/* 2. SISI KANAN (FORMULIR LOGIN SIMPEL) */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 xl:p-12 bg-white min-h-screen lg:min-h-0">
        
        {/* Header: Logo & Navigasi Kembali */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <Link href="/" className="flex items-center shrink-0">
            <img
              src="/images/mars-logo.png"
              alt="MARS - Mimika Airport Revenue System"
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </Link>

          <Link
            href="/"
            className="text-xs font-bold text-gray-500 hover:text-[#3c8dbc] uppercase tracking-wider transition-colors"
          >
            Beranda
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-sm mx-auto my-auto py-8">
          
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
              Login Portal
            </h1>
            <p className="text-gray-500 text-sm">
              Masukkan username dan password Anda.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                Username
              </label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3.5 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:bg-white transition-all"
                placeholder="Masukkan username"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3.5 py-3 pr-11 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:bg-white transition-all"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Tombol Masuk */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Memverifikasi...' : 'Masuk Portal'}
              </button>
            </div>

            {/* Tautan Daftar */}
            <div className="text-center pt-3 text-sm text-gray-500">
              <span>Belum memiliki akun mitra? </span>
              <Link 
                href="/register" 
                className="text-[#3c8dbc] font-bold hover:underline ml-1"
              >
                Daftar Sekarang
              </Link>
            </div>

          </form>

        </div>

        {/* Footer */}
        <div className="pt-4 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Dinas Perhubungan Kabupaten Mimika
        </div>

      </div>

    </div>
  );
}
