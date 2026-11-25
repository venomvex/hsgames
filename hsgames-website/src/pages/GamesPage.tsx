import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Gamepad2, X } from 'lucide-react';
import { useStoreState } from '../services/store';
import { CATEGORIES_LIST } from '../data/mockData';
import { GameCard } from '../components/marketplace/GameCard';
import { GameItem, GameCategoryName } from '../types';

interface Props {
  initialCategory?: string;
  navigate: (route: string, param?: string) => void;
  onOpenDemo: (game: GameItem) => void;
}

export const GamesPage: React.FC<Props> = ({ initialCategory = 'All Games', navigate, onOpenDemo }) => {
  const { games } = useStoreState();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'downloads'>('featured');

  // Filtered and sorted games
  const filteredGames = useMemo(() => {
    return games
      .filter((game) => game.status === 'published')
      .filter((game) => {
        if (selectedCategory && selectedCategory !== 'All Games') {
          return game.category === selectedCategory;
        }
        return true;
      })
      .filter((game) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          game.title.toLowerCase().includes(q) ||
          game.shortDescription.toLowerCase().includes(q) ||
          game.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceSingle - b.priceSingle;
        if (sortBy === 'price-desc') return b.priceSingle - a.priceSingle;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'downloads') return b.downloadsCount - a.downloadsCount;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [games, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-hsg-muted mb-2">
          <button onClick={() => navigate('home')} className="hover:text-white transition">Home</button>
          <span>/</span>
          <span className="text-hsg-cyan font-semibold">Games Marketplace</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Native Android Game Source Codes
        </h1>
        <p className="text-xs sm:text-sm text-hsg-muted mt-1 max-w-2xl">
          Complete, un-obfuscated Kotlin source codes, UI components, sound effects, and Supabase migrations engineered for social audio rooms and live streaming.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-hsg-card border border-hsg-border p-4 rounded-2xl shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-hsg-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by game name, tags, or keyword..."
            className="w-full bg-hsg-surface border border-hsg-border text-white text-xs pl-10 pr-8 py-2.5 rounded-xl focus:outline-none focus:border-hsg-purple placeholder:text-hsg-muted"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-hsg-muted hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <SlidersHorizontal className="w-4 h-4 text-hsg-muted shrink-0" />
          <span className="text-hsg-muted shrink-0 hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-hsg-surface border border-hsg-border text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-hsg-purple cursor-pointer"
          >
            <option value="featured">Featured First</option>
            <option value="downloads">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

      </div>

      {/* Category Pills (Exact 8 Categories) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES_LIST.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-hsg-purple text-white shadow-purple-glow'
                  : 'bg-hsg-card hover:bg-hsg-cardHover border border-hsg-border text-hsg-muted hover:text-white'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-hsg-muted pt-2 border-t border-hsg-border/40">
        <span>Showing <strong className="text-white">{filteredGames.length}</strong> available game source codes</span>
        {selectedCategory !== 'All Games' && (
          <button
            onClick={() => setSelectedCategory('All Games')}
            className="text-hsg-cyan hover:underline"
          >
            Clear category filter
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onOpenDemo={onOpenDemo}
              onViewDetails={(slug) => navigate('game-details', slug)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-hsg-card/50 border border-hsg-border rounded-3xl p-8 max-w-xl mx-auto space-y-3">
          <Gamepad2 className="w-12 h-12 text-hsg-muted mx-auto mb-2 opacity-40" />
          <h4 className="text-base font-bold text-white">
            {selectedCategory !== 'All Games'
              ? `No Published Games in "${selectedCategory}" Yet`
              : 'No games match your query'}
          </h4>
          <p className="text-xs text-hsg-muted leading-relaxed">
            {selectedCategory !== 'All Games'
              ? `New native Android multiplayer titles for ${selectedCategory} are currently in development or undergoing security code review. Greedy Markhor is currently our live flagship product.`
              : 'Try adjusting your search terms or select another category from the 8 official marketplace categories.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Games');
            }}
            className="px-5 py-2.5 rounded-xl bg-hsg-surface hover:bg-white/10 text-white font-bold text-xs border border-hsg-border transition"
          >
            {selectedCategory !== 'All Games' ? 'View All Available Games' : 'Reset Filters'}
          </button>
        </div>
      )}

    </div>
  );
};
