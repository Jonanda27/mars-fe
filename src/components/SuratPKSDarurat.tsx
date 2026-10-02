import React, { forwardRef } from 'react';
import { Contract } from '@/types/contract';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

interface SuratPKSDaruratProps {
  contract: Contract;
}

const SuratPKSDarurat = forwardRef<HTMLDivElement, SuratPKSDaruratProps>(({ contract }, ref) => {
  const tanggalHariIni = dayjs(contract.created_at || contract.start_date).format('DD MMMM YYYY');
  const waktuKedatangan = dayjs(contract.created_at || contract.start_date).format('DD MMMM YYYY, HH:mm');

  // Extract fasilitas data if stored as json object or string
  const fasilitas = typeof contract.fasilitas === 'string' 
    ? JSON.parse(contract.fasilitas) 
    : (contract.fasilitas || {});

  const picName = fasilitas.pic_name || contract.tenants?.pic || 'Capt. Pilot In Command';
  const picPhone = fasilitas.pic_phone || contract.tenants?.nomor_telepon || '-';
  const picEmail = fasilitas.pic_email || contract.tenants?.email || '-';
  const rawReg = fasilitas.registration_number || (contract as any).registration_number;
  const regNumber = rawReg && rawReg !== '-' ? rawReg : 'Menunggu Pencatatan Petugas Lapangan';
  const rawLoc = fasilitas.parking_location;
  const parkingLoc = (rawLoc && rawLoc !== 'Menunggu Penempatan Petugas Lapangan') 
    ? rawLoc 
    : 'Apron / Hanggar (Ditentukan Petugas Lapangan)';
  const emergencyReason = fasilitas.emergency_reason || 'Pendaratan Darurat Insidentil';
  const airlineName = contract.tenants?.nama_perusahaan || 'Operator Armada';

  return (
    <div 
      ref={ref} 
      id="pks-darurat-document"
      className="flex flex-col items-center gap-8 print:gap-0 w-full"
      style={{ 
        fontFamily: '"Times New Roman", Times, serif', 
        color: '#000000',
      }}
    >
      {/* ======================================================== */}
      {/* LEMBAR 1 / HALAMAN 1 (A4: 210mm x 297mm)                 */}
      {/* ======================================================== */}
      <div 
        className="page-a4 bg-white shadow-md print:shadow-none print:border-none relative flex flex-col justify-between"
        style={{ 
          width: '794px', 
          minHeight: '1122px',
          height: '1122px',
          boxSizing: 'border-box',
          padding: '45px 55px 35px 55px',
          backgroundColor: '#ffffff',
          color: '#000000',
          fontSize: '11pt', 
          lineHeight: '1.45',
          border: '1px solid #d4d4d4'
        }}
      >
        <div>
          {/* KOP SURAT RESMI DINAS PERHUBUNGAN KAB. MIMIKA */}
          <div className="flex items-center border-b-[3px] border-black pb-3 mb-2 relative">
            <div className="w-24 flex-shrink-0 flex items-center justify-center">
              <img 
                src="/images/logo dishub .png" 
                alt="Logo Dishub Mimika" 
                className="w-20 h-auto object-contain"
              />
            </div>
            <div className="flex-1 text-center pr-6">
              <h3 className="font-bold text-[13pt] uppercase tracking-wide leading-tight" style={{ margin: 0 }}>
                PEMERINTAH KABUPATEN MIMIKA
              </h3>
              <h2 className="font-bold text-[15pt] uppercase tracking-wide leading-tight" style={{ margin: '2px 0' }}>
                DINAS PERHUBUNGAN
              </h2>
              <h4 className="font-bold text-[11pt] uppercase tracking-wide leading-tight text-neutral-800" style={{ margin: 0 }}>
                UNIT PENYELENGGARA BANDAR UDARA (UPBU) MOZES KILANGIN
              </h4>
              <p className="text-[9pt] leading-tight text-neutral-600 mt-1" style={{ margin: '2px 0 0' }}>
                Jalan Bandara Mozes Kilangin, Timika, Kabupaten Mimika, Papua Tengah - 99910<br />
                Laman Resmi: https://dishub.mimikakab.go.id &bull; Posel: bandara.mozeskilangin@mimikakab.go.id
              </p>
            </div>
          </div>
          <div className="border-b-[1px] border-black -mt-2.5 mb-4"></div>

          {/* JUDUL DOKUMEN PKS DARURAT */}
          <div className="text-center mb-4">
            <h2 className="font-bold text-[13pt] uppercase underline tracking-wider" style={{ margin: 0 }}>
              SURAT PERJANJIAN KERJA SAMA (PKS) PENDARATAN DARURAT
            </h2>
            <p className="font-bold text-[11pt] tracking-normal text-neutral-900 mt-1" style={{ margin: 0 }}>
              Nomor: {contract.contract_number}
            </p>
            <p className="text-[9.5pt] italic text-neutral-600 font-sans mt-0.5" style={{ margin: 0 }}>
              (Perjanjian Pemanfaatan Fasilitas Parkir / Apron / Hanggar Tanpa Reservasi Awal)
            </p>
          </div>

          {/* PEMBUKAAN & KOMPARISI */}
          <div className="text-justify mb-3">
            <p className="mb-2">
              Pada hari ini, <strong>{tanggalHariIni}</strong>, bertempat di Kantor Unit Penyelenggara Bandar Udara (UPBU) Mozes Kilangin Timika, kami yang bertanda tangan di bawah ini:
            </p>

            {/* PIHAK PERTAMA */}
            <table className="w-full border-collapse pl-4 mb-2 text-[10.5pt]">
              <tbody>
                <tr>
                  <td className="w-36 align-top pl-4 font-semibold">1. Nama</td>
                  <td className="w-4 align-top">:</td>
                  <td className="align-top font-bold">Asep Soekarna, S.Si.T.</td>
                </tr>
                <tr>
                  <td className="align-top pl-4 font-semibold">Jabatan</td>
                  <td className="align-top">:</td>
                  <td className="align-top">Kepala Kantor UPBU Bandara Mozes Kilangin</td>
                </tr>
                <tr>
                  <td className="align-top pl-4 font-semibold">Instansi</td>
                  <td className="align-top">:</td>
                  <td className="align-top">Dinas Perhubungan Pemerintah Kabupaten Mimika</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[9.5pt] pl-4 italic text-neutral-700 mb-2">
              Dalam hal ini bertindak untuk dan atas nama Penyelenggara Bandara Mozes Kilangin Timika, selanjutnya disebut sebagai <strong>PIHAK PERTAMA</strong>.
            </p>

            {/* PIHAK KEDUA */}
            <table className="w-full border-collapse pl-4 mb-2 text-[10.5pt]">
              <tbody>
                <tr>
                  <td className="w-36 align-top pl-4 font-semibold">2. Nama PIC</td>
                  <td className="w-4 align-top">:</td>
                  <td className="align-top font-bold">{picName}</td>
                </tr>
                <tr>
                  <td className="align-top pl-4 font-semibold">Maskapai / Operator</td>
                  <td className="align-top">:</td>
                  <td className="align-top font-bold">{airlineName}</td>
                </tr>
                <tr>
                  <td className="align-top pl-4 font-semibold">No. WhatsApp / HP</td>
                  <td className="align-top">:</td>
                  <td className="align-top font-mono">{picPhone}</td>
                </tr>
                <tr>
                  <td className="align-top pl-4 font-semibold">Posel (Email)</td>
                  <td className="align-top">:</td>
                  <td className="align-top font-mono">{picEmail}</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[9.5pt] pl-4 italic text-neutral-700 mb-3">
              Dalam hal ini bertindak selaku Pilot In Command (PIC) / Perwakilan Sah Operator Pesawat, selanjutnya disebut sebagai <strong>PIHAK KEDUA</strong>.
            </p>
          </div>

          {/* BAGIAN I — BERITA ACARA DETAIL KEDATANGAN FISIK PESAWAT */}
          <div className="mb-3">
            <p className="font-bold text-[10.5pt] mb-1.5 uppercase tracking-wide">
              I. DATA BERITA ACARA KEDATANGAN FISIK ARMADA DARURAT / AD-HOC:
            </p>
            <table className="w-full border border-black text-[10pt] border-collapse">
              <tbody>
                <tr className="border-b border-black bg-neutral-100">
                  <td className="p-2 border-r border-black font-semibold w-52">Nomor Registrasi (Tail Number)</td>
                  <td className="p-2 font-bold font-mono text-[11pt]">{regNumber}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 border-r border-black font-semibold">Alokasi Aset Penempatan Parkir</td>
                  <td className="p-2 font-bold">
                    {contract.assets?.nama_aset && rawLoc && rawLoc !== 'Menunggu Penempatan Petugas Lapangan'
                      ? `${contract.assets.nama_aset} (${parkingLoc}) • Sisi Udara Mozes Kilangin`
                      : `${parkingLoc} • Sisi Udara Mozes Kilangin`}
                  </td>
                </tr>
                <tr className="border-b border-black bg-neutral-100">
                  <td className="p-2 border-r border-black font-semibold">Waktu Kedatangan / Pendaratan</td>
                  <td className="p-2">{waktuKedatangan} WIT</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 border-r border-black font-semibold">Alasan Pendaratan Darurat / Ad-Hoc</td>
                  <td className="p-2 font-semibold text-red-900">{emergencyReason}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER HALAMAN 1 */}
        <div className="pt-2 border-t border-neutral-300 flex justify-between items-center text-[8.5pt] text-neutral-500 font-sans">
          <span>* Lembar Ketentuan Hukum, Komitmen Retribusi &amp; Pengesahan TTE bersambung ke Halaman 2</span>
          <span className="font-bold text-neutral-700">Halaman 1 dari 2</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* LEMBAR 2 / HALAMAN 2 (A4: 210mm x 297mm)                 */}
      {/* ======================================================== */}
      <div 
        className="page-a4 bg-white shadow-md print:shadow-none print:border-none relative flex flex-col justify-between"
        style={{ 
          width: '794px', 
          minHeight: '1122px',
          height: '1122px',
          boxSizing: 'border-box',
          padding: '45px 55px 35px 55px',
          backgroundColor: '#ffffff',
          color: '#000000',
          fontSize: '10.5pt', 
          lineHeight: '1.45',
          border: '1px solid #d4d4d4'
        }}
      >
        <div>
          {/* HEADER KECIL HALAMAN 2 */}
          <div className="flex justify-between items-center border-b border-black pb-2 mb-4 text-[9pt] font-sans">
            <div>
              <span className="font-bold uppercase tracking-wider text-neutral-900">Perjanjian Kerja Sama (PKS) Pendaratan Darurat</span>
              <span className="text-neutral-500 ml-2">&bull; Mozes Kilangin Timika</span>
            </div>
            <div className="font-mono text-neutral-700 font-bold">
              {contract.contract_number}
            </div>
          </div>

          {/* BAGIAN II — PASAL-PASAL KESEPAKATAN HUKUM */}
          <div className="text-justify mb-4 space-y-3">
            <p className="font-bold uppercase tracking-wide text-[10.5pt]">
              II. KETENTUAN DAN KESEPAKATAN HUKUM:
            </p>

            <div>
              <strong className="block font-bold">PASAL 1 — HAK PENEMPATAN ARMADA DARURAT</strong>
              <p>
                PIHAK PERTAMA memberikan izin pendaratan darurat dan penyediaan lokasi penempatan/parkir ({parkingLoc}) kepada armada pesawat milik PIHAK KEDUA demi keselamatan penerbangan (<em>Aviation Safety</em>) terhitung sejak waktu pendaratan sampai dengan penanganan teknis/operasional selesai dan armada dinyatakan laik terbang (<em>airworthy</em>).
              </p>
            </div>

            <div>
              <strong className="block font-bold">PASAL 2 — KOMITMEN RETRIBUSI &amp; PENAGIHAN PASCA-CHECKOUT (e-SKRD)</strong>
              <p>
                1. Pemanfaatan fasilitas parkir/apron bandara akibat pendaratan darurat dikenakan tarif retribusi daerah yang sah sesuai Peraturan Daerah Kabupaten Mimika yang berlaku.<br />
                2. Perhitungan besaran retribusi dihitung secara resmi pada saat armada melakukan Check-Out keluar melalui penerbitan <strong>Surat Ketetapan Retribusi Daerah Elektronik (e-SKRD)</strong> oleh Dinas Perhubungan Kabupaten Mimika.<br />
                3. PIHAK KEDUA secara sah dan mengikat berkomitmen melunasi kewajiban retribusi e-SKRD tersebut melalui kanal pembayaran resmi kas daerah Pemerintah Kabupaten Mimika paling lambat sesuai batas jatuh tempo yang tertera pada lembar ketetapan.
              </p>
            </div>

            <div>
              <strong className="block font-bold">PASAL 3 — KESELAMATAN &amp; KETERTIBAN SISI UDARA</strong>
              <p>
                PIHAK KEDUA wajib mematuhi seluruh tata tertib keamanan (<em>Aviation Security</em>), arahan Marshaller / Petugas Lapangan, serta standar operasional keselamatan kerja di area Apron / Hanggar Bandara Mozes Kilangin.
              </p>
            </div>

            <div>
              <strong className="block font-bold">PASAL 4 — KEKUATAN PEMBUKTIAN &amp; TANDA TANGAN ELEKTRONIK</strong>
              <p>
                Perjanjian ini dibuat dan disahkan di lokasi penempatan pesawat menggunakan Tanda Tangan Elektronik (TTE) sah yang dibubuhkan langsung oleh Pilot In Command (PIC) dan memiliki kekuatan hukum pembuktian yang sempurna serta mengikat kedua belah pihak.
              </p>
            </div>

            <div>
              <strong className="block font-bold">PASAL 5 — PENYELESAIAN PERSELISIHAN</strong>
              <p>
                Segala perselisihan yang timbul sehubungan dengan pelaksanaan perjanjian ini akan diselesaikan secara musyawarah untuk mufakat. Apabila tidak tercapai mufakat, para pihak sepakat memilih domisili hukum di Kantor Pengadilan Negeri Timika.
              </p>
            </div>

            <p className="pt-1">
              Demikian Surat Perjanjian Kerja Sama Pendaratan Darurat ini dibuat dan disepakati bersama dalam keadaan sadar dan tanpa adanya paksaan dari pihak manapun untuk dipergunakan sebagaimana mestinya.
            </p>
          </div>

          {/* LEMBAR PENGESAHAN & TANDA TANGAN PARA PIHAK (TTE) */}
          <div className="mt-4 pt-2">
            <p className="text-right text-[10pt] mb-2 pr-6">
              Timika, {tanggalHariIni}
            </p>
            <table className="w-full text-center text-[10pt]">
              <tbody>
                <tr>
                  <td className="w-1/2 align-top pb-1">
                    <p className="font-semibold mb-0.5">PIHAK PERTAMA,</p>
                    <p className="text-[9pt] text-neutral-500 mb-2">Penyelenggara Bandara Mozes Kilangin</p>
                    <div className="h-20 flex items-center justify-center mb-1">
                      {contract.admin_signature ? (
                        <img 
                          src={contract.admin_signature} 
                          alt="TTE UPBU" 
                          className="h-20 object-contain" 
                        />
                      ) : (
                        <div className="border border-dashed border-neutral-300 px-4 py-2 text-[9pt] text-neutral-400 italic">
                          [TTE Otoritas UPBU Mozes Kilangin]
                        </div>
                      )}
                    </div>
                    <p className="font-bold underline">Asep Soekarna, S.Si.T.</p>
                    <p className="text-[9pt] text-neutral-600">Kepala Kantor UPBU</p>
                  </td>

                  <td className="w-1/2 align-top pb-1">
                    <p className="font-semibold mb-0.5">PIHAK KEDUA,</p>
                    <p className="text-[9pt] text-neutral-500 mb-2">Pilot In Command (PIC) / Operator</p>
                    <div className="h-20 flex items-center justify-center mb-1 relative">
                      {contract.tenant_signature ? (
                        <img 
                          src={contract.tenant_signature} 
                          alt="TTE PIC Lapangan" 
                          className="h-20 object-contain" 
                        />
                      ) : (
                        <div className="border border-dashed border-neutral-300 px-4 py-2 text-[9pt] text-neutral-400 italic">
                          [Tanda Tangan TTE PIC di Lokasi]
                        </div>
                      )}
                    </div>
                    <p className="font-bold underline">{picName}</p>
                    <p className="text-[9pt] text-neutral-600">{airlineName}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER HALAMAN 2 */}
        <div>
          <div className="text-center text-[8.5pt] text-neutral-500 pt-2 border-t border-neutral-200 font-sans">
            Dokumen resmi ini diterbitkan secara elektronik oleh Sistem Informasi Retribusi &amp; Operasional Bandara Mozes Kilangin Timika (MARS).<br />
            Sah tanpa memerlukan stempel basah tambahan berdasarkan UU ITE No. 11 Tahun 2008 &bull; ID Ref: {contract.contract_number}
          </div>
          <div className="flex justify-between items-center text-[8pt] text-neutral-400 font-sans mt-1">
            <span>UPBU Mozes Kilangin Timika</span>
            <span className="font-bold text-neutral-700">Halaman 2 dari 2</span>
          </div>
        </div>
      </div>
    </div>
  );
});

SuratPKSDarurat.displayName = 'SuratPKSDarurat';
export default SuratPKSDarurat;
