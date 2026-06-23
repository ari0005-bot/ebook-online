import React from 'react';
import { motion } from 'motion/react'; // atau 'framer-motion'
import { Sparkles } from 'lucide-react';

export default function SplashScreen() {
  // Pecah string judul untuk efek animasi muncul per huruf (staggered)
  const titleLetters = "e.mind".split("");

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }} // Custom cubic-bezier untuk exit yang super halus
      className="fixed inset-0 bg-slate-950 flex flex-col justify-center items-center z-[99999] overflow-hidden"
    >
      {/* Efek Pendaran Cahaya (Latar Belakang Sinematik) */}
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-[#c8963e]/10 to-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center space-y-8 relative z-10">
        
        {/* Container Logo dengan Efek Ring & Glow */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          {/* Ring Luar Berdenyut Ringan */}
          <motion.div
            animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border border-[#c8963e]/30 blur-[2px]"
          />
          
          {/* Box Logo Utama */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-20 h-20 bg-gradient-to-br from-slate-900 to-slate-950 border border-[#c8963e]/40 rounded-2xl flex items-center justify-center shadow-2xl shadow-[#c8963e]/10 relative overflow-hidden group"
          >
            {/* Sorotan Cahaya Menyapu Logo */}
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
              className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent to-white/10 -skew-x-12"
            />
            <Sparkles className="w-10 h-10 text-[#c8963e]" />
          </motion.div>
        </div>

        {/* Judul & Deskripsi Branding */}
        <div className="space-y-3">
          {/* Animasi Huruf Muncul Bergantian */}
          <motion.h1 
            className="text-4xl font-black tracking-wider text-white font-serif flex justify-center items-center"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.08 } }
            }}
          >
            {titleLetters.map((letter, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 0.7, letterSpacing: "0.25em" }}
            transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
            className="text-[10px] text-slate-300 uppercase font-bold tracking-[0.25em]"
          >
            The LOCAL Enablers
          </motion.p>
        </div>

        {/* Minimalist Premium Loader */}
        <div className="w-40 h-[2px] bg-slate-900 rounded-full mx-auto overflow-hidden relative">
          <motion.div 
            className="h-full bg-gradient-to-r from-transparent via-[#c8963e] to-transparent w-1/2 absolute"
            animate={{ 
              left: ["-50%", "100%"]
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

      </div>
    </motion.div>
  );
}