import React from 'react';
import { Settings, LayoutGrid, List } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  toggleSettings: () => void;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSettings, viewMode, setViewMode }) => {
  return (
    <header className="sticky top-0 z-50 w-full">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xl border-b border-white/5"></div>
        {/* Reduced padding-x on mobile (px-4 vs px-6) and padding-y (py-3 vs py-4) */}
        <div className="relative flex items-center justify-between py-3 px-4 md:py-4 md:px-8 max-w-7xl mx-auto">
            
            <Logo />
            
            <div className="flex items-center gap-2 md:gap-3">
                {/* View Toggle */}
                <div className="flex items-center gap-0.5 md:gap-1 bg-white/1 p-0.5 md:p-1 rounded-lg border border-white/5 shrink-0">
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
                    className="group relative p-1.5 md:p-2 text-zinc-400 hover:text-white transition-colors"
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
