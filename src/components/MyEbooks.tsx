import { useState, useEffect } from 'react';
import { Ebook, User, Transaction } from '../types';
import { BookOpen, History, Award, Clock, ArrowRight } from 'lucide-react';

interface MyEbooksProps {
  allEbooks: Ebook[];
  currentUser: User | null;
  ownedBookIds: string[];
  transactions: Transaction[];
  onReadEbook: (ebook: Ebook) => void;
  onNavigateToCatalog: () => void;
}

export default function MyEbooks({
  allEbooks,
  currentUser,
  ownedBookIds,
  transactions,
  onReadEbook,
  onNavigateToCatalog
}: MyEbooksProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'history'>('library');
  const [readingProgressMap, setReadingProgressMap] = useState<Record<string, number>>({});
  
  const userId = currentUser ? currentUser.id : 'guest';

  // Memuat data progress membaca dari localStorage berdasarkan user aktif
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

  // Filter koleksi buku yang sudah dimiliki user
  const ownedEbooks = allEbooks.filter(eb => ownedBookIds.includes(eb.id));

  // Filter riwayat transaksi milik user aktif
  const userTransactions = transactions.filter(tx => tx.userId === userId);

  const formatIDR = (num: number) => {
    if (num === 0) return 'Rp 0';
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="page-transition max-w-6xl mx-auto px-4 py-8 font-sans antialiased text-slate-800 pb-16">
      
      {/* Tab Navigasi Menu */}
      <div className="flex border-b border-slate-200 mb-8 max-w-md bg-slate-50/60 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab('library')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'library' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pustaka Saya ({ownedEbooks.length})</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'history' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            <span>Riwayat Transaksi ({userTransactions.length})</span>
          </div>
        </button>
      </div>

      {/* RENDER TAB A: PUSTAKA BUKU SAYA */}
      {activeTab === 'library' && (
        <div>
          {ownedEbooks.length === 0 ? (
            <div className="p-10 bg-white rounded-3xl border border-dashed border-slate-200 text-center max-w-md mx-auto space-y-4 shadow-soft">
              <Award className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">Pustaka Buku Kosong</h3>
                <p className="text-slate-400 text-xs leading-relaxed px-4">
                  Anda belum memiliki modul atau literatur berbayar. Silakan kunjungi katalog untuk klaim materi edukasi unggulan kami.
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateToCatalog}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer inline-flex items-center gap-1.5 mx-auto"
              >
                <span>Jelajahi Katalog eduHub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {ownedEbooks.map((eb) => {
                const currentPage = readingProgressMap[eb.id] || 0;
                const totalPages = eb.pages.length;
                const percent = Math.min(100, Math.round(((currentPage + 1) / totalPages) * 100));

                return (
                  <div 
                    key={eb.id}
                    className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-200 transition-all flex gap-4 group"
                  >
                    {/* Cover Buku */}
                    <img
                      src={eb.coverUrl}
                      alt={eb.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-22 object-cover rounded-xl shrink-0 border border-slate-100 shadow-2xs transition-transform group-hover:scale-102"
                    />

                    {/* Meta Informasi & Progress */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest block">{eb.category}</span>
                        <h4 className="font-bold text-slate-800 text-xs md:text-sm truncate hover:text-blue-600 cursor-pointer" onClick={() => onReadEbook(eb)}>
                          {eb.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">Penulis: {eb.author}</p>
                      </div>

                      {/* Progress Tracker */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-blue-500" /> Hal. {currentPage + 1} / {totalPages}
                          </span>
                          <span className="font-mono text-blue-600">{percent}%</span>
                        </div>
                        {/* Progress Bar Container */}
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                        </div>

                        {/* CTA Launcher */}
                        <button
                          type="button"
                          onClick={() => onReadEbook(eb)}
                          className="w-full py-1.5 mt-1 bg-slate-50 hover:bg-blue-600 hover:text-white text-blue-600 border border-slate-100 hover:border-transparent rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center"
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

      {/* RENDER TAB B: LOG RIWAYAT TRANSAKSI */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 tracking-wider uppercase">Log Pembelian Ebook</h3>
          
          {userTransactions.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 max-w-sm mx-auto">
              <p className="text-xs text-slate-400 italic">Belum ada riwayat catatan transaksi pembayaran.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userTransactions.map((tx) => (
                <div 
                  key={tx.id}
                  className="p-5 bg-white border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs shadow-2xs"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <strong className="text-slate-800 font-mono text-xs block tracking-tight">{tx.invoiceNumber}</strong>
                    <div className="flex flex-wrap gap-2 items-center text-[11px]">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold rounded text-[9px] border border-emerald-100 uppercase tracking-wide">
                        {tx.status}
                      </span>
                      <span className="text-slate-400 font-medium">{tx.date}</span>
                    </div>
                    {/* Deskripsi list buku */}
                    <div className="pt-1 text-[11px] text-slate-500 leading-relaxed">
                      <span className="text-slate-400">Item Terproses:</span>{' '}
                      <span className="font-semibold text-slate-700">
                        {tx.ebookIds
                          .map(id => allEbooks.find(x => x.id === id)?.title || 'Ebook tidak ditemukan')
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Detil Finansial Pembayaran */}
                  <div className="text-right self-stretch md:self-auto flex md:flex-col justify-between items-center md:items-end border-t border-dashed border-slate-100 md:border-t-0 pt-3 md:pt-0">
                    <span className="text-slate-400 font-semibold block md:hidden">Total Pembayaran:</span>
                    <div className="space-y-0.5">
                      <span className="text-slate-400 text-[10px] block md:leading-none font-medium">Nominal Tagihan</span>
                      <strong className="text-sm font-black text-slate-900 font-mono tracking-tight block">
                        {formatIDR(tx.totalAmount)}
                      </strong>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 border border-slate-100 rounded mt-1.5 block">
                      Metode: {tx.paymentMethod}
                    </span>
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