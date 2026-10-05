"use client";

import React from 'react';
import Link from 'next/link';
import { QrCode } from 'lucide-react';

export default function PaymentChannelSection() {
  return (
    <section id="pembayaran" className="py-16 bg-[#f0f7fb] border-b border-gray-200 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3c8dbc] bg-white px-3.5 py-1.5 rounded-full border border-blue-200 inline-block mb-3 shadow-2xs">
              Zero Cash Policy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
              Pembayaran 100% Non-Tunai &amp; Langsung ke Kasda
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Untuk menjamin transparansi, akuntabilitas, dan mencegah pungutan liar, seluruh pembayaran retribusi Bandara Mozes Kilangin wajib dilakukan secara perbankan elektronik. Petugas dilarang keras menerima uang tunai fisik.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3c8dbc] flex items-center justify-center font-bold text-xs">
                    VA
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">Virtual Account Bank Papua</h4>
                </div>
                <p className="text-xs text-gray-500 leading-normal">
                  Tagihan terhubung langsung dengan rekening kas daerah (Kasda). Pelunasan otomatis tercatat tanpa perlu konfirmasi manual.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3c8dbc] flex items-center justify-center font-bold text-xs">
                    <QrCode className="w-4 h-4 text-[#3c8dbc]" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">QRIS Dinamis Nasional</h4>
                </div>
                <p className="text-xs text-gray-500 leading-normal">
                  Tersedia untuk transaksi insidental atau pendaratan darurat. Cukup pindai barcode dari aplikasi mobile banking bank mana pun.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Daftar Akun Mitra Baru
              </h3>
              <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                Bagi maskapai, operator penerbangan charter, atau pemilik usaha bandara yang belum terdaftar, silakan buat akun untuk mengelola armada dan sewa aset Anda.
              </p>

              <div className="space-y-3">
                <Link
                  href="/register"
                  className="w-full py-3 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all text-center block shadow-sm"
                >
                  Pendaftaran Akun Mitra
                </Link>
                <Link
                  href="/login"
                  className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl border border-gray-300 transition-all text-center block"
                >
                  Sudah Punya Akun? Login
                </Link>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                <Link href="/eksekutif" className="text-xs text-[#3c8dbc] font-bold hover:underline">
                  Portal Eksekutif (Dashboard Pimpinan) &rarr;
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
