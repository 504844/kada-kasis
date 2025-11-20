import { useState, useEffect } from 'react';
import { Game, ApiGame } from '../types';

const PRIMARY_API = 'https://static2.krepsinis.net/Uploads/scoreboard.js';
const FALLBACK_API = 'https://www.sportas.lt/Uploads/scoreboard.js';

function getFullLogoUrl(logo: string): string {
  if (!logo) return '';
  if (logo.startsWith('http')) return logo;
  return `https://static2.krepsinis.net${logo}`;
}

function getGameStatus(status: string, isLive: string): Game['status'] {
  if (isLive === '1') return 'live';
  const s = status.toLowerCase();
  if (s.includes('neprasidėjo') || s === 'scheduled') return 'scheduled';
  if (s.includes('pasibaigė') || s === 'finished' || s === 'ended') return 'final';
  return 'live';
}

function transformApiGame(apiGame: ApiGame): Game {
  const status = getGameStatus(apiGame.event_status, apiGame.is_live);
  
  return {
    id: apiGame.event_key,
    homeTeam: {
      id: apiGame.home_team_key,
      name: apiGame.event_home_team,
      logo: getFullLogoUrl(apiGame.event_home_team_logo),
    },
    awayTeam: {
      id: apiGame.away_team_key,
      name: apiGame.event_away_team,
      logo: getFullLogoUrl(apiGame.event_away_team_logo),
    },
    homeScore: parseInt(apiGame.event_home_team_score) || 0,
    awayScore: parseInt(apiGame.event_away_team_score) || 0,
    status,
    startTime: new Date(parseInt(apiGame.event_timestamp) * 1000).toISOString(),
    league: apiGame.league_name,
    date: apiGame.day_filter,
    quarter: apiGame.event_quarter
  };
}

export function useBasketballData() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        try {
          response = await fetch(PRIMARY_API);
        } catch (e) {
          console.warn('Primary API failed, trying fallback');
        }

        if (!response || !response.ok) {
          response = await fetch(FALLBACK_API);
        }

        if (!response.ok) {
          throw new Error('Failed to fetch data from both APIs');
        }

        const data = await response.json();
        
        let rawGames: ApiGame[] = [];
        if (data && Array.isArray(data.games)) {
          rawGames = data.games;
        } else if (Array.isArray(data)) {
          rawGames = data;
        } else if (typeof data === 'object') {
           rawGames = [];
        }

        const processedGames = rawGames.map(transformApiGame);
        
        // Smart update: Only update state if data has actually changed
        setGames(prevGames => {
          if (JSON.stringify(prevGames) === JSON.stringify(processedGames)) {
            return prevGames;
          }
          return processedGames;
        });
        
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        // Only set loading to false on the very first fetch
        setLoading(prev => prev ? false : prev);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return { games, loading, error };
}