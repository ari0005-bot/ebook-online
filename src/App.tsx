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
  Search, ArrowRight, Star, Heart, FileText, Check, ShieldAlert, BadgePlus, HelpCircle, X,
  Library, Users, Download, ShieldCheck, Zap, Quote, PenTool, Headphones, ChevronRight,
  Instagram, Twitter, Facebook, Youtube, Mail
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
  const featuredEbook = ebooks.find(eb => eb.isPopular) || ebooks[0];

  // Aggregate stats untuk hero/landing band
  const totalReaders = 12400;
  const avgRating = ebooks.length
    ? (ebooks.reduce((sum, eb) => sum + eb.rating, 0) / ebooks.length).toFixed(1)
    : '4.8';
  const landingStats = [
    { value: `${ebooks.length}+`, label: 'Judul Pilihan', icon: Library },
    { value: `${(totalReaders / 1000).toFixed(1)}rb+`, label: 'Pembaca Aktif', icon: Users },
    { value: `${avgRating}`, label: 'Rata-rata Rating', icon: Star },
    { value: '100%', label: 'Akses Selamanya', icon: ShieldCheck },
  ];

  // Keunggulan platform untuk section "mengapa memilih kami"
  const platformFeatures = [
    { icon: BookOpen, title: 'Reader Premium Bebas Distraksi', desc: 'Antarmuka membaca yang bersih dengan kontrol tema, ukuran huruf, dan bookmark cerdas.' },
    { icon: Download, title: 'Koleksi Pribadi Selamanya', desc: 'Sekali beli, ebook langsung tersimpan permanen di pustaka digital pribadi Anda.' },
    { icon: Zap, title: 'Akses Instan & Cepat', desc: 'Mulai membaca dalam hitungan detik setelah checkout, tanpa proses unduh yang ribet.' },
    { icon: ShieldCheck, title: 'Transaksi Aman & Transparan', desc: 'Pembayaran dengan saldo digital yang aman, lengkap dengan riwayat invoice yang rapi.' },
  ];

  // Map kategori ke ikon elegan (lewati "Semua Kategori")
  const categoryIcons: Record<string, typeof BookOpen> = {
    'Pengembangan Diri': Sparkles,
    'Teknologi & Koding': PenTool,
    'Sastra & Fiksi': BookOpen,
    'Bisnis & Finansial': Zap,
    'Edukasi & Sains': Library,
    'Culinary & Hobi': Heart,
  };

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
          <div className="space-y-20 md:space-y-28 pb-8">

            {/* ===== HERO SECTION ===== */}
            <section className="relative overflow-hidden">
              {/* Soft decorative background */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50/80 via-white to-slate-50" />
              <div className="absolute -top-24 -right-24 -z-10 w-[28rem] h-[28rem] bg-indigo-300/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-32 -left-24 -z-10 w-[26rem] h-[26rem] bg-violet-300/20 rounded-full blur-3xl" />

              <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-4 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                {/* Left copy */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="space-y-7 text-center lg:text-left"
                >
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-indigo-100 text-indigo-700 font-bold text-[11px] rounded-full uppercase tracking-widest shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Perpustakaan Digital Premium
                  </span>

                  <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] text-slate-900">
                    Baca, koleksi, dan
                    <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">
                      jatuh cinta pada buku.
                    </span>
                  </h1>

                  <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Ribuan ebook pilihan — dari sastra, pengembangan diri, hingga teknologi — siap dibaca instan dengan pengalaman <span className="text-slate-700 font-semibold">Reader premium bebas distraksi</span>. Semua dalam satu pustaka elegan.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 pt-1 justify-center lg:justify-start">
                    <button
                      onClick={() => setActivePage('catalog')}
                      className="group px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-bold shadow-lg shadow-slate-900/15 cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                      <span>Jelajahi Katalog</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => setActivePage('presentation')}
                      className="px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl text-sm font-bold cursor-pointer transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      Keunggulan Platform
                    </button>
                  </div>

                  {/* Social proof */}
                  <div className="flex items-center gap-4 justify-center lg:justify-start pt-3">
                    <div className="flex -space-x-3">
                      {INITIAL_TESTIMONIALS.slice(0, 4).map((t) => (
                        <img
                          key={t.id}
                          src={t.avatar}
                          alt={t.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ))}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Dipercaya <span className="font-bold text-slate-700">12.400+</span> pembaca aktif
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Right featured book visual */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                  className="relative flex justify-center lg:justify-end"
                >
                  {featuredEbook && (
                    <div className="relative w-full max-w-sm">
                      {/* Glow card */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-[2rem] rotate-6 scale-95 opacity-20 blur-2xl" />
                      <div
                        onClick={() => { setSelectedEbook(featuredEbook); setActivePage('detail'); }}
                        className="relative bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-5 shadow-2xl shadow-indigo-900/10 cursor-pointer hover:-translate-y-1 transition-transform duration-300"
                      >
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                          <img
                            src={featuredEbook.coverUrl}
                            alt={featuredEbook.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-3 left-3 bg-amber-400 text-slate-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide shadow">
                            Pilihan Editor
                          </span>
                        </div>
                        <div className="pt-4 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">{featuredEbook.category}</span>
                          <h3 className="font-extrabold text-slate-900 leading-snug line-clamp-1">{featuredEbook.title}</h3>
                          <div className="flex items-center justify-between pt-1">
                            <p className="text-xs text-slate-400">Oleh {featuredEbook.author}</p>
                            <span className="flex items-center gap-1 text-xs font-bold text-slate-700">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {featuredEbook.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Floating mini badge */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 flex items-center gap-3"
                      >
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                          <Download className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900 leading-none">Akses Instan</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Baca dalam hitungan detik</p>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Stats band */}
              <div className="max-w-6xl mx-auto px-6 mt-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl p-6 shadow-sm">
                  {landingStats.map((s) => (
                    <div key={s.label} className="flex items-center gap-3 justify-center md:justify-start">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <s.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xl font-black text-slate-900 leading-none">{s.value}</p>
                        <p className="text-[11px] text-slate-400 font-semibold mt-1">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ===== POPULAR EBOOKS ===== */}
            <section className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">Trending</span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">Ebook Terpopuler</h2>
                  <p className="text-sm text-slate-500 mt-1.5">Judul dengan rating tertinggi yang sedang dibaca ribuan orang.</p>
                </div>
                <button
                  onClick={() => setActivePage('catalog')}
                  className="self-start sm:self-auto text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 cursor-pointer group"
                >
                  <span>Lihat semua ({ebooks.length})</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                {popularEbooks.map((eb, idx) => (
                  <motion.div
                    key={eb.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    onClick={() => { setSelectedEbook(eb); setActivePage('detail'); }}
                    className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-indigo-100 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="space-y-3.5">
                      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100">
                        <img
                          src={eb.coverUrl}
                          alt={eb.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur text-slate-900 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {eb.rating}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-600">{eb.category}</span>
                        <h3 className="font-bold text-slate-900 leading-snug line-clamp-2 text-sm">{eb.title}</h3>
                        <p className="text-xs text-slate-400">Oleh {eb.author}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex justify-between items-center">
                      <span className="font-black text-slate-900 text-sm">
                        {eb.price === 0 ? 'GRATIS' : `Rp ${eb.price.toLocaleString('id-ID')}`}
                      </span>
                      <span className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white text-slate-400 flex items-center justify-center transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ===== WHY US / FEATURES ===== */}
            <section className="max-w-7xl mx-auto px-6">
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 rounded-[2.5rem] p-8 md:p-14 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
                <div className="relative text-center max-w-2xl mx-auto mb-12">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-300">Mengapa PustakaEbook</span>
                  <h2 className="text-2xl md:text-4xl font-black tracking-tight mt-2">Pengalaman membaca yang dirancang dengan elegan</h2>
                  <p className="text-sm text-slate-400 mt-3 leading-relaxed">Semua yang Anda butuhkan untuk menikmati buku digital, tanpa kompromi.</p>
                </div>
                <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {platformFeatures.map((f) => (
                    <div key={f.title} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-900/40 mb-4">
                        <f.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-base leading-snug">{f.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mt-2">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ===== CATEGORIES ===== */}
            <section className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-xl mx-auto mb-10">
                <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">Telusuri</span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">Jelajahi Berdasarkan Kategori</h2>
                <p className="text-sm text-slate-500 mt-1.5">Temukan genre favorit Anda dengan sekali klik.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {EBOOK_CATEGORIES.filter(c => c !== 'Semua Kategori').map((cat) => {
                  const Icon = categoryIcons[cat] || BookOpen;
                  const count = ebooks.filter(eb => eb.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActivePage('catalog')}
                      className="group flex items-center gap-4 bg-white border border-slate-100 hover:border-indigo-200 rounded-2xl p-5 shadow-sm hover:shadow-lg text-left cursor-pointer transition-all"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-sm text-slate-900 leading-snug">{cat}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">{count} judul tersedia</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ===== ARTICLES ===== */}
            <section className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-xl mx-auto mb-10">
                <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">Literasi</span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">Artikel & Wawasan Terbaru</h2>
                <p className="text-sm text-slate-500 mt-1.5">Tips membaca, ulasan, dan tren literasi digital pilihan.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {INITIAL_ARTICLES.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => setActiveArticle(art)}
                    className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer group"
                  >
                    <div className="relative aspect-video bg-slate-100 overflow-hidden">
                      <img
                        src={art.coverUrl}
                        alt={art.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-indigo-700 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">{art.category}</span>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-[10px] text-slate-400 font-semibold block">{art.date} • {art.readTime}</span>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-2 mt-2 group-hover:text-indigo-600 transition-colors">{art.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mt-2 flex-grow">{art.summary}</p>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 mt-4">
                        <span>Baca selengkapnya</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-xl mx-auto mb-12">
                <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">Testimoni</span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">Kata Pembaca Setia Kami</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {INITIAL_TESTIMONIALS.map((t) => (
                  <div key={t.id} className="relative bg-white border border-slate-100 rounded-3xl p-7 shadow-sm flex flex-col gap-5">
                    <Quote className="w-9 h-9 text-indigo-100 fill-indigo-100" />
                    <p className="text-sm text-slate-600 leading-relaxed flex-grow">"{t.feedback}"</p>
                    <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-full object-cover border-2 border-white shadow"
                      />
                      <div>
                        <strong className="text-sm font-bold text-slate-900 block">{t.name}</strong>
                        <span className="text-[11px] text-slate-400 font-medium block">{t.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ===== FINAL CTA ===== */}
            <section className="max-w-7xl mx-auto px-6">
              <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 rounded-[2.5rem] p-10 md:p-16 text-center text-white shadow-2xl shadow-indigo-500/20">
                <div className="absolute -top-16 -right-10 w-72 h-72 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-black/10 rounded-full blur-2xl" />
                <div className="relative max-w-2xl mx-auto space-y-6">
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">Mulai perjalanan membaca Anda hari ini</h2>
                  <p className="text-sm md:text-base text-indigo-100 leading-relaxed">Bergabunglah dengan ribuan pembaca dan bangun koleksi ebook digital pribadi Anda sekarang.</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <button
                      onClick={() => setActivePage('catalog')}
                      className="px-8 py-3.5 bg-white text-indigo-700 hover:bg-indigo-50 rounded-2xl text-sm font-black shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                      <span>Mulai Jelajahi</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    {!currentUser && (
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-2xl text-sm font-bold cursor-pointer transition-all"
                      >
                        Buat Akun Gratis
                      </button>
                    )}
                  </div>
                </div>
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
      <footer className="mt-12 bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-900/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white leading-none tracking-tight">PustakaEbook</h3>
                <span className="text-[10px] text-slate-500 font-bold block tracking-widest mt-0.5">ONLINE PORTAL</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Perpustakaan digital premium untuk membaca, mengoleksi, dan menikmati ribuan ebook pilihan kapan saja, di mana saja.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" onClick={(e) => e.preventDefault()} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-indigo-600 flex items-center justify-center transition-colors cursor-pointer">
                  <Icon className="w-4 h-4 text-slate-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Links: Jelajahi */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Jelajahi</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => { setActivePage('home'); setSelectedEbook(null); }} className="hover:text-white transition-colors cursor-pointer">Beranda</button></li>
              <li><button onClick={() => { setActivePage('catalog'); setSelectedEbook(null); }} className="hover:text-white transition-colors cursor-pointer">Katalog</button></li>
              <li><button onClick={() => { setActivePage('my-ebooks'); setSelectedEbook(null); }} className="hover:text-white transition-colors cursor-pointer">Ebook Saya</button></li>
              <li><button onClick={() => { setActivePage('presentation'); setSelectedEbook(null); }} className="hover:text-white transition-colors cursor-pointer">Keunggulan</button></li>
            </ul>
          </div>

          {/* Links: Kategori */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Kategori</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {EBOOK_CATEGORIES.filter(c => c !== 'Semua Kategori').slice(0, 4).map(cat => (
                <li key={cat}><button onClick={() => setActivePage('catalog')} className="hover:text-white transition-colors cursor-pointer text-left">{cat}</button></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Kontak</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Punya pertanyaan? Hubungi tim kami.</p>
            <a href="mailto:halo@pustakaebook.id" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-300 hover:text-indigo-200 cursor-pointer">
              <Mail className="w-4 h-4" /> halo@pustakaebook.id
            </a>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-slate-500">
            <p>Sistem Website Ebook Online © 2026. Hak cipta dilindungi.</p>
            <p className="flex items-center gap-1.5">Dibuat dengan <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> untuk para pembaca.</p>
          </div>
        </div>
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
