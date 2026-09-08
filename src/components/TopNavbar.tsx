"use client";
import React, { useState } from 'react';
import { Menu, Bell, Mail, User, Flag, LogOut, X } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function TopNavbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setShowLogoutModal(false);
    router.push('/login');
  };

  return (
    <>
      <header className="bg-[#222d32] h-12 flex items-center justify-between text-white flex-shrink-0 shadow-sm z-10 border-b border-[#1a2226]">
        <div className="flex items-center h-full">
          <button onClick={onToggleSidebar} className="h-full px-4 hover:bg-[#1a2226] text-[#b8c7ce] hover:text-white transition-colors focus:outline-none border-r border-[#1a2226]">
            <Menu className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center h-full">
          <button className="h-full px-3 relative text-[#b8c7ce] hover:text-white hover:bg-[#1a2226] transition-colors focus:outline-none border-l border-[#1a2226]">
            <Mail className="w-4 h-4" />
            <span className="absolute top-2 right-1 bg-emerald-500 text-white text-[9px] font-bold px-1 rounded-sm leading-tight">4</span>
          </button>
          <button className="h-full px-3 relative text-[#b8c7ce] hover:text-white hover:bg-[#1a2226] transition-colors focus:outline-none border-l border-[#1a2226]">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-1 bg-[#f39c12] text-white text-[9px] font-bold px-1 rounded-sm leading-tight">10</span>
          </button>
          <button className="h-full px-3 relative text-[#b8c7ce] hover:text-white hover:bg-[#1a2226] transition-colors focus:outline-none border-l border-[#1a2226]">
            <Flag className="w-4 h-4" />
            <span className="absolute top-2 right-1 bg-[#dd4b39] text-white text-[9px] font-bold px-1 rounded-sm leading-tight">9</span>
          </button>
          <div 
            onClick={() => setShowLogoutModal(true)}
            title="Logout"
            className="flex items-center gap-2 px-4 hover:bg-[#dd4b39] text-[#b8c7ce] hover:text-white transition-colors h-full cursor-pointer border-l border-[#1a2226]"
          >
            <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-slate-800 overflow-hidden shadow-sm">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Logout</span>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <LogOut className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Konfirmasi Keluar</h3>
              <p className="text-sm text-gray-500">
                Apakah Anda yakin ingin keluar dari aplikasi MARS?
              </p>
            </div>
            <div className="bg-gray-50 p-4 border-t border-gray-100 flex gap-3 justify-center">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Batal
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm text-sm"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
