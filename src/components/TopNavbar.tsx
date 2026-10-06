"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, Inbox } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useNotificationStore, Notification } from '@/store/useNotificationStore';
import toast from 'react-hot-toast';

interface TopNavbarProps {
  readonly onToggleSidebar?: () => void;
}

interface NotificationListProps {
  readonly notifications: Notification[];
  readonly onNotifClick: (id: number | string, link?: string) => void;
}

function NotificationList({ notifications, onNotifClick }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Inbox className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-xs font-semibold text-gray-700">Belum Ada Notifikasi</p>
        <p className="text-[11px] text-gray-400 mt-1">Pemberitahuan berkas dan aktivitas sistem akan muncul di sini.</p>
      </div>
    );
  }

  return (
    <div>
      {notifications.map((notif: Notification, idx: number) => (
        <button 
          type="button"
          key={`notif-${notif.id}-${idx}`} 
          onClick={() => onNotifClick(notif.id, notif.link_url)}
          className={`w-full text-left p-3 border-b border-gray-100 cursor-pointer rounded-none hover:bg-slate-50 transition-colors ${!notif.is_read ? 'bg-blue-50/50' : ''}`}
        >
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-1.5 min-w-0 pr-2">
              {notif.is_task && (
                <span className="text-[9px] px-1.5 py-0.5 bg-blue-100 text-[#3c8dbc] border border-blue-200 font-bold rounded flex-shrink-0">
                  Tindakan
                </span>
              )}
              <span className={`text-xs font-bold truncate ${!notif.is_read ? 'text-[#3c8dbc]' : 'text-gray-700'}`}>
                {notif.title}
              </span>
            </div>
            {!notif.is_read && <span className="w-2 h-2 rounded-full bg-[#dd4b39] mt-1 flex-shrink-0"></span>}
          </div>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{notif.message}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] text-gray-400">
              {new Date(notif.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute:'2-digit' })}
            </span>
            {notif.link_url && (
              <span className="text-[10px] font-semibold text-[#3c8dbc] flex items-center">
                Buka Berkas &rarr;
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

export default function TopNavbar({ onToggleSidebar }: TopNavbarProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { user, logout, token } = useAuthStore();
  const router = useRouter();

  // Notification Store
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    fetchNotifications,
    fetchTasks,
    connectSSE,
    disconnectSSE
  } = useNotificationStore();

  useEffect(() => {
    if (token) {
      fetchNotifications(token);
      fetchTasks(user);
      connectSSE(token);
    }
    return () => {
      disconnectSSE();
    };
  }, [token, user, fetchNotifications, fetchTasks, connectSSE, disconnectSSE]);

  // Handle click outside & Escape key to close notification dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNotifDropdown(false);
      }
    };

    if (showNotifDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showNotifDropdown]);

  const handleToggleNotifDropdown = () => {
    const nextState = !showNotifDropdown;
    setShowNotifDropdown(nextState);
    if (nextState) {
      if (token) fetchNotifications(token);
      fetchTasks(user);
    }
  };

  const handleLogout = () => {
    toast.dismiss();
    logout();
    setShowLogoutModal(false);
    disconnectSSE();
    router.push('/login');
  };

  const handleNotifClick = (id: number | string, link?: string) => {
    markAsRead(id, token ?? undefined, user?.id);
    setShowNotifDropdown(false);
    if (link) {
      let targetLink = link;
      if (user?.role?.toLowerCase() === 'dinas' && targetLink.startsWith('/admin')) {
        targetLink = targetLink.replace(/^\/admin/, '/dinas');
      }
      router.push(targetLink);
    }
  };

  return (
    <>
      <header className="bg-[#222d32] h-12 flex items-center justify-end text-white flex-shrink-0 shadow-sm z-50 border-b border-[#1a2226] relative">
        <div className="flex items-center h-full relative">
          
          {/* Notification Bell */}
          <div ref={notifRef} className="relative h-full flex">
            <button 
              type="button"
              onClick={handleToggleNotifDropdown}
              className="h-full px-4 relative text-[#b8c7ce] hover:text-white hover:bg-[#1a2226] transition-colors focus:outline-none border-l border-[#1a2226]"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 bg-[#dd4b39] text-white text-[9px] font-bold px-1 rounded-sm leading-tight animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown Notification */}
            {showNotifDropdown && (
              <div className="absolute top-12 right-0 w-80 sm:w-96 bg-white border border-gray-200 shadow-2xl rounded-none overflow-hidden z-50 text-gray-800">
                <div className="bg-gray-50 border-b border-gray-200 p-3 flex justify-between items-center">
                  <h4 className="font-bold text-gray-800 text-sm">Notifikasi Anda</h4>
                  {unreadCount > 0 && (
                    <button 
                      type="button"
                      onClick={() => markAllAsRead(token ?? undefined, user?.id)}
                      className="text-[11px] text-[#3c8dbc] hover:underline font-medium rounded-none"
                    >
                      Tandai semua dibaca
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  <NotificationList 
                    notifications={notifications} 
                    onNotifClick={handleNotifClick} 
                  />
                </div>
              </div>
            )}
          </div>

          <button 
            type="button"
            onClick={() => setShowLogoutModal(true)}
            title="Logout"
            className="flex items-center gap-2 px-4 hover:bg-[#dd4b39] text-[#b8c7ce] hover:text-white transition-colors h-full cursor-pointer border-l border-[#1a2226] focus:outline-none bg-transparent rounded-none"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
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
                className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded-none transition-colors text-sm"
              >
                Batal
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 bg-[#dd4b39] hover:bg-[#c93b2a] text-white font-bold py-2 px-4 rounded-none transition-colors shadow-sm text-sm"
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
