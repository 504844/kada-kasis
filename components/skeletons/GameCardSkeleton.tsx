import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const GameCardSkeleton: React.FC = () => {
  return (
    <div className="relative h-[192px] w-full bg-[#0a0a0a] border border-zinc-800/60 rounded-2xl p-5 flex flex-col shadow-lg">
        {/* Fake vertical strip */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-zinc-800/50"></div>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pl-2">
            <Skeleton className="h-2.5 w-20 bg-zinc-800" />
            <Skeleton className="h-2.5 w-12 bg-zinc-800" />
        </div>

        {/* Teams */}
        <div className="flex flex-col gap-3 flex-1 pl-2">
            {/* Home */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-7 h-7 rounded-full bg-zinc-800" />
                    <Skeleton className="h-3 w-24 bg-zinc-800" />
                </div>
                <Skeleton className="h-5 w-6 bg-zinc-800" />
            </div>
             {/* Away */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-7 h-7 rounded-full bg-zinc-800" />
                    <Skeleton className="h-3 w-24 bg-zinc-800" />
                </div>
                <Skeleton className="h-5 w-6 bg-zinc-800" />
            </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 pl-2">
             <div className="border-b-2 border-dashed border-zinc-800/30 mb-2 w-full"></div>
             <div className="flex justify-between items-center">
                 <Skeleton className="h-2 w-20 bg-zinc-800/60" />
                 <Skeleton className="h-3 w-16 bg-zinc-800/60" />
             </div>
        </div>
    </div>
  );
};