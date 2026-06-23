import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Send, MessageSquare, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';

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
      className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs transition-all"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-slate-50/50 transition-colors"
      >
        <span className="text-xs font-bold text-slate-800 tracking-wide">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`shrink-0 p-1 rounded-lg ${isOpen ? 'bg-amber-50 text-[#c8963e]' : 'bg-slate-100 text-slate-500'}`}
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
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
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

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Badge Atas */}
      <div className="flex justify-center mb-4">
        <span className="px-4 py-1.5 bg-amber-50/60 text-[#c8963e] rounded-full text-[10px] font-extrabold tracking-wider uppercase border border-[#c8963e]/20 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" /> Layanan Konsultasi & Hubungan Pendidikan
        </span>
      </div>

      {/* Judul Utama */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Ada Pertanyaan? Mari <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c8963e] to-[#ab7f30]">Berdialog</span>
        </h2>
        <p className="text-slate-500 mt-3 text-sm leading-relaxed">
          Punya kendala teknis, butuh panduan kurikulum, atau ingin menjajaki kemitraan strategis? Kirimkan pesan Anda langsung ke tim kurator eduHub.
        </p>
      </div>

      {/* Grid Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        
        {/* SISI KIRI: FORMULIR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 shadow-xs relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="inquiry-form"
                onSubmit={handleSubmit} 
                className="space-y-4"
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ari ...."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-[#c8963e] focus:bg-white transition-all text-slate-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Alamat Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="ari@example.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-[#c8963e] focus:bg-white transition-all text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Subjek Kepentingan</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-[#c8963e] focus:bg-white transition-all text-slate-700 font-medium"
                  >
                    <option value="Layanan Pendidikan">Layanan Pendidikan / Kurikulum Modul</option>
                    <option value="Kendala Akun & Transaksi">Kendala Akses Buku & Topup</option>
                    <option value="Kemitraan Institusi">Kemitraan Institusi & CSR</option>
                    <option value="Umpan Balik Fitur">Saran & Umpan Balik Sistem</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Isi Pertanyaan / Pesan</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tuliskan secara detail apa yang bisa kami bantu..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-[#c8963e] focus:bg-white transition-all text-slate-800 resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#c8963e] to-[#ab7f30] hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all shadow-md uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
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
                className="text-center py-12 space-y-4"
              >
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Pertanyaan Berhasil Terkirim!</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Terima kasih telah menghubungi kami. Tiket respon Anda telah dicatat, tim representatif kami akan membalas via email dalam waktu maksimal 1x24 jam.
                  </p>
                </div>
                <button
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
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 px-1 mb-2">
            <MessageSquare className="w-4 h-4 text-[#c8963e]" />
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-700">Pertanyaan Umum (FAQ)</h3>
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
        </div>

      </div>

      {/* Footer Informasional Singkat */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-left max-w-4xl mx-auto">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Butuh Bantuan Darurat Teknis?</h5>
            <p className="text-xs text-slate-500 mt-0.5">Jika Anda mengalami masalah saat memproses transaksi pembayaran atau *topup* saldo digital, layanan bantuan WhatsApp Center kami aktif 24/7.</p>
          </div>
        </div>
        
        {/* Tombol WhatsApp Baru dengan SVG Icon Hijau Khas */}
        <button className="px-4 py-2.5 bg-white hover:bg-emerald-50/40 border border-slate-300 hover:border-emerald-500/30 text-slate-700 hover:text-emerald-600 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer shadow-2xs flex items-center gap-2 group">
          <WhatsAppIcon className="w-4 h-4 text-emerald-500 group-hover:scale-105 transition-transform" />
          <span>WhatsApp Center</span>
        </button>
      </div>
    </div>
  );
}