import React from 'react';
import { Game } from '../../../types';

interface LiveTickerProps {
  games: Game[];
  onGameClick: (team: string) => void;
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ games, onGameClick }) => {
  const liveGames = games.filter((g) => g.status === 'live');

  if (liveGames.length === 0) return null;

  // 1. Ensure we have enough content to cover the screen width.
  // Assuming average item width ~250px. 1920px screen requires ~8 items.
  // We use 10 to be safe for wider screens.
  const MIN_ITEMS = 10; 
  const duplicationCount = Math.ceil(MIN_ITEMS / liveGames.length);
  
  // Create a base list that is long enough
  const tickerItems = Array.from({ length: duplicationCount }).flatMap(() => liveGames);

  // Speed regulation: ~3s per item ensures readable speed regardless of count
  const duration = `${Math.max(20, tickerItems.length * 5)}s`;

  return (
    <div className="relative w-full bg-[#050505] border-b border-white/5 overflow-hidden h-9 flex items-center z-40 group">
      
      {/* "Live" Badge - Fixed over the ticker */}
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

      {/* Scrolling Container */}
      <div className="flex w-full pl-28 mask-image-linear-gradient(to right, transparent, black 10%, black 90%, transparent)">
          {/* We render two identical sets of items for the seamless loop */}
          {[0, 1].map((i) => (
             <div 
                key={i}
                className="flex items-center gap-8 animate-marquee whitespace-nowrap min-w-full shrink-0 pr-8 group-hover:[animation-play-state:paused]"
                style={{ animationDuration: duration }}
                aria-hidden={i === 1}
             >
                {tickerItems.map((game, idx) => (
                    <button
                        key={`${game.id}-${i}-${idx}`}
                        onClick={() => onGameClick(game.homeTeam.name)}
                        className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                         <div className="flex items-center gap-2 text-xs font-mono font-medium text-zinc-400">
                            <span className="font-bold text-zinc-200 hover:text-white transition-colors uppercase tracking-tight">{game.homeTeam.name}</span>
                            <span className="text-orange-500 font-bold">{game.homeScore}</span>
                            <span className="text-zinc-700 mx-0.5">:</span>
                            <span className="text-orange-500 font-bold">{game.awayScore}</span>
                            <span className="font-bold text-zinc-200 hover:text-white transition-colors uppercase tracking-tight">{game.awayTeam.name}</span>
                        </div>
                        
                        <div className="text-[9px] font-bold text-zinc-600 bg-zinc-900/50 px-1.5 py-0.5 rounded border border-zinc-800 transition-colors">
                            {game.quarter}
                        </div>

                         {/* Dot Separator */}
                         <div className="w-1 h-1 rounded-full bg-zinc-800"></div>
                    </button>
                ))}
             </div>
          ))}
      </div>
    </div>
  );
};