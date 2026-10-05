"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  X,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
  Mail,
  Maximize2,
  Minimize2,
  Bot,
  Sparkles
} from 'lucide-react';
import api from '@/services/api';
import { ChatMessage } from './types';

export default function ChatWidget() {
  // State Live Chat Floating Assistant
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isOfficerHovered, setIsOfficerHovered] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Halo! Saya M Naufal, asisten resmi MARS Bandara Mozes Kilangin Timika 😊 Silakan masukkan Nama Lengkap dan Alamat Email/Gmail Anda di bawah ini untuk menerima kode verifikasi OTP sebelum memulai tanya jawab.',
      time: 'Baru saja'
    }
  ]);
  const [isChatMaximized, setIsChatMaximized] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // State Verifikasi OTP Email Sebelum Akses Chat
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedName, setVerifiedName] = useState('');
  const [otpStep, setOtpStep] = useState<'form' | 'otp'>('form');
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [otpBoxes, setOtpBoxes] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Timer hitung mundur untuk kirim ulang OTP (3 menit = 180 detik)
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const formatCooldown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Auto focus kotak OTP pertama saat berpindah ke step OTP
  useEffect(() => {
    if (otpStep === 'otp') {
      const timer = setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [otpStep]);

  const handleOtpBoxChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    const newBoxes = [...otpBoxes];

    if (!clean) {
      newBoxes[index] = '';
      setOtpBoxes(newBoxes);
      return;
    }

    if (clean.length > 1) {
      // Paste / multiple digits
      const digits = clean.slice(0, 6).split('');
      digits.forEach((d, i) => {
        if (index + i < 6) newBoxes[index + i] = d;
      });
      setOtpBoxes(newBoxes);
      const nextIdx = Math.min(index + digits.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
    } else {
      newBoxes[index] = clean;
      setOtpBoxes(newBoxes);
      if (index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
    if (otpError) setOtpError('');
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpBoxes[index] && index > 0) {
        const newBoxes = [...otpBoxes];
        newBoxes[index - 1] = '';
        setOtpBoxes(newBoxes);
        otpInputRefs.current[index - 1]?.focus();
      } else {
        const newBoxes = [...otpBoxes];
        newBoxes[index] = '';
        setOtpBoxes(newBoxes);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pasted) return;
    const newBoxes = [...otpBoxes];
    pasted.split('').forEach((d, i) => {
      if (i < 6) newBoxes[i] = d;
    });
    setOtpBoxes(newBoxes);
    if (otpError) setOtpError('');
    const focusIdx = Math.min(pasted.length, 5);
    otpInputRefs.current[focusIdx]?.focus();
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputName.trim()) {
      setOtpError('Nama lengkap wajib diisi.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inputEmail.trim() || !emailRegex.test(inputEmail.trim())) {
      setOtpError('Format email tidak valid (contoh: nama@gmail.com).');
      return;
    }

    setOtpError('');
    setIsSubmittingOtp(true);

    try {
      const res = await api.post('/chat/send-otp', {
        name: inputName.trim(),
        email: inputEmail.trim().toLowerCase()
      });

      if (res.data?.success) {
        setOtpStep('otp');
        setOtpBoxes(['', '', '', '', '', '']);
        setResendCooldown(180); // 3 menit hitung mundur kirim ulang
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `Halo ${inputName.trim()}! Kode verifikasi OTP telah dikirimkan ke email ${inputEmail.trim().toLowerCase()}. Kode ini berlaku selama 3 menit. Silakan periksa inbox atau folder spam Gmail Anda, lalu masukkan 6 digit kodenya di bawah ini.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        setOtpError(res.data?.message || 'Gagal mengirim email OTP.');
      }
    } catch (err: any) {
      console.error('Send OTP error:', err);
      setOtpError(err?.response?.data?.message || 'Terjadi kendala jaringan saat mengirim OTP ke Gmail.');
    } finally {
      setIsSubmittingOtp(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const otpCode = otpBoxes.join('');
    if (otpCode.length !== 6) {
      setOtpError('Masukkan 6 digit kode OTP secara lengkap.');
      return;
    }

    setOtpError('');
    setIsSubmittingOtp(true);

    try {
      const res = await api.post('/chat/verify-otp', {
        email: inputEmail.trim().toLowerCase(),
        otp: otpCode
      });

      if (res.data?.success && res.data?.verified) {
        setIsVerified(true);
        const nameToUse = res.data?.name || inputName.trim();
        setVerifiedName(nameToUse);
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `Terima kasih Bapak/Ibu ${nameToUse}! Email Anda (${inputEmail.trim().toLowerCase()}) telah berhasil diverifikasi. Ada yang dapat kami bantu seputar retribusi bandara, e-SKRD, fasilitas terminal, atau sewa lahan MARS hari ini?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        setOtpError(res.data?.message || 'Kode OTP tidak cocok.');
      }
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      setOtpError(err?.response?.data?.message || 'Kode OTP yang dimasukkan salah.');
    } finally {
      setIsSubmittingOtp(false);
    }
  };

  useEffect(() => {
    if (isChatOpen) {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isBotTyping, isChatOpen]);

  const handleSendChatMessage = async (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    if (!textToSend) setChatInput('');
    setIsBotTyping(true);

    try {
      const res = await api.post('/chat', { messages: updatedMessages });
      const botReply = res.data?.reply || 'Mohon maaf, saya belum dapat memahami pertanyaan tersebut. Bisa diulang kembali?';

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMsg =
        err?.response?.data?.reply ||
        'Mohon maaf, saat ini koneksi ke layanan AI sedang terganggu. Anda dapat menghubungi helpdesk resmi kami melalui email dishub@mimikakab.go.id.';
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: fallbackMsg,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <>
      {/* JENDELA LIVE CHAT KETIKA AKTIF (TERLETAK SEMPURNA DI SUDUT KANAN BAWAH) */}
      {isChatOpen && (
        <>
          {/* Backdrop Gelap Transparan Ketika Card Chat Diperbesar Menjadi Modal Tengah */}
          {isChatMaximized && (
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 transition-opacity animate-in fade-in duration-300"
              onClick={() => setIsChatMaximized(false)}
            />
          )}

          <div
            className={`z-50 bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col transition-all duration-300 ease-in-out ${
              isChatMaximized
                ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94vw] sm:w-[680px] md:w-[740px] h-[640px] sm:h-[680px] max-h-[92vh] animate-in zoom-in-95 duration-300 ring-1 ring-white/20'
                : 'fixed bottom-3 sm:bottom-6 right-3 sm:right-6 w-[92vw] sm:w-[370px] h-[525px] max-h-[calc(100vh-28px)] animate-in fade-in slide-in-from-bottom-4 duration-300'
            }`}
          >
            {/* Header Chat Warna Biru MARS */}
            <div
              className={`bg-gradient-to-r from-[#008db9] via-[#0284c7] to-[#0f3443] relative overflow-hidden text-white flex items-center justify-between shadow-xs shrink-0 ${
                isChatMaximized ? 'p-4 sm:p-5' : 'p-3.5 sm:p-4'
              }`}
            >
              {/* Soft decorative background circles */}
              <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute right-16 -bottom-8 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

              <div className="flex items-center gap-3 relative z-10">
                {/* Avatar Icon Robot AI */}
                <div className="relative shrink-0 group/avatar cursor-pointer" title="M Naufal - Asisten Cerdas MARS">
                  <div
                    className={`rounded-full bg-white text-[#008db9] shadow-md border-2 border-white/90 flex items-center justify-center ${
                      isChatMaximized ? 'w-11 h-11' : 'w-10 h-10'
                    }`}
                  >
                    <Bot className={isChatMaximized ? 'w-6 h-6' : 'w-5 h-5'} />
                  </div>
                  {/* Tooltip saat hover avatar di header chat */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover/avatar:flex items-center gap-1.5 bg-slate-900/95 text-white text-[11px] px-2.5 py-1 rounded-xl shadow-xl border border-sky-400/30 whitespace-nowrap z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                    <span className="font-bold">M Naufal</span>
                    <span className="text-sky-300">-</span>
                    <span className="text-sky-200">Asisten Cerdas MARS</span>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-l border-t border-sky-400/30" />
                  </div>
                </div>

                <div>
                  <div className={`font-bold text-white leading-tight ${isChatMaximized ? 'text-base sm:text-lg' : 'text-sm'}`}>
                    M Naufal
                  </div>
                  <div className={`text-sky-100 flex items-center gap-1.5 mt-0.5 ${isChatMaximized ? 'text-xs' : 'text-[11px]'}`}>
                    <span>Asisten Cerdas MARS</span>
                  </div>
                </div>
              </div>

              {/* Tombol Kontrol: Maximize/Minimize & Close */}
              <div className="flex items-center gap-1.5 sm:gap-2 relative z-10">
                <button
                  type="button"
                  onClick={() => setIsChatMaximized(!isChatMaximized)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title={isChatMaximized ? 'Perkecil ke pojok kanan' : 'Perbesar ke tengah layar'}
                >
                  {isChatMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChatOpen(false);
                    setIsChatMaximized(false);
                  }}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Tutup Chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body (Nuansa Biru Lembut MARS #f0f7fb) */}
            <div
              className={`flex-1 overflow-y-auto space-y-3.5 sm:space-y-4 bg-[#f0f7fb] ${
                isChatMaximized ? 'p-4 sm:p-6' : 'p-3.5 sm:p-4'
              }`}
            >
              {/* Pesan-pesan Chat */}
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {msg.sender === 'bot' ? (
                    <div className={`flex items-end gap-2.5 ${isChatMaximized ? 'max-w-[80%] sm:max-w-[75%]' : 'max-w-[90%]'}`}>
                      {/* Mini Avatar Robot AI di Sebelah Kiri Bubble */}
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#008db9] to-sky-400 text-white flex items-center justify-center shrink-0 shadow-xs mb-1 border-2 border-white ring-1 ring-sky-200/50">
                        <Bot className="w-4 h-4 text-white" />
                      </div>

                      {/* Bubble Card Putih Bersih */}
                      <div
                        className={`bg-white rounded-2xl rounded-bl-xs shadow-2xs border border-sky-100/90 text-slate-800 leading-relaxed ${
                          isChatMaximized ? 'p-4 sm:p-5 text-sm' : 'p-3.5 text-xs sm:text-[12.5px]'
                        }`}
                      >
                        <div className="whitespace-pre-line">
                          {msg.text.replace(/\\*\\*([^*]+)\\*\\*/g, '$1').replace(/\\*([^*]+)\\*/g, '$1').replace(/\\*/g, '')}
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-slate-400 mt-2 font-medium">
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`flex flex-col items-end ${isChatMaximized ? 'max-w-[75%] sm:max-w-[70%]' : 'max-w-[85%]'}`}>
                      <div
                        className={`bg-gradient-to-r from-[#008db9] to-[#0284c7] text-white rounded-2xl rounded-br-xs shadow-2xs leading-relaxed ${
                          isChatMaximized ? 'p-3.5 sm:p-4 px-4 sm:px-5 text-sm' : 'p-3 px-3.5 text-xs sm:text-[12.5px]'
                        }`}
                      >
                        <div className="whitespace-pre-line">
                          {msg.text.replace(/\\*\\*([^*]+)\\*\\*/g, '$1').replace(/\\*([^*]+)\\*/g, '$1').replace(/\\*/g, '')}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                    </div>
                  )}
                </div>
              ))}

              {/* Indikator Mengetik */}
              {isBotTyping && (
                <div className="flex items-end gap-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#008db9] to-sky-400 text-white flex items-center justify-center shrink-0 shadow-xs mb-1 border-2 border-white ring-1 ring-sky-200/50">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-white border border-sky-100/90 px-3.5 py-2.5 rounded-2xl rounded-bl-xs shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#008db9] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#008db9] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#008db9] animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              {/* Auto-scroll target */}
              <div ref={chatMessagesEndRef} />

              {/* Quick Questions Chips (Hanya muncul jika sudah terverifikasi) */}
              {isVerified && (
                <div className="pt-1">
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Pertanyaan Populer:
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {[
                      'Cara Cek Status SKRD',
                      'Bayar via Bank Papua',
                      'Sewa Gerai Terminal',
                      'Tarif Parkir Apron'
                    ].map((quickQ) => (
                      <button
                        key={quickQ}
                        type="button"
                        onClick={() => handleSendChatMessage(quickQ)}
                        className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white hover:bg-sky-50 text-[#008db9] border border-sky-200 text-[11px] sm:text-xs font-medium transition-colors shadow-2xs cursor-pointer active:scale-95"
                      >
                        {quickQ}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AREA BAWAH: FORM VERIFIKASI IDENTITAS & OTP ATAU CHAT INPUT */}
            {!isVerified ? (
              <div
                className={`bg-white border-t border-slate-100 flex flex-col gap-2.5 shrink-0 ${
                  isChatMaximized ? 'p-4 sm:p-5' : 'p-3.5 sm:p-4'
                }`}
              >
                {otpStep === 'form' ? (
                  /* Step 1: Input Nama dan Email / Gmail */
                  <form onSubmit={handleSendOtp} className={`flex flex-col gap-2.5 ${isChatMaximized ? 'max-w-md mx-auto w-full' : ''}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          NAMA
                        </label>
                        <input
                          type="text"
                          value={inputName}
                          onChange={(e) => {
                            setInputName(e.target.value);
                            if (otpError) setOtpError('');
                          }}
                          placeholder="Nama lengkap"
                          className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:border-[#008db9] focus:ring-1 focus:ring-[#008db9] transition-colors shadow-2xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          EMAIL / GMAIL
                        </label>
                        <input
                          type="email"
                          value={inputEmail}
                          onChange={(e) => {
                            setInputEmail(e.target.value);
                            if (otpError) setOtpError('');
                          }}
                          placeholder="contoh@gmail.com"
                          className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:border-[#008db9] focus:ring-1 focus:ring-[#008db9] transition-colors shadow-2xs"
                        />
                      </div>
                    </div>

                    {otpError && (
                      <div className="text-rose-500 text-[11px] sm:text-xs flex items-center gap-1 font-medium bg-rose-50 p-2 rounded-lg border border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{otpError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!inputName.trim() || !inputEmail.trim() || isSubmittingOtp}
                      className="w-full py-2.5 sm:py-3 rounded-xl bg-[#008db9] hover:bg-[#00749a] disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      {isSubmittingOtp ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Mengirim OTP ke Gmail...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>Kirim OTP ke Gmail</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Step 2: Input Kode OTP 6 Digit dari Gmail (Kotak-Kotak Elegan) */
                  <form onSubmit={handleVerifyOtp} className={`flex flex-col gap-2.5 ${isChatMaximized ? 'max-w-md mx-auto w-full' : ''}`}>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 overflow-hidden mr-2">
                        <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                          KODE OTP
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-[#008db9] font-medium truncate" title={inputEmail}>
                          ({inputEmail})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep('form');
                          setOtpError('');
                          setOtpBoxes(['', '', '', '', '', '']);
                          setResendCooldown(0);
                        }}
                        className="text-xs text-[#008db9] hover:text-[#00749a] hover:underline font-semibold cursor-pointer shrink-0"
                      >
                        Ubah Email
                      </button>
                    </div>

                    {/* 6 KOTAK OTP INPUT (BOX INPUT ELEGAN) */}
                    <div 
                      className="flex items-center justify-center gap-2 sm:gap-3 my-1" 
                      onPaste={handleOtpPaste}
                    >
                      {otpBoxes.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => {
                            otpInputRefs.current[idx] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          onFocus={(e) => e.target.select()}
                          aria-label={`Digit OTP ${idx + 1}`}
                          className={`w-11 sm:w-12 h-12 sm:h-13 text-center font-mono font-bold text-xl sm:text-2xl rounded-xl border-2 transition-all duration-150 outline-none select-none ${
                            digit
                              ? 'bg-sky-50/80 border-[#008db9] text-[#008db9] shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300 focus:bg-white focus:border-[#008db9] focus:ring-4 focus:ring-[#008db9]/15'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Keterangan Minimalis Berlaku 3 Menit & Petunjuk Email */}
                    <div className="bg-sky-50/60 border border-sky-100/70 rounded-lg px-2.5 py-1.5 text-center text-[11px] sm:text-xs text-slate-600 flex items-center justify-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#008db9] shrink-0" />
                      <span>
                        Berlaku <b>3 menit</b> • Cek folder <b>Inbox / Spam</b> Gmail
                      </span>
                    </div>

                    {otpError && (
                      <div className="text-rose-600 text-[11px] sm:text-xs flex items-center gap-1.5 font-medium bg-rose-50 p-2 rounded-xl border border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                        <span>{otpError}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        type="submit"
                        disabled={otpBoxes.join('').length !== 6 || isSubmittingOtp}
                        className="flex-1 py-2.5 sm:py-3 rounded-xl bg-[#008db9] hover:bg-[#00749a] disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        {isSubmittingOtp ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Memverifikasi...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Verifikasi &amp; Mulai Chat</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSubmittingOtp || resendCooldown > 0}
                        className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white text-slate-700 text-xs font-semibold cursor-pointer transition-colors shadow-2xs shrink-0 active:scale-95"
                        title={resendCooldown > 0 ? `Kirim ulang tersedia dalam ${formatCooldown(resendCooldown)}` : 'Kirim ulang kode OTP baru'}
                      >
                        {resendCooldown > 0 ? `Kirim Ulang (${formatCooldown(resendCooldown)})` : 'Kirim Ulang'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* Step 3: Input Form Bar Chat (Hanya Aktif Jika Sudah Terverifikasi) */
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChatMessage();
                }}
                className={`bg-white border-t border-slate-100 flex items-center gap-2 shrink-0 ${
                  isChatMaximized ? 'p-3.5 sm:p-4.5 gap-3' : 'p-3'
                }`}
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Halo ${verifiedName || 'Bapak/Ibu'}, ketik pertanyaan bantuan Anda...`}
                  autoFocus
                  className={`flex-1 rounded-full border border-slate-200 focus:outline-none focus:border-[#008db9] focus:ring-1 focus:ring-[#008db9] bg-slate-50 focus:bg-white text-slate-800 transition-colors shadow-2xs ${
                    isChatMaximized ? 'px-4 py-2.5 sm:py-3 text-sm' : 'px-3.5 py-2 text-xs'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className={`rounded-full bg-[#008db9] hover:bg-[#00749a] disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-xs active:scale-95 ${
                    isChatMaximized ? 'w-10 h-10 sm:w-11 sm:h-11' : 'w-9 h-9'
                  }`}
                  aria-label="Kirim Pesan"
                >
                  <Send className={isChatMaximized ? 'w-4.5 h-4.5' : 'w-4 h-4'} />
                </button>
              </form>
            )}

          </div>
        </>
      )}

      {/* FIGUR ORANG DI LAYER TERDEPAN (SAAT CHAT SEDANG DITUTUP) */}
      {!isChatOpen && (
        <div className="fixed bottom-0 right-2 sm:right-6 lg:right-10 z-40 flex items-end justify-end select-none pointer-events-none animate-in fade-in duration-300">
          <div className="relative flex items-end justify-end pointer-events-auto">
            {/* Figur Orang Customer Service (Interaktif: Pose Salam saat Kursor Mengarah ke Orang) */}
            <div 
              onClick={() => setIsChatOpen(true)}
              onMouseEnter={() => setIsOfficerHovered(true)}
              onMouseLeave={() => setIsOfficerHovered(false)}
              className="relative cursor-pointer flex items-end justify-center select-none"
            >
              {/* Badge Popover / Tooltip: M Naufal - Asisten Cerdas MARS */}
              <div
                className={`absolute -top-11 sm:-top-13 left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none z-30 ${
                  isOfficerHovered
                    ? 'opacity-100 -translate-y-2 scale-100'
                    : 'opacity-0 translate-y-2 scale-90'
                }`}
              >
                <div className="relative bg-slate-900/95 text-white px-3.5 py-1.5 rounded-2xl shadow-2xl border border-sky-400/40 backdrop-blur-md flex items-center justify-center whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-bold text-white tracking-wide">M Naufal</span>
                    <span className="text-sky-400 font-semibold">-</span>
                    <span className="text-sky-200 font-medium">Asisten Cerdas MARS</span>
                  </div>
                  {/* Arrow pointer down */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900/95 border-r border-b border-sky-400/40 rotate-45" />
                </div>
              </div>

              {/* 1. Pose Standby (Senyum Ramah dengan Headset) */}
              <img
                src="/images/cs-officer-cutout.png?v=2"
                alt="Petugas Customer Service Formal Headset"
                className={`h-48 sm:h-60 lg:h-[268px] w-auto object-contain object-bottom drop-shadow-xl transition-all duration-300 ${
                  isOfficerHovered ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
                }`}
              />

              {/* 2. Pose Salam (Kedua Tangan Ditutup Memberikan Salam Hormat di Depan Dada saat Kursor Mengarah) */}
              <img
                src="/images/cs-officer-salam.png?v=2"
                alt="Petugas Memberikan Salam Hormat"
                className={`absolute bottom-0 h-48 sm:h-60 lg:h-[268px] w-auto object-contain object-bottom drop-shadow-xl transition-all duration-300 ${
                  isOfficerHovered ? 'opacity-100 scale-[1.02]' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              />
            </div>

            {/* Tombol Bulat Biru Chat di Kanan Bawah Figur */}
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="absolute bottom-2 sm:bottom-2.5 right-0.5 sm:right-1.5 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1d4ed8] hover:bg-[#1e40af] text-white shadow-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none"
              aria-label="Buka Live Chat"
            >
              <span className="absolute inset-0 rounded-full bg-blue-500/25 animate-ping pointer-events-none" />
              <div className="relative">
                <MessageSquare className="w-6 h-6 text-white fill-white group-hover:scale-105 transition-transform" />
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#1d4ed8]" />
              </div>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
