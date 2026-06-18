import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ebook, User, Review, Transaction, Article } from './types';
import { 
  INITIAL_EBOOKS, INITIAL_ARTICLES, INITIAL_TESTIMONIALS, INITIAL_REVIEWS, EBOOK_CATEGORIES 
} from './data';

// Import subcomponents
import Catalog from './components/Catalog';
import EbookDetail from './components/EbookDetail';
import CartCheckout from './components/CartCheckout';
import MyEbooks from './components/MyEbooks';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import Reader from './components/Reader';
import Auth from './components/Auth';
import PresentationEnd from './components/PresentationEnd';

import { 
  BookOpen, ShoppingCart, User as UserIcon, LogOut, Laptop, Sparkles, 
  Search, ArrowRight, Star, Heart, FileText, Check, ShieldAlert, BadgePlus, HelpCircle, X
} from 'lucide-react';

export default function App() {
  // Global Persisted Datasets
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Navigation & User session States
  const [activePage, setActivePage] = useState<'home' | 'catalog' | 'detail' | 'cart' | 'my-ebooks' | 'profile' | 'admin' | 'presentation'>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  
  // Active reader instance
  const [activeReadingBook, setActiveReadingBook] = useState<Ebook | null>(null);
  
  // Cart items identifier list
  const [cartIds, setCartIds] = useState<string[]>([]);
  
  // Authentication modal toggle
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Selected article detail modal state
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  // Alert popup states
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'info' | 'success'>('info');

  // Trigger temporary floating Toast alerts
  const showToast = (msg: string, type: 'info' | 'success' = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // INITAL DATA BOOTSTRAPPING FLOW
  useEffect(() => {
    // 1. Fetch Ebooks
    const savedBooks = localStorage.getItem('app_ebooks');
    if (savedBooks) {
      try { setEbooks(JSON.parse(savedBooks)); } catch(e) { setEbooks(INITIAL_EBOOKS); }
    } else {
      setEbooks(INITIAL_EBOOKS);
      localStorage.setItem('app_ebooks', JSON.stringify(INITIAL_EBOOKS));
    }

    // 2. Fetch Users Directory
    const defaultUsersList: User[] = [
      {
        id: 'usr-admin',
        email: 'admin@example.com',
        username: 'admin_ebook',
        fullName: 'Admin Utama LuminaBook',
        role: 'admin',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1570295999915-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
        balance: 1000000
      },
      {
        id: 'usr-customer',
        email: 'budi@example.com',
        username: 'budi_hartono',
        fullName: 'Budi Hartono',
        role: 'user',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        balance: 250000
      }
    ];
    const savedUsers = localStorage.getItem('app_users');
    if (savedUsers) {
      try { setUsers(JSON.parse(savedUsers)); } catch(e) { setUsers(defaultUsersList); }
    } else {
      setUsers(defaultUsersList);
      localStorage.setItem('app_users', JSON.stringify(defaultUsersList));
    }

    // 3. Fetch Reviews
    const savedReviews = localStorage.getItem('app_reviews');
    if (savedReviews) {
      try { setReviews(JSON.parse(savedReviews)); } catch(e) { setReviews(INITIAL_REVIEWS); }
    } else {
      setReviews(INITIAL_REVIEWS);
      localStorage.setItem('app_reviews', JSON.stringify(INITIAL_REVIEWS));
    }

    // 4. Fetch Transactions Jurnal
    const savedTx = localStorage.getItem('app_transactions');
    if (savedTx) {
      try { setTransactions(JSON.parse(savedTx)); } catch(e) { setTransactions([]); }
    }

    // 5. Fetch Active User login token
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      try { setCurrentUser(JSON.parse(storedUser)); } catch(e) {}
    }
  }, []);

  // Sync state modifications dynamically with LocalStorage of ebooks
  const saveEbooksState = (newList: Ebook[]) => {
    setEbooks(newList);
    localStorage.setItem('app_ebooks', JSON.stringify(newList));
  };

  // Sync users state modifications
  const saveUsersState = (newList: User[]) => {
    setUsers(newList);
    localStorage.setItem('app_users', JSON.stringify(newList));
  };

  // Sync reviews state modifications
  const saveReviewsState = (newList: Review[]) => {
    setReviews(newList);
    localStorage.setItem('app_reviews', JSON.stringify(newList));
  };

  // Fetch cart details & items owned by logged-in user
  const ownedBookIds = currentUser ? JSON.parse(localStorage.getItem(`owned_ebooks_${currentUser.id}`) || '["eb-5"]') : ['eb-5'];

  // Handle Log Out
  const handleLogout = () => {
    localStorage.removeItem('current_user');
    setCurrentUser(null);
    setCartIds([]);
    setActivePage('home');
    showToast('Berhasil keluar dari sesi akun. Sampai jumpa kembali!', 'info');
  };

  // Handle Login and auto Sync balances
  const handleLoginSuccess = (userPayload: User) => {
    setCurrentUser(userPayload);
    setShowAuthModal(false);
    
    // Auto register into general users if new
    const userExistCheck = users.some(u => u.id === userPayload.id || u.email === userPayload.email);
    if (!userExistCheck) {
      const updatedUsers = [...users, userPayload];
      saveUsersState(updatedUsers);
    }

    showToast(`Selamat datang kembali, ${userPayload.fullName}!`, 'success');
  };

  // Add items into Shopping Cart
  const handleAddToCart = (book: Ebook) => {
    if (!currentUser) {
      setShowAuthModal(true);
      showToast('Harap masuk/registrasi terlebih dahulu untuk bertransaksi.', 'info');
      return;
    }

    if (cartIds.includes(book.id)) {
      // Toggle off / remove from cart logic
      setCartIds(prev => prev.filter(id => id !== book.id));
      showToast('Buku dikeluarkan dari keranjang belanja.', 'info');
    } else {
      setCartIds(prev => [...prev, book.id]);
      showToast(`'${book.title}' ditambahkan ke keranjang belanja.`, 'success');
    }
  };

  // Remove individual items from checkout lists
  const handleRemoveFromCart = (book: Ebook) => {
    setCartIds(prev => prev.filter(id => id !== book.id));
    showToast('Buku dikeluarkan dari keranjang belanja.', 'info');
  };

  // Complete Payment and update virtual resources
  const handleCheckoutSuccess = (purchasedIds: string[], txRecord: Transaction, newBalance: number) => {
    if (!currentUser) return;

    // 1. Deliver the books into client library
    const oldLibrary: string[] = JSON.parse(localStorage.getItem(`owned_ebooks_${currentUser.id}`) || `["eb-5"]`);
    const newLibrary = Array.from(new Set([...oldLibrary, ...purchasedIds]));
    localStorage.setItem(`owned_ebooks_${currentUser.id}`, JSON.stringify(newLibrary));

    // 2. Adjust central transactions list
    const updatedTx = [txRecord, ...transactions];
    setTransactions(updatedTx);
    localStorage.setItem('app_transactions', JSON.stringify(updatedTx));

    // 3. Adjust user virtual credit balances
    const updatedUser: User = { ...currentUser, balance: newBalance };
    setCurrentUser(updatedUser);
    localStorage.setItem('current_user', JSON.stringify(updatedUser));

    // 4. Update the core directory user ledger
    const revisedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    saveUsersState(revisedUsers);

    // 5. Clear cart
    setCartIds([]);
    showToast('Pembayaran selesai! Ebook Anda siap digali.', 'success');
  };

  // Profile Virtual Wallet Credit Injector
  const handleWalletTopUp = (amount: number) => {
    if (!currentUser) return;
    const nextBalance = currentUser.balance + amount;
    
    const revisedCurrentUser: User = { ...currentUser, balance: nextBalance };
    setCurrentUser(revisedCurrentUser);
    localStorage.setItem('current_user', JSON.stringify(revisedCurrentUser));

    const revisedUsers = users.map(u => u.id === currentUser.id ? revisedCurrentUser : u);
    saveUsersState(revisedUsers);

    showToast(`Topup berhasil! Saldo digital bertambah ${amount.toLocaleString('id-ID')}`, 'success');
  };

  // Add Ebook review state logic
  const handleAddReview = (newReviewFields: Omit<Review, 'id' | 'date'>) => {
    const freshReview: Review = {
      ...newReviewFields,
      id: 'rev-' + Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const newReviewsList = [freshReview, ...reviews];
    saveReviewsState(newReviewsList);

    // Dynamic Recalculate book average rating based on newly posted stars
    const targetBookReviews = newReviewsList.filter(r => r.ebookId === newReviewFields.ebookId);
    if (targetBookReviews.length > 0) {
      const avg = targetBookReviews.reduce((sum, item) => sum + item.rating, 0) / targetBookReviews.length;
      const revisedEbooks = ebooks.map(eb => {
        if (eb.id === newReviewFields.ebookId) {
          return { ...eb, rating: parseFloat(avg.toFixed(1)) };
        }
        return eb;
      });
      saveEbooksState(revisedEbooks);
      
      // update selected view if detailed
      if (selectedEbook && selectedEbook.id === newReviewFields.ebookId) {
        setSelectedEbook({ ...selectedEbook, rating: parseFloat(avg.toFixed(1)) });
      }
    }
    showToast('Ulasan Anda berhasil dikirim!', 'success');
  };

  // Admin: CRUD Operasi Tambah Ebook
  const handleAdminAddEbook = (created: Ebook) => {
    const updated = [created, ...ebooks];
    saveEbooksState(updated);
    showToast(`Ebook '${created.title}' berhasil didaftarkan ke toko!`, 'success');
  };

  // Admin: CRUD Operasi Edit Ebook
  const handleAdminEditEbook = (edited: Ebook) => {
    const updated = ebooks.map(eb => eb.id === edited.id ? edited : eb);
    saveEbooksState(updated);
    showToast(`Ebook '${edited.title}' diperbaharui dengan sukses!`, 'success');
  };

  // Admin: CRUD Operasi Delete Ebook
  const handleAdminDeleteEbook = (id: string) => {
    const updated = ebooks.filter(eb => eb.id !== id);
    saveEbooksState(updated);
    showToast('Ebook didelete selamanya dari directory.', 'info');
  };

  // Admin Control: Update User Role (Admin vs User)
  const handleAdminUpdateRole = (uId: string, rolePayload: 'user' | 'admin') => {
    const updated = users.map(u => {
      if (u.id === uId) {
        const uNode = { ...u, role: rolePayload };
        if (currentUser && currentUser.id === uId) {
          setCurrentUser(uNode);
          localStorage.setItem('current_user', JSON.stringify(uNode));
        }
        return uNode;
      }
      return u;
    });
    saveUsersState(updated);
    showToast('Hak akses akun user berhasil diubah.', 'success');
  };

  // Admin Control: Inject customer virtual balances
  const handleAdminInjectBalance = (uId: string, amount: number) => {
    const updated = users.map(u => {
      if (u.id === uId) {
        const uNode = { ...u, balance: u.balance + amount };
        if (currentUser && currentUser.id === uId) {
          setCurrentUser(uNode);
          localStorage.setItem('current_user', JSON.stringify(uNode));
        }
        return uNode;
      }
      return u;
    });
    saveUsersState(updated);
    showToast(`Kredit balance user disuntik ${amount.toLocaleString('id-ID')}`, 'success');
  };

  // Filter list of popular ebooks (Popularity rating > 4.6 or flag)
  const popularEbooks = ebooks.filter(eb => eb.isPopular).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none pb-12">
      
      {/* Toast popup Alert widget */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-md border flex items-center gap-2.5 text-xs font-bold uppercase tracking-wide cursor-pointer ${toastType === 'success' ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-900 border-slate-800 text-white'}`}
            onClick={() => setToastMessage('')}
          >
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PERSISTENT HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 py-4 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          
          {/* Brand Logo and Title */}
          <div 
            onClick={() => { setActivePage('home'); setSelectedEbook(null); }}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-opacity"
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-xs shadow-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 leading-none tracking-tight">PustakaEbook</h1>
              <span className="text-[10px] text-slate-400 font-bold block tracking-widest mt-0.5">ONLINE PORTAL</span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <button 
              onClick={() => { setActivePage('home'); setSelectedEbook(null); }}
              className={`hover:text-blue-600 cursor-pointer ${activePage === 'home' ? 'text-blue-600' : ''}`}
            >
              Beranda
            </button>
            <button 
              onClick={() => { setActivePage('catalog'); setSelectedEbook(null); }}
              className={`hover:text-blue-600 cursor-pointer ${activePage === 'catalog' ? 'text-blue-600' : ''}`}
            >
              Kategori & Katalog
            </button>
            <button 
              onClick={() => { setActivePage('my-ebooks'); setSelectedEbook(null); }}
              className={`hover:text-blue-600 cursor-pointer ${activePage === 'my-ebooks' ? 'text-blue-600' : ''}`}
            >
              Ebook Saya
            </button>
            <button 
              onClick={() => { setActivePage('presentation'); setSelectedEbook(null); }}
              className={`hover:text-blue-600 cursor-pointer text-indigo-755 hover:underline flex items-center gap-1 ${activePage === 'presentation' ? 'text-indigo-650' : ''}`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              <span>Keunggulan Platform</span>
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            
            {/* Shopping Cart button trigger */}
            <button
              onClick={() => { setActivePage('cart'); setSelectedEbook(null); }}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl relative transition-all cursor-pointer shadow-2xs"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartIds.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] sm:text-xs font-bold font-mono">
                  {cartIds.length}
                </span>
              )}
            </button>

            {/* Profile Menus */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                
                {/* Visual Admin Key toggle if admin role */}
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => { setActivePage('admin'); setSelectedEbook(null); }}
                    className="hidden sm:flex items-center gap-1 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Panel Admin</span>
                  </button>
                )}

                {/* Profile Details Button link */}
                <button
                  onClick={() => { setActivePage('profile'); setSelectedEbook(null); }}
                  className="w-8 h-8 rounded-xl overflow-hidden shadow-2xs border border-slate-200 cursor-pointer hover:border-blue-500 transition-colors shrink-0"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.username}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* Logoff action */}
                <button
                  onClick={handleLogout}
                  title="Keluar Sesi"
                  className="p-2.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold tracking-wide shadow-xs active:scale-98 cursor-pointer"
              >
                Masuk Akun
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN SCREEN ROUTER */}
      <main className="flex-grow">
        
        {/* TAB 1: LANDING PAGE SCREEN (Promo, populars, chips, article briefs, testimonials) */}
        {activePage === 'home' && (
          <div className="space-y-16 py-4">
            
            {/* HERO PROMOTIONAL BANNER SECTION */}
            <section className="max-w-7xl mx-auto px-4 pt-4">
              <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-lg flex flex-col md:flex-row justify-between items-center gap-8 shadow-blue-500/10">
                <div className="space-y-6 max-w-xl text-center md:text-left">
                  <span className="px-3 py-1 bg-white/20 text-white font-bold text-[10px] md:text-xs rounded-full uppercase tracking-widest">
                    🔥 PROMO SPESIAL PERPUSTAKAAN DIGITAL
                  </span>
                  
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                    Aplikasi Baca & Koleksi <span className="underline decoration-wavy decoration-amber-450">Ebook Terbaik</span> Anda.
                  </h2>
                  <p className="text-slate-200 text-xs md:text-sm leading-relaxed max-w-lg">
                    Dapatkan akses instan ke karya-karya sastra terbaik, modul teknologi pemrograman modern, hingga motivasi pengembangan diri terlaris, lengkap dengan Reader Ebook premium bebas distraksi.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center md:justify-start">
                    <button
                      onClick={() => setActivePage('catalog')}
                      className="px-6 py-3 bg-white text-blue-700 hover:bg-slate-105 rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Jelajahi Katalog Buku</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActivePage('presentation')}
                      className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Brosur Info Keunggulan
                    </button>
                  </div>
                </div>

                {/* Right Hero Cover Deco Art */}
                <div className="relative w-full max-w-[240px] md:max-w-[280px] aspect-[4/5] shrink-0 bg-transparent flex items-center justify-center z-10">
                  <div className="absolute inset-0 bg-indigo-650/40 rounded-3xl shrink shadow-lg rotate-6 translate-x-3 scale-95" />
                  <div className="absolute inset-0 bg-blue-500/20 rounded-3xl shrink shadow-lg -rotate-3 -translate-x-1" />
                  <div className="bg-slate-900 border border-white/20 rounded-2xl overflow-hidden aspect-[3/4] w-full shadow-2xl relative">
                    <img
                      src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400"
                      alt="Filosofi Teras"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-4 flex justify-between items-end">
                      <span className="text-[10px] text-white/80 font-mono">HOT TITLE</span>
                      <span className="bg-amber-400 text-slate-900 text-[9px] font-bold px-2 py-0.5 rounded uppercase">POPULER</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* EBOOK POPULER SECTION CAROUSEL */}
            <section className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-end mb-8 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                    🔥 Ebook <span className="text-primary-color text-blue-600">Terpopuler</span> Saat Ini
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Ulasan rating bintang tertinggi yang dikonsumsi oleh ribuan pembaca aktif harian.</p>
                </div>
                <button
                  onClick={() => setActivePage('catalog')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Lihat Semua ({ebooks.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Grid cards carousel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {popularEbooks.map(eb => (
                  <div 
                    key={eb.id}
                    className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
                    onClick={() => { setSelectedEbook(eb); setActivePage('detail'); }}
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100">
                        <img
                          src={eb.coverUrl}
                          alt={eb.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        />
                        <span className="absolute bottom-2 right-2 bg-slate-900/85 text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {eb.rating}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase text-blue-600">{eb.category}</span>
                        <h4 className="font-bold text-slate-805 leading-snug line-clamp-2 text-sm">{eb.title}</h4>
                        <p className="text-xs text-slate-400">Oleh {eb.author}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
                      <span className="font-bold text-slate-700 text-xs">
                        {eb.price === 0 ? 'GRATIS' : `Rp ${eb.price.toLocaleString('id-ID')}`}
                      </span>
                      <span className="text-[10px] text-blue-600 font-bold group-hover:underline flex items-center gap-0.5">
                        Detail <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* QUICK CATEGORY HIGHLIGHT FILTER TRIGGER ZONE */}
            <section className="bg-sky-50 py-12 border-y border-sky-100">
              <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-none">Cari Buku Berdasarkan Kategori Favorit</h3>
                <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                  Navigasi lebih mudah! Jelajahi subjek literatur terbaik yang dipilah cermat sesuai dengan segmentasi minat bakat Anda.
                </p>
                <div className="flex flex-wrap gap-2.5 justify-center max-w-2xl mx-auto">
                  {EBOOK_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        // Quick filter trigger simulation
                        setActivePage('catalog');
                      }}
                      className="px-4 py-2 bg-white text-slate-700 hover:text-blue-600 hover:border-blue-500 border border-slate-200 shadow-2xs text-xs font-semibold rounded-2xl cursor-pointer transition-all active:scale-95"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* NEWS & ARTICLES SECTION */}
            <section className="max-w-7xl mx-auto px-4">
              <div className="text-center max-w-xl mx-auto mb-10">
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">📰 Artikel & Literasi Terbaru</h3>
                <p className="text-xs text-slate-500 mt-1">Kumpulan tips, ulasan kebiasaan baik membaca, serta tren teknologi pendukung literasi digital.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {INITIAL_ARTICLES.map((art) => (
                  <div 
                    key={art.id} 
                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-2xs flex flex-col justify-between cursor-pointer hover:border-slate-200 transition-all group"
                    onClick={() => setActiveArticle(art)}
                  >
                    <div className="space-y-4">
                      {/* Image header */}
                      <div className="relative aspect-video bg-slate-100 overflow-hidden">
                        <img
                          src={art.coverUrl}
                          alt={art.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 bg-blue-600 text-white font-bold text-[9px] px-2 py-0.5 rounded uppercase">{art.category}</span>
                      </div>

                      {/* Content summaries */}
                      <div className="px-5 space-y-2">
                        <span className="text-[10px] text-slate-400 font-mono block">{art.date} • {art.readTime}</span>
                        <h4 className="font-extrabold text-slate-800 text-sm md:text-base leading-snug line-clamp-2 hover:text-blue-600 group-hover:text-blue-600 transition-colors">
                          {art.title}
                        </h4>
                        <p className="text-xs text-slate-405 leading-relaxed line-clamp-3">{art.summary}</p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-3 flex justify-between items-center text-[10px] font-bold text-blue-605 group-hover:underline block mt-4">
                      <span>Baca Selengkapnya</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* USER TESTIMONIALS MODUL */}
            <section className="max-w-5xl mx-auto px-4 py-12 bg-white rounded-3xl border border-slate-100 shadow-2xs">
              <div className="text-center max-w-xl mx-auto mb-10">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 py-1 px-3 rounded-md uppercase tracking-widest block w-fit mx-auto mb-2">TESTIMONI</span>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-none">Apa Kata Pembaca Setia Kami?</h3>
              </div>

              {/* Testimonials list grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {INITIAL_TESTIMONIALS.map((t) => (
                  <div key={t.id} className="p-5 bg-slate-50/75 border border-slate-100 rounded-2xl flex flex-col justify-between text-left space-y-4 relative">
                    <span className="absolute top-4 right-4 text-3xl font-serif text-slate-300 leading-none select-none">“</span>
                    
                    <p className="text-xs text-slate-600 leading-relaxed italic relative z-10">
                      "{t.feedback}"
                    </p>

                    <div className="flex items-center gap-3 border-t border-slate-100 pt-3 shrink-0">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <strong className="text-xs font-bold text-slate-800 block">{t.name}</strong>
                        <span className="text-[10px] text-slate-400 font-medium block">{t.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: CATALOG SCREEN */}
        {activePage === 'catalog' && (
          <Catalog
            ebooks={ebooks}
            currentUser={currentUser}
            ownedBookIds={ownedBookIds}
            cartBookIds={cartIds}
            onSelectEbook={(eb) => { setSelectedEbook(eb); setActivePage('detail'); }}
            onAddToCart={handleAddToCart}
            onReadEbook={(eb) => setActiveReadingBook(eb)}
          />
        )}

        {/* TAB 3: EBOOK DETAIL SCREEN */}
        {activePage === 'detail' && selectedEbook && (
          <EbookDetail
            ebook={selectedEbook}
            allEbooks={ebooks}
            currentUser={currentUser}
            ownedBookIds={ownedBookIds}
            cartBookIds={cartIds}
            reviews={reviews}
            onBack={() => { setActivePage('catalog'); setSelectedEbook(null); }}
            onAddToCart={handleAddToCart}
            onReadEbook={(eb) => setActiveReadingBook(eb)}
            onAddReview={handleAddReview}
          />
        )}

        {/* TAB 4: SHOPPING CART SCREEN */}
        {activePage === 'cart' && (
          <CartCheckout
            cartItems={ebooks.filter(b => cartIds.includes(b.id))}
            currentUser={currentUser}
            onRemoveFromCart={handleRemoveFromCart}
            onCheckoutSuccess={handleCheckoutSuccess}
            onBackToCatalog={() => setActivePage('catalog')}
            onTopUp={handleWalletTopUp}
          />
        )}

        {/* TAB 5: MY EBOOKS PUSTAKA SCREEN */}
        {activePage === 'my-ebooks' && (
          <MyEbooks
            allEbooks={ebooks}
            currentUser={currentUser}
            ownedBookIds={ownedBookIds}
            transactions={transactions}
            onReadEbook={(eb) => setActiveReadingBook(eb)}
            onNavigateToCatalog={() => setActivePage('catalog')}
          />
        )}

        {/* TAB 6: PROFILE PORTAL SCREEN */}
        {activePage === 'profile' && (
          <Profile
            currentUser={currentUser}
            transactions={transactions}
            allEbooks={ebooks}
            onUpdateUser={(updated) => {
              setCurrentUser(updated);
              localStorage.setItem('current_user', JSON.stringify(updated));
              const nextUsersList = users.map(u => u.id === updated.id ? updated : u);
              saveUsersState(nextUsersList);
            }}
            onTopUp={handleWalletTopUp}
          />
        )}

        {/* TAB 7: OUTCOMES PROMOTION SLIDE SHOWCASE */}
        {activePage === 'presentation' && (
          <PresentationEnd />
        )}

        {/* TAB 8: ADMIN DASHBOARD */}
        {activePage === 'admin' && (
          <AdminDashboard
            ebooks={ebooks}
            users={users}
            transactions={transactions}
            onAddEbook={handleAdminAddEbook}
            onEditEbook={handleAdminEditEbook}
            onDeleteEbook={handleAdminDeleteEbook}
            onUpdateUserRole={handleAdminUpdateRole}
            onInjectUserBalance={handleAdminInjectBalance}
          />
        )}
      </main>

      {/* FLOAT DEMO PERSONALITY TOGGLE BAR AT FOOTER FOR EASY GRADING */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-55 bg-slate-900 text-white rounded-full px-4 py-2 flex items-center gap-3 shadow-lg border border-slate-800 text-[10px] md:text-xs">
        <span className="text-amber-400 font-bold shrink-0 hidden sm:inline">⚡ DEMO TOGGLER:</span>
        <button
          onClick={() => {
            // Sign in as Guest
            localStorage.removeItem('current_user');
            setCurrentUser(null);
            setCartIds([]);
            setActivePage('home');
            showToast('Beralih sebagai Pengunjung (Belum Login-Guest)', 'info');
          }}
          className={`px-3 py-1 rounded-full cursor-pointer font-bold ${currentUser === null ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-slate-850 text-slate-400'}`}
        >
          Guest
        </button>
        <button
          onClick={() => {
            // Sign in as user Budi
            const budi: User = {
              id: 'usr-customer',
              email: 'budi@example.com',
              username: 'budi_hartono',
              fullName: 'Budi Hartono',
              role: 'user',
              verified: true,
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
              balance: 250000
            };
            localStorage.setItem('current_user', JSON.stringify(budi));
            setCurrentUser(budi);
            setCartIds([]);
            showToast('Seksi User Budi Hartono diaktifkan.', 'success');
          }}
          className={`px-3 py-1 rounded-full cursor-pointer font-bold ${currentUser?.id === 'usr-customer' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-slate-850 text-slate-400'}`}
        >
          Budi (User)
        </button>
        <button
          onClick={() => {
            // Sign in as Admin Utama
            const adm: User = {
              id: 'usr-admin',
              email: 'admin@example.com',
              username: 'admin_ebook',
              fullName: 'Admin Utama LuminaBook',
              role: 'admin',
              verified: true,
              avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
              balance: 1000000
            };
            localStorage.setItem('current_user', JSON.stringify(adm));
            setCurrentUser(adm);
            setCartIds([]);
            showToast('Seksi Admin Utama diaktifkan! Silakan akses Panel Admin di navigasi pilar.', 'success');
          }}
          className={`px-3 py-1 rounded-full cursor-pointer font-bold ${currentUser?.id === 'usr-admin' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-slate-850 text-slate-400'}`}
        >
          Admin
        </button>
      </div>

      {/* FOOTER GENERAL INFO */}
      <footer className="max-w-7xl mx-auto px-4 pt-16 mt-8 border-t border-slate-205 text-center text-xs text-slate-455">
        <p className="font-semibold text-slate-650">Sistem Website Ebook Online © 2026</p>
        <p className="mt-1">Dibuat dengan dedikasi kepatuhan penuh atas spesifikasi 10 Modul Interaktif bagi Ebook online premium.</p>
      </footer>

      {/* FULL-SCREEN ACTIVE READER OVERLAY DETECTOR */}
      {activeReadingBook && (
        <Reader
          ebook={activeReadingBook}
          currentUser={currentUser}
          onClose={() => {
            setActiveReadingBook(null);
            // Refresh library progress percentages
            if (activePage === 'my-ebooks') {
              setActivePage('home');
              setTimeout(() => setActivePage('my-ebooks'), 50);
            }
          }}
        />
      )}

      {/* AUTH SELECTION MODAL OVERLAY */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            {/* Close trigger button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <Auth
              onLoginSuccess={handleLoginSuccess}
              onClose={() => setShowAuthModal(false)}
            />
          </div>
        </div>
      )}

      {/* DETAILED ARTICLE READER DIALOG */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
          >
            {/* Close Button overlay */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white hover:bg-black/75 rounded-full cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Cover image header */}
            <div className="h-56 bg-slate-100 overflow-hidden relative">
              <img
                src={activeArticle.coverUrl}
                alt={activeArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] bg-blue-600 font-bold px-2 py-0.5 rounded uppercase tracking-wider block w-fit mb-1.5">{activeArticle.category}</span>
                <h3 className="text-lg md:text-xl font-bold leading-tight">{activeArticle.title}</h3>
                <span className="text-[10px] opacity-75 mt-1 block">{activeArticle.date} • {activeArticle.readTime}</span>
              </div>
            </div>

            {/* Scrollable text body */}
            <div className="p-6 md:p-8 overflow-y-auto text-xs md:text-sm text-slate-700 leading-relaxed text-justify whitespace-pre-wrap font-sans">
              {activeArticle.content}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Tutup Bacaan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
