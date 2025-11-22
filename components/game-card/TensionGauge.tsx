import { motion } from "framer-motion";

export const TensionGauge = ({ homeScore, awayScore, isLive }: { homeScore: number, awayScore: number, isLive: boolean }) => {
    if (!isLive && (homeScore === 0 && awayScore === 0)) return null;

    const diff = homeScore - awayScore;
    const maxDiff = 20; // The range at which the bar is full
    const clampedDiff = Math.max(-maxDiff, Math.min(maxDiff, diff));
    
    // Percentage from center (0 to 100)
    const percentage = Math.abs(clampedDiff) / maxDiff * 100;
    
    const isHomeLeading = diff > 0;
    const isTied = diff === 0;

    return (
        <div className="flex items-center justify-center w-full gap-1 h-1.5 mt-2 opacity-80">
            {/* Left Side (Home) */}
            <div className="flex-1 h-full bg-zinc-900/50 rounded-l-sm flex justify-end relative overflow-hidden">
                {isHomeLeading && (
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className="h-full bg-gradient-to-l from-white to-transparent opacity-80"
                    />
                )}
                {/* Tick marks */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_2px,#000_3px)] bg-[length:4px_100%] opacity-30"></div>
            </div>

            {/* Center Marker */}
            <div className={`w-1 h-2 rounded-full transition-colors duration-500 ${isTied && homeScore > 0 ? 'bg-white shadow-[0_0_10px_white]' : 'bg-zinc-700'}`}></div>

            {/* Right Side (Away) */}
            <div className="flex-1 h-full bg-zinc-900/50 rounded-r-sm flex justify-start relative overflow-hidden">
                {!isHomeLeading && !isTied && (
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className="h-full bg-gradient-to-r from-white to-transparent opacity-80"
                    />
                )}
                {/* Tick marks */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_2px,#000_3px)] bg-[length:4px_100%] opacity-30"></div>
            </div>
        </div>
    )
}