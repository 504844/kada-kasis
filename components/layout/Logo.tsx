import React from "react";
import { Rabbit } from "lucide-react";
import { motion } from "framer-motion";

export const Logo: React.FC = () => {
  return (
    <motion.div 
      className="flex items-center gap-3 select-none cursor-default group relative overflow-hidden"
      initial="idle"
      whileHover="hover"
    >
      {/* Icon Container - Static */}
      <div className="relative w-8 h-8 md:w-9 md:h-9 flex items-center justify-center shrink-0">
        <div className="absolute inset-0 bg-white/5 rounded-xl blur-md transition-all duration-500"></div>
        <div className="relative w-full h-full bg-black/80 border border-white/10 rounded-lg flex items-center justify-center text-white shadow-lg transition-colors">
          <Rabbit 
            size={18} 
            className="md:w-[22px] md:h-[22px]" 
            strokeWidth={2} 
          />
        </div>
      </div>

      {/* Text Container */}
      <div className="relative h-10 flex flex-col justify-center min-w-[150px]">
        
        {/* State 1: Default (URL + Subtitle) */}
        <motion.div
          variants={{
            idle: { y: 0, opacity: 1 },
            hover: { y: -20, opacity: 0 },
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="absolute left-0 flex flex-col"
        >
          <h1 className="text-sm md:text-lg font-bold tracking-tight text-white leading-none">
            sportas.vercel.app
          </h1>
          <p className="hidden xs:block text-[8px] md:text-[9px]  tracking-[0.2em] text-zinc-500 font-semibold mt-0.5">
            krepšinis gyvai
          </p>
        </motion.div>

        {/* State 2: Hover (Translated Text) */}
        <motion.div
          variants={{
            idle: { y: 20, opacity: 0 },
            hover: { y: 0, opacity: 1 },
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="absolute left-0 flex items-center h-full"
        >
          <h1 className="text-sm md:text-lg font-bold tracking-tight text-white leading-none ">
            krepšinis gyvai
          </h1>
        </motion.div>
      </div>
    </motion.div>
  );
};