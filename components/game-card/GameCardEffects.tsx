import React from "react";
import { Game } from "../../types";

interface GameCardEffectsProps {
    status: Game['status'];
    isClutch: boolean;
}

export const GameCardEffects: React.FC<GameCardEffectsProps> = ({ status, isClutch }) => {
    const getGradientColor = () => {
        if (isClutch) return "from-red-600";
        if (status === "live") return "from-orange-500";
        if (status === "final") return "from-zinc-500";
        return "from-emerald-400";
    };

    return (
        <div className="absolute -inset-[1px] rounded-2xl overflow-hidden z-0 pointer-events-none">
            <div
                className={`absolute inset-[-50%] bg-[conic-gradient(transparent_0deg,transparent_340deg,var(--tw-gradient-from)_360deg)] animate-border-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${getGradientColor()}`}
            ></div>
        </div>
    );
};