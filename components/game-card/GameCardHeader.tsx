import React from "react";
import { Game } from "../../types";

interface GameCardHeaderProps {
  league: string;
  status: Game['status'];
  quarter?: string;
  startTime: string;
  isClutch: boolean;
}

export const GameCardHeader: React.FC<GameCardHeaderProps> = ({
  league,
  status,
  quarter,
  startTime,
  isClutch,
}) => {
  const formatGameTime = () => {
    const date = new Date(startTime);
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

  const getStatusLabel = () => {
    if (status === "live") {
      if (quarter) return `GYVAI • ${quarter}`;
      return "GYVAI";
    }
    if (status === "final") return "BAIGĖSI";
    return formatGameTime();
  };

  return (
    <div className="relative flex justify-between items-end mb-3 z-10">
      <div className="flex flex-col gap-0.5">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 truncate max-w-[150px]">
          {league}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {status === "live" && (
          <div className="relative flex h-1.5 w-1.5 mr-1">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isClutch ? 'bg-red-500' : 'bg-orange-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isClutch ? 'bg-red-600' : 'bg-orange-500'}`}></span>
          </div>
        )}
        <span
          className={`text-[10px] font-bold font-mono tracking-wider ${
            isClutch ? "text-red-500" : status === "live" ? "text-orange-500" : "text-white"
          }`}
        >
          {getStatusLabel()}
        </span>
      </div>
    </div>
  );
};