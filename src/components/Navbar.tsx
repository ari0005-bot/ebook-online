import React from 'react';
import { 
  BookOpen, ShoppingCart, User as UserIcon, LogOut, Sparkles 
} from 'lucide-react';
import { User } from '../types';

type Props = {
  currentUser: User | null;
  cartIds: string[];
  activePage: string;
  setActivePage: (p: any) => void;
  setSelectedEbook: (e: any) => void;
  setShowAuthModal: (show: boolean) => void;
  handleLogout: () => void;
};

export default function Navbar({
  currentUser,
  cartIds,
  activePage,
  setActivePage,
  setSelectedEbook,
  setShowAuthModal,
  handleLogout
}: Props) {
  return (
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
                className={`px-3 py-2 rounded-lg transition-all ${activePage === 'home' ? 'bg-amber-100 text-[#ab7f30] font-bold' : 'text-slate-600 hover:text-[#ab7f30] hover:bg-slate-100'}`}
              >
                Beranda
              </button>
              <button
                onClick={() => { setActivePage('catalog'); setSelectedEbook(null); }}
                className={`px-3 py-2 rounded-lg transition-all ${activePage === 'catalog' ? 'bg-amber-100 text-[#ab7f30] font-bold' : 'text-slate-600 hover:text-[#ab7f30] hover:bg-slate-100'}`}
              >
                Katalog
              </button>
            </>
          )}

          {/* DASHBOARD USER (Hanya Tampil Jika Sudah Login Sebagai User) */}
          {currentUser && currentUser.role === 'user' && (
            <button
              onClick={() => { setActivePage('dashboard'); setSelectedEbook(null); }}
              className={`px-3 py-2 rounded-lg transition-all ${activePage === 'dashboard' ? 'bg-amber-100 text-[#ab7f30] font-bold' : 'text-slate-600 hover:text-[#ab7f30] hover:bg-slate-100'}`}
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
                <span className="absolute -top-1 -right-1 bg-[#c8963e] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-md">
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
                className="w-8 h-8 rounded-lg overflow-hidden border-2 border-slate-300 hover:border-[#c8963e] transition-all hover:scale-105 cursor-pointer"
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
              onClick={() => { setShowAuthModal(true); }}
              className="px-4 py-2 bg-[#c8963e] hover:bg-[#ab7f30] text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Masuk
            </button>
          )}
        </div>
      </div>
    </header>
  );
}