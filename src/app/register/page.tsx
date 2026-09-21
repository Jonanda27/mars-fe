"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, RefreshCw } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';

export default function RegisterPage() {
  const router = useRouter();
  const { loginUser } = useAuthStore();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpArray, setOtpArray] = useState<string[]>(Array(6).fill(''));

  const [formData, setFormData] = useState({
    nama_perusahaan: '',
    jenis_tenant: 'Maskapai',
    nib: '',
    npwp: '',
    alamat: '',
    pic: '',
    nomor_telepon: '',
    email: '',
    username: '',
    password: '',
    otp_code: ''
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && step === 2) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown, step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otpArray];
    newOtp[index] = digit;
    setOtpArray(newOtp);
    setFormData({ ...formData, otp_code: newOtp.join('') });
    
    if (digit && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6).split('');
    const newOtp = [...otpArray];
    pastedData.forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtpArray(newOtp);
    setFormData({ ...formData, otp_code: newOtp.join('') });
    
    const nextIndex = Math.min(pastedData.length, 5);
    const nextInput = document.getElementById(`otp-${nextIndex === 6 ? 5 : nextIndex}`);
    if (nextInput) nextInput.focus();
  };

  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await authService.requestOtp(formData.email);
      setSuccess('Kode OTP telah dikirim ke email Anda.');
      setCountdown(60);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Gagal mengirim OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.otp_code || formData.otp_code.length !== 6) {
        throw new Error('Kode OTP harus 6 digit');
      }

      await authService.register(formData);
      setSuccess('Pendaftaran berhasil! Mengalihkan ke halaman profil...');
      
      const loggedIn = await loginUser({ username: formData.username, password: formData.password });
      if (loggedIn) {
        router.push('/tenant/profil');
      } else {
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Pendaftaran gagal');
    } finally {
      setLoading(false);
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
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Pendaftaran Akun</h1>
            <p className="text-gray-500 font-light">
              {step === 1 ? 'Lengkapi informasi di bawah ini untuk bergabung dalam ekosistem operasional MARS.' : 'Masukkan kode OTP yang telah dikirimkan ke email Anda.'}
            </p>
          </div>

          {(error || success) && (
            <div className={`mb-8 p-4 border-l-4 text-sm font-medium ${error ? 'bg-red-50 border-red-600 text-red-800' : 'bg-green-50 border-green-600 text-green-800'}`}>
              {error || success}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-12">
              
              {/* Section 1: Informasi Kredensial */}
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
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 bg-gray-50 p-3 pr-10 text-gray-900 focus:outline-none focus:border-[#3c8dbc] focus:bg-white transition-colors rounded-none"
                        placeholder="Minimal 6 karakter"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#3c8dbc] transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
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
                    <p className="text-[10px] text-gray-500 mt-1">*OTP verifikasi akan dikirim ke email ini</p>
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
                    <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">Tipe Perusahaan / Entitas <span className="text-red-500">*</span></label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className={`flex-1 border p-4 cursor-pointer transition-all ${formData.jenis_tenant === 'Maskapai' ? 'border-[#3c8dbc] bg-[#f0f7fb]' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                        <div className="flex items-center">
                          <input type="radio" name="jenis_tenant" value="Maskapai" checked={formData.jenis_tenant === 'Maskapai'} onChange={handleChange} className="w-4 h-4 text-[#3c8dbc] focus:ring-[#3c8dbc]" />
                          <span className="ml-3 font-bold text-gray-900">Maskapai Penerbangan</span>
                        </div>
                        <p className="mt-1 ml-7 text-xs text-gray-500">Memiliki armada pesawat, menyewa hanggar/apron, wajib melampirkan AOC.</p>
                      </label>
                      
                      <label className={`flex-1 border p-4 cursor-pointer transition-all ${formData.jenis_tenant === 'Umum' ? 'border-[#3c8dbc] bg-[#f0f7fb]' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                        <div className="flex items-center">
                          <input type="radio" name="jenis_tenant" value="Umum" checked={formData.jenis_tenant === 'Umum'} onChange={handleChange} className="w-4 h-4 text-[#3c8dbc] focus:ring-[#3c8dbc]" />
                          <span className="ml-3 font-bold text-gray-900">Perusahaan Umum (Non-Maskapai)</span>
                        </div>
                        <p className="mt-1 ml-7 text-xs text-gray-500">Kargo, Ground Handling, Tenant Kios, dll. Menyewa Gudang/Lahan/Kantor.</p>
                      </label>
                    </div>
                  </div>

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
                  disabled={loading}
                  className={`w-full font-bold py-4 px-8 tracking-widest uppercase text-sm rounded-none transition-colors flex items-center justify-center ${
                    loading 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-[#3c8dbc] text-white hover:bg-[#367fa9]'
                  }`}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Kirim OTP Verifikasi'}
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
          ) : (
            <form onSubmit={handleRegister} className="space-y-8">
              <div className="bg-blue-50 border border-blue-100 p-6 text-center">
                <p className="text-gray-700 mb-2">Kami telah mengirimkan 6-digit kode OTP ke alamat email:</p>
                <strong className="text-gray-900 text-lg block mb-4">{formData.email}</strong>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-4 uppercase tracking-wide text-center">Masukkan 6-Digit Kode OTP</label>
                <div className="flex justify-center gap-2 sm:gap-4 mb-6">
                  {otpArray.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="w-12 h-14 sm:w-16 sm:h-16 border-2 border-gray-200 bg-gray-50 text-center text-2xl sm:text-3xl font-bold text-gray-900 focus:outline-none focus:border-[#3c8dbc] focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all rounded-lg shadow-sm"
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-8 border-t border-gray-100 flex flex-col items-center gap-4">
                <button
                  type="submit"
                  disabled={loading || formData.otp_code.length !== 6}
                  className={`w-full max-w-sm font-bold py-4 px-8 tracking-widest uppercase text-sm rounded-lg shadow-md transition-all flex items-center justify-center ${
                    loading || formData.otp_code.length !== 6
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                    : 'bg-[#3c8dbc] text-white hover:bg-[#367fa9] hover:shadow-lg'
                  }`}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Selesaikan Pendaftaran'}
                </button>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                  <button 
                    type="button" 
                    disabled={loading || countdown > 0}
                    onClick={() => handleRequestOtp()}
                    className={`font-semibold text-sm transition-colors flex items-center ${
                      loading || countdown > 0
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-[#3c8dbc] hover:text-[#2a6486] hover:underline'
                    }`}
                  >
                    {countdown > 0 ? `Kirim ulang OTP dalam ${countdown} detik` : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-1.5" />
                        Kirim Ulang OTP
                      </>
                    )}
                  </button>

                  <span className="hidden sm:inline text-gray-300">|</span>

                  <button 
                    type="button" 
                    onClick={() => { setStep(1); setError(''); setSuccess(''); setCountdown(0); setOtpArray(Array(6).fill('')); setFormData({...formData, otp_code: ''}); }}
                    className="text-gray-500 hover:text-gray-700 font-semibold text-sm transition-colors hover:underline"
                  >
                    Kembali Edit Data
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-6 text-center text-sm text-gray-400">
        &copy; 2026 Dinas Perhubungan Kabupaten Mimika
      </footer>
    </div>
  );
}
