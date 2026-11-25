import { useState, useEffect } from 'react';
import { GameItem, GameBundle, Order, License, SupportTicket, UserProfile, OrderItem } from '../types';
import { INITIAL_GAMES, INITIAL_BUNDLES, INITIAL_ORDERS, INITIAL_LICENSES, INITIAL_TICKETS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
  contactEmail: '',
  contactWhatsapp: '',
  paymentBankTitle: '',
  paymentBankName: '',
  paymentBankIban: '',
  paymentEasypaisaNumber: '',
  paymentJazzcashNumber: '',
  paymentUsdtAddress: '',
  heroHeadline: 'Power Your Social Gaming Experience.',
  heroSubheadline: 'Original native Android multiplayer game source codes, developed in Kotlin with Jetpack Compose for social voice-chat applications and live audio platforms.'
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
    return getStoredItem<UserProfile | null>(STORAGE_KEYS.USER, null);
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

    // Persist to Supabase if credentials configured
    if (isSupabaseConfigured && supabase) {
      supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_email: orderData.customerEmail,
          customer_name: orderData.customerName,
          customer_whatsapp: orderData.customerWhatsapp,
          total_amount: orderData.totalAmount,
          payment_method: orderData.paymentMethod,
          payment_reference: orderData.paymentReference,
          payment_proof_url: orderData.paymentProofUrl,
          status: 'under_review',
          notes: orderData.notes
        })
        .select()
        .then(({ data, error }) => {
          if (error) {
            console.error('Supabase order insert notice:', error.message);
          } else if (data && data[0]) {
            const dbOrderId = data[0].id;
            const itemsToInsert = orderData.items.map(item => ({
              order_id: dbOrderId,
              product_type: 'game',
              product_id: item.id.length === 36 ? item.id : '00000000-0000-0000-0000-000000000001',
              product_title: item.title,
              license_type: item.licenseType,
              price: item.price
            }));
            supabase?.from('order_items').insert(itemsToInsert).then(({ error: itemsErr }) => {
              if (itemsErr) console.error('Supabase order_items notice:', itemsErr.message);
            });
          }
        });
    }

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
        downloadUrl: 'https://pivrxmedemxuqbwryutw.supabase.co/storage/v1/object/public/public-demos/GreedyMarkhor-v1.0-demo.apk',
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

    // Persist approval to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      supabase
        .from('orders')
        .update({ status: 'paid', reviewed_at: new Date().toISOString() })
        .eq('order_number', targetOrder.orderNumber)
        .then(({ error }) => {
          if (error) console.error('Supabase order status update notice:', error.message);
        });

      const licensesToInsert = createdLicenses.map(lic => ({
        license_key: lic.licenseKey,
        product_name: lic.productName,
        product_id: lic.productId.length === 36 ? lic.productId : '00000000-0000-0000-0000-000000000001',
        customer_email: lic.customerEmail,
        order_number: lic.orderNumber,
        license_type: lic.licenseType,
        status: 'active',
        issued_at: lic.issuedAt,
        download_url: lic.downloadUrl,
        version: lic.version
      }));

      supabase?.from('licenses').insert(licensesToInsert).then(({ error: licErr }) => {
        if (licErr) console.error('Supabase licenses insert notice:', licErr.message);
      });
    }
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
  const [dbStatus, setDbStatus] = useState<'connected' | 'fallback' | 'connecting'>(
    isSupabaseConfigured ? 'connecting' : 'fallback'
  );
  const [dbError, setDbError] = useState<string | null>(null);

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

  // Active Supabase synchronization when configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setDbStatus('fallback');
      return;
    }

    const syncRemoteData = async () => {
      const client = supabase;
      if (!client) return;

      try {
        // 1. Fetch published games directly from Supabase
        const { data: remoteGames, error: gamesErr } = await client
          .from('games')
          .select('*')
          .eq('status', 'published');

        if (gamesErr) {
          console.error('[Supabase Sync Notice] Games query returned:', gamesErr.message);
          setDbError(`Supabase games error: ${gamesErr.message}`);
          return;
        }

        if (remoteGames && remoteGames.length > 0) {
          const mappedGames: GameItem[] = remoteGames.map((g: any) => ({
            id: g.id,
            title: g.title,
            slug: g.slug,
            category: g.category_name,
            shortDescription: g.short_description,
            description: g.description,
            priceSingle: Number(g.price_single),
            priceExtended: Number(g.price_extended),
            rating: Number(g.rating),
            reviewsCount: g.reviews_count,
            downloadsCount: g.downloads_count,
            featured: g.featured,
            isNew: false,
            status: g.status,
            coverImage: g.cover_image,
            screenshots: [g.cover_image],
            videoUrl: g.video_url,
            hasPlayableDemo: g.has_playable_demo,
            demoApkUrl: g.demo_apk_url,
            tags: ['Kotlin', 'Compose', g.category_name],
            features: g.features || [],
            techSpecs: g.tech_specs || {},
            multiplayerDetails: 'Global 38-second synchronized round engine.',
            integrationGuide: g.integration_guide || [],
            version: g.version,
            updatedAt: 'Live Supabase'
          }));
          StoreService.saveGames(mappedGames);
        }

        // 2. Fetch website settings from Supabase
        const { data: remoteSettings, error: settingsErr } = await client
          .from('website_settings')
          .select('*');

        if (!settingsErr && remoteSettings && remoteSettings.length > 0) {
          const mergedSettings: any = { ...DEFAULT_SETTINGS };
          remoteSettings.forEach((row: any) => {
            mergedSettings[row.key] = row.value;
          });
          StoreService.saveSettings(mergedSettings);
        }

        // 3. Sync authentication state
        const { data: sessionData } = await client.auth.getSession();
        if (sessionData?.session?.user) {
          const authUser = sessionData.session.user;
          const { data: profile } = await client
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (profile) {
            StoreService.saveCurrentUser({
              id: profile.id,
              email: profile.email,
              fullName: profile.full_name,
              companyName: profile.company_name || '',
              role: profile.role,
              createdAt: profile.created_at
            });
          }
        }

        setDbStatus('connected');
        setDbError(null);
      } catch (err: any) {
        console.error('[Supabase Sync Exception]:', err);
        setDbError(err.message || 'Supabase sync failed');
      }
    };

    syncRemoteData();
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
    dbStatus,
    dbError,
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
