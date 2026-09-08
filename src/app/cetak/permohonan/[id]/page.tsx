"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/services/api';

export default function CetakPermohonan() {
  const { id } = useParams() as { id: string };
  const [app, setApp] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await api.get(`/rentals/${id}`);
      setApp(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!app) return <div className="p-10">Loading...</div>;

  return (
    <div className="bg-gray-100 text-black min-h-screen p-8 print:p-0 print:bg-white">
      {/* Hide on print, show on screen */}
      <div className="mb-6 print:hidden max-w-[210mm] mx-auto flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold mb-1">Pratinjau Cetak</h2>
          <p className="text-sm text-gray-500">Gunakan kertas A4 dan centang "Background graphics" saat mencetak.</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-700 font-bold flex items-center"
        >
          Cetak ke PDF
        </button>
      </div>

      {/* A4 Print Container */}
      <div className="max-w-[210mm] mx-auto bg-white print:w-[210mm] print:h-[297mm] print:shadow-none shadow-xl border border-gray-200 p-[20mm]">
        
        {/* Header / Kop Surat */}
        <div className="text-center border-b-2 border-black pb-4 mb-6">
          <h1 className="text-2xl font-bold uppercase tracking-wider">Pemerintah Kabupaten Mimika</h1>
          <h2 className="text-xl font-bold uppercase">Dinas Perhubungan</h2>
          <p className="text-sm">UPBU Bandara Moses Kilangin, Timika - Papua Tengah</p>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h3 className="text-lg font-bold underline uppercase">Surat Persetujuan Sewa / Penggunaan Aset</h3>
          <p className="text-sm mt-1">Nomor: {app.application_number}</p>
        </div>

        {/* Body */}
        <div className="space-y-4 text-justify text-sm leading-relaxed">
          <p>Berdasarkan permohonan yang diajukan oleh pihak penyewa, dengan ini Kepala Dinas Perhubungan Kabupaten Mimika memberikan persetujuan sewa/penggunaan aset kepada:</p>
          
          <table className="w-full ml-4 mb-4">
            <tbody>
              <tr>
                <td className="w-1/3 py-1 font-semibold">Nama Perusahaan</td>
                <td className="w-4 py-1">:</td>
                <td className="py-1">{app.tenants?.nama_perusahaan}</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">Tujuan Penggunaan</td>
                <td className="py-1">:</td>
                <td className="py-1">{app.purpose}</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">Aset yang Disewa</td>
                <td className="py-1">:</td>
                <td className="py-1">{app.assets?.nama_aset} ({app.assets?.jenis_aset})</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">Periode Sewa</td>
                <td className="py-1">:</td>
                <td className="py-1">
                  {app.start_date ? new Date(app.start_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : '-'} s/d {app.end_date ? new Date(app.end_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : '-'}
                </td>
              </tr>
            </tbody>
          </table>

          {app.specific_needs?.aircraft_details && (
            <div className="mt-4">
              <p className="font-semibold mb-2">Rincian Armada Pesawat:</p>
              <table className="w-full border-collapse border border-gray-400 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-400 p-2 text-left">Registrasi</th>
                    <th className="border border-gray-400 p-2 text-left">Tipe Pesawat</th>
                    <th className="border border-gray-400 p-2 text-left">MTOW (Kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {app.specific_needs.aircraft_details.map((ac: any) => (
                    <tr key={ac.id}>
                      <td className="border border-gray-400 p-2">{ac.registration_number}</td>
                      <td className="border border-gray-400 p-2">{ac.aircraft_type || ac.aircraft_types?.jenis_pesawat}</td>
                      <td className="border border-gray-400 p-2">{ac.mtow ? ac.mtow.toLocaleString('id-ID') : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-6">
            Persetujuan ini merupakan bagian yang tidak terpisahkan dari Kontrak Payung 1 Tahun yang berlaku. Dokumen ini sah digunakan sebagai dasar pencatatan operasional (Check-in/Check-out) oleh petugas lapangan serta sebagai dasar perhitungan penagihan retribusi SKRD.
          </p>
        </div>

        {/* Signature Area */}
        <div className="mt-16 flex justify-between text-sm">
          <div className="text-center w-1/3">
            <p className="mb-20">Pihak Penyewa (Tenant),</p>
            <div className="border-b border-black w-4/5 mx-auto"></div>
            <p className="mt-1 font-bold">{app.tenants?.nama_perusahaan}</p>
          </div>
          
          <div className="text-center w-1/3">
            <p className="mb-1">Timika, {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
            <p className="mb-16">Menyetujui,</p>
            <div className="border-b border-black w-4/5 mx-auto"></div>
            <p className="mt-1 font-bold">Kepala Dinas Perhubungan</p>
          </div>
        </div>

      </div>
    </div>
  );
}
