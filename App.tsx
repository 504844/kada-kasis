import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { FavoritesBar } from './components/FavoritesBar';
import { FilterBar } from './components/FilterBar';
import { GameCard } from './components/GameCard';
import { GameTable } from './components/GameTable';
import { SettingsModal } from './components/SettingsModal';
import { INITIAL_FILTERS } from './constants';
import { FilterOption, Game } from './types';
import { useBasketballData } from './hooks/useBasketballData';
import { AnimatePresence, motion } from 'framer-motion';

// Separate component for game list to prevent re-renders of the list when parent state changes (like adding favorites)
const GameSection = React.memo(({ title, games, viewMode, favoriteTeams, toggleFavoriteTeam, setActiveTeamFilter }: any) => (
    <div className="flex flex-col gap-4">
       <div className="flex items-center gap-3 px-1">
            <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase">{title}</h3>
            <div className="h-px flex-1 bg-gradient-to-l from-zinc-800 to-transparent"></div>
       </div>
       
       {viewMode === 'grid' ? (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
               {games.map((game: Game) => (
                   <GameCard 
                       key={game.id} 
                       game={game} 
                       favoriteTeams={favoriteTeams}
                       onToggleFavoriteTeam={toggleFavoriteTeam}
                       onFilterByTeam={(name) => {
                           setActiveTeamFilter(name);
                           window.scrollTo({ top: 0, behavior: 'smooth' });
                       }}
                   />
               ))}
           </div>
       ) : (
           <GameTable 
               games={games}
               favoriteTeams={favoriteTeams}
               onToggleFavoriteTeam={toggleFavoriteTeam}
               onFilterByTeam={(name) => {
                   setActiveTeamFilter(name);
                   window.scrollTo({ top: 0, behavior: 'smooth' });
               }}
           />
       )}
    </div>
));

export default function App() {
  const { games, loading, error } = useBasketballData();
  const [filters, setFilters] = useState<FilterOption[]>(INITIAL_FILTERS);
  const [activeTeamFilter, setActiveTeamFilter] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [viewMode, setViewMode] = useState<'grid' | 'table'>(() => {
      try {
          const saved = localStorage.getItem('view_mode');
          return (saved === 'table') ? 'table' : 'grid';
      } catch(e) {
          return 'grid';
      }
  });

  useEffect(() => {
      localStorage.setItem('view_mode', viewMode);
  }, [viewMode]);
  
  // Favorites persistence
  const [favoriteTeams, setFavoriteTeams] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('favorite_teams');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('favorite_teams', JSON.stringify(favoriteTeams));
  }, [favoriteTeams]);

  // League preferences persistence
  const [enabledLeagues, setEnabledLeagues] = useState<string[]>(() => {
     try {
         const saved = localStorage.getItem('enabled_leagues');
         return saved ? JSON.parse(saved) : []; // Start empty, fill from data
     } catch(e) {
         return [];
     }
  });

  useEffect(() => {
      if (enabledLeagues.length > 0) {
          localStorage.setItem('enabled_leagues', JSON.stringify(enabledLeagues));
      }
  }, [enabledLeagues]);


  const allLeagues = useMemo(() => {
      const unique = new Set(games.map(g => g.league));
      return Array.from(unique).sort();
  }, [games]);
  
  // Initialize enabled leagues if they haven't been set yet, but only once data is loaded
  useEffect(() => {
      if (games.length > 0) {
         const saved = localStorage.getItem('enabled_leagues');
         if (!saved) {
            // If never saved, default to all leagues
            setEnabledLeagues(Array.from(new Set(games.map(g => g.league))));
         }
      }
  }, [games]);


  const toggleFavoriteTeam = (teamName: string) => {
    setFavoriteTeams(prev => {
      if (prev.includes(teamName)) {
        return prev.filter(t => t !== teamName);
      }
      return [...prev, teamName];
    });
  };

  const toggleLeague = (league: string) => {
      setEnabledLeagues(prev => {
          if (prev.includes(league)) return prev.filter(l => l !== league);
          return [...prev, league];
      })
  };

  const handleToggleFilter = (id: string) => {
    setFilters(prev => prev.map(f => {
      if (f.id === id) return { ...f, active: !f.active };
      return f;
    }));
  };

  const activeTeamLogo = useMemo(() => {
    if (!activeTeamFilter) return undefined;
    for (const game of games) {
      if (game.homeTeam.name === activeTeamFilter) return game.homeTeam.logo;
      if (game.awayTeam.name === activeTeamFilter) return game.awayTeam.logo;
    }
    return undefined;
  }, [games, activeTeamFilter]);

  // Compute visible filters based on enabled leagues in settings
  const visibleFilters = useMemo(() => {
    // If no data yet and no preferences, fallback to showing all filters (skeleton state)
    if (games.length === 0 && enabledLeagues.length === 0) return filters;

    return filters.filter(f => {
        // Always show non-league filters (Time, Status)
        if (f.type !== 'league') return true;
        
        // For leagues, show only if enabled in settings
        const label = f.label.toLowerCase();
        return enabledLeagues.some(enabled => {
            const e = enabled.toLowerCase();
            // Fuzzy matching for mapped leagues
            if (f.id === 'euroleague' && (e.includes('euroleague') || e.includes('eurolyga'))) return true;
            if (f.id === 'lkl' && e.includes('lkl')) return true;
            if (f.id === 'eurocup' && (e.includes('eurocup') || e.includes('europos taurė'))) return true;
            if (f.id === 'kmt' && e.includes('kmt')) return true;
            if (f.id === 'champions' && (e.includes('champions') || e.includes('čempionų'))) return true;
            
            // Direct matching
            return e.includes(label);
        });
    });
  }, [filters, enabledLeagues, games.length]);

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      
      // 1. Global League settings filter (Settings Modal)
      if (enabledLeagues.length > 0 && !enabledLeagues.includes(game.league)) {
          return false; 
      }

      // 2. Team filter (drill down)
      if (activeTeamFilter) {
        if (game.homeTeam.name !== activeTeamFilter && game.awayTeam.name !== activeTeamFilter) {
            return false;
        }
      }

      // 3. Bar Filters (Strict Intersection Logic)
      const leagueFilters = filters.filter(f => f.type === 'league' && f.active);
      const statusFilters = filters.filter(f => f.type === 'status' && f.active);
      const timeFilters = filters.filter(f => f.type === 'time' && f.active);

      // Check League Match
      let matchesLeagueFilter = true; // Default to true if no league filters active
      if (leagueFilters.length > 0) {
         matchesLeagueFilter = leagueFilters.some(f => {
             const normLeague = game.league.toLowerCase();
             if (f.id === 'euroleague' && (normLeague.includes('euroleague') || normLeague.includes('eurolyga'))) return true;
             if (f.id === 'lkl' && normLeague.includes('lkl')) return true;
             if (f.id === 'eurocup' && (normLeague.includes('eurocup') || normLeague.includes('europos taurė'))) return true;
             if (f.id === 'kmt' && normLeague.includes('kmt')) return true;
             if (f.id === 'champions' && (normLeague.includes('champions') || normLeague.includes('čempionų'))) return true;
             return normLeague.includes(f.label.toLowerCase());
         });
      }

      // Check Time & Status Match
      // Combine Time and Status filters into one "Time/Status" group logic
      // If ANY time or status filter is active, the game must match at least one of them
      const hasTimeStatusFilters = statusFilters.length > 0 || timeFilters.length > 0;
      let matchesTimeStatusFilter = true; // Default to true if no time/status filters active

      if (hasTimeStatusFilters) {
          let matchesAnyStatus = false;
          let matchesAnyTime = false;

          // Check Status Filters
          if (statusFilters.length > 0) {
              if (statusFilters.some(f => f.id === 'now') && game.status === 'live') matchesAnyStatus = true;
              if (statusFilters.some(f => f.id === 'not_started') && game.status === 'scheduled') matchesAnyStatus = true;
              if (statusFilters.some(f => f.id === 'ended') && game.status === 'final') matchesAnyStatus = true;
          }

          // Check Time Filters
          if (timeFilters.some(f => f.id === 'today')) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const gameTime = new Date(game.startTime);
            const isSameDay = gameTime.getDate() === today.getDate() && 
                              gameTime.getMonth() === today.getMonth() && 
                              gameTime.getFullYear() === today.getFullYear();
            if (isSameDay) matchesAnyTime = true;
          }
          
          // Logic:
          // If we have Status filters only: must match status
          // If we have Time filters only: must match time
          // If we have BOTH: It's usually an OR within this group (e.g. "Today" OR "Live") for user convenience, 
          // BUT the prompt requested "Strict Intersection". 
          // However, "Today" and "Live" often overlap. 
          // Let's treat the Time/Status group as a Union (OR) internally, but the Group vs League is Intersection (AND).
          // So if I select "Today" and "Live", show games that are Today OR Live. 
          // If I select "Euroleague" AND ("Today" OR "Live"), show Euroleague games that are Today OR Live.
          
          if (statusFilters.length > 0 && timeFilters.length === 0) {
              matchesTimeStatusFilter = matchesAnyStatus;
          } else if (timeFilters.length > 0 && statusFilters.length === 0) {
              matchesTimeStatusFilter = matchesAnyTime;
          } else {
              // Both active
              matchesTimeStatusFilter = matchesAnyStatus || matchesAnyTime;
          }
      }

      // FINAL STRICT INTERSECTION: (League Group) AND (Time/Status Group)
      return matchesLeagueFilter && matchesTimeStatusFilter;
    });
  }, [games, filters, activeTeamFilter, enabledLeagues]);

  // Grouping Logic
  const groupedGames = useMemo(() => {
    const groups = {
      live: [] as Game[],
      today: [] as Game[],
      upcoming: [] as Game[],
      finished: [] as Game[]
    };

    filteredGames.forEach(game => {
      if (game.status === 'live') {
        groups.live.push(game);
      } else if (game.status === 'final') {
        groups.finished.push(game);
      } else {
        // Scheduled
        const date = new Date(game.startTime);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const isToday = date.getDate() === today.getDate() && 
                        date.getMonth() === today.getMonth() && 
                        date.getFullYear() === today.getFullYear();
        
        if (isToday) {
          groups.today.push(game);
        } else {
          groups.upcoming.push(game);
        }
      }
    });

    // Sort each group by time
    groups.live.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    groups.today.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    groups.upcoming.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    // Finished games usually sorted by latest first
    groups.finished.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    return groups;
  }, [filteredGames]);

  const favoriteGames = useMemo(() => {
      return games.filter(g => 
          favoriteTeams.includes(g.homeTeam.name) || 
          favoriteTeams.includes(g.awayTeam.name)
      );
  }, [games, favoriteTeams]);

  return (
    <div className="min-h-screen text-zinc-100 selection:bg-white selection:text-black">
      
      <Header 
        toggleSettings={() => setIsSettingsOpen(true)}
      />

      <main className="pb-24 pt-2">
        
        <AnimatePresence>
          {favoriteGames.length > 0 && (
            <motion.div
               initial={{ height: 0, opacity: 0, filter: 'blur(10px)' }}
               animate={{ height: 'auto', opacity: 1, filter: 'blur(0px)' }}
               exit={{ height: 0, opacity: 0, filter: 'blur(10px)' }}
               transition={{ duration: 0.5, ease: "circOut" }}
               className="overflow-hidden"
            >
               <FavoritesBar 
                games={favoriteGames} 
                onRemoveFavorite={(name) => toggleFavoriteTeam(name)} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        <FilterBar 
          filters={visibleFilters} 
          onToggleFilter={handleToggleFilter}
          activeTeamFilter={activeTeamFilter}
          activeTeamLogo={activeTeamLogo}
          onClearTeamFilter={() => setActiveTeamFilter(null)}
          favoriteTeams={favoriteTeams}
          onUnfavoriteTeam={(team) => toggleFavoriteTeam(team)}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
        />

        {loading && (
            <div className="flex justify-center py-32">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border-2 border-zinc-800"></div>
                  <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-t-2 border-white animate-spin"></div>
                </div>
            </div>
        )}

        {error && !loading && (
            <div className="max-w-md mx-auto text-center py-10 px-6">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-white font-medium mb-2">Ryšio klaida</h3>
                  <p className="text-zinc-500 text-sm">{error}</p>
                </div>
            </div>
        )}

        {!loading && !error && (
            <div className="px-6 max-w-7xl mx-auto flex flex-col gap-12">
                {filteredGames.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <p className="text-zinc-600 font-medium tracking-widest uppercase text-xs mb-2">Rungtynių nerasta</p>
                        {enabledLeagues.length === 0 && games.length > 0 && (
                            <p className="text-zinc-500 text-[10px]">Patikrinkite nustatymus, ar pasirinktos lygos.</p>
                        )}
                    </div>
                ) : (
                    <>
                        {groupedGames.live.length > 0 && (
                            <GameSection 
                                title="GYVAI" 
                                games={groupedGames.live} 
                                viewMode={viewMode}
                                favoriteTeams={favoriteTeams}
                                toggleFavoriteTeam={toggleFavoriteTeam}
                                setActiveTeamFilter={setActiveTeamFilter}
                            />
                        )}
                        {groupedGames.today.length > 0 && (
                            <GameSection 
                                title="ŠIANDIEN" 
                                games={groupedGames.today} 
                                viewMode={viewMode}
                                favoriteTeams={favoriteTeams}
                                toggleFavoriteTeam={toggleFavoriteTeam}
                                setActiveTeamFilter={setActiveTeamFilter}
                            />
                        )}
                        {groupedGames.upcoming.length > 0 && (
                            <GameSection 
                                title="ARTIMIAUSIOS" 
                                games={groupedGames.upcoming} 
                                viewMode={viewMode}
                                favoriteTeams={favoriteTeams}
                                toggleFavoriteTeam={toggleFavoriteTeam}
                                setActiveTeamFilter={setActiveTeamFilter}
                            />
                        )}
                        {groupedGames.finished.length > 0 && (
                             <GameSection 
                                title="PASIBAIGĘ" 
                                games={groupedGames.finished} 
                                viewMode={viewMode}
                                favoriteTeams={favoriteTeams}
                                toggleFavoriteTeam={toggleFavoriteTeam}
                                setActiveTeamFilter={setActiveTeamFilter}
                            />
                        )}
                    </>
                )}
            </div>
        )}

      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        allLeagues={allLeagues}
        enabledLeagues={enabledLeagues}
        onToggleLeague={toggleLeague}
      />

    </div>
  );
}