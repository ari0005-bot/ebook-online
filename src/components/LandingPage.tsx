import React, { useState } from 'react';
import { Star, Search, ArrowRight, Check, ShieldCheck, Zap, Crown, Sparkles, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react'; // Pastikan di-install atau ubah ke framer-motion jika diperlukan
import { Ebook, Article } from '../types';
import { INITIAL_ARTICLES } from "../data";

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

// Sub-komponen untuk Kartu Paket Berlangganan
function PricingCard({ title, price, description, features, isPopular, icon, idx }: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.4 }}
      className={`p-6 rounded-[2rem] flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-1 ${
        isPopular 
          ? 'bg-slate-900 text-white shadow-xl ring-4 ring-blue-500/30' 
          : 'bg-white border border-slate-200 text-slate-800 shadow-xs'
      }`}
    >
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-md flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Paling Populer
        </span>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl ${isPopular ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            {icon}
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${isPopular ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
            {title}
          </span>
        </div>

        <div className="my-4">
          <span className="text-3xl font-black tracking-tight">{price}</span>
          <span className={`text-xs ${isPopular ? 'text-slate-400' : 'text-slate-500'}`}> / bulan</span>
        </div>

        <p className={`text-xs leading-relaxed mb-6 ${isPopular ? 'text-slate-300' : 'text-slate-500'}`}>
          {description}
        </p>

        <hr className={`my-4 ${isPopular ? 'border-slate-800' : 'border-slate-100'}`} />

        <ul className="space-y-3 mb-8">
          {features.map((feature, fIdx) => (
            <li key={fIdx} className="flex items-start gap-2.5 text-xs">
              <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={isPopular ? 'text-slate-300' : 'text-slate-600'}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        className={`w-full py-3 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs uppercase tracking-wide ${
          isPopular
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-95'
            : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
        }`}
      >
        Pilih Paket
      </button>
    </motion.div>
  );
}

export default function LandingPage({ ebooks, popularEbooks, setActivePage, setSelectedEbook, setActiveArticle, showToast }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const subNavLinks = [
    "What is Roko?", "Books", "eBooks", "Audiobooks", "Fiction", "Nonfiction",
    "Teens & YA", "Children's", "Highlights", "Psychology", "Science", "Top 100"
  ];

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

  const heroBooks = ebooks.slice(0, 2);
  const featuredBooks = ebooks.slice(0, 3);
  const shopfrontBooks = ebooks.slice(0, 12);
  const romanceGridBooks = ebooks.slice(0, 6);

  const categories = ['Fantasy', 'Romance', 'Children\'s', 'Mystery'];
  const categoryColors = [
    "bg-[#e3eff8] text-sky-900 border-[#cbe1f2]",
    "bg-[#f6eee5] text-[#7d5c41] border-[#eadcd0]",
    "bg-[#edf2e8] text-emerald-900 border-[#dce6d5]",
    "bg-[#f2ece8] text-rose-900 border-[#e8ded8]",
  ];
  const categoryCards = categories.map((name, i) => ({
    name,
    bgColor: categoryColors[i],
    covers: ebooks.slice(i * 3, i * 3 + 3).map(b => b.coverUrl || ''),
  }));

  return (
    <div className="space-y-16 pb-16">

      {/* Sub Header Navigation */}
      <div className="bg-blue-50 border-b border-slate-200 py-2.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-7 text-xs font-semibold text-slate-600">
            {subNavLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => setActivePage('catalog')}
                className="hover:text-primary-600 transition-colors cursor-pointer"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-4">
        <div className="hero-card relative overflow-hidden p-8 md:p-12 shadow-lift">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">

            {/* Hero Left */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight font-serif tracking-tight glow-text">
                Ruang Nyaman<br />Cari Bacaan Favoritmu
              </h2>
              <p className="text-sm text-slate-500 font-medium tracking-wide">
                Transformasi Bisnis, Tim, dan Diri Anda dengan Modul Inovasi yang Dirancang untuk Menciptakan Impact!
              </p>

              <form onSubmit={handleSearchSubmit} className="relative max-w-md mt-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books, authors or topics"
                  className="w-full pl-12 pr-10 py-3.5 button-secondary rounded-2xl outline-none text-sm shadow-xs focus:ring-2 focus:ring-primary-500/20"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 cursor-pointer">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="pt-6 flex flex-col gap-1.5 border-t border-slate-200 w-fit">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                  <span>Trustpilot</span>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="w-5 h-5 bg-[#00b67a] flex items-center justify-center text-white text-[11px] font-bold rounded-[3px]">★</div>
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">TrustScore 4.8 | 37,894 reviews on</span>
              </div>
            </div>

            {/* Hero Right: Bookshelf */}
            <div className="relative flex flex-col justify-end items-center h-[260px] md:h-[300px] w-full">
              <div className="flex items-end gap-6 z-10 mb-[16px]">
                {heroBooks.map((book, idx) => (
                  <div
                    key={book.id ?? idx}
                    onClick={() => handleBookClick(book)}
                    className="w-[105px] md:w-[135px] relative group cursor-pointer transition-all duration-500 hover:-translate-y-3"
                  >
                    <div className="absolute inset-x-2 -bottom-2 h-4 bg-black/30 blur-md rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="rounded-r-[4px] rounded-l-[1px] object-cover shadow-md border-l border-black/10 w-full"
                    />
                  </div>
                ))}
              </div>
              <div className="w-full">
                <div className="book-shelf" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Row */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredBooks.map((book) => (
            <div key={book.id} className="bg-white border border-slate-200 rounded-3xl p-5 flex gap-4 premium-card group">
              <div
                onClick={() => handleBookClick(book)}
                className="w-[95px] shrink-0 cursor-pointer shadow-md overflow-hidden rounded-lg hover:scale-102 transition-transform duration-300"
              >
                <img src={book.coverUrl} alt={book.title} className="w-full h-[130px] object-cover" />
              </div>
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h4
                    onClick={() => handleBookClick(book)}
                    className="font-bold text-slate-800 text-sm md:text-base line-clamp-1 hover:text-primary-600 transition-colors cursor-pointer font-serif"
                  >
                    {book.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">By: {book.author}</p>
                  {book.rating && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{book.rating}</span>
                      {book.reviewsCount && <span className="text-slate-400 font-medium">({book.reviewsCount} Reviews)</span>}
                    </div>
                  )}
                  {book.description && (
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-2 line-clamp-2">{book.description}</p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-200/40 mt-3">
                  <div>
                    <span className="text-slate-800 font-extrabold text-xs">
                      Rp {book.price?.toLocaleString('id-ID')}
                    </span>
                    {book.originalPrice && (
                      <span className="text-slate-400 line-through text-[9px] ml-1.5">
                        Rp {book.originalPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => showToast(`'${book.title}' ditambahkan ke keranjang!`, 'success')}
                    className="button-primary px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer uppercase tracking-wider"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Romance + Shopfront Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_2fr] gap-12">

          {/* Romance */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-[#ece3d5] pb-2">
              <h3 className="text-2xl font-black text-slate-850 font-serif">Romance</h3>
              <button onClick={() => setActivePage('catalog')} className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors bg-white border border-slate-200 px-3 py-1 rounded-md cursor-pointer hover:shadow-2xs">
                Show All
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {romanceGridBooks.map((book, idx) => (
                <div key={book.id ?? idx} className="space-y-2 cursor-pointer group" onClick={() => handleBookClick(book)}>
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-xs bg-slate-100 group-hover:scale-[1.02] transition-all duration-300">
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-800 text-xs line-clamp-1 group-hover:text-primary-600 transition-colors font-serif">{book.title}</h5>
                    <p className="text-[9px] text-slate-400">By: {book.author}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-extrabold text-slate-800">Rp {book.price?.toLocaleString('id-ID')}</span>
                      {book.originalPrice && <span className="text-slate-400 line-through text-[9px]">Rp {book.originalPrice.toLocaleString('id-ID')}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shopfront */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <div className="flex items-end gap-2.5">
                <h3 className="text-2xl font-black text-slate-850 font-serif">Shopfront</h3>
                <span className="text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide mb-1">Bestseller</span>
              </div>
              <button onClick={() => setActivePage('catalog')} className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors bg-white border border-slate-200 px-3 py-1 rounded-md cursor-pointer hover:shadow-2xs">
                Show All
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-4 gap-y-6">
              {shopfrontBooks.map((book, idx) => (
                <div key={book.id ?? idx} onClick={() => handleBookClick(book)} className="space-y-2 cursor-pointer group text-left">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-2xs group-hover:scale-102 transition-all duration-300">
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="font-extrabold text-slate-800 text-[10px] line-clamp-1 group-hover:text-primary-600 transition-colors font-serif leading-none">{book.title}</h5>
                    <p className="text-[8px] text-slate-400 leading-none">By: {book.author}</p>
                    <div className="flex flex-col gap-0.5 pt-0.5">
                      <span className="text-[10px] font-black text-slate-800 leading-none">Rp {book.price?.toLocaleString('id-ID')}</span>
                      {book.originalPrice && <span className="text-slate-400 line-through text-[8px] leading-none">Rp {book.originalPrice.toLocaleString('id-ID')}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Category Section */}
      <section className="max-w-7xl mx-auto px-6 bg-white py-12 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex justify-between items-center mb-8 border-b border-[#ece3d5] pb-2">
          <h3 className="text-2xl font-black text-slate-850 font-serif">Explore all books by category</h3>
          <button onClick={() => setActivePage('catalog')} className="text-xs font-bold text-gold-600 hover:text-gold-700 transition-colors bg-white border border-[#ece3d5] px-3 py-1 rounded-md cursor-pointer">
            Show All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryCards.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => setActivePage('catalog')}
              className={`rounded-2xl border p-5 flex items-center justify-between cursor-pointer group transition-all duration-300 hover:shadow-xs ${cat.bgColor}`}
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
            </div>
          ))}
        </div>
      </section>

      {/* Reading Journal Articles */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8 border-b border-[#ece3d5] pb-2">
          <h3 className="text-2xl font-black text-slate-850 font-serif">From the Reading Journal</h3>
          <button
            onClick={() => setActiveArticle(INITIAL_ARTICLES[0])}
            className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors bg-white border border-slate-200 px-3 py-1 rounded-md cursor-pointer"
          >
            Show All
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_ARTICLES.slice(0, 4).map((art, idx) => (
            <div
              key={idx}
              onClick={() => setActiveArticle(art)}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer group hover:border-primary-300 transition-colors flex flex-col justify-between p-4"
            >
              <div className="space-y-3.5">
                <h4 className="font-extrabold text-slate-800 text-sm line-clamp-2 font-serif group-hover:text-primary-600 transition-colors leading-tight">
                  {art.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                  {art.summary}
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200/40 mt-4">
                {art.authorAvatar && (
                  <img src={art.authorAvatar} alt={art.author} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                )}
                <div>
                  <span className="text-[10px] font-bold text-slate-700 block leading-none">{art.author}</span>
                  <span className="text-[8px] text-slate-400 block mt-0.5">{art.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION BARU: Paket Berlangganan (Subscription Pricing) */}
      <section className="bg-slate-50/60 py-16 border-t border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex justify-center mb-4">
            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-extrabold tracking-wider uppercase border border-blue-200">
              Paket Layanan Pendidikan
            </span>
          </div>

          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Investasi Pengetahuan Tanpa <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Batas Ruang</span>
            </h2>
            <p className="text-slate-500 mt-3 text-xs md:text-sm leading-relaxed">
              Pilih paket berlangganan bulanan yang paling sesuai dengan ritme belajar Anda. Batalkan atau tingkatkan keanggotaan kapan saja dengan mudah.
            </p>
          </div>

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

          <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-left max-w-4xl mx-auto shadow-2xs">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Butuh Paket Kustom atau Akses Sekolah?</h5>
                <p className="text-xs text-slate-500 mt-0.5">Hubungi tim kemitraan kami untuk mendapatkan penawaran khusus institusi formal dan program CSR.</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer shadow-3xs">
              Hubungi Kami
            </button>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          <div className="md:col-span-2 space-y-4">
            <img src="/assets/branding-logo.png" alt="The LOCAL Enablers - e.mind" className="h-16 w-auto object-contain" />
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">Memberdayakan komunitas lokal melalui akses konten berkualitas tinggi. Platform digital library eksklusif dari The LOCAL Enablers.</p>
          </div>
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-[0.15em] text-white">Jelajahi</h5>
            <nav className="space-y-2 text-sm text-slate-400">
              <button onClick={() => setActivePage('home')} className="block hover:text-white transition-colors">Beranda</button>
              <button onClick={() => setActivePage('catalog')} className="block hover:text-white transition-colors">Katalog</button>
              <button onClick={() => setActivePage('my-ebooks')} className="block hover:text-white transition-colors">Ebook Saya</button>
              <button onClick={() => setActivePage('dashboard')} className="block hover:text-white transition-colors">Dashboard</button>
            </nav>
          </div>
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-[0.15em] text-white">Perusahaan</h5>
            <nav className="space-y-2 text-sm text-slate-400">
              <button className="block hover:text-white transition-colors">Tentang Kami</button>
              <button className="block hover:text-white transition-colors">Kontak</button>
              <button className="block hover:text-white transition-colors">Karir</button>
              <button className="block hover:text-white transition-colors">Blog</button>
            </nav>
          </div>
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-[0.15em] text-white">Hubungi</h5>
            <p className="text-sm text-slate-400"><a href="mailto:support@emind.local" className="hover:text-white transition-colors font-semibold">support@emind.local</a></p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
          <p>&copy; 2026 The LOCAL Enablers - e.mind. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}