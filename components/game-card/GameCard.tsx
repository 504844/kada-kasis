import React, { useMemo } from "react";
import { Game } from "../../types";
import { motion } from "framer-motion";
import { GameCardHeader } from "./GameCardHeader";
import { GameCardFooter } from "./GameCardFooter";
import { GameCardEffects } from "./GameCardEffects";
import { GameCardBackground } from "./GameCardBackground";
import { GameCardTeamSection } from "./GameCardTeamSection";
import { ClutchBadge } from "./ClutchBadge";
import { isClutchGame } from "../../utils/gameUtils";

interface GameCardProps {
  game: Game;
  favoriteTeams: string[];
  onToggleFavoriteTeam: (teamName: string) => void;
  onFilterByTeam: (teamName: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  favoriteTeams,
  onToggleFavoriteTeam,
  onFilterByTeam,
}) => {
  // Use shared logic for consistency
  const isClutch = useMemo(() => isClutchGame(game), [game]);

  const getStatusStripColor = () => {
    if (isClutch) return "bg-red-500 animate-pulse";
    if (game.status === "live") return "bg-orange-500";
    if (game.status === "final") return "bg-zinc-800";
    return "bg-emerald-400";
  };

  const getBorderClass = () => {
    if (isClutch) return "border-red-500/30 animate-heartbeat";
    if (game.status === "live")
      return "border-orange-500/30 hover:border-orange-500/50";
    if (game.status === "final")
      return "border-zinc-800/50 hover:border-zinc-700";
    return "border-emerald-500/30 hover:border-emerald-500/50";
  };

  const variants = {
    hidden: { 
      opacity: 0, 
      y: 12, 
      filter: "blur(12px)" 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1] as const // Premium cubic-bezier easing
      }
    }
  };

  return (
    <motion.div
      variants={variants}
      className="group relative"
    >
      {/* Badge sits outside the overflow-hidden container */}
      {isClutch && <ClutchBadge />}

      <div className={`relative bg-[#0a0a0a] border rounded-2xl transition-all duration-300 overflow-hidden flex shadow-lg ${getBorderClass()}`}>
          <GameCardEffects status={game.status} isClutch={isClutch} />

          {/* Vertical Status Strip */}
          <div
            className={`w-1.5 shrink-0 ${getStatusStripColor()} relative z-10`}
          ></div>

          <div className="flex-1 p-5 flex flex-col min-h-[190px] relative z-10 bg-[#0a0a0a]">
            <GameCardBackground status={game.status} isClutch={isClutch} />

            <GameCardHeader 
              league={game.league}
              status={game.status}
              quarter={game.quarter}
              startTime={game.startTime}
              isClutch={isClutch}
            />

            <GameCardTeamSection 
                game={game} 
                favoriteTeams={favoriteTeams}
                onToggleFavoriteTeam={onToggleFavoriteTeam}
                onFilterByTeam={onFilterByTeam}
            />

            <GameCardFooter id={game.id} />
          </div>
      </div>
    </motion.div>
  );
};