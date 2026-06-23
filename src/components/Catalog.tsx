import { useState, useMemo } from 'react';
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      
      {/* Catalog Hero Section */}
      <div className="relative overflow-hidden border-b border-slate-800/60 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-16 px-4">
        {/* Decorative background glows */}
        <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            Premium Library
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mt-4 mb-4 tracking-tight">
            Jelajahi Koleksi <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400 bg-clip-text text-transparent">Ebook Elite</span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed">
            Akses ribuan literatur berkualitas tinggi dengan pengalaman membaca kustom yang dirancang untuk kenyamanan visual Anda.
          </p>

          {/* Stats Badges Grid */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 shadow-2xl backdrop-blur-md">
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Total Koleksi</p>
              <p className="mt-2 text-3xl font-extrabold text-white tracking-tight">{ebooks.length}+</p>
              <p className="mt-1 text-xs text-slate-400">Ebook pilihan terverifikasi.</p>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 shadow-2xl backdrop-blur-md">
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Urutan Berjalan</p>
              <p className="mt-2 text-xl font-bold text-blue-400 truncate">
                {sortBy === 'popular' ? '🔥 Populer' : sortBy === 'newest' ? '✨ Terbaru' : sortBy === 'priceAsc' ? '📉 Harga Rendah' : '📈 Harga Tinggi'}
              </p>
              <p className="mt-1 text-xs text-slate-400">Menampilkan hasil paling relevan.</p>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 shadow-2xl backdrop-blur-md">
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Kategori Aktif</p>
              <p className="mt-2 text-xl font-bold text-cyan-400 truncate">📂 {selectedCategory}</p>
              <p className="mt-1 text-xs text-slate-400">Filter presisi pencarian pintar.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Search & Filter Controls Toolbar */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/20 p-6 mb-12 shadow-xl backdrop-blur-lg">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            
            {/* Search Input Bar */}
            <div className="relative w-full lg:w-[450px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul, penulis, atau topik spesifik..."
                className="w-full bg-slate-950/60 outline-none border border-slate-800 focus:border-blue-500 rounded-xl py-3.5 pl-12 pr-4 text-sm text-slate-200 transition-all placeholder:text-slate-600 focus:ring-1 focus:ring-blue-500/20"
              />
            </div>

            {/* Sort Dropdown Selector */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-900/60 px-3 py-2 text-slate-400 text-xs font-medium">
                <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" />
                <span className="tracking-wide">URUTKAN</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-950/80 border border-slate-800 focus:border-blue-500 outline-none rounded-xl text-sm py-3 px-4 text-slate-300 font-medium cursor-pointer transition-colors focus:ring-1 focus:ring-blue-500/20"
              >
                <option value="popular">🔥 Popularitas (Rating Tertinggi)</option>
                <option value="priceAsc">📉 Harga: Terendah ke Tertinggi</option>
                <option value="priceDesc">📈 Harga: Tertinggi ke Terendah</option>
                <option value="newest">✨ Ebook Terbaru</option>
              </select>
            </div>
          </div>

          {/* Categories Horizontal Badges */}
          <div className="mt-6 pt-6 border-t border-slate-800/60 flex flex-wrap gap-2.5 items-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">Kategori:</span>
            {EBOOK_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer border active:scale-95 ${
                  selectedCategory === cat 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent shadow-[0_4px_20px_rgba(37,99,235,0.25)]' 
                    : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Results Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500">HASIL PENELUSURAN</span>
            <h2 className="mt-1 text-2xl font-extrabold text-white tracking-tight">{processedEbooks.length} Ebook Ditemukan</h2>
          </div>
          <div className="self-start sm:self-auto rounded-xl bg-slate-900/40 border border-slate-800/80 px-4 py-2 text-xs">
            <span className="text-slate-500 mr-2">Filter aktif:</span>
            <span className="font-semibold text-cyan-400">{selectedCategory}</span>
          </div>
        </div>

        {/* Main Grid Product List */}
        {processedEbooks.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/10 rounded-2xl border border-dashed border-slate-800 max-w-md mx-auto p-8 shadow-inner">
            <p className="text-slate-500 text-sm mb-5">Ups! Ebook yang Anda cari tidak dapat ditemukan.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('Semua Kategori'); }}
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 border border-blue-500/20 bg-blue-500/5 px-4 py-2.5 rounded-xl hover:bg-blue-500/10 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Semua Filter
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
                  className="group flex flex-col rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900/20 transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-900/40 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                >
                  {/* Book Image Banner */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-950 shrink-0 cursor-pointer" onClick={() => onSelectEbook(eb)}>
                    <img
                      src={eb.coverUrl}
                      alt={eb.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Left Badges Overlay */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {eb.isPopular && (
                        <span className="bg-slate-950/80 backdrop-blur-md text-amber-400 text-[9px] uppercase font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-amber-500/20">
                          <Flame className="w-3 h-3 fill-amber-400" /> Populer
                        </span>
                      )}
                      {eb.isNew && (
                        <span className="bg-blue-600/90 text-white text-[9px] uppercase font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-blue-400/20">
                          <BadgePlus className="w-3 h-3" /> Baru
                        </span>
                      )}
                    </div>

                    {/* Rating Badge Overlay */}
                    <div className="absolute bottom-3 right-3 bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-200 flex items-center gap-1.5 backdrop-blur-md shadow-lg">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{eb.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Card Body Information */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <span className="inline-block text-[9px] font-extrabold tracking-widest text-blue-400 uppercase bg-blue-500/5 px-2.5 py-0.5 rounded border border-blue-500/10">
                        {eb.category}
                      </span>
                      <h4 
                        onClick={() => onSelectEbook(eb)}
                        className="font-bold text-slate-100 hover:text-blue-400 cursor-pointer line-clamp-2 text-base leading-snug transition-colors"
                      >
                        {eb.title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">
                        Oleh <span className="text-slate-300 font-medium">{eb.author}</span>
                      </p>
                    </div>

                    {/* Card Footer Interaction */}
                    <div className="pt-4 mt-5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Harga</p>
                        <p className="font-black text-white text-base mt-0.5 tracking-tight">{formatIDR(eb.price)}</p>
                      </div>

                      {/* Call-to-Action Trigger */}
                      {isOwned ? (
                        <button
                          onClick={() => onReadEbook(eb)}
                          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" /> Baca
                        </button>
                      ) : (
                        <button
                          onClick={() => onAddToCart(eb)}
                          disabled={isInCart}
                          className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all border active:scale-95 cursor-pointer ${
                            isInCart 
                              ? 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed' 
                              : 'bg-white hover:bg-slate-100 text-slate-950 border-white font-extrabold shadow-md'
                          }`}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>{isInCart ? 'Disimpan' : 'Beli'}</span>
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