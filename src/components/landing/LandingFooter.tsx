import React from 'react';
import Link from 'next/link';
import { MapPin, Mail } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-white border-t-2 border-[#3c8dbc] text-gray-600 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-gray-200">
          
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-[#3c8dbc] text-white flex items-center justify-center font-bold text-lg rounded-lg">
                M
              </div>
              <span className="text-lg font-black text-gray-900 tracking-tight">MARS</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed max-w-sm mb-3">
              Mimika Airport Revenue System. Portal digital resmi pengelolaan retribusi jasa kebandarudaraan UPBU Mozes Kilangin, Dinas Perhubungan Kabupaten Mimika.
            </p>
            <div className="text-[11px] text-gray-500">
              Dasar Hukum: Peraturan Daerah Kabupaten Mimika & Standar Ditjen Hubud RI.
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">Tautan Cepat</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#beranda" className="hover:text-[#3c8dbc] transition-colors">Beranda</a></li>
              <li><a href="#cek-tagihan" className="hover:text-[#3c8dbc] transition-colors">Cek Status Tagihan</a></li>
              <li><Link href="/login" className="hover:text-[#3c8dbc] transition-colors">Login Portal</Link></li>
              <li><Link href="/register" className="hover:text-[#3c8dbc] transition-colors">Pendaftaran Akun</Link></li>
              <li><Link href="/eksekutif" className="hover:text-[#3c8dbc] transition-colors">Portal Eksekutif (Dashboard)</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">Kantor & Layanan</h4>
            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#3c8dbc] shrink-0 mt-0.5" />
                <span>Dinas Perhubungan Kab. Mimika / UPBU Mozes Kilangin, Jalan Cenderawasih, Timika, Papua Tengah</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#3c8dbc] shrink-0" />
                <span>dishub@mimikakab.go.id</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} Dinas Perhubungan Kabupaten Mimika. Hak Cipta Dilindungi.
          </div>
          <div className="text-[11px] text-gray-400">
            UPBU Mozes Kilangin • Bank Papua Host-to-Host
          </div>
        </div>

      </div>
    </footer>
  );
}
