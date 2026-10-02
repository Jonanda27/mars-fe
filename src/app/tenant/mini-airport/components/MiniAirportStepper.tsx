"use client";

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface MiniAirportStepperProps {
  readonly currentStep: number;
  readonly naturalStep?: number;
  readonly maxStepUnlocked?: number;
  readonly onStepClick?: (step: number) => void;
}

export const MiniAirportStepper: React.FC<MiniAirportStepperProps> = ({
  currentStep,
  naturalStep: naturalStepProp,
  maxStepUnlocked,
  onStepClick
}) => {
  const naturalStep = naturalStepProp ?? maxStepUnlocked ?? currentStep;

  const steps = [
    {
      id: 1,
      title: 'Upload Surat',
      description: 'Surat Permohonan'
    },
    {
      id: 2,
      title: 'Verifikasi Kadis',
      description: 'Persetujuan Surat'
    },
    {
      id: 3,
      title: 'Layanan & Armada',
      description: 'Detail Armada & Jadwal'
    },
    {
      id: 4,
      title: 'Validasi Admin',
      description: 'Alokasi Stand Apron'
    },
    {
      id: 5,
      title: 'Izin Aktif',
      description: 'Slip Pendaratan Resmi'
    }
  ];

  const activeIndex = Math.min(currentStep, steps.length) - 1;
  const progressPercent = steps.length > 1 ? (activeIndex / (steps.length - 1)) * 80 : 0;

  return (
    <div className="w-full py-4 mb-4">
      <div className="flex justify-between items-start w-full max-w-4xl mx-auto relative px-2">
        {/* Progress Line Background */}
        <div className="absolute top-[20px] left-[10%] right-[10%] h-[2px] bg-slate-200 z-0" />

        {/* Progress Line Active */}
        <div
          className="absolute top-[20px] left-[10%] h-[2px] bg-[#3c8dbc] z-0 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < naturalStep;
          const isCurrent = step.id === currentStep;
          const isActive = isCompleted || isCurrent;
          const isAccessible = step.id <= naturalStep && Boolean(onStepClick);

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isAccessible}
              onClick={() => {
                if (isAccessible && onStepClick) {
                  onStepClick(step.id);
                }
              }}
              className={`flex flex-col items-center relative z-10 flex-1 bg-transparent border-0 p-0 transition-all ${
                isAccessible ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              {/* Circle */}
              <div
                className={`w-[40px] h-[40px] rounded-full flex items-center justify-center transition-all duration-300 border-[3px] bg-white ${
                  isActive
                    ? 'border-[#3c8dbc] text-[#3c8dbc]'
                    : 'border-slate-200 text-slate-300'
                } ${
                  isCurrent
                    ? 'shadow-md shadow-blue-100 ring-4 ring-blue-50'
                    : ''
                } ${
                  isAccessible && !isCurrent
                    ? 'hover:border-[#3c8dbc] hover:text-[#3c8dbc]'
                    : ''
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={20} className="text-[#3c8dbc]" />
                ) : (
                  <span
                    className={`text-[14px] font-bold ${
                      isActive ? 'text-[#3c8dbc]' : 'text-slate-300'
                    }`}
                  >
                    {step.id}
                  </span>
                )}
              </div>

              {/* Text */}
              <div className="text-center mt-3">
                <h4
                  className={`font-bold text-[13px] ${
                    isActive ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </h4>
                <p
                  className={`text-[11px] mt-0.5 ${
                    isActive ? 'text-slate-500' : 'text-slate-300'
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};


