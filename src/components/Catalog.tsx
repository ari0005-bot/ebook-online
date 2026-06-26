import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Ebook, User } from '../types';
import { EBOOK_CATEGORIES } from '../data';
import { Search, ArrowUpDown, Flame, BadgePlus, Star, ShoppingCart, BookOpen, RefreshCw, SlidersHorizontal } from 'lucide-react';

interface CatalogProps {
  ebooks: Ebook[];
  currentUser: User | null;
  ownedBookIds: string[];
  cartBookIds: string[];
  onSelectEbook: (ebook: Ebook) => void;
  onAddToCart: (ebook: Ebook) => void;
  onReadEbook: (ebook: Ebook) => void;
  onDirectBuy: (ebook: Ebook) => void;
}

export default function Catalog({ 
  ebooks, 
  currentUser, 
  ownedBookIds, 
  cartBookIds, 
  onSelectEbook, 
  onAddToCart, 
  onReadEbook,
  onDirectBuy
}: CatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [sortBy, setSortBy] = useState<'popular' | 'priceAsc' | 'priceDesc' | 'newest'>('popular');
  const [openingBookId, setOpeningBookId] = useState<string | null>(null);

  // Format Rupiah / IDR Helper
  const formatIDR = (num: number) => {
    if (num === 0) return 'GRATIS';
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Filter dan sorting list ebook berdasarkan input user
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

  // Handler animasi buka buku sebelum memicu modal detail
  const handleBookClick = (eb: Ebook) => {
    setOpeningBookId(eb.id);
    setTimeout(() => {
      onSelectEbook(eb);
      setOpeningBookId(null);
    }, 450);
  };

  return (
    <div className="min-h-screen font-sans antialiased text-slate-800 pb-16">
      
      {/* Catalog Header Hero Section */}
      <motion.div 
        className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-4 overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.span 
            className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-400 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            eduHub Premium Ebook
          </motion.span>
          
          <motion.h1 
            className="text-3xl md:text-4xl lg:text-5xl font-black mt-3 mb-3 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Jelajahi Koleksi <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400">Edukatif Pilihan</span>
          </motion.h1>
          
          <motion.p 
            className="text-sm md:text-base text-slate-300 max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Tingkatkan keahlian digital Anda lewat literatur berkualitas tinggi yang dirancang khusus untuk kurikulum masa depan.
          </motion.p>

          {/* Quick Stats Grid */}
          <motion.div 
            className="mt-8 grid gap-4 grid-cols-2 sm:grid-cols-3 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md hover:bg-white/10 transition-all">
              <p className="text-[9px] uppercase font-bold tracking-widest text-blue-200">Total Koleksi</p>
              <p className="mt-1 text-xl font-extrabold text-white tracking-tight">{ebooks.length}+ Ebook</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md hover:bg-white/10 transition-all">
              <p className="text-[9px] uppercase font-bold tracking-widest text-blue-200">Urutan Berjalan</p>
              <p className="mt-1 text-sm font-bold text-yellow-400 truncate">
                {sortBy === 'popular' ? '🔥 Populer' : sortBy === 'newest' ? '✨ Terbaru' : sortBy === 'priceAsc' ? '📉 Murah' : '📈 Mahal'}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md hover:bg-white/10 transition-all">
              <p className="text-[9px] uppercase font-bold tracking-widest text-blue-200">Kategori Aktif</p>
              <p className="mt-1 text-sm font-bold text-white truncate">📂 {selectedCategory}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Search & Filter Toolbar */}
        <motion.div 
          className="bg-white rounded-2xl p-5 mb-8 shadow-lg border border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:w-[380px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul, penulis, atau topik..."
                className="w-full bg-slate-50 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl py-3 pl-11 pr-4 text-xs text-slate-700 transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
              <div className="inline-flex items-center gap-2 px-3 py-2 text-slate-600 text-[10px] font-bold tracking-wider">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                <span>URUTKAN</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 focus:border-blue-500 outline-none rounded-xl text-xs py-2.5 px-3 text-slate-700 font-medium cursor-pointer transition-colors hover:border-blue-300"
              >
                <option value="popular">🔥 Popularitas (Rating)</option>
                <option value="priceAsc">📉 Harga: Terendah</option>
                <option value="priceDesc">📈 Harga: Tertinggi</option>
                <option value="newest">✨ Ebook Terbaru</option>
              </select>
            </div>
          </div>

          {/* Categories Horizontal Badges */}
          <div className="pt-4 border-t border-slate-100 mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">Kategori:</span>
            {EBOOK_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`category-chip px-4 py-2 rounded-xl text-[11px] font-semibold tracking-wide transition-all cursor-pointer border active:scale-95 ${
                  selectedCategory === cat 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md font-bold' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-blue-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Dynamic Results Count Header */}
        <motion.div 
          className="mb-6 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-bold text-slate-600 tracking-wider uppercase">
            {processedEbooks.length} Ebook Ditemukan
          </h2>
        </motion.div>

        {/* Main Grid Product List */}
        {processedEbooks.length === 0 ? (
          <motion.div 
            className="text-center py-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-300 max-w-sm mx-auto p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-slate-500 text-sm mb-4 font-medium">Ebook tidak dapat ditemukan.</p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedCategory('Semua Kategori'); }}
              className="inline-flex items-center gap-2 text-[11px] font-bold text-blue-600 hover:text-blue-700 border-2 border-blue-500/20 bg-blue-500/5 px-4 py-2.5 rounded-xl transition-all hover:bg-blue-500/10 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Filter
            </button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {processedEbooks.map((eb, index) => {
              const isOwned = ownedBookIds.includes(eb.id);
              const isInCart = cartBookIds.includes(eb.id);
              const isOpening = openingBookId === eb.id;

              return (
                <motion.div
                  key={eb.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-white shadow-md border border-slate-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Book Image Cover Wrapper dengan Efek Animasi Membuka Buku */}
                  <div 
                    className="relative aspect-[3/4] max-h-[240px] overflow-visible bg-slate-100 shrink-0 cursor-pointer border-b border-slate-100"
                    style={{ perspective: '1000px' }}
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
                        className="w-full h-full object-cover shadow-lg"
                        style={{ backfaceVisibility: 'hidden' }}
                      />
                      {/* Sisi Belakang Sampul saat Terbuka */}
                      <div 
                        className="absolute inset-0 bg-stone-100 border-l-4 border-amber-800/10 shadow-inner"
                        style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
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
                    <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-30 pointer-events-none">
                      {eb.isPopular && (
                        <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 text-[8px] uppercase font-black px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5 fill-slate-900 text-slate-900" /> Populer
                        </span>
                      )}
                      {eb.isNew && (
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[8px] uppercase font-black px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
                          <BadgePlus className="w-2.5 h-2.5" /> Baru
                        </span>
                      )}
                    </div>

                    {/* Rating Badge Overlay */}
                    <div className="absolute bottom-2 right-2 bg-white/95 border border-slate-200 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-700 flex items-center gap-1 backdrop-blur-sm shadow-md z-30 pointer-events-none">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span>{eb.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Card Body Information */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3 bg-white">
                    <div className="space-y-2">
                      <span className="inline-block text-[8px] font-extrabold tracking-widest text-blue-700 uppercase bg-gradient-to-r from-blue-50 to-indigo-50 px-2 py-1 rounded-md border border-blue-100">
                        {eb.category}
                      </span>
                      <h4 
                        onClick={() => handleBookClick(eb)}
                        className="font-bold text-slate-800 hover:text-blue-600 cursor-pointer line-clamp-2 text-xs leading-snug transition-colors"
                      >
                        {eb.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate font-medium">
                        {eb.author}
                      </p>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[7px] font-bold uppercase tracking-wider text-slate-400">Harga</p>
                        <p className="font-black text-slate-900 text-xs truncate">{formatIDR(eb.price)}</p>
                      </div>

                      {/* Dynamic CTA Button */}
                      {isOwned ? (
                        <button
                          type="button"
                          onClick={() => onReadEbook(eb)}
                          className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-lg text-[10px] font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3" /> Baca
                        </button>
                      ) : eb.price === 0 ? (
                        <button
                          type="button"
                          onClick={() => onDirectBuy(eb)}
                          className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-lg text-[10px] font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3" /> Ambil Gratis
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onDirectBuy(eb)}
                          className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-[10px] font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>Beli</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}