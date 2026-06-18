import { useState, useEffect } from 'react';
import { Ebook, User, Transaction } from '../types';
import { BookOpen, History, Award, Clock, ArrowRight, ListCheck } from 'lucide-react';

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

  // Load current page stats
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

  // Filter books owned by this user
  const ownedEbooks = allEbooks.filter(eb => ownedBookIds.includes(eb.id));

  // Filter transaction records by this user
  const userTransactions = transactions.filter(tx => tx.userId === userId);

  const formatIDR = (num: number) => {
    if (num === 0) return 'Rp 0';
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-100 mb-8 max-w-sm">
        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 pb-3 text-xs uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'library' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Pustaka Buku Saya ({ownedEbooks.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 pb-3 text-xs uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <History className="w-4 h-4" />
            <span>Riwayat Pembelian ({userTransactions.length})</span>
          </div>
        </button>
      </div>

      {/* RENDER CASE A: OWNED LIBRARY PORTAL */}
      {activeTab === 'library' && (
        <div>
          {ownedEbooks.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border border-dashed border-slate-200 text-center max-w-md mx-auto space-y-4">
              <Award className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">Pustaka Buku Kosong</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Anda belum membeli atau mengklaim ebook berbayar apa pun. Jelajahi katalog buku untuk mengunduh buku gratis dan unggulan.
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
                const totalPages = eb.pages.length;
                const percent = Math.round(((currentPage + 1) / totalPages) * 100);

                return (
                  <div 
                    key={eb.id}
                    className="p-5 bg-white border border-slate-100 rounded-2xl shadow-2xs hover:shadow-xs hover:border-slate-200 transition-all flex gap-4 my-library-card"
                  >
                    {/* Book Cover element */}
                    <img
                      src={eb.coverUrl}
                      alt={eb.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-24 object-cover rounded-lg shrink-0 border border-slate-100"
                    />

                    {/* Meta progress section */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{eb.category}</span>
                        <h4 className="font-bold text-slate-800 text-sm truncate">{eb.title}</h4>
                        <p className="text-xs text-slate-400">Penulis: {eb.author}</p>
                      </div>

                      {/* Micro progress graph bar */}
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

                        {/* Direct launcher CTA */}
                        <button
                          onClick={() => onReadEbook(eb)}
                          className="w-full py-2.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 rounded-xl text-xs font-bold transition-all cursor-pointer text-center block mt-2"
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

      {/* RENDER CASE B: PURCHASE TRANSACTION RECORDS LOG */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Riwayat Pembelanjaan Ebook</h3>
          
          {userTransactions.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-6 text-center">Belum ada riwayat transaksi pembayaran.</p>
          ) : (
            <div className="space-y-3">
              {userTransactions.map((tx) => (
                <div 
                  key={tx.id}
                  className="p-5 bg-white border border-slate-150 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs shadow-2xs"
                >
                  <div className="space-y-1">
                    <strong className="text-slate-800 font-mono block mb-1">{tx.invoiceNumber}</strong>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[10px]">
                        {tx.status.toUpperCase()}
                      </span>
                      <span className="text-slate-400">{tx.date}</span>
                    </div>
                    {/* List books included in this purchase transaction */}
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
