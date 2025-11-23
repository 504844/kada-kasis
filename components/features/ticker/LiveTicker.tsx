import React from 'react';
import { motion } from 'framer-motion';
import { Game } from '../../../types';

interface LiveTickerProps {
  games: Game[];
  onGameClick: (team: string) => void;
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ games, onGameClick }) => {
  const liveGames = games.filter((g) => g.status === 'live');

  if (liveGames.length === 0) return null;

  // Duplicate the list multiple times to create a seamless loop
  // We ensure we have enough items so the marquee doesn't have gaps on wide screens
  const displayGames = [...liveGames, ...liveGames, ...liveGames, ...liveGames];

  return (
    <div className="relative w-full bg-[#050505] border-b border-white/5 overflow-hidden h-9 flex items-center z-40">
      
      {/* "Live" Label Badge - Fixed Left */}
      <div className="absolute left-0 top-0 bottom-0 bg-[#050505] pl-6 pr-4 flex items-center gap-2 z-20 border-r border-white/10 shadow-[10px_0_20px_rgba(0,0,0,1)]">
        <div className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
        </div>
        <span className="text-[10px] font-bold text-red-500 tracking-widest uppercase leading-none mt-0.5">GYVAI</span>
      </div>

      {/* Gradient Fade Masks */}
      <div className="absolute left-[80px] top-0 bottom-0 w-12 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none"></div>

      {/* Scrolling Content */}
      <div className="flex items-center overflow-hidden w-full pl-28 mask-image-linear-gradient(to right, transparent, black 10%, black 90%, transparent)">
        <motion.div
          className="flex items-center gap-8 whitespace-nowrap will-change-transform"
          animate={{ x: "-25%" }} // Move by 25% (one full set of the original list)
          transition={{
            duration: Math.max(20, liveGames.length * 8), // Dynamic speed
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {displayGames.map((game, idx) => (
            <button
              key={`${game.id}-${idx}`}
              onClick={() => onGameClick(game.homeTeam.name)}
              className="flex items-center gap-3 group hover:opacity-100 opacity-70 transition-opacity cursor-pointer"
            >
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-zinc-400">
                <span className="font-bold text-zinc-200 group-hover:text-white transition-colors uppercase tracking-tight">{game.homeTeam.name}</span>
                <span className="text-orange-500 font-bold">{game.homeScore}</span>
                <span className="text-zinc-700 mx-0.5">:</span>
                <span className="text-orange-500 font-bold">{game.awayScore}</span>
                <span className="font-bold text-zinc-200 group-hover:text-white transition-colors uppercase tracking-tight">{game.awayTeam.name}</span>
              </div>
              
              <div className="text-[9px] font-bold text-zinc-600 bg-zinc-900/50 px-1.5 py-0.5 rounded border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                 {game.quarter}
              </div>

              {/* Separator Dot */}
              <div className="w-1 h-1 rounded-full bg-zinc-800 ml-4"></div>
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};