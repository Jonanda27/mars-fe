import React, { forwardRef } from 'react';
import { Contract } from '@/types/contract';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { formatRupiah } from '@/utils/formatCurrency';

dayjs.locale('id');

interface SuratPKSProps {
  contract: Contract;
}

const SuratPKS = forwardRef<HTMLDivElement, SuratPKSProps>(({ contract }, ref) => {
  const tanggalHariIni = dayjs(contract.created_at).format('DD MMMM YYYY');
  
  return (
    <div 
      ref={ref} 
      className="bg-white text-black p-12 mx-auto w-full max-w-[210mm] min-h-[297mm] shadow-sm border border-slate-200 print:shadow-none print:border-none"
      style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '12pt', lineHeight: '1.5' }}
    >
      <div className="text-center mb-8 font-bold underline text-[14pt]">
        SURAT PERJANJIAN KERJASAMA
      </div>

      <div className="mb-4">
        Saya yang bertanda tangan di bawah ini :
      </div>

      <table className="w-full mb-4">
        <tbody>
          <tr>
            <td className="w-48 align-top">Nama</td>
            <td className="w-4 align-top">:</td>
            <td>Admin UPBU Bandara Mimika</td>
          </tr>
          <tr>
            <td className="align-top">Jabatan</td>
            <td className="align-top">:</td>
            <td>Kepala UPBU / Pejabat Berwenang</td>
          </tr>
          <tr>
            <td className="align-top">Instansi</td>
            <td className="align-top">:</td>
            <td>Kantor UPBU Bandara Mimika</td>
          </tr>
        </tbody>
      </table>
      <div className="mb-4">Yang mana selanjutnya akan disebut sebagai <b>Pihak Pertama</b>.</div>

      <table className="w-full mb-4">
        <tbody>
          <tr>
            <td className="w-48 align-top">Nama / Perusahaan</td>
            <td className="w-4 align-top">:</td>
            <td>{contract.tenants?.nama_perusahaan || '-'}</td>
          </tr>
          <tr>
            <td className="align-top">PIC / Penanggung Jawab</td>
            <td className="align-top">:</td>
            <td>{contract.tenants?.pic || '-'}</td>
          </tr>
          <tr>
            <td className="align-top">Alamat</td>
            <td className="align-top">:</td>
            <td>{contract.tenants?.alamat || '-'}</td>
          </tr>
        </tbody>
      </table>
      <div className="mb-8">Selanjutnya akan disebut dengan <b>Pihak Kedua</b>.</div>

      <div className="mb-4 text-justify">
        Kedua belah pihak telah sepakat untuk mengadakan perjanjian sewa/penggunaan barang milik negara berupa {contract.assets?.nama_aset} dengan ketentuan-ketentuan yang diatur sebagai berikut ini :
      </div>

      <div className="text-center font-bold mb-2 mt-6">PASAL 1</div>
      <div className="text-justify mb-4">
        Dalam perjanjian ini Pihak Pertama memberikan hak kepada Pihak Kedua untuk menggunakan/menyewa <b>{contract.assets?.nama_aset}</b> seluas <b>{contract.luas} {contract.assets?.satuan}</b> yang berlokasi di {contract.assets?.lokasi}.
      </div>

      <div className="text-center font-bold mb-2 mt-6">PASAL 2</div>
      <div className="text-justify mb-4">
        Atas penggunaan aset tersebut, Pihak Kedua wajib membayar retribusi sebesar <b>{formatRupiah(contract.total_amount || 0)}</b>. Pembayaran dilakukan secara {contract.periode_pembayaran} sesuai tagihan SKRD yang diterbitkan.
      </div>

      <div className="text-center font-bold mb-2 mt-6">PASAL 3</div>
      <div className="text-justify mb-4">
        Masa berlaku perjanjian ini adalah mulai tanggal <b>{dayjs(contract.start_date).format('DD MMMM YYYY')}</b> sampai dengan <b>{dayjs(contract.end_date).format('DD MMMM YYYY')}</b>, dan dapat diperpanjang atas kesepakatan kedua belah pihak.
      </div>

      <div className="text-center font-bold mb-2 mt-6">PASAL 4</div>
      <div className="text-justify mb-8">
        Demikian surat perjanjian ini kami buat sebenar-benarnya dalam rangkap dua yang mana masing-masing rangkap mempunyai kekuatan hukum yang sama. Dan dalam pembuatan perjanjian kerjasama ini tidak ada paksaan dari pihak manapun.
      </div>

      <div className="text-right mb-10">
        Mimika, {tanggalHariIni}
      </div>

      <div className="flex justify-between text-center px-4">
        <div className="w-1/3 flex flex-col items-center">
          <div className="mb-2">Pihak Pertama,</div>
          <div className="h-24 w-full flex items-center justify-center border-b border-dotted border-black/30 mb-2 relative">
            {contract.admin_signature ? (
              <img src={contract.admin_signature} alt="TTE Admin" className="h-20 object-contain mix-blend-multiply" />
            ) : (
              <span className="text-gray-300 italic text-sm">(Tanda Tangan TTE)</span>
            )}
          </div>
          <div>Admin UPBU</div>
        </div>

        <div className="w-1/3 flex flex-col items-center justify-end">
          <div className="text-sm">(Materai 10000)</div>
        </div>

        <div className="w-1/3 flex flex-col items-center">
          <div className="mb-2">Pihak Kedua,</div>
          <div className="h-24 w-full flex items-center justify-center border-b border-dotted border-black/30 mb-2 relative">
            {contract.tenant_signature ? (
              <img src={contract.tenant_signature} alt="TTE Tenant" className="h-20 object-contain mix-blend-multiply" />
            ) : (
              <span className="text-gray-300 italic text-sm">(Tanda Tangan TTE)</span>
            )}
          </div>
          <div>{contract.tenants?.pic || 'Pimpinan Perusahaan'}</div>
        </div>
      </div>
    </div>
  );
});

SuratPKS.displayName = 'SuratPKS';
export default SuratPKS;
