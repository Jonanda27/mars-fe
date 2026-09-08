"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Building2, Users, FileText, Activity, 
  Calculator, Receipt, CreditCard, RefreshCcw, BarChart3,
  Circle, User, Car, Clock, FileSpreadsheet, Database, AlertTriangle, Map as MapIcon
} from 'lucide-react';

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <BarChart3 /> },
    { href: "/admin/dashboard", label: "GIS", icon: <MapIcon /> },
    { href: "/admin/permohonan", label: "Permohonan Masuk", icon: <FileText /> },
    { href: "/admin/tagihan", label: "SKRD / Tagihan", icon: <Receipt /> },
    { href: "/admin/pembayaran", label: "Pembayaran", icon: <CreditCard />, disabled: true },
    { href: "/admin/piutang", label: "Aging Piutang", icon: <Clock />, disabled: true },
    { href: "/admin/peringatan", label: "Surat Peringatan", icon: <AlertTriangle /> },
    { href: "/admin/rekonsiliasi", label: "Rekonsiliasi", icon: <RefreshCcw />, disabled: true },
    { href: "/admin/kontrak", label: "Kontrak", icon: <FileText /> },
    { href: "/admin/verifikasi", label: "Verifikasi Tenant", icon: <Users /> },
    { href: "/admin/aset", label: "Aset & Fasilitas", icon: <Building2 /> },
    { href: "/admin/tarif", label: "Master Tarif", icon: <Database /> },
    { href: "/admin/pemakaian", label: "Pemakaian", icon: <Activity />, disabled: true },
    { href: "/admin/hitung-tarif", label: "Hitung Tarif", icon: <Calculator />, disabled: true },
    { href: "/admin/laporan", label: "Laporan", icon: <FileSpreadsheet />, disabled: true },
    { href: "/admin/parkir", label: "Smart Parking", icon: <Car />, disabled: true },
  ];

  const isSuperAdmin = user?.role?.toLowerCase() === 'superadmin';

  let filteredNavItems = navItems;

  return (
    <aside className={`${isOpen ? 'w-56' : 'w-16'} bg-[#222d32] text-white flex-shrink-0 flex flex-col h-full z-20 overflow-hidden transition-all duration-300`}>
      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4">
        
        {/* User Panel */}
        <div className={`flex items-center pb-4 whitespace-nowrap ${isOpen ? 'px-4' : 'justify-center'}`}>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 flex-shrink-0 overflow-hidden uppercase font-bold text-lg">
            {user?.username?.charAt(0) || <User className="w-5 h-5" />}
          </div>
          {isOpen && (
            <div className="ml-3">
              <p className="font-semibold text-[14px] capitalize">{user?.username || 'Admin'}</p>
              <p className="text-[11px] text-slate-300 flex items-center mt-1">
                <Circle className="w-[10px] h-[10px] mr-1 fill-[#00a65a] text-[#00a65a]" /> Online
              </p>
            </div>
          )}
        </div>

        {/* Navigation Header */}
        {isOpen && (
          <div className="text-[12px] text-[#4b646f] bg-[#1a2226] px-4 py-3 uppercase whitespace-nowrap">
            Main Navigation
          </div>
        )}
        
        <ul className="text-[14px] mt-2">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            
            if (item.disabled) {
              return (
                <li key={item.href}>
                  <div 
                    title={!isOpen ? `${item.label} (Belum Tersedia)` : undefined}
                    className={`flex items-center py-3 ${isOpen ? 'px-4' : 'justify-center'} border-l-[3px] border-transparent text-[#666] cursor-not-allowed opacity-50 relative`}
                  >
                    {React.cloneElement(item.icon as React.ReactElement<any>, { className: `w-4 h-4 flex-shrink-0 ${isOpen ? 'mr-3' : ''}` })}
                    {isOpen && (
                      <div className="flex justify-between items-center w-full">
                        <span className="whitespace-nowrap">{item.label}</span>
                        <span className="text-[9px] bg-[#333] text-white px-1.5 py-0.5 rounded ml-2">WIP</span>
                      </div>
                    )}
                  </div>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  title={!isOpen ? item.label : undefined}
                  className={`flex items-center py-3 ${isOpen ? 'px-4' : 'justify-center'} transition-colors duration-200 border-l-[3px] 
                    ${isActive ? 'bg-[#1e282c] border-[#3c8dbc] text-white' : 'border-transparent text-[#b8c7ce] hover:bg-[#1e282c] hover:text-white'}`}
                >
                  {React.cloneElement(item.icon as React.ReactElement<any>, { className: `w-4 h-4 flex-shrink-0 ${isOpen ? 'mr-3' : ''} ${isActive ? 'text-[#3c8dbc]' : ''}` })}
                  {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
