import React, { useState } from 'react';
import { Star, Search, ArrowRight, ChevronDown, Menu } from 'lucide-react';
import { Ebook } from '../types';
import { INITIAL_ARTICLES } from '../data';

type Props = {
  ebooks: Ebook[];
  popularEbooks: Ebook[];
  setActivePage: (p: any) => void;
  setSelectedEbook: (e: Ebook | null) => void;
  setActiveArticle: (a: any) => void;
  showToast: (msg: string, type?: 'info' | 'success') => void;
};

export default function LandingPage({ ebooks, popularEbooks, setActivePage, setSelectedEbook, setActiveArticle, showToast }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  // Categories helper links from mockup
  const subNavLinks = [
    "What is Roko?", "Books", "eBooks", "Audiobooks", "Fiction", "Nonfiction", 
    "Teens & YA", "Children's", "Highlights", "Psychology", "Science", "Top 100"
  ];

  // Map click on custom mockup books to actual database book detail page
  const handleFeaturedBookClick = (titleKeyword: string) => {
    // Find matching real ebook or fallback to popularEbooks[0]
    const realBook = ebooks.find(
      b => b.title.toLowerCase().includes(titleKeyword.toLowerCase()) || 
           b.author.toLowerCase().includes(titleKeyword.toLowerCase())
    ) || ebooks[0];

    if (realBook) {
      setSelectedEbook(realBook);
      setActivePage('detail');
    }
  };

  // Mock list of books to match Roko.reads screenshot
  const heroBooks = [
    {
      title: "The Last Thing He Told Me",
      author: "Laura Dave",
      cover: "https://picsum.photos/seed/book-hero-1/500/700",
      keyword: "Teras" // Map to Filosofi Teras
    },
    {
      title: "Sprint",
      author: "Jake Knapp",
      cover: "https://picsum.photos/seed/book-hero-2/500/700",
      keyword: "React" // Map to Belajar React
    }
  ];

  const featuredDetailedBooks = [
    {
      id: "f-1",
      title: "Lily and the Octopus",
      author: "Steven Rowley",
      rating: 4.9,
      reviewsCount: 892,
      desc: "Touching fresh energetic wonder fully moving story of a man, his dog, and the octopus that takes up residence on the dog's head.",
      price: 30000,
      oldPrice: 37000,
      cover: "https://picsum.photos/seed/book-feature-1/500/700",
      keyword: "Gadis"
    },
    {
      id: "f-2",
      title: "Harry Potter and the Sorcerer's Stone",
      author: "J.K. Rowling",
      rating: 4.9,
      reviewsCount: 1540,
      desc: "An orphan learns on his eleventh birthday that he is the son of two powerful wizards and possesses unique magical powers.",
      price: 22000,
      oldPrice: 37000,
      cover: "https://picsum.photos/seed/book-feature-2/500/700",
      keyword: "Laskar"
    },
    {
      id: "f-3",
      title: "Birthright",
      author: "A. Roger Ekirch",
      rating: 4.8,
      reviewsCount: 421,
      desc: "A gripping account of the kidnap and enslavement of an aristocratic boy in early modern Ireland and his fight for justice.",
      price: 28000,
      oldPrice: 35000,
      cover: "https://picsum.photos/seed/book-feature-3/500/700",
      keyword: "Quantum"
    }
  ];

  const shopfrontBooks = [
    { title: "Beyond Diversity", author: "Emily Robbins", price: 32000, oldPrice: 37000, cover: "https://picsum.photos/seed/book-shop-1/400/560", keyword: "Bisnis" },
    { title: "Everything is F*cked", author: "Emily Robbins", price: 23000, oldPrice: 37000, cover: "https://picsum.photos/seed/book-shop-2/400/560", keyword: "Teras" },
    { title: "Hemlock Grove", author: "Brian McGreevy", price: 17000, oldPrice: 27000, cover: "https://picsum.photos/seed/book-shop-3/400/560", keyword: "Gadis" },
    { title: "Design Sprint", author: "Jake Knapp", price: 15000, oldPrice: 27000, cover: "https://picsum.photos/seed/book-shop-4/400/560", keyword: "React" },
    { title: "The Date From Hell", author: "Gwyneth Brand", price: 22000, oldPrice: 30000, cover: "https://picsum.photos/seed/book-shop-5/400/560", keyword: "Laskar" },
    { title: "Everything is F*cked", author: "Emily Robbins", price: 24000, oldPrice: 37000, cover: "https://picsum.photos/seed/book-shop-6/400/560", keyword: "Teras" },
    { title: "Beyond Diversity", author: "Emily Robbins", price: 30000, oldPrice: 37000, cover: "https://picsum.photos/seed/book-shop-7/400/560", keyword: "Bisnis" },
    { title: "Everything is F*cked", author: "Emily Robbins", price: 20000, oldPrice: 27000, cover: "https://picsum.photos/seed/book-shop-8/400/560", keyword: "Teras" },
    { title: "Shadow and Bone", author: "Leigh Bardugo", price: 10000, oldPrice: 17000, cover: "https://picsum.photos/seed/book-shop-9/400/560", keyword: "Laskar" },
    { title: "The Shadow King", author: "Maaza Mengiste", price: 24000, oldPrice: 37000, cover: "https://picsum.photos/seed/book-shop-10/400/560", keyword: "Gadis" },
    { title: "The Girl with No Name", author: "Lisa Regan", price: 28000, oldPrice: 35000, cover: "https://picsum.photos/seed/book-shop-11/400/560", keyword: "Quantum" },
    { title: "Three Days at the Brink", author: "Bret Baier", price: 32000, oldPrice: 37000, cover: "https://picsum.photos/seed/book-shop-12/400/560", keyword: "React" }
  ];

  const categoryCards = [
    { 
      name: "Fantasy", 
      bgColor: "bg-[#e3eff8] text-sky-900 border-[#cbe1f2]",
      covers: [
        "https://picsum.photos/seed/book-cat-1/300/420",
        "https://picsum.photos/seed/book-cat-2/300/420",
        "https://picsum.photos/seed/book-cat-3/300/420"
      ]
    },
    { 
      name: "Romance", 
      bgColor: "bg-[#f6eee5] text-[#7d5c41] border-[#eadcd0]",
      covers: [
        "https://picsum.photos/seed/book-cat-4/300/420",
        "https://picsum.photos/seed/book-cat-5/300/420",
        "https://picsum.photos/seed/book-cat-6/300/420"
      ]
    },
    { 
      name: "Childrens", 
      bgColor: "bg-[#edf2e8] text-emerald-900 border-[#dce6d5]",
      covers: [
        "https://picsum.photos/seed/book-cat-7/300/420",
        "https://picsum.photos/seed/book-cat-8/300/420",
        "https://picsum.photos/seed/book-cat-9/300/420"
      ]
    },
    { 
      name: "Mystery", 
      bgColor: "bg-[#f2ece8] text-rose-900 border-[#e8ded8]",
      covers: [
        "https://picsum.photos/seed/book-cat-10/300/420",
        "https://picsum.photos/seed/book-cat-11/300/420",
        "https://picsum.photos/seed/book-cat-12/300/420"
      ]
    }
  ];

  const romanceGridBooks = [
    { title: "Lily and the Octopus", author: "Shari Lapena", price: 42000, oldPrice: 49000, cover: "https://picsum.photos/seed/book-grid-1/320/440", keyword: "Gadis" },
    { title: "Lily and the Octopus", author: "Emily Robbins", price: 16000, oldPrice: 17000, cover: "https://picsum.photos/seed/book-grid-2/320/440", keyword: "Gadis" },
    { title: "Lily and the Octopus", author: "Neil DeGrasse Tyson", price: 21000, oldPrice: 27000, cover: "https://picsum.photos/seed/book-grid-3/320/440", keyword: "Quantum" },
    { title: "Solo Trip", author: "Shari Lapena", price: 41000, oldPrice: 46000, cover: "https://picsum.photos/seed/book-grid-4/320/440", keyword: "Laskar" },
    { title: "Hawk Mountain", author: "Conner Habib", price: 12000, oldPrice: 27000, cover: "https://picsum.photos/seed/book-grid-5/320/440", keyword: "React" },
    { title: "Not a Happy Family", author: "Shari Lapena", price: 12000, oldPrice: 19000, cover: "https://picsum.photos/seed/book-grid-6/320/440", keyword: "Teras" }
  ];

  const journalArticles = [
    {
      title: "Books to help cope with the heat",
      summary: "Tried ice packs, cold drinks, a bunkering down in the shade?",
      author: "Julie Shervill",
      date: "Jun 12, 2026",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80"
    },
    {
      title: "I'm an adult who reads Young",
      summary: "Tried ice packs, cold drinks, a bunkering down in the shade?",
      author: "Richard Barnes",
      date: "May 25, 2026",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80"
    },
    {
      title: "The one, absolute must-read book",
      summary: "Tried ice packs, cold drinks, a bunkering down in the shade?",
      author: "Allie Hillard",
      date: "Apr 18, 2026",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=80"
    },
    {
      title: "Why we picked books for you?",
      summary: "Tried ice packs, cold drinks, a bunkering down in the shade?",
      author: "George Orwell",
      date: "Feb 10, 2026",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80"
    }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActivePage('catalog');
    }
  };

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
            
            {/* Hero Left Content */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight font-serif tracking-tight glow-text">
                Ruang Nyaman<br />Cari Bacaan Favoritmu
              </h2>
              <p className="text-sm text-slate-500 font-medium tracking-wide">
              Transformasi Bisnis, Tim, dan Diri Anda dengan Modul Inovasi yang Dirancang untuk Menciptakan Impact!
              </p>

              {/* Custom Search Box */}
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

              {/* Trustpilot Score Badge */}
              <div className="pt-6 flex flex-col gap-1.5 border-t border-slate-200 w-fit">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                  <span>Trustpilot</span>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="w-5 h-5 bg-[#00b67a] flex items-center justify-center text-white text-[11px] font-bold rounded-[3px]">
                      ★
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  TrustScore 4.8 | 37,894 reviews on
                </span>
              </div>
            </div>

            {/* Hero Right: 3D Bookshelf */}
            <div className="relative flex flex-col justify-end items-center h-[260px] md:h-[300px] w-full">
              <div className="flex items-end gap-6 z-10 mb-[16px]">
                {heroBooks.map((hb, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleFeaturedBookClick(hb.keyword)}
                    className="w-[105px] md:w-[135px] relative group cursor-pointer transition-all duration-500 hover:-translate-y-3"
                  >
                    {/* Shadow underneath individual book cover */}
                    <div className="absolute inset-x-2 -bottom-2 h-4 bg-black/30 blur-md rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                    
                    <img 
                      src={hb.cover} 
                      alt={hb.title} 
                      className="rounded-r-[4px] rounded-l-[1px] object-cover shadow-md border-l border-black/10 w-full"
                    />
                  </div>
                ))}
              </div>
              
              {/* Wooden Shelf */}
              <div className="w-full">
                <div className="book-shelf" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Featured Row (Horizontal Cards) */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredDetailedBooks.map((fb) => (
            <div 
              key={fb.id}
              className="bg-white border border-slate-200 rounded-3xl p-5 flex gap-4 premium-card group"
            >
              {/* Cover */}
              <div 
                onClick={() => handleFeaturedBookClick(fb.keyword)}
                className="w-[95px] shrink-0 cursor-pointer shadow-md overflow-hidden rounded-lg hover:scale-102 transition-transform duration-300"
              >
                <img src={fb.cover} alt={fb.title} className="w-full h-[130px] object-cover" />
              </div>

              {/* Info & Button */}
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h4 
                    onClick={() => handleFeaturedBookClick(fb.keyword)}
                    className="font-bold text-slate-800 text-sm md:text-base line-clamp-1 hover:text-primary-600 transition-colors cursor-pointer font-serif"
                  >
                    {fb.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">By: {fb.author}</p>
                  
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{fb.rating}</span>
                    <span className="text-slate-400 font-medium">({fb.reviewsCount} Reviews)</span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed mt-2 line-clamp-2">
                    {fb.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/40 mt-3">
                  <div>
                    <span className="text-slate-800 font-extrabold text-xs">
                      Rp {fb.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-slate-400 line-through text-[9px] ml-1.5">
                      Rp {fb.oldPrice.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <button 
                    onClick={() => {
                      const realBook = ebooks.find(b => b.title.toLowerCase().includes(fb.keyword.toLowerCase())) || ebooks[0];
                      if (realBook) {
                        showToast(`'${realBook.title}' ditambahkan ke keranjang!`, 'success');
                      }
                    }}
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

      {/* Grid Section: Romance Section (Left) and Shopfront Section (Right) */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_2fr] gap-12">
          
          {/* Left Column: Romance Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-[#ece3d5] pb-2">
              <h3 className="text-2xl font-black text-slate-850 font-serif">Romance</h3>
              <button 
                onClick={() => setActivePage('catalog')}
                className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors bg-white border border-slate-200 px-3 py-1 rounded-md cursor-pointer hover:shadow-2xs"
              >
                Show All
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {romanceGridBooks.map((rb, idx) => (
                <div 
                  key={idx} 
                  className="space-y-2 cursor-pointer group"
                  onClick={() => handleFeaturedBookClick(rb.keyword)}
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-xs bg-slate-100 group-hover:scale-[1.02] transition-all duration-300">
                    <img src={rb.cover} alt={rb.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-800 text-xs line-clamp-1 group-hover:text-primary-600 transition-colors font-serif">
                      {rb.title}
                    </h5>
                    <p className="text-[9px] text-slate-400">By: {rb.author}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-extrabold text-slate-800">
                        Rp {rb.price.toLocaleString('id-ID')}
                      </span>
                      <span className="text-slate-400 line-through text-[9px]">
                        Rp {rb.oldPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Shopfront Bestsellers Grid */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <div className="flex items-end gap-2.5">
                <h3 className="text-2xl font-black text-slate-850 font-serif">Shopfront</h3>
                <span className="text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide mb-1">
                  Bestseller
                </span>
              </div>
              <button 
                onClick={() => setActivePage('catalog')}
                className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors bg-white border border-slate-200 px-3 py-1 rounded-md cursor-pointer hover:shadow-2xs"
              >
                Show All
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-4 gap-y-6">
              {shopfrontBooks.map((sb, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleFeaturedBookClick(sb.keyword)}
                  className="space-y-2 cursor-pointer group text-left"
                >
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-2xs group-hover:scale-102 transition-all duration-300">
                    <img src={sb.cover} alt={sb.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="font-extrabold text-slate-800 text-[10px] line-clamp-1 group-hover:text-primary-600 transition-colors font-serif leading-none">
                      {sb.title}
                    </h5>
                    <p className="text-[8px] text-slate-400 leading-none">By: {sb.author}</p>
                    <div className="flex flex-col gap-0.5 pt-0.5">
                      <span className="text-[10px] font-black text-slate-800 leading-none">
                        Rp {sb.price.toLocaleString('id-ID')}
                      </span>
                      <span className="text-slate-400 line-through text-[8px] leading-none">
                        Rp {sb.oldPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Explore Books by Category Section (3D Stacked Covers) */}
      <section className="max-w-7xl mx-auto px-6 bg-white py-12 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex justify-between items-center mb-8 border-b border-[#ece3d5] pb-2">
          <h3 className="text-2xl font-black text-slate-850 font-serif">Explore all books by category</h3>
          <button 
            onClick={() => setActivePage('catalog')}
            className="text-xs font-bold text-gold-600 hover:text-gold-700 transition-colors bg-white border border-[#ece3d5] px-3 py-1 rounded-md cursor-pointer"
          >
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

              {/* 3D Stacked Book Covers Container */}
              <div className="fanned-container shrink-0">
                {cat.covers.map((cUrl, cIdx) => (
                  <img 
                    key={cIdx}
                    src={cUrl} 
                    alt="Cover"
                    className={`fanned-book fanned-book-${cIdx + 1}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* From the Reading Journal (Articles) */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8 border-b border-[#ece3d5] pb-2">
          <h3 className="text-2xl font-black text-slate-850 font-serif">From the Reading Journal</h3>
          <button 
            onClick={() => {
              // Redirect to first article or similar
              setActiveArticle(INITIAL_ARTICLES[0]);
            }}
            className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors bg-white border border-slate-200 px-3 py-1 rounded-md cursor-pointer"
          >
            Show All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {journalArticles.map((art, idx) => (
            <div 
              key={idx}
              onClick={() => {
                // Find matching loaded real article payload or show first
                const articleMatch = INITIAL_ARTICLES[idx % INITIAL_ARTICLES.length];
                setActiveArticle(articleMatch);
              }}
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
                <img 
                  src={art.avatar} 
                  alt={art.author} 
                  className="w-8 h-8 rounded-full object-cover border border-slate-200" 
                />
                <div>
                  <span className="text-[10px] font-bold text-slate-700 block leading-none">{art.author}</span>
                  <span className="text-[8px] text-slate-400 block mt-0.5">{art.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The LOCAL Enablers Premium Footer */}
      <footer className="mt-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <img src="/assets/branding-logo.png" alt="The LOCAL Enablers - e.mind" className="h-16 w-auto object-contain" />
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">Memberdayakan komunitas lokal melalui akses konten berkualitas tinggi. Platform digital library eksklusif dari The LOCAL Enablers.</p>
          </div>
          {/* Navigation */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-[0.15em] text-white">Jelajahi</h5>
            <nav className="space-y-2 text-sm text-slate-400">
              <button onClick={() => { setActivePage('home'); }} className="block hover:text-white transition-colors">Beranda</button>
              <button onClick={() => { setActivePage('catalog'); }} className="block hover:text-white transition-colors">Katalog</button>
              <button onClick={() => { setActivePage('my-ebooks'); }} className="block hover:text-white transition-colors">Ebook Saya</button>
              <button onClick={() => { setActivePage('dashboard'); }} className="block hover:text-white transition-colors">Dashboard</button>
            </nav>
          </div>
          {/* Company */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-[0.15em] text-white">Perusahaan</h5>
            <nav className="space-y-2 text-sm text-slate-400">
              <button className="block hover:text-white transition-colors">Tentang Kami</button>
              <button className="block hover:text-white transition-colors">Kontak</button>
              <button className="block hover:text-white transition-colors">Karir</button>
              <button className="block hover:text-white transition-colors">Blog</button>
            </nav>
          </div>
          {/* Contact */}
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
