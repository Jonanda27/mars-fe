"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { LoginPayload } from '@/types/auth';

export default function LoginPage() {
  const router = useRouter();
  const { loginUser, isLoading, error } = useAuthStore();

  const [formData, setFormData] = useState<LoginPayload>({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginUser(formData);
    
    if (success) {
      const { user } = useAuthStore.getState();
      
      // Routing logic based on roles/verification status
      if (user?.role === 'Tenant') {
        if (user?.status_verifikasi === 'Pending') {
          router.push('/tenant/profil');
        } else {
          router.push('/tenant');
        }
      } else if (user?.role === 'Admin') {
        router.push('/admin');
      } else {
        router.push('/');
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
        <div className="w-full max-w-md bg-white border border-gray-200 shadow-sm p-8 md:p-12">
          
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Login Portal</h1>
            <p className="text-gray-500 font-light">Masuk untuk mengelola operasional Anda.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-600 text-red-800 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Username</label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:outline-none focus:border-[#3c8dbc] focus:bg-white transition-colors rounded-none"
                placeholder="Masukkan username"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:outline-none focus:border-[#3c8dbc] focus:bg-white transition-colors rounded-none"
                placeholder="Masukkan password"
              />
            </div>

            {/* Submit Area */}
            <div className="pt-6 mt-8 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full font-bold py-4 px-8 tracking-widest uppercase text-sm rounded-none transition-colors ${
                  isLoading 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-[#3c8dbc] text-white hover:bg-[#367fa9]'
                }`}
              >
                {isLoading ? 'Memproses...' : 'Masuk Portal'}
              </button>
              
              <div className="text-center mt-6">
                <span className="text-gray-500 text-sm font-light">Belum menjadi mitra? </span>
                <button 
                  type="button" 
                  onClick={() => router.push('/register')} 
                  className="text-[#3c8dbc] font-bold text-sm hover:underline transition-colors ml-1"
                >
                  Daftar Sekarang
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
