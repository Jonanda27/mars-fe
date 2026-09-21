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
      className="p-12 mx-auto w-full max-w-[210mm] min-h-[297mm] shadow-sm print:shadow-none print:border-none relative"
      style={{ 
        fontFamily: '"Times New Roman", Times, serif', 
        fontSize: '12pt', 
        lineHeight: '1.5',
        backgroundColor: '#ffffff',
        color: '#000000',
        border: '1px solid #e2e8f0'
      }}
    >
        <div style={{ position: 'absolute', top: '20mm', left: '20mm' }}>
          <img src="/images/logo dishub .png" alt="Logo" style={{ width: '80px', height: 'auto' }} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '14pt', fontWeight: 'bold', textDecoration: 'underline' }}>
            SURAT PERJANJIAN KERJASAMA
          </h2>
          <p style={{ margin: '5px 0 0', fontSize: '12pt' }}>
            Nomor: {contract.contract_number}
          </p>
        </div>

        <div style={{ textAlign: 'justify', marginBottom: '15px' }}>
          <p style={{ marginBottom: '10px' }}>Saya yang bertanda tangan di bawah ini :</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', paddingLeft: '20px', marginBottom: '5px' }}>
            <tbody>
              <tr>
                <td style={{ width: '200px', verticalAlign: 'top', paddingLeft: '20px' }}>Nama</td>
                <td style={{ width: '20px', verticalAlign: 'top' }}>:</td>
                <td style={{ verticalAlign: 'top' }}>Asep Soekarna, S.Si.T.</td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top', paddingLeft: '20px' }}>Jabatan</td>
                <td style={{ verticalAlign: 'top' }}>:</td>
                <td style={{ verticalAlign: 'top' }}>Kepala Kantor UPBU Mozes Kilangin</td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top', paddingLeft: '20px' }}>Alamat Instansi</td>
                <td style={{ verticalAlign: 'top' }}>:</td>
                <td style={{ verticalAlign: 'top' }}>Jl. Bandara Mozes Kilangin, Timika, Papua Tengah</td>
              </tr>
            </tbody>
          </table>
          <p style={{ margin: '5px 0 15px' }}>Dalam hal ini bertindak untuk dan atas nama UPBU Bandara Mozes Kilangin, yang mana selanjutnya disebut sebagai Pihak Pertama.</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', paddingLeft: '20px', marginBottom: '5px' }}>
            <tbody>
              <tr>
                <td style={{ width: '200px', verticalAlign: 'top', paddingLeft: '20px' }}>Nama Perusahaan</td>
                <td style={{ width: '20px', verticalAlign: 'top' }}>:</td>
                <td style={{ verticalAlign: 'top' }}><strong>{contract.tenants?.nama_perusahaan || '-'}</strong></td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top', paddingLeft: '20px' }}>Diwakili Oleh (PIC)</td>
                <td style={{ verticalAlign: 'top' }}>:</td>
                <td style={{ verticalAlign: 'top' }}>{contract.tenants?.pic || '..........................................'}</td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top', paddingLeft: '20px' }}>NIB</td>
                <td style={{ verticalAlign: 'top' }}>:</td>
                <td style={{ verticalAlign: 'top' }}>{contract.tenants?.nib || '..........................................'}</td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top', paddingLeft: '20px' }}>NPWP</td>
                <td style={{ verticalAlign: 'top' }}>:</td>
                <td style={{ verticalAlign: 'top' }}>{contract.tenants?.npwp || '..........................................'}</td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top', paddingLeft: '20px' }}>Alamat Perusahaan</td>
                <td style={{ verticalAlign: 'top' }}>:</td>
                <td style={{ verticalAlign: 'top' }}>{contract.tenants?.alamat || '..........................................'}</td>
              </tr>
            </tbody>
          </table>
          <p style={{ margin: '5px 0 15px' }}>Dalam hal ini bertindak untuk dan atas nama perusahaan tersebut, selanjutnya disebut sebagai Pihak Kedua.</p>
        </div>

        <div style={{ textAlign: 'justify', marginBottom: '20px' }}>
          <p>
            Kedua belah pihak telah sepakat untuk mengadakan kerjasama penyewaan aset dengan ketentuan-ketentuan yang diatur sebagai berikut ini :
          </p>
        </div>

        <div style={{ textAlign: 'justify', marginBottom: '20px' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '10px', fontWeight: 'bold' }}>PASAL 1</h4>
          <p>
            Dalam kerjasama ini Pihak Pertama akan menyewakan aset berupa <strong>{contract.assets?.nama_aset} (Kode: {contract.assets?.kode_aset})</strong> seluas <strong>{contract.luas || contract.assets?.luas} m²</strong> kepada Pihak Kedua dengan tujuan untuk {contract.jenis_pemanfaatan || 'operasional penerbangan/bandara'}. Masa sewa berlaku selama periode yang dihitung mulai tanggal <strong>{dayjs(contract.start_date).format('DD MMMM YYYY')}</strong> sampai dengan tanggal <strong>{dayjs(contract.end_date).format('DD MMMM YYYY')}</strong>.
          </p>
        </div>

        <div style={{ textAlign: 'justify', marginBottom: '30px' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '10px', fontWeight: 'bold' }}>PASAL 2</h4>
          <p>
            Pihak Kedua wajib membayar biaya sewa sebesar <strong>{formatRupiah(contract.total_amount || 0)}</strong> kepada Pihak Pertama. Pembayaran tersebut akan ditagihkan sesuai dengan ketentuan tagihan (invoice) yang akan diterbitkan oleh Pihak Pertama selama masa sewa berlangsung.
          </p>
        </div>

        <div style={{ textAlign: 'justify', marginBottom: '30px' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '10px', fontWeight: 'bold' }}>PASAL 3</h4>
          <p>
            Apabila terjadi perselisihan antar kedua belah pihak akan diselesaikan secara kekeluargaan terlebih dahulu. Dan apabila tidak ditemui jalan keluar baru akan diselesaikan secara hukum.
          </p>
        </div>

        <div style={{ textAlign: 'justify', marginBottom: '40px' }}>
          <p>
            Demikian surat perjanjian ini kami buat sebenar-benarnya dalam rangkap dua yang mana masing-masing rangkap mempunyai kekuatan hukum yang sama. Dan dalam pembuatan perjanjian kerjasama ini tidak ada paksaan dari pihak manapun.
          </p>
        </div>

        <div style={{ textAlign: 'right', marginBottom: '20px', paddingRight: '20px' }}>
          <p>................., {tanggalHariIni}</p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <table style={{ width: '100%', textAlign: 'center' }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', verticalAlign: 'top' }}>
                  <p style={{ marginBottom: '10px' }}>Pihak Pertama,</p>
                  <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    {contract.admin_signature ? (
                      <img src={contract.admin_signature} alt="TTE Admin" style={{ height: '80px', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontStyle: 'italic', color: '#ccc', fontSize: '10pt' }}>(Tanda Tangan TTE)</span>
                    )}
                  </div>
                  <p>(..........................................)<br/>Kepala UPBU</p>
                </td>
                <td style={{ width: '50%', verticalAlign: 'top' }}>
                  <p style={{ marginBottom: '10px' }}>Pihak Kedua,</p>
                  <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', position: 'relative' }}>
                    <div style={{ position: 'absolute', fontSize: '10pt', color: '#666', zIndex: 0 }}>(Materai 10000)</div>
                    {contract.tenant_signature && (
                      <img src={contract.tenant_signature} alt="TTE Tenant" style={{ height: '80px', objectFit: 'contain', zIndex: 1, position: 'relative', mixBlendMode: 'multiply' }} />
                    )}
                  </div>
                  <p>({contract.tenants?.pic || contract.tenants?.nama_perusahaan})</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

SuratPKS.displayName = 'SuratPKS';
export default SuratPKS;
