import Link from 'next/link';
import { Building2, ArrowRight } from 'lucide-react';

export default function AsetPage() {
  const asetData = [
    { id: 'HGR-001', nama: 'Hanggar A', luas: '2.000 m2', status: 'Tersedia' },
    { id: 'HGR-002', nama: 'Hanggar B', luas: '1.500 m2', status: 'Disewa' },
    { id: 'RMG-001', nama: 'Office 01', luas: '100 m2', status: 'Tersedia' },
  ];

  return (
    <div className="p-8 md:p-12">
      <header className="mb-10 border-b-4 border-slate-900 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 uppercase">Aset & Fasilitas</h1>
          <p className="text-slate-500 uppercase tracking-widest mt-2">Daftar Inventaris Bandara</p>
        </div>
        <Building2 className="w-12 h-12 text-slate-300" />
      </header>

      <div className="bg-white border-2 border-slate-200 mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-200">
              <th className="p-4 font-bold text-slate-900 uppercase tracking-wider text-sm">Kode Aset</th>
              <th className="p-4 font-bold text-slate-900 uppercase tracking-wider text-sm">Nama Aset</th>
              <th className="p-4 font-bold text-slate-900 uppercase tracking-wider text-sm">Luas</th>
              <th className="p-4 font-bold text-slate-900 uppercase tracking-wider text-sm">Status</th>
              <th className="p-4 font-bold text-slate-900 uppercase tracking-wider text-sm">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {asetData.map((aset, idx) => (
              <tr key={aset.id} className={idx !== asetData.length - 1 ? "border-b border-slate-200" : ""}>
                <td className="p-4 text-slate-600 font-mono">{aset.id}</td>
                <td className="p-4 font-bold text-slate-900">{aset.nama}</td>
                <td className="p-4 text-slate-600">{aset.luas}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${aset.status === 'Tersedia' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                    {aset.status}
                  </span>
                </td>
                <td className="p-4">
                  {aset.status === 'Tersedia' && (
                    <Link 
                      href="/penyewa" 
                      className="text-sm font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider flex items-center"
                    >
                      Pilih Aset <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-end">
        <Link 
          href="/penyewa" 
          className="bg-slate-900 text-white px-6 py-3 font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors flex items-center"
        >
          Lanjut ke Penyewa <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
