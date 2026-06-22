import { useState, useMemo } from 'react';
import { Ebook, User } from '../types';
import { EBOOK_CATEGORIES } from '../data';
import { Search, SlidersHorizontal, ArrowUpDown, Flame, BadgePlus, Star, ShoppingCart, BookOpen } from 'lucide-react';

interface CatalogProps {
  ebooks: Ebook[];
  currentUser: User | null;
  ownedBookIds: string[];
  cartBookIds: string[];
  onSelectEbook: (ebook: Ebook) => void;
  onAddToCart: (ebook: Ebook) => void;
  onReadEbook: (ebook: Ebook) => void;
}

export default function Catalog({ 
  ebooks, 
  currentUser, 
  ownedBookIds, 
  cartBookIds, 
  onSelectEbook, 
  onAddToCart, 
  onReadEbook 
}: CatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [sortBy, setSortBy] = useState<'popular' | 'priceAsc' | 'priceDesc' | 'newest'>('popular');

  // Format IDR Helper
  const formatIDR = (num: number) => {
    if (num === 0) return 'GRATIS';
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Filter and sort the ebook list with high-performance hooks memoization
  const processedEbooks = useMemo(() => {
    let list = [...ebooks];

    // Search query mapping
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      list = list.filter(eb => 
        eb.title.toLowerCase().includes(query) || 
        eb.author.toLowerCase().includes(query) || 
        eb.description.toLowerCase().includes(query)
      );
    }

    // Category sorting mapping
    if (selectedCategory !== 'Semua Kategori') {
      list = list.filter(eb => eb.category === selectedCategory);
    }

    // Sort mapping
    list.sort((a, b) => {
      if (sortBy === 'popular') {
        return b.rating - a.rating;
      }
      if (sortBy === 'priceAsc') {
        return a.price - b.price;
      }
      if (sortBy === 'priceDesc') {
        return b.price - a.price;
      }
      if (sortBy === 'newest') {
        return b.isNew ? 1 : a.isNew ? -1 : 0;
      }
      return 0;
    });

    return list;
  }, [ebooks, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-white">
      {/* Catalog Hero Section */}
      <div className="catalog-hero py-12 md:py-16 px-4 mb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">Jelajahi Koleksi Ebook</h1>
          <p className="text-lg md:text-xl text-white/85 max-w-3xl drop-shadow-sm">Ribuan ebook berkualitas dari berbagai kategori siap untuk Anda baca dengan gaya premium dan pengalaman yang lebih elegan.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[28px] border border-white/20 bg-white/10 p-5 shadow-[0_32px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.32em] text-slate-200/90">Total Koleksi</p>
              <p className="mt-4 text-3xl font-semibold text-white">{ebooks.length}+</p>
              <p className="mt-2 text-sm text-slate-200/80">Ebook terbaik dari berbagai genre.</p>
            </div>
            <div className="rounded-[28px] border border-white/20 bg-white/10 p-5 shadow-[0_32px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.32em] text-slate-200/90">Sortir pintar</p>
              <p className="mt-4 text-3xl font-semibold text-white">{sortBy === 'popular' ? 'Popularitas' : sortBy === 'newest' ? 'Terbaru' : sortBy === 'priceAsc' ? 'Harga rendah' : 'Harga tinggi'}</p>
              <p className="mt-2 text-sm text-slate-200/80">Temukan ebook yang paling relevan untuk Anda.</p>
            </div>
            <div className="rounded-[28px] border border-white/20 bg-white/10 p-5 shadow-[0_32px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.32em] text-slate-200/90">Kategori aktif</p>
              <p className="mt-4 text-3xl font-semibold text-white">{selectedCategory}</p>
              <p className="mt-2 text-sm text-slate-200/80">Filter khusus agar pencarian lebih cepat.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 pb-8">
      
      {/* Search and Filters Layout toolbar Block */}
      <div className="glass-panel rounded-[2rem] p-7 mb-10 shadow-2xl border border-white/70">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Active Search Term bar */}
          <div className="relative w-full lg:w-[420px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul, penulis, atau topik ebook..."
              className="w-full bg-white/85 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white rounded-[28px] py-4 pl-12 pr-4 text-sm text-slate-800 transition-all shadow-sm hover:border-slate-300"
            />
          </div>

          {/* Sort selection switcher dropdown */}
          <div className="flex items-center gap-3 w-full lg:w-auto self-stretch lg:self-auto justify-between lg:justify-end">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-3 text-slate-500 shadow-sm">
              <ArrowUpDown className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">Urutkan</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 focus:border-blue-500 outline-none rounded-2xl text-sm py-3 px-4 text-slate-700 shadow-sm font-semibold cursor-pointer hover:border-slate-300 transition-colors"
            >
              <option value="popular">Popularitas (Rating Tertinggi)</option>
              <option value="priceAsc">Harga: Terendah ke Tertinggi</option>
              <option value="priceDesc">Harga: Tertinggi ke Terendah</option>
              <option value="newest">Ebook Terbaru</option>
            </select>
          </div>
        </div>

        {/* Categories Carousel / Badges Chips */}
        <div className="mt-6 flex flex-wrap gap-3 items-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Kategori:</span>
          {EBOOK_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`category-chip px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                selectedCategory === cat 
                  ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 text-white shadow-lg border border-transparent' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Results Listing Header */}
      <div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Hasil Pencarian</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">{processedEbooks.length} Koleksi ditemukan</h2>
          <p className="mt-2 text-sm text-slate-500 max-w-2xl">Telusuri ebook terbaik dengan tampilan elegan, kartu halus, dan detail yang jelas.</p>
        </div>
        <div className="rounded-3xl bg-slate-50 border border-slate-200 px-5 py-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Filter aktif</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{selectedCategory}</p>
        </div>
      </div>

      {/* Grid List Product Cards */}
      {processedEbooks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 max-w-lg mx-auto p-8">
          <p className="text-slate-400 text-sm mb-4">Ups! Ebook yang Anda cari tidak dapat ditemukan.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('Semua Kategori'); }}
            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {processedEbooks.map((eb) => {
            const isOwned = ownedBookIds.includes(eb.id);
            const isInCart = cartBookIds.includes(eb.id);

            return (
              <div 
                key={eb.id}
                className="catalog-card rounded-[28px] overflow-hidden group flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_80px_rgba(15,23,42,0.12)]"
              >
                {/* Book Cover Photo banner wrapper */}
                <div className="relative aspect-[3/4] overflow-hidden shrink-0 cursor-pointer group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" onClick={() => onSelectEbook(eb)}>
                  <img
                    src={eb.coverUrl}
                    alt={eb.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-90" />

                  {/* Overlay Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {eb.isPopular && (
                      <span className="bg-slate-900/90 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
                        <Flame className="w-3.5 h-3.5" /> Populer
                      </span>
                    )}
                    {eb.isNew && (
                      <span className="bg-blue-500/95 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
                        <BadgePlus className="w-3.5 h-3.5" /> Baru
                      </span>
                    )}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-2 rounded-2xl text-[11px] font-semibold text-slate-800 flex items-center gap-2 shadow-sm backdrop-blur-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{eb.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Book Metadata details */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                  <div className="space-y-3">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700 shadow-sm">{eb.category}</span>
                    <h4 
                      onClick={() => onSelectEbook(eb)}
                      className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-2 text-lg leading-snug transition-colors"
                    >
                      {eb.title}
                    </h4>
                    <p className="text-sm text-slate-500">Oleh <span className="font-semibold text-slate-700">{eb.author}</span></p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Harga Ebook</p>
                      <p className="font-extrabold text-slate-900 text-lg mt-1">{formatIDR(eb.price)}</p>
                    </div>

                    {/* Smart Responsive CTA button action triggers */}
                    {isOwned ? (
                      <button
                        onClick={() => onReadEbook(eb)}
                        className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl text-xs font-bold shadow-[0_12px_28px_rgba(16,185,129,0.26)] transition-all"
                      >
                        <BookOpen className="w-4 h-4 inline-block mr-1" /> Baca
                      </button>
                    ) : (
                      <button
                        onClick={() => onAddToCart(eb)}
                        disabled={isInCart}
                        className={`inline-flex items-center justify-center gap-2 rounded-3xl px-4 py-3 text-xs font-bold transition-all ${isInCart ? 'bg-slate-100 text-slate-400 border border-slate-200' : 'button-primary'}`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{isInCart ? 'Sudah di Keranjang' : 'Beli Sekarang'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
