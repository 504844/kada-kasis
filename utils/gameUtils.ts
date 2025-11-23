import { Game } from '../types';

export const isClutchGame = (game: Game): boolean => {
    if (game.status !== 'live') return false;
    const q = game.quarter?.toLowerCase() || "";
    const isLateGame = q.includes('4') || q.includes('ot') || q.includes('pratęsimas');
    const diff = Math.abs(game.homeScore - game.awayScore);
    
    // Threshold set to 9 points (single digits) to highlight "striking distance" games
    return isLateGame && diff <= 5;
};