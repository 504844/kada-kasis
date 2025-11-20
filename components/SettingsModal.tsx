import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  allLeagues: string[];
  enabledLeagues: string[];
  onToggleLeague: (league: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose,
  allLeagues,
  enabledLeagues,
  onToggleLeague
}) => {
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-[400px] bg-[#09090b] border border-zinc-800 rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-black/20">
               <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Rodomos lygos</span>
               <button 
                 onClick={onClose} 
                 className="text-zinc-500 hover:text-white transition-colors"
               >
                 <X size={16} />
               </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto custom-scrollbar">
                {allLeagues.length === 0 ? (
                  <div className="py-8 text-center text-zinc-600 text-xs font-mono">
                    KRAUNAMA...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                      {allLeagues.map((league) => {
                          const isEnabled = enabledLeagues.includes(league);
                          return (
                              <button 
                                  key={league}
                                  onClick={() => onToggleLeague(league)}
                                  className={`
                                    group relative flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all duration-200
                                    ${isEnabled 
                                        ? 'bg-zinc-900 border-zinc-700' 
                                        : 'bg-black/40 border-white/5 hover:border-white/10 hover:bg-white/5'}
                                  `}
                              >
                                  <span className={`text-[10px] font-bold uppercase tracking-wider truncate pr-2 transition-colors ${isEnabled ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-400'}`}>
                                      {league}
                                  </span>
                                  
                                  {/* Rounded Toggle Switch */}
                                  <div className={`
                                      relative w-8 h-4 rounded-full transition-colors duration-200 flex items-center px-0.5 border
                                      ${isEnabled ? 'bg-zinc-700 border-zinc-600' : 'bg-zinc-900 border-zinc-800'}
                                  `}>
                                      <motion.div 
                                          layout
                                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                          className={`
                                              w-3 h-3 rounded-full shadow-sm
                                              ${isEnabled ? 'bg-white ml-auto' : 'bg-zinc-600'}
                                          `} 
                                      />
                                  </div>
                              </button>
                          )
                      })}
                  </div>
                )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
