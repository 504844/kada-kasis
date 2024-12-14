import { Game } from '@/types/basketball';
import { Card, CardContent } from '@/components/ui/card';
import { GameTeam } from './GameTeam';
import { GameStatus } from './GameStatus';

interface GameCardProps {
  game: Game;
  favoriteTeams: string[];
  onToggleFavorite: (teamId: string) => void;
}

export function GameCard({ game, favoriteTeams, onToggleFavorite }: GameCardProps) {
  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4 space-y-4">
        <GameStatus 
          status={game.event_status} 
          timestamp={game.event_timestamp} 
        />

        <div className="space-y-3">
          <GameTeam
            logo={game.event_home_team_logo}
            name={game.event_home_team}
            score={game.event_home_team_score}
            teamId={game.home_team_key}
            isFavorite={favoriteTeams.includes(game.home_team_key)}
            onToggleFavorite={onToggleFavorite}
          />
          <GameTeam
            logo={game.event_away_team_logo}
            name={game.event_away_team}
            score={game.event_away_team_score}
            teamId={game.away_team_key}
            isFavorite={favoriteTeams.includes(game.away_team_key)}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      </CardContent>
    </Card>
  );
}