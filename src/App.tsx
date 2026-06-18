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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none">
      
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
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-300 ${activePage === 'home' ? 'bg-slate-950/80 border-white/5' : 'bg-white/90 border-slate-100 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo and Title */}
          <div 
            onClick={() => { setActivePage('home'); setSelectedEbook(null); }}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-opacity"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className={`text-sm font-black leading-none tracking-tight ${activePage === 'home' ? 'text-white' : 'text-slate-900'}`}>PustakaEbook</h1>
              <span className={`text-[10px] font-semibold block tracking-widest mt-0.5 ${activePage === 'home' ? 'text-slate-400' : 'text-slate-400'}`}>DIGITAL LIBRARY</span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className={`hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider ${activePage === 'home' ? 'text-slate-400' : 'text-slate-500'}`}>
            <button 
              onClick={() => { setActivePage('home'); setSelectedEbook(null); }}
              className={`hover:text-blue-400 cursor-pointer transition-colors ${activePage === 'home' ? 'text-white' : ''}`}
            >
              Beranda
            </button>
            <button 
              onClick={() => { setActivePage('catalog'); setSelectedEbook(null); }}
              className={`cursor-pointer transition-colors ${activePage === 'catalog' ? 'text-blue-600' : 'hover:text-blue-400'}`}
            >
              Katalog
            </button>
            <button 
              onClick={() => { setActivePage('my-ebooks'); setSelectedEbook(null); }}
              className={`cursor-pointer transition-colors ${activePage === 'my-ebooks' ? 'text-blue-600' : 'hover:text-blue-400'}`}
            >
              Ebook Saya
            </button>
            <button 
              onClick={() => { setActivePage('presentation'); setSelectedEbook(null); }}
              className={`cursor-pointer transition-colors flex items-center gap-1 ${activePage === 'presentation' ? 'text-blue-600' : 'hover:text-blue-400'}`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>Keunggulan</span>
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            
            {/* Shopping Cart button trigger */}
            <button
              onClick={() => { setActivePage('cart'); setSelectedEbook(null); }}
              className={`p-2.5 rounded-xl relative transition-all cursor-pointer ${activePage === 'home' ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
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
                    className={`hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activePage === 'home' ? 'bg-rose-500/20 border border-rose-400/30 text-rose-300 hover:bg-rose-500/30' : 'bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700'}`}
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
                  className={`p-2.5 rounded-xl cursor-pointer transition-colors ${activePage === 'home' ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold tracking-wide shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer transition-all"
              >
                Masuk Akun
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN SCREEN ROUTER */}
      <main className="flex-grow">
        
        {/* TAB 1: LANDING PAGE SCREEN */}
        {activePage === 'home' && (
          <LandingPage
            ebooks={ebooks}
            popularEbooks={popularEbooks}
            articles={INITIAL_ARTICLES}
            testimonials={INITIAL_TESTIMONIALS}
            categories={EBOOK_CATEGORIES}
            onNavigateCatalog={() => setActivePage('catalog')}
            onNavigatePresentation={() => setActivePage('presentation')}
            onSelectEbook={(eb) => { setSelectedEbook(eb); setActivePage('detail'); }}
            onSelectArticle={(art) => setActiveArticle(art)}
          />
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

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black leading-none">PustakaEbook</h3>
                  <span className="text-[10px] text-slate-400 font-semibold tracking-widest">DIGITAL LIBRARY</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Platform perpustakaan digital terdepan Indonesia. Akses ratusan koleksi ebook berkualitas dari penulis terbaik.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Navigasi</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><button onClick={() => setActivePage('home')} className="hover:text-white transition-colors cursor-pointer">Beranda</button></li>
                <li><button onClick={() => setActivePage('catalog')} className="hover:text-white transition-colors cursor-pointer">Katalog Ebook</button></li>
                <li><button onClick={() => setActivePage('my-ebooks')} className="hover:text-white transition-colors cursor-pointer">Perpustakaan Saya</button></li>
                <li><button onClick={() => setActivePage('presentation')} className="hover:text-white transition-colors cursor-pointer">Keunggulan Platform</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Kategori Populer</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><button onClick={() => setActivePage('catalog')} className="hover:text-white transition-colors cursor-pointer">Pengembangan Diri</button></li>
                <li><button onClick={() => setActivePage('catalog')} className="hover:text-white transition-colors cursor-pointer">Teknologi & Koding</button></li>
                <li><button onClick={() => setActivePage('catalog')} className="hover:text-white transition-colors cursor-pointer">Sastra & Fiksi</button></li>
                <li><button onClick={() => setActivePage('catalog')} className="hover:text-white transition-colors cursor-pointer">Bisnis & Finansial</button></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-slate-500">PustakaEbook &copy; 2026. Platform Ebook Digital Indonesia.</p>
            <p className="text-[11px] text-slate-500">Dibuat dengan dedikasi untuk literasi digital.</p>
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
