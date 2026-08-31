import Link from 'next/link';
import { Users, ArrowRight } from 'lucide-react';

export default function PenyewaPage() {
  const tenantData = [
    { id: 'T-001', nama: 'PT Jaya Abadi', pic: 'Budi Santoso', status: 'Terverifikasi' },
    { id: 'T-002', nama: 'CV Dirgantara', pic: 'Andi Pratama', status: 'Menunggu' },
  ];

  return (
    <div className="p-8 md:p-12">
      <header className="mb-10 border-b-4 border-slate-900 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 uppercase">Data Penyewa</h1>
          <p className="text-slate-500 uppercase tracking-widest mt-2">Daftar Entitas Tenant</p>
        </div>
        <Users className="w-12 h-12 text-slate-300" />
      </header>

      <div className="bg-white border-2 border-slate-200 mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-200">
              <th className="p-4 font-bold text-slate-900 uppercase tracking-wider text-sm">ID Tenant</th>
              <th className="p-4 font-bold text-slate-900 uppercase tracking-wider text-sm">Nama Perusahaan</th>
              <th className="p-4 font-bold text-slate-900 uppercase tracking-wider text-sm">PIC</th>
              <th className="p-4 font-bold text-slate-900 uppercase tracking-wider text-sm">Status Dokumen</th>
              <th className="p-4 font-bold text-slate-900 uppercase tracking-wider text-sm">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tenantData.map((tenant, idx) => (
              <tr key={tenant.id} className={idx !== tenantData.length - 1 ? "border-b border-slate-200" : ""}>
                <td className="p-4 text-slate-600 font-mono">{tenant.id}</td>
                <td className="p-4 font-bold text-slate-900">{tenant.nama}</td>
                <td className="p-4 text-slate-600">{tenant.pic}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${tenant.status === 'Terverifikasi' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                    {tenant.status}
                  </span>
                </td>
                <td className="p-4">
                  {tenant.status === 'Terverifikasi' && (
                    <Link 
                      href="/kontrak" 
                      className="text-sm font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider flex items-center"
                    >
                      Buat Kontrak <ArrowRight className="w-4 h-4 ml-1" />
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
          href="/kontrak" 
          className="bg-slate-900 text-white px-6 py-3 font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors flex items-center"
        >
          Lanjut ke Kontrak <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
