import React from 'react';
import { ShieldCheck, Mail, MessageSquare } from 'lucide-react';
import { CATEGORIES_LIST } from '../../data/mockData';

interface Props {
  navigate: (route: string, param?: string) => void;
}

export const Footer: React.FC<Props> = ({ navigate }) => {
  return (
    <footer className="bg-[#06080F] border-t border-hsg-border text-hsg-muted text-sm pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div
              onClick={() => navigate('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img
                src="/brand/hsgamelogopng.png"
                alt="HSGames"
                className="h-9 w-auto object-contain"
              />
              <span className="font-extrabold text-xl tracking-tight text-white">
                HS<span className="text-hsg-purple">GAMES</span>
              </span>
            </div>
            <p className="text-xs text-hsg-muted leading-relaxed">
              Original native Android multiplayer game source codes, developed in Kotlin with Jetpack Compose, built specifically for social voice-chat apps and live audio platforms.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Clean Native Code</span>
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Marketplace Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES_LIST.slice(1, 7).map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => navigate('games', cat.name)}
                    className="hover:text-hsg-cyan transition"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('games')} className="hover:text-white transition">
                  All Android Games
                </button>
              </li>
              <li>
                <button onClick={() => navigate('bundles')} className="hover:text-white transition">
                  Game Packs (Bundles)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('customer-dashboard')} className="hover:text-white transition">
                  Customer Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate('about')} className="hover:text-white transition">
                  About HSGames
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-white transition">
                  Contact & Support
                </button>
              </li>
              <li>
                <button onClick={() => navigate('admin-dashboard')} className="hover:text-hsg-purple transition font-semibold">
                  Administrator Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Developer / Enterprise Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Business & Integration
            </h4>
            <div className="space-y-3 text-xs">
              <p className="text-hsg-muted">
                Need a custom game, bespoke RPC migration, or exclusive license for your streaming application?
              </p>
              <div className="bg-hsg-card border border-hsg-border p-3 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <Mail className="w-3.5 h-3.5 text-hsg-purple" />
                  <span className="font-mono text-[11px]">contact@hsgames.tech</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <MessageSquare className="w-3.5 h-3.5 text-hsg-cyan" />
                  <span className="text-[11px]">WhatsApp: +92 300 0000000</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="border-t border-hsg-border/60 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-hsg-muted gap-4">
          <p>© {new Date().getFullYear()} HSGames — Social Gaming Solutions. All Rights Reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <span>100% Kotlin Native</span>
            <span>•</span>
            <span>Jetpack Compose</span>
            <span>•</span>
            <span>Supabase Ready</span>
            <span>•</span>
            <span>Cloudflare Protected</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
