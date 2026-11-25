import React from 'react';
import { Star, Download, Play, ShoppingCart, ArrowRight } from 'lucide-react';
import { GameItem } from '../../types';
import { useStoreState } from '../../services/store';

interface Props {
  game: GameItem;
  onOpenDemo?: (game: GameItem) => void;
  onViewDetails: (slug: string) => void;
}

export const GameCard: React.FC<Props> = ({ game, onOpenDemo, onViewDetails }) => {
  const { addToCart } = useStoreState();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      type: 'game',
      id: game.id,
      title: game.title,
      licenseType: 'single',
      price: game.priceSingle
    });
  };

  return (
    <div
      onClick={() => onViewDetails(game.slug)}
      className="group relative bg-hsg-card hover:bg-hsg-cardHover border border-hsg-border hover:border-hsg-purple/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-card-glow hover:-translate-y-1 flex flex-col cursor-pointer"
    >
      {/* Thumbnail Banner */}
      <div className="relative aspect-[16/10] bg-[#0c0e1a] overflow-hidden flex items-center justify-center p-4">
        <img
          src={game.coverImage}
          alt={game.title}
          className="w-28 h-28 object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-lg"
          onError={(e) => {
            // fallback
            (e.target as HTMLImageElement).src = '/brand/hsgamelogo.png';
          }}
        />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-hsg-surface/90 backdrop-blur-md border border-hsg-border text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
          {game.category}
        </span>

        {/* Demo Available Pill */}
        {game.hasPlayableDemo && (
          <span className="absolute top-3 right-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Demo</span>
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Stats */}
          <div className="flex items-center justify-between text-xs text-hsg-muted mb-2">
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{game.rating.toFixed(1)}</span>
              <span className="text-hsg-muted text-[11px]">({game.reviewsCount})</span>
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              <Download className="w-3 h-3 text-hsg-cyan" />
              <span>{game.downloadsCount} integrations</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-white group-hover:text-hsg-cyan transition line-clamp-1 mb-1.5">
            {game.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-hsg-muted line-clamp-2 leading-relaxed mb-4">
            {game.shortDescription}
          </p>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-hsg-border/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-hsg-muted block leading-none">
              Commercial License
            </span>
            <span className="text-lg font-extrabold text-white">
              ${game.priceSingle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {game.hasPlayableDemo && onOpenDemo && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDemo(game);
                }}
                className="p-2 rounded-xl bg-hsg-surface hover:bg-white/10 text-hsg-cyan border border-hsg-border hover:border-hsg-cyan/40 transition"
                title="Play Live Demo"
              >
                <Play className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleAddToCart}
              className="p-2 rounded-xl bg-hsg-purple hover:bg-hsg-purpleDark text-white shadow-purple-glow transition"
              title="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
