export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: 'user' | 'admin';
  verified: boolean;
  avatar: string;
  balance: number;
}

export interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  price: number;
  rating: number;
  category: string;
  pages: string[];
  isPopular: boolean;
  isNew: boolean;
  dateAdded: string;
  originalPrice?: number;   // Untuk diskon harga coret
  reviewsCount?: number;    // Jumlah total review
}

export interface CartItem {
  ebookId: string;
  price: number;
}

export interface Review {
  id: string;
  ebookId: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Bookmark {
  id: string;
  ebookId: string;
  pageNumber: number;
  note: string;
  date: string;
}

export interface ReadingProgress {
  ebookId: string;
  currentPage: number;
  maxPageRead: number;
  lastReadTime: string;
}

export interface Transaction {
  id: string;
  userId: string;
  ebookIds: string[];
  totalAmount: number;
  paymentMethod: string;
  status: 'pending' | 'success' | 'failed';
  date: string;
  invoiceNumber: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  date: string;
  coverUrl: string;
  readTime: string;
  author: string;
  authorAvatar?: string;
}