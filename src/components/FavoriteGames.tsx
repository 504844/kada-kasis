import { Game } from '@/types/basketball';
import { GameCard } from './GameCard';
import { ScrollArea } from './ui/scroll-area';

interface FavoriteGamesProps {
  games: Game[];
  favoriteTeams: string[];
  onToggleFavorite: (teamId: string) => void;
}

export function FavoriteGames({ games, favoriteTeams, onToggleFavorite }: FavoriteGamesProps) {
  const favoriteGames = games.filter(
    game => 
      favoriteTeams.includes(game.homeTeam.id) || 
      favoriteTeams.includes(game.awayTeam.id)
  );

  if (favoriteGames.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Favorite Teams</h2>
      <ScrollArea className="h-[250px] w-full">
        <div className="flex gap-4 pb-4">
          {favoriteGames.map(game => (
            <div key={game.id} className="min-w-[300px]">
              <GameCard
                game={game}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}