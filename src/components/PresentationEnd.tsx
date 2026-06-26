import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Send, MessageSquare, CheckCircle2, ChevronDown, Sparkles, Phone } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  idx: number;
}

// Komponen SVG Logo WhatsApp Kustom (Clean & Authentic)
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className}
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function FAQAccordionItem({ question, answer, idx }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.1, duration: 0.4 }}
      className="border-2 border-slate-200 rounded-2xl bg-white overflow-hidden shadow-md hover:shadow-xl hover:border-blue-200 transition-all duration-300"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all"
      >
        <span className="text-xs font-bold text-slate-800 tracking-wide flex items-center gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-[10px] font-black shrink-0">
            {idx + 1}
          </span>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`shrink-0 p-2 rounded-xl ${isOpen ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 pt-2 text-xs text-slate-600 leading-relaxed bg-gradient-to-br from-slate-50 to-blue-50/30 border-t border-slate-100">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PresentationEnd() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Layanan Pendidikan', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const faqData = [
    {
      question: "Bagaimana eduHub mendukung ekosistem The LOCAL Enablers?",
      answer: "eduHub dirancang khusus sebagai platform distribusi modul literatur digital, laporan riset aksi, dan panduan praktis pemberdayaan masyarakat lokal guna meningkatkan kapabilitas SDM di daerah."
    },
    {
      question: "Apakah materi di dalam platform ini dapat diakses secara luring (offline)?",
      answer: "Untuk saat ini, seluruh Ebook dan modul interaktif diakses via Reader berbasis web guna memastikan Anda selalu mendapatkan revisi konten paling mutakhir dari penulis."
    },
    {
      question: "Bagaimana institusi formal mengajukan kolaborasi kustom?",
      answer: "Sekolah, universitas, atau lembaga swadaya dapat mengisi formulir pengajuan di halaman ini dengan memilih subjek 'Kemitraan Institusi' untuk mendapatkan skema dasbor multi-user khusus."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: 'Layanan Pendidikan', message: '' });
    }, 1500);
  };

  // Generate tautan WhatsApp dinamis dengan pesan pembuka otomatis
  const whatsappMessage = encodeURIComponent("Halo Admin eduHub, saya butuh bantuan darurat teknis terkait layanan akun/kendala transaksi sistem.");
  const whatsappUrl = `https://wa.me/6281234567890?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen font-sans antialiased text-slate-800 pb-16">
      
      {/* Hero Section */}
      <motion.div 
        className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-4 overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            className="flex justify-center mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="px-5 py-2 bg-gradient-to-r from-[#c8963e] to-[#ab7f30] text-white rounded-full text-[10px] font-extrabold tracking-wider uppercase shadow-lg flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Layanan Konsultasi & Hubungan Pendidikan
            </span>
          </motion.div>

          <motion.div 
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              Ada Pertanyaan? Mari <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c8963e] via-amber-300 to-[#c8963e]">Berdialog</span>
            </h2>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Punya kendala teknis, butuh panduan kurikulum, atau ingin menjajaki kemitraan strategis? Kirimkan pesan Anda langsung ke tim kurator eduHub.
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4">
        
        {/* Grid Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12 mt-12">
          
          {/* SISI KIRI: FORMULIR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7 bg-white border-2 border-slate-200 rounded-[2rem] p-6 md:p-8 shadow-xl relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="inquiry-form"
                  onSubmit={handleSubmit} 
                  className="space-y-5"
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Nama Anda ...."
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-[#c8963e] focus:bg-white rounded-xl text-xs transition-all text-slate-800 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Alamat Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="ari@example.com"
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-[#c8963e] focus:bg-white rounded-xl text-xs transition-all text-slate-800 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Subjek Kepentingan</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-[#c8963e] focus:bg-white rounded-xl text-xs transition-all text-slate-700 font-medium cursor-pointer"
                    >
                      <option value="Layanan Pendidikan">Layanan Pendidikan / Kurikulum Modul</option>
                      <option value="Kendala Akun & Transaksi">Kendala Akses Buku & Topup</option>
                      <option value="Kemitraan Institusi">Kemitraan Institusi & CSR</option>
                      <option value="Umpan Balik Fitur">Saran & Umpan Balik Sistem</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Isi Pertanyaan / Pesan</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Tuliskan secara detail apa yang bisa kami bantu..."
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-[#c8963e] focus:bg-white rounded-xl text-xs transition-all text-slate-800 resize-none leading-relaxed placeholder:text-slate-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-[#c8963e] to-[#ab7f30] hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all shadow-lg uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Kirim Pertanyaan</span>
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success-prompt"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 space-y-5"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-xl">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-slate-900 uppercase tracking-wide">Pertanyaan Berhasil Terkirim!</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      Terima kasih telah menghubungi kami. Tiket respon Anda telah dicatat, tim representatif kami akan membalas via email dalam waktu maksimal 1x24 jam.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs font-bold text-[#c8963e] hover:text-[#ab7f30] underline uppercase tracking-wider transition-colors pt-2 cursor-pointer"
                  >
                    Kirim Pertanyaan Lain
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* SISI KANAN: FAQ */}
          <motion.div 
            className="lg:col-span-5 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 px-1 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-md">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-800">Pertanyaan Umum (FAQ)</h3>
            </div>
            
            <div className="space-y-3">
              {faqData.map((faq, index) => (
                <FAQAccordionItem
                  key={index}
                  idx={index}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          </motion.div>

        </div>

        {/* Footer Informasional Singkat / WhatsApp Redirection */}
        <motion.div 
          className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 rounded-2xl p-6 border-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-left max-w-4xl mx-auto shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
              <HelpCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">Butuh Bantuan Darurat Teknis?</h5>
              <p className="text-xs text-slate-500 leading-relaxed">
                Jika Anda mengalami masalah saat memproses transaksi pembayaran atau <i>topup</i> saldo digital, layanan bantuan WhatsApp Center kami aktif 24/7.
              </p>
            </div>
          </div>
          
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow-lg hover:shadow-xl flex items-center gap-2 group"
          >
            <WhatsAppIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>WhatsApp Center</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
}