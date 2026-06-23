import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Ebook, User } from '../types';
import { EBOOK_CATEGORIES } from '../data';
import { Search, ArrowUpDown, Flame, BadgePlus, Star, ShoppingCart, BookOpen, RefreshCw } from 'lucide-react';

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
  const [openingBookId, setOpeningBookId] = useState<string | null>(null);

  // Format IDR Helper
  const formatIDR = (num: number) => {
    if (num === 0) return 'GRATIS';
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Filter and sort the ebook list
  const processedEbooks = useMemo(() => {
    let list = [...ebooks];

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      list = list.filter(eb => 
        eb.title.toLowerCase().includes(query) || 
        eb.author.toLowerCase().includes(query) || 
        eb.description.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'Semua Kategori') {
      list = list.filter(eb => eb.category === selectedCategory);
    }

    list.sort((a, b) => {
      if (sortBy === 'popular') return b.rating - a.rating;
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'newest') return b.isNew ? 1 : a.isNew ? -1 : 0;
      return 0;
    });

    return list;
  }, [ebooks, searchQuery, selectedCategory, sortBy]);

  // Handler animasi buka buku sebelum memicu detail/modal
  const handleBookClick = (eb: Ebook) => {
    setOpeningBookId(eb.id);
    setTimeout(() => {
      onSelectEbook(eb);
      setOpeningBookId(null);
    }, 450); // Durasi transisi
  };

  return (
    <div className="page-transition min-h-screen font-sans antialiased text-slate-800 pb-16">
      
      {/* Catalog Header Hero Section — Menggunakan skema e.mind */}
      <div className="catalog-hero py-12 px-4 shadow-lift mb-10 text-white rounded-b-[2rem]">
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-400 bg-white/10 px-3 py-1 rounded-full border border-white/10">
            Premium Ebook Hub
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mt-3 mb-3 tracking-tight">
            Jelajahi Koleksi <span className="text-yellow-400">Edukatif Pilihan</span>
          </h1>
          <p className="text-sm text-blue-100 max-w-xl leading-relaxed">
            Tingkatkan keahlian Anda lewat literatur berkualitas tinggi yang dirancang khusus untuk kurikulum masa depan.
          </p>

          {/* Quick Stats Grid — Menyesuaikan ukuran agar lebih compact */}
          <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-3 max-w-2xl">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
              <p className="text-[9px] uppercase font-bold tracking-widest text-blue-200">Total Koleksi</p>
              <p className="mt-0.5 text-xl font-extrabold text-white tracking-tight">{ebooks.length}+ Ebook</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
              <p className="text-[9px] uppercase font-bold tracking-widest text-blue-200">Urutan Berjalan</p>
              <p className="mt-0.5 text-sm font-bold text-yellow-400 truncate">
                {sortBy === 'popular' ? '🔥 Populer' : sortBy === 'newest' ? '✨ Terbaru' : sortBy === 'priceAsc' ? '📉 Murah' : '📈 Mahal'}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
              <p className="text-[9px] uppercase font-bold tracking-widest text-blue-200">Kategori Aktif</p>
              <p className="mt-0.5 text-sm font-bold text-white truncate">📂 {selectedCategory}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Search & Filter Toolbar */}
        <div className="glass-panel rounded-2xl p-4 mb-8 shadow-soft flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:w-[380px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul, penulis, atau topik..."
                className="w-full bg-slate-50 outline-none border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl py-2.5 pl-11 pr-4 text-xs text-slate-700 transition-all placeholder:text-slate-400 focus:ring-1 focus:ring-primary-500/20"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-500 text-[10px] font-bold tracking-wider">
                <ArrowUpDown className="w-3.5 h-3.5 text-primary-500" />
                <span>URUTKAN</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 focus:border-primary-500 outline-none rounded-xl text-xs py-2.5 px-3 text-slate-700 font-medium cursor-pointer transition-colors"
              >
                <option value="popular">🔥 Popularitas (Rating)</option>
                <option value="priceAsc">📉 Harga: Terendah</option>
                <option value="priceDesc">📈 Harga: Tertinggi</option>
                <option value="newest">✨ Ebook Terbaru</option>
              </select>
            </div>
          </div>

          {/* Categories Horizontal Badges */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Kategori:</span>
            {EBOOK_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`category-chip px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide transition-all cursor-pointer border active:scale-95 ${
                  selectedCategory === cat 
                    ? 'bg-primary-500 text-white border-transparent shadow-sm font-bold' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Results Count Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-400 tracking-wider uppercase">{processedEbooks.length} Ebook Ditemukan</h2>
        </div>

        {/* Main Grid Product List — Layout Compact & Rapi */}
        {processedEbooks.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 max-w-sm mx-auto p-6">
            <p className="text-slate-400 text-xs mb-4">Ebook tidak dapat ditemukan.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('Semua Kategori'); }}
              className="inline-flex items-center gap-2 text-[11px] font-bold text-primary-500 hover:text-primary-600 border border-primary-500/20 bg-primary-500/5 px-3 py-2 rounded-xl transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {processedEbooks.map((eb) => {
              const isOwned = ownedBookIds.includes(eb.id);
              const isInCart = cartBookIds.includes(eb.id);
              const isOpening = openingBookId === eb.id;

              return (
                <div 
                  key={eb.id}
                  className="ebook-card group flex flex-col rounded-2xl overflow-hidden bg-white shadow-xs transition-all duration-300"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Book Image Cover Wrapper dengan Efek Animasi Membuka Buku */}
                  <div 
                    className="relative aspect-[3/4] max-h-[240px] overflow-visible bg-slate-100 shrink-0 cursor-pointer perspective-1000 border-b border-slate-100"
                    onClick={() => handleBookClick(eb)}
                  >
                    <motion.div
                      className="w-full h-full origin-left relative z-20"
                      animate={isOpening ? { rotateY: -115, z: 40 } : { rotateY: 0, z: 0 }}
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <img
                        src={eb.coverUrl}
                        alt={eb.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover backface-hidden shadow-md"
                      />
                      {/* Sisi Belakang Sampul saat Terbuka (Efek Tekstur Kertas Dalam) */}
                      <div 
                        className="absolute inset-0 bg-stone-100 border-l-4 border-amber-800/10 shadow-inner backface-hidden"
                        style={{ transform: 'rotateY(180deg)' }}
                      />
                    </motion.div>

                    {/* Halaman Isi Buku Dibawah Sampul yang Terbuka */}
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-50 via-white to-stone-100 z-10 flex flex-col justify-between p-3 opacity-95 shadow-inner">
                      <div className="w-full h-1 bg-stone-200 rounded-xs" />
                      <div className="space-y-1">
                        <div className="w-3/4 h-1 bg-stone-200 rounded-xs" />
                        <div className="w-5/6 h-1 bg-stone-200 rounded-xs" />
                        <div className="w-2/3 h-1 bg-stone-200 rounded-xs" />
                      </div>
                      <div className="w-1/2 h-1 bg-stone-200 rounded-xs self-end" />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent opacity-40 pointer-events-none z-20" />

                    {/* Left Badges Overlays */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-30 pointer-events-none">
                      {eb.isPopular && (
                        <span className="bg-yellow-500 text-slate-900 text-[8px] uppercase font-black px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5 fill-slate-900 text-slate-900" /> Populer
                        </span>
                      )}
                      {eb.isNew && (
                        <span className="bg-primary-500 text-white text-[8px] uppercase font-black px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1">
                          <BadgePlus className="w-2.5 h-2.5" /> Baru
                        </span>
                      )}
                    </div>

                    {/* Rating Badge Overlay */}
                    <div className="absolute bottom-2 right-2 bg-white/90 border border-slate-100 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-slate-700 flex items-center gap-0.5 backdrop-blur-xs shadow-xs z-30 pointer-events-none">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span>{eb.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Card Body Information */}
                  <div className="p-3 flex-1 flex flex-col justify-between gap-2.5 bg-white">
                    <div className="space-y-1">
                      <span className="inline-block text-[8px] font-extrabold tracking-widest text-primary-600 uppercase bg-primary-50 px-1.5 py-0.5 rounded">
                        {eb.category}
                      </span>
                      <h4 
                        onClick={() => handleBookClick(eb)}
                        className="font-bold text-slate-800 hover:text-primary-500 cursor-pointer line-clamp-2 text-xs leading-snug transition-colors"
                      >
                        {eb.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">
                        {eb.author}
                      </p>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                      <div className="min-w-0">
                        <p className="text-[7px] font-bold uppercase tracking-wider text-slate-400">Harga</p>
                        <p className="font-black text-slate-900 text-xs truncate">{formatIDR(eb.price)}</p>
                      </div>

                      {/* Dynamic CTA Button */}
                      {isOwned ? (
                        <button
                          onClick={() => onReadEbook(eb)}
                          className="px-2 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-[10px] font-bold shadow-xs transition-all flex items-center gap-1 shrink-0 active:scale-95 cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3" /> Baca
                        </button>
                      ) : (
                        <button
                          onClick={() => onAddToCart(eb)}
                          disabled={isInCart}
                          className={`inline-flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-bold transition-all border shrink-0 active:scale-95 cursor-pointer ${
                            isInCart 
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                              : 'button-primary text-slate-900 font-extrabold border-transparent'
                          }`}
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>{isInCart ? 'Saved' : 'Beli'}</span>
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