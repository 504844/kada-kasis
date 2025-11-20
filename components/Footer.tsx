import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-6 border-t border-white/5 bg-black/40 backdrop-blur-sm flex justify-center">
        <a 
            href="https://martinciurlionis.lt/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity duration-300"
        >
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Solution by Martin Čiurlionis</span>
        </a>
    </footer>
  );
};