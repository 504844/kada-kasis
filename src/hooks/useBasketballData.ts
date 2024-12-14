import { useState, useEffect } from 'react';
import { Game } from '@/types/basketball';

const PRIMARY_API = 'https://static2.krepsinis.net/Uploads/scoreboard.js';
const FALLBACK_API = 'https://www.sportas.lt/Uploads/scoreboard.js';

export function useBasketballData() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try primary API first
        let response = await fetch(PRIMARY_API);
        
        // If primary fails, try fallback
        if (!response.ok) {
          response = await fetch(FALLBACK_API);
        }

        if (!response.ok) {
          throw new Error('Failed to fetch data from both APIs');
        }

        const data = await response.json();
        if (!data.success || !Array.isArray(data.games)) {
          throw new Error('Invalid data format');
        }

        setGames(data.games);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return { games, loading, error };
}