import React from 'react';
import { Game } from '../../../types';
import { GameSection } from './GameSection';

interface GameListProps {
  groupedGames: {
    live: Game[];
    today: Game[];
    upcoming: Game[];
    finished: Game[];
  };
  filteredCount: number;
  totalGamesCount: number;
  enabledLeaguesCount: number;
  viewMode: 'grid' | 'table';
  favoriteTeams: string[];
  onToggleFavorite: (team: string) => void;
  onSetTeamFilter: (team: string | null) => void;
}

export const GameList: React.FC<GameListProps> = ({
  groupedGames,
  filteredCount,
  totalGamesCount,
  enabledLeaguesCount,
  viewMode,
  favoriteTeams,
  onToggleFavorite,
  onSetTeamFilter,
}) => {
  if (filteredCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-zinc-600 font-medium tracking-widest uppercase text-xs mb-2">
          Rungtynių nerasta
        </p>
        {enabledLeaguesCount === 0 && totalGamesCount > 0 && (
          <p className="text-zinc-500 text-[10px]">
            Patikrinkite nustatymus, ar pasirinktos lygos.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {groupedGames.live.length > 0 && (
        <GameSection
          title="GYVAI"
          games={groupedGames.live}
          viewMode={viewMode}
          favoriteTeams={favoriteTeams}
          toggleFavoriteTeam={onToggleFavorite}
          setActiveTeamFilter={onSetTeamFilter}
        />
      )}
      {groupedGames.today.length > 0 && (
        <GameSection
          title="ŠIANDIEN"
          games={groupedGames.today}
          viewMode={viewMode}
          favoriteTeams={favoriteTeams}
          toggleFavoriteTeam={onToggleFavorite}
          setActiveTeamFilter={onSetTeamFilter}
        />
      )}
      {groupedGames.upcoming.length > 0 && (
        <GameSection
          title="ARTIMIAUSIOS"
          games={groupedGames.upcoming}
          viewMode={viewMode}
          favoriteTeams={favoriteTeams}
          toggleFavoriteTeam={onToggleFavorite}
          setActiveTeamFilter={onSetTeamFilter}
        />
      )}
      {groupedGames.finished.length > 0 && (
        <GameSection
          title="PASIBAIGĘ"
          games={groupedGames.finished}
          viewMode={viewMode}
          favoriteTeams={favoriteTeams}
          toggleFavoriteTeam={onToggleFavorite}
          setActiveTeamFilter={onSetTeamFilter}
        />
      )}
    </div>
  );
};