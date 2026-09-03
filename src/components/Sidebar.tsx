"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Building2, Users, FileText, Activity, 
  Calculator, Receipt, CreditCard, RefreshCcw, BarChart3,
  Circle, User, Car, Clock, FileSpreadsheet, AlertTriangle,
  TrendingUp, ShieldCheck, Cpu
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  superAdminOnly?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isSuperAdmin = user?.role?.toLowerCase() === 'superadmin';
  const isExecutive = user?.role?.toLowerCase() === 'eksekutif' || user?.role?.toLowerCase() === 'dishub';

  // Pengelompokan Halaman Sesuai Domain Logika Bisnis MARS (Tanpa Badge Pengganggu)
  const navGroups: NavGroup[] = [
    {
      title: "Ringkasan & Utama",
      items: [
        { href: "/admin", label: "Dashboard", icon: <BarChart3 /> },
        ...(isExecutive ? [{ href: "/eksekutif", label: "Portal Eksekutif", icon: <TrendingUp /> }] : [])
      ]
    },
    {
      title: "Retribusi Parkir",
      items: [
        { href: "/admin/parkir", label: "Parkir Manual", icon: <Car /> },
        { href: "/admin/parkir-iot-simulation", label: "Simulasi IoT (Fase 2)", icon: <Cpu /> },
      ]
    },
    {
      title: "Pelayanan & Kontrak",
      items: [
        { href: "/admin/permohonan", label: "Permohonan Masuk", icon: <FileText /> },
        { href: "/admin/kontrak", label: "Kontrak Sewa", icon: <FileText /> },
        { href: "/admin/penyewa", label: "Daftar Penyewa", icon: <Users /> },
        { href: "/admin/pemakaian", label: "Pemakaian Aset", icon: <Activity /> },
        { 
          href: "/admin/verifikasi", 
          label: "Verifikasi Tenant", 
          icon: <ShieldCheck />,
          superAdminOnly: true 
        },
      ]
    },
    {
      title: "Keuangan & Pendapatan",
      items: [
        { href: "/admin/tagihan", label: "SKRD / Tagihan", icon: <Receipt /> },
        { href: "/admin/pembayaran", label: "Pembayaran", icon: <CreditCard /> },
        { href: "/admin/piutang", label: "Aging Piutang", icon: <Clock /> },
        { href: "/admin/peringatan", label: "Surat Peringatan", icon: <AlertTriangle /> },
        { href: "/admin/rekonsiliasi", label: "Rekonsiliasi", icon: <RefreshCcw /> },
      ]
    },
    {
      title: "Aset & Tarif",
      items: [
        { href: "/admin/aset", label: "Aset & Fasilitas", icon: <Building2 /> },
        { href: "/admin/hitung-tarif", label: "Hitung Tarif", icon: <Calculator /> },
      ]
    },
    {
      title: "Pelaporan & Audit",
      items: [
        { href: "/admin/laporan", label: "Laporan PAD", icon: <FileSpreadsheet /> },
      ]
    },
  ];

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-16'} bg-[#222d32] text-white flex-shrink-0 flex flex-col h-full z-20 overflow-hidden transition-all duration-300 select-none`}>
      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 pb-8">
        
        {/* User Panel */}
        <div className={`flex items-center pb-4 whitespace-nowrap ${isOpen ? 'px-4' : 'justify-center'}`}>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 flex-shrink-0 overflow-hidden uppercase font-bold text-lg shadow-sm">
            {user?.username?.charAt(0) || <User className="w-5 h-5" />}
          </div>
          {isOpen && (
            <div className="ml-3 min-w-0">
              <p className="font-bold text-[13px] capitalize truncate text-white">{user?.username || 'Admin'}</p>
              <p className="text-[11px] text-[#00a65a] font-medium flex items-center mt-0.5">
                <Circle className="w-[8px] h-[8px] mr-1.5 fill-[#00a65a] text-[#00a65a]" /> 
                {user?.airport_id === 2 ? 'UPBU Sentani' : 'UPBU Timika'}
              </p>
            </div>
          )}
        </div>

        {/* Navigation Groups */}
        <div className="flex flex-col">
          {navGroups.map((group, groupIndex) => {
            // Filter item berdasarkan role
            const visibleItems = group.items.filter(item => {
              if (item.superAdminOnly && !isSuperAdmin) return false;
              return true;
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={groupIndex} className="flex flex-col">
                {/* Header Kategori */}
                {isOpen ? (
                  <div className="text-[10px] font-bold tracking-wider text-[#4b646f] bg-[#1a2226] px-4 py-2 mt-2 uppercase whitespace-nowrap border-b border-[#2c3b41]/40 flex items-center justify-between">
                    <span>{group.title}</span>
                  </div>
                ) : (
                  <div className="border-t border-[#1a2226] my-2 mx-3" />
                )}

                {/* List Menu per Kategori */}
                <ul className="text-[13px]">
                  {visibleItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link 
                          href={item.href} 
                          title={!isOpen ? item.label : undefined}
                          className={`flex items-center py-2.5 ${isOpen ? 'px-4' : 'justify-center'} transition-colors duration-150 border-l-[3px] group
                            ${isActive 
                              ? 'bg-[#1e282c] border-[#3c8dbc] text-white font-semibold' 
                              : 'border-transparent text-[#b8c7ce] hover:bg-[#1e282c] hover:text-white'}`}
                        >
                          {React.cloneElement(item.icon as React.ReactElement<any>, { 
                            className: `w-4 h-4 flex-shrink-0 transition-colors ${isOpen ? 'mr-3' : ''} ${isActive ? 'text-[#3c8dbc]' : 'text-[#8aa4af] group-hover:text-white'}` 
                          })}
                          {isOpen && (
                            <span className="whitespace-nowrap">{item.label}</span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

      </div>
    </aside>
  );
}
