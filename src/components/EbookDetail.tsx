import React, { useState, useMemo } from 'react';
import { Ebook, User, Review } from '../types';
import { Star, ArrowLeft, ShoppingCart, BookOpen, BookMarked, MessageSquare, Calendar, User as UserIcon } from 'lucide-react';

interface EbookDetailProps {
  ebook: Ebook;
  allEbooks: Ebook[];
  currentUser: User | null;
  ownedBookIds: string[];
  cartBookIds: string[];
  reviews: Review[];
  onBack: () => void;
  onSelectEbook: (ebook: Ebook) => void;
  onAddToCart: (ebook: Ebook) => void;
  onReadEbook: (ebook: Ebook) => void;
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
  onDirectBuy: (ebook: Ebook) => void;
}

export default function EbookDetail({
  ebook,
  allEbooks,
  currentUser,
  ownedBookIds,
  cartBookIds,
  reviews,
  onBack,
  onSelectEbook,
  onAddToCart,
  onReadEbook,
  onAddReview,
  onDirectBuy
}: EbookDetailProps) {
  const isOwned = ownedBookIds.includes(ebook.id);
  const isInCart = cartBookIds.includes(ebook.id);

  // Filter ulasan khusus untuk ebook ini
  const bookReviews = useMemo(() => {
    return reviews.filter(rev => rev.ebookId === ebook.id);
  }, [reviews, ebook.id]);

  // Rekomendasi kategori yang sama (maksimal 3, kecualikan diri sendiri)
  const relatedEbooks = useMemo(() => {
    return allEbooks
      .filter(eb => eb.category === ebook.category && eb.id !== ebook.id)
      .slice(0, 3);
  }, [allEbooks, ebook.category, ebook.id]);

  // Form input states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Anda harus masuk terlebih dahulu untuk mengirimkan ulasan.');
      return;
    }
    if (!comment.trim()) return;

    onAddReview({
      ebookId: ebook.id,
      userId: currentUser.id,
      username: currentUser.fullName || currentUser.username,
      rating: rating,
      comment: comment.trim()
    });

    setComment('');
    setRating(5);
    setReviewSuccess('Terima kasih! Ulasan Anda telah berhasil diterbitkan.');
    setTimeout(() => setReviewSuccess(''), 4000);
  };

  const formatIDR = (num: number) => {
    if (num === 0) return 'GRATIS';
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="page-transition max-w-6xl mx-auto px-4 py-8 font-sans antialiased text-slate-800 pb-16">
      
      {/* Back Button Navigation */}
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 text-xs font-bold transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> 
        <span>Kembali ke Katalog</span>
      </button>

      {/* Main Two-Column Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-lift mb-8">
        
        {/* Column 1: Cover Image Area */}
        <div className="lg:col-span-1 flex flex-col items-center">
          <div className="relative aspect-[3/4] w-full max-w-[260px] bg-slate-100 rounded-2xl overflow-hidden shadow-md border border-slate-100 group">
            <img
              src={ebook.coverUrl}
              alt={ebook.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 mt-4 tracking-widest uppercase">
            EduHub Premium Literature
          </span>
        </div>

        {/* Column 2: Ebook Info Details Area */}
        <div className="lg:col-span-2 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 font-extrabold rounded-lg text-[10px] uppercase tracking-wider border border-blue-100">
                {ebook.category}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-50 py-1 px-2.5 rounded-lg border border-slate-200">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{ebook.rating.toFixed(1)} <span className="text-slate-400 font-normal">/ 5 ({bookReviews.length} Ulasan)</span></span>
              </div>
            </div>

            {/* Title & Author */}
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 leading-snug">
                {ebook.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" /> Ditulis oleh <span className="font-semibold text-slate-700">{ebook.author}</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Rilis: {ebook.dateAdded}
                </span>
              </div>
            </div>

            {/* Description / Synopsis */}
            <div className="pt-2 space-y-1.5">
              <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest">Sinopsis Buku</h4>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed text-justify">
                {ebook.description}
              </p>
            </div>
          </div>

          {/* Pricing & Call to Actions Panel */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">Harga Akses Penuh</span>
              <span className="text-2xl font-black text-slate-900 tracking-tight">{formatIDR(ebook.price)}</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {isOwned ? (
                <button
                  type="button"
                  onClick={() => onReadEbook(ebook)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" /> Baca Sekarang
                </button>
              ) : ebook.price === 0 ? (
                <button
                  type="button"
                  onClick={() => onDirectBuy(ebook)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" /> Ambil Gratis
                </button>
              ) : (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => onAddToCart(ebook)}
                    disabled={isInCart}
                    className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border active:scale-95 cursor-pointer ${
                      isInCart 
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{isInCart ? 'Di Keranjang' : 'Keranjang'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDirectBuy(ebook)}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    Beli Sekarang
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Ebook Reader Demo Preview Box */}
      <div className="bg-[#fcfbf7] border border-[#ece7d6] rounded-2xl p-6 shadow-xs mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/40 rounded-full filter blur-xl -mr-12 -mt-12 pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-3.5">
          <BookMarked className="w-4 h-4 text-amber-700" />
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Pratinjau Terbatas (Preview)</h3>
        </div>

        {/* Paper Container visual style */}
        <div className="p-5 bg-white border border-[#dfdabf] rounded-xl text-slate-700 text-xs md:text-sm font-serif leading-relaxed line-clamp-6 select-none relative shadow-2xs">
          {ebook.pages && ebook.pages[0] ? ebook.pages[0].substring(0, 480) : "Sedang memuat isi pratinjau..."}...
          
          {/* Faded Gradient Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent flex flex-col items-center justify-end pb-3 pointer-events-none">
            <span className="text-[9px] font-black text-amber-800 bg-amber-50 px-3 py-1 border border-amber-200 rounded-full tracking-wider uppercase shadow-2xs pointer-events-auto">
              AKHIR DARI PRATINJAU BUKU
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mt-3 text-center">
          Beli Ebook Premium ini untuk membuka seluruh halaman bab, fitur bookmark penjelajah, penyesuaian ukuran font, dan pelacakan membaca otomatis.
        </p>
      </div>

      {/* Bottom Section: Customer Reviews & Related Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Reviews Column (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4 shrink-0">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Diskusi & Ulasan Mahasiswa ({bookReviews.length})</h3>
          </div>

          {/* New Review Form */}
          {currentUser ? (
            <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5 shrink-0">
              <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Berikan Penilaian Kompetensi</h4>
              {reviewSuccess && (
                <p className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-100 font-medium">
                  {reviewSuccess}
                </p>
              )}
              
              <div className="flex gap-3 items-center">
                <span className="text-xs font-semibold text-slate-500">Rating Kualitas:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setRating(num)}
                      className="cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star className={`w-4 h-4 ${num <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Berikan ulasan membangun mengenai penyampaian materi kurikulum atau manfaat praktis buku ini..."
                  rows={3}
                  className="w-full bg-white outline-none border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-xs text-slate-800 transition-all placeholder:text-slate-400 focus:ring-1 focus:ring-blue-500/10"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  Kirim Ulasan
                </button>
              </div>
            </form>
          ) : (
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800 mb-6 text-center font-medium shrink-0">
              Silakan masuk ke akun Anda terlebih dahulu untuk memberikan penilaian ulasan.
            </div>
          )}

          {/* List Existing Review Nodes */}
          <div className="flex-1 overflow-y-auto max-h-[360px] pr-2 space-y-3 custom-scrollbar">
            {bookReviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-8">
                Belum ada review untuk materi ini. Jadilah yang pertama memberikan ulasan!
              </p>
            ) : (
              bookReviews.map((rev) => (
                <div key={rev.id} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block leading-tight">{rev.username}</span>
                      <span className="text-[9px] text-slate-400">{rev.date}</span>
                    </div>
                    {/* Stars display */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className={`w-3 h-3 ${idx < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed text-justify">
                    "{rev.comment}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Recommendations Column (1 Col) */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs flex flex-col justify-start">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4 uppercase tracking-wide">
            Rekomendasi Terkait
          </h3>
          
          {relatedEbooks.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-8">Tidak ada literatur sejenis lainnya.</p>
          ) : (
            <div className="space-y-3">
              {relatedEbooks.map((eb) => (
                <div 
                  key={eb.id}
                  onClick={() => {
                    // Kembali ke atas dengan smooth scroll
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    // Memicu callback seleksi buku baru lewat perantara handler utama
                    onSelectEbook(eb);
                  }}
                  className="flex gap-3 p-2 rounded-xl border border-transparent hover:border-slate-150 hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <img
                    src={eb.coverUrl}
                    alt={eb.title}
                    referrerPolicy="no-referrer"
                    className="w-11 h-14 object-cover rounded-lg shrink-0 shadow-xs"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                      {eb.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate">{eb.author}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-bold text-slate-500">{eb.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}