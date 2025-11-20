import React from 'react';
import { SlidersHorizontal, Trophy } from 'lucide-react';

interface HeaderProps {
  toggleSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSettings }) => {
  return (
    <header className="sticky top-0 z-50 w-full">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xl border-b border-white/5"></div>
        <div className="relative flex items-center justify-between py-4 px-6 md:px-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
                <div className="relative w-9 h-9 flex items-center justify-center group cursor-pointer">
                   <div className="absolute inset-0 bg-white/5 rounded-xl blur-md group-hover:bg-white/10 transition-all duration-500"></div>
                   <div className="relative w-9 h-9 bg-black/80 border border-white/10 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Trophy size={18} strokeWidth={1.5} />
                   </div>
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-white leading-none">sportas.vercel.app</h1>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-semibold mt-0.5">REZULTATAI GYVAI</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <button 
                onClick={toggleSettings}
                className="group relative p-2 text-zinc-400 hover:text-white transition-colors"
                aria-label="Nustatymai"
                >
                <div className="absolute inset-0 bg-white/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                <SlidersHorizontal size={20} strokeWidth={1.5} className="relative z-10" />
                </button>
            </div>
        </div>
    </header>
  );
};