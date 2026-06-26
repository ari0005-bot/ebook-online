import React, { useState } from 'react';
import { 
  Star, 
  Search, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Zap, 
  Crown, 
  Sparkles, 
  HelpCircle,
  Instagram,
  MessageCircle,
  Music 
} from 'lucide-react';
import { motion } from 'motion/react'; 
import { Ebook, Article } from '../types';
import { EBOOK_CATEGORIES, INITIAL_ARTICLES } from "../data";

type Props = {
  ebooks: Ebook[];
  popularEbooks: Ebook[];
  setActivePage: (p: any) => void;
  setSelectedEbook: (e: Ebook | null) => void;
  setActiveArticle: (a: any) => void;
  showToast: (msg: string, type?: 'info' | 'success') => void;
};

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  icon: React.ReactNode;
  idx: number;
}

function PricingCard({ title, price, description, features, isPopular, icon, idx }: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.4 }}
      className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 ${
        isPopular 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl ring-1 ring-blue-500/50' 
          : 'bg-white border border-slate-200 text-slate-800 shadow-lg'
      }`}
    >
      {isPopular && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Paling Populer
        </span>
      )}

      <div>
        <div className="flex items-center justify-between mb-5">
          <div className={`p-3 rounded-2xl ${isPopular ? 'bg-slate-800/80 text-blue-400 backdrop-blur' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600'}`}>
            {icon}
          </div>
          <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${isPopular ? 'bg-white/10 text-slate-200 backdrop-blur' : 'bg-slate-100 text-slate-600'}`}>
            {title}
          </span>
        </div>

        <div className="my-5">
          <span className="text-4xl font-black tracking-tight">{price}</span>
          <span className={`text-xs font-medium ${isPopular ? 'text-slate-400' : 'text-slate-500'}`}> / bulan</span>
        </div>

        <p className={`text-xs leading-relaxed mb-6 ${isPopular ? 'text-slate-300' : 'text-slate-500'}`}>
          {description}
        </p>

        <hr className={`my-5 ${isPopular ? 'border-slate-700' : 'border-slate-100'}`} />

        <ul className="space-y-3 mb-8">
          {features.map((feature, fIdx) => (
            <li key={fIdx} className="flex items-start gap-3 text-xs">
              <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={isPopular ? 'text-slate-300' : 'text-slate-600'}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg uppercase tracking-wide ${
          isPopular
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:scale-105'
            : 'bg-slate-100 text-slate-800 hover:bg-slate-200 hover:shadow-md'
        }`}
      >
        Pilih Paket
      </button>
    </motion.div>
  );
}

export default function LandingPage({ ebooks, popularEbooks, setActivePage, setSelectedEbook, setActiveArticle, showToast }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use ebooks directly from props (no backend dependency)
  const dbEbooks = ebooks;
  const loading = false;

  const plans = [
    {
      title: 'Lite Reader',
      price: 'Rp 29.000',
      description: 'Cocok untuk pembaca santai yang ingin menjelajahi literatur dasar tanpa komitmen besar.',
      icon: <ShieldCheck className="w-5 h-5" />,
      features: [
        'Akses ke 50+ Ebook pilihan',
        'Membaca langsung di web browser',
        'Simpan hingga 5 bookmark harian',
        'Satu perangkat aktif'
      ]
    },
    {
      title: 'Premium Member',
      price: 'Rp 59.000',
      description: 'Pilihan terbaik untuk pelajar dan profesional yang membutuhkan akses referensi luas dan fitur cerdas.',
      icon: <Zap className="w-5 h-5" />,
      isPopular: true,
      features: [
        'Akses UNLIMITED ke seluruh Katalog Ebook',
        'Progress membaca otomatis di seluruh perangkat',
        'Fitur Bookmark & Catatan Refleksi Tanpa Batas',
        'Akses grup diskusi eksklusif & review buku',
        'Prioritas rilis Ebook baru setiap minggu'
      ]
    },
    {
      title: 'Corporate / Fam',
      price: 'Rp 149.000',
      description: 'Paket bundling hemat untuk kebutuhan tim operasional, institusi pendidikan, maupun koleksi keluarga.',
      icon: <Crown className="w-5 h-5" />,
      features: [
        'Semua fitur Premium Member',
        'Hingga 5 akun anggota aktif',
        'Dasbor monitoring membaca bagi admin grup',
        'Metode pembayaran faktur/invoicing',
        'Layanan bantuan prioritas 24/7'
      ]
    }
  ];

  const handleBookClick = (ebook: Ebook) => {
    setSelectedEbook(ebook);
    setActivePage('detail');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActivePage('catalog');
    }
  };

  // Memotong porsi susunan buku dinamis dari state database
  const shelfBooks = dbEbooks.slice(0, 5); 
  const featuredBooks = dbEbooks.slice(0, 3);
  const shopfrontBooks = dbEbooks.slice(0, 12);
  const romanceGridBooks = dbEbooks.slice(0, 6);

  const categories = ['Fantasy', 'Romance', 'Children\'s', 'Mystery'];
  const categoryColors = [
    "bg-gradient-to-br from-sky-50 to-blue-50 text-sky-900 border border-sky-200",
    "bg-gradient-to-br from-orange-50 to-amber-50 text-amber-900 border border-amber-200",
    "bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-900 border border-emerald-200",
    "bg-gradient-to-br from-rose-50 to-pink-50 text-rose-900 border border-rose-200",
  ];
  const categoryCards = categories.map((name, i) => ({
    name,
    bgColor: categoryColors[i],
    covers: dbEbooks.slice(i * 3, i * 3 + 3).map(b => b.coverUrl || ''),
  }));

  return (
    <div className="space-y-20 pb-16">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-4">
        <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-[2.5rem] overflow-hidden p-8 md:p-12 shadow-2xl border border-slate-800">
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center relative z-10">
            {/* Hero Left Content */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight font-serif tracking-tight text-white mb-4">
                  Ruang Nyaman<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white">
                    Cari Bacaan Favoritmu
                  </span>
                </h2>
                <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed max-w-lg">
                  Transformasi Bisnis, Tim, dan Diri Anda dengan Modul Inovasi yang Dirancang untuk Menciptakan Impact!
                </p>
              </motion.div>

              <motion.form 
                onSubmit={handleSearchSubmit} 
                className="relative max-w-md mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books, authors or topics"
                  className="w-full pl-12 pr-10 py-4 bg-slate-800/80 border border-slate-700 text-white rounded-2xl outline-none text-sm shadow-inner placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all backdrop-blur"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>

              <motion.div 
                className="pt-6 flex flex-col gap-2 border-t border-slate-800 w-fit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                  <span>Trustpilot</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="w-6 h-6 bg-[#00b67a] flex items-center justify-center text-white text-xs font-bold rounded-[3px] shadow-md">★</div>
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">TrustScore 4.8 | 37,894 reviews</span>
              </motion.div>
            </div>

            {/* Hero Right: 3D Bookshelf */}
            <motion.div 
              className="w-full flex flex-col justify-end items-center pt-8 overflow-visible"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {loading ? (
                <div className="h-48 flex items-center justify-center text-xs text-slate-400">Loading library shelf...</div>
              ) : (
                <div 
                  className="w-full flex justify-center items-end gap-2 sm:gap-3.5 md:gap-4 pb-1 relative z-10"
                  style={{ perspective: '1200px' }}
                >
                  {shelfBooks.map((book, idx) => (
                    <div
                      key={book.id ?? idx}
                      onClick={() => handleBookClick(book)}
                      className="group relative transition-all duration-300 ease-out cursor-pointer origin-bottom"
                      style={{
                        transform: 'rotateX(14deg) rotateY(-12deg)',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <div className="absolute inset-x-1 bottom-0 h-4 bg-black/80 blur-md rounded-full opacity-70 group-hover:opacity-40 group-hover:scale-90 transition-all duration-300 translate-y-1" />
                      <div className="w-[65px] sm:w-[90px] md:w-[115px] aspect-[3/4] rounded-r-md overflow-hidden shadow-[4px_4px_12px_rgba(0,0,0,0.9),-3px_0_6px_rgba(255,255,255,0.15)_inset] border-l border-black/40 relative group-hover:-translate-y-4 group-hover:rotate-y-[5deg] transition-all duration-300">
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-black/20 pointer-events-none" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div 
                className="w-full h-7 relative z-0 mt-[-3px]"
                style={{ perspective: '1200px' }}
              >
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-slate-300 via-white to-slate-300 border-b border-slate-400 shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
                  style={{ 
                    transform: 'rotateX(60deg)', 
                    transformOrigin: 'top center' 
                  }}
                />
                <div className="absolute top-[4px] left-0 right-0 h-[14px] bg-slate-200 border-t border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] rounded-b-xs" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Row */}
      <section className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <h3 className="text-3xl font-black text-slate-900 font-serif tracking-tight">Buku Unggulan</h3>
            <p className="text-sm text-slate-500 mt-1">Pilihan terbaik untuk Anda</p>
          </div>
          <button 
            onClick={() => setActivePage('catalog')} 
            className="group flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm hover:shadow-md"
          >
            Lihat Semua
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-slate-200 rounded-3xl p-5 flex gap-4 premium-card group hover:shadow-xl hover:border-blue-200 transition-all duration-300"
            >
              <div
                onClick={() => handleBookClick(book)}
                className="w-[95px] shrink-0 cursor-pointer shadow-lg overflow-hidden rounded-xl hover:scale-105 transition-transform duration-300"
              >
                <img src={book.coverUrl} alt={book.title} className="w-full h-[130px] object-cover" />
              </div>
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h4
                    onClick={() => handleBookClick(book)}
                    className="font-bold text-slate-800 text-sm md:text-base line-clamp-1 hover:text-blue-600 transition-colors cursor-pointer font-serif"
                  >
                    {book.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">By: {book.author}</p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 mt-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{book.rating}</span>
                    <span className="text-slate-400 font-medium">({book.reviewsCount} Reviews)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-2 line-clamp-2">{book.description}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-3">
                  <div>
                    <span className="text-slate-800 font-extrabold text-xs">
                      {book.price === 0 ? 'Gratis' : `Rp ${book.price?.toLocaleString('id-ID')}`}
                    </span>
                    {book.originalPrice && (
                      <span className="text-slate-400 line-through text-[9px] ml-1.5">
                        Rp {book.originalPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => showToast(`'${book.title}' ditambahkan ke keranjang!`, 'success')}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-[10px] font-extrabold transition-all cursor-pointer uppercase tracking-wider shadow-md hover:shadow-lg"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Romance + Shopfront Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_2fr] gap-12">
          {/* Romance Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b-2 border-[#ece3d5] pb-3">
              <h3 className="text-2xl font-black text-slate-900 font-serif">Romance</h3>
              <button 
                onClick={() => setActivePage('catalog')} 
                className="group flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer hover:shadow-md"
              >
                Show All
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {romanceGridBooks.map((book, idx) => (
                <motion.div
                  key={book.id ?? idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="space-y-2 cursor-pointer group"
                  onClick={() => handleBookClick(book)}
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg bg-slate-100 group-hover:scale-105 group-hover:shadow-xl transition-all duration-300">
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-800 text-xs line-clamp-1 group-hover:text-blue-600 transition-colors font-serif">{book.title}</h5>
                    <p className="text-[9px] text-slate-400 font-medium">By: {book.author}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs font-extrabold text-slate-800">
                        {book.price === 0 ? 'Gratis' : `Rp ${book.price?.toLocaleString('id-ID')}`}
                      </span>
                      {book.originalPrice && <span className="text-slate-400 line-through text-[9px]">Rp {book.originalPrice.toLocaleString('id-ID')}</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Shopfront Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b-2 border-slate-200 pb-3">
              <div className="flex items-end gap-3">
                <h3 className="text-2xl font-black text-slate-900 font-serif">Shopfront</h3>
                <span className="text-[9px] bg-gradient-to-r from-red-500 to-rose-600 text-white px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wide shadow-md">Bestseller</span>
              </div>
              <button 
                onClick={() => setActivePage('catalog')} 
                className="group flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer hover:shadow-md"
              >
                Show All
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-4 gap-y-6">
              {shopfrontBooks.map((book, idx) => (
                <motion.div
                  key={book.id ?? idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => handleBookClick(book)}
                  className="space-y-2 cursor-pointer group text-left"
                >
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all duration-300">
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-extrabold text-slate-800 text-[10px] line-clamp-1 group-hover:text-blue-600 transition-colors font-serif leading-none">{book.title}</h5>
                    <p className="text-[8px] text-slate-400 leading-none font-medium">By: {book.author}</p>
                    <div className="flex flex-col gap-0.5 pt-0.5">
                      <span className="text-[10px] font-black text-slate-800 leading-none">
                        {book.price === 0 ? 'Gratis' : `Rp ${book.price?.toLocaleString('id-ID')}`}
                      </span>
                      {book.originalPrice && <span className="text-slate-400 line-through text-[8px] leading-none">Rp {book.originalPrice.toLocaleString('id-ID')}</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="bg-gradient-to-br from-white via-slate-50 to-white py-12 rounded-3xl border border-slate-200 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-between items-center mb-8 border-b-2 border-[#ece3d5] pb-3 px-8">
            <div>
              <h3 className="text-2xl font-black text-slate-900 font-serif">Explore all books by category</h3>
              <p className="text-xs text-slate-500 mt-1">Temukan buku favoritmu berdasarkan kategori</p>
            </div>
            <button 
              onClick={() => setActivePage('catalog')} 
              className="group flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors bg-white border border-[#ece3d5] px-3 py-1.5 rounded-lg cursor-pointer hover:shadow-md"
            >
              Show All
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-8">
            {categoryCards.map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setActivePage('catalog')}
                className={`rounded-2xl border-2 p-5 flex items-center justify-between cursor-pointer group transition-all duration-300 hover:shadow-xl hover:scale-105 ${cat.bgColor}`}
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-75">Category</span>
                  <h4 className="text-lg font-black font-serif">{cat.name}</h4>
                </div>
                <div className="fanned-container shrink-0">
                  {cat.covers.filter(Boolean).map((cUrl, cIdx) => (
                    <img key={cIdx} src={cUrl} alt="Cover" className={`fanned-book fanned-book-${cIdx + 1}`} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Reading Journal Articles */}
      <section className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="flex justify-between items-center mb-8 border-b-2 border-[#ece3d5] pb-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <h3 className="text-2xl font-black text-slate-900 font-serif">From the Reading Journal</h3>
            <p className="text-xs text-slate-500 mt-1">Artikel dan wawasan menarik seputar dunia membaca</p>
          </div>
          <button
            onClick={() => setActiveArticle(INITIAL_ARTICLES[0])}
            className="group flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer hover:shadow-md"
          >
            Show All
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_ARTICLES.slice(0, 4).map((art, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setActiveArticle(art)}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer group hover:border-blue-300 hover:shadow-xl transition-all flex flex-col justify-between p-5"
            >
              <div className="space-y-3.5">
                <h4 className="font-extrabold text-slate-800 text-sm line-clamp-2 font-serif group-hover:text-blue-600 transition-colors leading-tight">
                  {art.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                  {art.summary}
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-4">
                {art.authorAvatar && (
                  <img src={art.authorAvatar} alt={art.author} className="w-8 h-8 rounded-full object-cover border-2 border-slate-200" />
                )}
                <div>
                  <span className="text-[10px] font-bold text-slate-700 block leading-none">{art.author}</span>
                  <span className="text-[8px] text-slate-400 block mt-0.5">{art.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Subscription Pricing */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 py-20 border-t border-b border-slate-200/60 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -ml-48 -mt-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl -mr-48 -mb-48" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            className="flex justify-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-[10px] font-extrabold tracking-wider uppercase shadow-lg">
              Paket Layanan Pendidikan
            </span>
          </motion.div>

          <motion.div 
            className="text-center max-w-2xl mx-auto mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Investasi Pengetahuan Tanpa <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Batas Ruang</span>
            </h2>
            <p className="text-slate-600 mt-3 text-sm md:text-base leading-relaxed">
              Pilih paket berlangganan bulanan yang paling sesuai dengan ritme belajar Anda. Batalkan atau tingkatkan keanggotaan kapan saja dengan mudah.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-14 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <PricingCard
                key={i}
                idx={i}
                title={plan.title}
                price={plan.price}
                description={plan.description}
                icon={plan.icon}
                features={plan.features}
                isPopular={plan.isPopular}
              />
            ))}
          </div>

          <motion.div 
            className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-left max-w-4xl mx-auto shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                <HelpCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Butuh Paket Kustom atau Akses Sekolah?</h5>
                <p className="text-xs text-slate-500 mt-1">Hubungi tim kemitraan kami untuk mendapatkan penawaran khusus institusi formal dan program CSR.</p>
              </div>
            </div>
            <button className="px-5 py-2.5 bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer shadow-md hover:shadow-lg">
              Hubungi Kami
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer (Ditambahkan Link IG, WA, dan TikTok) */}
      <footer className="mt-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          <div className="md:col-span-2 space-y-4">
            <img src="/assets/branding-logo.png" alt="The LOCAL Enablers - e.mind" className="h-20 w-auto object-contain scale-125" />
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">Memberdayakan komunitas lokal melalui akses konten berkualitas tinggi. Platform digital library eksklusif dari The LOCAL Enablers.</p>
          </div>
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-[0.15em] text-white">Jelajahi</h5>
            <nav className="space-y-2.5 text-sm text-slate-400">
              <button onClick={() => setActivePage('home')} className="block hover:text-white transition-colors text-left cursor-pointer hover:translate-x-1">Beranda</button>
              <button onClick={() => setActivePage('catalog')} className="block hover:text-white transition-colors text-left cursor-pointer hover:translate-x-1">Katalog</button>
              <button onClick={() => setActivePage('my-ebooks')} className="block hover:text-white transition-colors text-left cursor-pointer hover:translate-x-1">Ebook Saya</button>
              <button onClick={() => setActivePage('dashboard')} className="block hover:text-white transition-colors text-left cursor-pointer hover:translate-x-1">Dashboard</button>
            </nav>
          </div>
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-[0.15em] text-white">Perusahaan</h5>
            <nav className="space-y-2.5 text-sm text-slate-400">
              <button className="block hover:text-white transition-colors text-left cursor-pointer hover:translate-x-1">Tentang Kami</button>
              <button className="block hover:text-white transition-colors text-left cursor-pointer hover:translate-x-1">Kontak</button>
              <button className="block hover:text-white transition-colors text-left cursor-pointer hover:translate-x-1">Karir</button>
              <button className="block hover:text-white transition-colors text-left cursor-pointer hover:translate-x-1">Blog</button>
            </nav>
          </div>
          
          {/* Kolom Konten Media Sosial */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-[0.15em] text-white">Ikuti Kami</h5>
            <div className="flex flex-col gap-3 text-sm text-slate-400">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 hover:text-white transition-colors group">
                <Instagram className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
                <span>Instagram</span>
              </a>
              <a href="https://wa.me/yournumber" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 hover:text-white transition-colors group">
                <MessageCircle className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                <span>WhatsApp</span>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 hover:text-white transition-colors group">
                <Music className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                <span>TikTok</span>
              </a>
            </div>
            <div className="pt-2">
              <p className="text-[11px] text-slate-500">Hubungi Kami:</p>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                <a href="mailto:support@emind.local" className="hover:text-white transition-colors">support@emind.local</a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
          <p>&copy; 2026 The LOCAL Enablers - e.mind. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}