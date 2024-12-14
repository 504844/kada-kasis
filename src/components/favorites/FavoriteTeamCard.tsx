import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { getFullImageUrl } from '@/lib/utils';
import { formatGameTime, formatGameDate } from '@/lib/date';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Game } from '@/types/basketball';

interface FavoriteTeamCardProps {
  game: Game;
  onToggleFavorite: (teamId: string) => void;
}

export function FavoriteTeamCard({ game, onToggleFavorite }: FavoriteTeamCardProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [teamToRemove, setTeamToRemove] = useState<{ id: string; name: string } | null>(null);

  const handleRemoveClick = (teamId: string, teamName: string) => {
    setTeamToRemove({ id: teamId, name: teamName });
    setShowDialog(true);
  };

  const handleConfirmRemove = () => {
    if (teamToRemove) {
      onToggleFavorite(teamToRemove.id);
      setShowDialog(false);
      setTeamToRemove(null);
    }
  };

  return (
    <>
      <Card className="w-[250px] flex-shrink-0">
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className={`status-badge ${
              game.event_status.toLowerCase().includes('vyksta')
                ? 'status-live'
                : game.event_status.toLowerCase().includes('neprasidėjo')
                ? 'status-upcoming'
                : 'status-finished'
            }`}>
              {game.event_status}
            </span>
            <span>
              {formatGameDate(game.event_timestamp)} {formatGameTime(game.event_timestamp)}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between group">
              <div className="flex items-center space-x-2">
                <img
                  src={getFullImageUrl(game.event_home_team_logo)}
                  alt=""
                  className="w-5 h-5 object-contain"
                />
                <span className="text-sm truncate">{game.event_home_team}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold">{game.event_home_team_score}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveClick(game.home_team_key, game.event_home_team)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between group">
              <div className="flex items-center space-x-2">
                <img
                  src={getFullImageUrl(game.event_away_team_logo)}
                  alt=""
                  className="w-5 h-5 object-contain"
                />
                <span className="text-sm truncate">{game.event_away_team}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold">{game.event_away_team_score}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveClick(game.away_team_key, game.event_away_team)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove from Favorites</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {teamToRemove?.name} from your favorite teams?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmRemove}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}