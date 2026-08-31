"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  FileText, Receipt, CreditCard, 
  Plane, User, Circle, ShieldCheck
} from 'lucide-react';

export default function TenantSidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const isPending = user?.status_verifikasi === 'Pending';

  const navItems = [
    { href: "/tenant", label: "Dashboard Tenant", icon: <Plane /> },
    { href: "/tenant/permohonan", label: "Permohonan Sewa", icon: <FileText /> },
    { href: "/tenant/kontrak", label: "Kontrak & Aset", icon: <FileText /> },
    { href: "/tenant/pesawat", label: "Data Pesawat", icon: <Plane /> },
    { href: "/tenant/tagihan", label: "e-SKRD & Tagihan", icon: <Receipt /> },
    { href: "/tenant/pembayaran", label: "Riwayat Pembayaran", icon: <CreditCard /> },
    { href: "/tenant/profil", label: "Profil & Legalitas", icon: <ShieldCheck /> },
  ];

  // Filter items if pending
  const visibleNavItems = isPending ? navItems.filter(item => item.href === '/tenant/profil') : navItems;

  return (
    <aside className={`${isOpen ? 'w-56' : 'w-16'} bg-[#222d32] text-white flex-shrink-0 flex flex-col h-full z-20 overflow-hidden transition-all duration-300`}>
      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4">
        
        {/* User Panel */}
        <div className={`flex items-center pb-4 whitespace-nowrap ${isOpen ? 'px-4' : 'justify-center'}`}>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 flex-shrink-0 overflow-hidden">
            <User className="w-5 h-5" />
          </div>
          {isOpen && (
            <div className="ml-3">
              <p className="font-semibold text-[14px] truncate max-w-[130px]">{user?.nama_perusahaan || 'Tenant'}</p>
              <p className="text-[11px] text-slate-300 flex items-center mt-1">
                {isPending ? (
                  <><Circle className="w-[10px] h-[10px] mr-1 fill-yellow-500 text-yellow-500" /> Pending Approval</>
                ) : (
                  <><Circle className="w-[10px] h-[10px] mr-1 fill-[#3c8dbc] text-[#3c8dbc]" /> Verified Tenant</>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Navigation Header */}
        {isOpen && (
          <div className="text-[12px] text-[#4b646f] bg-[#1a2226] px-4 py-3 uppercase whitespace-nowrap">
            Tenant Portal
          </div>
        )}
        
        <ul className="text-[14px] mt-2">
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href;
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
