import { Ebook, Article, Review } from './types';

export const EBOOK_CATEGORIES = [
  'Semua Kategori',
  'Pengembangan Diri',
  'Teknologi & Koding',
  'Sastra & Fiksi',
  'Bisnis & Finansial',
  'Edukasi & Sains',
  'Culinary & Hobi'
];

export const INITIAL_EBOOKS: Ebook[] = [
  {
    id: 'eb-1',
    title: 'Filosofi Teras',
    author: 'Henry Manampiring',
    category: 'Pengembangan Diri',
    price: 85000,
    originalPrice: 100000,
    rating: 4.8,
    reviewsCount: 124,
    isPopular: true,
    isNew: false,
    dateAdded: '2026-01-10',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80',
    description: 'Buku panduan praktis filsafat Yunani-Romawi Kuno (Stoikisme) untuk membantu kita mengatasi kekhawatiran dan mengendalikan emosi negatif dalam kehidupan sehari-hari.',
    pages: [
      "BAB 1: KECEMASAN MODERN DAN SOLUSI KUNO\n\nSelamat datang di lembaran Filosofi Teras...",
      "BAB 2: DIKOTOMI KENDALI (TRIK SUPER STOIK)\n\nInilah pilar utama dari Filosofi Teras..."
    ]
  },
  {
    id: 'eb-2',
    title: 'Belajar React & Next.js Modern',
    author: 'Rian Wijaya, M.Kom',
    category: 'Teknologi & Koding',
    price: 125000,
    originalPrice: 150000,
    rating: 4.9,
    reviewsCount: 86,
    isPopular: true,
    isNew: true,
    dateAdded: '2026-05-20',
    coverUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=400&q=80',
    description: 'Panduan terlengkap membangun aplikasi web modern berskala besar menggunakan React 19, Vite, Tailwind CSS, dan Next.js App Router.',
    pages: [
      "BAB 1: PENGANTAR REACT MODERN\n\nSelamat datang di era React Modern!",
      "BAB 2: MEMAHAMI STATE DAN COMPONENT LIFE\n\nState adalah memori dari sebuah component."
    ]
  },
  {
    id: 'eb-3',
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    category: 'Sastra & Fiksi',
    price: 79000,
    rating: 4.7,
    reviewsCount: 340,
    isPopular: false,
    isNew: false,
    dateAdded: '2025-11-05',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
    description: 'Kisah legendaris sepuluh anak Belitong yang berjuang mengejar mimpi dan pendidikan di sebuah sekolah reot SD Muhammadiyah Belitong.',
    pages: [
      "BAGIAN 1: SEKOLAH YANG HAMPIR ROBOH\n\nPagi itu, matahari bersinar agak pucat...",
      "BAGIAN 2: SEPOELOEH LASKAR PELANGI\n\nSejak hari bersejarah itu, Bu Mus menamai kami..."
    ]
  },
  {
    id: 'eb-4',
    title: 'Manajemen Bisnis Digital 101',
    author: 'Prof. Dr. Ir. Diana Lestari',
    category: 'Bisnis & Finansial',
    price: 110000,
    originalPrice: 135000,
    rating: 4.6,
    reviewsCount: 42,
    isPopular: false,
    isNew: true,
    dateAdded: '2026-03-15',
    coverUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=400&q=80',
    description: 'Buku komprehensif bagi wirausahawan, manajer, dan mahasiswa bisnis untuk memahami peta ekosistem e-commerce dan transformasi digital.',
    pages: [
      "BAB 1: ERA DISRUPSI DIGITAL\n\nSelamat datang di panduan Bisnis Digital 101...",
      "BAB 2: METODE LEAN STARTUP\n\nMetode Lean Startup yang dipopulerkan oleh Eric Ries..."
    ]
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: '5 Cara Membangun Konsistensi Membaca Buku Setiap Hari',
    summary: 'Menemukan waktu di tengah kesibukan harian memang menantang, namun dengan teknik mikro-kebiasaan, membaca 15 halaman sehari bisa menjadi hal mudah.',
    content: 'Isi lengkap artikel tentang konsistensi membaca...',
    category: 'Tips & Trik',
    date: '12 Juni 2026',
    coverUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=400&q=80',
    readTime: '5 min read',
    author: 'Admin e.mind',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
  }
];

// Ditambahkan untuk memenuhi kebutuhan import di App.tsx
export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    ebookId: 'eb-1',
    userId: 'u-2',
    username: 'Budi Santoso',
    rating: 5,
    comment: 'Buku yang sangat bagus dan membuka wawasan baru!',
    date: '2026-06-15'
  }
];