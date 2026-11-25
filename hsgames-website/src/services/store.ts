import { useState, useEffect } from 'react';
import { GameItem, GameBundle, Order, License, SupportTicket, UserProfile, OrderItem } from '../types';
import { INITIAL_GAMES, INITIAL_BUNDLES, INITIAL_ORDERS, INITIAL_LICENSES, INITIAL_TICKETS } from '../data/mockData';

export interface WebsiteSettings {
  brandName: string;
  tagline: string;
  contactEmail: string;
  contactWhatsapp: string;
  paymentBankTitle: string;
  paymentBankName: string;
  paymentBankIban: string;
  paymentEasypaisaNumber: string;
  paymentJazzcashNumber: string;
  paymentUsdtAddress: string;
  heroHeadline: string;
  heroSubheadline: string;
}

export const DEFAULT_SETTINGS: WebsiteSettings = {
  brandName: 'HSGames',
  tagline: 'Social Gaming Solutions',
  contactEmail: 'contact@hsgames.tech',
  contactWhatsapp: '+92 300 0000000',
  paymentBankTitle: 'HSGames Solutions',
  paymentBankName: 'Meezan Bank Ltd / HBL',
  paymentBankIban: 'PK82MEZN0001020304050607',
  paymentEasypaisaNumber: '0300-1234567',
  paymentJazzcashNumber: '0300-7654321',
  paymentUsdtAddress: 'TX78Fk9L4mQP9wK12vYz98R0aBcDeFgHiJ (TRC-20)',
  heroHeadline: 'Power Your Social Gaming Experience.',
  heroSubheadline: 'Premium native Android multiplayer games built for social voice-chat applications. Discover, test, and integrate powerful gaming experiences into your platform.'
};

// Local storage keys
const STORAGE_KEYS = {
  GAMES: 'hsg_games_v1',
  BUNDLES: 'hsg_bundles_v1',
  ORDERS: 'hsg_orders_v1',
  LICENSES: 'hsg_licenses_v1',
  TICKETS: 'hsg_tickets_v1',
  CART: 'hsg_cart_v1',
  USER: 'hsg_user_v1',
  SETTINGS: 'hsg_settings_v1',
};

function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setStoredItem<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new Event('hsg_storage_update'));
  } catch (e) {
    console.error(e);
  }
}

export const StoreService = {
  getGames: (): GameItem[] => getStoredItem(STORAGE_KEYS.GAMES, INITIAL_GAMES),
  saveGames: (games: GameItem[]) => setStoredItem(STORAGE_KEYS.GAMES, games),

  getBundles: (): GameBundle[] => getStoredItem(STORAGE_KEYS.BUNDLES, INITIAL_BUNDLES),
  saveBundles: (bundles: GameBundle[]) => setStoredItem(STORAGE_KEYS.BUNDLES, bundles),

  getOrders: (): Order[] => getStoredItem(STORAGE_KEYS.ORDERS, INITIAL_ORDERS),
  saveOrders: (orders: Order[]) => setStoredItem(STORAGE_KEYS.ORDERS, orders),

  getLicenses: (): License[] => getStoredItem(STORAGE_KEYS.LICENSES, INITIAL_LICENSES),
  saveLicenses: (licenses: License[]) => setStoredItem(STORAGE_KEYS.LICENSES, licenses),

  getTickets: (): SupportTicket[] => getStoredItem(STORAGE_KEYS.TICKETS, INITIAL_TICKETS),
  saveTickets: (tickets: SupportTicket[]) => setStoredItem(STORAGE_KEYS.TICKETS, tickets),

  getCart: (): OrderItem[] => getStoredItem(STORAGE_KEYS.CART, []),
  saveCart: (cart: OrderItem[]) => setStoredItem(STORAGE_KEYS.CART, cart),

  getCurrentUser: (): UserProfile | null => {
    return getStoredItem(STORAGE_KEYS.USER, {
      id: 'usr-admin-default',
      email: 'admin@hsgames.tech',
      fullName: 'HSGames Administrator',
      companyName: 'HSGames Media Ltd',
      role: 'admin',
      createdAt: '2026-11-20'
    });
  },
  saveCurrentUser: (user: UserProfile | null) => setStoredItem(STORAGE_KEYS.USER, user),

  getSettings: (): WebsiteSettings => getStoredItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),
  saveSettings: (settings: WebsiteSettings) => setStoredItem(STORAGE_KEYS.SETTINGS, settings),

  // Action: Add to cart
  addToCart: (item: OrderItem) => {
    const cart = StoreService.getCart();
    const exists = cart.find(c => c.id === item.id && c.licenseType === item.licenseType);
    if (!exists) {
      StoreService.saveCart([...cart, item]);
    }
  },

  removeFromCart: (id: string, licenseType: string) => {
    const cart = StoreService.getCart();
    StoreService.saveCart(cart.filter(c => !(c.id === id && c.licenseType === licenseType)));
  },

  clearCart: () => StoreService.saveCart([]),

  // Action: Create Order
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'status' | 'createdAt'>): Order => {
    const orders = StoreService.getOrders();
    const orderNumber = `HSG-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      status: 'under_review',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    StoreService.saveOrders([newOrder, ...orders]);
    StoreService.clearCart();
    return newOrder;
  },

  // Action: Admin approves order -> Auto generates License & enables source download!
  approveOrder: (orderId: string) => {
    const orders = StoreService.getOrders();
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const licenses = StoreService.getLicenses();
    const newLicenseIds: string[] = [];
    const createdLicenses: License[] = [];

    targetOrder.items.forEach((item, idx) => {
      const licKey = `HSG-${item.title.substring(0, 2).toUpperCase()}-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const licId = `lic-${Date.now()}-${idx}`;
      newLicenseIds.push(licId);
      createdLicenses.push({
        id: licId,
        licenseKey: licKey,
        productName: item.title,
        productId: item.id,
        customerEmail: targetOrder.customerEmail,
        orderId: targetOrder.id,
        orderNumber: targetOrder.orderNumber,
        licenseType: item.licenseType === 'extended' ? 'Extended License' : 'Single Application License',
        status: 'active',
        issuedAt: new Date().toISOString().substring(0, 10),
        downloadUrl: '/downloads/GreedyMarkhor-v1.0-demo.apk',
        version: '1.2.0'
      });
    });

    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'paid' as const,
          reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          licenseIds: newLicenseIds
        };
      }
      return o;
    });

    StoreService.saveOrders(updatedOrders);
    StoreService.saveLicenses([...createdLicenses, ...licenses]);
  },

  rejectOrder: (orderId: string, reason?: string) => {
    const orders = StoreService.getOrders();
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'rejected' as const, notes: reason || o.notes };
      }
      return o;
    });
    StoreService.saveOrders(updated);
  }
};

export function useStoreState() {
  const [games, setGames] = useState(StoreService.getGames());
  const [bundles, setBundles] = useState(StoreService.getBundles());
  const [orders, setOrders] = useState(StoreService.getOrders());
  const [licenses, setLicenses] = useState(StoreService.getLicenses());
  const [tickets, setTickets] = useState(StoreService.getTickets());
  const [cart, setCart] = useState(StoreService.getCart());
  const [user, setUser] = useState(StoreService.getCurrentUser());
  const [settings, setSettings] = useState(StoreService.getSettings());

  useEffect(() => {
    const handleUpdate = () => {
      setGames(StoreService.getGames());
      setBundles(StoreService.getBundles());
      setOrders(StoreService.getOrders());
      setLicenses(StoreService.getLicenses());
      setTickets(StoreService.getTickets());
      setCart(StoreService.getCart());
      setUser(StoreService.getCurrentUser());
      setSettings(StoreService.getSettings());
    };

    window.addEventListener('hsg_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('hsg_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    games,
    bundles,
    orders,
    licenses,
    tickets,
    cart,
    user,
    settings,
    setGames: StoreService.saveGames,
    setBundles: StoreService.saveBundles,
    setOrders: StoreService.saveOrders,
    setLicenses: StoreService.saveLicenses,
    setTickets: StoreService.saveTickets,
    setCart: StoreService.saveCart,
    setUser: StoreService.saveCurrentUser,
    setSettings: StoreService.saveSettings,
    addToCart: StoreService.addToCart,
    removeFromCart: StoreService.removeFromCart,
    clearCart: StoreService.clearCart,
    createOrder: StoreService.createOrder,
    approveOrder: StoreService.approveOrder,
    rejectOrder: StoreService.rejectOrder
  };
}
