import { useState } from 'react';
import { Ebook, User, Transaction } from '../types';
import { ShoppingBag, Trash2, CreditCard, ChevronRight, CheckCircle, ShieldCheck, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';

interface CartCheckoutProps {
  cartItems: Ebook[];
  currentUser: User | null;
  onRemoveFromCart: (ebook: Ebook) => void;
  onCheckoutSuccess: (purchasedBookIds: string[], transactionRecord: Transaction, newBalance: number) => void;
  onBackToCatalog: () => void;
  onTopUp: (amount: number) => void;
}

export default function CartCheckout({
  cartItems,
  currentUser,
  onRemoveFromCart,
  onCheckoutSuccess,
  onBackToCatalog,
  onTopUp
}: CartCheckoutProps) {
  const [step, setStep] = useState<'cart' | 'payment' | 'completed'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va' | 'card'>('qris');
  
  // Credit card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const [paying, setPaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [recentTransaction, setRecentTransaction] = useState<Transaction | null>(null);

  // Bill computations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const tax = Math.round(subtotal * 0.11); // PPN 11%
  const platformFee = subtotal > 0 ? 2500 : 0; // standard platform contribution
  const grandTotal = subtotal + tax + platformFee;

  const handlePay = () => {
    setErrorMsg('');
    if (!currentUser) {
      setErrorMsg('Anda harus masuk terlebih dahulu untuk melakukan checkout.');
      return;
    }

    if (currentUser.balance < grandTotal) {
      setErrorMsg('Saldo virtual Anda tidak jenuh. Silakan klik tombol "Isi Saldo Rp100.000 Gratis" untuk menambah saldo!');
      return;
    }

    // Fill in mock forms
    if (paymentMethod === 'card' && (!cardNumber || !cardHolder)) {
      setErrorMsg('Lengkapi detail nomor dan pemegang kartu kredit Anda.');
      return;
    }

    setPaying(true);
    
    setTimeout(() => {
      const invoiceNo = `INV/${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}/EBOOK/${Math.floor(1000 + Math.random() * 9000)}`;
      const newBalance = currentUser.balance - grandTotal;

      const record: Transaction = {
        id: 'tx-' + Math.random().toString(36).substring(2, 9),
        userId: currentUser.id,
        ebookIds: cartItems.map(item => item.id),
        totalAmount: grandTotal,
        paymentMethod: paymentMethod === 'qris' 
          ? 'QRIS Mandiri Standar' 
          : paymentMethod === 'va' 
            ? 'Virtual Account BCA' 
            : 'Debit/Credit Card Online',
        status: 'success',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        invoiceNumber: invoiceNo
      };

      setRecentTransaction(record);
      onCheckoutSuccess(cartItems.map(item => item.id), record, newBalance);
      setPaying(false);
      setStep('completed');
    }, 1500);
  };

  const formatIDR = (num: number) => {
    if (num === 0) return 'Rp 0';
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Checkout step progress flow badges */}
      <div className="flex justify-center items-center gap-4 md:gap-8 mb-10 overflow-x-auto py-2">
        <button 
          onClick={() => step === 'payment' && setStep('cart')}
          disabled={step === 'completed'}
          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${step === 'cart' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'cart' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>1</span>
          Keranjang Belanja
        </button>
        <ChevronRight className="w-4 h-4 text-slate-300 hidden sm:block" />
        <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${step === 'payment' ? 'text-blue-600' : 'text-slate-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'payment' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>2</span>
          Konfirmasi Pembayaran
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 hidden sm:block" />
        <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${step === 'completed' ? 'text-emerald-600' : 'text-slate-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'completed' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>3</span>
          Selesai Berhasil
        </div>
      </div>

      {/* ERROR MSG ALERTS */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-xs md:text-sm text-rose-800 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Gagal Melanjutkan Pembayaran</p>
            <p className="mt-1">{errorMsg}</p>
            {currentUser && currentUser.balance < grandTotal && (
              <button
                onClick={() => { onTopUp(150000); setErrorMsg(''); }}
                className="mt-2.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Topup Gratis Rp150.000 Sekarang
              </button>
            )}
          </div>
        </div>
      )}

      {/* CASE 1: CART STEP SCREEN */}
      {step === 'cart' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart items list (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Item Belanja ({cartItems.length})</h3>
            
            {cartItems.length === 0 ? (
              <div className="p-8 bg-white border border-slate-100 rounded-3xl text-center space-y-4 shadow-2xs">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-slate-500 text-sm">Keranjang belanja Anda dalam keadaan kosong.</p>
                <button
                  onClick={onBackToCatalog}
                  className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 cursor-pointer"
                >
                  Jelajahi Ebook Sekarang
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 shadow-2xs hover:border-slate-200 transition-all"
                  >
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-14 h-20 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-blue-600/80 uppercase">{item.category}</span>
                      <h4 className="font-bold text-slate-800 text-sm truncate">{item.title}</h4>
                      <p className="text-xs text-slate-400">Oleh {item.author}</p>
                      <span className="text-xs font-bold text-slate-700 block mt-1">{formatIDR(item.price)}</span>
                    </div>
                    <button
                      onClick={() => onRemoveFromCart(item)}
                      title="Hapus dari Keranjang"
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing detailed summary block */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-xs space-y-4 sticky top-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Ringkasan Pesanan</h4>
              
              <div className="space-y-2 border-b border-slate-100 pb-4 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} Buku)</span>
                  <span className="font-mono">{formatIDR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak (PPN 11%)</span>
                  <span className="font-mono">{formatIDR(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Layanan Admin</span>
                  <span className="font-mono">{formatIDR(platformFee)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-slate-800">
                <span className="text-sm font-bold">Total Pembayaran</span>
                <span className="font-extrabold text-base md:text-lg font-mono text-blue-600">
                  {formatIDR(grandTotal)}
                </span>
              </div>

              {/* Virtual check of cash */}
              {currentUser && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <span>Saldo Anda:</span>
                    <span className="font-mono text-slate-800">{formatIDR(currentUser.balance)}</span>
                  </div>
                  {currentUser.balance < grandTotal && (
                    <span className="text-[10px] text-rose-500 block leading-tight">⚠️ Saldo digital Anda tidak mencukupi tagihan ini.</span>
                  )}
                </div>
              )}

              <button
                onClick={() => setStep('payment')}
                disabled={cartItems.length === 0}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-150 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Lanjut ke Pembayaran</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CASE 2: PAYMENT METHOD CONFIG */}
      {step === 'payment' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          
          {/* Payment method checklist selection */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Metode Pembayaran Virtual</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('qris')}
                className={`p-4 border rounded-2xl flex flex-col items-start text-left cursor-pointer transition-all ${paymentMethod === 'qris' ? 'border-blue-600 bg-blue-50/55 text-blue-900' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-xs mb-3">QR</div>
                <h4 className="text-xs font-extrabold mb-1">QRIS Standar</h4>
                <p className="text-[10px] text-slate-450 leading-tight">Scan barcode instan dengan e-wallet apa saja (GoPay, OVO, Dana).</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('va')}
                className={`p-4 border rounded-2xl flex flex-col items-start text-left cursor-pointer transition-all ${paymentMethod === 'va' ? 'border-blue-600 bg-blue-50/55 text-blue-900' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-xs mb-3">VA</div>
                <h4 className="text-xs font-extrabold mb-1">Virtual Account BCA</h4>
                <p className="text-[10px] text-slate-450 leading-tight">Konfirmasi pembayaran langsung lewat M-Banking dalam 1 detik.</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 border rounded-2xl flex flex-col items-start text-left cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/55 text-blue-900' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center font-bold text-xs mb-3">CC</div>
                <h4 className="text-xs font-extrabold mb-1">Debit & Credit Card</h4>
                <p className="text-[10px] text-slate-450 leading-tight">Mendukung kartu Visa, Mastercard, AMEX dengan enkripsi Secure.</p>
              </button>
            </div>

            {/* Render selected configuration simulator */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl">
              {paymentMethod === 'qris' && (
                <div className="flex flex-col items-center text-center space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Scan Kode QRIS Mandiri</h4>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    {/* Simulated SVG dynamic Barcode */}
                    <svg className="w-36 h-36" viewBox="0 0 100 100">
                      <rect width="100" height="100" fill="white" />
                      <rect x="10" y="10" width="20" height="20" fill="black" />
                      <rect x="14" y="14" width="12" height="12" fill="white" />
                      <rect x="16" y="16" width="8" height="8" fill="black" />
                      
                      <rect x="70" y="10" width="20" height="20" fill="black" />
                      <rect x="74" y="14" width="12" height="12" fill="white" />
                      <rect x="76" y="16" width="8" height="8" fill="black" />
                      
                      <rect x="10" y="70" width="20" height="20" fill="black" />
                      <rect x="14" y="74" width="12" height="12" fill="white" />
                      <rect x="16" y="76" width="8" height="8" fill="black" />

                      {/* Random center points simulating QRIS */}
                      <rect x="40" y="40" width="15" height="15" fill="black" />
                      <rect x="45" y="45" width="5" height="5" fill="white" />
                      <rect x="55" y="60" width="10" height="5" fill="black" />
                      <rect x="75" y="75" width="15" height="15" fill="black" />
                      <rect x="70" y="65" width="5" height="10" fill="black" />
                      <rect x="25" y="45" width="5" height="10" fill="black" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NMID: ID1020260279883</span>
                  <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                    Aplikasi kami otomatis mensimulasikan otentikasi pembayaran. Cukup klik tombol 'Bayar Sekarang' di samping untuk merilis dana dari Saldo Digital Anda.
                  </p>
                </div>
              )}

              {paymentMethod === 'va' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-slate-500">Virtual Account BCA Info</h4>
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">NO VIRTUAL ACCOUNT</span>
                      <strong className="text-sm md:text-base font-mono text-slate-800">88301 0857 2217 3349</strong>
                    </div>
                    <span className="font-bold text-[10px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded">BCA AUTO CHECK</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Sistem akan mendeteksi penyelesaian transfer secara realtime pasca dana dirilis dari balance Anda.
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-slate-500">Simulasi Kartu Kredit / Debit</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block">Nomor Kartu (16 Digit)</label>
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4111 2222 3333 4444"
                        className="w-full bg-white outline-none border border-slate-200 focus:border-blue-500 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 block">Pemegang Kartu</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="BUDI HARTONO"
                          className="w-full bg-white outline-none border border-slate-200 focus:border-blue-500 rounded-xl px-3 py-2 text-xs uppercase"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block">CVV</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full bg-white outline-none border border-slate-200 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-center font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-150 flex items-start gap-3 text-xs text-blue-800">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Keamanan Transaksi Terjamin 100%</p>
                <p className="mt-0.5">Seluruh transmisi token data checkout dienkripsi menggunakan sertifikasi SSL end-to-end.</p>
              </div>
            </div>
          </div>

          {/* Pricing detailed summary block repeat */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-xs space-y-4 sticky top-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Total Tagihan</h4>
              
              <div className="flex justify-between items-center text-slate-800 border-b border-slate-100 pb-4">
                <span className="text-xs font-semibold text-slate-500">Buku yang dibeli</span>
                <span className="font-bold font-mono text-sm">{cartItems.length} Buku</span>
              </div>

              <div className="flex justify-between items-center text-slate-800">
                <span className="text-sm font-bold">Harus Dibayar</span>
                <span className="font-extrabold text-base md:text-lg font-mono text-blue-600">
                  {formatIDR(grandTotal)}
                </span>
              </div>

              {currentUser && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Saldo Anda:</span>
                    <span>{formatIDR(currentUser.balance)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-600">
                    <span>Sisa Saldo:</span>
                    <span>{formatIDR(Math.max(0, currentUser.balance - grandTotal))}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handlePay}
                disabled={paying}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-350 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {paying ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Bayar Sekarang ({formatIDR(grandTotal)})</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => setStep('cart')}
                disabled={paying}
                className="w-full py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-250 cursor-pointer"
              >
                Kembali ke Keranjang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CASE 3: COMPLETED INVOICE SCREEN */}
      {step === 'completed' && recentTransaction && (
        <div className="text-center py-12 px-6 bg-white border border-slate-100 rounded-3xl shadow-md max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-2xl font-black text-slate-800">Transaksi Berhasil!</h3>
            <p className="text-slate-500 text-xs">Ebook Anda telah ditransfer ke pustaka membaca pribadi.</p>
          </div>

          {/* Invoice receipt breakdown */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">No. Invoice</span>
              <span className="font-bold text-slate-800">{recentTransaction.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Tanggal</span>
              <span className="text-slate-600">{recentTransaction.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Metode</span>
              <span className="text-slate-600">{recentTransaction.paymentMethod}</span>
            </div>
            <hr className="border-slate-200 my-2" />
            <div className="flex justify-between font-sans text-sm font-bold text-slate-800">
              <span>Total Tagihan</span>
              <span className="text-blue-600 font-mono">{formatIDR(recentTransaction.totalAmount)}</span>
            </div>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-2.5 text-xs text-indigo-805 text-left">
            <Sparkles className="w-5 h-5 text-indigo-500 shrink-0" />
            <p><strong>Akses Cepat Ebook:</strong> Anda sekarang bisa membaca ebook langsung di website di tab 'Ebook Saya'.</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={onBackToCatalog}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs"
            >
              Kembali ke Beranda Ebook
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
