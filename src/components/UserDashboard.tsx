import React from 'react';
import { Ebook, Transaction, User } from '../types';
import { BookOpen, Wallet, Clock, Award, ArrowRight, Star, Heart } from 'lucide-react';

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
  const ownedEbooks = allEbooks.filter((ebook) => ownedBookIds.includes(ebook.id));
  const userTransactions = currentUser
    ? transactions.filter((tx) => tx.userId === currentUser.id)
    : [];
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
              <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-xl">
                <div className="text-xs uppercase tracking-[0.3em] text-slate-200/80">Saldo Virtual</div>
                <div className="mt-4 text-4xl font-black font-mono text-white">{currentUser ? formatIDR(currentUser.balance) : 'Rp 0'}</div>
                <button
                  type="button"
                  onClick={() => onTopUp(100000)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
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
              <div className="mt-4 text-3xl font-bold text-white">{favoriteCategory}</div>
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

        <div className="glass-panel rounded-[32px] p-6 border border-white/15 shadow-lift">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Aksi Cepat</h2>
              <p className="text-sm text-slate-500">Langsung ke halaman penting dengan satu klik.</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-2 text-[11px] uppercase tracking-[0.25em] text-yellow-700 font-bold">
              <Star className="w-4 h-4" /> Favorit
            </span>
          </div>

          <div className="mt-7 grid gap-4">
            <button
              onClick={onNavigateToCatalog}
              className="w-full rounded-[28px] bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4 text-left text-white shadow-lg shadow-blue-500/10 transition hover:scale-[1.01]"
            >
              <span className="text-xs uppercase tracking-[0.24em] opacity-80">Telusuri Katalog</span>
              <div className="mt-3 text-lg font-bold">Cari ebook baru & rekomendasi terpilih</div>
            </button>

            {ownedEbooks.length > 0 && (
              <button
                onClick={() => onReadEbook(ownedEbooks[0])}
                className="w-full rounded-[28px] border border-slate-200 bg-white px-5 py-4 text-left text-slate-900 shadow-sm transition hover:border-blue-300"
              >
                <span className="text-xs uppercase tracking-[0.24em] opacity-80">Lanjutkan Bacaan</span>
                <div className="mt-3 text-lg font-bold">Buka {ownedEbooks[0].title}</div>
              </button>
            )}

            <button
              onClick={() => onTopUp(50000)}
              className="w-full rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-4 text-left text-slate-900 shadow-sm transition hover:border-yellow-300"
            >
              <span className="text-xs uppercase tracking-[0.24em] opacity-80">Top Up Cepat</span>
              <div className="mt-3 text-lg font-bold">Tambah saldo Rp50k untuk transaksi</div>
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-[32px] p-6 border border-white/15 shadow-lift">
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
                <div key={ebook.id} className="group rounded-[28px] border border-slate-200 p-4 hover:border-blue-300 transition-all cursor-pointer bg-white/95 shadow-sm" onClick={() => onReadEbook(ebook)}>
                  <div className="flex items-center gap-4">
                    <img src={ebook.coverUrl} alt={ebook.title} referrerPolicy="no-referrer" className="w-16 h-24 rounded-3xl object-cover shadow-sm" />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 line-clamp-2">{ebook.title}</h3>
                      <p className="text-sm text-slate-500 truncate">{ebook.author}</p>
                      <div className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400"><Star className="w-3.5 h-3.5 text-amber-500" /> {ebook.rating} / 5</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-panel rounded-[32px] p-6 border border-white/15 shadow-lift">
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
                <div key={tx.id} className="rounded-[28px] border border-slate-200 bg-white/95 p-5 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{tx.date}</p>
                      <h3 className="text-base font-semibold text-slate-900">{tx.invoiceNumber}</h3>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">{tx.status}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">Buku: {tx.ebookIds.map((id) => allEbooks.find((ebook) => ebook.id === id)?.title).filter(Boolean).join(', ')}</p>
                  <div className="mt-4 flex items-center justify-between text-sm font-semibold text-slate-900">
                    <span>{formatIDR(tx.totalAmount)}</span>
                    <button type="button" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-xs uppercase tracking-[0.24em]">
                      Lihat Detail <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
