import { ApiGame, Game } from '../types';

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
  // IMPORTANT: Order matters! We must replace longer roman numerals first to avoid partial matches.
  // e.g., if we replace 'I' first, 'II' becomes 'I1', 'III' becomes '111' or 'I11' etc.
  s = s.replace(/IV\s*kėlinys/i, '4 kėl')
       .replace(/III\s*kėlinys/i, '3 kėl')
       .replace(/II\s*kėlinys/i, '2 kėl')
       .replace(/I\s*kėlinys/i, '1 kėl')
       .replace(/Pratęsimas/i, 'OT');
  
  // Compact Minutes: "2 min." -> "2'"
  s = s.replace(/(\d+)\s*min\.?/gi, "$1'");

  // Cleanup
  s = s.replace(/,/g, '').replace(/\s+/g, ' ').trim();

  return s || quarter;
}

export function transformApiGame(apiGame: ApiGame): Game {
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