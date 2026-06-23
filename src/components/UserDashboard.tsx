import React, { useState, useEffect } from 'react';
import { Ebook, Transaction, User } from '../types';
import { 
  BookOpen, Clock, Award, ArrowRight, Star, Heart, 
  History, LayoutDashboard, ChevronRight, LogOut, GraduationCap 
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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* ─── SIDEBAR COMPONENT (KIRI) ─── */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col shrink-0">
        {/* Identitas Aplikasi / Logo */}
        <div className="h-20 px-6 flex items-center gap-2.5 border-b border-slate-800">
          <div className="p-2 bg-blue-600 rounded-xl text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-white text-lg tracking-tight block">eduHub</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Layanan Pendidikan</span>
          </div>
        </div>

        {/* Info Ringkas Akun Pengguna */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/40">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Akun Terhubung</div>
          <div className="mt-2 font-bold text-white text-sm truncate">{currentUser?.fullName || 'Pembaca eduHub'}</div>
          <div className="text-[11px] text-slate-400 truncate mt-0.5">{currentUser?.email || 'student@eduhub.id'}</div>
        </div>

        {/* Menu Navigasi Sidebar */}
        <nav className="flex-1 p-4 space-y-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4" />
              <span>Ringkasan</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${activeTab === 'overview' ? 'block' : 'hidden'}`} />
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${activeTab === 'library' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4" />
              <span>Modul Saya</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'library' ? 'bg-white text-blue-600' : 'bg-slate-800 text-slate-400'}`}>
              {ownedEbooks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <div className="flex items-center gap-3">
              <History className="w-4 h-4" />
              <span>Riwayat</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'history' ? 'bg-white text-blue-600' : 'bg-slate-800 text-slate-400'}`}>
              {userTransactions.length}
            </span>
          </button>
        </nav>

        {/* Footer Sidebar / Kembali ke Katalog */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/20">
          <button 
            onClick={onNavigateToCatalog}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            <span>Jelajahi Katalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* ─── KONTEN UTAMA PANEL (KANAN) ─── */}
      <main className="flex-1 overflow-y-auto px-6 md:px-10 py-8 space-y-8">
        
        {/* HERO BANNER RINGKASAN */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-950 to-blue-950 p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-16 top-8 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="relative z-10 space-y-3">
            <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] text-slate-200/80">Dashboard eduHub</span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Halo, {currentUser?.fullName || 'Pembaca'}</h1>
            <p className="max-w-2xl text-xs text-slate-400 leading-relaxed">Ringkasan investasi pembelajaran dan pencapaian modul kompetensi Anda dalam satu panel kendali.</p>
          </div>

          {/* STATISTIK GRID */}
          <div className="relative z-10 mt-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="flex items-center gap-2 text-slate-300">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] uppercase tracking-wider font-semibold">Modul Dimiliki</span>
              </div>
              <div className="mt-2 text-2xl font-bold text-white">{ownedEbooks.length}</div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="flex items-center gap-2 text-slate-300">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] uppercase tracking-wider font-semibold">Total Transaksi</span>
              </div>
              <div className="mt-2 text-2xl font-bold text-white">{userTransactions.length}</div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="flex items-center gap-2 text-slate-300">
                <Heart className="w-4 h-4 text-rose-400" />
                <span className="text-[10px] uppercase tracking-wider font-semibold">Topik Terfavorit</span>
              </div>
              <div className="mt-2 text-lg font-bold text-white truncate">{favoriteCategory}</div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-sky-400" />
                <span className="text-[10px] uppercase tracking-wider font-semibold">Total Investasi</span>
              </div>
              <div className="mt-2 text-xl font-bold text-white font-mono">{formatIDR(totalSpent)}</div>
            </div>
          </div>
        </div>

        {/* VIEW KONTEN BERDASARKAN TAB SIDEBAR */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Box Rekomendasi */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Rekomendasi Belajar</h2>
                  <p className="text-xs text-slate-500">Materi penunjang kompetensi baru.</p>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Disarankan</span>
              </div>
              <div className="mt-4 space-y-3">
                {recommended.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-6 text-slate-500 text-xs text-center">Semua koleksi sudah Anda miliki, luar biasa!</div>
                ) : (
                  recommended.map((ebook) => (
                    <div key={ebook.id} className="group rounded-xl border border-slate-200/70 p-3 hover:border-blue-400 transition-all cursor-pointer bg-slate-50/50 flex items-center justify-between" onClick={onNavigateToCatalog}>
                      <div className="flex items-center gap-3">
                        <img src={ebook.coverUrl} alt={ebook.title} referrerPolicy="no-referrer" className="w-10 h-14 rounded-lg object-cover shadow-xs" />
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 text-xs line-clamp-1">{ebook.title}</h3>
                          <p className="text-[11px] text-slate-500 truncate">{ebook.author}</p>
                          <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-amber-600"><Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {ebook.rating}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Box Aktivitas Pembelian */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Aktivitas Invoice</h2>
                  <p className="text-xs text-slate-500">Log order pembayaran teranyar.</p>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Terbaru</span>
              </div>
              <div className="mt-4 space-y-3">
                {recentTx.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-6 text-slate-500 text-xs text-center">Belum ada riwayat transaksi akun.</div>
                ) : (
                  recentTx.map((tx) => (
                    <div key={tx.id} className="rounded-xl border border-slate-200/70 p-3 bg-slate-50/50 text-xs flex flex-col justify-between gap-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-slate-400">{tx.date}</p>
                          <h3 className="font-mono font-bold text-slate-900">{tx.invoiceNumber}</h3>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">{tx.status}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-200/60 pt-2 mt-1">
                        <span className="font-mono font-bold text-slate-800">{formatIDR(tx.totalAmount)}</span>
                        <button onClick={() => setActiveTab('history')} className="text-blue-600 hover:underline text-[10px] uppercase tracking-wider font-bold cursor-pointer">Detil</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'library' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Pustaka Modul Belajar</h2>
              <p className="text-xs text-slate-500">Materi interaktif yang terdaftar pada hak akses Anda.</p>
            </div>
            {ownedEbooks.length === 0 ? (
              <div className="p-10 bg-white rounded-3xl border border-dashed border-slate-200 text-center max-w-sm mx-auto space-y-3 shadow-xs">
                <Award className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">Modul Kosong</h3>
                <p className="text-slate-500 text-[11px] leading-relaxed">Anda belum memiliki akses unduhan ke modul pembelajaran apa pun.</p>
                <button onClick={onNavigateToCatalog} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer mx-auto flex items-center gap-1">
                  Katalog Materi <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {ownedEbooks.map((eb) => {
                  const currentPage = readingProgressMap[eb.id] || 0;
                  const totalPages = eb.pages?.length || 1;
                  const percent = Math.round(((currentPage + 1) / totalPages) * 100);
                  return (
                    <div key={eb.id} className="p-4 border border-slate-200 bg-white rounded-2xl shadow-3xs flex gap-3.5">
                      <img src={eb.coverUrl} alt={eb.title} referrerPolicy="no-referrer" className="w-14 h-20 object-cover rounded-lg border border-slate-100 shadow-3xs shrink-0" />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] font-extrabold text-blue-600 uppercase tracking-widest block">{eb.category}</span>
                          <h4 className="font-bold text-slate-800 text-xs truncate mt-0.5">{eb.title}</h4>
                          <p className="text-[11px] text-slate-400 truncate">Oleh: {eb.author}</p>
                        </div>
                        <div className="space-y-1.5 pt-2">
                          <div className="flex justify-between items-center text-[10px] text-slate-500">
                            <span>Hal {currentPage + 1}/{totalPages}</span>
                            <span className="font-mono font-bold">{percent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${percent}%` }} />
                          </div>
                          <button onClick={() => onReadEbook(eb)} className="w-full py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 text-[11px] font-bold rounded-lg transition-all cursor-pointer text-center block">
                            {currentPage > 0 ? 'Lanjutkan Belajar' : 'Mulai Pelajari'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Riwayat Pembelanjaan</h2>
              <p className="text-xs text-slate-500">Log audit transaksi resmi eduHub.</p>
            </div>
            {userTransactions.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-10 text-center rounded-2xl bg-white border border-dashed border-slate-200">Belum ada riwayat transaksi pembayaran.</p>
            ) : (
              <div className="space-y-2.5">
                {userTransactions.map((tx) => (
                  <div key={tx.id} className="p-4 border border-slate-200 bg-white rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs shadow-3xs">
                    <div className="space-y-1 flex-1 min-w-0">
                      <strong className="text-slate-800 font-mono block text-xs">{tx.invoiceNumber}</strong>
                      <div className="flex gap-2 items-center text-[11px]">
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[9px] uppercase">{tx.status}</span>
                        <span className="text-slate-400">{tx.date}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 truncate max-w-xs">{tx.ebookIds.map(id => allEbooks.find(x => x.id === id)?.title).filter(Boolean).join(', ')}</span>
                      </div>
                    </div>
                    <div className="text-left md:text-right border-t border-dashed border-slate-100 md:border-0 pt-2 md:pt-0 w-full md:w-auto shrink-0 flex md:flex-col justify-between items-center md:items-end">
                      <span className="text-slate-400 text-[10px] md:hidden">Tagihan:</span>
                      <div>
                        <strong className="text-slate-900 font-mono font-black text-sm">{formatIDR(tx.totalAmount)}</strong>
                        <span className="text-[9px] text-slate-400 block md:mt-0.5">{tx.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}