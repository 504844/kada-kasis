import React, { useMemo } from 'react';
import { FilterOption } from '../../../types';
import { X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterBarProps {
  filters: FilterOption[];
  onToggleFilter: (id: string) => void;
  activeTeamFilter: string | null;
  activeTeamLogo?: string;
  onClearTeamFilter: () => void;
  favoriteTeams?: string[];
  onUnfavoriteTeam?: (team: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  onToggleFilter,
  activeTeamFilter,
  activeTeamLogo,
  onClearTeamFilter,
  favoriteTeams = [],
  onUnfavoriteTeam,
}) => {
  
  const leagueFilters = useMemo(() => filters.filter(f => f.type === 'league'), [filters]);
  const statusFilters = useMemo(() => filters.filter(f => f.type === 'status' || f.type === 'time'), [filters]);

  return (
    <div className="flex flex-col gap-2 px-6 mb-6 mt-2 max-w-7xl mx-auto">
      
      {/* Primary Row: Leagues */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* League Scroll Container */}
        <div className="relative group flex-1 w-full min-w-0">
          <div className="flex gap-3 overflow-x-auto py-1.5 px-1 scrollbar-hide items-center">
            {leagueFilters.map((filter) => (
              <motion.button
                key={filter.id}
                onClick={() => onToggleFilter(filter.id)}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide border transition-all duration-300 shrink-0 backdrop-blur-sm
                  ${filter.active 
                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                    : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10 hover:border-white/10 hover:text-zinc-200'
                  }
                `}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row: Status/Time Filters */}
      <div className="flex items-center justify-between gap-4 mt-1">
        <div className="flex gap-2 overflow-x-auto py-1.5 px-1 scrollbar-hide items-center flex-1">
            {statusFilters.map((filter) => (
            <motion.button
                key={filter.id}
                onClick={() => onToggleFilter(filter.id)}
                whileTap={{ scale: 0.95 }}
                className={`
                relative px-2.5 py-1 rounded-full text-[9px] font-semibold tracking-wide border transition-all duration-200 shrink-0 uppercase
                ${filter.active
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                    : 'bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
                }
                `}
            >
                {filter.label}
            </motion.button>
            ))}
        </div>
      </div>
      
      {/* Active Filters / Favorites Area */}
      <div className="flex flex-col gap-3 mt-2">
        
        {/* Active Filter Drilldown */}
        {activeTeamFilter && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center px-1"
            >
            <button 
                onClick={onClearTeamFilter}
                className="group relative flex items-center gap-3 pl-2 pr-4 py-2 bg-zinc-900/80 border border-white/10 rounded-full text-xs text-white hover:border-white/30 hover:bg-zinc-800 transition-all duration-300 backdrop-blur-md shadow-lg"
            >
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center overflow-hidden ring-1 ring-white/10">
                    <img 
                        src={activeTeamLogo || ""} 
                        className="w-full h-full object-cover" 
                        alt={activeTeamFilter} 
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>
                <span className="font-bold tracking-wide">{activeTeamFilter}</span>
                <div className="w-px h-3 bg-white/10 mx-1"></div>
                <div className="bg-white/10 rounded-full p-0.5 group-hover:bg-white/20 transition-colors">
                    <X size={10} className="text-zinc-400 group-hover:text-white transition-colors" />
                </div>
            </button>
            </motion.div>
        )}

        {/* Favorite Teams List */}
        <AnimatePresence>
            {favoriteTeams.length > 0 && onUnfavoriteTeam && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-1 overflow-hidden"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Star size={10} className="text-zinc-500 fill-zinc-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Mėgstamos komandos</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <AnimatePresence mode="popLayout">
                            {favoriteTeams.map(team => (
                                <motion.div
                                    key={team}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-zinc-900/50 border border-white/5 rounded-lg group hover:border-white/20 transition-colors"
                                >
                                    <span className="text-[10px] font-semibold text-zinc-300">{team}</span>
                                    <button 
                                        onClick={() => onUnfavoriteTeam(team)}
                                        className="p-0.5 rounded hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                                    >
                                        <X size={10} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};