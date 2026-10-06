"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { FlightSchedule } from '@/types/flightSchedule';
import { SuratIzinMasukHanggar } from '@/components/SuratIzinMasukHanggar';
import { Download, Printer, ShieldCheck, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

import { generateTiketPdf } from '@/utils/exportTiketPdf';

export default function PublicTiketIzinPage() {
  const routeParams = useParams();
  const idFromParam = routeParams?.id as string;

  const [schedule, setSchedule] = useState<FlightSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const docRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTicket = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);

        // Ambil ID dari route params atau path URL
        const targetId = idFromParam 
          || (typeof window !== 'undefined' ? window.location.pathname.split('/').filter(Boolean).pop() : '');

        if (!targetId) {
          if (isMounted) {
            setErrorMsg('ID tiket tidak valid atau tidak disertakan pada tautan.');
            setIsLoading(false);
          }
          return;
        }

        // Tentukan endpoint backend sesuai hostname aktif (localhost atau IP jaringan)
        const hostName = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
        const apiUrl = `http://${hostName}:5000/api/schedules/public/ticket/${targetId}`;

        const res = await fetch(apiUrl, { cache: 'no-store' });
        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.message || `Gagal memuat tiket (Status HTTP ${res.status})`);
        }

        const json = await res.json();
        if (isMounted) {
          if (json.data) {
            setSchedule(json.data);
          } else {
            throw new Error('Data tiket kosong atau tidak ditemukan');
          }
        }
      } catch (err: any) {
        console.error('Error fetching ticket:', err);
        if (isMounted) {
          setErrorMsg(err.message || 'Tiket izin masuk tidak ditemukan atau tautan sudah kedaluwarsa.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTicket();

    return () => {
      isMounted = false;
    };
  }, [idFromParam]);

  const handleDownloadPDF = async () => {
    if (!docRef.current || !schedule) return;
    try {
      setIsDownloading(true);
      const safeScheduleNum = (schedule.schedule_number || 'PASS').replace(/[\/\\?%*:|"<>]/g, '_');
      const safeReg = (schedule.registration_number || 'ARMADA').replace(/[\/\\?%*:|"<>]/g, '_');
      const filename = `Tiket_Izin_Masuk_${safeScheduleNum}_${safeReg}.pdf`;

      await generateTiketPdf(docRef.current, filename, { autoDownload: true });
      toast.success('Tiket Izin Masuk PDF berhasil diunduh');
    } catch (error) {
      console.error('Download PDF error:', error);
      toast.error('Gagal mengunduh dokumen PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  // Otomatis unduh jika URL memuat parameter ?download=1
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('download=1') && schedule && !isLoading && !isDownloading) {
      const timer = setTimeout(() => {
        handleDownloadPDF();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [schedule, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-[#3c8dbc] animate-spin mb-3" />
        <h2 className="text-sm font-bold text-slate-800">Memuat Tiket Izin Masuk Resmi...</h2>
        <p className="text-xs text-slate-500 mt-1">Unit Penyelenggara Bandar Udara (UPBU) Kelas I Mozes Kilangin Timika</p>
      </div>
    );
  }

  if (errorMsg || !schedule) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-8 max-w-md w-full shadow-md border border-slate-200 space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-base font-bold text-slate-900">Dokumen Izin Tidak Ditemukan</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {errorMsg || 'Data izin masuk hanggar untuk nomor atau ID ini tidak ditemukan dalam sistem.'}
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200 text-black print:bg-white print:min-h-0">
      {/* Top Action Bar (Screen only, hidden on print) */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white px-4 py-3 shadow-md print:hidden flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <h1 className="font-bold text-xs sm:text-sm text-white leading-tight">
              E-Gate Pass &bull; UPBU Kelas I Mozes Kilangin Timika
            </h1>
            <p className="text-[11px] text-slate-300">
              No: <strong>{schedule.schedule_number}</strong> &bull; Armada: <strong>{schedule.registration_number}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Mengunduh...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF Resmi</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Document Viewer */}
      <main className="p-4 sm:p-8 flex justify-center print:p-0">
        <div className="bg-white shadow-xl print:shadow-none">
          <SuratIzinMasukHanggar schedule={schedule} ref={docRef} />
        </div>
      </main>
    </div>
  );
}
