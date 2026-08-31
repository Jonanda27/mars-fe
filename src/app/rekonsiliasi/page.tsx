import Link from 'next/link';
import { RefreshCcw, ArrowRight, Check } from 'lucide-react';

export default function RekonsiliasiPage() {
  return (
    <div className="p-8 md:p-12">
      <header className="mb-10 border-b-4 border-slate-900 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 uppercase">Rekonsiliasi Transaksi</h1>
          <p className="text-slate-500 uppercase tracking-widest mt-2">Pencocokan Data Sistem vs Mutasi Bank</p>
        </div>
        <RefreshCcw className="w-12 h-12 text-slate-300" />
      </header>

      <div className="bg-white border-2 border-slate-200 p-8 mb-8">
        
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          
          {/* Kolom Sistem */}
          <div className="flex-1 bg-slate-50 border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Catatan Sistem MARS</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase">SKRD / Tagihan</p>
                <p className="font-bold text-slate-900 font-mono">001/SKRD/2026</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Nilai Tagihan</p>
                <p className="font-bold text-slate-900 text-lg">Rp 1.200.000.000</p>
              </div>
            </div>
          </div>

          {/* Icon Match */}
          <div className="flex items-center justify-center">
            <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full">
              <Check className="w-8 h-8" />
            </div>
          </div>

          {/* Kolom Bank */}
          <div className="flex-1 bg-slate-50 border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Mutasi Bank (Payment Gateway)</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase">Referensi Transaksi</p>
                <p className="font-bold text-slate-900 font-mono">TRX-VA-88123456</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Dana Masuk</p>
                <p className="font-bold text-slate-900 text-lg">Rp 1.200.000.000</p>
              </div>
            </div>
          </div>

        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-4 text-center">
          <p className="text-emerald-800 font-bold uppercase tracking-wider">Status: MATCH (Sesuai)</p>
          <p className="text-sm text-emerald-600 mt-1">Sistem telah otomatis melakukan pelunasan tagihan.</p>
        </div>

      </div>

      <div className="flex justify-end gap-4">
        <Link 
          href="/" 
          className="bg-slate-900 text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors flex items-center"
        >
          Kembali Ke Dashboard (Selesai) <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
