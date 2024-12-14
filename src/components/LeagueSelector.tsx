interface LeagueSelectorProps {
  leagues: string[];
  selectedLeague: string;
  onSelect: (league: string) => void;
}

export function LeagueSelector({ leagues, selectedLeague, onSelect }: LeagueSelectorProps) {
  return (
    <div className="flex justify-center gap-2 mb-8 flex-wrap sticky top-0 bg-white py-4 z-10 shadow-sm">
      {leagues.map((league) => (
        <button
          key={`league-${league}`}
          onClick={() => onSelect(league)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedLeague === league
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {league === 'all' ? 'Visos lygos' : league}
        </button>
      ))}
    </div>
  );
}