import { useMemo } from "react";

// Deterministic pseudo-random number generator based on string seed
const seededRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return () => {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };
};

export const UniqueBarcode = ({ id }: { id: string }) => {
  const bars = useMemo(() => {
    const rng = seededRandom(id);
    const barCount = 20;
    return Array.from({ length: barCount }).map(() => ({
      width: Math.floor(rng() * 3) + 1, // 1-3px
      opacity: rng() * 0.5 + 0.5, // 0.5-1.0
      height: Math.floor(rng() * 40) + 60, // 60-100% height
      margin: Math.floor(rng() * 2) + 1, // 1-2px gap
    }));
  }, [id]);

  return (
    <div className="flex items-center h-full w-full overflow-hidden">
      {bars.map((bar, idx) => (
        <div
          key={idx}
          style={{
            width: `${bar.width}px`,
            height: `${bar.height}%`,
            marginRight: `${bar.margin}px`,
            opacity: bar.opacity,
          }}
          className="bg-zinc-600 shrink-0 rounded-full"
        />
      ))}
    </div>
  );
};
