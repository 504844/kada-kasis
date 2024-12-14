export function formatGameTime(timestamp: string): string {
  if (!timestamp) return '';
  const date = new Date(parseInt(timestamp) * 1000);
  return date.toLocaleTimeString('lt-LT', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatGameDate(timestamp: string): string {
  if (!timestamp) return '';
  const date = new Date(parseInt(timestamp) * 1000);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Šiandien';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Rytoj';
  } else {
    return date.toLocaleDateString('lt-LT', {
      month: '2-digit',
      day: '2-digit'
    });
  }
}