export interface ApiGame {
  event_key: string;
  event_timestamp: string;
  event_status: string;
  event_home_team: string;
  home_team_key: string;
  event_home_team_score: string;
  event_away_team_score: string;
  event_away_team: string;
  away_team_key: string;
  league_name: string;
  league_key: string;
  event_home_team_logo: string;
  event_away_team_logo: string;
  event_quarter: string;
  event_finished_timestamp: string;
  last_change: string;
  is_live: string;
  priority: string | null;
  day_filter: string;
  full_status: string;
  winner: string | false;
  default_filter: boolean;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
}

export interface Game {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'final';
  startTime: string;
  league: string;
  date: string;
  quarter?: string;
}

export interface UserPreferences {
  favoriteTeams: string[];
}

export interface FilterOption {
  id: string;
  label: string;
  type: 'league' | 'status' | 'time';
  active: boolean;
}