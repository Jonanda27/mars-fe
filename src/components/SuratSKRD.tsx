import React, { forwardRef } from 'react';
import { Invoice } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

interface SuratSKRDProps {
  invoice: Invoice;
}

const SuratSKRD = forwardRef<HTMLDivElement, SuratSKRDProps>(({ invoice }, ref) => {
  const contract = invoice.contracts;
  const tenant = contract?.tenants;
  const asset = contract?.assets;

  return (
    <div 
      ref={ref} 
      className="p-10 shadow-lg" 
      style={{ 
        width: '210mm', 
        minHeight: '297mm', 
        fontFamily: '"Times New Roman", Times, serif',
        color: '#000000',
        backgroundColor: '#ffffff',
        lineHeight: 1.5,
        boxSizing: 'border-box'
      }}
    >
      {/* Kop Surat SKRD */}
      <div className="flex pb-4 mb-6" style={{ borderBottom: '4px double #000000' }}>
        <div className="w-1/6 flex justify-center items-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Lambang_Kabupaten_Mimika.png/438px-Lambang_Kabupaten_Mimika.png" alt="Logo Mimika" className="w-20" />
        </div>
        <div className="w-5/6 text-center">
          <h2 className="text-xl font-bold uppercase">Pemerintah Kabupaten Mimika</h2>
          <h1 className="text-2xl font-bold uppercase">Dinas Perhubungan</h1>
          <p className="text-sm">Jln. Cenderawasih, SP2, Timika, Papua Tengah 99910</p>
          <p className="text-sm">Email: dishub@mimikakab.go.id</p>
        </div>
      </div>

      {/* Judul SKRD */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold underline">SURAT KETETAPAN RETRIBUSI DAERAH (e-SKRD)</h3>
        <p className="font-bold">Nomor: {invoice.invoice_number}</p>
      </div>

      {/* Identitas Wajib Retribusi */}
      <div className="mb-6">
        <p>Berdasarkan Peraturan Daerah Kabupaten Mimika Nomor 25 Tahun 2024 tentang Retribusi Jasa Usaha, telah ditetapkan retribusi daerah kepada:</p>
        <table className="mt-4 ml-4">
          <tbody>
            <tr>
              <td className="w-48 align-top">Nama Perusahaan / Wajib Retribusi</td>
              <td className="w-4 align-top">:</td>
              <td className="font-bold">{tenant?.nama_perusahaan || '-'}</td>
            </tr>
            <tr>
              <td className="align-top">NPWP</td>
              <td className="align-top">:</td>
              <td>{tenant?.npwp || '-'}</td>
            </tr>
            <tr>
              <td className="align-top">Alamat Lengkap</td>
              <td className="align-top">:</td>
              <td>{tenant?.alamat || '-'}</td>
            </tr>
            <tr>
              <td className="align-top">Nomor Kontrak (PKS)</td>
              <td className="align-top">:</td>
              <td>{contract?.contract_number || '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Rincian Ketetapan */}
      <div className="mb-8">
        <p className="mb-2">Dengan rincian ketetapan sebagai berikut:</p>
        <table className="w-full border-collapse text-sm" style={{ border: '1px solid #000000' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th className="py-2 px-3" style={{ border: '1px solid #000000' }}>No.</th>
              <th className="py-2 px-3" style={{ border: '1px solid #000000' }}>Kode Rekening</th>
              <th className="py-2 px-3" style={{ border: '1px solid #000000' }}>Uraian / Objek Retribusi</th>
              <th className="py-2 px-3" style={{ border: '1px solid #000000' }}>Periode Pemakaian</th>
              <th className="py-2 px-3" style={{ border: '1px solid #000000' }}>Jumlah Ketetapan (Rp)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-3 text-center" style={{ border: '1px solid #000000' }}>1</td>
              <td className="py-2 px-3 text-center" style={{ border: '1px solid #000000' }}>4.1.2.02.01</td>
              <td className="py-2 px-3" style={{ border: '1px solid #000000' }}>
                Sewa {asset?.jenis_aset} - {asset?.nama_aset}
                <div className="text-xs mt-1">Dasar Pengenaan: Tarif Rp {contract?.tarif_satuan ? Number(contract.tarif_satuan).toLocaleString('id-ID') : 0} {contract?.periode_pembayaran === 'Harian' ? '/ Malam' : '/ m² / Bulan'}</div>
              </td>
              <td className="py-2 px-3 text-center" style={{ border: '1px solid #000000' }}>
                {contract?.start_date ? dayjs(contract.start_date).format('DD MMM YYYY') : '-'} <br/> s/d <br/> {contract?.end_date ? dayjs(contract.end_date).format('DD MMM YYYY') : '-'}
              </td>
              <td className="py-2 px-3 text-right font-bold" style={{ border: '1px solid #000000' }}>
                {formatRupiah(Number(invoice.amount))}
              </td>
            </tr>
            {Number(contract?.deposit_jaminan) > 0 && (
              <tr>
                <td className="py-2 px-3 text-center" style={{ border: '1px solid #000000' }}>2</td>
                <td className="py-2 px-3 text-center" style={{ border: '1px solid #000000' }}>4.1.2.02.99</td>
                <td className="py-2 px-3" style={{ border: '1px solid #000000' }}>Deposit Jaminan Sewa (Refundable)</td>
                <td className="py-2 px-3 text-center" style={{ border: '1px solid #000000' }}>-</td>
                <td className="py-2 px-3 text-right font-bold" style={{ border: '1px solid #000000' }}>
                  {formatRupiah(Number(contract?.deposit_jaminan))}
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="font-bold" style={{ backgroundColor: '#f3f4f6' }}>
              <td colSpan={4} className="py-2 px-3 text-right" style={{ border: '1px solid #000000' }}>TOTAL KETETAPAN</td>
              <td className="py-2 px-3 text-right" style={{ border: '1px solid #000000' }}>
                {formatRupiah(Number(invoice.amount) + Number(contract?.deposit_jaminan || 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Info Jatuh Tempo & QR */}
      <div className="flex justify-between items-start p-4 mb-8" style={{ border: '1px solid #000000' }}>
        <div className="w-2/3">
          <p className="mb-2"><strong>Perhatian:</strong></p>
          <ol className="list-decimal ml-4 text-sm">
            <li>Pembayaran retribusi dilakukan melalui Rekening Kas Umum Daerah (RKUD) Kabupaten Mimika.</li>
            <li>SKRD ini berlaku sebagai alat bukti penetapan tagihan yang sah.</li>
            <li>Keterlambatan pembayaran akan dikenakan sanksi administrasi berupa bunga/denda sesuai ketentuan yang berlaku.</li>
          </ol>
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid #d1d5db' }}>
            <p className="text-sm">Jatuh Tempo Pembayaran: <strong className="text-lg" style={{ color: '#dc2626' }}>{dayjs(invoice.due_date).format('DD MMMM YYYY')}</strong></p>
            <p className="text-sm font-bold mt-1">Status: {invoice.status === 'Paid' ? <span style={{ color: '#16a34a' }}>LUNAS</span> : <span style={{ color: '#dc2626' }}>BELUM DIBAYAR</span>}</p>
          </div>
        </div>
        <div className="w-1/3 flex flex-col items-center justify-center pl-4" style={{ borderLeft: '1px solid #d1d5db' }}>
          <div className="w-24 h-24 flex items-center justify-center mb-2" style={{ backgroundColor: '#e5e7eb' }}>
            <span className="text-xs" style={{ color: '#6b7280' }}>QR CODE</span>
          </div>
          <p className="text-[10px] text-center" style={{ color: '#6b7280' }}>Scan untuk Validasi<br/>dan Bayar via QRIS</p>
        </div>
      </div>

      {/* Tanda Tangan */}
      <div className="flex justify-end mt-12">
        <div className="w-64 text-center">
          <p className="mb-1">Timika, {dayjs(invoice.created_at).format('DD MMMM YYYY')}</p>
          <p className="font-bold mb-20">Kepala Dinas Perhubungan<br/>Kabupaten Mimika</p>
          <div className="w-full h-px mb-1" style={{ backgroundColor: '#000000' }}></div>
          <p className="font-bold">NIP. 19700101 199001 1 001</p>
        </div>
      </div>
    </div>
  );
});

SuratSKRD.displayName = 'SuratSKRD';
export default SuratSKRD;
