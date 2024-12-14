import { formatGameTime, formatGameDate } from '@/lib/date';

interface GameStatusProps {
  status: string;
  timestamp: string;
}

export function GameStatus({ status, timestamp }: GameStatusProps) {
  const getStatusClass = (status: string) => {
    const lowercaseStatus = status.toLowerCase();
    if (lowercaseStatus.includes('vyksta')) {
      return 'status-badge status-live';
    }
    if (lowercaseStatus.includes('neprasidėjo')) {
      return 'status-badge status-upcoming';
    }
    return 'status-badge status-finished';
  };

  return (
    <div className="flex justify-between items-center">
      <span className={getStatusClass(status)}>
        {status}
      </span>
      <span className="text-sm text-muted-foreground">
        {formatGameDate(timestamp)} {formatGameTime(timestamp)}
      </span>
    </div>
  );
}