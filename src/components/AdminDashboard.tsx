import React, { useState, useMemo } from 'react';
import { Ebook, User, Transaction } from '../types';
import { EBOOK_CATEGORIES } from '../data';
import { 
  TrendingUp, BookOpen, Users, Receipt, PlusCircle, Pencil, Trash2, 
  Save, X, ShieldAlert, BadgeDollarSign, Laptop, RefreshCw, Menu
} from 'lucide-react';

interface AdminDashboardProps {
  ebooks: Ebook[];
  users: User[];
  transactions: Transaction[];
  onAddEbook: (ebook: Ebook) => void; 
  onEditEbook: (ebook: Ebook) => void;
  onDeleteEbook: (id: string) => void;
  onUpdateUserRole: (userId: string, targetRole: 'user' | 'admin') => void;
  onInjectUserBalance: (userId: string, amount: number) => void;
}

export default function AdminDashboard({
  ebooks,
  users,
  transactions,
  onAddEbook,
  onEditEbook,
  onDeleteEbook,
  onUpdateUserRole,
  onInjectUserBalance
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'books' | 'users' | 'transactions'>('stats');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'stats', label: 'Statistik Umum', icon: <TrendingUp className="w-4 h-4" />, count: null },
    { id: 'books', label: 'Kelola Ebook', icon: <BookOpen className="w-4 h-4" />, count: ebooks.length },
    { id: 'users', label: 'Kelola User', icon: <Users className="w-4 h-4" />, count: users.length },
    { id: 'transactions', label: 'Daftar Transaksi', icon: <Receipt className="w-4 h-4" />, count: transactions.length }
  ] as const;

  // Form edit/add ebook state definitions
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [showBookForm, setShowBookForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formCategory, setFormCategory] = useState('Pengembangan Diri');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formCoverUrl, setFormCoverUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPagesText, setFormPagesText] = useState(''); // comma-split/lines-split pages text

  // Stat calculations
  const totalSalesRevenue = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + tx.totalAmount, 0);
  }, [transactions]);

  const salesTrendData = [
    { label: 'Senin', sales: 120000 },
    { label: 'Selasa', sales: 380000 },
    { label: 'Rabu', sales: 250000 },
    { label: 'Kamis', sales: 512000 },
    { label: 'Jumat', sales: 490000 },
    { label: 'Sabtu', sales: 980000 },
    { label: 'Minggu', sales: 1150000 }
  ];

  // Max value calculation for graph normalization
  const maxGraphValue = 1200000;

  // Handle ebook CRUD form submit
  const handleSaveEbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formAuthor) return;

    // Split text into pages (splitting by paragraph or triple line returns)
    let pageBlocks = formPagesText.split('---PAGE---').map(p => p.trim()).filter(Boolean);
    if (pageBlocks.length === 0) {
      pageBlocks = [
        `BAB 1: ${formTitle}\n\nIni adalah contoh halaman preview dari buku digital '${formTitle}' yang diunggah secara dinamik oleh administrator via panel admin.`,
        `BAB 2: PEMBAHASAN\n\nIsi materi digital sekunder dari buku '${formTitle}' yang menjelaskan teori, ilmu pengetahuan terkait serta narasi utama karya ini.`,
        `BAB 3: KESIMPULAN\n\nUlasan rekomendasi dan konklusi dari core materi untuk para pembaca setia.`
      ];
    }

    const payloadCover = formCoverUrl.trim() || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';

    if (editingBookId) {
      // Editing Mode
      const targetBook = ebooks.find(x => x.id === editingBookId);
      if (!targetBook) return;

      const updated: Ebook = {
        ...targetBook,
        title: formTitle,
        author: formAuthor,
        category: formCategory,
        price: formPrice,
        coverUrl: payloadCover,
        description: formDescription,
        pages: pageBlocks
      };
      onEditEbook(updated);
    } else {
      // Create Mode
      const created: Ebook = {
        id: 'eb-' + Math.random().toString(36).substring(2, 9),
        title: formTitle,
        author: formAuthor,
        category: formCategory,
        price: formPrice,
        rating: 4.5,
        coverUrl: payloadCover,
        description: formDescription,
        pages: pageBlocks,
        isNew: true,
        isPopular: false,
        dateAdded: new Date().toISOString().split('T')[0]
      };
      onAddEbook(created);
    }

    // Reset Form fields
    resetBookForm();
  };

  const resetBookForm = () => {
    setEditingBookId(null);
    setShowBookForm(false);
    setFormTitle('');
    setFormAuthor('');
    setFormCategory('Pengembangan Diri');
    setFormPrice(0);
    setFormCoverUrl('');
    setFormDescription('');
    setFormPagesText('');
  };

  const triggerEdit = (book: Ebook) => {
    setEditingBookId(book.id);
    setFormTitle(book.title);
    setFormAuthor(book.author);
    setFormCategory(book.category);
    setFormPrice(book.price);
    setFormCoverUrl(book.coverUrl);
    setFormDescription(book.description);
    setFormPagesText(book.pages.join('\n\n---PAGE---\n\n'));
    setShowBookForm(true);
  };

  const formatIDR = (num: number) => {
    if (num === 0) return 'Rp 0';
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Admin Title Banner */}
      <div className="mb-8 border-b border-slate-100 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="p-2 bg-rose-50 text-rose-600 rounded-xl"><Laptop className="w-6 h-6" /></span>
            <span>Dashboard Administrator</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">Sistem kontrol komprehensif untuk memantau trafik penjualan, data pengguna, data ebook serta kategori.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* SIDEBAR NAVIGATION: DESKTOP & MOBILE RESPONSIVE LAYOUT */}
        
        {/* Mobile Header Bar Section */}
        <div className="md:hidden flex items-center justify-between bg-white border border-slate-100 p-4 rounded-2xl shadow-2xs">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shrink-0" />
            Modul Aktif: {menuItems.find(item => item.id === activeTab)?.label}
          </span>
          <button 
            type="button"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2.5 bg-slate-100 hover:bg-slate-205 text-slate-700 rounded-xl cursor-pointer transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {isMobileSidebarOpen && (
          <div className="md:hidden bg-white border border-slate-150 p-4 rounded-2xl shadow-md space-y-1.5 animate-fade-in">
            {menuItems.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === item.id ? 'bg-rose-550 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`p-1 rounded-lg ${activeTab === item.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.count !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${activeTab === item.id ? 'bg-white text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Desktop Sidebar Panel */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border border-slate-100 rounded-3xl p-5 shadow-2xs space-y-6 h-fit sticky top-24">
          <div className="border-b border-slate-100 pb-4">
            <strong className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-1">NAVIGASI MODUL</strong>
            <p className="text-[10px] text-slate-500">Pilih alat pantau administrator dibawah.</p>
          </div>

          <div className="space-y-1.5">
            {menuItems.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer group hover:bg-slate-50 active:scale-98 ${activeTab === item.id ? 'bg-rose-600 text-white shadow-md shadow-rose-600/10' : 'text-slate-600'}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`p-1.5 rounded-xl transition-colors ${activeTab === item.id ? 'bg-rose-700 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.count !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-colors ${activeTab === item.id ? 'bg-rose-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
            <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
              <span className="text-[10px] text-rose-700 font-extrabold block uppercase tracking-wider mb-1">Petunjuk Cerdas</span>
              <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">Tingkatkan hak akses user pada menu "Kelola User" atau tambahkan e-book baru secara instan pada menu "Kelola Ebook".</p>
            </div>
          </div>
        </aside>

        {/* Content Panel Area */}
        <div className="flex-1 min-w-0">
          {/* RENDER TAB 1: GENERAL STATS METRICS & CHARTS */}
          {activeTab === 'stats' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Quick Stats Grid block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Sales Volume */}
                <div className="p-6 bg-white border border-slate-100 shadow-2xs rounded-3xl flex items-center gap-4">
                  <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <BadgeDollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Total Omset</span>
                    <strong className="text-xl font-bold font-mono text-slate-800">{formatIDR(totalSalesRevenue)}</strong>
                  </div>
                </div>

                {/* Total Books */}
                <div className="p-6 bg-white border border-slate-100 shadow-2xs rounded-3xl flex items-center gap-4">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Katalog Buku</span>
                    <strong className="text-xl font-bold text-slate-800">{ebooks.length} Ebook</strong>
                  </div>
                </div>

                {/* User Accounts */}
                <div className="p-6 bg-white border border-slate-100 shadow-2xs rounded-3xl flex items-center gap-4">
                  <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Pengguna</span>
                    <strong className="text-xl font-bold text-slate-800">{users.length} Akun</strong>
                  </div>
                </div>

                {/* Total Transaction quantity */}
                <div className="p-6 bg-white border border-slate-100 shadow-2xs rounded-3xl flex items-center gap-4">
                  <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Penjualan</span>
                    <strong className="text-xl font-bold text-slate-800">{transactions.length} Transaksi</strong>
                  </div>
                </div>
              </div>

              {/* Graphical Activity Trends section (SVGs based custom linear model) */}
              <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs">
                <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" /> Tren Penjualan Minggu Ini (Rp)
                </h3>

                {/* Simulated bar chart visual mapping */}
                <div className="space-y-4">
                  {salesTrendData.map((day, i) => {
                    const percent = Math.round((day.sales / maxGraphValue) * 100);
                    return (
                      <div key={i} className="flex items-center gap-4 text-xs font-medium">
                        <span className="w-16 text-slate-500 text-right">{day.label}</span>
                        <div className="flex-1 bg-slate-100 h-6 rounded-lg overflow-hidden relative border border-slate-50 shadow-2xs">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-lg transition-all" 
                            style={{ width: `${percent}%` }} 
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold font-mono text-white text-[10px] drop-shadow-xs">
                            {formatIDR(day.sales)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <p className="text-[11px] text-slate-400 mt-5 text-center leading-relaxed">
                  *Grafik representasi volume omset penjualan e-book digital dipicu real-time berdasarkan aktivitas simulative checkout pengguna.
                </p>
              </div>
            </div>
          )}

          {/* RENDER TAB 2: BOOKS CRUD MANAGEMENT DIRECTORY */}
          {activeTab === 'books' && (
            <div className="space-y-6 animate-fade-in col-span-1">
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <strong className="text-xs font-bold text-slate-500 uppercase">DAFTAR EBOOK DIRECTORY</strong>
                {!showBookForm && (
                  <button
                    onClick={() => { resetBookForm(); setShowBookForm(true); }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Tambah Ebook Baru
                  </button>
                )}
              </div>

              {/* Form Add / Edit Modal Sheet pop-up block */}
              {showBookForm && (
                <form onSubmit={handleSaveEbook} className="bg-white border border-rose-150 p-6 rounded-3xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h4 className="font-bold text-slate-800 text-sm md:text-base">
                      {editingBookId ? `Sunting Ebook (ID: ${editingBookId})` : 'Daftarkan Ebook Baru'}
                    </h4>
                    <button
                      type="button"
                      onClick={resetBookForm}
                      className="p-1 px-2.5 bg-slate-100 text-slate-500 rounded-lg text-xs hover:bg-slate-200"
                    >
                      <X className="w-3.5 h-3.5 inline mr-1" /> Tutup
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold text-slate-600">
                    <div className="md:col-span-2 space-y-3">
                      <div>
                        <label className="block mb-1 text-slate-650">Judul Ebook</label>
                        <input
                          type="text"
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="Contoh: Belajar Pemrograman Rust Dasar"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-normal"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-slate-650">Penulis Karya / Penulis</label>
                        <input
                          type="text"
                          value={formAuthor}
                          onChange={(e) => setFormAuthor(e.target.value)}
                          placeholder="Contoh: Henry Manampiring"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-normal"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block mb-1 text-slate-650">Kategori</label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-normal"
                        >
                          {EBOOK_CATEGORIES.filter(x => x !== 'Semua Kategori').map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1 text-slate-650">Kompensasi Harga Ebook (Rp)</label>
                        <input
                          type="number"
                          value={formPrice}
                          onChange={(e) => setFormPrice(Number(e.target.value))}
                          placeholder="0"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-normal"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-xs font-semibold text-slate-605">
                    <div>
                      <label className="block mb-1">Link URL Cover Photo (Unsplash/Imgur)</label>
                      <input
                        type="text"
                        value={formCoverUrl}
                        onChange={(e) => setFormCoverUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-normal"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Sinopsis Deskripsi</label>
                      <textarea
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        rows={3}
                        placeholder="Tuliskan latar belakang, segmen pembaca, dan manfaat isi buku..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-normal"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Isi Lembar Halaman Buku (Pisahkan per halaman manual dengan token kata <code className="text-rose-600 font-bold bg-rose-50 px-1 py-0.5 rounded">---PAGE---</code>)</label>
                      <textarea
                        value={formPagesText}
                        onChange={(e) => setFormPagesText(e.target.value)}
                        rows={6}
                        placeholder={`Contoh:\nHalaman Pertama teks disini...\n\n---PAGE---\n\nHalaman Kedua teks disini...`}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-mono font-normal text-xs"
                      />
                      <span className="text-[10px] text-slate-400 font-medium block mt-1">
                        *Catatan: Jika dikosongkan, sistem cerdas kami otomatis meramu 3 halaman dummy template materi digital interaktif untuk pembaca!
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={resetBookForm}
                      className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-750 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Save className="w-4 h-4" /> Simpan Perubahan Ebook
                    </button>
                  </div>
                </form>
              )}

              {/* Directory books table lists */}
              <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
                      <tr>
                        <th className="p-4">Cover & Judul</th>
                        <th className="p-4">Kategori</th>
                        <th className="p-4">Harga</th>
                        <th className="p-4">Halaman</th>
                        <th className="p-4 text-center">Aksi Operasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ebooks.map((eb) => (
                        <tr key={eb.id} className="hover:bg-slate-50/50">
                          <td className="p-4 flex gap-3 items-center min-w-[200px]">
                            <img
                              src={eb.coverUrl}
                              alt={eb.title}
                              referrerPolicy="no-referrer"
                              className="w-10 h-14 object-cover rounded-lg border border-slate-100 shrink-0"
                            />
                            <div className="min-w-0">
                              <strong className="text-slate-800 font-bold text-sm block truncate">{eb.title}</strong>
                              <span className="text-slate-400 text-[10px] block">Oleh {eb.author}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded text-[10px]">
                              {eb.category}
                            </span>
                          </td>
                          <td className="p-4 font-bold font-mono text-slate-800">{formatIDR(eb.price)}</td>
                          <td className="p-4 font-mono font-semibold">{eb.pages.length} Hlm</td>
                          <td className="p-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => triggerEdit(eb)}
                                title="Edit Buku"
                                className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus definitif ebook '${eb.title}' dari katalog online?`)) {
                                    onDeleteEbook(eb.id);
                                  }
                                }}
                                title="Hapus Buku"
                                className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* RENDER TAB 3: REGISTERED USERS AUDITOR & CREDITER */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-800 pb-2 border-b border-slate-100">Audit & Kelola User-Account</h3>
              
              <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
                      <tr>
                        <th className="p-4">Pengguna</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role Hak Akses</th>
                        <th className="p-4">Saldo Virtual</th>
                        <th className="p-4 text-center">Operasi Kredit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((us) => (
                        <tr key={us.id} className="hover:bg-slate-50/50">
                          <td className="p-4 flex gap-3 items-center">
                            <img
                              src={us.avatar}
                              alt={us.username}
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 bg-slate-100 rounded-full border border-slate-200 object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${us.username}`;
                              }}
                            />
                            <div>
                              <strong className="font-bold text-slate-805 block">{us.fullName}</strong>
                              <span className="text-[10px] text-slate-400">@{us.username}</span>
                            </div>
                          </td>
                          <td className="p-4 font-mono">{us.email}</td>
                          <td className="p-4">
                            <select
                              value={us.role}
                              onChange={(e) => onUpdateUserRole(us.id, e.target.value as 'user' | 'admin')}
                              className="bg-slate-50 border border-slate-200 outline-none rounded-lg p-1 text-[11px] font-semibold cursor-pointer text-slate-700"
                            >
                              <option value="user">Reguler User</option>
                              <option value="admin">Sistem Admin</option>
                            </select>
                          </td>
                          <td className="p-4 font-mono font-bold text-slate-700">{formatIDR(us.balance)}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => onInjectUserBalance(us.id, 50000)}
                              className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-lg hover:bg-emerald-100 cursor-pointer active:scale-95 transition-all"
                            >
                              + Rp50.050 Cash
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* RENDER TAB 4: TRANSACTIONS MONITOR LOGS */}
          {activeTab === 'transactions' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-800 pb-2 border-b border-slate-100">Jurnal Jual Beli Global</h3>
              
              <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
                      <tr>
                        <th className="p-4">No Invoice</th>
                        <th className="p-4">ID Pelanggan</th>
                        <th className="p-4">Tanggal Transaksi</th>
                        <th className="p-4">Harga / Nominal</th>
                        <th className="p-4">Metode Bayar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/50 font-mono">
                          <td className="p-4 font-bold text-slate-800">{tx.invoiceNumber}</td>
                          <td className="p-4">{tx.userId}</td>
                          <td className="p-4 text-slate-500 font-sans">{tx.date}</td>
                          <td className="p-4 font-bold text-blue-600">{formatIDR(tx.totalAmount)}</td>
                          <td className="p-4 text-slate-500 font-sans">{tx.paymentMethod}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
