import React from 'react';
import { GameCardSkeleton } from '../../skeletons/GameCardSkeleton';

interface StateDisplayProps {
  loading: boolean;
  error: string | null;
}

export const StateDisplay: React.FC<StateDisplayProps> = ({ loading, error }) => {
  if (loading) {
    return (
      <div className="px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
        {[...Array(6)].map((_, i) => <GameCardSkeleton key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-10 px-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-white font-medium mb-2">Ryšio klaida</h3>
          <p className="text-zinc-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return null;
};