import { useMemo, useState, useEffect } from 'react';
import { Game, FilterOption } from '../types';
import { INITIAL_FILTERS } from '../constants';

const FILTER_STORAGE_KEY = 'user_active_filters';

export function useGameFiltering(games: Game[], enabledLeagues: string[]) {
  // Initialize filters from LocalStorage or use defaults
  const [filters, setFilters] = useState<FilterOption[]>(() => {
    try {
      const saved = localStorage.getItem(FILTER_STORAGE_KEY);
      if (saved) {
        const activeIds = JSON.parse(saved);
        if (Array.isArray(activeIds)) {
          return INITIAL_FILTERS.map(f => ({
            ...f,
            active: activeIds.includes(f.id)
          }));
        }
      }
    } catch (e) {
      console.warn('Failed to load filters from storage', e);
    }
    return INITIAL_FILTERS;
  });

  const [activeTeamFilter, setActiveTeamFilter] = useState<string | null>(null);

  // Persist filters whenever they change
  useEffect(() => {
    try {
      const activeIds = filters.filter(f => f.active).map(f => f.id);
      localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(activeIds));
    } catch (e) {
      console.error('Failed to save filters', e);
    }
  }, [filters]);

  const handleToggleFilter = (id: string) => {
    setFilters(prev => prev.map(f => {
      if (f.id === id) return { ...f, active: !f.active };
      return f;
    }));
  };

  const allLeagues = useMemo(() => {
      const unique = new Set(games.map(g => g.league));
      return Array.from(unique).sort();
  }, [games]);

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
    if (games.length === 0 && enabledLeagues.length === 0) return filters;

    return filters.filter(f => {
        if (f.type !== 'league') return true;
        const label = f.label.toLowerCase();
        return enabledLeagues.some(enabled => {
            const e = enabled.toLowerCase();
            if (f.id === 'euroleague' && (e.includes('euroleague') || e.includes('eurolyga'))) return true;
            if (f.id === 'lkl' && e.includes('lkl')) return true;
            if (f.id === 'eurocup' && (e.includes('eurocup') || e.includes('europos taurė'))) return true;
            if (f.id === 'kmt' && e.includes('kmt')) return true;
            if (f.id === 'champions' && (e.includes('champions') || e.includes('čempionų'))) return true;
            return e.includes(label);
        });
    });
  }, [filters, enabledLeagues, games.length]);

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      // 1. Global League settings filter
      if (enabledLeagues.length > 0 && !enabledLeagues.includes(game.league)) {
          return false; 
      }

      // 2. Team filter
      if (activeTeamFilter) {
        if (game.homeTeam.name !== activeTeamFilter && game.awayTeam.name !== activeTeamFilter) {
            return false;
        }
      }

      // 3. Bar Filters (Strict Intersection Logic)
      const leagueFilters = filters.filter(f => f.type === 'league' && f.active);
      const statusFilters = filters.filter(f => f.type === 'status' && f.active);
      const timeFilters = filters.filter(f => f.type === 'time' && f.active);

      let matchesLeagueFilter = true;
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

      const hasTimeStatusFilters = statusFilters.length > 0 || timeFilters.length > 0;
      let matchesTimeStatusFilter = true;

      if (hasTimeStatusFilters) {
          let matchesAnyStatus = false;
          let matchesAnyTime = false;

          if (statusFilters.length > 0) {
              if (statusFilters.some(f => f.id === 'now') && game.status === 'live') matchesAnyStatus = true;
              if (statusFilters.some(f => f.id === 'not_started') && game.status === 'scheduled') matchesAnyStatus = true;
              if (statusFilters.some(f => f.id === 'ended') && game.status === 'final') matchesAnyStatus = true;
          }

          if (timeFilters.some(f => f.id === 'today')) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const gameTime = new Date(game.startTime);
            const isSameDay = gameTime.getDate() === today.getDate() && 
                              gameTime.getMonth() === today.getMonth() && 
                              gameTime.getFullYear() === today.getFullYear();
            if (isSameDay) matchesAnyTime = true;
          }
          
          if (statusFilters.length > 0 && timeFilters.length === 0) {
              matchesTimeStatusFilter = matchesAnyStatus;
          } else if (timeFilters.length > 0 && statusFilters.length === 0) {
              matchesTimeStatusFilter = matchesAnyTime;
          } else {
              matchesTimeStatusFilter = matchesAnyStatus || matchesAnyTime;
          }
      }

      return matchesLeagueFilter && matchesTimeStatusFilter;
    });
  }, [games, filters, activeTeamFilter, enabledLeagues]);

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

    groups.live.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    groups.today.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    groups.upcoming.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    groups.finished.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    return groups;
  }, [filteredGames]);

  return {
    filters,
    handleToggleFilter,
    activeTeamFilter,
    setActiveTeamFilter,
    allLeagues,
    activeTeamLogo,
    visibleFilters,
    filteredGames,
    groupedGames
  };
}