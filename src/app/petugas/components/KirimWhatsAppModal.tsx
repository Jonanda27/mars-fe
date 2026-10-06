"use client";

import React, { useState, useRef } from 'react';
import { 
  X, MessageSquare, Phone, Download, Send, 
  Loader2, CheckCircle2, FileText, AlertCircle, Copy, ExternalLink, Globe 
} from 'lucide-react';
import { FlightSchedule } from '@/types/flightSchedule';
import { SuratIzinMasukHanggar } from '@/components/SuratIzinMasukHanggar';
import { generateTiketPdf } from '@/utils/exportTiketPdf';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

interface KirimWhatsAppModalProps {
  schedule: FlightSchedule;
  onClose: () => void;
}

export function KirimWhatsAppModal({ schedule, onClose }: KirimWhatsAppModalProps) {
  const [phoneNumber, setPhoneNumber] = useState<string>(schedule.tenant?.nomor_telepon || '');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  // Host configuration: Default gunakan window.location.origin (misal http://localhost:3000 atau domain resmi)
  const [baseHost, setBaseHost] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'http://localhost:3000';
  });

  const tenantName = schedule.tenant?.nama_perusahaan || 'Tenant';
  const tenantIdStr = schedule.tenant?.tenant_id_str 
    || (schedule.tenant_id 
        ? `T-${new Date(schedule.created_at || Date.now()).getFullYear()}-${String(schedule.tenant_id).padStart(4, '0')}` 
        : '-');
  const regNumber = schedule.registration_number || '-';
  const aircraftType = schedule.aircraft_type || 'Pesawat Standar';
  const parkingLoc = schedule.parking_location || 'Hanggar Mozes Kilangin';
  const waktuMasuk = schedule.estimated_arrival 
    ? dayjs(schedule.estimated_arrival).format('DD MMMM YYYY, HH:mm') + ' WIT'
    : '-';
  const tenantEmail = schedule.tenant?.email || '-';

  // Tautan Dokumen PDF Bersih
  const directTicketUrl = `${baseHost}/cetak/tiket-izin/${schedule.id}`;

  // Template Pesan Resmi WhatsApp (100% Bebas Emoji Agar Tidak Rusak / Jadi Tanda Tanya)
  const generateMessage = () => {
    return `*PEMBERITAHUAN IZIN MASUK HANGGAR*
*UPBU KELAS I MOZES KILANGIN TIMIKA*

Yth. Manajemen *${tenantName}*,

Kami dari Petugas Lapangan Hanggar & Apron UPBU Kelas I Mozes Kilangin Timika menginformasikan bahwa Pengajuan Jadwal Masuk & Penempatan Pesawat Anda telah *DISETUJUI*.

*Rincian Izin Masuk (E-Gate Pass):*
- No. Izin: *${schedule.schedule_number}*
- ID Tenant: *${tenantIdStr}*
- Tanda Pendaftaran: *${regNumber}* (${aircraftType})
- Alokasi Penempatan: *${parkingLoc}*
- Estimasi Waktu Masuk: *${waktuMasuk}*
- Status Izin: *DISETUJUI & VALID*
${schedule.officer_notes ? `- Catatan Petugas: "${schedule.officer_notes}"\n` : ''}
*Tautan Akses & Unduh E-Tiket PDF Resmi:*
${directTicketUrl}

Dokumen tiket resmi juga telah terkirim secara otomatis ke email terdaftar: ${tenantEmail}

Harap tunjukkan tiket ini kepada Petugas Pos Jaga / Marshaller Airside saat pesawat tiba di bandara.

Terima kasih atas kerja samanya.
*Petugas Lapangan Hanggar & Apron*
Unit Penyelenggara Bandar Udara (UPBU) Kelas I Mozes Kilangin Timika`;
  };

  const handleDownloadPdf = async () => {
    if (!ticketRef.current) return;
    try {
      setIsDownloadingPdf(true);
      const safeScheduleNum = (schedule.schedule_number || 'PASS').replace(/[\/\\?%*:|"<>]/g, '_');
      const safeReg = (schedule.registration_number || 'ARMADA').replace(/[\/\\?%*:|"<>]/g, '_');
      const filename = `Tiket_Izin_Masuk_${safeScheduleNum}_${safeReg}.pdf`;

      await generateTiketPdf(ticketRef.current, filename, { autoDownload: true });
      toast.success('Tiket PDF berhasil diunduh ke komputer Anda.');
    } catch (error) {
      console.error('Download PDF error:', error);
      toast.error('Gagal mengunduh tiket PDF');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.trim() === '') {
      toast.error('Silakan isi nomor WhatsApp tenant terlebih dahulu');
      return;
    }

    let cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    } else if (cleanPhone.startsWith('8')) {
      cleanPhone = '62' + cleanPhone;
    }

    if (cleanPhone.length < 9) {
      toast.error('Nomor WhatsApp tidak valid. Pastikan nomor benar.');
      return;
    }

    const message = generateMessage();
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    window.open(waUrl, '_blank');
    toast.success(`Membuka WhatsApp ke ${tenantName} (+${cleanPhone})`);
    onClose();
  };

  const handleCopyMessage = () => {
    const message = generateMessage();
    navigator.clipboard.writeText(message);
    toast.success('Teks pesan konfirmasi disalin ke clipboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-none shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        
        {/* Header Modal */}
        <div className="bg-emerald-700 text-white px-5 py-3.5 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-200" />
            Kirim Konfirmasi Tiket via WhatsApp
          </h3>
          <button onClick={onClose} className="text-emerald-100 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-5 text-xs text-slate-700 space-y-4 overflow-y-auto flex-1">
          {/* Info Card Tenant & Jadwal */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Penerima (Tenant / Maskapai):</span>
                <span className="text-sm font-bold text-slate-900 block">{tenantName}</span>
                <span className="text-[11px] font-mono text-slate-600 block">ID: {tenantIdStr}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">No. Pengajuan:</span>
                <span className="text-xs font-mono font-bold text-[#3c8dbc]">{schedule.schedule_number}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500">Armada: </span>
                <strong className="text-slate-800">{regNumber}</strong> ({aircraftType})
              </div>
              <div>
                <span className="text-slate-500">Lokasi: </span>
                <strong className="text-slate-800">{parkingLoc}</strong>
              </div>
            </div>
          </div>

          <form onSubmit={handleSendWhatsApp} className="space-y-4">
            {/* Input Nomor WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                Nomor WhatsApp Tenant / PIC <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Contoh: 082360838323 atau 6282360838323"
                className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-emerald-600 text-xs font-medium"
                required
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Format nomor dapat diawali dengan 08... atau 628... (akan diformat otomatis saat membuka WhatsApp).
              </p>
            </div>

            {/* Pengaturan Host Tautan Dokumen (IP Jaringan vs Localhost) */}
            <div className="bg-slate-50 border border-slate-200 p-2.5 space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-500" />
                  Alamat Server Tautan Tiket:
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Dapat disesuaikan</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={baseHost}
                  onChange={(e) => setBaseHost(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 border border-slate-300 bg-white text-xs font-mono"
                  placeholder="http://192.168.31.39:3000"
                />
                <button
                  type="button"
                  onClick={() => setBaseHost('http://192.168.31.39:3000')}
                  className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-[10px] transition-colors"
                  title="Gunakan IP Wi-Fi agar HP bisa buka tautan"
                >
                  IP Wi-Fi
                </button>
                <button
                  type="button"
                  onClick={() => setBaseHost('http://localhost:3000')}
                  className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-[10px] transition-colors"
                  title="Gunakan Localhost jika diakses di laptop ini saja"
                >
                  Localhost
                </button>
              </div>
              <p className="text-[9.5pt] text-slate-500 leading-tight">
                * Gunakan <strong>IP Wi-Fi</strong> agar tautan dapat diklik dan langsung dibuka dari perangkat smartphone/HP tenant.
              </p>
            </div>

            {/* Preview Pesan WhatsApp (100% Bersih dari Karakter Rusak) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-800">
                  Pratinjau Pesan Konfirmasi:
                </label>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="text-[11px] text-slate-600 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
                  title="Salin teks pesan"
                >
                  <Copy className="w-3 h-3" />
                  Salin Teks
                </button>
              </div>
              <div className="bg-slate-50 border border-slate-300 p-3 rounded-none text-slate-900 font-mono text-[10.5px] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto select-all">
                {generateMessage()}
              </div>
            </div>

            {/* Catatan Edukasi Keamanan Tautan WhatsApp */}
            <div className="bg-amber-50 border border-amber-200 p-2.5 text-[10.5px] text-amber-900 leading-relaxed">
              <strong>Info Penting Mengenai Tautan di WhatsApp:</strong><br />
              Jika penerima belum menyimpan nomor Anda di kontak WhatsApp mereka, fitur keamanan WhatsApp akan menonaktifkan klik link sampai penerima mengetuk <em>"Lanjutkan / Tambah Kontak"</em> atau membalas pesan Anda 1 kali.
            </div>

            {/* Tombol Aksi */}
            <div className="pt-3 border-t border-slate-200 flex justify-between items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isDownloadingPdf}
                className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                title="Unduh berkas PDF ke komputer jika ingin melampirkan langsung"
              >
                {isDownloadingPdf ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Mengunduh...
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    Unduh PDF ke Laptop
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Buka WhatsApp Web / App
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Hidden Ticket Container untuk keperluan Download PDF */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <SuratIzinMasukHanggar schedule={schedule} ref={ticketRef} />
        </div>

      </div>
    </div>
  );
}
