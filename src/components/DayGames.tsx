import { Game } from '@/types/basketball';
import { GameCard } from './GameCard';
import { formatDateHeader } from '@/lib/date';

interface DayGamesProps {
  date: string;
  games: Game[];
  favoriteTeams: string[];
  onToggleFavorite: (teamId: string) => void;
}

export function DayGames({ date, games, favoriteTeams, onToggleFavorite }: DayGamesProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold sticky top-0 bg-background py-2 z-10">
        {formatDateHeader(date)}
      </h3>
      <div className="space-y-4">
        {games.map(game => (
          <GameCard
            key={game.id}
            game={game}
            isFavorite={favoriteTeams.includes(game.homeTeam.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}