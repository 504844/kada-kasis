interface TeamScoreProps {
  logo: string;
  name: string;
  score: number;
}

export function TeamScore({ logo, name, score }: TeamScoreProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img src={logo} alt={name} className="w-8 h-8" />
        <span className="font-semibold">{name}</span>
      </div>
      <span className="text-xl font-bold">{score}</span>
    </div>
  );
}