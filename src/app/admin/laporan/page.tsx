"use client";

import React, { useState } from 'react';
import { 
  FileSpreadsheet, Download, Calendar, Printer, 
  BarChart, TrendingUp, Building2, Car, Clock, DollarSign 
} from 'lucide-react';

export default function AdminLaporanPage() {
  const [periodeAwal, setPeriodeAwal] = useState('2026-01');
  const [periodeAkhir, setPeriodeAkhir] = useState('2026-09');

  const laporanList = [
    { 
      id: 'realisasi', 
      nama: 'Laporan Realisasi Pendapatan Retribusi', 
      deskripsi: 'Ringkasan penerimaan retribusi sewa aset dan parkir vs target APBD per periode.',
      icon: <TrendingUp className="w-6 h-6" />,
      warna: '#00a65a',
      format: ['Excel (.xlsx)', 'PDF']
    },
    { 
      id: 'target', 
      nama: 'Laporan Target vs Capaian (Achievement)', 
      deskripsi: 'Perbandingan target PAD retribusi bandara dengan realisasi pencapaian, disertai persentase capaian.',
      icon: <BarChart className="w-6 h-6" />,
      warna: '#3c8dbc',
      format: ['Excel (.xlsx)', 'PDF']
    },
    { 
      id: 'piutang', 
      nama: 'Laporan Aging Piutang (Outstanding)', 
      deskripsi: 'Rincian piutang tenant per kelompok umur (0-30, 31-60, 61-90, >90 hari) untuk kebutuhan audit BPK.',
      icon: <Clock className="w-6 h-6" />,
      warna: '#dd4b39',
      format: ['Excel (.xlsx)', 'PDF']
    },
    { 
      id: 'kontrak', 
      nama: 'Laporan Status Kontrak PKS', 
      deskripsi: 'Daftar seluruh kontrak sewa beserta status lifecycle (Active, Expiring, Expired, Terminated).',
      icon: <FileSpreadsheet className="w-6 h-6" />,
      warna: '#f39c12',
      format: ['Excel (.xlsx)', 'PDF']
    },
    { 
      id: 'utilisasi', 
      nama: 'Laporan Utilisasi Aset Bandara', 
      deskripsi: 'Tingkat keterisian hanggar, ruang kantor, gudang, dan lahan. Mengukur potensi PAD yang belum termanfaatkan.',
      icon: <Building2 className="w-6 h-6" />,
      warna: '#605ca8',
      format: ['Excel (.xlsx)', 'PDF']
    },
    { 
      id: 'parkir', 
      nama: 'Laporan Transaksi Parkir Bandara', 
      deskripsi: 'Rekap harian/bulanan transaksi parkir kendaraan roda 2, 4, 6+ beserta pendapatan per zona dan metode bayar.',
      icon: <Car className="w-6 h-6" />,
      warna: '#00c0ef',
      format: ['Excel (.xlsx)', 'PDF']
    },
    { 
      id: 'rekonsiliasi', 
      nama: 'Laporan Rekonsiliasi Kas Daerah', 
      deskripsi: 'Pencocokan data pembayaran SKRD di sistem MARS dengan mutasi rekening bank daerah (Kasda).',
      icon: <DollarSign className="w-6 h-6" />,
      warna: '#001f3f',
      format: ['Excel (.xlsx)', 'PDF']
    },
  ];

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4">
      <header className="flex justify-between items-end">
        <h1 className="text-[20px] font-normal text-[#333] uppercase">
          Pusat Cetak Laporan
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Admin</span> / <span className="ml-1 font-medium">Laporan</span>
        </div>
      </header>

      {/* Panel Filter Periode */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm p-5">
        <div className="flex flex-col md:flex-row items-end gap-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#3c8dbc]" />
            <h3 className="text-[16px] text-[#444] font-bold">Periode Laporan</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 text-[14px]">
            <div>
              <label className="block mb-1 font-bold text-[#555] text-[12px] uppercase">Dari Bulan</label>
              <input 
                type="month" 
                value={periodeAwal}
                onChange={(e) => setPeriodeAwal(e.target.value)}
                className="p-2 border border-[#d2d6de] focus:border-[#3c8dbc] focus:outline-none min-w-[180px]" 
              />
            </div>
            <div>
              <label className="block mb-1 font-bold text-[#555] text-[12px] uppercase">Sampai Bulan</label>
              <input 
                type="month" 
                value={periodeAkhir}
                onChange={(e) => setPeriodeAkhir(e.target.value)}
                className="p-2 border border-[#d2d6de] focus:border-[#3c8dbc] focus:outline-none min-w-[180px]" 
              />
            </div>
          </div>

          <p className="text-[13px] text-[#777] italic ml-auto">
            Pilih periode lalu klik tombol <strong>"Unduh"</strong> pada jenis laporan yang diinginkan.
          </p>
        </div>
      </div>

      {/* Daftar Jenis Laporan */}
      <div className="grid grid-cols-1 gap-4 mt-2">
        {laporanList.map((laporan) => (
          <div 
            key={laporan.id} 
            className="bg-white shadow-sm flex flex-col sm:flex-row items-stretch hover:shadow-md transition-shadow"
          >
            {/* Icon & Nama */}
            <div 
              className="flex items-center justify-center p-6 text-white flex-shrink-0 w-full sm:w-20"
              style={{ backgroundColor: laporan.warna }}
            >
              {laporan.icon}
            </div>
            
            {/* Deskripsi */}
            <div className="flex-1 p-5 flex flex-col justify-center">
              <h4 className="text-[15px] font-bold text-[#333] mb-1">{laporan.nama}</h4>
              <p className="text-[13px] text-[#666]">{laporan.deskripsi}</p>
            </div>

            {/* Tombol Aksi */}
            <div className="flex items-center gap-2 p-5 flex-shrink-0 border-t sm:border-t-0 sm:border-l border-[#f4f4f4]">
              {laporan.format.map((fmt) => (
                <button 
                  key={fmt}
                  className="flex items-center bg-white border border-[#d2d6de] hover:bg-[#f4f4f4] text-[#444] font-bold text-[12px] px-4 py-2 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4 mr-1" style={{ color: laporan.warna }} /> {fmt}
                </button>
              ))}
              <button 
                className="flex items-center bg-white border border-[#d2d6de] hover:bg-[#f4f4f4] text-[#444] font-bold text-[12px] px-4 py-2 transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4 mr-1 text-[#555]" /> Cetak
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
