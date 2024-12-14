import { Skeleton } from '@/components/ui/skeleton';

export function LoadingGames() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <Skeleton key={i} className="h-48" />
      ))}
    </div>
  );
}