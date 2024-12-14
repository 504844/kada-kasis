import { Game } from '@/types/basketball';
import { GameCard } from './GameCard';
import { LoadingSpinner } from './LoadingSpinner';

interface GameListProps {
  games: Game[];
  loading: boolean;
  favoriteTeams: string[];
  favoriteGames: string[];
  onToggleFavoriteTeam: (teamId: string) => void;
  onToggleFavoriteGame: (gameId: string) => void;
}

export function GameList({ 
  games, 
  loading, 
  favoriteTeams, 
  favoriteGames,
  onToggleFavoriteTeam,
  onToggleFavoriteGame 
}: GameListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  const liveGames = games.filter(game => game.status === 'live');
  const upcomingGames = games.filter(game => game.status === 'scheduled');
  const completedGames = games.filter(game => game.status === 'final');

  return (
    <div className="space-y-8 w-full">
      {liveGames.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 text-center text-red-600">Vykstančios rungtynės</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
            {liveGames.map(game => (
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
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4 text-center">Būsimos rungtynės</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
          {upcomingGames.map(game => (
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
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-600">Pasibaigusios rungtynės</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
          {completedGames.map(game => (
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
      </section>
    </div>
  );
}