"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
  Plane,
  Building2,
  User,
  Lock,
  Mail,
  Phone,
  FileText,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
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

  // 1. Format Validasi Email (Gmail / Korporat)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmailValid = emailRegex.test(formData.email.trim());

  // 2. Format Validasi Password (Min 8 karakter, kombinasi huruf & angka)
  const isPasswordMinLength = formData.password.length >= 8;
  const hasPasswordLetter = /[a-zA-Z]/.test(formData.password);
  const hasPasswordNumber = /[0-9]/.test(formData.password);
  const hasPasswordSpecial = /[^a-zA-Z0-9]/.test(formData.password);
  const isPasswordValid = isPasswordMinLength && hasPasswordLetter && hasPasswordNumber;

  // 3. Format Validasi Nomor Telepon (Diawali 08, panjang 10-13 digit angka)
  const rawPhoneDigits = formData.nomor_telepon.replace(/\D/g, '');
  const isPhoneValid = rawPhoneDigits.startsWith('08') && rawPhoneDigits.length >= 10 && rawPhoneDigits.length <= 13;

  // Formatter Otomatis Nomor Telepon (contoh: 0812-3456-7890)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawDigits = e.target.value.replace(/\D/g, '');
    if (rawDigits.startsWith('628')) {
      rawDigits = '0' + rawDigits.slice(2);
    }
    if (rawDigits.length > 13) rawDigits = rawDigits.slice(0, 13);

    let formatted = rawDigits;
    if (rawDigits.length > 8) {
      formatted = `${rawDigits.slice(0, 4)}-${rawDigits.slice(4, 8)}-${rawDigits.slice(8)}`;
    } else if (rawDigits.length > 4) {
      formatted = `${rawDigits.slice(0, 4)}-${rawDigits.slice(4)}`;
    }

    setFormData(prev => ({ ...prev, nomor_telepon: formatted }));
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

    // Validasi Kelengkapan dan Format Formulir
    if (!formData.username.trim() || formData.username.trim().length < 3) {
      setError('Username minimal harus 3 karakter');
      return;
    }

    if (!formData.email.trim()) {
      setError('Alamat email wajib diisi');
      return;
    }
    if (!isEmailValid) {
      setError('Format email tidak valid. Gunakan format yang benar (contoh: nama@gmail.com)');
      return;
    }

    if (!isPasswordMinLength) {
      setError('Password minimal harus 8 karakter');
      return;
    }
    if (!hasPasswordLetter || !hasPasswordNumber) {
      setError('Password harus mengandung kombinasi huruf dan angka');
      return;
    }
    if (formData.password !== confirmPassword) {
      setError('Ulangi password tidak cocok dengan password yang dimasukkan');
      return;
    }

    if (!formData.nama_perusahaan.trim()) {
      setError('Nama lengkap perusahaan wajib diisi');
      return;
    }
    if (!formData.pic.trim()) {
      setError('Nama penanggung jawab (PIC) wajib diisi');
      return;
    }

    if (!formData.nomor_telepon.trim()) {
      setError('Nomor telepon wajib diisi');
      return;
    }
    if (!isPhoneValid) {
      setError('Nomor telepon tidak valid. Pastikan diawali 08 dengan 10–13 digit angka (contoh: 0812-3456-7890)');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await authService.requestOtp(formData.email.trim());
      setSuccess('Kode OTP verifikasi berhasil dikirimkan ke email Anda.');
      setCountdown(60);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Gagal mengirim OTP ke email');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      setError('Ulangi password tidak cocok dengan password yang dimasukkan');
      setStep(1);
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.otp_code || formData.otp_code.length !== 6) {
        throw new Error('Kode OTP harus berjumlah 6 digit');
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
    <div className="min-h-screen bg-gray-50/60 flex flex-col font-sans">
      
      {/* 1. Header Navbar Sederhana */}
      <header className="bg-white border-b border-gray-200/80 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
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
      </header>

      {/* 2. Container Konten Utama */}
      <main className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-4xl bg-white border border-gray-200/80 shadow-sm p-6 sm:p-10 md:p-12 rounded-2xl">
          
          {/* Judul & Indikator Stepper */}
          <div className="mb-8 text-center max-w-lg mx-auto">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
              Pendaftaran Akun Mitra
            </h1>
            <p className="text-gray-500 text-sm">
              {step === 1 
                ? 'Lengkapi informasi badan usaha untuk bergabung dalam sistem MARS.' 
                : 'Masukkan kode OTP yang telah dikirimkan ke alamat email Anda.'}
            </p>

            {/* Stepper Progres Minimalis */}
            <div className="flex items-center justify-center gap-3 mt-6 pt-2">
              <div className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === 1 
                    ? 'bg-[#3c8dbc] text-white' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {step === 2 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
                </span>
                <span className={`text-xs font-bold tracking-wide uppercase ${
                  step === 1 ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  Data Mitra
                </span>
              </div>

              <div className="w-12 h-0.5 bg-gray-200" />

              <div className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === 2 
                    ? 'bg-[#3c8dbc] text-white' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  2
                </span>
                <span className={`text-xs font-bold tracking-wide uppercase ${
                  step === 2 ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  Verifikasi OTP
                </span>
              </div>
            </div>
          </div>

          {/* Alert Notifikasi Error / Sukses */}
          {error && (
            <div className="mb-6 p-3.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-3.5 bg-green-50 text-green-700 text-xs rounded-xl border border-green-200">
              {success}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-8">
              
              {/* SECTION 1: KREDENSIAL AKUN */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                  <Lock className="w-4 h-4 text-[#3c8dbc]" />
                  <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Informasi Akun
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Username */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3.5 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:bg-white transition-all"
                        placeholder="Username unik"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Alamat Email Resmi <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3.5 py-3 bg-gray-50 border rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                          formData.email
                            ? isEmailValid
                              ? 'border-green-400 focus:ring-green-400'
                              : 'border-amber-300 focus:ring-amber-400'
                            : 'border-gray-300 focus:ring-[#3c8dbc]'
                        }`}
                        placeholder="alamat.email@perusahaan.com"
                      />
                    </div>
                    {formData.email && !isEmailValid && (
                      <p className="text-[11px] text-amber-600 mt-1">
                        Alamat email belum valid
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-11 py-3 bg-gray-50 border rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                          formData.password
                            ? isPasswordValid
                              ? 'border-green-400 focus:ring-green-400'
                              : 'border-amber-300 focus:ring-amber-400'
                            : 'border-gray-300 focus:ring-[#3c8dbc]'
                        }`}
                        placeholder="Min. 8 karakter (huruf & angka)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Format Password Checklist (hanya tampil jika belum valid) */}
                    {formData.password && !isPasswordValid && (
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] mt-2">
                        <span className={`flex items-center gap-1 ${isPasswordMinLength ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                          <CheckCircle2 className={`w-3 h-3 ${isPasswordMinLength ? 'text-green-600' : 'text-gray-300'}`} /> Min. 8 karakter
                        </span>
                        <span className={`flex items-center gap-1 ${hasPasswordLetter && hasPasswordNumber ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                          <CheckCircle2 className={`w-3 h-3 ${hasPasswordLetter && hasPasswordNumber ? 'text-green-600' : 'text-gray-300'}`} /> Huruf & angka
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Retype Password */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Ulangi Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirm_password"
                        required
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (error) setError('');
                        }}
                        className={`w-full pl-10 pr-11 py-3 bg-gray-50 border rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                          confirmPassword && confirmPassword !== formData.password
                            ? 'border-red-300 focus:ring-red-400'
                            : confirmPassword && confirmPassword === formData.password
                            ? 'border-green-400 focus:ring-green-400'
                            : 'border-gray-300 focus:ring-[#3c8dbc]'
                        }`}
                        placeholder="Ketik ulang password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && confirmPassword !== formData.password && (
                      <p className="text-[11px] text-red-500 mt-1">
                        Password tidak cocok
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 2: DATA PERUSAHAAN */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                  <Building2 className="w-4 h-4 text-[#3c8dbc]" />
                  <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Data Perusahaan & Mitra
                  </h2>
                </div>

                {/* Pemilih Tipe Tenant Interaktif dengan Ikon */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Tipe Entitas / Kategori Mitra <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Opsi Maskapai */}
                    <label 
                      className={`relative flex items-center p-3.5 rounded-xl border cursor-pointer transition-all ${
                        formData.jenis_tenant === 'Maskapai'
                          ? 'border-[#3c8dbc] bg-blue-50/40 ring-1 ring-[#3c8dbc]'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="jenis_tenant"
                        value="Maskapai"
                        checked={formData.jenis_tenant === 'Maskapai'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mr-3 transition-colors ${
                        formData.jenis_tenant === 'Maskapai'
                          ? 'bg-[#3c8dbc] text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Plane className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-gray-900">Maskapai Penerbangan</div>
                        <div className="text-[11px] text-gray-500">Armada pesawat niaga, perintis, sewa hanggar & apron</div>
                      </div>
                    </label>

                    {/* Opsi Umum */}
                    <label 
                      className={`relative flex items-center p-3.5 rounded-xl border cursor-pointer transition-all ${
                        formData.jenis_tenant === 'Umum'
                          ? 'border-[#3c8dbc] bg-blue-50/40 ring-1 ring-[#3c8dbc]'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="jenis_tenant"
                        value="Umum"
                        checked={formData.jenis_tenant === 'Umum'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mr-3 transition-colors ${
                        formData.jenis_tenant === 'Umum'
                          ? 'bg-[#3c8dbc] text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-gray-900">Perusahaan Umum</div>
                        <div className="text-[11px] text-gray-500">Kargo, ground handling, tenant gerai/kios, perkantoran</div>
                      </div>
                    </label>

                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nama Perusahaan */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Nama Lengkap Perusahaan / Instansi <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="nama_perusahaan"
                        required
                        value={formData.nama_perusahaan}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3.5 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:bg-white transition-all"
                        placeholder="Contoh: PT. Aviasi Dirgantara Pratama"
                      />
                    </div>
                  </div>

                  {/* Nama PIC */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Nama Penanggung Jawab (PIC) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="pic"
                        required
                        value={formData.pic}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3.5 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:bg-white transition-all"
                        placeholder="Nama lengkap PIC"
                      />
                    </div>
                  </div>

                  {/* Nomor Telepon */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Nomor Telepon Aktif / WA <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="nomor_telepon"
                        required
                        value={formData.nomor_telepon}
                        onChange={handlePhoneChange}
                        className={`w-full pl-10 pr-3.5 py-3 bg-gray-50 border rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                          formData.nomor_telepon
                            ? isPhoneValid
                              ? 'border-green-400 focus:ring-green-400'
                              : 'border-amber-300 focus:ring-amber-400'
                            : 'border-gray-300 focus:ring-[#3c8dbc]'
                        }`}
                        placeholder="0812-3456-7890"
                      />
                    </div>
                    {formData.nomor_telepon && !isPhoneValid && (
                      <p className="text-[11px] text-amber-600 mt-1">
                        Harus diawali 08 (10–13 digit angka)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 3: LEGALITAS & ALAMAT */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                  <FileText className="w-4 h-4 text-[#3c8dbc]" />
                  <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Legalitas & Domisili Kantor
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* NIB */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Nomor Induk Berusaha (NIB) <span className="text-gray-400 font-normal normal-case">(Opsional)</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="nib"
                        value={formData.nib}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3.5 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:bg-white transition-all"
                        placeholder="Nomor NIB perusahaan"
                      />
                    </div>
                  </div>

                  {/* NPWP */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      NPWP Perusahaan <span className="text-gray-400 font-normal normal-case">(Opsional)</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="npwp"
                        value={formData.npwp}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3.5 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:bg-white transition-all"
                        placeholder="Nomor Pokok Wajib Pajak"
                      />
                    </div>
                  </div>

                  {/* Alamat Lengkap */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Alamat Domisili Kantor
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <textarea
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleChange}
                        rows={2}
                        className="w-full pl-10 pr-3.5 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:bg-white transition-all resize-none"
                        placeholder="Alamat kantor perwakilan / operasional perusahaan di Bandara atau Timika..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Area */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mengirim Kode OTP...
                    </>
                  ) : (
                    <>
                      Lanjut ke Verifikasi OTP
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                
                <div className="text-center pt-4 text-sm text-gray-500">
                  <span>Sudah memiliki akun mitra? </span>
                  <Link 
                    href="/login" 
                    className="text-[#3c8dbc] font-bold hover:underline ml-1"
                  >
                    Login di Sini
                  </Link>
                </div>
              </div>

            </form>
          ) : (
            /* STEP 2: VERIFIKASI KODE OTP */
            <form onSubmit={handleRegister} className="space-y-6 max-w-md mx-auto py-2">
              
              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-600 mb-1">Kode OTP 6-digit telah dikirimkan ke email:</p>
                <strong className="text-gray-900 text-sm block font-bold">{formData.email}</strong>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide text-center">
                  Masukkan 6-Digit Kode OTP
                </label>
                <div className="flex justify-center gap-2 sm:gap-3">
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
                      className="w-11 h-13 sm:w-13 sm:h-15 border border-gray-300 bg-gray-50 text-center text-xl sm:text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:bg-white rounded-xl shadow-sm transition-all"
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex flex-col items-center gap-3">
                <button
                  type="submit"
                  disabled={loading || formData.otp_code.length !== 6}
                  className="w-full py-3.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Memverifikasi...
                    </>
                  ) : (
                    'Selesaikan Pendaftaran'
                  )}
                </button>
                
                <div className="flex items-center gap-3 text-xs">
                  <button 
                    type="button" 
                    disabled={loading || countdown > 0}
                    onClick={() => handleRequestOtp()}
                    className={`font-semibold transition-colors flex items-center ${
                      loading || countdown > 0
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-[#3c8dbc] hover:underline cursor-pointer'
                    }`}
                  >
                    {countdown > 0 ? (
                      `Kirim ulang OTP (${countdown}s)`
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 mr-1" />
                        Kirim Ulang OTP
                      </>
                    )}
                  </button>

                  <span className="text-gray-300">|</span>

                  <button 
                    type="button" 
                    onClick={() => { 
                      setStep(1); 
                      setError(''); 
                      setSuccess(''); 
                      setCountdown(0); 
                      setOtpArray(Array(6).fill('')); 
                      setFormData({...formData, otp_code: ''}); 
                    }}
                    className="text-gray-500 hover:text-gray-800 font-semibold transition-colors hover:underline cursor-pointer"
                  >
                    Edit Data Formulir
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>
      </main>

      {/* 3. Footer Sederhana */}
      <footer className="py-6 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Dinas Perhubungan Kabupaten Mimika
      </footer>
    </div>
  );
}

