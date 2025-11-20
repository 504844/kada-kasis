import React from 'react';
import { Game } from '../types';
import { format, parseISO } from 'date-fns';
import { lt } from 'date-fns/locale';
import { Star } from 'lucide-react';

interface FavoritesBarProps {
  games: Game[];
  onRemoveFavorite: (teamName: string) => void;
}

const FavoriteCard: React.FC<{ game: Game }> = ({ game }) => {
  const getGameDate = () => parseISO(game.startTime);

  const getRelativeLabel = () => {
    const date = getGameDate();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const gameDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (gameDate.getTime() === today.getTime()) return 'Šiandien';
    if (gameDate.getTime() === tomorrow.getTime()) return 'Rytoj';
    return format(date, 'MM-dd', { locale: lt });
  };

  const isLive = game.status === 'live';

  return (
    <div className="group relative flex flex-col items-center justify-center bg-black border border-zinc-800 rounded-xl p-4 min-w-[140px] h-[90px] hover:border-white/20 hover:shadow-glow-white transition-all duration-300 shrink-0 overflow-hidden cursor-default">
      
      {/* Subtle Glow BG */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {isLive && (
        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse"></div>
      )}
      
      <div className="relative z-10 flex items-center gap-1.5 mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
        <Star size={10} className="fill-white text-white" />
        <span className="text-[10px] font-bold tracking-widest text-white uppercase">{getRelativeLabel()}</span>
      </div>
      
      <div className="relative z-10 flex items-center justify-between w-full px-1 gap-3">
         <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center p-0.5 shadow-md shrink-0">
            <img src={game.homeTeam.logo} alt={game.homeTeam.name} className="w-full h-full object-contain" />
         </div>
         <span className="text-[10px] text-zinc-600 font-bold tracking-widest">VS</span>
         <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center p-0.5 shadow-md shrink-0">
            <img src={game.awayTeam.logo} alt={game.awayTeam.name} className="w-full h-full object-contain" />
         </div>
      </div>
      
      <div className="relative z-10 flex justify-between w-full px-2 mt-2">
         <span className={`text-[11px] font-mono font-bold ${isLive ? 'text-orange-500' : 'text-zinc-500 group-hover:text-zinc-300'}`}>{game.homeScore}</span>
         <span className={`text-[11px] font-mono font-bold ${isLive ? 'text-orange-500' : 'text-zinc-500 group-hover:text-zinc-300'}`}>{game.awayScore}</span>
      </div>
    </div>
  );
};

export const FavoritesBar: React.FC<FavoritesBarProps> = ({ games }) => {
  if (games.length === 0) return null;

  const sortedGames = [...games].sort((a, b) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  return (
    <div className="w-full max-w-7xl mx-auto overflow-x-auto pb-6 pt-2 px-6 scrollbar-hide">
      <div className="flex items-center gap-4">
        {sortedGames.map((game) => (
          <FavoriteCard 
            key={game.id} 
            game={game} 
          />
        ))}
      </div>
    </div>
  );
};