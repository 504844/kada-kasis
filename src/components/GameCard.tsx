import { Game } from '@/types/basketball';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { formatGameTime, formatGameDate } from '@/lib/date';

interface GameCardProps {
  game: Game;
  isFavorite: boolean;
  onToggleFavorite: (teamId: string) => void;
}

export function GameCard({ game, isFavorite, onToggleFavorite }: GameCardProps) {
  const isLive = game.event_status.toLowerCase().includes('vyksta');
  const statusColor = isLive ? 'text-red-500' : 'text-gray-500';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${statusColor}`}>
            {game.event_status}
          </span>
          <span className="text-sm text-gray-500">
            {formatGameDate(game.event_timestamp)} {formatGameTime(game.event_timestamp)}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img 
                src={game.event_home_team_logo} 
                alt="" 
                className="w-8 h-8 object-contain"
              />
              <span className="font-medium">{game.event_home_team}</span>
            </div>
            <span className="font-bold text-lg">{game.event_home_team_score}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img 
                src={game.event_away_team_logo} 
                alt="" 
                className="w-8 h-8 object-contain"
              />
              <span className="font-medium">{game.event_away_team}</span>
            </div>
            <span className="font-bold text-lg">{game.event_away_team_score}</span>
          </div>
        </div>

        <button
          onClick={() => onToggleFavorite(game.home_team_key)}
          className={`mt-3 p-2 rounded-full transition-colors ${
            isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
          }`}
        >
          <Star className={isFavorite ? 'fill-current' : ''} size={20} />
        </button>
      </CardContent>
    </Card>
  );
}