import React from "react";
import { Game } from "../../types";
import { GameCardTeamRow } from "./GameCardTeamRow";
import { TensionGauge } from "./TensionGauge";

interface GameCardTeamSectionProps {
    game: Game;
    favoriteTeams: string[];
    onToggleFavoriteTeam: (teamName: string) => void;
    onFilterByTeam: (teamName: string) => void;
}

export const GameCardTeamSection: React.FC<GameCardTeamSectionProps> = ({
    game,
    favoriteTeams,
    onToggleFavoriteTeam,
    onFilterByTeam,
}) => {
    const isHomeFavorite = favoriteTeams.includes(game.homeTeam.name);
    const isAwayFavorite = favoriteTeams.includes(game.awayTeam.name);

    const isHomeWinner = game.status === "final" && game.homeScore > game.awayScore;
    const isAwayWinner = game.status === "final" && game.awayScore > game.homeScore;

    return (
        <div className="relative flex flex-col gap-1 z-10 flex-grow">
            <GameCardTeamRow
                name={game.homeTeam.name}
                logo={game.homeTeam.logo}
                score={game.homeScore}
                isFavorite={isHomeFavorite}
                isLive={game.status === 'live'}
                isWinner={isHomeWinner}
                placeholderChar="H"
                onToggleFavorite={() => onToggleFavoriteTeam(game.homeTeam.name)}
                onFilterByTeam={() => onFilterByTeam(game.homeTeam.name)}
            />
            
            <TensionGauge homeScore={game.homeScore} awayScore={game.awayScore} isLive={game.status !== 'scheduled'} />

            <GameCardTeamRow
                name={game.awayTeam.name}
                logo={game.awayTeam.logo}
                score={game.awayScore}
                isFavorite={isAwayFavorite}
                isLive={game.status === 'live'}
                isWinner={isAwayWinner}
                placeholderChar="A"
                onToggleFavorite={() => onToggleFavoriteTeam(game.awayTeam.name)}
                onFilterByTeam={() => onFilterByTeam(game.awayTeam.name)}
            />
        </div>
    );
};