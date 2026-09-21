import React, { forwardRef } from 'react';
import { RetributionReportData } from '@/services/reportService';
import { formatRupiah } from '@/utils/formatCurrency';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

interface LaporanRealisasiPDFProps {
  reportData: RetributionReportData;
}

const LaporanRealisasiPDF = forwardRef<HTMLDivElement, LaporanRealisasiPDFProps>(({ reportData }, ref) => {
  const { meta, summary, account_breakdown, invoices } = reportData;

  const totalRealisasiPokok = account_breakdown.reduce((s, a) => s + a.realisasi_pokok, 0);
  const totalRealisasiDenda = account_breakdown.reduce((s, a) => s + a.realisasi_denda, 0);
  const totalRealisasiSemua = summary.total_realisasi_kas_masuk;
  const totalPiutangSemua = summary.total_piutang_menunggak;
  const totalKetetapanSemua = summary.total_ketetapan_terbit;

  return (
    <div 
      ref={ref} 
      style={{ 
        fontFamily: 'Arial, sans-serif', 
        color: '#000000', 
        lineHeight: 1.3,
        width: '210mm',
        minHeight: '297mm',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        padding: '16mm 14mm'
      }}
      className="shadow-xl mx-auto"
    >
      {/* KOP SURAT DINAS PEMERINTAH */}
      <div className="border-b-2 border-black pb-2 mb-4 text-center">
        <h3 className="font-bold text-sm tracking-wide uppercase">
          PEMERINTAH KABUPATEN MIMIKA
        </h3>
        <h2 className="font-extrabold text-base tracking-wide uppercase">
          DINAS PERHUBUNGAN
        </h2>
        <h4 className="font-bold text-xs uppercase text-slate-800">
          UNIT PENYELENGGARA BANDAR UDARA (UPBU) MOZES KILANGIN TIMIKA
        </h4>
        <p className="text-[10px] text-slate-600 mt-0.5">
          Jl. Bandara Mozes Kilangin, Timika - Papua Tengah | Telp: (0901) 321888 | Email: dishub@mimikakab.go.id
        </p>
      </div>

      {/* JUDUL LAPORAN */}
      <div className="text-center mb-5">
        <h2 className="font-bold text-sm uppercase underline">
          LAPORAN REKAPITULASI REALISASI PENERIMAAN RETRIBUSI DAERAH
        </h2>
        <p className="font-bold text-xs text-slate-800 mt-0.5">
          Periode: {meta.period_label}
        </p>
      </div>

      {/* BAGIAN I: TABEL REKAPITULASI KODE REKENING PAD */}
      <div className="mb-6">
        <div className="font-bold text-xs mb-1.5 uppercase text-slate-900">
          I. REKAPITULASI REALISASI BERDASARKAN KODE REKENING RETRIBUSI
        </div>

        <table className="w-full border-collapse border border-black text-[10.5px]">
          <thead>
            <tr className="bg-slate-100 text-center font-bold">
              <th className="border border-black p-1.5 w-8">No</th>
              <th className="border border-black p-1.5 w-24">Kode Rekening</th>
              <th className="border border-black p-1.5 text-left">Uraian Jenis Retribusi Daerah</th>
              <th className="border border-black p-1.5 text-right w-24">Realisasi Pokok</th>
              <th className="border border-black p-1.5 text-right w-20">Realisasi Denda</th>
              <th className="border border-black p-1.5 text-right w-24 bg-emerald-50">Total Kas Masuk</th>
              <th className="border border-black p-1.5 text-right w-24 bg-red-50">Piutang Menunggak</th>
              <th className="border border-black p-1.5 text-right w-24">Total Ketetapan</th>
            </tr>
          </thead>
          <tbody>
            {account_breakdown.map((item, idx) => (
              <tr key={item.account_code}>
                <td className="border border-black p-1.5 text-center font-medium">{idx + 1}</td>
                <td className="border border-black p-1.5 text-center font-mono font-bold">{item.account_code}</td>
                <td className="border border-black p-1.5 font-bold">{item.account_name}</td>
                <td className="border border-black p-1.5 text-right">{item.realisasi_pokok.toLocaleString('id-ID')}</td>
                <td className="border border-black p-1.5 text-right text-red-700">{item.realisasi_denda.toLocaleString('id-ID')}</td>
                <td className="border border-black p-1.5 text-right font-bold bg-emerald-50/50">
                  {item.total_realisasi.toLocaleString('id-ID')}
                </td>
                <td className="border border-black p-1.5 text-right font-bold text-red-700 bg-red-50/50">
                  {item.piutang_menunggak.toLocaleString('id-ID')}
                </td>
                <td className="border border-black p-1.5 text-right font-bold">
                  {item.total_ketetapan_terbit.toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
            
            {/* TOTAL BARIS */}
            <tr className="bg-slate-200 font-bold">
              <td colSpan={3} className="border border-black p-2 text-center uppercase">
                JUMLAH TOTAL PENERIMAAN RETRIBUSI PAD
              </td>
              <td className="border border-black p-2 text-right">{totalRealisasiPokok.toLocaleString('id-ID')}</td>
              <td className="border border-black p-2 text-right text-red-700">{totalRealisasiDenda.toLocaleString('id-ID')}</td>
              <td className="border border-black p-2 text-right bg-emerald-100 text-emerald-950 font-black">
                {totalRealisasiSemua.toLocaleString('id-ID')}
              </td>
              <td className="border border-black p-2 text-right bg-red-100 text-red-950 font-black">
                {totalPiutangSemua.toLocaleString('id-ID')}
              </td>
              <td className="border border-black p-2 text-right font-black">
                {totalKetetapanSemua.toLocaleString('id-ID')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* BAGIAN II: RINCIAN SKRD & BUKU PENERIMAAN */}
      <div className="mb-6">
        <div className="font-bold text-xs mb-1.5 uppercase text-slate-900">
          II. DAFTAR KETETAPAN &amp; REALISASI PEMBAYARAN SKRD
        </div>

        <table className="w-full border-collapse border border-black text-[9.5px]">
          <thead>
            <tr className="bg-slate-100 text-center font-bold">
              <th className="border border-black p-1 w-6">No</th>
              <th className="border border-black p-1 text-left">Nomor SKRD</th>
              <th className="border border-black p-1 text-left">Wajib Retribusi (Tenant)</th>
              <th className="border border-black p-1 text-left">Objek / Layanan</th>
              <th className="border border-black p-1 w-16">Tgl Terbit</th>
              <th className="border border-black p-1 w-16">Tgl Bayar</th>
              <th className="border border-black p-1 text-right w-16">Pokok (Rp)</th>
              <th className="border border-black p-1 text-right w-14">Denda (Rp)</th>
              <th className="border border-black p-1 text-right w-16">Total (Rp)</th>
              <th className="border border-black p-1 text-center w-14">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, idx) => (
              <tr key={inv.id} className={idx % 2 === 1 ? 'bg-slate-50' : ''}>
                <td className="border border-black p-1 text-center">{idx + 1}</td>
                <td className="border border-black p-1 font-mono font-bold">{inv.invoice_number}</td>
                <td className="border border-black p-1 font-medium">{inv.tenant_name}</td>
                <td className="border border-black p-1">{inv.asset_name}</td>
                <td className="border border-black p-1 text-center">{dayjs(inv.created_at).format('DD/MM/YY')}</td>
                <td className="border border-black p-1 text-center">
                  {inv.payment_date ? dayjs(inv.payment_date).format('DD/MM/YY') : '-'}
                </td>
                <td className="border border-black p-1 text-right">{inv.amount.toLocaleString('id-ID')}</td>
                <td className="border border-black p-1 text-right text-red-600">
                  {inv.penalty_amount > 0 ? inv.penalty_amount.toLocaleString('id-ID') : '-'}
                </td>
                <td className="border border-black p-1 text-right font-bold">
                  {inv.total_amount.toLocaleString('id-ID')}
                </td>
                <td className="border border-black p-1 text-center font-bold uppercase">
                  {inv.status === 'Paid' ? (
                    <span className="text-emerald-800">Lunas</span>
                  ) : inv.status === 'Cancelled' ? (
                    <span className="text-gray-500 line-through">Batal</span>
                  ) : (
                    <span className="text-red-700">Piutang</span>
                  )}
                </td>
              </tr>
            ))}

            {invoices.length === 0 && (
              <tr>
                <td colSpan={10} className="border border-black p-4 text-center text-slate-500 italic">
                  Tidak ada data transaksi SKRD pada periode laporan ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* LEMBAR PENGESAHAN TANDA TANGAN (SESUAI OPSI A) */}
      <div className="mt-8 pt-4 border-t border-slate-300">
        <div className="flex justify-between items-start text-xs">
          
          {/* Kolom Kiri: Mengetahui Kadis */}
          <div className="text-center w-5/12 flex flex-col justify-between h-36">
            <div>
              <p>Mengetahui,</p>
              <p className="font-bold uppercase">KEPALA DINAS PERHUBUNGAN</p>
              <p className="font-bold uppercase">KABUPATEN MIMIKA</p>
            </div>
            <div>
              <p className="font-bold underline uppercase">JANIA BASIK-BASIK, S.STP., M.Si</p>
              <p className="text-[11px]">Pembina Tingkat I (IV/b)</p>
              <p className="text-[11px]">NIP. 19780101 199801 1 002</p>
            </div>
          </div>

          {/* Kolom Kanan: Bendahara Penerimaan */}
          <div className="text-center w-5/12 flex flex-col justify-between h-36">
            <div>
              <p>Timika, {dayjs().format('DD MMMM YYYY')}</p>
              <p className="font-bold uppercase">BENDAHARA PENERIMAAN</p>
              <p className="font-bold uppercase">UPBU MOZES KILANGIN TIMIKA</p>
            </div>
            <div>
              <p className="font-bold underline uppercase">YOHANES MATURBONGS, A.Md</p>
              <p className="text-[11px]">Penata Muda (III/a)</p>
              <p className="text-[11px]">NIP. 19850612 201001 1 005</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
});

LaporanRealisasiPDF.displayName = 'LaporanRealisasiPDF';
export default LaporanRealisasiPDF;
