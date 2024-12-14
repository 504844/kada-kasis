import { ApiGame, Game } from '@/types/basketball';

export function transformApiGame(apiGame: ApiGame): Game {
  const status = getGameStatus(apiGame.event_status);
  
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
    date: apiGame.day_filter
  };
}

function getGameStatus(status: string): Game['status'] {
  if (status.toLowerCase().includes('neprasidėjo')) return 'scheduled';
  if (status.toLowerCase().includes('pasibaigė')) return 'final';
  return 'live';
}

function getFullLogoUrl(logo: string): string {
  if (logo.startsWith('http')) return logo;
  return `https://static2.krepsinis.net${logo}`;
}