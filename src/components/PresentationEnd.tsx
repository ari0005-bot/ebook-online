import React from 'react';
import { motion } from 'motion/react';
import { Check, ShieldCheck, Zap, Crown, Sparkles, HelpCircle } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  icon: React.ReactNode;
  idx: number;
}

function PricingCard({ title, price, description, features, isPopular, icon, idx }: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1, duration: 0.4 }}
      className={`p-6 rounded-[2rem] flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-1 ${
        isPopular 
          ? 'bg-slate-900 text-white shadow-xl ring-4 ring-blue-500/30' 
          : 'bg-white border border-slate-200 text-slate-800 shadow-xs'
      }`}
    >
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-md flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Paling Populer
        </span>
      )}

      <div>
        {/* Header Paket */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl ${isPopular ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            {icon}
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${isPopular ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
            {title}
          </span>
        </div>

        {/* Harga */}
        <div className="my-4">
          <span className="text-3xl font-black tracking-tight">{price}</span>
          <span className={`text-xs ${isPopular ? 'text-slate-400' : 'text-slate-500'}`}> / bulan</span>
        </div>

        <p className={`text-xs leading-relaxed mb-6 ${isPopular ? 'text-slate-350' : 'text-slate-500'}`}>
          {description}
        </p>

        <hr className={`my-4 ${isPopular ? 'border-slate-800' : 'border-slate-100'}`} />

        {/* Daftar Fitur */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, fIdx) => (
            <li key={fIdx} className="flex items-start gap-2.5 text-xs">
              <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={isPopular ? 'text-slate-350' : 'text-slate-650'}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tombol Aksi */}
      <button
        className={`w-full py-3 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs uppercase tracking-wide ${
          isPopular
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-95'
            : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
        }`}
      >
        Pilih Paket
      </button>
    </motion.div>
  );
}

export default function PresentationEnd() {
  const plans = [
    {
      title: 'Lite Reader',
      price: 'Rp 29.000',
      description: 'Cocok untuk pembaca santai yang ingin menjelajahi literatur dasar tanpa komitmen besar.',
      icon: <ShieldCheck className="w-5 h-5" />,
      features: [
        'Akses ke 50+ Ebook pilihan',
        'Membaca langsung di web browser',
        'Simpan hingga 5 bookmark harian',
        'Satu perangkat aktif'
      ]
    },
    {
      title: 'Premium Member',
      price: 'Rp 59.000',
      description: 'Pilihan terbaik untuk pelajar dan profesional yang membutuhkan akses referensi luas dan fitur cerdas.',
      icon: <Zap className="w-5 h-5" />,
      isPopular: true,
      features: [
        'Akses UNLIMITED ke semua Katalog Ebook',
        'Progress membaca otomatis di seluruh perangkat',
        'Fitur Bookmark & Catatan Refleksi Tanpa Batas',
        'Akses grup diskusi eksklusif & review buku',
        'Prioritas rilis Ebook baru setiap minggu'
      ]
    },
    {
      title: 'Corporate / Fam',
      price: 'Rp 149.000',
      description: 'Paket bundling hemat untuk kebutuhan tim operasional, institusi pendidikan, maupun koleksi keluarga.',
      icon: <Crown className="w-5 h-5" />,
      features: [
        'Semua fitur Premium Member',
        'Hingga 5 akun anggota aktif',
        'Dasbor monitoring membaca bagi admin grup',
        'Metode pembayaran faktur/invoicing',
        'Layanan bantuan prioritas 24/7'
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Badge Atas */}
      <div className="flex justify-center mb-4">
        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-extrabold tracking-wider uppercase border border-blue-200">
          Paket Layanan Pendidikan
        </span>
      </div>

      {/* Judul Utama */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Investasi Pengetahuan Tanpa <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Batas Ruang</span>
        </h2>
        <p className="text-slate-500 mt-3 text-sm leading-relaxed">
          Pilih paket berlangganan bulanan yang paling sesuai dengan ritme belajar Anda. Batalkan atau tingkatkan keanggotaan kapan saja dengan mudah.
        </p>
      </div>

      {/* Grid Paket Berlangganan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-16">
        {plans.map((plan, i) => (
          <PricingCard
            key={i}
            idx={i}
            title={plan.title}
            price={plan.price}
            description={plan.description}
            icon={plan.icon}
            features={plan.features}
            isPopular={plan.isPopular}
          />
        ))}
      </div>

      {/* Footer Informasional Singkat */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-left max-w-4xl mx-auto">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Butuh Paket Kustom atau Akses Sekolah?</h5>
            <p className="text-xs text-slate-500 mt-0.5">Hubungi tim kemitraan kami untuk mendapatkan penawaran khusus institusi formal dan program CSR.</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer">
          Hubungi Kami
        </button>
      </div>
    </div>
  );
}