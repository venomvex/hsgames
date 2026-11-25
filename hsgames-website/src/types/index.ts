export type GameCategoryName =
  | 'All Games'
  | 'Card Battles'
  | 'Greedy Series'
  | 'Roulette & Wheels'
  | 'Crash Aviator'
  | 'Fruit Slots'
  | 'Jackpots & Classic Multiplayer'
  | 'Ludo';

export interface GameItem {
  id: string;
  title: string;
  slug: string;
  category: GameCategoryName;
  shortDescription: string;
  description: string;
  priceSingle: number;
  priceExtended: number;
  rating: number;
  reviewsCount: number;
  downloadsCount: number;
  featured: boolean;
  isNew: boolean;
  status: 'published' | 'draft' | 'archived';
  coverImage: string;
  screenshots: string[];
  videoUrl?: string;
  hasPlayableDemo: boolean;
  demoApkUrl?: string;
  tags: string[];
  features: string[];
  techSpecs: {
    language: string;
    uiFramework: string;
    architecture: string;
    minSdk: string;
    targetSdk: string;
    backendSupported: string;
    soundEngine: string;
    multiplayerMode: string;
  };
  multiplayerDetails: string;
  integrationGuide: string[];
  version: string;
  updatedAt: string;
}

export interface GameBundle {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  gameIds: string[];
  individualTotalPrice: number;
  bundlePrice: number;
  savingsPercentage: number;
  featured: boolean;
  badge?: string;
  features: string[];
}

export type OrderStatus = 'pending' | 'under_review' | 'paid' | 'rejected' | 'refunded';

export interface OrderItem {
  type: 'game' | 'bundle';
  id: string;
  title: string;
  licenseType: 'single' | 'extended';
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerWhatsapp?: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentProofUrl?: string;
  paymentReference?: string;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
  reviewedAt?: string;
  licenseIds?: string[];
}

export interface License {
  id: string;
  licenseKey: string;
  productName: string;
  productId: string;
  customerEmail: string;
  orderId: string;
  orderNumber: string;
  licenseType: 'Single Application License' | 'Extended License' | 'Custom License';
  status: 'active' | 'revoked' | 'expired';
  issuedAt: string;
  downloadUrl: string;
  version: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  customerEmail: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: 'customer' | 'admin';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  companyName?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}
