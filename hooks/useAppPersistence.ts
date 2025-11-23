import { useState, useEffect } from 'react';
import { Game } from '../types';

export function useAppPersistence(games: Game[]) {
  // View Mode
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

  // Favorite Teams
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

  // Enabled Leagues
  const [enabledLeagues, setEnabledLeagues] = useState<string[]>(() => {
     try {
         const saved = localStorage.getItem('enabled_leagues');
         return saved ? JSON.parse(saved) : []; 
     } catch(e) {
         return [];
     }
  });

  useEffect(() => {
      if (enabledLeagues.length > 0) {
          localStorage.setItem('enabled_leagues', JSON.stringify(enabledLeagues));
      }
  }, [enabledLeagues]);

  // Initialize enabled leagues if empty, once data is loaded
  useEffect(() => {
      if (games.length > 0) {
         const saved = localStorage.getItem('enabled_leagues');
         if (!saved) {
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

  return {
    viewMode,
    setViewMode,
    favoriteTeams,
    toggleFavoriteTeam,
    enabledLeagues,
    toggleLeague
  };
}