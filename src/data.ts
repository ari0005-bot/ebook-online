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
    title: 'Langkah Kecil untuk Perubahan Besar',
    author: 'Budi Santoso',
    description: 'Buku ini mengajarkan cara membuat perubahan positif dalam hidup dengan langkah-langkah kecil yang konsisten.',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    price: 0,
    rating: 4.8,
    category: 'Pengembangan Diri',
    pages: Array(20).fill('page'),
    isPopular: true,
    isNew: false,
    dateAdded: '2024-01-15',
    reviewsCount: 128
  },
  {
    id: 'eb-2',
    title: 'Menguasai React dalam 30 Hari',
    author: 'Siti Nurhaliza',
    description: 'Panduan lengkap belajar React dari nol hingga mahir dalam waktu 30 hari dengan praktik langsung.',
    coverUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    price: 0,
    rating: 4.9,
    category: 'Teknologi & Koding',
    pages: Array(25).fill('page'),
    isPopular: true,
    isNew: true,
    dateAdded: '2024-03-01',
    reviewsCount: 256
  },
  {
    id: 'eb-3',
    title: 'Cerita dari Hutan',
    author: 'Ahmad Dahlan',
    description: 'Kumpulan cerita pendek yang mengisahkan kehidupan di tengah hutan dan nilai-nilai alam.',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    price: 0,
    rating: 4.5,
    category: 'Sastra & Fiksi',
    pages: Array(15).fill('page'),
    isPopular: false,
    isNew: false,
    dateAdded: '2024-02-10',
    reviewsCount: 89
  },
  {
    id: 'eb-4',
    title: 'Investasi untuk Pemula',
    author: 'Rina Wijaya',
    description: 'Pelajari dasar-dasar investasi saham dan crypto dengan strategi yang aman untuk pemula.',
    coverUrl: 'https://images.unsplash.com/photo-1553729459-afea5e5f3d3e?w=400',
    price: 0,
    rating: 4.7,
    category: 'Bisnis & Finansial',
    pages: Array(30).fill('page'),
    isPopular: true,
    isNew: false,
    dateAdded: '2024-01-20',
    reviewsCount: 312
  },
  {
    id: 'eb-5',
    title: 'Fisika yang Menyenangkan',
    author: 'Dr. Andi Pratama',
    description: 'Pelajari konsep fisika dasar dengan pendekatan yang mudah dipahami dan contoh aplikasi nyata.',
    coverUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400',
    price: 0,
    rating: 4.6,
    category: 'Edukasi & Sains',
    pages: Array(22).fill('page'),
    isPopular: false,
    isNew: true,
    dateAdded: '2024-03-15',
    reviewsCount: 145
  },
  {
    id: 'eb-6',
    title: 'Resep Masakan Rumahan',
    author: 'Chef Maria',
    description: 'Kumpulan resep masakan rumahan yang mudah dibuat dengan bahan-bahan yang mudah ditemukan.',
    coverUrl: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400',
    price: 0,
    rating: 4.8,
    category: 'Culinary & Hobi',
    pages: Array(18).fill('page'),
    isPopular: true,
    isNew: false,
    dateAdded: '2024-02-01',
    reviewsCount: 198
  },
  {
    id: 'eb-7',
    title: 'Mindset untuk Sukses',
    author: 'John Carter',
    description: 'Bagaimana membangun mindset yang tepat untuk mencapai kesuksesan dalam bisnis dan kehidupan.',
    coverUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',
    price: 0,
    rating: 4.4,
    category: 'Pengembangan Diri',
    pages: Array(16).fill('page'),
    isPopular: false,
    isNew: true,
    dateAdded: '2024-03-10',
    reviewsCount: 76
  },
  {
    id: 'eb-8',
    title: 'Python untuk Data Science',
    author: 'Lisa Chen',
    description: 'Panduan praktis menggunakan Python untuk analisis data dan machine learning.',
    coverUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
    price: 0,
    rating: 4.9,
    category: 'Teknologi & Koding',
    pages: Array(35).fill('page'),
    isPopular: true,
    isNew: true,
    dateAdded: '2024-03-20',
    reviewsCount: 421
  }
];

export const INITIAL_ARTICLES: Article[] = [];

export const INITIAL_REVIEWS: Review[] = [];