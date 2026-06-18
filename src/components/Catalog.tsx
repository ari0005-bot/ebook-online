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
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Search and Filters Layout toolbar Block */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-100 p-6 mb-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Active Search Term bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul, penulis, atau topik ebook..."
              className="w-full bg-slate-50 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl py-3 pl-11 pr-4 text-sm text-slate-800 transition-all shadow-2xs"
            />
          </div>

          {/* Sort selection switcher dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto self-stretch md:self-auto justify-end">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none rounded-xl text-xs py-2 px-3 text-slate-700 shadow-2xs font-semibold cursor-pointer"
            >
              <option value="popular">Popularitas (Rating Tertinggi)</option>
              <option value="priceAsc">Harga: Terendah ke Tertinggi</option>
              <option value="priceDesc">Harga: Tertinggi ke Terendah</option>
              <option value="newest">Ebook Terbaru</option>
            </select>
          </div>
        </div>

        {/* Categories Carousel / Badges Chips */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Kategori:</span>
          {EBOOK_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap active:scale-95 ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Results Listing Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm font-semibold text-slate-500">
          Menampilkan <span className="text-slate-900 font-bold">{processedEbooks.length}</span> ebook yang sesuai
        </p>
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
                className="bg-white rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all duration-300 md:duration-500 flex flex-col overflow-hidden group"
              >
                {/* Book Cover Photo banner wrapper */}
                <div className="relative aspect-[3/4] bg-slate-900 overflow-hidden shrink-0 cursor-pointer" onClick={() => onSelectEbook(eb)}>
                  <img
                    src={eb.coverUrl}
                    alt={eb.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {eb.isPopular && (
                      <span className="bg-amber-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                        <Flame className="w-3.5 h-3.5 fill-current" /> Populer
                      </span>
                    )}
                    {eb.isNew && (
                      <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                        <BadgePlus className="w-3.5 h-3.5" /> Baru
                      </span>
                    )}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                    <span>{eb.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Book Metadata details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">
                      {eb.category}
                    </span>
                    <h4 
                      onClick={() => onSelectEbook(eb)}
                      className="font-bold text-slate-800 hover:text-blue-600 cursor-pointer line-clamp-2 text-base leading-snug transition-colors"
                    >
                      {eb.title}
                    </h4>
                    <p className="text-xs text-slate-400">Oleh <span className="font-semibold text-slate-500">{eb.author}</span></p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold leading-none">Harga Ebook</span>
                      <span className="font-extrabold text-slate-800 text-base">
                        {formatIDR(eb.price)}
                      </span>
                    </div>

                    {/* Smart Responsive CTA button action triggers */}
                    {isOwned ? (
                      <button
                        onClick={() => onReadEbook(eb)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" /> Baca
                      </button>
                    ) : (
                      <button
                        onClick={() => onAddToCart(eb)}
                        disabled={isInCart}
                        className={`p-2.5 rounded-xl text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${isInCart ? 'bg-slate-100 text-slate-400 border border-slate-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white-all hover:bg-opacity-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300'}`}
                        style={{ color: isInCart ? '' : 'inherit' }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{isInCart ? 'Keluar Keranjang' : 'Beli'}</span>
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
  );
}
