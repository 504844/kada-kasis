import { Game } from '@/types/basketball';
import { GameCard } from '../game/GameCard';

interface LeagueGamesProps {
  games: Game[];
  favoriteTeams: string[];
  onToggleFavorite: (teamId: string) => void;
}

export function LeagueGames({ games, favoriteTeams, onToggleFavorite }: LeagueGamesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr">
      {games.map(game => (
        <GameCard
          key={game.event_key}
          game={game}
          favoriteTeams={favoriteTeams}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}