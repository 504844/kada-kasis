import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FavoritesBar } from './FavoritesBar';
import { Game } from '../../../types';

interface AnimatedFavoritesProps {
  favoriteGames: Game[];
  onRemoveFavorite: (team: string) => void;
}

export const AnimatedFavorites: React.FC<AnimatedFavoritesProps> = ({ favoriteGames, onRemoveFavorite }) => {
  return (
    <AnimatePresence>
      {favoriteGames.length > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0, filter: 'blur(10px)' }}
          animate={{ height: 'auto', opacity: 1, filter: 'blur(0px)' }}
          exit={{ height: 0, opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="overflow-hidden"
        >
          <FavoritesBar
            games={favoriteGames}
            onRemoveFavorite={onRemoveFavorite}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};