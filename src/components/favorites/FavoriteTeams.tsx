import { Game } from '@/types/basketball';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FavoriteTeamCard } from './FavoriteTeamCard';

interface FavoriteTeamsProps {
  games: Game[];
  favoriteTeams: string[];
  onToggleFavorite: (teamId: string) => void;
}

export function FavoriteTeams({ games, favoriteTeams, onToggleFavorite }: FavoriteTeamsProps) {
  if (favoriteTeams.length === 0) return null;

  const favoriteGames = games.filter(game => 
    favoriteTeams.includes(game.home_team_key) || 
    favoriteTeams.includes(game.away_team_key)
  );

  if (favoriteGames.length === 0) return null;

  return (
    <div className="py-3">
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-2">
          {favoriteGames.map(game => (
            <FavoriteTeamCard
              key={game.event_key}
              game={game}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}