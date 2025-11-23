import React, { useState, useMemo } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FilterBar } from './components/features/filters/FilterBar';
import { SettingsModal } from './components/features/settings/SettingsModal';
import { AnimatedFavorites } from './components/features/favorites/AnimatedFavorites';
import { StateDisplay } from './components/features/game-list/StateDisplay';
import { GameList } from './components/features/game-list/GameList';
import { useBasketballData } from './hooks/useBasketballData';
import { useAppPersistence } from './hooks/useAppPersistence';
import { useGameFiltering } from './hooks/useGameFiltering';

interface GameSectionProps {
    title: string;
    games: any[];
    viewMode: 'grid' | 'table';
    favoriteTeams: string[];
    toggleFavoriteTeam: (teamName: string) => void;
    setActiveTeamFilter: (name: string | null) => void;
}

export default function App() {
  const { games, loading, error } = useBasketballData();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const persistence = useAppPersistence(games);
  const filtering = useGameFiltering(games, persistence.enabledLeagues);

  const favoriteGames = useMemo(() => {
      return games.filter(g => 
          persistence.favoriteTeams.includes(g.homeTeam.name) || 
          persistence.favoriteTeams.includes(g.awayTeam.name)
      );
  }, [games, persistence.favoriteTeams]);

  return (
    <div className="min-h-screen text-zinc-100 selection:bg-white selection:text-black flex flex-col">
      <Header 
        toggleSettings={() => setIsSettingsOpen(true)}
        viewMode={persistence.viewMode}
        setViewMode={persistence.setViewMode}
      />

      <main className="flex-1 pb-12 pt-2">
        <AnimatedFavorites 
          favoriteGames={favoriteGames}
          onRemoveFavorite={(name) => persistence.toggleFavoriteTeam(name)}
        />

        <FilterBar 
          filters={filtering.visibleFilters} 
          onToggleFilter={filtering.handleToggleFilter}
          activeTeamFilter={filtering.activeTeamFilter}
          activeTeamLogo={filtering.activeTeamLogo}
          onClearTeamFilter={() => filtering.setActiveTeamFilter(null)}
          favoriteTeams={persistence.favoriteTeams}
          onUnfavoriteTeam={(team) => persistence.toggleFavoriteTeam(team)}
        />

        {loading || error ? (
          <StateDisplay loading={loading} error={error} />
        ) : (
          <div className="px-6 max-w-7xl mx-auto">
            <GameList 
              groupedGames={filtering.groupedGames}
              filteredCount={filtering.filteredGames.length}
              totalGamesCount={games.length}
              enabledLeaguesCount={persistence.enabledLeagues.length}
              viewMode={persistence.viewMode}
              favoriteTeams={persistence.favoriteTeams}
              onToggleFavorite={persistence.toggleFavoriteTeam}
              onSetTeamFilter={filtering.setActiveTeamFilter}
            />
          </div>
        )}
      </main>

      <Footer />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        allLeagues={filtering.allLeagues}
        enabledLeagues={persistence.enabledLeagues}
        onToggleLeague={persistence.toggleLeague}
      />
    </div>
  );
}