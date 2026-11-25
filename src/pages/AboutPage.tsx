import React from 'react';
import { ShieldCheck, Layers, Cpu, Users, Award, CheckCircle2 } from 'lucide-react';

interface Props {
  navigate: (route: string, param?: string) => void;
}

export const AboutPage: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-hsg-purple bg-hsg-purple/10 border border-hsg-purple/30 px-3.5 py-1 rounded-full">
          About HSGames
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Pioneering Social Audio Gaming Solutions
        </h1>
        <p className="text-sm sm:text-base text-hsg-muted leading-relaxed">
          HSGames is a specialized software house dedicated to developing original native Android multiplayer game source codes, engineered specifically for social voice-chat applications, live streaming lounges, and social audio platforms.
        </p>
      </div>

      {/* Core Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-hsg-card border border-hsg-border p-6 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-hsg-purple/20 flex items-center justify-center text-hsg-purple">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Voice-Room First Architecture</h3>
          <p className="text-xs text-hsg-muted leading-relaxed">
            Most casino and arcade game scripts available online are generic landscape webviews. HSGames designs every module to slide up seamlessly as an overlay or bottom sheet inside live voice-chat rooms so participants never drop off audio mic seats.
          </p>
        </div>

        <div className="bg-hsg-card border border-hsg-border p-6 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-hsg-cyan/20 flex items-center justify-center text-hsg-cyan">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">100% Native Kotlin & Compose</h3>
          <p className="text-xs text-hsg-muted leading-relaxed">
            We write clean, un-obfuscated Kotlin code following modern Android standards (Jetpack Compose, MVI, StateFlow, Coroutines). Zero lag, zero sluggish webviews, and full hardware-accelerated 60/120 FPS animations.
          </p>
        </div>

        <div className="bg-hsg-card border border-hsg-border p-6 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Transparent Commercial Licensing</h3>
          <p className="text-xs text-hsg-muted leading-relaxed">
            Every purchase grants an official, verifiable commercial license with direct source code archive delivery and pre-written Supabase / PostgreSQL database migration scripts.
          </p>
        </div>
      </div>

      {/* Target Clients */}
      <div className="bg-hsg-card border border-hsg-border rounded-3xl p-8 sm:p-12 space-y-6">
        <h3 className="text-2xl font-black text-white">Who We Build For</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {[
            'Social Voice-Chat Platforms (Yalla, Poppo Live, Chamet, StarMaker style apps)',
            'Live Streaming & Video Broadcasting Networks',
            'Android App Studios & Publisher Agencies',
            'Gaming Platform Businesses expanding into social audio',
            'Independent Android Developers seeking production-ready multiplayer code',
            'Gaming operators seeking zero-latency provably fair mini-games'
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl bg-hsg-surface border border-hsg-border/60">
              <CheckCircle2 className="w-4 h-4 text-hsg-cyan shrink-0" />
              <span className="text-white font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
