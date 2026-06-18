import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Ebook, User, Bookmark, ReadingProgress } from '../types';
import { 
  X, ChevronLeft, ChevronRight, Bookmark as BookmarkIcon, 
  BookmarkCheck, ZoomIn, ZoomOut, Moon, Sun, BookOpen, AlertCircle, Save 
} from 'lucide-react';

interface ReaderProps {
  ebook: Ebook;
  currentUser: User | null;
  onClose: () => void;
}

export default function Reader({ ebook, currentUser, onClose }: ReaderProps) {
  // Reading mode visual themes
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('sepia');
  const [fontSize, setFontSize] = useState<number>(16); // px

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [showBookmarkForm, setShowBookmarkForm] = useState(false);

  const totalPages = ebook.pages.length;
  const userId = currentUser ? currentUser.id : 'guest';

  // Load existing reader state (page progress & bookmarks)
  useEffect(() => {
    // 1. Load progress
    const savedProgressStr = localStorage.getItem(`progress_${userId}_${ebook.id}`);
    if (savedProgressStr) {
      try {
        const progress: ReadingProgress = JSON.parse(savedProgressStr);
        if (progress.currentPage >= 0 && progress.currentPage < totalPages) {
          setCurrentPage(progress.currentPage);
        }
      } catch (e) {
        console.error('Error parsing progress', e);
      }
    } else {
      setCurrentPage(0);
    }

    // 2. Load bookmarks
    const savedBookmarksStr = localStorage.getItem(`bookmarks_${userId}`);
    if (savedBookmarksStr) {
      try {
        const allBookmarksArr: Bookmark[] = JSON.parse(savedBookmarksStr);
        const filtered = allBookmarksArr.filter(b => b.ebookId === ebook.id);
        setBookmarks(filtered);
      } catch (e) {
        console.error('Error parsing bookmarks', e);
      }
    }
  }, [ebook.id, userId, totalPages]);

  // Save current progress on page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      
      const updatedProgress: ReadingProgress = {
        ebookId: ebook.id,
        currentPage: newPage,
        maxPageRead: Math.max(newPage, newPage), // update tracking
        lastReadTime: new Date().toISOString()
      };
      
      localStorage.setItem(`progress_${userId}_${ebook.id}`, JSON.stringify(updatedProgress));
      
      // Update core progress indexes
      let allProgress: Record<string, number> = {};
      const savedProgressMap = localStorage.getItem(`book_progress_map_${userId}`);
      if (savedProgressMap) {
        try { allProgress = JSON.parse(savedProgressMap); } catch (e) {}
      }
      allProgress[ebook.id] = newPage;
      localStorage.setItem(`book_progress_map_${userId}`, JSON.stringify(allProgress));
    }
  };

  // Add a bookmark
  const handleAddBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    const newBookmark: Bookmark = {
      id: 'bmk-' + Math.random().toString(36).substring(2, 9),
      ebookId: ebook.id,
      pageNumber: currentPage,
      note: bookmarkNote.trim() || `Halaman ${currentPage + 1}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    // Save globally
    let globalBookmarks: Bookmark[] = [];
    const savedGlobalStr = localStorage.getItem(`bookmarks_${userId}`);
    if (savedGlobalStr) {
      try { globalBookmarks = JSON.parse(savedGlobalStr); } catch (e) {}
    }

    const updatedGlobal = [...globalBookmarks, newBookmark];
    localStorage.setItem(`bookmarks_${userId}`, JSON.stringify(updatedGlobal));

    // Update local state list
    setBookmarks(prev => [...prev, newBookmark]);
    setBookmarkNote('');
    setShowBookmarkForm(false);
  };

  // Delete bookmark
  const handleDeleteBookmark = (bmId: string) => {
    let globalBookmarks: Bookmark[] = [];
    const savedGlobalStr = localStorage.getItem(`bookmarks_${userId}`);
    if (savedGlobalStr) {
      try { globalBookmarks = JSON.parse(savedGlobalStr); } catch (e) {}
    }

    const updatedGlobal = globalBookmarks.filter(b => b.id !== bmId);
    localStorage.setItem(`bookmarks_${userId}`, JSON.stringify(updatedGlobal));
    
    setBookmarks(prev => prev.filter(b => b.id !== bmId));
  };

  const isCurrentPageBookmarked = bookmarks.some(b => b.pageNumber === currentPage);

  // Styling helper for the active theme
  const getThemeClass = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#f4efe2] text-[#433422]';
      case 'dark':
        return 'bg-[#121212] text-[#e0e0e0]';
      default:
        return 'bg-white text-slate-800 border-slate-200';
    }
  };

  const getSidebarThemeClass = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#ebe4d0] border-[#dcd2b7] text-[#433422]';
      case 'dark':
        return 'bg-[#1e1e1e] border-[#2a2a2a] text-[#c0c0c0]';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const getPaperBorder = () => {
    switch (theme) {
      case 'sepia':
        return 'border-[#e3dac4]';
      case 'dark':
        return 'border-[#222222]';
      default:
        return 'border-slate-100';
    }
  };

  const progressPercent = Math.round(((currentPage + 1) / totalPages) * 100);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col md:flex-row h-screen transition-colors duration-300 ${getThemeClass()}`}>
      
      {/* LEFT SIDEBAR: Index of Chapters, Controls, and Saved Bookmarks */}
      <div className={`w-full md:w-80 md:h-full flex flex-col border-b md:border-b-0 md:border-r p-5 shrink-0 ${getSidebarThemeClass()}`}>
        
        {/* Header Header Info */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm tracking-tight truncate max-w-[180px]">
              {ebook.title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-2 text-xs bg-slate-200/50 hover:bg-slate-300/50 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg cursor-pointer flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Close
          </button>
        </div>

        {/* Display Book Metadata summary */}
        <div className="mb-6 pb-4 border-b border-black/10 dark:border-white/10 text-xs">
          <p className="opacity-75">Karya: <span className="font-semibold">{ebook.author}</span></p>
          <p className="opacity-75 mt-1">Kategori: <span className="font-medium">{ebook.category}</span></p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 bg-black/20 dark:bg-white/15 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="font-mono text-[10px] whitespace-nowrap">{progressPercent}% selesai</span>
          </div>
        </div>

        {/* CONTROLS PROFILE SECTION */}
        <div className="space-y-4 mb-6">
          {/* Theme customizer switcher */}
          <div>
            <span className="text-[10px] font-bold tracking-wider opacity-60 uppercase block mb-2">Tema Warna</span>
            <div className="grid grid-cols-3 gap-1 grid-flow-row">
              <button
                onClick={() => setTheme('light')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold cursor-pointer border ${theme === 'light' ? 'bg-white text-slate-800 border-blue-500 shadow-2xs' : 'bg-slate-200/50 text-slate-600 dark:bg-zinc-800/80 dark:text-zinc-450 border-transparent'}`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold cursor-pointer border ${theme === 'sepia' ? 'bg-[#f4efe2] text-[#433422] border-amber-600' : 'bg-slate-200/50 text-slate-600 dark:bg-zinc-800/80 dark:text-zinc-450 border-transparent'}`}
              >
                Sepia
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold cursor-pointer border ${theme === 'dark' ? 'bg-[#121212] text-white border-blue-500 shadow-2xs' : 'bg-slate-200/50 text-slate-600 dark:bg-zinc-800/80 dark:text-zinc-450 border-transparent'}`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* FontSize adjustments */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-bold tracking-wider opacity-60 uppercase">Zoom Ukuran Font</span>
              <span className="text-[10px] font-mono opacity-80">{fontSize}px</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
                disabled={fontSize === 12}
                className="flex-1 py-1.5 flex justify-center items-center bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 disabled:opacity-30 rounded-lg cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setFontSize(prev => Math.min(26, prev + 2))}
                disabled={fontSize === 26}
                className="flex-1 py-1.5 flex justify-center items-center bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 disabled:opacity-30 rounded-lg cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* BOOKMARKS SECTION OF READER */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold tracking-wider opacity-60 uppercase">Bookmarks Abadi ({bookmarks.length})</span>
            <button
              onClick={() => setShowBookmarkForm(!showBookmarkForm)}
              className="px-2 py-0.5 text-[10px] bg-blue-600 text-white rounded font-medium cursor-pointer"
            >
              + Tambah
            </button>
          </div>

          {/* Bookmark creation note input */}
          {showBookmarkForm && (
            <form onSubmit={handleAddBookmark} className="p-3 bg-black/10 dark:bg-white/5 rounded-xl space-y-2 mb-3">
              <p className="text-[10px] font-semibold">Beri catatan Halaman {currentPage + 1}:</p>
              <textarea
                value={bookmarkNote}
                onChange={(e) => setBookmarkNote(e.target.value)}
                placeholder="misal: Catatan penting atau bab menarik..."
                rows={2}
                className="w-full bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-lg text-xs p-1.5 outline-none"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowBookmarkForm(false)}
                  className="px-2 py-1 text-[10px] hover:underline"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-2 py-1 text-[10px] bg-emerald-600 text-white rounded hover:bg-emerald-700 cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          )}

          {/* Bookmarks List */}
          {bookmarks.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center text-center text-xs opacity-50 flex-1">
              <BookmarkIcon className="w-5 h-5 mb-1 opacity-40" />
              <p>Belum ada bookmark pada buku ini.</p>
            </div>
          ) : (
            <div className="space-y-2 flex-1 overflow-y-auto pr-1">
              {bookmarks.map((b) => (
                <div 
                  key={b.id}
                  className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 text-xs flex flex-col gap-1 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="flex justify-between items-center font-semibold">
                    <button
                      onClick={() => handlePageChange(b.pageNumber)}
                      className="text-left text-blue-600 hover:underline font-bold"
                    >
                      Halaman {b.pageNumber + 1}
                    </button>
                    <button
                      onClick={() => handleDeleteBookmark(b.id)}
                      className="text-[10px] text-rose-500 hover:text-rose-600 font-bold"
                    >
                      Hapus
                    </button>
                  </div>
                  <p className="opacity-90 leading-tight italic">"{b.note}"</p>
                  <span className="text-[9px] opacity-50 mt-1">{b.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT AREA: Main Ebook Page Canvas rendering (The real reading panel) */}
      <div className="flex-1 h-full flex flex-col overflow-hidden relative">
        
        {/* Top page layout stats info bar */}
        <div className={`py-4 px-6 border-b flex justify-between items-center shrink-0 ${getPaperBorder()}`}>
          <div className="text-xs font-mono tracking-wider opacity-60">
            {ebook.title.toUpperCase()}
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="opacity-75">Halaman {currentPage + 1} dari {totalPages}</span>
            <button
              onClick={() => {
                const globalSaved = localStorage.getItem(`bookmarks_${userId}`) || '[]';
                let parsedGlobal: Bookmark[] = [];
                try { parsedGlobal = JSON.parse(globalSaved); } catch(e){}
                
                if (isCurrentPageBookmarked) {
                  const targetId = bookmarks.find(b => b.pageNumber === currentPage)?.id;
                  if (targetId) handleDeleteBookmark(targetId);
                } else {
                  setShowBookmarkForm(true);
                }
              }}
              title={isCurrentPageBookmarked ? "Hapus Bookmark" : "Tandai Halaman Ini"}
              className={`p-1.5 rounded-lg cursor-pointer ${isCurrentPageBookmarked ? 'bg-amber-100 dark:bg-amber-950 text-amber-600' : 'hover:bg-slate-100 dark:hover:bg-zinc-800'}`}
            >
              {isCurrentPageBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Dynamic page transition content scroll container */}
        <div className="flex-1 overflow-y-auto px-6 py-10 flex justify-center items-start">
          <motion.article 
            key={currentPage} 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl bg-transparent font-serif leading-loose whitespace-pre-wrap select-text text-justify"
            style={{ fontSize: `${fontSize}px` }}
          >
            {/* The actual text splitter rendering */}
            {ebook.pages[currentPage] || "Halaman kosong atau tidak ditemukan."}
          </motion.article>
        </div>

        {/* Sticky bottom page turner pagination controls drawer */}
        <div className={`p-4 border-t flex items-center justify-between shrink-0 ${getPaperBorder()}`}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-20 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Kembali
          </button>
          
          <div className="hidden sm:flex gap-1">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx)}
                className={`w-7 h-7 font-mono text-xs rounded-lg transition-all cursor-pointer ${currentPage === idx ? 'bg-blue-600 text-white font-bold' : 'hover:bg-black/10 dark:hover:bg-white/10'}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 hover:shadow-xs text-white disabled:opacity-25 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            Lanjut <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
