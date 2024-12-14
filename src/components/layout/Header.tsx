import { Trophy } from 'lucide-react';

export function Header() {
  return (
    <div className="py-6">
      <div className="flex items-center justify-center space-x-3">
        <Trophy className="w-8 h-8 text-orange-500" />
        <h1 className="text-3xl font-bold tracking-tight">Kada kašis?</h1>
      </div>
    </div>
  );
}