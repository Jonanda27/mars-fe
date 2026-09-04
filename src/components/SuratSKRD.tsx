import React, { forwardRef } from 'react';
import { Invoice } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

const terbilang = (angka: number): string => {
  const bilne = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
  if (angka < 12) return bilne[angka];
  if (angka < 20) return terbilang(angka - 10) + " Belas";
  if (angka < 100) return terbilang(Math.floor(angka / 10)) + " Puluh " + terbilang(angka % 10);
  if (angka < 200) return "Seratus " + terbilang(angka - 100);
  if (angka < 1000) return terbilang(Math.floor(angka / 100)) + " Ratus " + terbilang(angka % 100);
  if (angka < 2000) return "Seribu " + terbilang(angka - 1000);
  if (angka < 1000000) return terbilang(Math.floor(angka / 1000)) + " Ribu " + terbilang(angka % 1000);
  if (angka < 1000000000) return terbilang(Math.floor(angka / 1000000)) + " Juta " + terbilang(angka % 1000000);
  if (angka < 1000000000000) return terbilang(Math.floor(angka / 1000000000)) + " Miliar " + terbilang(angka % 1000000000);
  return "";
}

const toTerbilang = (angka: number) => {
    if (angka === 0) return 'Nol Rupiah';
    return (terbilang(angka).trim().replace(/\s+/g, ' ') + ' Rupiah').replace('  ', ' ');
}

interface SuratSKRDProps {
  invoice: Invoice;
}

const SuratSKRD = forwardRef<HTMLDivElement, SuratSKRDProps>(({ invoice }, ref) => {
  const contract = invoice.contracts;
  const tenant = contract?.tenants;
  const asset = contract?.assets;
  
  const baseAmount = Number(invoice.amount);
  const penaltyAmount = Number(invoice.penalty_amount || 0);
  const totalAmount = baseAmount + penaltyAmount;

  return (
    <div ref={ref} style={{ fontFamily: 'Arial, sans-serif', color: '#000000', lineHeight: 1.3 }}>
      
      {/* HALAMAN 1: SKRD UTAMA */}
      <div 
        className="p-8 shadow-lg mb-8 mx-auto" 
        style={{ 
          width: '210mm', 
          minHeight: '297mm', 
          boxSizing: 'border-box',
          backgroundColor: '#ffffff'
        }}
      >
        <table className="w-full border-collapse border border-black text-sm">
          <tbody>
            {/* Row 1 & 2 */}
            <tr>
              <td rowSpan={2} className="border border-black p-2 w-1/3 text-center align-top font-bold">
                PEMERINTAH KABUPATEN MIMIKA<br/>
                DINAS PERHUBUNGAN<br/>
                UPBU MOZES KILANGIN TIMIKA
              </td>
              <td className="border border-black p-2 text-center w-1/3 font-bold text-xl">
                SKRD
              </td>
              <td className="border border-black p-2 text-center w-1/3" style={{ backgroundColor: '#f9fafb' }}>
                <div className="font-bold">No. SKRD</div>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2">
                <div className="font-bold text-center mb-2">SURAT KETETAPAN RETRIBUSI DAERAH</div>
                <div className="flex text-xs">
                  <div className="w-24">Masa Retribusi</div>
                  <div>: {contract?.start_date ? dayjs(contract.start_date).format('DD-MM-YYYY') : '-'} s/d {contract?.end_date ? dayjs(contract.end_date).format('DD-MM-YYYY') : '-'}</div>
                </div>
                <div className="flex text-xs mt-1">
                  <div className="w-24">Tahun</div>
                  <div>: {dayjs(invoice.created_at).format('YYYY')}</div>
                </div>
              </td>
              <td className="border border-black p-2 text-center align-top">
                <div className="font-bold">{invoice.invoice_number}</div>
                <div className="mt-4 text-xs font-bold">Kode Bayar</div>
                <div className="font-bold">{invoice.id.toString().padStart(6, '0')}</div>
              </td>
            </tr>
            
            {/* Wajib Retribusi */}
            <tr>
              <td colSpan={3} className="border border-black p-3">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="w-32">Nama</td>
                      <td className="w-4">:</td>
                      <td className="font-bold">{tenant?.nama_perusahaan || '-'}</td>
                    </tr>
                    <tr>
                      <td>Alamat</td>
                      <td>:</td>
                      <td className="font-bold">{tenant?.alamat || '-'}</td>
                    </tr>
                    <tr>
                      <td>NPWRD / NPWP</td>
                      <td>:</td>
                      <td className="font-bold">{tenant?.npwp || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            
            {/* Jatuh Tempo */}
            <tr>
              <td colSpan={3} className="border border-black p-2">
                 Tanggal Jatuh Tempo : <span className="font-bold">{dayjs(invoice.due_date).format('DD-MM-YYYY')}</span>
              </td>
            </tr>
            
            {/* Items Header */}
            <tr className="text-center font-bold" style={{ backgroundColor: '#f9fafb' }}>
              <td className="border border-black p-2">Kode Rekening</td>
              <td className="border border-black p-2">Jenis Retribusi Daerah</td>
              <td className="border border-black p-2">Jumlah (Rp.)</td>
            </tr>
            
            {/* Items Body */}
            <tr>
              <td className="border border-black p-2 text-center align-top h-32">
                 4.1.2.02.01
              </td>
              <td className="border border-black p-2 align-top">
                 <div className="font-bold">Sewa {asset?.jenis_aset} - {asset?.nama_aset}</div>
                 <div className="text-xs mt-1">
                   Tarif: Rp {Number(contract?.tarif_satuan || 0).toLocaleString('id-ID')} / 
                   {contract?.periode_pembayaran === 'Harian' ? ' Malam' : ' m² / Bulan'}
                 </div>
              </td>
              <td className="border border-black p-2 text-right align-top font-bold">
                 {baseAmount.toLocaleString('id-ID')}
              </td>
            </tr>

            {/* Denda Keterlambatan */}
            {penaltyAmount > 0 && (
              <tr>
                <td className="border border-black p-2 text-center align-top">
                  4.1.4.01.01
                </td>
                <td className="border border-black p-2 align-top" style={{ color: '#dc2626' }}>
                  <div className="font-bold">Denda Keterlambatan Pembayaran (2% per bulan)</div>
                </td>
                <td className="border border-black p-2 text-right align-top font-bold" style={{ color: '#dc2626' }}>
                  {penaltyAmount.toLocaleString('id-ID')}
                </td>
              </tr>
            )}
            
            {/* Total */}
            <tr>
              <td colSpan={2} className="border border-black p-2 text-right pr-4">
                Jumlah Ketetapan Pokok {penaltyAmount > 0 ? '+ Denda' : ''}
              </td>
              <td className="border border-black p-2 text-right font-bold" style={{ backgroundColor: '#f9fafb' }}>
                {totalAmount.toLocaleString('id-ID')}
              </td>
            </tr>
            
            {/* Terbilang */}
            <tr>
              <td className="border border-black p-2">
                 Dengan huruf
              </td>
              <td colSpan={2} className="border border-black p-2 font-bold italic">
                 {toTerbilang(totalAmount)}
              </td>
            </tr>
            
            {/* Perhatian & Signatures */}
            <tr>
              <td colSpan={3} className="border border-black p-0">
                 <div className="p-2 border-b border-black">
                   <div className="font-bold uppercase">PERHATIAN</div>
                   <ol className="list-decimal ml-6 mt-1 text-xs space-y-1">
                     <li>Penyetoran dilakukan melalui Bendahara Penerima atau Kas Daerah dengan menggunakan SKRD ini.</li>
                     <li>Apabila SKRD ini tidak atau kurang dibayar setelah lewat waktu paling lama 30 hari sejak SKRD ini ditetapkan dikarenakan sanksi administratif berupa bunga sebesar 2 % per bulan.</li>
                   </ol>
                 </div>
                 
                 <div className="flex">
                    <div className="w-1/2 p-4 flex items-center justify-center border-r border-black">
                       <div className="w-28 h-28 border border-dashed flex items-center justify-center text-xs text-center p-2" style={{ borderColor: '#9ca3af', backgroundColor: '#f9fafb', color: '#9ca3af' }}>
                          [QR Code Placeholder]
                       </div>
                    </div>
                    <div className="w-1/2 p-4 text-center flex flex-col justify-between">
                       <div className="mb-16 text-sm">
                          Timika, {dayjs(invoice.created_at).format('DD MMMM YYYY')}<br/>
                          Pejabat Yang Menetapkan
                       </div>
                       <div className="text-sm">
                          <div className="underline font-bold">Kepala UPBU Mozes Kilangin</div>
                          <div>NIP. 19700101 199001 1 001</div>
                       </div>
                    </div>
                 </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* HALAMAN 2: TANDA TERIMA */}
      <div 
        className="p-8 shadow-lg mx-auto" 
        style={{ 
          width: '210mm', 
          minHeight: '297mm', 
          boxSizing: 'border-box',
          pageBreakBefore: 'always',
          backgroundColor: '#ffffff'
        }}
      >
        <table className="w-full border-collapse border border-black text-sm">
          <tbody>
            <tr>
              <td colSpan={3} className="border border-black p-1 text-center font-bold" style={{ backgroundColor: '#f9fafb' }}>
                 No. SKRD: {invoice.invoice_number}
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="border border-black p-2 text-center font-bold">
                 TANDA TERIMA
              </td>
            </tr>
            <tr>
              <td className="w-40 border border-black p-2 border-r-0">NPWRD / NPWP</td>
              <td className="w-4 border-y border-black p-2">:</td>
              <td className="border border-black p-2 border-l-0 font-bold">{tenant?.npwp || '-'}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 border-r-0">Nama</td>
              <td className="border-y border-black p-2">:</td>
              <td className="border border-black p-2 border-l-0 font-bold">{tenant?.nama_perusahaan || '-'}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 border-r-0">Alamat</td>
              <td className="border-y border-black p-2">:</td>
              <td className="border border-black p-2 border-l-0 font-bold">{tenant?.alamat || '-'}</td>
            </tr>
            <tr>
              <td colSpan={3} className="border border-black p-0">
                 <div className="flex">
                   <div className="w-1/2 p-4">
                      <table className="w-full text-xs">
                        <tbody>
                          <tr>
                            <td className="w-28 py-1">Status Pembayaran</td>
                            <td className="w-2 py-1">:</td>
                            <td className="font-bold py-1">
                              {invoice.status === 'Paid' ? 'LUNAS' : invoice.status === 'Overdue' ? 'Overdue (Menunggak)' : 'Belum Lunas'}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-1">Tgl Pembayaran</td>
                            <td className="py-1">:</td>
                            <td className="py-1">{invoice.payment_date ? dayjs(invoice.payment_date).format('DD-MM-YYYY') : '-'}</td>
                          </tr>
                          <tr>
                            <td className="py-1">Pokok</td>
                            <td className="py-1">:</td>
                            <td className="py-1">{baseAmount.toLocaleString('id-ID')}</td>
                          </tr>
                          <tr>
                            <td className="py-1">Denda</td>
                            <td className="py-1">:</td>
                            <td className="py-1 font-bold" style={{ color: '#dc2626' }}>{penaltyAmount.toLocaleString('id-ID')}</td>
                          </tr>
                          <tr>
                            <td className="py-1">Jumlah</td>
                            <td className="py-1">:</td>
                            <td className="font-bold text-base py-1">{totalAmount.toLocaleString('id-ID')}</td>
                          </tr>
                        </tbody>
                      </table>
                   </div>
                   <div className="w-1/2 p-4 text-center text-xs flex flex-col justify-between items-center relative">
                      <div className="text-right w-full" style={{ color: '#6b7280' }}>
                         Timika, .............................. {dayjs().format('YYYY')}
                      </div>
                      <div className="mb-16 mt-4 font-bold">Yang Menerima</div>
                      <div className="w-3/4 border-b border-dashed border-black"></div>
                   </div>
                 </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
});

SuratSKRD.displayName = 'SuratSKRD';
export default SuratSKRD;
