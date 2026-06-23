import React, { useState, useMemo } from 'react';
import { Ebook, User, Review } from '../types';
import { Star, ArrowLeft, ShoppingCart, BookOpen, Clock, Heart, BookMarked, MessageSquare } from 'lucide-react';

interface EbookDetailProps {
  ebook: Ebook;
  allEbooks: Ebook[];
  currentUser: User | null;
  ownedBookIds: string[];
  cartBookIds: string[];
  reviews: Review[];
  onBack: () => void;
  onAddToCart: (ebook: Ebook) => void;
  onReadEbook: (ebook: Ebook) => void;
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
}

export default function EbookDetail({
  ebook,
  allEbooks,
  currentUser,
  ownedBookIds,
  cartBookIds,
  reviews,
  onBack,
  onAddToCart,
  onReadEbook,
  onAddReview
}: EbookDetailProps) {
  const isOwned = ownedBookIds.includes(ebook.id);
  const isInCart = cartBookIds.includes(ebook.id);

  // Filter book reviews
  const bookReviews = useMemo(() => {
    return reviews.filter(rev => rev.ebookId === ebook.id);
  }, [reviews, ebook.id]);

  // Handle category recommendations (same category, omit self, limit 3)
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button navigation hook */}
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
      </button>

      {/* Main Two-Column Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 glass-panel p-6 md:p-8 mb-10">
        
        {/* Cover image area */}
        <div className="lg:col-span-1 flex flex-col items-center">
          <div className="relative aspect-[3/4] w-full max-w-[280px] bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-100">
            <img
              src={ebook.coverUrl}
              alt={ebook.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 mt-4 tracking-wider uppercase">Cover Resolusi Tinggi</span>
        </div>

        {/* Ebook Info Details area */}
        <div className="lg:col-span-2 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category and Rating badges row */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 font-bold rounded-lg text-xs uppercase tracking-wide">
                {ebook.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 py-1 px-2.5 rounded-lg border border-slate-150">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{ebook.rating.toFixed(1)} / 5 ({bookReviews.length} Ulasan)</span>
              </div>
            </div>

            {/* Title & Author */}
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight glow-text">
              {ebook.title}
            </h2>
            <p className="text-sm text-slate-500">
              Ditulis oleh <span className="font-semibold text-slate-800">{ebook.author}</span> • Dirilis pada {ebook.dateAdded}
            </p>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Sinopsis Buku</h4>
              <p className="text-slate-600 text-sm leading-relaxed text-justify">
                {ebook.description}
              </p>
            </div>
          </div>

          {/* Pricing & Call to Actions */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-xs text-slate-400 block font-semibold leading-none mb-1">Harga Pembelian</span>
              <span className="text-2xl font-black text-slate-800">{formatIDR(ebook.price)}</span>
            </div>

            {/* Actions details buttons */}
            <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
              {isOwned ? (
                <button
                  onClick={() => onReadEbook(ebook)}
                  className="button-primary w-full md:w-auto px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" /> Baca Sekarang
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onAddToCart(ebook)}
                    disabled={isInCart}
                    className={`w-full md:w-auto px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer ${isInCart ? 'bg-slate-200 text-slate-500' : 'button-primary'}`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{isInCart ? 'Sudah Di Keranjang' : 'Tambah Ke Keranjang'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Ebook Reader Demo Preview Box */}
      <div className="bg-[#fcfbf7] border border-[#ece7d6] rounded-3xl p-6 md:p-8 shadow-xs mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full filter blur-xl -mr-12 -mt-12 -z-10" />
        
        <div className="flex items-center gap-2 mb-4">
          <BookMarked className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-slate-800">Preview Buku Sebagian</h3>
        </div>

        {/* Paper Container visual style */}
        <div className="p-6 bg-white border border-[#dfdabf] rounded-2xl text-slate-600 text-xs md:text-sm font-serif leading-relaxed line-clamp-6 select-none relative shadow-2xs">
          {ebook.pages[0]?.substring(0, 480) || "Sedang memuat isi preview..."}
          
          {/* Cover Screen */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent flex flex-col items-center justify-end pb-3">
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 border border-amber-200 rounded-full tracking-wider uppercase mb-1 shadow-2xs">
              BAGIAN DESKRIPSI AWAL PREVIEW TERBATAS
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-3 text-center">
          Dapatkan akses penuh membaca seluruh bab isi buku beserta fitur bookmark penjelajah, penyesuaian font, dan progress bar otomatis pasca pembelian ebook.
        </p>
      </div>

      {/* Bottom Section: Customer Reviews & Related Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* REVIEWS & ULASAN COLUMN (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold text-slate-900">Ulasan Pengguna ({bookReviews.length})</h3>
          </div>

          {/* New Review Post Form */}
          {currentUser ? (
            <form onSubmit={handleReviewSubmit} className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Berikan Penilaian Anda</h4>
              {reviewSuccess && <p className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-100">{reviewSuccess}</p>}
              
              <div className="flex gap-4 items-center">
                <span className="text-xs font-medium text-slate-500">Rating Bintang:</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setRating(num)}
                      className="cursor-pointer transition-colors hover:scale-110"
                    >
                      <Star className={`w-5 h-5 ${num <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ketik ulasan Anda mengenai bahasa penyampaian atau manfaat buku ini..."
                  rows={3}
                  className="w-full bg-white outline-none border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-xs md:text-sm text-slate-800"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
                >
                  Kirim Ulasan Saya
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-800 mb-6 text-center">
              Silakan login terlebih dahulu untuk memberikan ulasan pada buku ini.
            </div>
          )}

          {/* List existing comment nodes */}
          {bookReviews.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-6">Belum ada review untuk ebook ini. Jadilah yang pertama memberikan ulasan!</p>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {bookReviews.map((rev) => (
                <div key={rev.id} className="p-4 border-b border-slate-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-slate-800">{rev.username}</span>
                      <span className="text-[10px] text-slate-400 block">{rev.date}</span>
                    </div>
                    {/* Stars mini display */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className={`w-3 h-3 ${idx < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-650 leading-relaxed text-justify">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RELATED RECOMMENDATIONS PANEL (1 Col) */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs flex flex-col justify-start">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-5">Rekomendasi Terkait</h3>
          
          {relatedEbooks.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-8">Tidak ada buku sejenis lainnya.</p>
          ) : (
            <div className="space-y-4">
              {relatedEbooks.map((eb) => (
                <div 
                  key={eb.id}
                  onClick={() => {
                    // Quick select that scroll to top to view detail
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    // Quick callback trigger
                    const targetBookIndex = allEbooks.find(x => x.id === eb.id);
                    if (targetBookIndex) onAddToCart(targetBookIndex); // Trigger selection bypass or addToCart
                  }}
                  className="flex gap-3 p-2.5 rounded-xl border border-slate-50 hover:border-slate-150 hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <img
                    src={eb.coverUrl}
                    alt={eb.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-16 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600">{eb.title}</h4>
                    <p className="text-[10px] text-slate-400">{eb.author}</p>
                    <div className="flex items-center gap-1.5 mt-1">
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
