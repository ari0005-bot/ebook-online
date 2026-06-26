import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ebook, User, ReadingProgress } from '../types';
import { 
  ChevronLeft, ChevronRight, X, Settings2, Highlighter, Type, 
  Share2, Star, CheckCircle2, BookOpen, Sun, Moon, Eye, BookMarked
} from 'lucide-react';

interface ReaderProps {
  ebook: Ebook;
  currentUser: User | null;
  onClose: () => void;
}

type ThemeMode = 'sepia' | 'dark' | 'light';

interface ThemeConfig {
  bg: string;
  text: string;
  headerBg: string;
  headerBorder: string;
  pageBorder: string;
  buttonHover: string;
}

const themes: Record<ThemeMode, ThemeConfig> = {
  sepia: {
    bg: 'bg-[#f4ecd8]',
    text: 'text-[#2c2416]',
    headerBg: 'bg-[#e8dcc4]',
    headerBorder: 'border-[#d4c4a8]',
    pageBorder: 'border-[#d4c4a8]',
    buttonHover: 'hover:bg-[#d4c4a8]/30'
  },
  dark: {
    bg: 'bg-[#1a1a1a]',
    text: 'text-[#e0e0e0]',
    headerBg: 'bg-[#252525]',
    headerBorder: 'border-[#333333]',
    pageBorder: 'border-[#333333]',
    buttonHover: 'hover:bg-white/5'
  },
  light: {
    bg: 'bg-[#faf8f3]',
    text: 'text-[#2b2b2b]',
    headerBg: 'bg-[#ffffff]',
    headerBorder: 'border-[#e5e5e5]',
    pageBorder: 'border-[#e5e5e5]',
    buttonHover: 'hover:bg-slate-100'
  }
};

export default function Reader({ ebook, currentUser, onClose }: ReaderProps) {
  const [fontSize, setFontSize] = useState<number>(20); 
  const [currentPage, setCurrentPage] = useState<number>(0); 
  const [theme, setTheme] = useState<ThemeMode>('sepia');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  const settingsRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const totalPages = ebook.pages.length;
  const userId = currentUser ? currentUser.id : 'guest';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadProgress = async () => {
      const savedLocal = localStorage.getItem(`progress_${userId}_${ebook.id}`);
      if (savedLocal) {
        try {
          const progress: ReadingProgress = JSON.parse(savedLocal);
          if (progress.currentPage >= 0 && progress.currentPage < totalPages) {
            setCurrentPage(progress.currentPage % 2 === 0 ? progress.currentPage : progress.currentPage - 1);
          }
        } catch (e) {
          console.error('Error parsing local progress', e);
        }
      }

      if (userId !== 'guest') {
        try {
          const response = await fetch(`/api/progress/${userId}/${ebook.id}`);
          if (response.ok) {
            const serverData = await response.json();
            if (serverData && serverData.currentPage >= 0 && serverData.currentPage < totalPages) {
              const targetPage = serverData.currentPage % 2 === 0 ? serverData.currentPage : serverData.currentPage - 1;
              setCurrentPage(targetPage);
              localStorage.setItem(`progress_${userId}_${ebook.id}`, JSON.stringify(serverData));
            }
          }
        } catch (error) {
          console.error('Gagal sinkronisasi data dari backend server:', error);
        }
      }
    };

    loadProgress();
  }, [ebook.id, userId, totalPages]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      const targetPage = newPage % 2 === 0 ? newPage : newPage - 1;
      setCurrentPage(targetPage);
      
      const updatedProgress: ReadingProgress = {
        ebookId: ebook.id,
        currentPage: targetPage,
        maxPageRead: Math.max(targetPage, targetPage),
        lastReadTime: new Date().toISOString()
      };
      
      localStorage.setItem(`progress_${userId}_${ebook.id}`, JSON.stringify(updatedProgress));

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      if (userId !== 'guest') {
        saveTimeoutRef.current = setTimeout(async () => {
          try {
            await fetch('/api/progress', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, ...updatedProgress })
            });
          } catch (error) {
            console.error('Gagal mencadangkan progress ke cloud backend:', error);
          }
        }, 1000); 
      }
    }
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  const currentTheme = themes[theme];
  const activePageCount = Math.min(currentPage + (totalPages > 1 ? 2 : 1), totalPages);
  const progressPercent = Math.round((activePageCount / totalPages) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex flex-col h-screen overflow-hidden select-none transition-colors duration-500 ${currentTheme.bg} ${currentTheme.text} font-serif`}
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* HEADER UTAMA */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`w-full h-16 px-4 md:px-6 flex justify-between items-center shrink-0 relative border-b ${currentTheme.headerBorder} ${currentTheme.headerBg} backdrop-blur-md`}
      >
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={onClose}
            className={`flex items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${currentTheme.buttonHover}`}
            title="Kembali ke Katalog"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="hidden sm:block pl-2 border-l border-slate-300/30">
            <p className="text-[10px] font-sans font-bold opacity-70 truncate max-w-[200px]">{ebook.title}</p>
          </div>
        </div>

        {/* Menu Navigasi Kanan Atas */}
        <div className="flex items-center gap-1 relative">
          <div className={`flex items-center gap-0.5 ${currentTheme.headerBg} border ${currentTheme.headerBorder} rounded-full px-2 py-1.5 shadow-sm`}>
            <button type="button" className={`p-2 rounded-full cursor-pointer transition-all ${currentTheme.buttonHover}`}>
              <BookMarked className="w-4 h-4" />
            </button>
            <button type="button" className={`p-2 rounded-full cursor-pointer transition-all ${currentTheme.buttonHover}`}>
              <Highlighter className="w-4 h-4" />
            </button>
            
            {/* Tombol Akses Menu Pengaturan (Aa) */}
            <button 
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-full cursor-pointer transition-all flex items-center gap-1.5 ${showSettings ? 'bg-black/10' : ''} ${currentTheme.buttonHover}`}
              title="Pengaturan Tampilan Baca"
            >
              <Type className="w-4 h-4" />
              <span className="text-[11px] font-sans font-bold opacity-80 hidden sm:inline">{fontSize}px</span>
            </button>

            <button type="button" className={`p-2 rounded-full cursor-pointer transition-all ${currentTheme.buttonHover}`}>
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* INTERAKTIF DROPDOWN PANEL (POPOVER) */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                ref={settingsRef}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-14 z-50 w-72 bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-2xl text-slate-800 font-sans text-xs flex flex-col gap-5"
              >
                {/* Bagian 1: Ukuran Font */}
                <div>
                  <span className="text-slate-600 font-bold block mb-3 text-[11px] uppercase tracking-wider">Ukuran Teks</span>
                  <div className="flex items-center justify-between bg-slate-50 rounded-xl border-2 border-slate-200 p-1.5">
                    <button 
                      type="button"
                      onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                      disabled={fontSize <= 14}
                      className="flex-1 py-2 hover:bg-white rounded-lg disabled:opacity-30 cursor-pointer font-bold text-base text-center transition-all"
                    >
                      A-
                    </button>
                    <span className="px-4 font-black text-slate-800 min-w-[60px] text-center text-sm">{fontSize}px</span>
                    <button 
                      type="button"
                      onClick={() => setFontSize(Math.min(28, fontSize + 2))}
                      disabled={fontSize >= 28}
                      className="flex-1 py-2 hover:bg-white rounded-lg disabled:opacity-30 cursor-pointer font-bold text-base text-center transition-all"
                    >
                      A+
                    </button>
                  </div>
                </div>

                {/* Bagian 2: Tema Halaman */}
                <div>
                  <span className="text-slate-600 font-bold block mb-3 text-[11px] uppercase tracking-wider">Tema Halaman</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setTheme('sepia')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${theme === 'sepia' ? 'bg-[#f4ecd8] border-amber-500 text-[#2c2416] shadow-md' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'}`}
                    >
                      <Eye className="w-5 h-5" />
                      <span className="text-[10px] font-bold">Sepia</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${theme === 'light' ? 'bg-white border-amber-500 text-[#2b2b2b] shadow-md' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'}`}
                    >
                      <Sun className="w-5 h-5" />
                      <span className="text-[10px] font-bold">Terang</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${theme === 'dark' ? 'bg-[#1a1a1a] border-amber-500 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'}`}
                    >
                      <Moon className="w-5 h-5" />
                      <span className="text-[10px] font-bold">Gelap</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* AREA LEMBAR BACAAN UTAMA */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-2 flex items-center justify-between overflow-hidden relative">
        <motion.button
          type="button"
          onClick={() => handlePageChange(currentPage - 2)}
          disabled={currentPage === 0}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute left-2 z-10 p-3 rounded-full bg-black/0 hover:bg-black/5 disabled:opacity-0 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 w-full h-full items-center px-8 md:px-12">
          
          {/* HALAMAN KIRI */}
          <div className="h-full flex flex-col justify-center overflow-y-auto py-8 no-scrollbar">
            <AnimatePresence mode="wait">
              <motion.article
                key={currentPage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="w-full text-justify whitespace-pre-wrap leading-[1.9] tracking-wide select-text px-2 shadow-lg bg-white/50 backdrop-blur-sm rounded-2xl p-6 md:p-8"
                style={{ fontSize: `${fontSize}px` }}
              >
                {ebook.pages[currentPage] || (
                  <div className="text-center opacity-30 italic py-20">Akhir Buku</div>
                )}
              </motion.article>
            </AnimatePresence>
          </div>

          {/* HALAMAN KANAN */}
          <div className={`h-full hidden md:flex flex-col justify-center overflow-y-auto py-8 border-l-2 ${currentTheme.pageBorder} px-6 no-scrollbar`}>
            <AnimatePresence mode="wait">
              {currentPage + 1 < totalPages ? (
                <motion.article
                  key={currentPage + 1}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="w-full text-justify whitespace-pre-wrap leading-[1.9] tracking-wide select-text shadow-lg bg-white/50 backdrop-blur-sm rounded-2xl p-6 md:p-8"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {ebook.pages[currentPage + 1]}
                </motion.article>
              ) : (
                <div className="w-full text-center opacity-20 italic py-20">Lembar Kosong</div>
              )}
            </AnimatePresence>
          </div>

        </div>

        <motion.button
          type="button"
          onClick={() => handlePageChange(currentPage + 2)}
          disabled={currentPage + 2 >= totalPages}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-2 z-10 p-3 rounded-full bg-black/0 hover:bg-black/5 disabled:opacity-0 transition-all cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </main>

      {/* FOOTER & TIMELINE PROGRESS BAR */}
      <motion.footer 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full flex flex-col shrink-0 bg-slate-900 text-slate-300 font-sans border-t border-slate-800"
      >
        <div className="w-full h-1.5 bg-slate-800 relative overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressPercent, 100)}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <div className="h-14 px-4 md:px-6 flex justify-between items-center text-[11px]">
          <motion.button 
            type="button" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 text-white hover:bg-slate-800 transition-all cursor-pointer font-medium"
          >
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="hidden sm:inline">Beri Rating</span>
          </motion.button>

          <div className="flex items-center bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <button 
              type="button"
              onClick={() => handlePageChange(currentPage - 2)}
              disabled={currentPage === 0}
              className="p-2 px-3 hover:bg-slate-700 disabled:opacity-20 cursor-pointer transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            
            <span className="px-4 font-bold text-white min-w-[120px] text-center">
              {activePageCount} / {totalPages}
            </span>

            <button 
              type="button"
              onClick={() => handlePageChange(currentPage + 2)}
              disabled={currentPage + 2 >= totalPages}
              className="p-2 px-3 hover:bg-slate-700 disabled:opacity-20 cursor-pointer transition-all"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>

          <motion.button 
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 transition-all cursor-pointer font-medium shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="hidden sm:inline">Selesai</span>
          </motion.button>
        </div>
      </motion.footer>
    </motion.div>
  );
}