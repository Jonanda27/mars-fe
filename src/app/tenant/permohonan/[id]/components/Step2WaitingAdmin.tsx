import React from 'react';
import { RentalApplication } from '@/types/rental';
import { Aircraft } from '@/types/aircraft';
import { FileText, Loader2, CheckCircle2, Plane } from 'lucide-react';
import dayjs from 'dayjs';

interface Step2WaitingAdminProps {
  app: RentalApplication;
  tenantAircrafts: Aircraft[];
  allTenantAircrafts: Aircraft[];
  masterAircraftTypes: { id: number; jenis_pesawat: string; luas_efektif_m2: string }[];
}

export const Step2WaitingAdmin: React.FC<Step2WaitingAdminProps> = ({
  app,
  tenantAircrafts,
  allTenantAircrafts,
  masterAircraftTypes,
}) => {
  return (
    <div className="bg-white border-t-[4px] border-[#3c8dbc] shadow-md rounded-lg mb-8 overflow-hidden">
      
      {/* Hero / Banner Section */}
      <div className="bg-gradient-to-br from-[#f4f8fb] to-white p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start border-b border-[#e1ecf4] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <FileText className="w-64 h-64 text-[#3c8dbc]" />
        </div>
        
        <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 relative z-10">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-[#e1ecf4]">
            <Loader2 className="w-10 h-10 text-[#3c8dbc] animate-spin" />
          </div>
          <div className="absolute inset-0 bg-[#3c8dbc] opacity-20 rounded-full blur-xl scale-150 -z-10"></div>
        </div>
        
        <div className="text-center md:text-left flex-1 z-10 mt-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100/50 text-[#3c8dbc] border border-blue-200 text-[11px] font-bold uppercase tracking-wider mb-3">
            Status Saat Ini
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Menunggu Validasi Kapasitas</h2>
          <p className="text-slate-600 text-[14px] leading-relaxed max-w-3xl">
            Formulir detail layanan penyewaan yang Anda ajukan telah kami terima dengan baik. Saat ini, Tim Admin sedang mencocokkan luas dimensi pesawat Anda dengan ketersediaan ruang di aset terkait. Proses ini biasanya memakan waktu <strong className="text-slate-700">1-2 hari kerja</strong>.
          </p>
        </div>
      </div>

      {/* Receipt Summary */}
      <div className="p-8 md:p-12 bg-white">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <h3 className="text-[16px] font-bold text-slate-800 flex items-center">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
            Rangkuman Pengajuan Layanan
          </h3>
          <span className="text-xs font-bold text-slate-400">ID: {app.application_number}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tujuan / Perihal</p>
               <p className="text-[14px] text-slate-800 font-medium">{app.purpose || '-'}</p>
            </div>
            <div className="flex gap-8">
              <div>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Aset Terpilih</p>
                 <p className="text-[14px] text-[#3c8dbc] font-bold">{app.assets?.nama_aset}</p>
                 <p className="text-xs text-slate-500 mt-0.5">{app.assets?.kode_aset}</p>
              </div>
              <div>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Periode Sewa</p>
                 <p className="text-[14px] text-slate-800 font-medium">
                   {app.start_date ? dayjs(app.start_date).format('DD MMM YYYY') : '-'}
                   <span className="mx-2 text-slate-400">→</span>
                   {app.end_date ? dayjs(app.end_date).format('DD MMM YYYY') : '-'}
                 </p>
                 {app.start_date && app.end_date && (
                   <p className="text-[12px] text-slate-500 mt-0.5">
                     Durasi: <span className="font-bold text-[#3c8dbc]">{dayjs(app.end_date).diff(dayjs(app.start_date), 'day')} Malam</span>
                   </p>
                 )}
              </div>
            </div>
            
            {app.specific_needs?.facilities && (
              <div className="bg-[#f4f8fb] border border-[#d2e3ee] p-4 rounded-md">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Kebutuhan Ruang Khusus</p>
                <p className="text-[13px] text-slate-700 leading-relaxed italic">"{app.specific_needs.facilities}"</p>
              </div>
            )}
          </div>

          {app.application_type?.toLowerCase().includes('hanggar') && app.specific_needs?.aircraft_ids && (
            <div>
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Daftar Armada Pesawat Diajukan</p>
               <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                 <ul className="divide-y divide-slate-100">
                   {app.specific_needs.aircraft_ids.map((idStr: string) => {
                      const aircraft = allTenantAircrafts.find(a => a.id.toString() === idStr) || tenantAircrafts.find(a => a.id.toString() === idStr);
                      if (!aircraft) return <li key={idStr} className="p-3 text-sm text-slate-500">ID Pesawat: {idStr}</li>;
                      
                      let aircraftArea = 0;
                      if (aircraft.custom_type_area) {
                        aircraftArea = Number.parseFloat(aircraft.custom_type_area.toString());
                      } else if (aircraft.aircraft_types?.luas_efektif_m2) {
                        aircraftArea = Number.parseFloat(aircraft.aircraft_types.luas_efektif_m2.toString());
                      } else if (aircraft.aircraft_type_id) {
                        const masterType = masterAircraftTypes.find(t => t.id === aircraft.aircraft_type_id);
                        if (masterType?.luas_efektif_m2) {
                          aircraftArea = Number.parseFloat(masterType.luas_efektif_m2.toString());
                        }
                      }
                      const typeName = aircraft.custom_type_name || aircraft.aircraft_types?.jenis_pesawat || masterAircraftTypes.find(t => t.id === aircraft.aircraft_type_id)?.jenis_pesawat || 'Tipe Tidak Diketahui';
                      
                      return (
                        <li key={idStr} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center mb-2 sm:mb-0">
                            <div className="w-10 h-10 rounded bg-indigo-50 flex items-center justify-center mr-3 border border-indigo-100">
                              <Plane className="w-5 h-5 text-indigo-500" />
                            </div>
                            <div>
                              <span className="block text-[14px] font-bold text-slate-800 leading-none mb-1">{aircraft.registration_number}</span> 
                              <span className="text-slate-500 text-[11px] font-medium">{typeName}</span>
                            </div>
                          </div>
                          <div className="flex gap-4 sm:text-right pl-13 sm:pl-0">
                            <div>
                              <span className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">MTOW</span>
                              <span className="text-[13px] font-medium text-slate-700">{aircraft.mtow || 0} Kg</span>
                            </div>
                            <div>
                              <span className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">Luas</span>
                              <span className="text-[13px] font-medium text-slate-700">{aircraftArea} m²</span>
                            </div>
                          </div>
                        </li>
                      );
                   })}
                 </ul>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2WaitingAdmin;
