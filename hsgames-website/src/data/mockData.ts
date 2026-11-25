import { GameCategoryName, GameItem, GameBundle, License, Order, SupportTicket } from '../types';

export const CATEGORIES_LIST: { name: GameCategoryName; slug: string; description: string; icon: string }[] = [
  { name: 'All Games', slug: 'all-games', description: 'Explore our complete catalog of native Android social games.', icon: 'Gamepad2' },
  { name: 'Card Battles', slug: 'card-battles', description: 'Teen Patti, Poker, and live multiplayer table card battles.', icon: 'Club' },
  { name: 'Greedy Series', slug: 'greedy-series', description: 'Fast-paced multiplier roulette and feeding wheel betting games.', icon: 'Flame' },
  { name: 'Roulette & Wheels', slug: 'roulette-wheels', description: 'European & American style high-stakes voice room wheels.', icon: 'CircleDot' },
  { name: 'Crash Aviator', slug: 'crash-aviator', description: 'Real-time curve multiplier and high-tension cashout games.', icon: 'Plane' },
  { name: 'Fruit Slots', slug: 'fruit-slots', description: 'Classic 3-reel and 5-reel high-conversion fruit slot machines.', icon: 'Apple' },
  { name: 'Jackpots & Classic Multiplayer', slug: 'jackpots-classic-multiplayer', description: 'Progressive jackpot rooms, Dice, and high-frequency live mini-games.', icon: 'Trophy' },
  { name: 'Ludo', slug: 'ludo', description: '4-Player classic & quick Ludo voice-synced board games.', icon: 'Dice5' },
];

export const INITIAL_GAMES: GameItem[] = [
  {
    id: 'game-greedy-markhor',
    title: 'Greedy Markhor — Live Multiplier Arcade Game',
    slug: 'greedy-markhor',
    category: 'Greedy Series',
    shortDescription: 'Original native Android 38s live multiplier food-betting wheel game built in Kotlin with Jetpack Compose. Pre-configured for voice-chat app bottom sheets.',
    description: `Greedy Markhor is a high-retention, high-frequency multiplayer arcade multiplier game specifically engineered for social voice-chat applications and live audio streaming rooms (such as Yalla, Poppo Live, Chamet, and StarMaker).

Players select chips ranging from 100 to 500k coins and place bets on 8 distinctive food delicacies or 3 category clusters (Fruit 5x, Feast 10x, Mix 25x). Every 38 seconds, the carousel smoothly decelerates onto the winning food item with celebratory particle effects and sound design.

Designed from the ground up for seamless bottom-sheet embedding: the top 15% of the screen remains transparent so participants can still see active mic seats and speaking indicators while betting without ever leaving the audio room.`,
    priceSingle: 299,
    priceExtended: 699,
    rating: 4.95,
    reviewsCount: 38,
    downloadsCount: 142,
    featured: true,
    isNew: true,
    status: 'published',
    coverImage: '/games/greedy-markhor/drawable/app_logo.png',
    screenshots: [
      '/games/greedy-markhor/drawable/app_logo.png',
      '/games/greedy-markhor/drawable/food_full_pizza.png',
      '/games/greedy-markhor/drawable/trophy_top_1.png',
      '/games/greedy-markhor/drawable/chest_5b.png',
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-arcade-video-game-machine-loop-42861-large.mp4',
    hasPlayableDemo: true,
    demoApkUrl: '/downloads/GreedyMarkhor-v1.0-demo.apk',
    tags: ['Kotlin', 'Jetpack Compose', 'Voice-Chat Game', 'Supabase', 'Multiplier Wheel', 'Provably Fair'],
    features: [
      '38-Second Continuous Loop: 30s betting phase, 4s smooth deceleration spin, 4s celebratory winner payout.',
      '8 Dynamic Food Multipliers: Burger 15x, Pizza 25x, Chicken 45x, Fish 10x, Lemon 5x, Apple 5x, Mango 5x, Strawberry 5x.',
      '3 Quick Category Bets: Mix (25x), Feast (10x), and Fruit (5x) for high-stakes instant bets.',
      'Daily Midnight Jackpot: Progressive pool awarded to Top 15 players daily at 12:00 AM (Asia/Karachi timezone).',
      '8 Tiered Wager Milestone Chests: Unlock bonus coin rewards at 5M, 10M, 50M, 100M, 500M, 1B, 2.5B, and 5B total wager milestones.',
      'Provably Fair Pattern Engine: Deterministic seed based on roundNumber guarantees all clients draw identical targets even in offline demo mode.',
      'Native Android Audio: Low-latency SoundPool implementation for crisp chip placement sounds.',
      'Pre-configured Backend Migration: Ready-to-run PostgreSQL / Supabase migration script with 6 secure RPC procedures.'
    ],
    techSpecs: {
      language: 'Kotlin 2.2+',
      uiFramework: 'Jetpack Compose (Material 3)',
      architecture: 'Clean Architecture (MVI / ViewModel / StateFlow)',
      minSdk: 'Android 8.0 (API 26)',
      targetSdk: 'Android 14 / 15 (API 34-36)',
      backendSupported: 'Supabase / PostgreSQL / REST / WebSockets',
      soundEngine: 'Android SoundPool (zero lag)',
      multiplayerMode: 'Continuous Global Synchronized Clock'
    },
    multiplayerDetails: 'All active voice-room clients synchronize on a global 38-second round cycle. Round results and jackpot balances sync via Supabase RPCs with automatic local fallback when offline.',
    integrationGuide: [
      'Step 1: Copy res/drawable assets and res/raw sound effects into your Android project.',
      'Step 2: Copy the kotlin/com/pakii/voicechat/games/greedymarkhor package into your source tree.',
      'Step 3: Run database/05_greedy_markhor_game.sql in your Supabase SQL editor or Postgres DB.',
      'Step 4: Connect your user wallet repository with attachWalletAndProfile().',
      'Step 5: Call GreedyMarkhorScreen() inside your voice room bottom sheet or modal dialog.'
    ],
    version: '1.2.0',
    updatedAt: 'November 2026'
  },
  {
    id: 'game-teen-patti-live',
    title: 'Teen Patti Royale — Live Voice Room Card Battle',
    slug: 'teen-patti-royale',
    category: 'Card Battles',
    shortDescription: 'Real-time 6-player live Teen Patti with side-bets, dealer animation, and synchronized audio room tip system.',
    description: 'High-octane traditional 3-card poker game built specifically for live streaming and voice audio platforms. Supports blind, seen, chaal, show, and side-pot management with custom dealer avatars.',
    priceSingle: 349,
    priceExtended: 799,
    rating: 4.90,
    reviewsCount: 24,
    downloadsCount: 89,
    featured: true,
    isNew: false,
    status: 'published',
    coverImage: '/games/greedy-markhor/drawable/trophy_top_2.png',
    screenshots: ['/games/greedy-markhor/drawable/trophy_top_2.png'],
    hasPlayableDemo: false,
    tags: ['Kotlin', 'Cards', 'Teen Patti', 'Live Multiplayer'],
    features: [
      '6-Seat Interactive Table with real-time turn countdown timer.',
      'Pot limit & no-limit side pot calculation engine.',
      'Dealer tip animations and interactive emoji throwing.',
      'Complete Supabase / Redis live table state synchronization.'
    ],
    techSpecs: {
      language: 'Kotlin 2.2+',
      uiFramework: 'Jetpack Compose',
      architecture: 'MVVM + WebSockets',
      minSdk: 'API 26',
      targetSdk: 'API 36',
      backendSupported: 'Node.js / Supabase',
      soundEngine: 'SoundPool',
      multiplayerMode: 'Turn-based WebSocket Room'
    },
    multiplayerDetails: 'WebSocket state machine with automatic reconnect handling and timeout folding.',
    integrationGuide: ['Embed as a modal dialog or horizontal game drawer inside any Android audio room.'],
    version: '1.0.4',
    updatedAt: 'October 2026'
  },
  {
    id: 'game-crash-aviator',
    title: 'SkyRocket Aviator — Social Curve Multiplier',
    slug: 'skyrocket-aviator',
    category: 'Crash Aviator',
    shortDescription: 'High-tension curve crash multiplier where players cash out before the rocket flies away. Displays real-time bets from all room participants.',
    description: 'The viral crash multiplier game adapted for social voice-chat communities. Live crowd betting board displays friends and room members cashing out with animated emojis.',
    priceSingle: 399,
    priceExtended: 899,
    rating: 4.98,
    reviewsCount: 51,
    downloadsCount: 210,
    featured: true,
    isNew: true,
    status: 'published',
    coverImage: '/games/greedy-markhor/drawable/trophy_icon.png',
    screenshots: ['/games/greedy-markhor/drawable/trophy_icon.png'],
    hasPlayableDemo: false,
    tags: ['Kotlin', 'Crash', 'Aviator', 'High Multiplier'],
    features: [
      'Smooth 60/120 FPS Bezier curve rendering in Jetpack Compose Canvas.',
      'Dual bet placement: cash out one bet early and ride the second high.',
      'Room leaderboard showing top cashouts of the hour.',
      'Provably fair SHA-256 hash seed verification.'
    ],
    techSpecs: {
      language: 'Kotlin 2.2+',
      uiFramework: 'Jetpack Compose Canvas',
      architecture: 'Clean Architecture MVI',
      minSdk: 'API 26',
      targetSdk: 'API 36',
      backendSupported: 'PostgreSQL / Supabase Realtime',
      soundEngine: 'SoundPool',
      multiplayerMode: 'Broadcast Curve Stream'
    },
    multiplayerDetails: 'Server broadcasts curve progression tick at 20Hz; client interpolates smoothly.',
    integrationGuide: ['Includes 1-click bottom sheet launcher and coin wallet adapter.'],
    version: '2.1.0',
    updatedAt: 'November 2026'
  },
  {
    id: 'game-royal-roulette',
    title: 'Royal European Roulette — Voice Club Edition',
    slug: 'royal-roulette',
    category: 'Roulette & Wheels',
    shortDescription: 'Single-zero European wheel with complete inside and outside betting grid, statistics board, and audio announcements.',
    description: 'Bespoke 3D-styled physical roulette wheel physics ported to Compose Canvas. Features hot/cold numbers, tier bet shortcuts, and voice audio dealer callouts.',
    priceSingle: 279,
    priceExtended: 649,
    rating: 4.85,
    reviewsCount: 19,
    downloadsCount: 73,
    featured: false,
    isNew: false,
    status: 'published',
    coverImage: '/games/greedy-markhor/drawable/trophy_top_3.png',
    screenshots: ['/games/greedy-markhor/drawable/trophy_top_3.png'],
    hasPlayableDemo: false,
    tags: ['Kotlin', 'Roulette', 'Casino Wheel'],
    features: [
      '37-pocket European layout with physics simulation.',
      'History track board showing last 50 numbers & red/black ratio.',
      'Preset macro bets: Voisins du Zero, Tiers du Cylindre, Orphelins.'
    ],
    techSpecs: {
      language: 'Kotlin 2.1+',
      uiFramework: 'Jetpack Compose',
      architecture: 'MVVM',
      minSdk: 'API 26',
      targetSdk: 'API 36',
      backendSupported: 'Supabase / REST',
      soundEngine: 'SoundPool',
      multiplayerMode: 'Synchronized Round Clock'
    },
    multiplayerDetails: '40-second rounds with synchronized ball drop.',
    integrationGuide: ['Includes ready-made Compose dialog component.'],
    version: '1.1.2',
    updatedAt: 'September 2026'
  },
  {
    id: 'game-fruit-frenzy-slots',
    title: 'Fruit Frenzy 777 — 5-Reel Social Video Slot',
    slug: 'fruit-frenzy-slots',
    category: 'Fruit Slots',
    shortDescription: 'Vibrant 5x3 video slot with Wild Markhor substitution, Free Spins scatter, and progressive mini-jackpot trigger.',
    description: 'High engagement retro fruit slot machine with modern particle sparks. Delivers immediate dopamine with cascading win lines, free spin bonuses, and voice room win announcements.',
    priceSingle: 249,
    priceExtended: 599,
    rating: 4.88,
    reviewsCount: 15,
    downloadsCount: 65,
    featured: false,
    isNew: false,
    status: 'published',
    coverImage: '/games/greedy-markhor/drawable/food_mix_fruit.png',
    screenshots: ['/games/greedy-markhor/drawable/food_mix_fruit.png'],
    hasPlayableDemo: false,
    tags: ['Kotlin', 'Slots', 'Fruit Machine', 'Jackpot'],
    features: [
      '25 active paylines with glowing win trace lines.',
      'Scatter symbol triggers 10, 15, or 25 Free Spins with 3x multiplier.',
      'Fast spin mode & auto-spin controls.'
    ],
    techSpecs: {
      language: 'Kotlin 2.2+',
      uiFramework: 'Jetpack Compose',
      architecture: 'MVI',
      minSdk: 'API 26',
      targetSdk: 'API 36',
      backendSupported: 'Supabase / PostgreSQL',
      soundEngine: 'SoundPool',
      multiplayerMode: 'Client-driven with secure server validation'
    },
    multiplayerDetails: 'RNG seed verified on server; winnings credit user wallet in real time.',
    integrationGuide: ['Copy assets and launch FruitSlotSheet(walletRepo).'],
    version: '1.0.1',
    updatedAt: 'August 2026'
  },
  {
    id: 'game-ludo-master-voice',
    title: 'Ludo Voice Master — 4-Player Synchronized Board',
    slug: 'ludo-voice-master',
    category: 'Ludo',
    shortDescription: 'Classic 2-4 player Ludo with synchronized 3D dice rolls, voice room mic integrations, and fast 5-minute rush mode.',
    description: 'The indispensable staple of every Middle Eastern and South Asian social audio app. Fully integrated with room microphone states so players can banter live during turns.',
    priceSingle: 399,
    priceExtended: 899,
    rating: 4.97,
    reviewsCount: 64,
    downloadsCount: 320,
    featured: true,
    isNew: false,
    status: 'published',
    coverImage: '/games/greedy-markhor/drawable/chest_1b.png',
    screenshots: ['/games/greedy-markhor/drawable/chest_1b.png'],
    hasPlayableDemo: false,
    tags: ['Kotlin', 'Ludo', 'Board Game', 'Multiplayer'],
    features: [
      'Classic 4-Player & Quick 2-Pawn Rush game modes.',
      '15-Second turn timer with automatic bot takeover if player disconnects.',
      'In-game voice-line reaction soundboard.',
      'Spectator mode: other audio room listeners can watch the match.'
    ],
    techSpecs: {
      language: 'Kotlin 2.2+',
      uiFramework: 'Jetpack Compose',
      architecture: 'Clean Architecture + WebSocket State',
      minSdk: 'API 26',
      targetSdk: 'API 36',
      backendSupported: 'LiveKit / Supabase / WebSocket',
      soundEngine: 'SoundPool',
      multiplayerMode: 'Full 4-player real-time sync'
    },
    multiplayerDetails: 'WebSocket board synchronization with sub-100ms latency and turn clock arbitration.',
    integrationGuide: ['Includes complete VoiceRoom Ludo bottom sheet container and spectator broadcaster.'],
    version: '2.4.0',
    updatedAt: 'November 2026'
  }
];

export const INITIAL_BUNDLES: GameBundle[] = [
  {
    id: 'bundle-voice-starter',
    title: 'Social Voice Chat Starter Pack',
    slug: 'voice-starter-pack',
    description: 'The essential gaming bundle to kickstart user monetization in any new social audio or streaming app. Includes Greedy Markhor + Fruit Frenzy Slots.',
    coverImage: '/games/greedy-markhor/drawable/trophy_top_1.png',
    gameIds: ['game-greedy-markhor', 'game-fruit-frenzy-slots'],
    individualTotalPrice: 548,
    bundlePrice: 429,
    savingsPercentage: 22,
    featured: true,
    badge: 'Best Value',
    features: [
      '2 Production-ready native Android games.',
      'Unified Supabase database migration scripts.',
      'Single wallet balance shared across both games.',
      'Full source code + 6 months priority technical support.'
    ]
  },
  {
    id: 'bundle-ultimate-casino',
    title: 'All-In-One Social Casino Mega Suite',
    slug: 'ultimate-casino-mega-suite',
    description: 'Complete high-stakes entertainment bundle containing all 4 top revenue-generating games: Greedy Markhor, SkyRocket Aviator, Teen Patti Royale, and Ludo Voice Master.',
    coverImage: '/games/greedy-markhor/drawable/chest_5b.png',
    gameIds: ['game-greedy-markhor', 'game-crash-aviator', 'game-teen-patti-live', 'game-ludo-master-voice'],
    individualTotalPrice: 1446,
    bundlePrice: 999,
    savingsPercentage: 31,
    featured: true,
    badge: 'Popular',
    features: [
      '4 Flagship Android multiplayer titles.',
      'Save $447 compared to individual licenses.',
      'Extended commercial license included for all titles.',
      'Full integration architecture walkthrough and video guides.'
    ]
  }
];

export const INITIAL_LICENSES: License[] = [
  {
    id: 'lic-101',
    licenseKey: 'HSG-GM-2026-X892-4910',
    productName: 'Greedy Markhor — Live Multiplier Arcade Game',
    productId: 'game-greedy-markhor',
    customerEmail: 'developer@voicechat.app',
    orderId: 'ord-8491',
    orderNumber: 'HSG-8491',
    licenseType: 'Single Application License',
    status: 'active',
    issuedAt: '2026-11-20',
    downloadUrl: '/downloads/GreedyMarkhor-v1.0-demo.apk',
    version: '1.2.0'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-8491',
    orderNumber: 'HSG-8491',
    customerEmail: 'developer@voicechat.app',
    customerName: 'Muhammad Rashid',
    customerWhatsapp: '+92 300 1234567',
    items: [
      {
        type: 'game',
        id: 'game-greedy-markhor',
        title: 'Greedy Markhor — Live Multiplier Arcade Game',
        licenseType: 'single',
        price: 299
      }
    ],
    totalAmount: 299,
    paymentMethod: 'Bank Transfer (Meezan / HBL)',
    paymentProofUrl: '/brand/hsgamelogo.png',
    paymentReference: 'TRX-99482109',
    notes: 'Urgent setup for voice room beta release',
    status: 'paid',
    createdAt: '2026-11-20 14:32',
    reviewedAt: '2026-11-20 15:10',
    licenseIds: ['lic-101']
  },
  {
    id: 'ord-8492',
    orderNumber: 'HSG-8492',
    customerEmail: 'alex.tan@livestream.sg',
    customerName: 'Alex Tan',
    customerWhatsapp: '+65 9123 4567',
    items: [
      {
        type: 'bundle',
        id: 'bundle-voice-starter',
        title: 'Social Voice Chat Starter Pack',
        licenseType: 'single',
        price: 429
      }
    ],
    totalAmount: 429,
    paymentMethod: 'USDT (TRC-20)',
    paymentReference: '0x8fbc923a41c10928e',
    status: 'under_review',
    createdAt: '2026-11-25 18:20'
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-1',
    ticketNumber: 'TKT-2026-001',
    subject: 'Question on Supabase RPC integration for custom coin rate',
    customerEmail: 'developer@voicechat.app',
    category: 'Technical Integration',
    priority: 'medium',
    status: 'open',
    createdAt: '2026-11-22 10:15',
    updatedAt: '2026-11-22 11:30',
    messages: [
      {
        id: 'msg-1',
        sender: 'customer',
        senderName: 'Muhammad Rashid',
        text: 'Hi HSGames team, we want to adjust the minimum chip from 100 to 1,000 in GreedyMarkhor. Where in the SQL file should we modify the wager constraints?',
        timestamp: '2026-11-22 10:15'
      },
      {
        id: 'msg-2',
        sender: 'admin',
        senderName: 'HSGames Support',
        text: 'Hello Rashid! In 05_greedy_markhor_game.sql, look for function place_greedy_bets. You can customize the minimum bet check on line 142. We also have a constant in DefaultBetChips Kotlin model.',
        timestamp: '2026-11-22 11:30'
      }
    ]
  }
];
