interface GameScoreProps {
  homeTeam: {
    name: string;
    logo: string;
    score: number;
  };
  awayTeam: {
    name: string;
    logo: string;
    score: number;
  };
}

export function GameScore({ homeTeam, awayTeam }: GameScoreProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={homeTeam.logo} alt="" className="w-8 h-8 object-contain" />
          <span className="font-medium">{homeTeam.name}</span>
        </div>
        <span className="text-xl font-bold">{homeTeam.score}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={awayTeam.logo} alt="" className="w-8 h-8 object-contain" />
          <span className="font-medium">{awayTeam.name}</span>
        </div>
        <span className="text-xl font-bold">{awayTeam.score}</span>
      </div>
    </div>
  );
}