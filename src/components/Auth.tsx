import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, ShieldAlert, CheckCircle, ArrowRight, RefreshCcw } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
  onClose: () => void;
}

export default function Auth({ onLoginSuccess, onClose }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'verify'>('login');
  
  // Form input fields
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempUser, setTempUser] = useState<User | null>(null); // For verification module bypass

  // Pre-seed 1-Click quick login handler
  const handleQuickLogin = (role: 'user' | 'admin') => {
    setLoading(true);
    setTimeout(() => {
      const mockUser: User = role === 'admin' 
        ? {
            id: 'usr-admin',
            email: 'admin@example.com',
            username: 'admin_ebook',
            fullName: 'Admin Utama LuminaBook',
            role: 'admin',
            verified: true,
            avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
            balance: 1000000 // Rp 1.000.000 for purchasing tests
          }
        : {
            id: 'usr-customer',
            email: 'budi@example.com',
            username: 'budi_hartono',
            fullName: 'Budi Hartono',
            role: 'user',
            verified: true,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
            balance: 250000 // Rp 250.000
          };
      
      // Save user to LocalStorage
      localStorage.setItem('current_user', JSON.stringify(mockUser));
      
      // Track or seed user owned ebooks if needed
      if (!localStorage.getItem(`owned_ebooks_${mockUser.id}`)) {
        // give free books automatically
        localStorage.setItem(`owned_ebooks_${mockUser.id}`, JSON.stringify(['eb-5']));
      }

      onLoginSuccess(mockUser);
      setLoading(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (mode === 'login') {
      if (!email || !password) {
        setError('Harap isi semua kolom email dan password.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        // Authenticate mock rules
        let role: 'user' | 'admin' = 'user';
        let name = 'Pengunjung Baru';
        
        if (email.toLowerCase().includes('admin')) {
          role = 'admin';
          name = 'Admin Utama LuminaBook';
        } else {
          name = email.split('@')[0];
        }

        const newUser: User = {
          id: 'usr-' + Math.random().toString(36).substring(2, 9),
          email: email.toLowerCase(),
          username: email.split('@')[0],
          fullName: name,
          role: role,
          verified: true, // Auto verified for quick testing
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
          balance: 300000
        };

        localStorage.setItem('current_user', JSON.stringify(newUser));
        onLoginSuccess(newUser);
        setLoading(false);
      }, 800);
    } 
    
    else if (mode === 'register') {
      if (!email || !username || !fullName || !password) {
        setError('Semua kolom pendaftaran wajib diisi.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        const payloadUser: User = {
          id: 'usr-' + Math.random().toString(36).substring(2, 9),
          email: email.toLowerCase(),
          username: username.toLowerCase(),
          fullName: fullName,
          role: 'user',
          verified: false, // Must verify! Excellent demonstration
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`,
          balance: 150000 // Seeding balance for signup bonus
        };
        setTempUser(payloadUser);
        setMode('verify');
        setMessage('Registrasi berhasil! Kode verifikasi Anda adalah "1234".');
        setLoading(false);
      }, 1000);
    } 
    
    else if (mode === 'forgot') {
      if (!email) {
        setError('Masukkan alamat email terdaftar.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setMessage('Tautan pemulihan kata sandi telah dikirim ke alamat email Anda.');
        setLoading(false);
      }, 1000);
    }
  };

  // OTP Verification process for authentications
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '1234') {
      setError('Kode PIN OTP salah. Silakan coba lagi (Gunakan: 1234).');
      return;
    }
    
    if (tempUser) {
      setLoading(true);
      setTimeout(() => {
        const verifiedUser: User = { ...tempUser, verified: true };
        localStorage.setItem('current_user', JSON.stringify(verifiedUser));
        onLoginSuccess(verifiedUser);
        setLoading(false);
      }, 800);
    } else {
      setMode('login');
      setMessage('Aktivasi akun berhasil! Silakan masuk ke akun Anda.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto glass-panel rounded-[2rem] p-8 relative overflow-hidden">
      
      {/* Dynamic Background Circle Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full filter blur-xl -mr-16 -mt-16 -z-10" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-50 rounded-full filter blur-lg -ml-12 -mb-12 -z-10" />

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          {mode === 'login' && 'Selamat Datang'}
          {mode === 'register' && 'Buat Akun Baru'}
          {mode === 'forgot' && 'Lupa Kata Sandi'}
          {mode === 'verify' && 'Verifikasi Akun'}
        </h3>
        <p className="text-slate-500 text-xs mt-1">
          {mode === 'login' && 'Nikmati akses instan ke seluruh koleksi ebook online.'}
          {mode === 'register' && 'Daftar sekarang dan nikmati gratis saldo sambutan Rp150.000!'}
          {mode === 'forgot' && 'Masukkan email terdaftar untuk menyetel ulang kata sandi.'}
          {mode === 'verify' && 'Masukkan token rahasia untuk menyelesaikan aktivasi.'}
        </p>
      </div>

      {/* Info / Success Feedback message */}
      {message && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-150 rounded-xl flex items-start gap-2 text-xs text-emerald-800">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>{message}</p>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-150 rounded-xl flex items-start gap-2 text-xs text-rose-800">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Normal Forms */}
      {mode !== 'verify' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 transition-all"
                  required
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Username</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: budi_99"
                    className="w-full bg-slate-50 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Lengkap</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Budi Hartono"
                    className="w-full bg-slate-50 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 transition-all"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {(mode === 'login' || mode === 'register') && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700 block">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    Lupa Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 transition-all"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 button-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-semibold tracking-wide shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            {loading ? (
              <RefreshCcw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {mode === 'login' && 'Masuk Akun'}
                {mode === 'register' && 'Daftar Sekarang'}
                {mode === 'forgot' && 'Kirim Kode Reset'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* OTP Verification Form code */
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Kode Aktifasi OTP (MOCK PIN: 1234)</label>
            <input
              type="text"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="1234"
              className="w-full tracking-[1.5em] text-center font-bold text-lg bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl py-3 text-slate-800 transition-all"
              required
            />
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Kami telah mensimulasikan token OTP verifikasi ke email yang terdaftar. Gunakan PIN <span className="font-bold text-slate-600">1234</span> untuk menyelesaikan.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 button-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : 'Verifikasi Akun Saya'}
          </button>
        </form>
      )}

      {/* Footer Mode Switchers */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
        {mode === 'login' && (
          <p>
            Belum punya akun?{' '}
            <button
              onClick={() => setMode('register')}
              className="font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Registrasi Akun
            </button>
          </p>
        )}
        {(mode === 'register' || mode === 'forgot' || mode === 'verify') && (
          <p>
            Sudah memiliki akun?{' '}
            <button
              onClick={() => {
                setMode('login');
                setError('');
                setMessage('');
              }}
              className="font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Silakan Login
            </button>
          </p>
        )}
      </div>

      {/* QUICK LOGIN TOOLBAR FOR DEVELOPER/DEMO */}
      <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <p className="text-[10px] font-bold text-slate-400 tracking-wider text-center uppercase mb-3">
          ⚡ 1-CLICK QUICK ACCESS UNTUK PENGUJIAN
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleQuickLogin('user')}
            className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white text-slate-700 hover:text-blue-600 font-semibold border border-slate-200 rounded-xl text-xs shadow-2xs hover:border-blue-300 cursor-pointer text-center"
          >
            <span className="w-2 h-2 rounded-full referee bg-indigo-500" />
            <span>Sebagai User</span>
          </button>
          <button
            onClick={() => handleQuickLogin('admin')}
            className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white text-slate-700 hover:text-rose-600 font-semibold border border-slate-200 rounded-xl text-xs shadow-2xs hover:border-rose-300 cursor-pointer text-center"
          >
            <span className="w-2 h-2 rounded-full referee bg-rose-500 animate-pulse" />
            <span>Sebagai Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
