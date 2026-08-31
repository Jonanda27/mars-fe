import { Menu, Bell, Mail, User, Flag } from 'lucide-react';

export default function TopNavbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
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
          onClick={() => {
            const store = require('@/store/useAuthStore').useAuthStore.getState();
            store.logout();
            window.location.href = '/login';
          }}
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
  );
}
