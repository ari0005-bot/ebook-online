import React, { useState } from 'react';
import { User, Transaction, Ebook } from '../types';
import { User as UserIcon, KeyRound, Receipt, CheckCircle, XCircle, Save } from 'lucide-react';

interface ProfileProps {
  currentUser: User | null;
  transactions: Transaction[];
  allEbooks: Ebook[];
  onUpdateUser: (updatedUser: User) => void;
}

export default function Profile({
  currentUser,
  transactions,
  allEbooks,     
  onUpdateUser
}: ProfileProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'security' | 'transactions'>('edit');
  
  // Edit Profile form states
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  // Edit Security form states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const userId = currentUser ? currentUser.id : 'guest';
  const userTransactions = transactions.filter(tx => tx.userId === userId);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!currentUser) return;

    if (!fullName.trim() || !email.trim() || !username.trim()) {
      setError('Form edit profil tidak boleh kosong.');
      return;
    }

    const updated: User = {
      ...currentUser,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      username: username.trim().toLowerCase(),
      avatar: avatar.trim() || currentUser.avatar
    };

    onUpdateUser(updated);
    setMessage('Profil Anda berhasil diperbaharui!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Harap isi ketiga kolom password.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Kata sandi baru minimal harus terdiri dari 8 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password baru tidak cocok.');
      return;
    }

    setMessage('Kata sandi berhasil diubah! Gunakan password baru Anda saat login nanti.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setMessage(''), 4500);
  };

  const formatIDR = (num: number) => {
    if (num === 0) return 'Rp 0';
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="page-transition max-w-6xl mx-auto px-4 py-8 font-sans antialiased text-slate-800 pb-16">
      
      {/* Top Profile Summary Card Banner */}
      {currentUser && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-md mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left w-full relative z-10">
            <div className="w-20 h-20 bg-white/20 rounded-2xl overflow-hidden border-2 border-white/40 shadow-sm shrink-0 mx-auto md:mx-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser.username}`;
                }}
              />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-black tracking-tight">{currentUser.fullName}</h2>
              <p className="text-xs text-white/80 font-medium">
                @{currentUser.username} • <span className="text-blue-200">Role: {currentUser.role === 'admin' ? 'Administrator' : 'Mahasiswa / Pengguna'}</span>
              </p>
              <div className="flex gap-2 items-center justify-center md:justify-start pt-1">
                <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider ${currentUser.verified ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white animate-pulse'}`}>
                  {currentUser.verified ? 'Akun Terverifikasi' : 'Butuh Verifikasi'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK STATUS LABELS */}
      {message && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-xs md:text-sm text-emerald-800 rounded-2xl flex items-center gap-2.5 shadow-2xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="font-medium">{message}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-xs md:text-sm text-rose-800 rounded-2xl flex items-center gap-2.5 shadow-2xs">
          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Profile Sections Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side Navigation Menu Card */}
        <div className="lg:col-span-1 bg-white border border-slate-100 rounded-3xl p-4 h-fit space-y-1 shadow-lift">
          <button
            type="button"
            onClick={() => { setActiveTab('edit'); setError(''); setMessage(''); }}
            className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer ${
              activeTab === 'edit' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <UserIcon className="w-4 h-4" /> Edit Data Diri
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('security'); setError(''); setMessage(''); }}
            className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer ${
              activeTab === 'security' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" /> Ubah Password
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('transactions'); setError(''); setMessage(''); }}
            className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer ${
              activeTab === 'transactions' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Receipt className="w-4 h-4" /> Riwayat Transaksi
          </button>
        </div>

        {/* Right Side Work Space Content Panel */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-lift">
          
          {/* TAB 1: PROFILE FORM EDITING PANEL */}
          {activeTab === 'edit' && (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Profil Data Diri</h3>
                <p className="text-[11px] text-slate-400">Kelola informasi data identitas akun edukasi eduHub Anda.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">Nama Lengkap</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50/60 border border-slate-200 focus:border-blue-500 outline-none rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-800 transition-all focus:ring-1 focus:ring-blue-500/10"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50/60 border border-slate-200 focus:border-blue-500 outline-none rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-800 transition-all focus:ring-1 focus:ring-blue-500/10"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">Alamat Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50/60 border border-slate-200 focus:border-blue-500 outline-none rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-800 transition-all focus:ring-1 focus:ring-blue-500/10"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">Link URL Foto Avatar (Opsional)</label>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-slate-50/60 border border-slate-200 focus:border-blue-500 outline-none rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-800 transition-all focus:ring-1 focus:ring-blue-500/10 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" /> Simpan Perubahan Profil
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: UPDATE SECURITY CREDENTIALS */}
          {activeTab === 'security' && (
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Pengaturan Sandi Pengguna</h3>
                <p className="text-[11px] text-slate-400">Amankan akun Anda dengan memperbaharui kombinasi kunci sandi secara berkala.</p>
              </div>

              <div className="space-y-4 max-w-md">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">Kata Sandi Saat Ini</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50/60 border border-slate-200 focus:border-blue-500 outline-none rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-800 transition-all focus:ring-1 focus:ring-blue-500/10 placeholder:text-slate-300"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">Kata Sandi Baru</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 8 karakter unik"
                    className="w-full bg-slate-50/60 border border-slate-200 focus:border-blue-500 outline-none rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-800 transition-all focus:ring-1 focus:ring-blue-500/10 placeholder:text-slate-400"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">Konfirmasi Kata Sandi Baru</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50/60 border border-slate-200 focus:border-blue-500 outline-none rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-800 transition-all focus:ring-1 focus:ring-blue-500/10 placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <KeyRound className="w-3.5 h-3.5" /> Perbaharui Kata Sandi
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: TRANSACTIONAL DETAILS LOG */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Riwayat Pembayaran Instan ({userTransactions.length})</h3>
                <p className="text-[11px] text-slate-400">Daftar arsip nota invoice pembelian koleksi pustaka digital eduHub.</p>
              </div>
              
              {userTransactions.length === 0 ? (
                <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 max-w-sm mx-auto">
                  <p className="text-xs text-slate-400 italic">Belum ada riwayat catatan transaksi pembayaran.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                  {userTransactions.map((tx) => (
                    <div 
                      key={tx.id}
                      className="p-4 bg-slate-50/60 border border-slate-150 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-mono"
                    >
                      <div className="space-y-0.5">
                        <strong className="text-slate-800 block tracking-tight">{tx.invoiceNumber}</strong>
                        <span className="text-slate-400 text-[10px] block font-medium">{tx.date}</span>
                        <div className="mt-1.5 flex items-center gap-2 font-sans">
                          <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-100 uppercase tracking-wide">
                            {tx.status?.toUpperCase() || 'SUCCESS'}
                          </span>
                          <span className="text-slate-400 text-[10px] font-medium bg-white px-1.5 py-0.5 border border-slate-100 rounded">
                            {tx.paymentMethod}
                          </span>
                        </div>
                      </div>
                      <div className="sm:text-right self-stretch sm:self-auto flex sm:flex-col justify-between items-center sm:items-end border-t border-dashed border-slate-200 sm:border-0 pt-2 sm:pt-0">
                        <span className="text-slate-400 font-bold block sm:hidden font-sans text-[10px]">TOTAL BELANJA</span>
                        <div className="space-y-0.5">
                          <span className="text-slate-400 text-[9px] hidden sm:block font-sans font-medium leading-none">Total Belanja</span>
                          <span className="font-black text-slate-900 text-sm tracking-tight">{formatIDR(tx.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}