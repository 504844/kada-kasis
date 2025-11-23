import React, { useMemo } from "react";
import { Game } from "../../../types";
import { motion, AnimatePresence } from "framer-motion";
import { isClutchGame } from "../../../utils/gameUtils";

interface FavoritesBarProps {
  games: Game[];
  onRemoveFavorite: (teamName: string) => void;
}

const FavoriteCard: React.FC<{ game: Game }> = ({ game }) => {
  const getGameDate = () => new Date(game.startTime);

  // Use shared logic for consistency
  const isClutch = useMemo(() => isClutchGame(game), [game]);

  const getRelativeLabel = () => {
    if (game.status === "live") return game.quarter || "GYVAI";
    if (game.status === "final") return "BAIGTA";

    const date = getGameDate();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const gameDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    if (gameDate.getTime() === today.getTime()) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }
    if (gameDate.getTime() === tomorrow.getTime()) return "Rytoj";

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${month}-${day}`;
  };

  const getBorderClass = () => {
    if (isClutch) return "border-red-500/30 animate-heartbeat shadow-[0_0_8px_rgba(239,68,68,0.1)]";
    // Reduced shadow spread from 15px to 8px to match clutch max intensity
    if (game.status === "live") return "border-orange-500/30 ]";
    return "border-white/5";
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, fallbackChar: string) => {
      const target = e.currentTarget;
      target.onerror = null; // Prevent infinite loop
      target.src = `https://placehold.co/40x40/000000/ffffff?text=${fallbackChar}`;
  };

  // Clean up league name for mini display
  const leagueShort = game.league
    .replace("Betsafe-", "")
    .replace("Euroleague", "Eurolyga")
    .replace("Europos taurė", "EuroCup")
    .split(" ")[0]
    .toUpperCase();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      className={`group relative flex flex-col justify-between bg-[#09090b]/60 backdrop-blur-md border rounded-xl h-[85px] min-w-[160px] overflow-hidden transition-all duration-300 shadow-lg py-2 ${getBorderClass()}`}
    >
      {/* Mesh Texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:5px_5px] pointer-events-none z-0"></div>

      {/* Live Indicator Background (Glow) */}
      {game.status === "live" && (
        <div className={`absolute -top-10 -right-10 w-20 h-20 blur-[30px] rounded-full pointer-events-none animate-pulse ${isClutch ? 'bg-red-600/20' : 'bg-orange-600/10'}`}></div>
      )}

      {/* Header Area: League & Status */}
      <div className="relative w-full px-3 z-10 flex items-start justify-between pointer-events-none">
         <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">
            {leagueShort}
         </span>

        <div className="flex items-center gap-1.5">
            {game.status === "live" ? (
            <>
                <div className="relative flex h-1.5 w-1.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isClutch ? 'bg-red-500' : 'bg-orange-400'}`}></span>
                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isClutch ? 'bg-red-600' : 'bg-orange-500'}`}></span>
                </div>
                <span className={`text-[9px] font-mono font-bold  tracking-wider ${isClutch ? 'text-red-400' : 'text-orange-400'}`}>
                {getRelativeLabel()}
                </span>
            </>
            ) : (
            <span className="text-[9px] font-mono font-bold text-zinc-500  tracking-wider">
                {getRelativeLabel()}
            </span>
            )}
        </div>
      </div>

      {/* Content: Teams & Scores */}
      <div className="relative z-10 flex items-center justify-between px-3 mt-1">
        {/* Home */}
        <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center">
                <img
                src={game.homeTeam.logo}
                alt={game.homeTeam.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => handleImageError(e, "H")}
                />
            </div>
            <span className={`text-lg font-bold font-mono leading-none tracking-tighter ${game.status === 'live' ? 'text-white' : 'text-zinc-300'}`}>
                {game.homeScore}
            </span>
        </div>

        {/* Divider */}
        <div className={`h-4 w-px mx-1 ${isClutch ? 'bg-red-500/20' : 'bg-white/10'}`}></div>

        {/* Away */}
        <div className="flex items-center gap-2 flex-row-reverse">
            <div className="w-7 h-7 flex items-center justify-center">
                <img
                src={game.awayTeam.logo}
                alt={game.awayTeam.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => handleImageError(e, "A")}
                />
            </div>
            <span className={`text-lg font-bold font-mono leading-none tracking-tighter ${game.status === 'live' ? 'text-white' : 'text-zinc-300'}`}>
                {game.awayScore}
            </span>
        </div>
      </div>

      {/* Bottom Decoration */}
       <div className="relative w-full px-3 mt-1">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
       </div>
    </motion.div>
  );
};

export const FavoritesBar: React.FC<FavoritesBarProps> = ({ games }) => {
  if (games.length === 0) return null;

  const sortedGames = [...games].sort((a, b) => {
    // 1. Push finalized games to the bottom
    if (a.status === 'final' && b.status !== 'final') return 1;
    if (a.status !== 'final' && b.status === 'final') return -1;
    
    // 2. Sort by time
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  return (
    <div className="w-full max-w-7xl mx-auto overflow-x-auto pb-6 pt-2 px-6 scrollbar-hide">
      <div className="flex items-center gap-3">
        <AnimatePresence mode="popLayout">
          {sortedGames.map((game) => (
            <FavoriteCard key={game.id} game={game} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};