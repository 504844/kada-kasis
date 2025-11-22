import React from "react";
import { Game } from "../../types";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface GameTableProps {
  games: Game[];
  favoriteTeams: string[];
  onToggleFavoriteTeam: (teamName: string) => void;
  onFilterByTeam: (teamName: string) => void;
}

export const GameTable: React.FC<GameTableProps> = ({
  games,
  favoriteTeams,
  onToggleFavoriteTeam,
  onFilterByTeam,
}) => {
  const formatGameTime = (game: Game) => {
    const date = new Date(game.startTime);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const isToday =
      date.getTime() >= today.getTime() &&
      date.getTime() < today.getTime() + 86400000;

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    if (isToday) {
      return `${hours}:${minutes}`;
    }

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${month}-${day} ${hours}:${minutes}`;
  };

  const getStatusLabel = (game: Game) => {
    if (game.status === "live") {
      if (game.quarter) return game.quarter;
      return "GYVAI";
    }
    if (game.status === "final") return "Baigta";
    return formatGameTime(game);
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-800 bg-[#0a0a0a] shadow-xl">
      <table className="w-full text-sm border-collapse">
        {/* Table Header */}
        <thead className="bg-zinc-900/50 text-[10px] uppercase tracking-wider font-bold text-zinc-500 border-b border-zinc-800">
          <tr>
            <th className="px-4 py-3 text-left w-[100px] md:w-[130px]">Laikas / Statusas</th>
            <th className="hidden md:table-cell px-4 py-3 text-left w-[100px]">Lyga</th>
            <th className="px-4 py-3 text-right w-[35%] md:w-[30%]">Namai</th>
            <th className="px-4 py-3 text-center w-[80px] md:w-[100px]">Rez.</th>
            <th className="px-4 py-3 text-left w-[35%] md:w-[30%]">Svečiai</th>
          </tr>
        </thead>
        
        {/* Table Body */}
        <tbody className="divide-y divide-zinc-800/50">
          {games.map((game) => {
            const isHomeFavorite = favoriteTeams.includes(game.homeTeam.name);
            const isAwayFavorite = favoriteTeams.includes(game.awayTeam.name);
            const isHomeWinner =
              game.status === "final" && game.homeScore > game.awayScore;
            const isAwayWinner =
              game.status === "final" && game.awayScore > game.homeScore;

            // Clutch logic
            const isClutch = (() => {
                if (game.status !== 'live') return false;
                const q = game.quarter?.toLowerCase() || "";
                const isLateGame = q.includes('4') || q.includes('ot') || q.includes('pratęsimas');
                const diff = Math.abs(game.homeScore - game.awayScore);
                return isLateGame && diff <= 5;
            })();

            // Dynamic Row Styles
            let rowBackground = "bg-[#0a0a0a] hover:bg-zinc-900/30 transition-colors duration-200";
            let borderLeft = "border-l-2 border-transparent";
            
            if (isClutch) {
                rowBackground = "bg-gradient-to-r from-red-950/20 to-transparent";
                borderLeft = "border-l-2 border-red-500";
            } else if (game.status === 'live') {
                rowBackground = "bg-gradient-to-r from-orange-950/20 to-transparent";
                borderLeft = "border-l-2 border-orange-500";
            } else if (game.status === 'final') {
                borderLeft = "border-l-2 border-zinc-800";
            } else {
                 borderLeft = "border-l-2 border-emerald-500/30";
            }

            const statusTextColor = isClutch ? "text-red-500" : (game.status === "live" ? "text-orange-500" : (game.status === "final" ? "text-zinc-500" : "text-zinc-300"));

            return (
              <motion.tr
                key={game.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`${rowBackground} ${borderLeft} group h-14`}
              >
                {/* Status & Time */}
                <td className="px-4 py-2 align-middle whitespace-nowrap">
                   <div className="flex items-center gap-2">
                        {game.status === "live" && (
                            <div className="relative flex h-1.5 w-1.5 shrink-0">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isClutch ? 'bg-red-500' : 'bg-orange-400'}`}></span>
                                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isClutch ? 'bg-red-600' : 'bg-orange-500'}`}></span>
                            </div>
                        )}
                        <span className={`text-[11px] md:text-xs font-mono font-bold tracking-tight ${statusTextColor}`}>
                            {getStatusLabel(game)}
                        </span>
                   </div>
                </td>

                {/* League (Hidden on mobile) */}
                <td className="hidden md:table-cell px-4 py-2 align-middle">
                  <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                    {game.league.replace("Betsafe-", "")}
                  </span>
                </td>

                {/* Home Team */}
                <td className="px-4 py-2 align-middle text-right">
                  <div className="flex items-center justify-end gap-3">
                    <div className="flex items-center gap-2 min-w-0 justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavoriteTeam(game.homeTeam.name);
                        }}
                        className={`hidden md:block opacity-0 group-hover:opacity-100 transition-opacity ${
                          isHomeFavorite ? "opacity-100" : ""
                        }`}
                      >
                        <Star
                          size={12}
                          className={
                            isHomeFavorite
                              ? "fill-white text-white"
                              : "text-zinc-600 hover:text-white"
                          }
                        />
                      </button>
                      <span
                        onClick={() => onFilterByTeam(game.homeTeam.name)}
                        className={`font-bold text-xs md:text-sm cursor-pointer hover:underline truncate ${
                          isHomeWinner ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                        }`}
                      >
                        {game.homeTeam.name}
                      </span>
                    </div>
                    <img
                      src={game.homeTeam.logo}
                      alt=""
                      className="w-6 h-6 md:w-8 md:h-8 object-contain shrink-0 drop-shadow-md"
                    />
                  </div>
                </td>

                {/* Score */}
                <td className="px-4 py-2 align-middle text-center">
                  <div className="inline-flex items-center justify-center font-mono font-bold text-sm md:text-base tabular-nums tracking-tighter bg-zinc-900/40 px-2 py-1 rounded-md border border-white/5 min-w-[60px]">
                    <span
                      className={
                        game.status === "live"
                          ? "text-white drop-shadow-glow-white"
                          : isHomeWinner
                          ? "text-white"
                          : "text-zinc-500"
                      }
                    >
                      {game.homeScore}
                    </span>
                    <span className={`mx-1.5 text-[10px] ${game.status === 'live' ? 'text-zinc-500' : 'text-zinc-700'}`}>:</span>
                    <span
                      className={
                        game.status === "live"
                          ? "text-white drop-shadow-glow-white"
                          : isAwayWinner
                          ? "text-white"
                          : "text-zinc-500"
                      }
                    >
                      {game.awayScore}
                    </span>
                  </div>
                </td>

                {/* Away Team */}
                <td className="px-4 py-2 align-middle text-left">
                  <div className="flex items-center justify-start gap-3">
                    <img
                      src={game.awayTeam.logo}
                      alt=""
                      className="w-6 h-6 md:w-8 md:h-8 object-contain shrink-0 drop-shadow-md"
                    />
                    <div className="flex items-center gap-2 min-w-0 justify-start">
                      <span
                        onClick={() => onFilterByTeam(game.awayTeam.name)}
                        className={`font-bold text-xs md:text-sm cursor-pointer hover:underline truncate ${
                          isAwayWinner ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                        }`}
                      >
                        {game.awayTeam.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavoriteTeam(game.awayTeam.name);
                        }}
                        className={`hidden md:block opacity-0 group-hover:opacity-100 transition-opacity ${
                          isAwayFavorite ? "opacity-100" : ""
                        }`}
                      >
                        <Star
                          size={12}
                          className={
                            isAwayFavorite
                              ? "fill-white text-white"
                              : "text-zinc-600 hover:text-white"
                          }
                        />
                      </button>
                    </div>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
