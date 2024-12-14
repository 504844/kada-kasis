import { Star } from 'lucide-react';
import { getFullImageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState } from 'react';

interface GameTeamProps {
  logo: string;
  name: string;
  score: string;
  teamId: string;
  isFavorite: boolean;
  onToggleFavorite: (teamId: string) => void;
}

export function GameTeam({
  logo,
  name,
  score,
  teamId,
  isFavorite,
  onToggleFavorite,
}: GameTeamProps) {
  const [showDialog, setShowDialog] = useState(false);

  const handleClick = () => {
    if (isFavorite) {
      setShowDialog(true);
    } else {
      onToggleFavorite(teamId);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between group">
        <div className="flex items-center space-x-2">
          <img
            src={getFullImageUrl(logo)}
            alt={`${name} logo`}
            className="w-8 h-8 object-contain"
          />
          <span className="font-medium">{name}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                  isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                }`}
                onClick={handleClick}
              >
                <Star className={isFavorite ? 'fill-current' : ''} size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            </TooltipContent>
          </Tooltip>
        </div>
        <span className="font-bold text-lg">{score}</span>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove from Favorites</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {name} from your favorite teams?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onToggleFavorite(teamId);
                setShowDialog(false);
              }}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}