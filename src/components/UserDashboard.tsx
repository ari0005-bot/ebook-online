import React, { useState, useEffect } from 'react';
import { Ebook, Transaction, User } from '../types';
import { BookOpen, Wallet, Clock, Award, ArrowRight, Star, Heart, History, LayoutDashboard } from 'lucide-react';

interface UserDashboardProps {
  currentUser: User | null;
  allEbooks: Ebook[];
  transactions: Transaction[];
  ownedBookIds: string[];
  onNavigateToCatalog: () => void;
  onReadEbook: (ebook: Ebook) => void;
  onTopUp: (amount: number) => void;
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
  onReadEbook,
  onTopUp
}: UserDashboardProps) {
  // State untuk mengontrol tab internal dashboard
  const [activeTab, setActiveTab] = useState<'overview' | 'library' | 'history'>('overview');
  const [readingProgressMap, setReadingProgressMap] = useState<Record<string, number>>({});
  
  const userId = currentUser ? currentUser.id : 'guest';

  // Load status progress membaca dari localStorage
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

  // Filter buku dan transaksi milik user saat ini
  const ownedEbooks = allEbooks.filter((ebook) => ownedBookIds.includes(ebook.id));
  const userTransactions = currentUser
    ? transactions.filter((tx) => tx.userId === currentUser.id)
    : [];
  
  // Kalkulasi statistik data pendukung
  const totalSpent = userTransactions.reduce((sum, tx) => sum + tx.totalAmount, 0);

  const categoryCounts = ownedEbooks.reduce<Record<string, number>>((acc, ebook) => {
    acc[ebook.category] = (acc[ebook.category] || 0) + 1;
    return acc;
  }, {});

  const favoriteCategory = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category)[0] || 'Belum ada koleksi';

  const recommended = allEbooks
    .filter((ebook) => !ownedBookIds.includes(ebook.id))
    .slice(0, 3);

  const recentTx = userTransactions.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      
      {/* HEADER HERO BANNER (KARTU UTAMA) */}
      <div className="grid lg:grid-cols-[1.7fr_1fr] gap-6">
        <div className="rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white shadow-[0_35px_90px_rgba(15,23,42,0.2)] overflow-hidden relative">
          <div className="absolute -right-16 top-8 h-60 w-60 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute -left-16 bottom-10 h-60 w-60 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative z-10 space-y-5">
            <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-slate-200/80">Dashboard Pengguna</span>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">Halo, {currentUser?.fullName || 'Pembaca'}</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-300/90 leading-7">Ringkasan akun dan akses cepat ke ebook Anda. Semua koleksi, saldo, dan aktivitas terbaru dikemas dengan tampilan yang elegan dan modern.</p>
              </div>
              <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-xl shrink-0">
                <div className="text-xs uppercase tracking-[0.3em] text-slate-200/80">Saldo Virtual</div>
                <div className="mt-4 text-4xl font-black font-mono text-white">{currentUser ? formatIDR(currentUser.balance) : 'Rp 0'}</div>
                <button
                  type="button"
                  onClick={() => onTopUp(100000)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 cursor-pointer"
                >
                  <Wallet className="w-4 h-4" /> Isi Rp100k
                </button>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[28px] bg-white/8 border border-white/10 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div className="flex items-center gap-3 text-slate-200">
                <BookOpen className="w-5 h-5 text-cyan-300" />
                <span className="text-[11px] uppercase tracking-[0.28em] font-semibold">Ebook Dimiliki</span>
              </div>
              <div className="mt-4 text-3xl font-bold text-white">{ownedEbooks.length}</div>
            </div>
            <div className="rounded-[28px] bg-white/8 border border-white/10 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div className="flex items-center gap-3 text-slate-200">
                <Award className="w-5 h-5 text-amber-300" />
                <span className="text-[11px] uppercase tracking-[0.28em] font-semibold">Transaksi</span>
              </div>
              <div className="mt-4 text-3xl font-bold text-white">{userTransactions.length}</div>
            </div>
            <div className="rounded-[28px] bg-white/8 border border-white/10 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div className="flex items-center gap-3 text-slate-200">
                <Heart className="w-5 h-5 text-rose-300" />
                <span className="text-[11px] uppercase tracking-[0.28em] font-semibold">Kategori Favorit</span>
              </div>
              <div className="mt-4 text-3xl font-bold text-white truncate">{favoriteCategory}</div>
            </div>
            <div className="rounded-[28px] bg-white/8 border border-white/10 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div className="flex items-center gap-3 text-slate-200">
                <Clock className="w-5 h-5 text-sky-300" />
                <span className="text-[11px] uppercase tracking-[0.28em] font-semibold">Total Belanja</span>
              </div>
              <div className="mt-4 text-3xl font-bold text-white">{formatIDR(totalSpent)}</div>
            </div>
          </div>
        </div>

        {/* AKSI CEPAT QUICK LINKS */}
        <div className="glass-panel rounded-[32px] p-6 border border-slate-100 shadow-lift flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Aksi Cepat</h2>
                <p className="text-sm text-slate-500">Langsung ke fitur penting.</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-2 text-[11px] uppercase tracking-[0.25em] text-yellow-700 font-bold">
                <Star className="w-4 h-4" /> Fitur
              </span>
            </div>

            <div className="mt-7 grid gap-3">
              <button
                onClick={() => { setActiveTab('library'); }}
                className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-left text-slate-900 shadow-3xs transition hover:border-blue-500 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-[0.24em] opacity-60 block">Buka Koleksi</span>
                  <div className="text-sm font-bold mt-0.5">Lihat Pustaka Buku Saya</div>
                </div>
                <BookOpen className="w-5 h-5 text-blue-600" />
              </button>

              <button
                onClick={() => { setActiveTab('history'); }}
                className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-left text-slate-900 shadow-3xs transition hover:border-blue-500 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-[0.24em] opacity-60 block">Nota & Billing</span>
                  <div className="text-sm font-bold mt-0.5">Riwayat Pembelian</div>
                </div>
                <History className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          </div>

          <button
            onClick={onNavigateToCatalog}
            className="w-full mt-4 rounded-[20px] bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3.5 text-center text-white font-bold text-sm shadow-md shadow-blue-500/10 transition hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Jelajahi Katalog Toko</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SUB NAVIGASI INTERNAL TAB (PENGGANTI MENU SEBELUMNYA) */}
      <div className="flex border-b border-slate-200 max-w-lg mx-auto md:mx-0">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 pb-4 text-xs uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <LayoutDashboard className="w-4 h-4" />
            <span>Ringkasan</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 pb-4 text-xs uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'library' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Buku Saya ({ownedEbooks.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 pb-4 text-xs uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <History className="w-4 h-4" />
            <span>Riwayat ({userTransactions.length})</span>
          </div>
        </button>
      </div>

      {/* KONTEN UTAMA BERDASARKAN TAB YANG AKTIF */}
      
      {/* 1. KONTEN TAB: OVERVIEW (RINGKASAN REKOMENDASI DAN AKTIVITAS) */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Box Rekomendasi */}
          <div className="glass-panel rounded-[32px] p-6 border border-slate-100 shadow-lift">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Rekomendasi untuk Anda</h2>
                <p className="text-sm text-slate-500">Jelajahi buku yang belum Anda miliki.</p>
              </div>
              <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Disarankan</span>
            </div>

            <div className="mt-5 space-y-4">
              {recommended.length === 0 ? (
                <div className="rounded-[28px] bg-slate-50 p-6 text-slate-500 text-sm text-center">Semua koleksi sudah menjadi milik Anda, selamat!</div>
              ) : (
                recommended.map((ebook) => (
                  <div key={ebook.id} className="group rounded-[24px] border border-slate-200 p-4 hover:border-blue-300 transition-all cursor-pointer bg-white/95 shadow-3xs" onClick={() => onNavigateToCatalog()}>
                    <div className="flex items-center gap-4">
                      <img src={ebook.coverUrl} alt={ebook.title} referrerPolicy="no-referrer" className="w-14 h-20 rounded-xl object-cover shadow-xs" />
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 text-sm line-clamp-1">{ebook.title}</h3>
                        <p className="text-xs text-slate-500 truncate">{ebook.author}</p>
                        <div className="mt-2 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-400"><Star className="w-3.5 h-3.5 text-amber-500" /> {ebook.rating} / 5</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Box Aktivitas Terakhir */}
          <div className="glass-panel rounded-[32px] p-6 border border-slate-100 shadow-lift">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Aktivitas Terakhir</h2>
                <p className="text-sm text-slate-500">Ringkasan pembelian terbaru Anda.</p>
              </div>
              <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Terbaru</span>
            </div>

            <div className="mt-5 space-y-4">
              {recentTx.length === 0 ? (
                <div className="rounded-[28px] bg-slate-50 p-6 text-slate-500 text-sm text-center">Belum ada riwayat pembelian. Mulai jelajahi katalog sekarang.</div>
              ) : (
                recentTx.map((tx) => (
                  <div key={tx.id} className="rounded-[24px] border border-slate-200 bg-white/95 p-4 shadow-3xs text-xs">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">{tx.date}</p>
                        <h3 className="text-sm font-semibold text-slate-900">{tx.invoiceNumber}</h3>
                      </div>
                      <span className="w-fit rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">{tx.status}</span>
                    </div>
                    <p className="mt-2 text-slate-500 line-clamp-1">Buku: {tx.ebookIds.map((id) => allEbooks.find((ebook) => ebook.id === id)?.title).filter(Boolean).join(', ')}</p>
                    <div className="mt-3 flex items-center justify-between font-semibold text-slate-900 pt-2 border-t border-slate-100">
                      <span>{formatIDR(tx.totalAmount)}</span>
                      <button onClick={() => setActiveTab('history')} type="button" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-[10px] uppercase tracking-[0.24em] cursor-pointer">
                        Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. KONTEN TAB: PUSTAKA BUKU SAYA */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Pustaka Buku Saya</h2>
              <p className="text-sm text-slate-500">Daftar seluruh e-book yang sudah Anda miliki.</p>
            </div>
          </div>

          {ownedEbooks.length === 0 ? (
            <div className="p-12 glass-panel rounded-3xl border-dashed border-slate-200 text-center max-w-md mx-auto space-y-4 shadow-lift">
              <Award className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">Pustaka Buku Kosong</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Anda belum membeli atau mengklaim ebook apa pun. Jelajahi katalog buku untuk mengunduh buku gratis dan unggulan.
              </p>
              <button
                onClick={onNavigateToCatalog}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer flex items-center gap-1.5 mx-auto"
              >
                <span>Pergi ke Katalog Ebook</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownedEbooks.map((eb) => {
                const currentPage = readingProgressMap[eb.id] || 0;
                const totalPages = eb.pages?.length || 1;
                const percent = Math.round(((currentPage + 1) / totalPages) * 100);

                return (
                  <div 
                    key={eb.id}
                    className="p-5 border border-slate-100 bg-white rounded-2xl transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-md flex gap-4"
                  >
                    <img
                      src={eb.coverUrl}
                      alt={eb.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-24 object-cover rounded-lg shrink-0 border border-slate-100 shadow-3xs"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">{eb.category}</span>
                        <h4 className="font-bold text-slate-800 text-sm truncate">{eb.title}</h4>
                        <p className="text-xs text-slate-400">Penulis: {eb.author}</p>
                      </div>

                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-blue-500" /> Halaman {currentPage + 1} / {totalPages}
                          </span>
                          <span className="font-mono">{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${percent}%` }} />
                        </div>

                        <button
                          onClick={() => onReadEbook(eb)}
                          className="w-full py-2 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 rounded-xl text-xs font-bold transition-all cursor-pointer text-center block mt-1"
                        >
                          {currentPage > 0 ? 'Lanjutkan Membaca' : 'Mulai Membaca'}
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

      {/* 3. KONTEN TAB: RIWAYAT TRANSAKSI LENGKAP */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Riwayat Pembelanjaan</h2>
            <p className="text-sm text-slate-500">Log manifes transaksi finansial akun Anda.</p>
          </div>
          
          {userTransactions.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-12 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">Belum ada riwayat transaksi pembayaran.</p>
          ) : (
            <div className="space-y-3">
              {userTransactions.map((tx) => (
                <div 
                  key={tx.id}
                  className="p-5 border border-slate-100 bg-white rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs shadow-3xs"
                >
                  <div className="space-y-1">
                    <strong className="text-slate-800 font-mono block mb-1">{tx.invoiceNumber}</strong>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[10px]">
                        {tx.status.toUpperCase()}
                      </span>
                      <span className="text-slate-400">{tx.date}</span>
                    </div>
                    <div className="pt-2 text-[11px] text-slate-500">
                      Buku diproses:{' '}
                      <span className="font-semibold text-slate-700">
                        {tx.ebookIds.map(id => allEbooks.find(x => x.id === id)?.title).filter(Boolean).join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="text-right self-stretch md:self-auto flex md:flex-col justify-between items-center md:items-end border-t border-dashed border-slate-100 md:border-t-0 pt-3 md:pt-0">
                    <span className="text-slate-400 font-medium block md:hidden">Total Bayar:</span>
                    <div>
                      <span className="text-slate-400 text-[10px] block md:leading-none">Nominal Tagihan</span>
                      <strong className="text-sm font-black text-slate-800 font-mono mt-0.5 block">{formatIDR(tx.totalAmount)}</strong>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">Metode: {tx.paymentMethod}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}