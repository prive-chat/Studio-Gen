import React from "react";
import { Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
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
        <div className="hidden lg:flex items-center gap-4 text-[11px] font-bold tracking-wider opacity-70 uppercase">
          <a href="#" className="hover:text-brand-indigo-light transition-colors">Galeria</a>
          <a href="#" className="hover:text-brand-indigo-light transition-colors">Modelos</a>
          <a href="#" className="hover:text-brand-indigo-light transition-colors">Facturacion</a>
        </div>
        <div className="w-8 h-8 rounded-full border border-white/20 bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
          <img src="https://picsum.photos/seed/user/32/32" alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
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
