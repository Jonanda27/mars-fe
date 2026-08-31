import Link from 'next/link';
import { Calculator, ArrowRight, Save } from 'lucide-react';

export default function HitungTarifPage() {
  return (
    <div className="p-8 md:p-12">
      <header className="mb-10 border-b-4 border-slate-900 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 uppercase">Kalkulasi Tarif</h1>
          <p className="text-slate-500 uppercase tracking-widest mt-2">Perhitungan Berdasarkan Regulasi (Perda)</p>
        </div>
        <Calculator className="w-12 h-12 text-slate-300" />
      </header>

      <div className="bg-white border-2 border-slate-200 mb-8 p-8">
        <h2 className="text-xl font-bold text-slate-900 uppercase mb-6 border-b border-slate-100 pb-4">Formula: Unit x Tarif x Periode</h2>
        
        <div className="flex flex-col md:flex-row justify-between items-center bg-slate-50 border border-slate-200 p-6 mb-8 gap-4 text-center md:text-left">
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unit / Luas</p>
            <p className="text-2xl font-bold text-slate-900">2.000 m2</p>
          </div>
          <div className="text-3xl font-bold text-slate-300 mx-4">x</div>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tarif Dasar</p>
            <p className="text-2xl font-bold text-slate-900">Rp 50.000</p>
          </div>
          <div className="text-3xl font-bold text-slate-300 mx-4">x</div>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Periode</p>
            <p className="text-2xl font-bold text-slate-900">12 Bulan</p>
          </div>
          <div className="text-3xl font-bold text-slate-900 mx-4">=</div>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</p>
            <p className="text-3xl font-bold text-amber-600">Rp 1.200.000.000</p>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button className="px-6 py-3 border-2 border-slate-900 text-slate-900 font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors">
            Hitung Ulang
          </button>
          <Link 
            href="/tagihan" 
            className="bg-slate-900 text-white px-6 py-3 font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors flex items-center"
          >
            Lanjut ke SKRD <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
