import React, { useMemo } from 'react';
import { Game } from '../types';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface GameCardProps {
  game: Game;
  favoriteTeams: string[];
  onToggleFavoriteTeam: (teamName: string) => void;
  onFilterByTeam: (teamName: string) => void;
}

// Deterministic pseudo-random number generator based on string seed
const seededRandom = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return () => {
        const x = Math.sin(hash++) * 10000;
        return x - Math.floor(x);
    };
};

const UniqueBarcode = ({ id }: { id: string }) => {
    const bars = useMemo(() => {
        const rng = seededRandom(id);
        const barCount = 20;
        return Array.from({ length: barCount }).map(() => ({
            width: Math.floor(rng() * 3) + 1, // 1-3px
            opacity: rng() * 0.5 + 0.5, // 0.5-1.0
            height: Math.floor(rng() * 40) + 60, // 60-100% height
            margin: Math.floor(rng() * 2) + 1 // 1-2px gap
        }));
    }, [id]);

    return (
        <div className="flex items-center h-full w-full overflow-hidden">
            {bars.map((bar, idx) => (
                <div 
                    key={idx}
                    style={{ 
                        width: `${bar.width}px`, 
                        height: `${bar.height}%`, 
                        marginRight: `${bar.margin}px`,
                        opacity: bar.opacity
                    }}
                    className="bg-zinc-600 shrink-0 rounded-full"
                />
            ))}
        </div>
    );
};

export const GameCard: React.FC<GameCardProps> = ({ 
  game, 
  favoriteTeams, 
  onToggleFavoriteTeam, 
  onFilterByTeam 
}) => {
  
  const isHomeFavorite = favoriteTeams.includes(game.homeTeam.name);
  const isAwayFavorite = favoriteTeams.includes(game.awayTeam.name);

  const getStatusStripColor = () => {
    if (game.status === 'live') return 'bg-orange-500';
    if (game.status === 'final') return 'bg-zinc-800';
    return 'bg-emerald-400';
  };

  const getBorderClass = () => {
    if (game.status === 'live') return 'border-orange-500/30 hover:border-orange-500/50';
    if (game.status === 'final') return 'border-zinc-800/50 hover:border-zinc-700';
    return 'border-emerald-500/30 hover:border-emerald-500/50';
  };
  
  const getGradientColor = () => {
      if (game.status === 'live') return 'from-orange-500';
      if (game.status === 'final') return 'from-zinc-500';
      return 'from-emerald-400';
  };

  const formatGameTime = () => {
    const date = new Date(game.startTime);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const isToday = date.getTime() >= today.getTime() && date.getTime() < today.getTime() + 86400000;
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    if (isToday) {
        return `${hours}:${minutes}`;
    }
    
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
  };

  const getStatusLabel = () => {
    if (game.status === 'live') {
        if (game.quarter) return `GYVAI • ${game.quarter}`;
        return 'GYVAI';
    }
    if (game.status === 'final') return 'OFICIALIOS RUNGTYNĖS';
    return formatGameTime();
  }

  const TeamRow = ({ 
    name, 
    logo, 
    score, 
    isFavorite, 
    placeholderChar,
    isWinner
  }: { 
    name: string, 
    logo: string, 
    score: number, 
    isFavorite: boolean,
    placeholderChar: string,
    isWinner: boolean
  }) => (
    <div className="flex items-center justify-between group/row py-2 px-1 relative z-10">
       <div className="flex items-center gap-3 min-w-0">
         {/* Logo */}
         <div className="relative w-8 h-8 flex items-center justify-center">
           <img 
             src={logo} 
             alt={name} 
             className="relative max-w-full max-h-full object-contain drop-shadow-lg transition-transform duration-300" 
             onError={(e) => {
                 (e.target as HTMLImageElement).src = `https://placehold.co/40x40/000000/ffffff?text=${placeholderChar}`;
             }}
           />
         </div>
         
         {/* Name */}
         <div className="flex items-center gap-2">
            <span 
                onClick={(e) => {
                    e.stopPropagation();
                    onFilterByTeam(name);
                }}
                className={`text-sm md:text-base font-bold tracking-tight cursor-pointer transition-all duration-300 truncate ${isWinner ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
            {name}
            </span>
            
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavoriteTeam(name);
                }}
                className={`opacity-0 group-hover/row:opacity-100 focus:opacity-100 transition-opacity duration-200 ${isFavorite ? 'opacity-100' : ''}`}
            >
                <Star 
                    size={12} 
                    className={`transition-colors ${isFavorite ? 'fill-white text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]' : 'text-zinc-600 hover:text-zinc-300'}`} 
                />
            </button>
         </div>
       </div>

       {/* Score */}
       <span className={`text-xl font-bold font-mono tabular-nums tracking-tighter ${game.status === 'live' ? 'text-orange-500 drop-shadow-glow-orange' : isWinner ? 'text-white' : 'text-zinc-600'}`}>
          {score}
       </span>
    </div>
  );

  const isHomeWinner = game.status === 'final' && game.homeScore > game.awayScore;
  const isAwayWinner = game.status === 'final' && game.awayScore > game.homeScore;

  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(8px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.4 }}
      className={`group relative bg-[#0a0a0a] border rounded-2xl transition-all duration-300 overflow-hidden flex shadow-lg hover:shadow-2xl ${getBorderClass()}`}
    >
      {/* Running Energy Border (Ground Breaking Feature) */}
      <div className="absolute -inset-[1px] rounded-2xl overflow-hidden z-0 pointer-events-none">
         <div className={`absolute inset-[-50%] bg-[conic-gradient(transparent_0deg,transparent_340deg,var(--tw-gradient-from)_360deg)] animate-border-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${getGradientColor()}`}></div>
      </div>

      {/* Vertical Status Strip */}
      <div className={`w-1.5 shrink-0 ${getStatusStripColor()} relative z-10`}></div>

      <div className="flex-1 p-5 flex flex-col min-h-[180px] relative z-10 bg-[#0a0a0a]">
        {/* Subtle mesh texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        
        {/* Live Indicator Background */}
        {game.status === 'live' && (
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-600/10 blur-[50px] rounded-full pointer-events-none animate-pulse-slow"></div>
        )}

        {/* Header */}
        <div className="relative flex justify-between items-end mb-4 z-10">
            <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 truncate max-w-[150px]">
                {game.league}
                </span>
            </div>
            
            <div className="flex items-center gap-2">
                {game.status === 'live' && (
                    <div className="relative flex h-1.5 w-1.5 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
                    </div>
                )}
                <span className={`text-[10px] font-bold font-mono tracking-wider ${game.status === 'live' ? 'text-orange-500' : 'text-white'}`}>
                {getStatusLabel()}
                </span>
            </div>
        </div>

        {/* Teams */}
        <div className="relative flex flex-col gap-1 z-10 flex-grow">
            <TeamRow 
                name={game.homeTeam.name} 
                logo={game.homeTeam.logo} 
                score={game.homeScore} 
                isFavorite={isHomeFavorite}
                placeholderChar="H"
                isWinner={isHomeWinner}
            />
            <TeamRow 
                name={game.awayTeam.name} 
                logo={game.awayTeam.logo} 
                score={game.awayScore} 
                isFavorite={isAwayFavorite}
                placeholderChar="A"
                isWinner={isAwayWinner}
            />
        </div>

        {/* Ticket Bottom Detail */}
        <div className="relative mt-auto pt-4 z-10">
            {/* Perforated Separator with side cutouts */}
            <div className="relative w-full border-b-2 border-dashed border-zinc-800/60 mb-3">
                 <div className="absolute -left-[26px] -top-1.5 w-4 h-4 bg-[#050505] rounded-full border-r border-zinc-800/50"></div>
                 <div className="absolute -right-[26px] -top-1.5 w-4 h-4 bg-[#050505] rounded-full border-l border-zinc-800/50"></div>
            </div>

            <div className="flex items-center justify-between opacity-60">
                <span className="font-mono text-[10px] font-semibold text-zinc-500 tracking-widest uppercase">OFICIALIOS RUNGTYNĖS</span>
                <div className="relative h-4 w-20 text-zinc-600 overflow-hidden rounded-sm">
                    {/* Unique Barcode */}
                    <UniqueBarcode id={game.id} />
                    
                    {/* Laser Scanner Effect (White) */}
                    <div className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_rgba(255,255,255,1)] animate-scan z-10 mix-blend-overlay"></div>
                </div>
            </div>
        </div>

      </div>
    </motion.div>
  );
};