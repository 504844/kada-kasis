import React from 'react';
import { X, Check, Settings2 } from 'lucide-react';
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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
            className="relative w-full max-w-[320px] bg-[#09090b] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02] shrink-0">
               <div className="flex items-center gap-2">
                 <Settings2 size={14} className="text-zinc-400" />
                 <span className="text-xs font-bold text-zinc-200 tracking-widest uppercase">Lygų Filtras</span>
               </div>
               <button 
                 onClick={onClose} 
                 className="p-1 rounded hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
               >
                 <X size={14} />
               </button>
            </div>

            {/* Content */}
            <div className="p-2 overflow-y-auto scrollbar-hide custom-scrollbar">
                {allLeagues.length === 0 ? (
                  <div className="py-8 text-center text-zinc-600 text-[10px] font-mono">
                    // KRAUNAMA DUOMENYS...
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                      {allLeagues.map((league) => {
                          const isEnabled = enabledLeagues.includes(league);
                          return (
                              <motion.button 
                                  key={league}
                                  onClick={() => onToggleLeague(league)}
                                  whileTap={{ scale: 0.98 }}
                                  className={`
                                    relative flex items-center justify-between w-full px-3 py-2 rounded-lg text-left transition-all duration-200 group border
                                    ${isEnabled 
                                        ? 'bg-white/5 border-white/10 text-white' 
                                        : 'bg-transparent border-transparent text-zinc-500 hover:bg-white/[0.02] hover:text-zinc-300'}
                                  `}
                              >
                                  <span className="text-[11px] font-medium tracking-wide truncate pr-2">
                                      {league}
                                  </span>
                                  
                                  <div className={`
                                      w-3 h-3 rounded-[2px] flex items-center justify-center transition-all duration-200 shrink-0 border
                                      ${isEnabled 
                                          ? 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_8px_rgba(16,185,129,0.4)]' 
                                          : 'bg-transparent border-zinc-800 group-hover:border-zinc-700'}
                                  `}>
                                      {isEnabled && <Check size={8} strokeWidth={4} />}
                                  </div>
                              </motion.button>
                          )
                      })}
                  </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-white/5 bg-white/[0.02] shrink-0">
                <button 
                  onClick={onClose}
                  className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-black bg-white hover:bg-zinc-200 rounded-lg transition-all shadow-lg"
                >
                    Uždaryti
                </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};