import React, { useState } from 'react';
import { ArrowRight, Play, Shield, Zap, Sparkles, CheckCircle2, ChevronRight, Download, Gamepad2, Users, Layers, Trophy, HelpCircle } from 'lucide-react';
import { useStoreState } from '../services/store';
import { CATEGORIES_LIST } from '../data/mockData';
import { GameCard } from '../components/marketplace/GameCard';
import { GameItem } from '../types';

interface Props {
  navigate: (route: string, param?: string) => void;
  onOpenDemo: (game: GameItem) => void;
}

export const HomePage: React.FC<Props> = ({ navigate, onOpenDemo }) => {
  const { games, bundles, settings } = useStoreState();
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  const featuredGames = games.filter(g => g.featured);
  const latestReleases = [...games].sort((a, b) => b.version.localeCompare(a.version)).slice(0, 3);
  const popularGames = [...games].sort((a, b) => b.downloadsCount - a.downloadsCount).slice(0, 3);

  const toggleFaq = (idx: number) => {
    setFaqOpenIndex(faqOpenIndex === idx ? null : idx);
  };

  const FAQS = [
    {
      q: 'What is included with each game purchase?',
      a: 'Every game package includes 100% clean, un-obfuscated Kotlin source code, Jetpack Compose UI modules, all HD visual assets (PNGs/drawables), low-latency SoundPool audio effects (.wav), and complete PostgreSQL/Supabase database migration scripts with provably fair RPC procedures.'
    },
    {
      q: 'Can these games run inside voice-chat app bottom sheets?',
      a: 'Yes! All HSGames titles are specifically engineered for bottom-sheet or overlay integration (leaving the top 15-20% transparent). Audio room listeners can play without disconnecting from voice seats or missing ongoing conversations.'
    },
    {
      q: 'Do I need an Android emulator server to provide live demos to my users?',
      a: 'No! HSGames provides a zero-cost browser-playable simulation right inside your website using the real assets and game loop, plus downloadable standalone demo APKs. This eliminates all monthly server streaming costs.'
    },
    {
      q: 'How does payment and source code delivery work?',
      a: 'Submit your order via our transparent manual checkout (Bank Transfer, EasyPaisa, JazzCash, or USDT). Once your payment receipt is reviewed and approved, your unique commercial license key is minted immediately and private source code downloads unlock in your Customer Dashboard.'
    },
    {
      q: 'What backend technologies are supported?',
      a: 'Out of the box, our games ship with Supabase PostgreSQL migration scripts. However, all backend operations are abstracted behind clean Kotlin interfaces (e.g. GreedyGameBackendClient), allowing seamless connection to Node.js, Spring Boot, Firebase, or Ktor.'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* ── HERO SECTION ── */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        {/* Subtle background ambient glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-hsg-purple/20 via-hsg-cyan/15 to-transparent blur-3xl pointer-events-none rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-hsg-surface border border-hsg-border text-xs font-semibold text-hsg-cyan mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-hsg-cyan animate-pulse"></span>
            <span>Production-Grade Kotlin & Jetpack Compose Games</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
            Power Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-hsg-purple via-purple-400 to-hsg-cyan">Social Gaming</span> Experience.
          </h1>

          {/* Supporting Description */}
          <p className="text-base sm:text-lg text-hsg-muted max-w-2xl mx-auto leading-relaxed mb-10">
            {settings.heroSubheadline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => navigate('games')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-hsg-purple hover:bg-hsg-purpleDark text-white font-bold text-sm shadow-purple-glow transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Explore Games</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('bundles')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-hsg-card hover:bg-white/10 text-white font-bold text-sm border border-hsg-border hover:border-hsg-cyan/40 transition flex items-center justify-center gap-2"
            >
              <span>Explore Game Packs</span>
              <Sparkles className="w-4 h-4 text-hsg-cyan" />
            </button>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mt-16 pt-8 border-t border-hsg-border/40 text-center">
            <div>
              <span className="block text-2xl font-black text-white">100%</span>
              <span className="text-xs text-hsg-muted">Native Kotlin Source</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-hsg-cyan">38s</span>
              <span className="text-xs text-hsg-muted">Fast Multiplier Loops</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-hsg-purple">0 Lag</span>
              <span className="text-xs text-hsg-muted">SoundPool Native Audio</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-emerald-400">$0</span>
              <span className="text-xs text-hsg-muted">Demo Infrastructure Cost</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── FEATURED FLAGSHIP GAME: GREEDY MARKHOR ── */}
      {featuredGames.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-hsg-card via-[#16122c] to-hsg-card border border-hsg-purple/40 p-8 sm:p-12 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 bg-hsg-purple/20 border border-hsg-purple/40 text-hsg-purple text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  🔥 Flagship Social Voice Room Game
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Greedy Markhor — Live Multiplier Arcade Game
                </h2>
                <p className="text-sm text-hsg-muted leading-relaxed">
                  Engineered specifically for live streaming and social audio apps (Yalla, Poppo Live, Chamet). Features an 8-delicacy multiplier wheel, 3 quick category bets, daily midnight progressive jackpot, and 8 wager milestone chests.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-hsg-bg/80 border border-hsg-border p-3 rounded-xl">
                    <span className="text-hsg-muted block">Multipliers</span>
                    <span className="font-bold text-amber-400 text-sm">Up to 45x Win</span>
                  </div>
                  <div className="bg-hsg-bg/80 border border-hsg-border p-3 rounded-xl">
                    <span className="text-hsg-muted block">Cycle Time</span>
                    <span className="font-bold text-hsg-cyan text-sm">38s Continuous Loop</span>
                  </div>
                  <div className="bg-hsg-bg/80 border border-hsg-border p-3 rounded-xl">
                    <span className="text-hsg-muted block">Architecture</span>
                    <span className="font-bold text-white text-sm">Jetpack Compose MVI</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => onOpenDemo(featuredGames[0])}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition transform hover:-translate-y-0.5"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>Try Live Interactive Demo</span>
                  </button>

                  <button
                    onClick={() => navigate('game-details', featuredGames[0].slug)}
                    className="px-6 py-3.5 rounded-xl bg-hsg-surface hover:bg-white/10 text-white font-bold text-xs border border-hsg-border transition flex items-center gap-1.5"
                  >
                    <span>View Specifications & Code</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Graphic Preview */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-[#0c0819] border border-purple-900/50 p-6 flex flex-col items-center justify-center shadow-purple-glow">
                  <img
                    src="/games/greedy-markhor/drawable/app_logo.png"
                    alt="Greedy Markhor"
                    className="w-44 h-44 object-contain drop-shadow-2xl animate-pulse"
                  />
                  <div className="mt-2 text-center">
                    <span className="text-xs font-black text-amber-400">Single License: $299</span>
                    <span className="text-[10px] text-hsg-muted block">Instant source code archive delivery</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ── BROWSE BY CATEGORY (EXACT 8 NAMES) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-hsg-cyan mb-1">
              Engineered For Voice Apps
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Browse Game Categories
            </h3>
          </div>
          <button
            onClick={() => navigate('games')}
            className="text-xs font-bold text-hsg-purple hover:text-white flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES_LIST.map((cat) => (
            <div
              key={cat.slug}
              onClick={() => navigate('games', cat.name)}
              className="bg-hsg-card hover:bg-hsg-cardHover border border-hsg-border hover:border-hsg-purple/60 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-card-glow group flex flex-col justify-between h-36"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-hsg-surface border border-hsg-border flex items-center justify-center text-hsg-purple group-hover:text-hsg-cyan transition">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-hsg-muted group-hover:text-white transition group-hover:translate-x-0.5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-hsg-cyan transition mb-1">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-hsg-muted line-clamp-1 leading-normal">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── POPULAR & LATEST RELEASES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-hsg-purple mb-1">
            Top Performing Titles
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Marketplace Highlights
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onOpenDemo={onOpenDemo}
              onViewDetails={(slug) => navigate('game-details', slug)}
            />
          ))}
        </div>
      </section>

      {/* ── FEATURED GAME PACKS (BUNDLES) ── */}
      {bundles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                Save Up To 35%
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Featured Game Packs
              </h3>
            </div>
            <button
              onClick={() => navigate('bundles')}
              className="text-xs font-bold text-hsg-purple hover:text-white flex items-center gap-1 transition"
            >
              <span>Explore Bundles</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bundles.map((bundle) => (
              <div
                key={bundle.id}
                className="bg-hsg-card border border-hsg-border hover:border-hsg-cyan/40 rounded-3xl p-7 transition-all flex flex-col justify-between shadow-card-glow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      {bundle.badge || 'Bundle Deal'} • Save {bundle.savingsPercentage}%
                    </span>
                    <span className="text-xs text-hsg-muted line-through">
                      ${bundle.individualTotalPrice}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{bundle.title}</h4>
                  <p className="text-xs text-hsg-muted mb-4 leading-relaxed">{bundle.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {bundle.features.map((feat, i) => (
                      <li key={i} className="text-xs text-hsg-white/90 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-hsg-cyan shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-hsg-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-hsg-muted uppercase font-bold block">Bundle Price</span>
                    <span className="text-2xl font-black text-white">${bundle.bundlePrice}</span>
                  </div>
                  <button
                    onClick={() => navigate('bundles')}
                    className="px-5 py-2.5 rounded-xl bg-hsg-purple hover:bg-hsg-purpleDark text-white font-bold text-xs shadow-purple-glow transition"
                  >
                    View Bundle Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── DEVELOPER BENEFITS & WHY CHOOSE HSGAMES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-hsg-cyan mb-2">
            Built For Integration
          </h2>
          <h3 className="text-3xl font-extrabold text-white mb-4">
            Why Social Voice Apps Choose HSGames
          </h3>
          <p className="text-xs sm:text-sm text-hsg-muted">
            We don't sell generic HTML5 wrappers or webview conversions. Every single game is native Android source code designed specifically for social rooms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-hsg-card border border-hsg-border p-6 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-hsg-purple/20 border border-hsg-purple/40 flex items-center justify-center text-hsg-purple">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Native Bottom-Sheet Architecture</h4>
            <p className="text-xs text-hsg-muted leading-relaxed">
              Designed as slide-up partial overlays. Participants continue speaking on audio mics and seeing room avatars while placing bets, boosting session watch time.
            </p>
          </div>

          <div className="bg-hsg-card border border-hsg-border p-6 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-hsg-cyan/20 border border-hsg-cyan/40 flex items-center justify-center text-hsg-cyan">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Provably Fair Pattern Engine</h4>
            <p className="text-xs text-hsg-muted leading-relaxed">
              Equipped with round-seeded deterministic mathematical pattern algorithms. All clients resolve identical wheel deceleration curves even when offline or recovering from reconnects.
            </p>
          </div>

          <div className="bg-hsg-card border border-hsg-border p-6 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">100% Un-Obfuscated Kotlin</h4>
            <p className="text-xs text-hsg-muted leading-relaxed">
              Clean, modular code adhering to modern Android architecture (MVI, StateFlow, Coroutines). Ready for easy renaming and branding adjustments.
            </p>
          </div>
        </div>
      </section>

      {/* ── FREQUENTLY ASKED QUESTIONS ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-hsg-purple mb-1">
            Questions & Answers
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-hsg-card border border-hsg-border rounded-2xl overflow-hidden transition"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left px-6 py-4 flex items-center justify-between text-sm font-bold text-white hover:text-hsg-cyan transition"
              >
                <span>{faq.q}</span>
                <ChevronRight className={`w-4 h-4 transition-transform duration-200 text-hsg-muted ${faqOpenIndex === idx ? 'rotate-90' : ''}`} />
              </button>
              {faqOpenIndex === idx && (
                <div className="px-6 pb-5 text-xs text-hsg-muted leading-relaxed border-t border-hsg-border/40 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-hsg-purpleDark to-[#38117a] border border-hsg-purple rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Ready to integrate high-retention multiplayer games into your voice app?
          </h3>
          <p className="text-xs sm:text-sm text-purple-200 max-w-xl mx-auto mb-8">
            Speak directly with our Android engineers for integration consultation, custom database setups, or private bespoke game builds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('contact')}
              className="bg-white text-black font-extrabold text-xs px-8 py-3.5 rounded-xl hover:bg-gray-100 transition shadow-lg"
            >
              Contact Sales & Support
            </button>
            <button
              onClick={() => navigate('games')}
              className="bg-purple-900/40 hover:bg-purple-900/60 text-white font-bold text-xs px-8 py-3.5 rounded-xl border border-white/20 transition"
            >
              Browse All Games
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
