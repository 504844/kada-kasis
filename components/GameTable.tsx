import React from "react";
import { Game } from "../types";
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
      if (game.quarter) return `${game.quarter}`;
      return "GYVAI";
    }
    if (game.status === "final") return "Baigta";
    return formatGameTime(game);
  };

  const getStatusColor = (game: Game) => {
    if (game.status === "live") return "text-orange-500 font-bold";
    if (game.status === "final") return "text-zinc-500";
    return "text-white";
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-800 bg-[#0a0a0a]/80 backdrop-blur-md">
      <table className="w-full text-sm">
        <tbody>
          {games.map((game) => {
            const isHomeFavorite = favoriteTeams.includes(game.homeTeam.name);
            const isAwayFavorite = favoriteTeams.includes(game.awayTeam.name);
            const isHomeWinner =
              game.status === "final" && game.homeScore > game.awayScore;
            const isAwayWinner =
              game.status === "final" && game.awayScore > game.homeScore;

            return (
              <motion.tr
                key={game.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-zinc-800/50 hover:bg-white/1 transition-colors group"
              >
                {/* Status & Time */}
                <td className="p-4 w-[100px] align-middle">
                  <div className={`text-xs font-mono ${getStatusColor(game)}`}>
                    {getStatusLabel(game)}
                  </div>
                  {game.status === "live" && (
                    <div className="h-1 w-1 bg-orange-500 rounded-full animate-ping mt-1"></div>
                  )}
                </td>

                {/* League */}
                <td className="hidden md:table-cell p-4 text-[10px] text-zinc-500 uppercase tracking-wider font-bold w-[120px] align-middle">
                  {game.league.replace("Betsafe-", "")}
                </td>

                {/* Home Team */}
                <td className="p-4 text-right w-[30%] align-middle">
                  <div className="flex items-center justify-end gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavoriteTeam(game.homeTeam.name);
                        }}
                        className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                          isHomeFavorite ? "opacity-100" : ""
                        }`}
                      >
                        <Star
                          size={10}
                          className={
                            isHomeFavorite
                              ? "fill-white text-white"
                              : "text-zinc-600 hover:text-white"
                          }
                        />
                      </button>
                      <span
                        onClick={() => onFilterByTeam(game.homeTeam.name)}
                        className={`font-bold cursor-pointer hover:underline truncate ${
                          isHomeWinner ? "text-white" : "text-zinc-400"
                        }`}
                      >
                        {game.homeTeam.name}
                      </span>
                    </div>
                    <img
                      src={game.homeTeam.logo}
                      alt=""
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                </td>

                {/* Score */}
                <td className="p-4 text-center w-[100px] align-middle">
                  <div className="flex items-center justify-center font-mono font-bold text-lg tracking-tighter">
                    <span
                      className={
                        game.status === "live"
                          ? "text-orange-500"
                          : isHomeWinner
                          ? "text-white"
                          : "text-zinc-500"
                      }
                    >
                      {game.homeScore}
                    </span>
                    <span className="text-zinc-700 mx-1">-</span>
                    <span
                      className={
                        game.status === "live"
                          ? "text-orange-500"
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
                <td className="p-4 text-left w-[30%] align-middle">
                  <div className="flex items-center justify-start gap-3">
                    <img
                      src={game.awayTeam.logo}
                      alt=""
                      className="w-6 h-6 object-contain"
                    />
                    <div className="flex items-center gap-2">
                      <span
                        onClick={() => onFilterByTeam(game.awayTeam.name)}
                        className={`font-bold cursor-pointer truncate ${
                          isAwayWinner ? "text-white" : "text-zinc-400"
                        }`}
                      >
                        {game.awayTeam.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavoriteTeam(game.awayTeam.name);
                        }}
                        className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                          isAwayFavorite ? "opacity-100" : ""
                        }`}
                      >
                        <Star
                          size={10}
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
