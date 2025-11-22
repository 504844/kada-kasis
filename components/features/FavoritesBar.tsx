import React, { useMemo } from "react";
import { Game } from "../../types";
import { motion, AnimatePresence } from "framer-motion";

interface FavoritesBarProps {
  games: Game[];
  onRemoveFavorite: (teamName: string) => void;
}

const FavoriteCard: React.FC<{ game: Game }> = ({ game }) => {
  const getGameDate = () => new Date(game.startTime);

  // Clutch logic: 4th Quarter or OT, game is live, score diff <= 5
  const isClutch = useMemo(() => {
      if (game.status !== 'live') return false;
      const q = game.quarter?.toLowerCase() || "";
      const isLateGame = q.includes('4') || q.includes('ot') || q.includes('pratęsimas');
      const diff = Math.abs(game.homeScore - game.awayScore);
      return isLateGame && diff <= 5;
  }, [game]);

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
    if (isClutch) return "border-red-500/50 animate-heartbeat shadow-[0_0_15px_rgba(239,68,68,0.15)]";
    if (game.status === "live") return "border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]";
    return "border-white/5";
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, fallbackChar: string) => {
      const target = e.currentTarget;
      target.onerror = null; // Prevent infinite loop
      target.src = `https://placehold.co/40x40/000000/ffffff?text=${fallbackChar}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`group relative flex flex-col justify-center bg-[#09090b]/40 backdrop-blur-md border rounded-xl h-[80px] min-w-[140px] overflow-hidden transition-all duration-300 shadow-lg ${getBorderClass()}`}
    >
      {/* Mesh Texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:5px_5px] pointer-events-none z-0"></div>

      {/* Live Indicator Background (Glow) */}
      {game.status === "live" && (
        <div className={`absolute -top-10 -right-10 w-20 h-20 blur-[30px] rounded-full pointer-events-none animate-pulse ${isClutch ? 'bg-red-600/20' : 'bg-orange-600/10'}`}></div>
      )}

      {/* Header Area: Time & Status */}
      <div className="absolute top-2 w-full px-3 z-10 flex items-center pointer-events-none">
        {game.status === "live" ? (
          <>
            <span className={`text-[9px] font-mono font-bold uppercase tracking-wider text-left flex-1 ${isClutch ? 'text-red-400' : 'text-orange-400'}`}>
              {getRelativeLabel()}
            </span>
            <div className="relative flex h-1.5 w-1.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isClutch ? 'bg-red-500' : 'bg-orange-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isClutch ? 'bg-red-600' : 'bg-orange-500'}`}></span>
            </div>
          </>
        ) : (
          <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider w-full text-center">
            {getRelativeLabel()}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between px-4 mt-3">
        {/* Home */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-6 h-6 flex items-center justify-center">
            {/* Drop shadow added to ensure black logos are visible on dark bg */}
            <img
              src={game.homeTeam.logo}
              alt={game.homeTeam.name}
              className="w-full h-full object-contain]"
              onError={(e) => handleImageError(e, "H")}
            />
          </div>
          <span className={`text-sm font-bold font-mono leading-none ${game.status === 'live' ? 'text-white' : 'text-zinc-300'}`}>
            {game.homeScore}
          </span>
        </div>

        <div className={`h-6 w-px mx-1 ${isClutch ? 'bg-red-500/20' : 'bg-white/5'}`}></div>

        {/* Away */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-6 h-6 flex items-center justify-center">
            <img
              src={game.awayTeam.logo}
              alt={game.awayTeam.name}
              className="w-full h-full object-contain]"
              onError={(e) => handleImageError(e, "A")}
            />
          </div>
          <span className={`text-sm font-bold font-mono leading-none ${game.status === 'live' ? 'text-white' : 'text-zinc-300'}`}>
            {game.awayScore}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export const FavoritesBar: React.FC<FavoritesBarProps> = ({ games }) => {
  if (games.length === 0) return null;

  const sortedGames = [...games].sort((a, b) => {
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