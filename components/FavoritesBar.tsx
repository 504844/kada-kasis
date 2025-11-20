import React from "react";
import { Game } from "../types";
import { motion, AnimatePresence } from "framer-motion";

interface FavoritesBarProps {
  games: Game[];
  onRemoveFavorite: (teamName: string) => void;
}

const FavoriteCard: React.FC<{ game: Game }> = ({ game }) => {
  const getGameDate = () => new Date(game.startTime);

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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative flex flex-col justify-center bg-[#09090b]/60 backdrop-blur-md border border-white/5 rounded-xl h-[80px] min-w-[140px] overflow-hidden transition-all duration-300 shadow-lg"
    >
      {/* Mesh Texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none z-0"></div>

      {/* Header Area: Time & Status */}
      <div className="absolute top-2 w-full px-3 z-10 flex items-center pointer-events-none">
        {game.status === "live" ? (
          <>
            <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider text-left flex-1">
              {getRelativeLabel()}
            </span>
            <div className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
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
          <div className="w-8 h-8 flex items-center justify-center">
            {/* Drop shadow added to ensure black logos are visible on dark bg */}
            <img
              src={game.homeTeam.logo}
              alt={game.homeTeam.name}
              className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(255,255,255,0.1)]"
            />
          </div>
          <span className="text-sm font-bold font-mono leading-none text-white">
            {game.homeScore}
          </span>
        </div>

        <div className="h-6 w-px bg-white/5 mx-1"></div>

        {/* Away */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-8 h-8 flex items-center justify-center">
            <img
              src={game.awayTeam.logo}
              alt={game.awayTeam.name}
              className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(255,255,255,0.1)]"
            />
          </div>
          <span className="text-sm font-bold font-mono leading-none text-white">
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
