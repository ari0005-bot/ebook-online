import React, { useState } from 'react';
import { motion } from 'motion/react';
import api from '../services/api';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, ShieldAlert, CheckCircle, ArrowRight, RefreshCcw, X } from 'lucide-react';
import { GoogleLogin, googleLogout, CredentialResponse } from '@react-oauth/google';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
  onClose: () => void;
}

export default function Auth({ onLoginSuccess, onClose }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login'); // Menghapus mode 'verify' karena backend langsung aktif
  
  // Form input fields
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState(''); // Digunakan sebagai 'name' untuk backend
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handler utama submit form (Login & Register)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (mode === 'login') {
      if (!email || !password) {
        setError('Harap isi semua kolom email dan password.');
        return;
      }
      setLoading(true);
      try {
        const response = await api.post('/auth/login', {
          email: email.toLowerCase(),
          password
        });

        if (response.data.success) {
          const { token, user } = response.data;
          
          const mappedUser: User = {
            id: user.id,
            email: user.email,
            username: user.email.split('@')[0],
            fullName: user.name,
            role: user.email.includes('admin') ? 'admin' : 'user',
            verified: true,
            balance: 0,
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
          };

          localStorage.setItem('auth_token', token);
          localStorage.setItem('current_user', JSON.stringify(mappedUser));
          
          onLoginSuccess(mappedUser);
          onClose();
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Email atau password salah.');
      } finally {
        setLoading(false);
      }
    } 
    
    else if (mode === 'register') {
      if (!email || !fullName || !password) {
        setError('Semua kolom pendaftaran wajib diisi.');
        return;
      }
      setLoading(true);
      try {
        // payload dicocokkan dengan parameter backend: name, email, password
        const response = await api.post('/auth/register', {
          name: fullName,
          email: email.toLowerCase(),
          password
        });

        if (response.data.success) {
          setMode('login');
          setMessage('Registrasi berhasil! Akun Anda telah terdaftar di database. Silakan masuk.');
          // Reset form input pendaftaran
          setFullName('');
          setPassword('');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Registrasi gagal. Email mungkin sudah terpakai.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handler untuk login dengan Google
  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      // Kirim token Google ke backend untuk verifikasi dan login/register
      const response = await api.post('/auth/google', {
        token: credentialResponse.credential
      });

      if (response.data.success) {
        const { token, user } = response.data;
        
        const mappedUser: User = {
          id: user.id,
          email: user.email,
          username: user.email.split('@')[0],
          fullName: user.name,
          role: user.email.includes('admin') ? 'admin' : 'user',
          verified: true,
          balance: 0,
          avatar: user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
        };

        localStorage.setItem('auth_token', token);
        localStorage.setItem('current_user', JSON.stringify(mappedUser));
        
        onLoginSuccess(mappedUser);
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login dengan Google gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk error Google login
  const handleGoogleError = () => {
    setError('Login dengan Google dibatalkan atau gagal.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md relative bg-white rounded-[2rem] p-8 shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Background Dekoratif */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full filter blur-xl -mr-16 -mt-16 -z-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-50 rounded-full filter blur-lg -ml-12 -mb-12 -z-10" />

        <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          {mode === 'login' && 'Selamat Datang'}
          {mode === 'register' && 'Buat Akun Baru'}
        </h3>
        <p className="text-slate-500 text-xs mt-1">
          {mode === 'login' && 'Nikmati akses instan ke seluruh koleksi ebook online.'}
          {mode === 'register' && 'Daftar sekarang dan dapatkan akses penuh modul edukasi.'}
        </p>
      </div>

      {/* Alert Umpan Balik Sukses */}
      {message && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-150 rounded-xl flex items-start gap-2 text-xs text-emerald-800">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>{message}</p>
        </div>
      )}

      {/* Alert Gagal */}
      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-150 rounded-xl flex items-start gap-2 text-xs text-rose-800">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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

        {mode === 'register' && (
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
        )}

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-700 block">Password</label>
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
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-4 bg-white text-slate-500">Atau lanjutkan dengan</span>
        </div>
      </div>

      {/* Google Login Button */}
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={handleGoogleError}
          useOneTap
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          width="100%"
        />
      </div>

      {/* Footer Navigasi Mode */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
        {mode === 'login' ? (
          <p>
            Belum punya akun?{' '}
            <button
              onClick={() => { setMode('register'); setError(''); setMessage(''); }}
              className="font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Registrasi Akun
            </button>
          </p>
        ) : (
          <p>
            Sudah memiliki akun?{' '}
            <button
              onClick={() => { setMode('login'); setError(''); setMessage(''); }}
              className="font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Silakan Login
            </button>
          </p>
        )}
      </div>
      </motion.div>
    </div>
  );
}
