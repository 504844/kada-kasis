import { useState, useEffect, useRef } from 'react';
import { ApiGame } from '../types';

const API_URLS = [
  'https://static2.krepsinis.net/Uploads/scoreboard.js',
  'https://www.sportas.lt/Uploads/scoreboard.js'
];

const PROXY_URL = 'https://api.allorigins.win/raw?url=';

export function useGameApi(isEnabled: boolean = true) {
  const [data, setData] = useState<ApiGame[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isMountedRef = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (!isEnabled) {
        setLoading(false);
        return;
    }

    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
      try {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000000);
        const queryParams = `?t=${timestamp}&r=${random}`;
        
        let fetchedData;
        let lastError;

        // 1. Try Direct Fetch
        for (const url of API_URLS) {
            if (signal.aborted) return;
            try {
                const fullUrl = `${url}${queryParams}`;
                const res = await fetch(fullUrl, { signal });
                if (res.ok) {
                    fetchedData = await res.json();
                    break;
                }
            } catch (e) {
                if ((e as Error).name === 'AbortError') return;
                lastError = e;
            }
        }

        // 2. Try Proxy if Direct failed
        if (!fetchedData && !signal.aborted) {
             for (const url of API_URLS) {
                if (signal.aborted) return;
                try {
                    const fullUrl = `${url}${queryParams}`;
                    const proxyUrl = `${PROXY_URL}${encodeURIComponent(fullUrl)}`;
                    const res = await fetch(proxyUrl, { signal });
                    if (res.ok) {
                        fetchedData = await res.json();
                        break;
                    }
                } catch (e) {
                    if ((e as Error).name === 'AbortError') return;
                    lastError = e;
                }
            }
        }

        if (!isMountedRef.current) return;

        if (!fetchedData) {
          throw lastError || new Error('Nepavyko gauti duomenų iš serverio.');
        }
        
        let rawGames: ApiGame[] = [];
        if (fetchedData && Array.isArray(fetchedData.games)) {
          rawGames = fetchedData.games;
        } else if (Array.isArray(fetchedData)) {
          rawGames = fetchedData;
        } else if (typeof fetchedData === 'object') {
           rawGames = [];
        }

        // Only update state if data changed (simple equality check or deep check)
        // For performance, we set it and let React handle the re-render optimizations or useMemo downstream
        setData(rawGames);
        setError(null);
      } catch (err) {
        if (isMountedRef.current && (err as Error).name !== 'AbortError') {
            console.error("Fetch error:", err);
            setError(err instanceof Error ? err.message : 'Failed to fetch data');
        }
      } finally {
        if (isMountedRef.current) {
            setLoading(prev => prev ? false : prev);
            // Schedule next fetch
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
  }, [isEnabled]);

  return { data, loading, error };
}