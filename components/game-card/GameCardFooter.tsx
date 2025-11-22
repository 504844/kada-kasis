import React from "react";
import { UniqueBarcode } from "./UniqueBarcode";

export const GameCardFooter: React.FC<{ id: string }> = ({ id }) => {
  return (
    <div className="relative mt-auto pt-4 z-10">
      {/* Perforated Separator with side cutouts */}
      <div className="relative w-full border-b-2 border-dashed border-zinc-800/60 mb-3">
        <div className="absolute -left-[26px] -top-1.5 w-4 h-4 bg-[#050505] rounded-full border-r border-zinc-800/50"></div>
        <div className="absolute -right-[26px] -top-1.5 w-4 h-4 bg-[#050505] rounded-full border-l border-zinc-800/50"></div>
      </div>

      <div className="flex items-center justify-between opacity-60">
        <span className="font-mono text-[10px] font-semibold text-zinc-500 tracking-widest uppercase">
          OFICIALIOS RUNGTYNĖS
        </span>
        <div className="relative h-4 w-20 text-zinc-600 overflow-hidden rounded-sm">
          {/* Unique Barcode */}
          <UniqueBarcode id={id} />

          {/* Laser Scanner Effect (White) */}
          <div className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_rgba(255,255,255,1)] animate-scan z-10 mix-blend-overlay"></div>
        </div>
      </div>
    </div>
  );
};