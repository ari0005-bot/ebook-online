import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, RefreshCw, Bookmark, Sparkles, Laptop, Search, Sliders, ArrowRight } from 'lucide-react';

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  idx: number;
  key?: React.Key;
}

function BenefitCard({ icon, title, description, idx }: BenefitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1, duration: 0.4 }}
      className="p-6 bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-start text-left group"
    >
      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-slate-800 mb-2">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </motion.div>
  );
}

export default function PresentationEnd() {
  const benefits = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Membaca Ebook Langsung',
      description: 'Lupakan aplikasi pihak ketiga. Nikmati halaman demi halaman buku favorit langsung dari web browser Anda kapan pun.'
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: 'Progress Membaca Otomatis',
      description: 'Sistem cerdas menyimpan persentase baca terakhir Anda. Buka perangkat apa pun, lanjutkan membaca di kalimat yang sama.'
    },
    {
      icon: <Bookmark className="w-6 h-6" />,
      title: 'Bookmark Halaman',
      description: 'Tandai bab penting, simpan halaman kutipan favorit lengkap dengan catatan refleksi pribadi Anda.'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'User Experience Lebih Baik',
      description: 'Desain modern, transisi halaman mulus, visual cover yang menawan, serta fungsionalitas pencarian super cepat.'
    },
    {
      icon: <Laptop className="w-6 h-6" />,
      title: 'Responsive Desktop & Mobile',
      description: 'Tampilan yang lentur beradaptasi sempurna pada laptop kerja Anda maupun layar smartphone saat bermacet-ria.'
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: 'SEO Friendly',
      description: 'Metadata kaya untuk memudahkan mesin pencari mengindeks katalog buku baru, mendongkrak visibilitas platform.'
    },
    {
      icon: <Sliders className="w-6 h-6" />,
      title: 'Personalisasi Ebook',
      description: 'Rekomendasi buku berbasis minat Anda, review bintang, serta sejarah pembelian buku yang tersimpan rapi.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      {/* Slide Badge */}
      <div className="flex justify-center mb-4">
        <span className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-xs font-bold tracking-wider uppercase shadow-xs">
          Slide Presentasi Terakhir
        </span>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Keunggulan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Website Baru</span>
        </h2>
        <p className="text-slate-500 mt-3 text-sm md:text-base leading-relaxed">
          Platform buku digital generasi berikutnya yang menjembatani kenyamanan membaca konvensional dengan kepraktisan teknologi modern.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((b, i) => (
          <BenefitCard
            key={i}
            icon={b.icon}
            title={b.title}
            description={b.description}
            idx={i}
          />
        ))}

        {/* Call to action element as the last item to fill grid beautifully */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white flex flex-col justify-between items-start text-left shadow-sm hover:shadow-lg transition-all duration-300 md:col-span-1 lg:col-span-1"
        >
          <div>
            <span className="text-xs bg-white/20 text-white font-medium px-2.5 py-1 rounded-md">MULAI SEKARANG</span>
            <h4 className="text-xl font-bold mt-4 mb-2">Buktikan Sendiri Kemudahannya</h4>
            <p className="text-white/80 text-xs leading-relaxed">
              Jelajahi ratusan koleksi ebook terbaik, dapatkan sensasi membaca premium yang belum pernah ada sebelumnya.
            </p>
          </div>
          <button className="mt-6 flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer group w-full justify-between">
            <span>Masuk ke Katalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
