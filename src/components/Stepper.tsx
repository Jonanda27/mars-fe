import React from 'react';
import { Upload, FileCheck, MapPin, CheckCircle, PenTool, CheckCircle2 } from 'lucide-react';

interface StepperProps {
  currentStep: number; // 1 to 6
}

export const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, title: 'Upload Surat', description: 'Surat Permohonan', icon: <Upload size={24} />, color: 'bg-amber-400', borderColor: 'border-amber-400' },
    { id: 2, title: 'Verifikasi Kadis', description: 'Persetujuan Surat', icon: <FileCheck size={24} />, color: 'bg-lime-500', borderColor: 'border-lime-500' },
    { id: 3, title: 'Pilih Layanan', description: 'Detail Aset', icon: <MapPin size={24} />, color: 'bg-emerald-500', borderColor: 'border-emerald-500' },
    { id: 4, title: 'Validasi Admin', description: 'Cek Kapasitas', icon: <CheckCircle size={24} />, color: 'bg-cyan-500', borderColor: 'border-cyan-500' },
    { id: 5, title: 'Draft Kontrak', description: 'Pembuatan PKS', icon: <PenTool size={24} />, color: 'bg-blue-500', borderColor: 'border-blue-500' },
    { id: 6, title: 'Selesai', description: 'Kontrak Aktif', icon: <CheckCircle2 size={24} />, color: 'bg-purple-500', borderColor: 'border-purple-500' },
  ];

  return (
    <div className="w-full py-4 mb-4">
      <div className="flex justify-between items-start w-full max-w-4xl mx-auto relative px-2">
        
        {/* Progress Line Background */}
        <div className="absolute top-[20px] left-[10%] right-[10%] h-[2px] bg-slate-200 z-0"></div>
        {/* Progress Line Active */}
        <div className="absolute top-[20px] left-[10%] h-[2px] bg-[#3c8dbc] z-0 transition-all duration-500" 
             style={{ width: `${(Math.min(currentStep, steps.length) - 1) / (steps.length - 1) * 80}%` }}></div>
        
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isActive = isCompleted || isCurrent;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10 w-1/6">
              
              {/* Circle */}
              <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center transition-all duration-300 border-[3px] bg-white
                ${isActive ? 'border-[#3c8dbc] text-[#3c8dbc]' : 'border-slate-200 text-slate-300'}
                ${isCurrent ? 'shadow-md shadow-blue-100 ring-4 ring-blue-50' : ''}
              `}>
                {isCompleted ? (
                  <CheckCircle2 size={20} className="text-[#3c8dbc]" />
                ) : (
                  <span className={`text-[14px] font-bold ${isActive ? 'text-[#3c8dbc]' : 'text-slate-300'}`}>
                    {step.id}
                  </span>
                )}
              </div>

              {/* Text */}
              <div className="text-center mt-3">
                <h4 className={`font-bold text-[13px] ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                  {step.title}
                </h4>
                <p className={`text-[11px] mt-0.5 ${isActive ? 'text-slate-500' : 'text-slate-300'}`}>
                  {step.description}
                </p>
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
};
