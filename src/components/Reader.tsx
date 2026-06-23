import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ebook, User, ReadingProgress } from '../types';
import { 
  ChevronLeft, ChevronRight, Menu, Highlighter, Type, 
  Share2, Star, CheckCircle2, BookOpen, Sun, Moon, Eye
} from 'lucide-react';

interface ReaderProps {
  ebook: Ebook;
  currentUser: User | null;
  onClose: () => void;
}

// Definisi variasi tema warna membaca
type ThemeMode = 'sepia' | 'dark' | 'light';

interface ThemeConfig {
  bg: string;
  text: string;
  headerBg: string;
  headerBorder: string;
  pageBorder: string;
}

const themes: Record<ThemeMode, ThemeConfig> = {
  sepia: {
    bg: 'bg-[#b6b492]',
    text: 'text-[#181b13]',
    headerBg: 'bg-[#aba987]',
    headerBorder: 'border-[#9c9a78]',
    pageBorder: 'border-[#aba987]/40'
  },
  dark: {
    bg: 'bg-[#1a1a1a]',
    text: 'text-[#e0e0e0]',
    headerBg: 'bg-[#262626]',
    headerBorder: 'border-[#333333]',
    pageBorder: 'border-[#333333]'
  },
  light: {
    bg: 'bg-[#f4f1ea]',
    text: 'text-[#2b2b2b]',
    headerBg: 'bg-[#e8e4d9]',
    headerBorder: 'border-[#d0c9b8]',
    pageBorder: 'border-[#d0c9b8]/60'
  }
};

export default function Reader({ ebook, currentUser, onClose }: ReaderProps) {
  const [fontSize, setFontSize] = useState<number>(20); 
  const [currentPage, setCurrentPage] = useState<number>(0); 
  const [theme, setTheme] = useState<ThemeMode>('sepia');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  const settingsRef = useRef<HTMLDivElement>(null);
  const totalPages = ebook.pages.length;
  const userId = currentUser ? currentUser.id : 'guest';

  // Menutup popover pengaturan jika klik di luar area menu
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
    const savedProgressStr = localStorage.getItem(`progress_${userId}_${ebook.id}`);
    if (savedProgressStr) {
      try {
        const progress: ReadingProgress = JSON.parse(savedProgressStr);
        if (progress.currentPage >= 0 && progress.currentPage < totalPages) {
          setCurrentPage(progress.currentPage % 2 === 0 ? progress.currentPage : progress.currentPage - 1);
        }
      } catch (e) {
        console.error('Error parsing progress', e);
      }
    }
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
    }
  };

  const currentTheme = themes[theme];
  const progressPercent = Math.round(((currentPage + (totalPages > 1 ? 2 : 1)) / totalPages) * 100);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col h-screen overflow-hidden select-none transition-colors duration-300 ${currentTheme.bg} ${currentTheme.text} font-serif`}>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* HEADER UTAMA */}
      <header className="w-full h-16 px-8 flex justify-between items-center shrink-0 relative">
        <button 
          onClick={onClose}
          className={`flex items-center justify-center p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer ${currentTheme.text}`}
        >
          <BookOpen className="w-6 h-6" />
        </button>

        {/* Menu Navigasi Kanan Atas */}
        <div className="flex items-center gap-1 relative">
          <div className={`flex items-center gap-1 ${currentTheme.headerBg} border ${currentTheme.headerBorder} rounded-full px-4 py-1.5 shadow-xs`}>
            <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full cursor-pointer transition-colors">
              <Menu className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full cursor-pointer transition-colors">
              <Highlighter className="w-4 h-4" />
            </button>
            
            {/* Tombol Akses Menu Pengaturan (Aa) */}
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-full cursor-pointer transition-colors flex items-center gap-1 ${showSettings ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
              title="Pengaturan Tampilan Baca"
            >
              <Type className="w-4 h-4" />
              <span className="text-[11px] font-sans font-bold opacity-80">{fontSize}px</span>
            </button>

            <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full cursor-pointer transition-colors flex items-center">
              <span className="w-4 h-2.5 bg-red-600 inline-block border border-white/20 rounded-xs"></span>
            </button>
            <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full cursor-pointer transition-colors">
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
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-14 z-50 w-64 bg-[#232323] border border-[#333] rounded-2xl p-4 shadow-xl text-zinc-200 font-sans text-xs flex flex-col gap-4"
              >
                {/* Bagian 1: Ukuran Font */}
                <div>
                  <span className="text-zinc-400 font-medium block mb-2">Ukuran Teks</span>
                  <div className="flex items-center justify-between bg-[#1a1a1a] rounded-lg border border-[#333] p-1">
                    <button 
                      onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                      disabled={fontSize <= 14}
                      className="flex-1 py-1.5 hover:bg-white/5 rounded-md disabled:opacity-30 cursor-pointer font-bold text-sm"
                    >
                      A-
                    </button>
                    <span className="px-4 font-semibold text-zinc-300 min-w-[50px] text-center">{fontSize}px</span>
                    <button 
                      onClick={() => setFontSize(Math.min(28, fontSize + 2))}
                      disabled={fontSize >= 28}
                      className="flex-1 py-1.5 hover:bg-white/5 rounded-md disabled:opacity-30 cursor-pointer font-bold text-sm"
                    >
                      A+
                    </button>
                  </div>
                </div>

                {/* Bagian 2: Skema Warna Latar / Tema */}
                <div>
                  <span className="text-zinc-400 font-medium block mb-2">Tema Halaman</span>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Opsi Sepia */}
                    <button
                      onClick={() => setTheme('sepia')}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${theme === 'sepia' ? 'bg-[#b6b492] border-amber-500 text-[#181b13]' : 'bg-[#aba987]/20 border-transparent text-zinc-400 hover:border-zinc-700'}`}
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-[10px] font-medium">Sepia</span>
                    </button>
                    {/* Opsi Light */}
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${theme === 'light' ? 'bg-[#f4f1ea] border-amber-500 text-[#2b2b2b]' : 'bg-[#e8e4d9]/20 border-transparent text-zinc-400 hover:border-zinc-700'}`}
                    >
                      <Sun className="w-4 h-4" />
                      <span className="text-[10px] font-medium">Terang</span>
                    </button>
                    {/* Opsi Dark */}
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${theme === 'dark' ? 'bg-[#1a1a1a] border-amber-500 text-[#e0e0e0]' : 'bg-[#262626]/40 border-transparent text-zinc-400 hover:border-zinc-700'}`}
                    >
                      <Moon className="w-4 h-4" />
                      <span className="text-[10px] font-medium">Gelap</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* AREA LEMBAR BACAAN UTAMA */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-2 flex items-center justify-between overflow-hidden relative">
        <button
          onClick={() => handlePageChange(currentPage - 2)}
          disabled={currentPage === 0}
          className={`absolute left-2 z-10 p-3 rounded-full bg-black/0 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-0 transition-all cursor-pointer ${currentTheme.text}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 w-full h-full items-center px-10">
          
          {/* HALAMAN KIRI */}
          <div className="h-full flex flex-col justify-center overflow-y-auto py-6 no-scrollbar">
            <AnimatePresence mode="wait">
              <motion.article
                key={currentPage}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18 }}
                className="w-full text-justify whitespace-pre-wrap leading-[1.85] tracking-wide select-text px-2"
                style={{ fontSize: `${fontSize}px` }}
              >
                {ebook.pages[currentPage] || (
                  <div className="text-center opacity-30 italic py-20">Akhir Buku</div>
                )}
              </motion.article>
            </AnimatePresence>
          </div>

          {/* HALAMAN KANAN */}
          <div className={`h-full hidden md:flex flex-col justify-center overflow-y-auto py-6 border-l ${currentTheme.pageBorder} px-2 no-scrollbar`}>
            <AnimatePresence mode="wait">
              {currentPage + 1 < totalPages ? (
                <motion.article
                  key={currentPage + 1}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                  className="w-full text-justify whitespace-pre-wrap leading-[1.85] tracking-wide select-text pl-6"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {ebook.pages[currentPage + 1]}
                </motion.article>
              ) : (
                <div className="w-full text-center opacity-20 italic">Lembar Kosong</div>
              )}
            </AnimatePresence>
          </div>

        </div>

        <button
          onClick={() => handlePageChange(currentPage + 2)}
          disabled={currentPage + 2 >= totalPages}
          className={`absolute right-2 z-10 p-3 rounded-full bg-black/0 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-0 transition-all cursor-pointer ${currentTheme.text}`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </main>

      {/* FOOTER & TIMELINE PROGRESS BAR */}
      <footer className="w-full flex flex-col shrink-0 bg-[#232323] text-[#959595] font-sans">
        <div className="w-full h-1 bg-[#3a3a3a] relative">
          <div 
            className="h-full bg-[#7a7a7a] transition-all duration-300"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>

        <div className="h-12 px-6 flex justify-between items-center text-[11px]">
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#3a3a3a] text-white/90 hover:bg-white/5 transition-colors cursor-pointer">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Beri Rating</span>
          </button>

          <div className="flex items-center bg-[#1a1a1a] rounded-md border border-[#2e2e2e] overflow-hidden">
            <button 
              onClick={() => handlePageChange(currentPage - 2)}
              disabled={currentPage === 0}
              className="p-1.5 px-2.5 hover:bg-white/5 disabled:opacity-20 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-white" />
            </button>
            
            <span className="px-4 font-medium text-white/90 select-none border-x border-[#2e2e2e] min-w-[120px] text-center">
              Page {currentPage + 1} of {totalPages}
            </span>

            <button 
              onClick={() => handlePageChange(currentPage + 2)}
              disabled={currentPage + 2 >= totalPages}
              className="p-1.5 px-2.5 hover:bg-white/5 disabled:opacity-20 cursor-pointer transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          <button 
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Selesai Dibaca</span>
          </button>
        </div>
      </footer>

    </div>
  );
}