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
    demoApkUrl: 'https://pivrxmedemxuqbwryutw.supabase.co/storage/v1/object/public/public-demos/GreedyMarkhor-v1.0-demo.apk',
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
  }
];

export const INITIAL_BUNDLES: GameBundle[] = [];

export const INITIAL_LICENSES: License[] = [];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_TICKETS: SupportTicket[] = [];
