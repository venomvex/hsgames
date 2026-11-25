import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ShoppingCart, Tag } from 'lucide-react';
import { useStoreState } from '../services/store';

interface Props {
  navigate: (route: string, param?: string) => void;
}

export const BundlesPage: React.FC<Props> = ({ navigate }) => {
  const { bundles, games, addToCart } = useStoreState();

  const handleAddBundleToCart = (bundleId: string, bundleTitle: string, price: number) => {
    addToCart({
      type: 'bundle',
      id: bundleId,
      title: bundleTitle,
      licenseType: 'single',
      price: price
    });
    navigate('cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs text-hsg-muted mb-2">
          <button onClick={() => navigate('home')} className="hover:text-white transition">Home</button>
          <span>/</span>
          <span className="text-hsg-cyan font-semibold">Game Packs (Bundles)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Complete Social Entertainment Packs
        </h1>
        <p className="text-xs sm:text-sm text-hsg-muted mt-1 max-w-2xl">
          Maximize revenue with pre-configured multi-game suites. Save up to 35% compared to purchasing standalone licenses.
        </p>
      </div>

      {/* Bundles Grid */}
      {bundles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {bundles.map((bundle) => {
            const includedGameObjects = games.filter((g) => bundle.gameIds.includes(g.id));

            return (
              <div
                key={bundle.id}
                className="bg-hsg-card border border-hsg-border hover:border-hsg-purple/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition hover:-translate-y-1 duration-300"
              >
                <div>
                  {/* Badge & Discount */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{bundle.badge || 'Bundle Offer'} • Save {bundle.savingsPercentage}%</span>
                    </span>
                    <span className="text-xs text-hsg-muted line-through">
                      ${bundle.individualTotalPrice} Total Value
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-extrabold text-white mb-2 leading-tight">
                    {bundle.title}
                  </h3>
                  <p className="text-xs text-hsg-muted mb-6 leading-relaxed">
                    {bundle.description}
                  </p>

                  {/* Included Games List */}
                  <div className="space-y-3 mb-6 bg-hsg-surface/60 border border-hsg-border p-4 rounded-2xl">
                    <span className="text-[11px] font-bold text-hsg-cyan uppercase tracking-wider block">
                      Included Android Games ({includedGameObjects.length}):
                    </span>
                    <div className="space-y-2">
                      {includedGameObjects.map((g) => (
                        <div
                          key={g.id}
                          onClick={() => navigate('game-details', g.slug)}
                          className="flex items-center justify-between p-2 rounded-xl bg-hsg-card hover:bg-white/5 cursor-pointer transition border border-hsg-border/40"
                        >
                          <div className="flex items-center gap-2.5">
                            <img src={g.coverImage} alt={g.title} className="w-6 h-6 object-contain" />
                            <span className="text-xs font-semibold text-white truncate max-w-[200px]">
                              {g.title}
                            </span>
                          </div>
                          <span className="text-[11px] text-hsg-muted font-bold">${g.priceSingle}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {bundle.features.map((feat, i) => (
                      <li key={i} className="text-xs text-white/90 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-hsg-purple shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & Action */}
                <div className="pt-5 border-t border-hsg-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-hsg-muted font-bold uppercase block">Commercial Bundle Price</span>
                    <span className="text-3xl font-black text-white">${bundle.bundlePrice}</span>
                  </div>

                  <button
                    onClick={() => handleAddBundleToCart(bundle.id, bundle.title, bundle.bundlePrice)}
                    className="px-6 py-3.5 rounded-xl bg-hsg-purple hover:bg-hsg-purpleDark text-white font-extrabold text-xs shadow-purple-glow transition flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Get Bundle Now</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-hsg-card/40 border border-hsg-border rounded-3xl p-8 max-w-2xl mx-auto space-y-4">
          <Tag className="w-12 h-12 text-hsg-cyan mx-auto opacity-60" />
          <h3 className="text-lg font-bold text-white">Multi-Game Packs Coming Soon</h3>
          <p className="text-xs text-hsg-muted leading-relaxed">
            Curated discount bundles will become available as additional native multiplayer titles are published. You can currently explore and evaluate our flagship title, Greedy Markhor, in the games catalog.
          </p>
          <button
            onClick={() => navigate('games')}
            className="px-6 py-3 rounded-xl bg-hsg-purple hover:bg-hsg-purpleDark text-white font-bold text-xs shadow-purple-glow transition"
          >
            Explore Greedy Markhor
          </button>
        </div>
      )}

    </div>
  );
};
