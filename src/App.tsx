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
import UserDashboard from './components/UserDashboard';
import LandingPage from './components/LandingPage';

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
  const [activePage, setActivePage] = useState<'home' | 'catalog' | 'detail' | 'cart' | 'my-ebooks' | 'profile' | 'dashboard' | 'admin' | 'presentation'>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  
  // Active reader instance
  const [activeReadingBook, setActiveReadingBook] = useState<Ebook | null>(null);
  
  // Cart items identifier list
  const [cartIds, setCartIds] = useState<string[]>([]);
  
  // Authentication modal toggle
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Ensure users see landing page first on initial visit
  const [hasSeenLanding, setHasSeenLanding] = useState<boolean>(() => {
    try {
      return localStorage.getItem('has_seen_landing') === '1';
    } catch (e) { return false; }
  });

  // Selected article detail modal state
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  // Alert popup states
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'info' | 'success'>('info');

  // ===== TAMBAHAN SPLASH SCREEN STATE =====
  const [showSplash, setShowSplash] = useState(true);

  // Trigger temporary floating Toast alerts
  const showToast = (msg: string, type: 'info' | 'success' = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const readStoredJSON = <T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') return fallback;

    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  };

  // INITAL DATA BOOTSTRAPPING FLOW
  useEffect(() => {
    // 1. Fetch Ebooks
    const savedBooks = readStoredJSON<Ebook[]>('app_ebooks', INITIAL_EBOOKS);
    setEbooks(savedBooks);
    localStorage.setItem('app_ebooks', JSON.stringify(savedBooks));

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
    const savedUsers = readStoredJSON<User[]>('app_users', defaultUsersList);
    setUsers(savedUsers);
    localStorage.setItem('app_users', JSON.stringify(savedUsers));

    // 3. Fetch Reviews
    const savedReviews = readStoredJSON<Review[]>('app_reviews', INITIAL_REVIEWS);
    setReviews(savedReviews);
    localStorage.setItem('app_reviews', JSON.stringify(savedReviews));

    // 4. Fetch Transactions Jurnal
    const savedTx = readStoredJSON<Transaction[]>('app_transactions', []);
    setTransactions(savedTx);
    localStorage.setItem('app_transactions', JSON.stringify(savedTx));

    // 5. Fetch Active User login token
    const storedUser = readStoredJSON<User | null>('current_user', null);
    
   if (storedUser) {
  try {
    const parsedUser = JSON.parse(storedUser);
    setCurrentUser(parsedUser);
  } catch (error) {
    console.error(error);
  }
}

    // ===== TAMBAHAN SPLASH SCREEN TIMEOUT =====
    // Splash screen akan menutup setelah 2.5 detik ketika bootstrapping data selesai
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(splashTimer);
  }, []);

  const markSeenLanding = () => {
    try { localStorage.setItem('has_seen_landing', '1'); } catch(e) {}
    setHasSeenLanding(true);
  };

  const saveEbooksState = (newList: Ebook[]) => {
    setEbooks(newList);
    localStorage.setItem('app_ebooks', JSON.stringify(newList));
  };

  const saveUsersState = (newList: User[]) => {
    setUsers(newList);
    localStorage.setItem('app_users', JSON.stringify(newList));
  };

  const saveReviewsState = (newList: Review[]) => {
    setReviews(newList);
    localStorage.setItem('app_reviews', JSON.stringify(newList));
  };

  // Fetch cart details & items owned by logged-in user
  const ownedBookIds = currentUser
    ? readStoredJSON<string[]>(`owned_ebooks_${currentUser.id}`, ['eb-5'])
    : ['eb-5'];

  const handleLogout = () => {
    localStorage.removeItem('current_user');
    setCurrentUser(null);
    setCartIds([]);
    setActivePage('home');
    showToast('Berhasil keluar dari sesi akun. Sampai jumpa kembali!', 'info');
  };

  // HANDLER LOGIN DENGAN REDIRECT AUTOMATIS BERDASARKAN ROLE
  const handleLoginSuccess = (userPayload: User) => {
    setCurrentUser(userPayload);
    setShowAuthModal(false);
    
    const userExistCheck = users.some(u => u.id === userPayload.id || u.email === userPayload.email);
    if (!userExistCheck) {
      const updatedUsers = [...users, userPayload];
      saveUsersState(updatedUsers);
    }

    // Pengecekan Hak Akses Halaman
    if (userPayload.role === 'admin') {
      setActivePage('admin');
      showToast(`Selamat datang Admin, ${userPayload.fullName}!`, 'success');
    } else {
      setActivePage('dashboard');
      showToast(`Selamat datang kembali, ${userPayload.fullName}!`, 'success');
    }
  };

  const handleAddToCart = (book: Ebook) => {
    if (!currentUser) {
      if (!hasSeenLanding) {
        setActivePage('home');
        showToast('Silakan lihat halaman landing terlebih dahulu sebelum melakukan transaksi.', 'info');
        return;
      }
      setShowAuthModal(true);
      showToast('Harap masuk/registrasi terlebih dahulu untuk bertransaksi.', 'info');
      return;
    }

    if (cartIds.includes(book.id)) {
      setCartIds(prev => prev.filter(id => id !== book.id));
      showToast('Buku dikeluarkan dari keranjang belanja.', 'info');
    } else {
      setCartIds(prev => [...prev, book.id]);
      showToast(`'${book.title}' ditambahkan ke keranjang belanja.`, 'success');
    }
  };

  const handleRemoveFromCart = (book: Ebook) => {
    setCartIds(prev => prev.filter(id => id !== book.id));
    showToast('Buku dikeluarkan dari keranjang belanja.', 'info');
  };

  const handleCheckoutSuccess = (purchasedIds: string[], txRecord: Transaction, newBalance: number) => {
    if (!currentUser) return;

    // 1. Deliver the books into client library
    const oldLibrary = readStoredJSON<string[]>(`owned_ebooks_${currentUser.id}`, ['eb-5']);
    const newLibrary = Array.from(new Set([...oldLibrary, ...purchasedIds]));
    localStorage.setItem(`owned_ebooks_${currentUser.id}`, JSON.stringify(newLibrary));

    const updatedTx = [txRecord, ...transactions];
    setTransactions(updatedTx);
    localStorage.setItem('app_transactions', JSON.stringify(updatedTx));

    const updatedUser: User = { ...currentUser, balance: newBalance };
    setCurrentUser(updatedUser);
    localStorage.setItem('current_user', JSON.stringify(updatedUser));

    const revisedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    saveUsersState(revisedUsers);

    setCartIds([]);
    showToast('Pembayaran selesai! Ebook Anda siap digali.', 'success');
  };

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

  const handleAddReview = (newReviewFields: Omit<Review, 'id' | 'date'>) => {
    const freshReview: Review = {
      ...newReviewFields,
      id: 'rev-' + Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const newReviewsList = [freshReview, ...reviews];
    saveReviewsState(newReviewsList);

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
      
      if (selectedEbook && selectedEbook.id === newReviewFields.ebookId) {
        setSelectedEbook({ ...selectedEbook, rating: parseFloat(avg.toFixed(1)) });
      }
    }
    showToast('Ulasan Anda berhasil dikirim!', 'success');
  };

  const handleAdminAddEbook = (created: Ebook) => {
    const updated = [created, ...ebooks];
    saveEbooksState(updated);
    showToast(`Ebook '${created.title}' berhasil didaftarkan ke toko!`, 'success');
  };

  const handleAdminEditEbook = (edited: Ebook) => {
    const updated = ebooks.map(eb => eb.id === edited.id ? edited : eb);
    saveEbooksState(updated);
    showToast(`Ebook '${edited.title}' diperbaharui dengan sukses!`, 'success');
  };

  const handleAdminDeleteEbook = (id: string) => {
    const updated = ebooks.filter(eb => eb.id !== id);
    saveEbooksState(updated);
    showToast('Ebook didelete selamanya dari directory.', 'info');
  };

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

  const popularEbooks = ebooks.filter(eb => eb.isPopular).slice(0, 4);

  return (
    <div className="app-shell min-h-screen flex flex-col font-sans select-none pb-12">
      
      {/* ===== 1. COMPONENT SPLASH SCREEN (MENGGUNAKAN ANIMATEPRESENCE) ===== */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed inset-0 bg-slate-950 flex flex-col justify-center items-center z-[99999]"
          >
            <div className="text-center space-y-6">
              {/* Logo Box Animasi */}
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="w-20 h-20 bg-gradient-to-tr from-[#c8963e] to-[#ab7f30] rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-amber-500/10"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>

              {/* Judul Branding Website */}
              <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-wider text-white font-serif">
                  e.mind
                </h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
                  The LOCAL Enablers
                </p>
              </div>

              {/* Loader Loading Linear */}
              <div className="w-32 h-[3px] bg-slate-900 rounded-full mx-auto overflow-hidden relative">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#c8963e] to-[#ab7f30] rounded-full absolute left-0 top-0"
                  animate={{ 
                    width: ["0%", "100%"],
                    left: ["0%", "0%"]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-md border flex items-center gap-2.5 text-xs font-bold uppercase tracking-wide cursor-pointer ${toastType === 'success' ? 'bg-[#c8963e] border-[#ab7f30] text-white' : 'bg-slate-900 border-slate-800 text-white'}`}
            onClick={() => setToastMessage('')}
          >
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PERSISTENT HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white shadow-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 py-2">
          
          <div 
            onClick={() => { 
              if (!currentUser || currentUser.role !== 'admin') {
                setActivePage('home'); 
                setSelectedEbook(null); 
              }
            }}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <img 
              src="/assets/branding-logo.png" 
              alt="The LOCAL Enablers - e.mind" 
              className="h-20 w-auto object-contain scale-125"
            />
          </div>

          {/* DYNAMIC CENTER NAVIGATION BERDASARKAN STATUS LOGIN & ROLE */}
          <nav className="hidden lg:flex items-center gap-0.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
            
            {/* TAMPILAN GUEST ATAU USER BIASA */}
            {(!currentUser || currentUser.role !== 'admin') && (
              <>
                <button
                  onClick={() => { setActivePage('home'); setSelectedEbook(null); }}
                  className={`px-3 py-2 rounded-lg transition-all ${activePage === 'home' ? 'bg-primary-100 text-primary-700 font-bold' : 'text-slate-600 hover:text-primary-600 hover:bg-slate-100'}`}
                >
                  Beranda
                </button>
                <button
                  onClick={() => { setActivePage('catalog'); setSelectedEbook(null); }}
                  className={`px-3 py-2 rounded-lg transition-all ${activePage === 'catalog' ? 'bg-primary-100 text-primary-700 font-bold' : 'text-slate-600 hover:text-primary-600 hover:bg-slate-100'}`}
                >
                  Katalog
                </button>
              </>
            )}

            {/* DASHBOARD USER (Hanya Tampil Jika Sudah Login Sebagai User) */}
            {currentUser && currentUser.role === 'user' && (
              <button
                onClick={() => { setActivePage('dashboard'); setSelectedEbook(null); }}
                className={`px-3 py-2 rounded-lg transition-all ${activePage === 'dashboard' ? 'bg-primary-100 text-primary-700 font-bold' : 'text-slate-600 hover:text-primary-600 hover:bg-slate-100'}`}
              >
                Dashboard
              </button>
            )}

            {/* DASHBOARD ADMIN (Hanya Tampil Jika Login Sebagai Admin) */}
            {currentUser && currentUser.role === 'admin' && (
              <button
                onClick={() => { setActivePage('admin'); setSelectedEbook(null); }}
                className={`px-3 py-2 rounded-lg transition-all ${activePage === 'admin' ? 'bg-pink-100 text-pink-700 font-bold' : 'text-slate-600 hover:text-pink-600 hover:bg-slate-100'}`}
              >
                Dashboard Admin
              </button>
            )}

            {(!currentUser || currentUser.role !== 'admin') && (
              <button 
                onClick={() => { setActivePage('presentation'); setSelectedEbook(null); }}
                className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${activePage === 'presentation' ? 'bg-pink-100 text-pink-700 font-bold' : 'text-slate-600 hover:text-pink-600 hover:bg-slate-100'}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>FAQ</span>
              </button>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            {(!currentUser || currentUser.role !== 'admin') && (
              <button
                onClick={() => { setActivePage('cart'); setSelectedEbook(null); }}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all cursor-pointer relative"
              >
                <ShoppingCart className="w-4 h-4" />
                {cartIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-md">
                    {cartIds.length}
                  </span>
                )}
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { 
                    if (currentUser.role === 'admin') {
                      setActivePage('admin');
                    } else {
                      setActivePage('profile');
                    }
                    setSelectedEbook(null); 
                  }}
                  className="w-8 h-8 rounded-lg overflow-hidden border-2 border-slate-300 hover:border-primary-500 transition-all hover:scale-105 cursor-pointer"
                >
                  <img src={currentUser.avatar} alt={currentUser.username} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { !hasSeenLanding && setActivePage('home'); setShowAuthModal(true); }}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Masuk
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN SCREEN ROUTER */}
      <main className="flex-grow">

        {!hasSeenLanding && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl p-8 text-center shadow-lift">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Selamat datang di PustakaEbook</h2>
              <p className="text-sm text-slate-600 mb-6">Silakan lihat halaman landing terlebih dahulu untuk mengenal layanan kami. Anda dapat login setelah menutup pengantar ini.</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => { markSeenLanding(); setActivePage('home'); }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-xs hover:bg-blue-700 transition-all"
                >Lanjutkan ke Landing</button>
                <button
                  onClick={() => { markSeenLanding(); setActivePage('catalog'); }}
                  className="px-6 py-3 bg-slate-100 text-slate-800 rounded-xl font-bold shadow-xs hover:bg-slate-200 transition-all"
                >Jelajahi tanpa Login</button>
              </div>
            </div>
          </div>
        )}
        
        <AnimatePresence mode="wait">
          {activePage === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.32, ease: 'easeOut' }}>
              <LandingPage
                ebooks={ebooks}
                popularEbooks={popularEbooks}
                setActivePage={setActivePage}
                setSelectedEbook={setSelectedEbook}
                setActiveArticle={setActiveArticle}
                showToast={showToast}
              />
            </motion.div>
          )}

          {activePage === 'catalog' && (
            <motion.div key="catalog" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.32, ease: 'easeOut' }}>
              <Catalog
                ebooks={ebooks}
                currentUser={currentUser}
                ownedBookIds={ownedBookIds}
                cartBookIds={cartIds}
                onSelectEbook={(eb) => { setSelectedEbook(eb); setActivePage('detail'); }}
                onAddToCart={handleAddToCart}
                onReadEbook={(eb) => setActiveReadingBook(eb)}
              />
            </motion.div>
          )}

          {activePage === 'detail' && selectedEbook && (
            <motion.div key="detail" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.32, ease: 'easeOut' }}>
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
            </motion.div>
          )}

          {activePage === 'cart' && (
            <motion.div key="cart" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.32, ease: 'easeOut' }}>
              <CartCheckout
                cartItems={ebooks.filter(b => cartIds.includes(b.id))}
                currentUser={currentUser}
                onRemoveFromCart={handleRemoveFromCart}
                onCheckoutSuccess={handleCheckoutSuccess}
                onBackToCatalog={() => setActivePage('catalog')}
                onTopUp={handleWalletTopUp}
              />
            </motion.div>
          )}

          {activePage === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.32, ease: 'easeOut' }}>
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
            </motion.div>
          )}

          {/* PROTEKSI DASHBOARD USER */}
          {activePage === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.32, ease: 'easeOut' }}>
              {currentUser && currentUser.role === 'user' ? (
                <UserDashboard
                  currentUser={currentUser}
                  allEbooks={ebooks}
                  transactions={transactions}
                  ownedBookIds={ownedBookIds}
                  onNavigateToCatalog={() => setActivePage('catalog')}
                  onReadEbook={(eb) => setActiveReadingBook(eb)}
                  onTopUp={handleWalletTopUp}
                />
              ) : (
                <div className="max-w-md mx-auto text-center py-20 px-4">
                  <p className="text-slate-500 mb-4">Silakan masuk menggunakan akun User untuk mengakses dashboard Anda.</p>
                  <button onClick={() => setShowAuthModal(true)} className="px-5 py-2 bg-primary-600 text-white rounded-xl font-bold shadow-md hover:bg-primary-700 transition-all">
                    Masuk Sekarang
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activePage === 'presentation' && (
            <motion.div key="presentation" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.32, ease: 'easeOut' }}>
              <PresentationEnd />
            </motion.div>
          )}

          {/* PROTEKSI DASHBOARD ADMIN */}
          {activePage === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.32, ease: 'easeOut' }}>
              {currentUser && currentUser.role === 'admin' ? (
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
              ) : (
                <div className="max-w-md mx-auto text-center py-20 px-4">
                  <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <p className="text-red-600 font-bold mb-2">Akses Ditolak</p>
                  <p className="text-slate-500 text-sm">Halaman ini dilindungi dan hanya dapat diakses oleh Admin Utama.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* SINKRONISASI DEMO TOGGLER UNTUK KEPENTINGAN DEMO/TESTING */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-55 bg-slate-900 text-white rounded-full px-4 py-2 flex items-center gap-3 shadow-lg border border-slate-800 text-[10px] md:text-xs">
        <span className="text-amber-400 font-bold shrink-0 hidden sm:inline">⚡ DEMO TOGGLER:</span>
        <button
          onClick={() => {
            localStorage.removeItem('current_user');
            setCurrentUser(null);
            setCartIds([]);
            setActivePage('home');
            showToast('Beralih sebagai Pengunjung (Guest)', 'info');
          }}
          className={`px-3 py-1 rounded-full cursor-pointer font-bold ${currentUser === null ? 'bg-blue-600 text-white' : 'hover:bg-slate-850 text-slate-400'}`}
        >
          Guest
        </button>
        <button
          onClick={() => {
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
            setActivePage('dashboard'); // Otomatis ke dashboard user
            showToast('Sesi User Budi Hartono diaktifkan.', 'success');
          }}
          className={`px-3 py-1 rounded-full cursor-pointer font-bold ${currentUser?.id === 'usr-customer' ? 'bg-blue-600 text-white' : 'hover:bg-slate-850 text-slate-400'}`}
        >
          Budi (User)
        </button>
        <button
          onClick={() => {
            const adm: User = {
              id: 'usr-admin',
              email: 'admin@example.com',
              username: 'admin_ebook',
              fullName: 'Admin Utama LuminaBook',
              role: 'admin',
              verified: true,
              avatar: 'https://images.unsplash.com/photo-1570295999915-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
              balance: 1000000
            };
            localStorage.setItem('current_user', JSON.stringify(adm));
            setCurrentUser(adm);
            setCartIds([]);
            setActivePage('admin'); // Otomatis langsung masuk dashboard admin
            showToast('Sesi Admin Utama Aktif!', 'success');
          }}
          className={`px-3 py-1 rounded-full cursor-pointer font-bold ${currentUser?.id === 'usr-admin' ? 'bg-blue-600 text-white' : 'hover:bg-slate-850 text-slate-400'}`}
        >
          Admin
        </button>
      </div>

      <footer className="max-w-7xl mx-auto px-4 pt-16 mt-8 border-t border-slate-205 text-center text-xs text-slate-455">
        <p className="font-semibold text-slate-650">Sistem Website Ebook Online © 2026</p>
        <p className="mt-1">Dibuat dengan dedikasi kepatuhan penuh atas spesifikasi 10 Modul Interaktif bagi Ebook online premium.</p>
      </footer>

      {activeReadingBook && (
        <Reader
          ebook={activeReadingBook}
          currentUser={currentUser}
          onClose={() => setActiveReadingBook(null)}
        />
      )}

      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer z-10">
              <X className="w-5 h-5" />
            </button>
            <Auth onLoginSuccess={handleLoginSuccess} onClose={() => setShowAuthModal(false)} />
          </div>
        </div>
      )}

      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
            <button onClick={() => setActiveArticle(null)} className="absolute top-4 right-4 p-2 bg-black/50 text-white hover:bg-black/75 rounded-full cursor-pointer z-10">
              <X className="w-4 h-4" />
            </button>
            <div className="h-56 bg-slate-100 overflow-hidden relative">
              <img src={activeArticle.coverUrl} alt={activeArticle.title} className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}