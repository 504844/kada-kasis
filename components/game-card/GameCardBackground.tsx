import React from "react";
import { Game } from "../../types";

interface GameCardBackgroundProps {
  status: Game['status'];
  isClutch: boolean;
}

export const GameCardBackground: React.FC<GameCardBackgroundProps> = ({ status, isClutch }) => {
  return (
    <>
      {/* Subtle mesh texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      {/* Live Indicator Background */}
      {status === "live" && (
        <div className={`absolute -top-20 -right-20 w-40 h-40 blur-[50px] rounded-full pointer-events-none animate-pulse-slow ${isClutch ? 'bg-red-600/20' : 'bg-orange-600/10'}`}></div>
      )}
    </>
  );
};