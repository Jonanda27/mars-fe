import React from 'react';
import { Upload, FileCheck, MapPin, CheckCircle, PenTool, CheckCircle2 } from 'lucide-react';

interface StepperProps {
  readonly currentStep: number;
  readonly requiresPayung?: boolean;
  readonly isHangar?: boolean;
}

export const Stepper: React.FC<StepperProps> = ({ 
  currentStep, 
  requiresPayung = false,
  isHangar = true 
}) => {
  const getSteps = () => {
    if (!isHangar) {
      return [
        { id: 1, title: 'Upload Surat', description: 'Surat Permohonan', icon: <Upload size={20} /> },
        { id: 2, title: 'Verifikasi Kadis', description: 'Persetujuan Surat', icon: <FileCheck size={20} /> },
        { id: 3, title: 'Pilih Layanan', description: 'Detail Ruangan', icon: <MapPin size={20} /> },
        { id: 4, title: 'Validasi Admin', description: 'Alokasi Ruangan', icon: <CheckCircle size={20} /> },
        { id: 5, title: 'Kontrak Sewa', description: 'TTD Surat PKS', icon: <PenTool size={20} /> },
        { id: 6, title: 'Selesai', description: 'Kontrak Sewa Aktif', icon: <CheckCircle2 size={20} /> },
      ];
    }

    if (requiresPayung) {
      return [
        { id: 1, title: 'Upload Surat', description: 'Surat Permohonan', icon: <Upload size={20} /> },
        { id: 2, title: 'Verifikasi Kadis', description: 'Persetujuan Surat', icon: <FileCheck size={20} /> },
        { id: 3, title: 'Kontrak Payung', description: 'TTD PKS Induk', icon: <PenTool size={20} /> },
        { id: 4, title: 'Pilih Layanan', description: 'Detail Hanggar', icon: <MapPin size={20} /> },
        { id: 5, title: 'Validasi Admin', description: 'Alokasi Slot', icon: <CheckCircle size={20} /> },
        { id: 6, title: 'Selesai', description: 'Sewa Hanggar Aktif', icon: <CheckCircle2 size={20} /> },
      ];
    }

    return [
      { id: 1, title: 'Upload Surat', description: 'Surat Permohonan', icon: <Upload size={20} /> },
      { id: 2, title: 'Verifikasi Kadis', description: 'Persetujuan Surat', icon: <FileCheck size={20} /> },
      { id: 3, title: 'Pilih Layanan', description: 'Detail Hanggar', icon: <MapPin size={20} /> },
      { id: 4, title: 'Validasi Admin', description: 'Alokasi Slot', icon: <CheckCircle size={20} /> },
      { id: 5, title: 'Selesai', description: 'Sewa Hanggar Aktif', icon: <CheckCircle2 size={20} /> },
    ];
  };

  const steps = getSteps();

  return (
    <div className="w-full py-4 mb-4">
      <div className="flex justify-between items-start w-full max-w-4xl mx-auto relative px-2">
        
        {/* Progress Line Background */}
        <div className="absolute top-[20px] left-[10%] right-[10%] h-[2px] bg-slate-200 z-0"></div>
        {/* Progress Line Active */}
        <div className="absolute top-[20px] left-[10%] h-[2px] bg-[#3c8dbc] z-0 transition-all duration-500" 
             style={{ width: `${(Math.min(currentStep, steps.length) - 1) / (steps.length - 1) * 80}%` }}></div>
        
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isActive = isCompleted || isCurrent;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
              
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
