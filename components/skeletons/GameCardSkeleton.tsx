import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const GameCardSkeleton: React.FC = () => {
  return (
    <div className="relative bg-[#0a0a0a] border border-white/5 rounded-2xl flex shadow-lg overflow-hidden min-h-[192px]">
        {/* Vertical Strip Match */}
        <div className="w-1.5 shrink-0 bg-zinc-800/40 relative z-10"></div>
        
        {/* Content Container Match */}
        <div className="flex-1 p-5 flex flex-col relative z-10 bg-[#0a0a0a]">
            
            {/* Header Match */}
            <div className="flex justify-between items-end mb-3 z-10">
                <Skeleton className="h-2.5 w-24 bg-zinc-800/50" />
                <div className="flex items-center gap-2">
                   <Skeleton className="h-2.5 w-12 bg-zinc-800/50" />
                </div>
            </div>

            {/* Team Section Match */}
            <div className="relative flex flex-col gap-1 z-10 flex-grow mt-1">
                 {/* Home Team */}
                <div className="flex items-center justify-between py-2 px-1">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-full bg-zinc-800/50 shrink-0" />
                        <Skeleton className="h-4 w-32 bg-zinc-800/50" />
                    </div>
                    <Skeleton className="h-6 w-8 bg-zinc-800/50" />
                </div>
                
                {/* Tension Gauge Placeholder */}
                <div className="h-1.5 w-full my-2 bg-zinc-900/30 rounded-full"></div>

                 {/* Away Team */}
                 <div className="flex items-center justify-between py-2 px-1">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-full bg-zinc-800/50 shrink-0" />
                        <Skeleton className="h-4 w-32 bg-zinc-800/50" />
                    </div>
                    <Skeleton className="h-6 w-8 bg-zinc-800/50" />
                </div>
            </div>

            {/* Footer Match */}
            <div className="relative mt-auto pt-4 z-10">
                 <div className="border-b-2 border-dashed border-zinc-800/40 mb-3 w-full"></div>
                 <div className="flex justify-between items-center">
                     <Skeleton className="h-2 w-24 bg-zinc-800/50" />
                     <Skeleton className="h-4 w-20 bg-zinc-800/50 rounded-sm" />
                 </div>
            </div>
        </div>
    </div>
  );
};