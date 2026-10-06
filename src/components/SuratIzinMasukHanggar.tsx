import React, { forwardRef } from 'react';
import { FlightSchedule } from '@/types/flightSchedule';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

interface SuratIzinMasukHanggarProps {
  schedule: FlightSchedule;
}

export const SuratIzinMasukHanggar = forwardRef<HTMLDivElement, SuratIzinMasukHanggarProps>(({ schedule }, ref) => {
  const tanggalHariIni = dayjs(schedule.verified_at || schedule.created_at).format('DD MMMM YYYY');
  const waktuMasuk = schedule.estimated_arrival 
    ? dayjs(schedule.estimated_arrival).format('DD MMMM YYYY, HH:mm') + ' WIT'
    : '-';
  const waktuVerifikasi = schedule.verified_at
    ? dayjs(schedule.verified_at).format('DD MMMM YYYY, HH:mm') + ' WIT'
    : dayjs().format('DD MMMM YYYY, HH:mm') + ' WIT';

  const tenantName = schedule.tenant?.nama_perusahaan 
    || (schedule.contract as any)?.tenants?.nama_perusahaan 
    || 'Operator Armada';
  const tenantIdStr = schedule.tenant?.tenant_id_str 
    || (schedule.contract as any)?.tenants?.tenant_id_str 
    || (schedule.tenant_id 
        ? `T-${new Date(schedule.created_at || Date.now()).getFullYear()}-${String(schedule.tenant_id).padStart(4, '0')}` 
        : '-');
  const regNumber = schedule.registration_number || '-';
  const aircraftType = schedule.aircraft_type || 'Pesawat Standar';
  const parkingLocation = schedule.parking_location || 'Hanggar Mozes Kilangin';
  const officerName = schedule.verified_by_officer?.username || 'Petugas Lapangan';

  const qrData = encodeURIComponent(`MOZES-PASS:${schedule.schedule_number}|${regNumber}|${parkingLocation}`);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${qrData}`;

  return (
    <div 
      ref={ref} 
      id="surat-izin-masuk-document"
      className="flex flex-col items-center justify-center w-full"
      style={{ 
        fontFamily: '"Times New Roman", Times, serif', 
        color: '#000000',
        backgroundColor: '#ffffff'
      }}
    >
      {/* ======================================================== */}
      {/* HALAMAN A4: 210mm x 297mm (794px x 1122px)               */}
      {/* Menggunakan inline hex styling murni untuk html2canvas   */}
      {/* ======================================================== */}
      <div 
        className="page-a4 relative flex flex-col justify-between"
        style={{ 
          width: '794px', 
          minHeight: '1122px',
          height: '1122px',
          boxSizing: 'border-box',
          padding: '45px 52px 36px 52px',
          backgroundColor: '#ffffff',
          color: '#000000',
          fontSize: '11pt', 
          lineHeight: '1.4',
          border: '1px solid #d4d4d4'
        }}
      >
        <div>
          {/* KOP SURAT RESMI DINAS PERHUBUNGAN KAB. MIMIKA */}
          <div 
            className="flex items-center pb-3 mb-1.5 relative"
            style={{ borderBottom: '3px solid #000000' }}
          >
            <div className="w-24 flex-shrink-0 flex items-center justify-center">
              <img 
                src="/images/logo dishub .png" 
                alt="Logo Dishub Mimika" 
                className="w-20 h-auto object-contain"
              />
            </div>
            <div className="flex-1 text-center pr-6">
              <h3 className="font-bold text-[12.5pt] uppercase tracking-wide leading-tight" style={{ margin: 0, color: '#000000' }}>
                PEMERINTAH KABUPATEN MIMIKA
              </h3>
              <h2 className="font-bold text-[15pt] uppercase tracking-wide leading-tight" style={{ margin: '2px 0', color: '#000000' }}>
                DINAS PERHUBUNGAN
              </h2>
              <h4 className="font-bold text-[10.5pt] uppercase tracking-wide leading-tight" style={{ margin: 0, color: '#222222' }}>
                UNIT PENYELENGGARA BANDAR UDARA (UPBU) KELAS I MOZES KILANGIN
              </h4>
              <p className="text-[8.5pt] leading-tight mt-1" style={{ margin: '2px 0 0', color: '#555555' }}>
                Jalan Bandara Mozes Kilangin, Timika, Kabupaten Mimika, Papua Tengah - 99910<br />
                Layanan Operasional Apron &amp; Hanggar &bull; Posel: bandara.mozeskilangin@mimikakab.go.id
              </p>
            </div>
          </div>
          <div style={{ borderBottom: '1px solid #000000', marginTop: '-6px', marginBottom: '16px' }}></div>

          {/* JUDUL DOKUMEN IZIN MASUK */}
          <div className="text-center mb-3">
            <h2 className="font-bold text-[13.5pt] uppercase underline tracking-wider" style={{ margin: 0, color: '#000000' }}>
              SURAT IZIN MASUK &amp; PENEMPATAN ARMADA HANGGAR
            </h2>
            <p className="font-bold text-[10.5pt] tracking-normal mt-1" style={{ margin: 0, color: '#111111' }}>
              HANGAR ENTRY AND PARKING PERMIT PASS
            </p>
            <p className="text-[10pt] font-mono font-bold mt-0.5" style={{ margin: 0, color: '#000000' }}>
              Nomor: {schedule.schedule_number}
            </p>
          </div>

          {/* STATUS PERSETUJUAN RESMI */}
          <div 
            className="flex justify-between items-center p-2.5 mb-3"
            style={{ border: '1px solid #000000', backgroundColor: '#f8f9fa', color: '#000000' }}
          >
            <div>
              <span className="text-[8.5pt] uppercase font-bold block" style={{ color: '#555555' }}>
                STATUS DOKUMEN PERIZINAN:
              </span>
              <span className="text-[10.5pt] font-bold tracking-wider" style={{ color: '#000000' }}>
                DISETUJUI / RESMI (VALID)
              </span>
            </div>
            <div className="text-right">
              <span className="text-[8.5pt] uppercase font-bold block" style={{ color: '#555555' }}>
                WAKTU OTORISASI PETUGAS:
              </span>
              <span className="text-[10pt] font-bold" style={{ color: '#000000' }}>
                {waktuVerifikasi}
              </span>
            </div>
          </div>

          {/* TABEL RINCIAN 1: IDENTITAS TENANT & ARMADA */}
          <div className="mb-3">
            <div 
              className="px-2.5 py-1 text-[9pt] font-bold uppercase tracking-wider mb-1"
              style={{ border: '1px solid #000000', backgroundColor: '#eeeeee', color: '#000000' }}
            >
              I. DATA TENANT &amp; MANIFEST ARMADA PESAWAT
            </div>
            <table className="w-full text-[10pt] border-collapse" style={{ border: '1px solid #000000' }}>
              <tbody>
                <tr>
                  <td className="w-[32%] p-2 font-bold" style={{ backgroundColor: '#f8f9fa', border: '1px solid #000000', color: '#000000' }}>
                    Nama Maskapai / Tenant
                  </td>
                  <td className="p-2 font-bold" style={{ border: '1px solid #000000', color: '#000000' }}>
                    {tenantName}
                  </td>
                  <td className="w-[18%] p-2 font-bold" style={{ backgroundColor: '#f8f9fa', border: '1px solid #000000', color: '#000000' }}>
                    ID Tenant
                  </td>
                  <td className="w-[20%] p-2 font-mono" style={{ border: '1px solid #000000', color: '#000000' }}>
                    {tenantIdStr}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 font-bold" style={{ backgroundColor: '#f8f9fa', border: '1px solid #000000', color: '#000000' }}>
                    Tanda Pendaftaran (Tail Number)
                  </td>
                  <td className="p-2 font-mono font-bold text-[11pt] tracking-wider" style={{ border: '1px solid #000000', color: '#000000' }}>
                    {regNumber}
                  </td>
                  <td className="p-2 font-bold" style={{ backgroundColor: '#f8f9fa', border: '1px solid #000000', color: '#000000' }}>
                    Tipe Pesawat
                  </td>
                  <td className="p-2 font-medium" style={{ border: '1px solid #000000', color: '#000000' }}>
                    {aircraftType}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 font-bold" style={{ backgroundColor: '#f8f9fa', border: '1px solid #000000', color: '#000000' }}>
                    Keperluan Operasional
                  </td>
                  <td colSpan={3} className="p-2 font-medium" style={{ border: '1px solid #000000', color: '#000000' }}>
                    {schedule.purpose || 'Inap Reguler / RON (Remain Over Night)'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TABEL RINCIAN 2: JADWAL & ALOKASI PENEMPATAN */}
          <div className="mb-3">
            <div 
              className="px-2.5 py-1 text-[9pt] font-bold uppercase tracking-wider mb-1"
              style={{ border: '1px solid #000000', backgroundColor: '#eeeeee', color: '#000000' }}
            >
              II. ALOKASI PENEMPATAN FASILITAS &amp; JADWAL OPERASIONAL
            </div>
            <table className="w-full text-[10pt] border-collapse" style={{ border: '1px solid #000000' }}>
              <tbody>
                <tr>
                  <td className="w-[32%] p-2 font-bold" style={{ backgroundColor: '#f8f9fa', border: '1px solid #000000', color: '#000000' }}>
                    Alokasi Penempatan Fasilitas
                  </td>
                  <td colSpan={3} className="p-2 font-bold text-[10pt]" style={{ border: '1px solid #000000', color: '#000000' }}>
                    {parkingLocation}
                  </td>
                </tr>
                <tr>
                  <td className="w-[32%] p-2 font-bold" style={{ backgroundColor: '#f8f9fa', border: '1px solid #000000', color: '#000000' }}>
                    Estimasi Kedatangan (Masuk)
                  </td>
                  <td colSpan={3} className="p-2 font-bold text-[10pt]" style={{ border: '1px solid #000000', color: '#000000' }}>
                    {waktuMasuk}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SECTION QR CODE & VALIDASI KEAMANAN ELEKTRONIK */}
          <div 
            className="p-3 mb-3 flex items-center justify-between gap-4"
            style={{ border: '1px solid #000000', backgroundColor: '#ffffff', color: '#000000' }}
          >
            <div className="flex-1 text-[8.5pt] space-y-1" style={{ color: '#000000' }}>
              <span 
                className="font-bold text-[9pt] uppercase block tracking-wider pb-1 mb-1"
                style={{ borderBottom: '1px solid #000000', color: '#000000' }}
              >
                KODE OTORISASI DAN VALIDASI AKSES AIRSIDE (E-GATE PASS)
              </span>
              <p className="leading-relaxed text-[8.5pt]" style={{ color: '#000000' }}>
                Dokumen izin ini diterbitkan secara sah dan tervalidasi oleh sistem. Tunjukkan dokumen ini beserta kode QR kepada Petugas Lapangan, Marshaller, atau Avsec pada Pos Jaga sebelum pergerakan armada memasuki area hanggar atau apron.
              </p>
              <p className="font-mono text-[8.5pt] font-bold pt-0.5" style={{ color: '#000000' }}>
                REFERENSI: MOZES-PASS/{schedule.schedule_number}/{regNumber}
              </p>
            </div>
            <div 
              className="text-center flex-shrink-0 p-1.5"
              style={{ border: '1px solid #000000', backgroundColor: '#ffffff' }}
            >
              <img 
                src={qrCodeUrl} 
                alt="QR Code Tiket Izin Masuk" 
                className="w-24 h-24 object-contain mx-auto"
              />
              <span className="block text-[7pt] font-sans font-bold uppercase mt-1" style={{ color: '#000000' }}>
                Kode Autentikasi
              </span>
            </div>
          </div>

          {/* KETENTUAN DAN PERSYARATAN IZIN OPERASIONAL */}
          <div 
            className="p-2.5 mb-3 text-[8.5pt]"
            style={{ border: '1px solid #000000', backgroundColor: '#f8f9fa', color: '#000000' }}
          >
            <span className="font-bold uppercase tracking-wider block mb-1 text-[8.5pt]" style={{ color: '#000000' }}>
              KETENTUAN DAN PERSYARATAN IZIN OPERASIONAL (AIRSIDE SAFETY RULES):
            </span>
            <ol className="list-decimal pl-4 space-y-0.5 leading-relaxed" style={{ color: '#000000' }}>
              <li>Seluruh personil kru, teknisi pesawat, dan ground handling wajib mengenakan alat pelindung diri (Safety Vest) dan memiliki Pas Bandara yang masih berlaku.</li>
              <li>Pergerakan pesawat, penarikan (towing), dan parkir wajib mematuhi panduan dan alokasi yang telah ditetapkan oleh Petugas Lapangan Hanggar.</li>
              <li>Wajib menjaga kebersihan area lantai penempatan pesawat (Zero FOD Tolerance) serta dilarang keras menyalakan mesin pesawat di dalam hanggar tertutup.</li>
            </ol>
          </div>

          {schedule.officer_notes && (
            <div 
              className="text-[8.5pt] p-2 mb-3"
              style={{ border: '1px solid #000000', backgroundColor: '#f8f9fa', color: '#000000' }}
            >
              <span className="font-bold uppercase text-[8pt]" style={{ color: '#000000' }}>Catatan Khusus Petugas Lapangan: </span>
              <span className="italic" style={{ color: '#000000' }}>{schedule.officer_notes}</span>
            </div>
          )}
        </div>

        {/* TANDA TANGAN & PENGESAHAN DOKUMEN RESMI */}
        <div className="pt-2" style={{ borderTop: '1px solid #000000' }}>
          <table className="w-full text-center text-[9.5pt]">
            <tbody>
              <tr>
                <td className="w-1/2 align-top text-left pl-2">
                  <div 
                    className="p-2 text-[8pt] leading-tight"
                    style={{ border: '1px solid #000000', backgroundColor: '#f8f9fa', color: '#000000' }}
                  >
                    <p className="font-bold uppercase tracking-wider mb-1 text-[7.5pt]" style={{ color: '#000000' }}>
                      Keterangan Validitas Dokumen:
                    </p>
                    <p className="mb-1" style={{ color: '#333333' }}>
                      Dokumen izin ini diterbitkan secara sah melalui sistem <strong>MARS</strong> atas wewenang Unit Penyelenggara Bandar Udara (UPBU) Kelas I Mozes Kilangin Timika.
                    </p>
                    <p className="font-mono text-[7pt]" style={{ color: '#666666' }}>
                      Dokumen Elektronik Sah &bull; Verifikasi melalui QR Code
                    </p>
                  </div>
                </td>
                <td className="w-1/2 align-top text-center">
                  <p className="mb-0.5 text-[9.5pt]" style={{ color: '#000000' }}>Timika, {tanggalHariIni}</p>
                  <p className="font-bold leading-tight text-[9.5pt]" style={{ color: '#000000' }}>
                    Petugas Lapangan Hanggar &amp; Apron<br />
                    UPBU Kelas I Mozes Kilangin Timika
                  </p>
                  {/* Stempel / Segel Pengesahan Resmi Elektronik */}
                  <div className="h-16 flex items-center justify-center my-1">
                    <div 
                      className="px-3 py-1.5 text-center inline-block"
                      style={{ border: '1px solid #000000', backgroundColor: '#ffffff' }}
                    >
                      <div 
                        className="text-[7pt] font-bold tracking-wider uppercase pb-0.5"
                        style={{ borderBottom: '1px solid #000000', color: '#222222' }}
                      >
                        UPBU KELAS I MOZES KILANGIN
                      </div>
                      <div className="text-[8pt] font-bold uppercase py-0.5" style={{ color: '#000000' }}>
                        TERTANDATANGANI ELEKTRONIK
                      </div>
                      <div className="text-[6.5pt] font-mono" style={{ color: '#555555' }}>
                        ID: {schedule.schedule_number}
                      </div>
                    </div>
                  </div>
                  <p className="font-bold underline text-[10pt] uppercase" style={{ color: '#000000' }}>{officerName}</p>
                  <p className="text-[8.5pt]" style={{ color: '#333333' }}>
                    {schedule.verified_by_officer_id ? `Petugas Lapangan (ID: #${schedule.verified_by_officer_id})` : 'Petugas Lapangan UPBU Mozes Kilangin'}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

SuratIzinMasukHanggar.displayName = 'SuratIzinMasukHanggar';
