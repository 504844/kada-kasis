import React from "react";
import { Flame } from "lucide-react";

export const ClutchBadge: React.FC = () => {
  return (
    <div className="absolute -top-3 right-8 z-30 flex items-center gap-1.5 px-3 py-0.5 bg-[#0a0a0a] border border-red-500 rounded-full">
      <Flame size={10} className="text-red-500 fill-red-500" />
      <span className="text-[9px] font-bold text-red-500 tracking-widest uppercase">
        INTRIGA
      </span>
    </div>
  );
};