import React from "react";
import { Star } from "lucide-react";

interface TeamRowProps {
  name: string;
  logo: string;
  score: number;
  isFavorite: boolean;
  isLive: boolean;
  isWinner: boolean;
  placeholderChar: string;
  onToggleFavorite: () => void;
  onFilterByTeam: () => void;
}

export const GameCardTeamRow: React.FC<TeamRowProps> = ({
  name,
  logo,
  score,
  isFavorite,
  isLive,
  isWinner,
  placeholderChar,
  onToggleFavorite,
  onFilterByTeam,
}) => {
  return (
    <div className="flex items-center justify-between group/row py-2 px-1 relative z-10">
      <div className="flex items-center gap-3 min-w-0">
        {/* Logo */}
        <div className="relative w-8 h-8 flex items-center justify-center">
          <img
            src={logo}
            alt={name}
            className="relative max-w-full max-h-full object-contain drop-shadow-lg transition-transform duration-300"
            onError={(e) => {
              const target = e.currentTarget;
              // Prevent infinite loop if fallback fails
              target.onerror = null;
              target.src = `https://placehold.co/40x40/000000/ffffff?text=${placeholderChar}`;
            }}
          />
        </div>

        {/* Name */}
        <div className="flex items-center gap-2">
          <span
            onClick={(e) => {
              e.stopPropagation();
              onFilterByTeam();
            }}
            className={`text-sm md:text-base font-bold tracking-tight cursor-pointer transition-all duration-300 truncate ${
              isWinner ? "text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {name}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`opacity-0 group-hover/row:opacity-100 focus:opacity-100 transition-opacity duration-200 ${
              isFavorite ? "opacity-100" : ""
            }`}
          >
            <Star
              size={12}
              className={`transition-colors ${
                isFavorite
                  ? "fill-white text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                  : "text-zinc-600 hover:text-zinc-300"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Score */}
      <span
        className={`text-xl font-bold font-mono tabular-nums tracking-tighter ${
          isLive
            ? "text-orange-500 drop-shadow-glow-orange"
            : isWinner
            ? "text-white"
            : "text-zinc-600"
        }`}
      >
        {score}
      </span>
    </div>
  );
};