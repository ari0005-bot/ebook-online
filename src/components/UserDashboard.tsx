import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Ebook, Transaction, User } from '../types';
import { 
  BookOpen, Clock, Award, ArrowRight, Star, Heart, 
  History, LayoutDashboard, ChevronRight, LogOut, GraduationCap,
  TrendingUp, BookMarked, Sparkles
} from 'lucide-react';

interface UserDashboardProps {
  currentUser: User | null;
  allEbooks: Ebook[];
  transactions: Transaction[];
  ownedBookIds: string[];
  onNavigateToCatalog: () => void;
  onReadEbook: (ebook: Ebook) => void;
}

const formatIDR = (num: number) => {
  if (num === 0) return 'Rp 0';
  return 'Rp ' + num.toLocaleString('id-ID');
};

export default function UserDashboard({
  currentUser,
  allEbooks,
  transactions,
  ownedBookIds,
  onNavigateToCatalog,
  onReadEbook
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'library' | 'history'>('overview');
  const [readingProgressMap, setReadingProgressMap] = useState<Record<string, number>>({});
  
  const userId = currentUser ? currentUser.id : 'guest';

  useEffect(() => {
    const savedProgressMap = localStorage.getItem(`book_progress_map_${userId}`);
    if (savedProgressMap) {
      try {
        setReadingProgressMap(JSON.parse(savedProgressMap));
      } catch (e) {
        console.error('Error parsing progress map', e);
      }
    }
  }, [userId]);

  const ownedEbooks = allEbooks.filter((ebook) => ownedBookIds.includes(ebook.id));
  const userTransactions = currentUser ? transactions.filter((tx) => tx.userId === currentUser.id) : [];
  const totalSpent = userTransactions.reduce((sum, tx) => sum + tx.totalAmount, 0);

  const categoryCounts = ownedEbooks.reduce<Record<string, number>>((acc, ebook) => {
    acc[ebook.category] = (acc[ebook.category] || 0) + 1;
    return acc;
  }, {});

  const favoriteCategory = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category)[0] || 'Belum ada koleksi';

  const recommended = allEbooks.filter((ebook) => !ownedBookIds.includes(ebook.id)).slice(0, 3);
  const recentTx = userTransactions.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* ─── SIDEBAR COMPONENT (KIRI) ─── */}
      <aside className="w-full md:w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-300 border-r border-slate-800 flex flex-col shrink-0 shadow-2xl">
        {/* Identitas Aplikasi / Logo */}
        <div className="h-24 px-6 flex items-center gap-3 border-b border-slate-800 bg-slate-950/30">
          <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl text-white shadow-lg">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-black text-white text-xl tracking-tight block">eduHub</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Layanan Pendidikan</span>
          </div>
        </div>

        {/* Info Ringkas Akun Pengguna */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-br from-blue-900/20 to-slate-950/40">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">Akun Terhubung</div>
          <div className="font-bold text-white text-sm truncate">{currentUser?.fullName || 'Pembaca eduHub'}</div>
          <div className="text-[11px] text-slate-400 truncate mt-1">{currentUser?.email || 'student@eduhub.id'}</div>
        </div>

        {/* Menu Navigasi Sidebar */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
              activeTab === 'overview' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20' 
                : 'hover:bg-slate-800 hover:text-white text-slate-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4" />
              <span>Ringkasan</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'overview' ? 'block' : 'hidden'}`} />
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
              activeTab === 'library' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20' 
                : 'hover:bg-slate-800 hover:text-white text-slate-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4" />
              <span>Modul Saya</span>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
              activeTab === 'library' 
                ? 'bg-white text-blue-600' 
                : 'bg-slate-800 text-slate-400'
            }`}>
              {ownedEbooks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
              activeTab === 'history' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20' 
                : 'hover:bg-slate-800 hover:text-white text-slate-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <History className="w-4 h-4" />
              <span>Riwayat</span>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
              activeTab === 'history' 
                ? 'bg-white text-blue-600' 
                : 'bg-slate-800 text-slate-400'
            }`}>
              {userTransactions.length}
            </span>
          </button>
        </nav>

        {/* Footer Sidebar / Kembali ke Katalog */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/20">
          <button 
            onClick={onNavigateToCatalog}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white text-xs font-bold transition-all cursor-pointer shadow-lg"
          >
            <span>Jelajahi Katalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* ─── KONTEN UTAMA PANEL (KANAN) ─── */}
      <main className="flex-1 overflow-y-auto px-6 md:px-10 py-8 space-y-8">
        
        {/* HERO BANNER RINGKASAN */}
        <motion.div 
          className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Background Effects */}
          <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-48 w-48 rounded-full bg-purple-600/10 blur-3xl" />
          
          <div className="relative z-10 space-y-4">
            <motion.span 
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-slate-200 backdrop-blur-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-3 h-3" />
              Dashboard eduHub
            </motion.span>
            
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Halo, {currentUser?.fullName || 'Pembaca'} 👋
            </motion.h1>
            
            <motion.p 
              className="max-w-2xl text-sm text-slate-300 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Ringkasan investasi pembelajaran dan pencapaian modul kompetensi Anda dalam satu panel kendali.
            </motion.p>
          </div>

          {/* STATISTIK GRID */}
          <motion.div 
            className="relative z-10 mt-8 grid gap-4 grid-cols-2 lg:grid-cols-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="group rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center gap-2 text-slate-300 mb-2">
                <div className="p-1.5 bg-cyan-500/20 rounded-lg">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold">Modul Dimiliki</span>
              </div>
              <div className="text-3xl font-black text-white">{ownedEbooks.length}</div>
            </div>
            
            <div className="group rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center gap-2 text-slate-300 mb-2">
                <div className="p-1.5 bg-amber-500/20 rounded-lg">
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold">Total Transaksi</span>
              </div>
              <div className="text-3xl font-black text-white">{userTransactions.length}</div>
            </div>
            
            <div className="group rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center gap-2 text-slate-300 mb-2">
                <div className="p-1.5 bg-rose-500/20 rounded-lg">
                  <Heart className="w-4 h-4 text-rose-400" />
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold">Topik Terfavorit</span>
              </div>
              <div className="text-lg font-black text-white truncate">{favoriteCategory}</div>
            </div>
            
            <div className="group rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center gap-2 text-slate-300 mb-2">
                <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold">Total Investasi</span>
              </div>
              <div className="text-xl font-black text-white font-mono">{formatIDR(totalSpent)}</div>
            </div>
          </motion.div>
        </motion.div>

        {/* VIEW KONTEN BERDASARKAN TAB SIDEBAR */}
        {activeTab === 'overview' && (
          <motion.div 
            className="grid lg:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Box Rekomendasi */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4 mb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900">Rekomendasi Belajar</h2>
                  <p className="text-xs text-slate-500 mt-1">Materi penunjang kompetensi baru</p>
                </div>
                <span className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-[10px] uppercase tracking-widest font-bold rounded-full border border-blue-100">
                  Disarankan
                </span>
              </div>
              <div className="space-y-3">
                {recommended.length === 0 ? (
                  <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 text-slate-500 text-xs text-center border-2 border-dashed border-slate-200">
                    Semua koleksi sudah Anda miliki, luar biasa! 🎉
                  </div>
                ) : (
                  recommended.map((ebook) => (
                    <div 
                      key={ebook.id} 
                      className="group rounded-xl border-2 border-slate-200 p-4 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-r from-slate-50 to-white flex items-center justify-between"
                      onClick={onNavigateToCatalog}
                    >
                      <div className="flex items-center gap-3">
                        <img src={ebook.coverUrl} alt={ebook.title} referrerPolicy="no-referrer" className="w-12 h-16 rounded-lg object-cover shadow-md" />
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 text-xs line-clamp-1">{ebook.title}</h3>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{ebook.author}</p>
                          <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-amber-600">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> 
                            {ebook.rating}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Box Aktivitas Pembelian */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4 mb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900">Aktivitas Invoice</h2>
                  <p className="text-xs text-slate-500 mt-1">Log order pembayaran teranyar</p>
                </div>
                <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 text-[10px] uppercase tracking-widest font-bold rounded-full border border-emerald-100">
                  Terbaru
                </span>
              </div>
              <div className="space-y-3">
                {recentTx.length === 0 ? (
                  <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 text-slate-500 text-xs text-center border-2 border-dashed border-slate-200">
                    Belum ada riwayat transaksi akun.
                  </div>
                ) : (
                  recentTx.map((tx) => (
                    <div key={tx.id} className="rounded-xl border-2 border-slate-200 p-4 bg-gradient-to-r from-slate-50 to-white text-xs hover:border-blue-300 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">{tx.date}</p>
                          <h3 className="font-mono font-bold text-slate-900 text-xs mt-1">{tx.invoiceNumber}</h3>
                        </div>
                        <span className="px-2.5 py-1 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 text-[9px] font-bold uppercase tracking-wider rounded-full border border-emerald-200">
                          {tx.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-200 pt-2.5 mt-2">
                        <span className="font-mono font-black text-slate-900 text-sm">{formatIDR(tx.totalAmount)}</span>
                        <button 
                          onClick={() => setActiveTab('history')} 
                          className="text-blue-600 hover:text-blue-700 text-[10px] uppercase tracking-wider font-bold cursor-pointer flex items-center gap-1"
                        >
                          Detil <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'library' && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className="text-2xl font-black text-slate-900">Pustaka Modul Belajar</h2>
              <p className="text-xs text-slate-500 mt-1">Materi interaktif yang terdaftar pada hak akses Anda</p>
            </div>
            {ownedEbooks.length === 0 ? (
              <div className="p-12 bg-white rounded-3xl border-2 border-dashed border-slate-300 text-center max-w-md mx-auto space-y-4 shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Modul Kosong</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Anda belum memiliki akses unduhan ke modul pembelajaran apa pun.</p>
                <button 
                  onClick={onNavigateToCatalog} 
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  Katalog Materi <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {ownedEbooks.map((eb) => {
                  const currentPage = readingProgressMap[eb.id] || 0;
                  const totalPages = eb.pages?.length || 1;
                  const percent = Math.round(((currentPage + 1) / totalPages) * 100);
                  return (
                    <motion.div 
                      key={eb.id} 
                      className="p-5 border-2 border-slate-200 bg-white rounded-2xl shadow-md hover:shadow-xl hover:border-blue-300 transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex gap-4">
                        <img src={eb.coverUrl} alt={eb.title} referrerPolicy="no-referrer" className="w-16 h-24 object-cover rounded-xl border-2 border-slate-100 shadow-md shrink-0" />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-extrabold text-blue-700 uppercase tracking-widest block">{eb.category}</span>
                            <h4 className="font-bold text-slate-800 text-xs truncate mt-1">{eb.title}</h4>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">Oleh: {eb.author}</p>
                          </div>
                          <div className="space-y-2 pt-3">
                            <div className="flex justify-between items-center text-[10px] text-slate-600">
                              <span className="font-medium">Hal {currentPage + 1}/{totalPages}</span>
                              <span className="font-mono font-black text-blue-600">{percent}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <motion.div 
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${percent}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              />
                            </div>
                            <button 
                              onClick={() => onReadEbook(eb)} 
                              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-bold rounded-xl transition-all cursor-pointer shadow-md hover:shadow-lg"
                            >
                              {currentPage > 0 ? 'Lanjutkan Belajar' : 'Mulai Pelajari'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className="text-2xl font-black text-slate-900">Riwayat Pembelanjaan</h2>
              <p className="text-xs text-slate-500 mt-1">Log audit transaksi resmi eduHub</p>
            </div>
            {userTransactions.length === 0 ? (
              <div className="p-12 bg-white rounded-3xl border-2 border-dashed border-slate-300 text-center">
                <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-xs text-slate-400 italic">Belum ada riwayat transaksi pembayaran.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userTransactions.map((tx) => (
                  <motion.div 
                    key={tx.id} 
                    className="p-5 border-2 border-slate-200 bg-white rounded-2xl shadow-md hover:shadow-lg hover:border-blue-200 transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-2 flex-1 min-w-0">
                        <strong className="text-slate-900 font-mono block text-sm font-bold">{tx.invoiceNumber}</strong>
                        <div className="flex flex-wrap gap-2 items-center text-[11px]">
                          <span className="px-2 py-1 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 font-bold rounded-lg text-[9px] uppercase border border-emerald-200">
                            {tx.status}
                          </span>
                          <span className="text-slate-500">{tx.date}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600 truncate max-w-md">
                            {tx.ebookIds.map(id => allEbooks.find(x => x.id === id)?.title).filter(Boolean).join(', ')}
                          </span>
                        </div>
                      </div>
                      <div className="text-left md:text-right border-t border-dashed border-slate-200 md:border-0 pt-3 md:pt-0 w-full md:w-auto shrink-0">
                        <div>
                          <strong className="text-slate-900 font-mono font-black text-base block">{formatIDR(tx.totalAmount)}</strong>
                          <span className="text-[9px] text-slate-400 block mt-1">{tx.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

      </main>
    </div>
  );
}