import { formatGameTime, formatGameDate } from '@/lib/date';

interface GameStatusProps {
  status: string;
  startTime: string;
}

export function GameStatus({ status, startTime }: GameStatusProps) {
  const statusColors = {
    'NEPRASIDĖJO': 'bg-blue-500',
    'PASIBAIGĖ': 'bg-gray-500',
    'VYKSTA': 'bg-red-500'
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'neprasidėjo':
        return 'NEPRASIDĖJO';
      case 'pasibaigė':
        return 'PASIBAIGĖ';
      default:
        return 'VYKSTA';
    }
  };

  const statusText = getStatusText(status);
  const color = statusColors[statusText] || 'bg-gray-500';

  return (
    <div className="flex justify-between items-center mb-4">
      <span className={`px-2 py-1 rounded text-xs text-white font-medium ${color}`}>
        {statusText}
      </span>
      <div className="text-sm text-gray-600 font-medium">
        <span>{formatGameDate(startTime)}</span>
        <span className="mx-1">•</span>
        <span>{formatGameTime(startTime)}</span>
      </div>
    </div>
  );
}