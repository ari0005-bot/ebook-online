import React from 'react';
import { motion } from 'motion/react';
import { Ebook, Article } from '../types';
import {
  BookOpen, ArrowRight, Star, Sparkles, Users, Award, TrendingUp,
  BookMarked, ShieldCheck, Zap, Globe, Heart, ChevronRight, Library
} from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  feedback: string;
}

interface LandingPageProps {
  ebooks: Ebook[];
  popularEbooks: Ebook[];
  articles: Article[];
  testimonials: Testimonial[];
  categories: string[];
  onNavigateCatalog: () => void;
  onNavigatePresentation: () => void;
  onSelectEbook: (eb: Ebook) => void;
  onSelectArticle: (art: Article) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export default function LandingPage({
  ebooks,
  popularEbooks,
  articles,
  testimonials,
  categories,
  onNavigateCatalog,
  onNavigatePresentation,
  onSelectEbook,
  onSelectArticle,
}: LandingPageProps) {
  const stats = [
    { icon: BookMarked, label: 'Koleksi Ebook', value: `${ebooks.length}+` },
    { icon: Users, label: 'Pembaca Aktif', value: '12K+' },
    { icon: Star, label: 'Rating Rata-rata', value: '4.8' },
    { icon: Award, label: 'Penulis Terpilih', value: '50+' },
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Reader Premium',
      desc: 'Baca ebook dengan tampilan immersive, bookmark halaman, dan mode gelap yang nyaman di mata.',
      gradient: 'from-blue-500 to-cyan-400',
    },
    {
      icon: ShieldCheck,
      title: 'Transaksi Aman',
      desc: 'Sistem pembayaran digital terpercaya dengan riwayat transaksi transparan dan invoice otomatis.',
      gradient: 'from-emerald-500 to-teal-400',
    },
    {
      icon: Zap,
      title: 'Akses Instan',
      desc: 'Langsung baca setelah pembelian. Koleksi digital Anda tersimpan permanen di perpustakaan pribadi.',
      gradient: 'from-amber-500 to-orange-400',
    },
    {
      icon: Globe,
      title: 'Baca Di Mana Saja',
      desc: 'Akses dari perangkat apapun, kapan saja. Progres membaca tersinkronisasi secara otomatis.',
      gradient: 'from-violet-500 to-purple-400',
    },
  ];

  return (
    <div className="space-y-0 overflow-hidden">
      {/* ====================== HERO SECTION ====================== */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(59,130,246,0.1),_transparent_60%)]" />

        {/* Decorative grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 w-full">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-full text-xs font-semibold text-blue-300 tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Platform Ebook Digital #1 Indonesia
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]"
            >
              Jelajahi Dunia
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                Literasi Digital
              </span>
              <br />
              Tanpa Batas.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-lg mx-auto lg:mx-0"
            >
              Akses ratusan koleksi ebook berkualitas dari sastra hingga teknologi.
              Baca kapan saja, di mana saja dengan reader premium kami.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={onNavigateCatalog}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Mulai Membaca</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onNavigatePresentation}
                className="px-8 py-4 bg-white/[0.06] hover:bg-white/[0.1] backdrop-blur-sm border border-white/10 text-white rounded-2xl text-sm font-semibold cursor-pointer transition-all duration-300"
              >
                Keunggulan Platform
              </button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center gap-4 justify-center lg:justify-start pt-4"
            >
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=40',
                  'https://images.unsplash.com/photo-1570295999915-56ceb5ecca61?auto=format&fit=crop&q=80&w=40',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=40',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=40',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="reader"
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
                  />
                ))}
              </div>
              <div className="text-xs text-slate-400">
                <span className="text-white font-bold">12,000+</span> pembaca aktif
              </div>
            </motion.div>
          </div>

          {/* Right hero - floating book cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex-1 w-full max-w-md lg:max-w-lg"
          >
            <div className="relative flex items-center justify-center">
              {/* Glow ring */}
              <div className="absolute w-[320px] h-[320px] md:w-[400px] md:h-[400px] rounded-full border border-white/5 bg-gradient-to-br from-blue-500/5 to-transparent" />
              <div className="absolute w-[240px] h-[240px] md:w-[300px] md:h-[300px] rounded-full border border-white/5" />

              {/* Main book */}
              <div className="relative z-10 w-48 md:w-56 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20 border border-white/10">
                {popularEbooks[0] && (
                  <img
                    src={popularEbooks[0].coverUrl}
                    alt={popularEbooks[0].title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[9px] bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded uppercase">Terpopuler</span>
                  <p className="text-white text-xs font-bold mt-1.5 line-clamp-1">{popularEbooks[0]?.title}</p>
                </div>
              </div>

              {/* Secondary floating books */}
              {popularEbooks[1] && (
                <div className="absolute -left-8 md:-left-12 top-8 w-32 md:w-40 aspect-[3/4] rounded-xl overflow-hidden shadow-xl border border-white/10 -rotate-12 opacity-70 hover:opacity-100 transition-opacity">
                  <img src={popularEbooks[1].coverUrl} alt={popularEbooks[1].title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              )}
              {popularEbooks[2] && (
                <div className="absolute -right-6 md:-right-10 bottom-4 w-28 md:w-36 aspect-[3/4] rounded-xl overflow-hidden shadow-xl border border-white/10 rotate-6 opacity-60 hover:opacity-100 transition-opacity">
                  <img src={popularEbooks[2].coverUrl} alt={popularEbooks[2].title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom gradient transition */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* ====================== STATS BAR ====================== */}
      <section className="relative bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="text-center space-y-2"
              >
                <div className="w-12 h-12 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-2xl md:text-3xl font-black text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== FEATURES SECTION ====================== */}
      <section className="bg-slate-50 py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-widest mb-4">
              Mengapa Memilih Kami
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Pengalaman Membaca yang
              <span className="text-blue-600"> Tak Tertandingi</span>
            </h2>
            <p className="text-sm text-slate-500 mt-4 leading-relaxed">
              Kami menghadirkan fitur-fitur unggulan yang dirancang khusus untuk kenyamanan dan kepuasan pembaca digital Indonesia.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== POPULAR EBOOKS ====================== */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-widest mb-3">
                Pilihan Terpopuler
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Ebook Paling Banyak Dibaca
              </h2>
              <p className="text-xs text-slate-500 mt-2 max-w-md">
                Koleksi pilihan dengan rating tertinggi dari ribuan pembaca aktif harian.
              </p>
            </motion.div>
            <button
              onClick={onNavigateCatalog}
              className="group text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              Lihat Semua ({ebooks.length})
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularEbooks.map((eb, i) => (
              <motion.div
                key={eb.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                onClick={() => onSelectEbook(eb)}
                className="group bg-white rounded-2xl border border-slate-100 hover:border-blue-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                  <img
                    src={eb.coverUrl}
                    alt={eb.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {eb.isNew && (
                    <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-sm">
                      Baru
                    </span>
                  )}
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-amber-400 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {eb.rating}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">{eb.category}</span>
                    <h4 className="font-bold text-slate-900 leading-snug line-clamp-2 text-sm">{eb.title}</h4>
                    <p className="text-xs text-slate-400">Oleh {eb.author}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-sm">
                      {eb.price === 0 ? 'GRATIS' : `Rp ${eb.price.toLocaleString('id-ID')}`}
                    </span>
                    <span className="text-[11px] text-blue-600 font-bold group-hover:underline flex items-center gap-0.5">
                      Detail <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== CATEGORIES SECTION ====================== */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.08),_transparent_70%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl mx-auto mb-12"
          >
            <span className="inline-block px-3 py-1 bg-white/10 text-blue-300 text-[10px] font-bold rounded-full uppercase tracking-widest mb-4">
              Jelajahi Kategori
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Temukan Buku Sesuai
              <span className="text-cyan-400"> Minat Anda</span>
            </h2>
            <p className="text-sm text-slate-400 mt-4 leading-relaxed">
              Navigasi lebih mudah dengan kategori yang dipilah cermat sesuai segmentasi minat dan bakat Anda.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
            {categories.map((cat, i) => (
              <motion.button
                key={cat}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                onClick={onNavigateCatalog}
                className="px-5 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] backdrop-blur-sm border border-white/10 hover:border-white/20 text-white text-sm font-medium rounded-xl cursor-pointer transition-all duration-300 hover:scale-105"
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Decorative bottom books icon */}
          <div className="mt-16 flex items-center justify-center gap-2 text-slate-600">
            <Library className="w-5 h-5" />
            <span className="text-xs font-medium">{ebooks.length} buku tersedia di perpustakaan digital</span>
          </div>
        </div>
      </section>

      {/* ====================== ARTICLES SECTION ====================== */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-widest mb-4">
              Blog & Literasi
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Artikel & Tips Terbaru
            </h2>
            <p className="text-sm text-slate-500 mt-4 leading-relaxed">
              Kumpulan tips membaca, ulasan kebiasaan baik, serta tren teknologi pendukung literasi digital.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((art, i) => (
              <motion.article
                key={art.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                onClick={() => onSelectArticle(art)}
                className="group bg-white rounded-2xl border border-slate-100 hover:border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  <img
                    src={art.coverUrl}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute top-3 left-3 bg-blue-600 text-white font-bold text-[9px] px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-sm">
                    {art.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[10px] text-slate-400 font-mono mb-2">{art.date} &middot; {art.readTime}</span>
                  <h4 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors mb-3">
                    {art.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 flex-grow">{art.summary}</p>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-1">
                      Baca Selengkapnya
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== TESTIMONIALS ====================== */}
      <section className="bg-slate-50 py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-[10px] font-bold rounded-full uppercase tracking-widest mb-4">
              Testimoni Pembaca
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Apa Kata Mereka
              <span className="text-violet-600"> Tentang Kami?</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative"
              >
                {/* Quote deco */}
                <div className="absolute top-5 right-5 text-4xl font-serif text-slate-100 leading-none select-none">&ldquo;</div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-slate-600 leading-relaxed italic relative z-10 flex-grow">
                  &ldquo;{t.feedback}&rdquo;
                </p>

                <div className="flex items-center gap-3 border-t border-slate-100 pt-5 mt-5">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border-2 border-slate-100"
                  />
                  <div>
                    <strong className="text-sm font-bold text-slate-900 block">{t.name}</strong>
                    <span className="text-[11px] text-slate-400 font-medium">{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== CTA SECTION ====================== */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.1),_transparent_60%)]" />

        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <Heart className="w-10 h-10 text-white/50 mx-auto" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Siap Memulai Petualangan Literasi Anda?
            </h2>
            <p className="text-base text-white/70 max-w-lg mx-auto leading-relaxed">
              Bergabunglah dengan ribuan pembaca digital Indonesia. Temukan ebook favorit Anda dan mulai membaca hari ini.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <button
                onClick={onNavigateCatalog}
                className="group px-10 py-4 bg-white text-indigo-700 hover:bg-slate-50 rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Jelajahi Katalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onNavigatePresentation}
                className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl text-sm font-semibold cursor-pointer transition-all duration-300"
              >
                Pelajari Lebih Lanjut
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
