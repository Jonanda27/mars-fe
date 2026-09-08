"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Plane, User, Circle, History } from 'lucide-react';

export default function PetugasSidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const navItems = [
    { href: "/petugas", label: "Dashboard", icon: <Plane /> },
    { href: "/petugas/pencatatan", label: "Pencatatan Aktual", icon: <Plane /> },
    { href: "/petugas/riwayat", label: "Riwayat Pencatatan", icon: <History /> },
  ];

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
              <p className="font-semibold text-[14px] capitalize">{user?.username || 'Petugas'}</p>
              <p className="text-[11px] text-[#00a65a] flex items-center mt-1">
                <Circle className="w-2 h-2 mr-1 fill-current" />
                Online
              </p>
            </div>
          )}
        </div>

        {/* Navigation Label */}
        {isOpen && (
          <div className="px-4 py-3 text-[12px] text-[#4b646f] bg-[#1a2226] uppercase font-semibold">
            MAIN NAVIGATION
          </div>
        )}

        {/* Navigation Items */}
        <ul className="text-[14px]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={`flex items-center py-3 ${isOpen ? 'px-4' : 'justify-center'} transition-colors duration-200 border-l-[3px] 
                    ${isActive ? 'bg-[#1e282c] border-[#3c8dbc] text-white' : 'border-transparent text-[#b8c7ce] hover:bg-[#1e282c] hover:text-white'}`}
                >
                  {React.cloneElement(item.icon, { className: `w-4 h-4 flex-shrink-0 ${isOpen ? 'mr-3' : ''} ${isActive ? 'text-[#3c8dbc]' : ''}` })}
                  {isOpen && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
