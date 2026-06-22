import React, { useState } from 'react';
import { User, Transaction, Ebook } from '../types';
import { User as UserIcon, Wallet, KeyRound, Receipt, CheckCircle, Save, PlusCircle } from 'lucide-react';

interface ProfileProps {
  currentUser: User | null;
  transactions: Transaction[];
  allEbooks: Ebook[];
  onUpdateUser: (updatedUser: User) => void;
  onTopUp: (amount: number) => void;
}

export default function Profile({
  currentUser,
  transactions,
  allEbooks,
  onUpdateUser,
  onTopUp
}: ProfileProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'security' | 'transactions'>('edit');
  
  // Edit Profile form
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  // Edit Security form
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

    if (!fullName || !email || !username) {
      setError('Form edit profil tidak boleh kosong.');
      return;
    }

    const updated: User = {
      ...currentUser,
      fullName,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      avatar: avatar || currentUser.avatar
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

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password baru tidak cocok.');
      return;
    }

    setMessage('Kata sandi berhasil dirubah! Gunakan password baru Anda saat login nanti.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setMessage(''), 4050);
  };

  const formatIDR = (num: number) => {
    if (num === 0) return 'Rp 0';
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Profile Summary Card */}
      {currentUser && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-md mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="w-20 h-20 bg-white/20 rounded-2xl overflow-hidden border-2 border-white/50 shadow-sm">
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
              <h2 className="text-xl md:text-2xl font-black">{currentUser.fullName}</h2>
              <p className="text-xs text-white/80">@{currentUser.username} • Role: {currentUser.role === 'admin' ? 'Administrator' : 'Pengguna Biasa'}</p>
              <div className="flex gap-2 items-center justify-center md:justify-start pt-1.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${currentUser.verified ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white animate-pulse'}`}>
                  {currentUser.verified ? 'Akun Terverifikasi' : 'Butuh Verifikasi'}
                </span>
              </div>
            </div>
          </div>

          {/* Wallet Balances Card controller */}
          <div className="bg-white/10 backdrop-blur-xs border border-white/15 p-4 rounded-2xl w-full md:w-auto text-right flex flex-col items-center md:items-end justify-between self-stretch md:self-auto min-w-[200px]">
            <div className="text-center md:text-right">
              <span className="text-xs text-white/70 flex items-center gap-1.5 justify-center md:justify-end">
                <Wallet className="w-4 h-4" /> Saldo Pay Virtual
              </span>
              <strong className="text-2xl font-black font-mono block mt-1">{formatIDR(currentUser.balance)}</strong>
            </div>
            <button
              onClick={() => onTopUp(100000)}
              className="mt-3 w-full md:w-auto px-3 py-1.5 bg-white text-blue-700 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-1 justify-center active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Isi Saldo Rp100k
            </button>
          </div>
        </div>
      )}

      {/* FEEDBACK LABELS */}
      {message && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-250 text-xs md:text-sm text-emerald-800 rounded-2xl flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <p>{message}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-250 text-xs md:text-sm text-rose-800 rounded-2xl flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Profile Sections Inner Nav Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Vertical Navigation Menu */}
        <div className="lg:col-span-1 glass-panel rounded-3xl p-5 h-fit space-y-1 shadow-lift">
          <button
            onClick={() => setActiveTab('edit')}
            className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer ${activeTab === 'edit' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <UserIcon className="w-4 h-4" /> Edit Data Diri
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer ${activeTab === 'security' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <KeyRound className="w-4 h-4" /> Ubah Password
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer ${activeTab === 'transactions' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Receipt className="w-4 h-4" /> Riwayat Transaksi
          </button>
        </div>

        {/* Right Active Subsection forms rendering */}
        <div className="lg:col-span-3 glass-panel rounded-3xl p-6 md:p-8 shadow-lift">
          
          {/* TAB 1: PROFILE EDIT FORM */}
          {activeTab === 'edit' && (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <h3 className="text-lg font-bold text-slate-930 border-b border-slate-100 pb-3">Profil Data Diri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-705 block mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-705 block mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-705 block mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-705 block mb-1">Link URL Foto Avatar (Opsional)</label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-5 py-2.5 button-primary rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Simpan Perubahan Profil
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: UPDATE SECURITY / PASSWORD DETAILS */}
          {activeTab === 'security' && (
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <h3 className="text-lg font-bold text-slate-930 border-b border-slate-100 pb-3">Pengaturan Sandi Pengguna</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-xs font-semibold text-slate-705 block mb-1">Kata Sandi Saat Ini</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-705 block mb-1">Kata Sandi Baru</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 8 kosa kata"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-705 block mb-1">Konfirmasi Kata Sandi Baru</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-5 py-2.5 button-primary rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" /> Perbaharui Kata Sandi
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: TRANSACTIONAL DETAILS LOG */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-933 border-b border-slate-100 pb-3">Riwayat Transaksi Saya ({userTransactions.length})</h3>
              
              {userTransactions.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-6 text-center">Belum ada riwayat transaksi pembayaran.</p>
              ) : (
                <div className="space-y-3">
                  {userTransactions.map((tx) => (
                    <div 
                      key={tx.id}
                      className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 text-xs font-mono"
                    >
                      <div>
                        <strong className="text-slate-801 block">{tx.invoiceNumber}</strong>
                        <span className="text-slate-400 text-[10px] block mt-0.5">{tx.date}</span>
                        <div className="mt-1 flex items-center gap-2 font-sans">
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-50 text-emerald-700 font-extrabold uppercase">SUCCESS</span>
                          <span className="text-slate-500 text-[10px]">{tx.paymentMethod}</span>
                        </div>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-slate-450 block text-[9px]">TOTAL BELANJA</span>
                        <span className="font-bold text-slate-800 text-sm">{formatIDR(tx.totalAmount)}</span>
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
