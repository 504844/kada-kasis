import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Game } from '@/types/basketball';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GameCard } from './GameCard';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface LeagueTabProps {
  games: Game[];
  leagues: string[];
}

export function LeagueTab({ games, leagues }: LeagueTabProps) {
  const { preferences, toggleFavoriteTeam } = useUserPreferences();

  return (
    <Tabs defaultValue={leagues[0]} className="w-full">
      <ScrollArea className="w-full mb-6">
        <TabsList className="inline-flex w-auto p-1 bg-gray-100 rounded-lg">
          {leagues.map(league => (
            <TabsTrigger
              key={league}
              value={league}
              className="px-4 py-2 text-sm font-medium"
            >
              {league}
            </TabsTrigger>
          ))}
        </TabsList>
      </ScrollArea>

      {leagues.map(league => {
        const leagueGames = games.filter(game => game.league_name === league);
        
        return (
          <TabsContent key={league} value={league}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {leagueGames.map(game => (
                <GameCard
                  key={game.event_key}
                  game={game}
                  isFavorite={preferences.favoriteTeams.includes(game.home_team_key)}
                  onToggleFavorite={toggleFavoriteTeam}
                />
              ))}
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}