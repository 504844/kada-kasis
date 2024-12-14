import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Game } from '@/types/basketball';
import { LeagueTabList } from './LeagueTabList';
import { LeagueGames } from './LeagueGames';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface LeagueTabProps {
  games: Game[];
  leagues: string[];
  favoriteTeams: string[];
  onToggleFavorite: (teamId: string) => void;
}

export function LeagueTab({ games, leagues, favoriteTeams, onToggleFavorite }: LeagueTabProps) {
  const { preferences, setLastVisitedLeague } = useUserPreferences();
  
  const getFilteredGames = (league: string) => {
    switch (league) {
      case 'Visos lygos':
        return games;
      case 'Neprasidėjo':
        return games.filter(game => 
          game.event_status.toLowerCase().includes('neprasidėjo')
        );
      case 'Pasibaigė':
        return games.filter(game => 
          game.event_status.toLowerCase().includes('pasibaigė')
        );
      default:
        return games.filter(game => game.league_name === league);
    }
  };

  return (
    <Tabs 
      defaultValue={preferences.lastVisitedLeague || leagues[0]} 
      className="w-full"
      onValueChange={setLastVisitedLeague}
    >
      <div className="sticky top-[var(--header-height)] bg-background/95 backdrop-blur z-40 border-b pb-4">
        <LeagueTabList leagues={leagues} />
      </div>

      <div className="min-h-[500px] mt-6">
        {leagues.map(league => (
          <TabsContent 
            key={league} 
            value={league} 
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <LeagueGames
              games={getFilteredGames(league)}
              favoriteTeams={favoriteTeams}
              onToggleFavorite={onToggleFavorite}
            />
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}