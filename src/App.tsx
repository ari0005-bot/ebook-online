import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ebook, User, Review, Transaction, Article } from './types';
import { 
  INITIAL_EBOOKS, INITIAL_ARTICLES, INITIAL_REVIEWS, EBOOK_CATEGORIES 
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
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';

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

  const [hasSeenLanding, setHasSeenLanding] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(true);

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

  // INITIAL DATA BOOTSTRAPPING FLOW
  useEffect(() => {
    // 1. Fetch Ebooks
    const savedBooks = readStoredJSON<Ebook[]>('app_ebooks', []);
    setEbooks(savedBooks);
    localStorage.setItem('app_ebooks', JSON.stringify(savedBooks));

    // 2. Fetch Users Directory
    const savedUsers = readStoredJSON<User[]>('app_users', []);
    setUsers(savedUsers);
    localStorage.setItem('app_users', JSON.stringify(savedUsers));

    // 3. Fetch Reviews
    const savedReviews = readStoredJSON<Review[]>('app_reviews', []);
    setReviews(savedReviews);
    localStorage.setItem('app_reviews', JSON.stringify(savedReviews));

    // 4. Fetch Transactions Jurnal
    const savedTx = readStoredJSON<Transaction[]>('app_transactions', []);
    setTransactions(savedTx);
    localStorage.setItem('app_transactions', JSON.stringify(savedTx));

    // 5. Fetch Active User login token
    const storedUser = readStoredJSON<User | null>('current_user', null);
    if (storedUser) {
      setCurrentUser(storedUser);
    }

    return () => {};
  }, []);

  const markSeenLanding = () => {
    setHasSeenLanding(true);
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
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
    ? readStoredJSON<string[]>(`owned_ebooks_${currentUser.id}`, [])
    : [];

  const handleLogout = () => {
    localStorage.removeItem('current_user');
    setCurrentUser(null);
    setCartIds([]);
    setActivePage('home');
    showToast('Berhasil keluar dari sesi akun. Sampai jumpa kembali!', 'info');
  };

  // HANDLER LOGIN DENGAN REDIRECT OTOMATIS BERDASARKAN ROLE
  const handleLoginSuccess = (userPayload: User) => {
    setCurrentUser(userPayload);
    localStorage.setItem('current_user', JSON.stringify(userPayload));
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

  const handleDirectBuy = (book: Ebook) => {
    if (!currentUser) {
      setShowAuthModal(true);
      showToast('Harap masuk/registrasi terlebih dahulu untuk membeli buku.', 'info');
      return;
    }

    if (book.price === 0) {
      // Free book - add directly to library
      const oldLibrary = readStoredJSON<string[]>(`owned_ebooks_${currentUser.id}`, []);
      if (!oldLibrary.includes(book.id)) {
        const newLibrary = [...oldLibrary, book.id];
        localStorage.setItem(`owned_ebooks_${currentUser.id}`, JSON.stringify(newLibrary));
        showToast(`'${book.title}' berhasil ditambahkan ke pustaka Anda!`, 'success');
      } else {
        showToast(`'${book.title}' sudah ada di pustaka Anda.`, 'info');
      }
    } else {
      // Paid book - direct checkout
      if (currentUser.balance < book.price) {
        showToast('Saldo tidak cukup. Silakan topup terlebih dahulu.', 'info');
        return;
      }

      const newBalance = currentUser.balance - book.price;
      const updatedUser = { ...currentUser, balance: newBalance };
      setCurrentUser(updatedUser);
      localStorage.setItem('current_user', JSON.stringify(updatedUser));

      const oldLibrary = readStoredJSON<string[]>(`owned_ebooks_${currentUser.id}`, []);
      const newLibrary = [...oldLibrary, book.id];
      localStorage.setItem(`owned_ebooks_${currentUser.id}`, JSON.stringify(newLibrary));

      const txRecord: Transaction = {
        id: 'tx-' + Date.now(),
        userId: currentUser.id,
        ebookIds: [book.id],
        totalAmount: book.price,
        paymentMethod: 'Saldo Digital',
        status: 'success',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        invoiceNumber: 'INV-' + Date.now()
      };

      const updatedTx = [txRecord, ...transactions];
      setTransactions(updatedTx);
      localStorage.setItem('app_transactions', JSON.stringify(updatedTx));

      const revisedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
      saveUsersState(revisedUsers);

      showToast(`Pembelian berhasil! '${book.title}' siap dibaca.`, 'success');
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

    showToast(`Topup berhasil! Saldo digital bertambah Rp ${amount.toLocaleString('id-ID')}`, 'success');
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
    showToast(`Kredit balance user disuntik Rp ${amount.toLocaleString('id-ID')}`, 'success');
  };

  const popularEbooks = ebooks.filter(eb => eb.isPopular).slice(0, 4);

  return (
    <div className="app-shell min-h-screen flex flex-col font-sans select-none pb-12">
      

      {/* SPLASH SCREEN */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* TOAST ALERTS */}
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
      <Navbar
        currentUser={currentUser}
        cartIds={cartIds}
        activePage={activePage}
        setActivePage={setActivePage}
        setSelectedEbook={setSelectedEbook}
        setShowAuthModal={setShowAuthModal}
        handleLogout={handleLogout}
      />

      {/* MAIN SCREEN ROUTER */}
      <main className="flex-grow">

        
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
                onDirectBuy={handleDirectBuy}
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
                onSelectEbook={(eb) => { setSelectedEbook(eb); }}
                onAddToCart={handleAddToCart}
                onReadEbook={(eb) => setActiveReadingBook(eb)}
                onAddReview={handleAddReview}
                onDirectBuy={handleDirectBuy}
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
                />
              ) : (
                <div className="max-w-md mx-auto text-center py-20 px-4">
                  <p className="text-slate-500 mb-4">Silakan masuk menggunakan akun User untuk mengakses dashboard Anda.</p>
                  <button onClick={() => setShowAuthModal(true)} className="px-5 py-2 bg-[#c8963e] text-white rounded-xl font-bold shadow-md hover:bg-[#ab7f30] transition-all">
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

      {/* AUTH MODAL CONDITIONAL RENDERING */}
      {showAuthModal && (
        <Auth 
          onClose={() => setShowAuthModal(false)} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* READER OVERLAY INSTANCE */}
      {activeReadingBook && (
        <Reader 
          ebook={activeReadingBook} 
          currentUser={currentUser}
          onClose={() => setActiveReadingBook(null)} 
        />
      )}


      {/* FOOTER BAR */}
      <Footer />
    </div>
  );
}