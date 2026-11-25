import React, { useState } from 'react';
import { ArrowLeft, Play, Download, Star, Shield, CheckCircle2, ShoppingCart, Film, Smartphone, Terminal, HelpCircle, Code, Layers } from 'lucide-react';
import { useStoreState } from '../services/store';
import { GameItem } from '../types';

interface Props {
  slug: string;
  navigate: (route: string, param?: string) => void;
  onOpenDemo: (game: GameItem) => void;
}

export const GameDetailPage: React.FC<Props> = ({ slug, navigate, onOpenDemo }) => {
  const { games, addToCart } = useStoreState();

  const game = games.find((g) => g.slug === slug) || games[0];
  const [selectedLicense, setSelectedLicense] = useState<'single' | 'extended'>('single');
  const [activeMediaTab, setActiveMediaTab] = useState<'screenshots' | 'video'>('screenshots');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string>(game.screenshots[0] || game.coverImage);
  const [showAddedToast, setShowAddedToast] = useState(false);

  const price = selectedLicense === 'single' ? game.priceSingle : game.priceExtended;

  const handleAddToCart = () => {
    addToCart({
      type: 'game',
      id: game.id,
      title: game.title,
      licenseType: selectedLicense,
      price: price
    });
    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Toast Notification */}
      {showAddedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-black font-extrabold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5" />
          <span>Added to Cart! Redirecting...</span>
        </div>
      )}

      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs text-hsg-muted">
        <button onClick={() => navigate('games')} className="hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </button>
        <span>/</span>
        <button onClick={() => navigate('games', game.category)} className="hover:text-white">
          {game.category}
        </button>
        <span>/</span>
        <span className="text-hsg-cyan font-semibold truncate max-w-xs">{game.title}</span>
      </div>

      {/* ── Top Header & Hero Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Media Gallery (Screenshots / Video Preview) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Display Box */}
          <div className="relative aspect-[16/10] bg-[#0c0e1a] border border-hsg-border rounded-3xl overflow-hidden flex items-center justify-center p-6 shadow-2xl">
            {activeMediaTab === 'video' && game.videoUrl ? (
              <video
                src={game.videoUrl}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <img
                src={selectedScreenshot}
                alt={game.title}
                className="w-48 h-48 sm:w-60 sm:h-60 object-contain drop-shadow-2xl transition-all duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/brand/hsgamelogo.png';
                }}
              />
            )}

            {/* Category Tag */}
            <span className="absolute top-4 left-4 bg-hsg-surface/90 backdrop-blur-md border border-hsg-border text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              {game.category}
            </span>

            {/* Version Badge */}
            <span className="absolute top-4 right-4 bg-black/60 border border-white/10 text-hsg-muted text-[10px] font-mono px-2.5 py-1 rounded-full">
              v{game.version}
            </span>
          </div>

          {/* Media Switcher Tabs & Thumbnails */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveMediaTab('screenshots')}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                  activeMediaTab === 'screenshots'
                    ? 'bg-hsg-purple text-white border-hsg-purple'
                    : 'bg-hsg-card text-hsg-muted border-hsg-border hover:text-white'
                }`}
              >
                Screenshots ({game.screenshots.length})
              </button>

              {game.videoUrl && (
                <button
                  onClick={() => setActiveMediaTab('video')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                    activeMediaTab === 'video'
                      ? 'bg-hsg-cyan text-black border-hsg-cyan'
                      : 'bg-hsg-card text-hsg-muted border-hsg-border hover:text-white'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Gameplay Video</span>
                </button>
              )}
            </div>

            {/* Thumbnails row */}
            {activeMediaTab === 'screenshots' && (
              <div className="flex items-center gap-2">
                {game.screenshots.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedScreenshot(img)}
                    className={`w-12 h-12 rounded-xl border p-1 bg-hsg-card overflow-hidden transition ${
                      selectedScreenshot === img ? 'border-hsg-purple ring-2 ring-hsg-purple/40' : 'border-hsg-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Live Interactive Demo Highlight Banner */}
          {game.hasPlayableDemo && (
            <div className="bg-gradient-to-r from-[#170e30] via-hsg-card to-[#0d1628] border border-hsg-purple/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <h4 className="text-sm font-extrabold text-white">Live Interactive Browser Demo</h4>
                </div>
                <p className="text-xs text-hsg-muted">
                  Test the complete 38s betting and wheel rotation loop inside a simulated mobile voice room right now.
                </p>
              </div>

              <button
                onClick={() => onOpenDemo(game)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 shrink-0"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Launch Live Demo</span>
              </button>
            </div>
          )}

        </div>

        {/* Right Column: Pricing, Licensing & Purchase Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-hsg-card border border-hsg-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            {/* Title & Rating */}
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 mb-2">
                <div className="flex items-center gap-1 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{game.rating.toFixed(2)}</span>
                </div>
                <span className="text-hsg-muted">•</span>
                <span className="text-hsg-muted font-medium">{game.downloadsCount} active installations</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                {game.title}
              </h1>
              <p className="text-xs text-hsg-muted mt-2 leading-relaxed">
                {game.shortDescription}
              </p>
            </div>

            {/* License Option Selector */}
            <div className="space-y-3 pt-4 border-t border-hsg-border/60">
              <span className="text-xs font-bold uppercase tracking-wider text-hsg-muted block">
                Select License Option
              </span>

              {/* Single Application License */}
              <label
                onClick={() => setSelectedLicense('single')}
                className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition ${
                  selectedLicense === 'single'
                    ? 'bg-hsg-purple/10 border-hsg-purple ring-1 ring-hsg-purple'
                    : 'bg-hsg-surface border-hsg-border hover:border-hsg-borderLight'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="license"
                      checked={selectedLicense === 'single'}
                      onChange={() => setSelectedLicense('single')}
                      className="accent-hsg-purple"
                    />
                    <span className="text-xs font-bold text-white">Single Application License</span>
                  </div>
                  <p className="text-[11px] text-hsg-muted pl-5">
                    For 1 commercial Android application or voice-chat platform.
                  </p>
                </div>
                <span className="text-base font-extrabold text-white">${game.priceSingle}</span>
              </label>

              {/* Extended Commercial License */}
              <label
                onClick={() => setSelectedLicense('extended')}
                className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition ${
                  selectedLicense === 'extended'
                    ? 'bg-hsg-purple/10 border-hsg-purple ring-1 ring-hsg-purple'
                    : 'bg-hsg-surface border-hsg-border hover:border-hsg-borderLight'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="license"
                      checked={selectedLicense === 'extended'}
                      onChange={() => setSelectedLicense('extended')}
                      className="accent-hsg-purple"
                    />
                    <span className="text-xs font-bold text-white">Extended Commercial License</span>
                  </div>
                  <p className="text-[11px] text-hsg-muted pl-5">
                    Unlimited applications, agency usage, and white-label redistribution.
                  </p>
                </div>
                <span className="text-base font-extrabold text-white">${game.priceExtended}</span>
              </label>
            </div>

            {/* Total & Action Buttons */}
            <div className="pt-4 border-t border-hsg-border/60 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-hsg-muted">Total Payable:</span>
                <span className="text-3xl font-black text-white">${price}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-3.5 px-4 rounded-xl bg-hsg-surface hover:bg-white/10 text-white font-bold text-xs border border-hsg-border transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4 text-hsg-cyan" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-4 rounded-xl bg-hsg-purple hover:bg-hsg-purpleDark text-white font-bold text-xs shadow-purple-glow transition flex items-center justify-center gap-2"
                >
                  <span>Buy Now</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] text-hsg-muted pt-2">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Instant ZIP Archive
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-hsg-cyan" />
                  Commercial License
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── Tabs for Features, Technical Specs & Integration ── */}
      <div className="bg-hsg-card border border-hsg-border rounded-3xl p-6 sm:p-10 space-y-10">
        
        {/* Full Overview Description */}
        <div>
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Layers className="w-5 h-5 text-hsg-purple" />
            <span>Product Overview & Game Design</span>
          </h3>
          <p className="text-xs sm:text-sm text-hsg-muted leading-relaxed whitespace-pre-line">
            {game.description}
          </p>
        </div>

        {/* Real Features List */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Engineered Features & Mechanics</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {game.features.map((feat, idx) => (
              <div key={idx} className="bg-hsg-surface border border-hsg-border p-3.5 rounded-xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-hsg-cyan shrink-0 mt-0.5" />
                <span className="text-xs text-white/90 leading-relaxed">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Real Technical Specifications */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-hsg-cyan" />
            <span>Real Android Technical Specifications</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-hsg-surface border border-hsg-border p-4 rounded-xl">
              <span className="text-hsg-muted block text-[11px]">Language</span>
              <strong className="text-white text-sm">{game.techSpecs.language}</strong>
            </div>
            <div className="bg-hsg-surface border border-hsg-border p-4 rounded-xl">
              <span className="text-hsg-muted block text-[11px]">UI Framework</span>
              <strong className="text-white text-sm">{game.techSpecs.uiFramework}</strong>
            </div>
            <div className="bg-hsg-surface border border-hsg-border p-4 rounded-xl">
              <span className="text-hsg-muted block text-[11px]">Architecture</span>
              <strong className="text-white text-sm">{game.techSpecs.architecture}</strong>
            </div>
            <div className="bg-hsg-surface border border-hsg-border p-4 rounded-xl">
              <span className="text-hsg-muted block text-[11px]">Minimum SDK</span>
              <strong className="text-white text-sm">{game.techSpecs.minSdk}</strong>
            </div>
            <div className="bg-hsg-surface border border-hsg-border p-4 rounded-xl">
              <span className="text-hsg-muted block text-[11px]">Target SDK</span>
              <strong className="text-white text-sm">{game.techSpecs.targetSdk}</strong>
            </div>
            <div className="bg-hsg-surface border border-hsg-border p-4 rounded-xl">
              <span className="text-hsg-muted block text-[11px]">Audio Engine</span>
              <strong className="text-white text-sm">{game.techSpecs.soundEngine}</strong>
            </div>
            <div className="bg-hsg-surface border border-hsg-border p-4 rounded-xl">
              <span className="text-hsg-muted block text-[11px]">Backend Supported</span>
              <strong className="text-white text-sm">{game.techSpecs.backendSupported}</strong>
            </div>
            <div className="bg-hsg-surface border border-hsg-border p-4 rounded-xl">
              <span className="text-hsg-muted block text-[11px]">Multiplayer Clock</span>
              <strong className="text-white text-sm">{game.techSpecs.multiplayerMode}</strong>
            </div>
          </div>
        </div>

        {/* 5-Step Integration Walkthrough */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            <span>Step-by-Step Android Integration Guide</span>
          </h3>
          <div className="space-y-3 font-mono text-xs">
            {game.integrationGuide.map((step, idx) => (
              <div key={idx} className="bg-hsg-bg border border-hsg-border p-3 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-hsg-purple/20 text-hsg-purple font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-hsg-white/90 pt-0.5">{step}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
