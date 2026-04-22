import React from "react";
import { Menu, LogOut, Sparkles, User as UserIcon } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
  user?: any;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onMenuClick, 
  user, 
  onLoginClick, 
  onLogoutClick 
}) => {
  return (
    <nav className="h-16 border-b border-white/10 px-4 md:px-6 flex items-center justify-between bg-brand-bg shrink-0 z-50 relative">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 md:w-8 md:h-8 accent-gradient rounded-lg flex items-center justify-center">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-white rounded-sm rotate-45"></div>
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tight uppercase">
            Studio<span className="text-brand-indigo-light">Gen</span>
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden xs:flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
          <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-slate-400 font-semibold truncate max-w-[100px]">Engine Online</span>
        </div>
        
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-1">
              <span className="text-[10px] font-bold text-white/90 truncate max-w-[120px]">{user.email}</span>
              <span className="text-[8px] text-brand-indigo-light uppercase tracking-widest font-black">Cloud Sync Active</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-brand-indigo/20 border border-brand-indigo/30 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-brand-indigo-light" />
            </div>
            <button 
              onClick={onLogoutClick}
              className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={onLoginClick}
            className="flex items-center gap-2 px-4 py-1.5 bg-brand-indigo hover:bg-brand-indigo-hover rounded-full text-xs font-bold transition-all shadow-lg shadow-brand-indigo/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sync Cloud</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="h-10 border-t border-white/10 bg-brand-bg flex items-center justify-between px-4 md:px-6 shrink-0 z-50 relative">
      <div className="text-[8px] md:text-[9px] text-slate-500 tracking-[0.1em] md:tracking-[0.2em] uppercase font-bold truncate mr-4">
        StudioGen v4.2.0-Alpha · <span className="hidden sm:inline text-slate-600">US-WEST-2</span>
      </div>
      <div className="flex gap-4 md:gap-6 text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none shrink-0">
        <span className="flex items-center gap-1.5"><div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-emerald-500 rounded-full"></div> CPU: 12%</span>
        <span className="flex items-center gap-1.5"><div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-amber-500 rounded-full"></div> GPU: 89%</span>
        <span className="hidden sm:inline text-brand-indigo-light">LATENCY: 14MS</span>
      </div>
    </footer>
  );
};
