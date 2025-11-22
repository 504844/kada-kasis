import { useState, useEffect, useRef } from 'react';
import { Game, ApiGame } from '../types';

const API_URLS = [
  'https://static2.krepsinis.net/Uploads/scoreboard.js',
  'https://www.sportas.lt/Uploads/scoreboard.js'
];

const PROXY_URL = 'https://api.allorigins.win/raw?url=';

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

function parseLiveStatus(fullStatus: string, quarter: string): string {
  if (!fullStatus) return quarter;
  
  // Remove "GYVAI." prefix (case insensitive, handling space)
  let s = fullStatus.replace(/^GYVAI\.?\s*/i, '');

  // Compact Quarter Names
  s = s.replace('I kėlinys', '1 kėl')
       .replace('II kėlinys', '2 kėl')
       .replace('III kėlinys', '3 kėl')
       .replace('IV kėlinys', '4 kėl')
       .replace('Pratęsimas', 'OT');
  
  // Compact Minutes: "2 min." -> "2'"
  s = s.replace(/(\d+)\s*min\.?/gi, "$1'");

  // Cleanup
  s = s.replace(/,/g, '').replace(/\s+/g, ' ').trim();

  return s || quarter;
}

function transformApiGame(apiGame: ApiGame): Game {
  const status = getGameStatus(apiGame.event_status, apiGame.is_live);
  
  let quarter = apiGame.event_quarter;
  if (status === 'live') {
      quarter = parseLiveStatus(apiGame.full_status, apiGame.event_quarter);
  }

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
    quarter
  };
}

export function useBasketballData() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to track mounting status to avoid state updates after unmount
  // and to manage the timeout loop
  const isMountedRef = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
      try {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000000);
        const queryParams = `?t=${timestamp}&r=${random}`;
        
        let data;
        let lastError;

        // 1. Try Direct Fetch
        for (const url of API_URLS) {
            if (signal.aborted) return;
            try {
                const fullUrl = `${url}${queryParams}`;
                const res = await fetch(fullUrl, { signal });
                if (res.ok) {
                    data = await res.json();
                    break;
                }
            } catch (e) {
                if ((e as Error).name === 'AbortError') return;
                lastError = e;
            }
        }

        // 2. Try Proxy if Direct failed
        if (!data && !signal.aborted) {
             for (const url of API_URLS) {
                if (signal.aborted) return;
                try {
                    const fullUrl = `${url}${queryParams}`;
                    const proxyUrl = `${PROXY_URL}${encodeURIComponent(fullUrl)}`;
                    const res = await fetch(proxyUrl, { signal });
                    if (res.ok) {
                        data = await res.json();
                        break;
                    }
                } catch (e) {
                    if ((e as Error).name === 'AbortError') return;
                    lastError = e;
                }
            }
        }

        if (!isMountedRef.current) return;

        if (!data) {
          throw lastError || new Error('Nepavyko gauti duomenų iš serverio.');
        }
        
        let rawGames: ApiGame[] = [];
        if (data && Array.isArray(data.games)) {
          rawGames = data.games;
        } else if (Array.isArray(data)) {
          rawGames = data;
        } else if (typeof data === 'object') {
           rawGames = [];
        }

        const processedGames = rawGames.map(transformApiGame);
        
        setGames(prevGames => {
          if (JSON.stringify(prevGames) === JSON.stringify(processedGames)) {
            return prevGames;
          }
          return processedGames;
        });
        
        setError(null);
      } catch (err) {
        if (isMountedRef.current && (err as Error).name !== 'AbortError') {
            console.error("Fetch error:", err);
            setError(err instanceof Error ? err.message : 'Failed to fetch data');
        }
      } finally {
        if (isMountedRef.current) {
            setLoading(prev => prev ? false : prev);
            // Schedule next fetch only after the current one completes
            // This prevents request stacking on slow connections
            timeoutRef.current = setTimeout(fetchData, 10000);
        }
      }
    };

    fetchData();

    return () => {
        isMountedRef.current = false;
        abortController.abort();
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };
  }, []);

  return { games, loading, error };
}