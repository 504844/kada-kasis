import React from 'react';
import { Settings, Rabbit, LayoutGrid, List } from 'lucide-react';

interface HeaderProps {
  toggleSettings: () => void;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSettings, viewMode, setViewMode }) => {
  return (
    <header className="sticky top-0 z-50 w-full">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xl border-b border-white/5"></div>
        <div className="relative flex items-center justify-between py-4 px-6 md:px-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
                <div className="relative w-9 h-9 flex items-center justify-center group cursor-pointer">
                   <div className="absolute inset-0 bg-white/5 rounded-xl blur-md group-hover:bg-white/10 transition-all duration-500"></div>
                   <div className="relative w-9 h-9 bg-black/80 border border-white/10 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Rabbit size={22} strokeWidth={2} />
                   </div>
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-white leading-none">sportas.vercel.app</h1>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-semibold mt-0.5">REZULTATAI GYVAI</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-white/1 p-1 rounded-lg border border-white/5 shrink-0 mr-1">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 md:p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white/5 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
                        title="Tinklelis"
                    >
                        <LayoutGrid size={16} />
                    </button>
                    <button 
                        onClick={() => setViewMode('table')}
                        className={`p-1.5 md:p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-white/5 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
                        title="Sąrašas"
                    >
                        <List size={16} />
                    </button>
                </div>

                {/* Settings */}
                <button 
                    onClick={toggleSettings}
                    className="group relative p-2 text-zinc-400 hover:text-white transition-colors"
                    aria-label="Nustatymai"
                >
                    <div className="absolute inset-0  rounded-md scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                    <Settings size={20} strokeWidth={1.5} className="relative z-10" />
                </button>
            </div>
        </div>
    </header>
  );
};