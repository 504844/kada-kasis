import { Game } from '../types';

export const USE_MOCK_DATA = false; 

export const MOCK_GAMES: Game[] = [
  {
    id: 'mock-1',
    homeTeam: { id: 'zalgiris', name: 'Žalgiris', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/BC_Zalgiris_logo.svg/1200px-BC_Zalgiris_logo.svg.png' },
    awayTeam: { id: 'monaco', name: 'Monaco', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/91/AS_Monaco_Basket_Logo.svg/1200px-AS_Monaco_Basket_Logo.svg.png' },
    homeScore: 82,
    awayScore: 81,
    status: 'live',
    startTime: new Date(Date.now() - 7200000).toISOString(),
    league: 'Euroleague',
    date: new Date().toISOString().split('T')[0],
    quarter: '4 kėl. 0:45', // Clutch moment
  },
  {
    id: 'mock-2',
    homeTeam: { id: 'rytas', name: 'Rytas', logo: 'https://upload.wikimedia.org/wikipedia/en/0/01/BC_Rytas_logo.png' },
    awayTeam: { id: 'wolves', name: 'Wolves', logo: 'https://upload.wikimedia.org/wikipedia/en/b/b8/BC_Wolves_logo.png' },
    homeScore: 45,
    awayScore: 38,
    status: 'live',
    startTime: new Date(Date.now() - 3600000).toISOString(),
    league: 'Betsafe-LKL',
    date: new Date().toISOString().split('T')[0],
    quarter: '2 kėl.',
  },
  {
    id: 'mock-3',
    homeTeam: { id: 'fener', name: 'Fenerbahçe', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3d/Fenerbah%C3%A7e_SK.svg/1200px-Fenerbah%C3%A7e_SK.svg.png' },
    awayTeam: { id: 'efes', name: 'Anadolu Efes', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0d/Anadolu_Efes_SK_logo.svg/1200px-Anadolu_Efes_SK_logo.svg.png' },
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    startTime: new Date(Date.now() + 7200000).toISOString(), // In 2 hours
    league: 'Euroleague',
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'mock-4',
    homeTeam: { id: 'lakers', name: 'Lakers', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Los_Angeles_Lakers_logo.svg/1200px-Los_Angeles_Lakers_logo.svg.png' },
    awayTeam: { id: 'warriors', name: 'Warriors', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/01/Golden_State_Warriors_logo.svg/1200px-Golden_State_Warriors_logo.svg.png' },
    homeScore: 112,
    awayScore: 104,
    status: 'final',
    startTime: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    league: 'NBA',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
  },
  {
    id: 'mock-5',
    homeTeam: { id: 'barca', name: 'Barcelona', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png' },
    awayTeam: { id: 'real', name: 'Real Madrid', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png' },
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    startTime: new Date(Date.now() + 10800000).toISOString(), // In 3 hours
    league: 'Euroleague',
    date: new Date().toISOString().split('T')[0],
  }
];
