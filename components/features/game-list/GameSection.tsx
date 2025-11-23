import React from 'react';
import { motion } from 'framer-motion';
import { Game } from '../../../types';
import { GameCard } from '../../game-card/GameCard';
import { GameTable } from './GameTable';

interface GameSectionProps {
  title: string;
  games: Game[];
  viewMode: 'grid' | 'table';
  favoriteTeams: string[];
  toggleFavoriteTeam: (teamName: string) => void;
  setActiveTeamFilter: (name: string | null) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

export const GameSection: React.FC<GameSectionProps> = React.memo(({ 
    title, 
    games, 
    viewMode, 
    favoriteTeams, 
    toggleFavoriteTeam, 
    setActiveTeamFilter 
}) => (
    <div className="flex flex-col gap-4">
       <div className="flex items-center gap-3 px-1">
            <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase">{title}</h3>
            <div className="h-px flex-1 bg-gradient-to-l from-zinc-800 to-transparent"></div>
       </div>
       
       {viewMode === 'grid' ? (
           <motion.div 
             variants={containerVariants}
             initial="hidden"
             animate="visible"
             className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
           >
               {games.map((game: Game) => (
                   <GameCard 
                       key={game.id} 
                       game={game} 
                       favoriteTeams={favoriteTeams}
                       onToggleFavoriteTeam={toggleFavoriteTeam}
                       onFilterByTeam={(name) => {
                           setActiveTeamFilter(name);
                           window.scrollTo({ top: 0, behavior: 'smooth' });
                       }}
                   />
               ))}
           </motion.div>
       ) : (
           <GameTable 
               games={games}
               favoriteTeams={favoriteTeams}
               onToggleFavoriteTeam={toggleFavoriteTeam}
               onFilterByTeam={(name) => {
                   setActiveTeamFilter(name);
                   window.scrollTo({ top: 0, behavior: 'smooth' });
               }}
           />
       )}
    </div>
));