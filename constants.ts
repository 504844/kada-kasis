import { FilterOption } from './types';

export const INITIAL_FILTERS: FilterOption[] = [
  { id: 'today', label: 'Šiandien', type: 'time', active: true },
  { id: 'euroleague', label: 'Eurolyga', type: 'league', active: false },
  { id: 'eurocup', label: 'Europos taurė', type: 'league', active: false },
  { id: 'lkl', label: 'Betsafe-LKL', type: 'league', active: false },
  { id: 'kmt', label: 'KMT', type: 'league', active: false },
  { id: 'nba', label: 'NBA', type: 'league', active: false },
  { id: 'champions', label: 'Čempionų lyga', type: 'league', active: false },
  { id: 'not_started', label: 'Neprasidėjo', type: 'status', active: false },
  { id: 'now', label: 'Dabar', type: 'status', active: false },
  { id: 'ended', label: 'Pasibaigė', type: 'status', active: false },
];