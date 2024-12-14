import { Game } from '@/types/basketball';
import { GameCard } from './GameCard';

interface FavoriteTeamsProps {
  games: Game[];
  favoriteTeams: string[];
  favoriteGames: string[];
  onToggleFavoriteTeam: (teamId: string) => void;
  onToggleFavoriteGame: (gameId: string) => void;
}

export function FavoriteTeams({ 
  games, 
  favoriteTeams, 
  favoriteGames,
  onToggleFavoriteTeam,
  onToggleFavoriteGame 
}: FavoriteTeamsProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-center text-blue-600">Mėgstamos komandos</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
        {games.map(game => (
          <GameCard
            key={game.id}
            game={game}
            isTeamFavorite={favoriteTeams.includes(game.homeTeam.id) || favoriteTeams.includes(game.awayTeam.id)}
            isGameFavorite={favoriteGames.includes(game.id)}
            onToggleFavoriteTeam={onToggleFavoriteTeam}
            onToggleFavoriteGame={onToggleFavoriteGame}
          />
        ))}
      </div>
    </div>
  );
}