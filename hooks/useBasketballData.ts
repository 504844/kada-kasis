import { useState, useEffect } from 'react';
import { Game } from '../types';
import { useGameApi } from './useGameApi';
import { transformApiGame } from './useGameTransformation';
import { MOCK_GAMES, USE_MOCK_DATA } from '../data/mockData';

export function useBasketballData() {
  // We only enable the API if we aren't using mock data
  const { data: rawApiGames, loading: apiLoading, error: apiError } = useGameApi(!USE_MOCK_DATA);
  
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      setGames(MOCK_GAMES);
      setLoading(false);
      setError(null);
    } else {
      setLoading(apiLoading);
      setError(apiError);

      if (rawApiGames) {
        const transformed = rawApiGames.map(transformApiGame);
        // Basic deep compare prevention could go here, but React state setter
        // usually handles identity checks. For array content checks:
        setGames(prev => {
            if (JSON.stringify(prev) === JSON.stringify(transformed)) return prev;
            return transformed;
        });
      }
    }
  }, [rawApiGames, apiLoading, apiError]);

  return { games, loading, error };
}