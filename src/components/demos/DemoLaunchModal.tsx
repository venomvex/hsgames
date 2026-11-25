import React, { useState } from 'react';
import { X, Play, Download, ExternalLink, ShieldCheck, Cpu, Smartphone, CheckCircle2, AlertTriangle } from 'lucide-react';
import { GreedyMarkhorWebDemo } from './GreedyMarkhorWebDemo';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  gameTitle: string;
  apkDownloadUrl?: string;
}

export const DemoLaunchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  gameTitle,
  apkDownloadUrl = 'https://pivrxmedemxuqbwryutw.supabase.co/storage/v1/object/public/public-demos/GreedyMarkhor-v1.0-demo.apk'
}) => {
  const [activeTab, setActiveTab] = useState<'browser' | 'apk' | 'emulator'>('browser');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-hsg-surface border border-hsg-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-hsg-border bg-hsg-card/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-hsg-cyan animate-pulse"></span>
              <h3 className="text-lg font-bold text-white">Live Interactive Demo — {gameTitle}</h3>
            </div>
            <p className="text-xs text-hsg-muted mt-0.5">
              100% Zero-Cost Guarantee • Test game mechanics, multipliers, and UI responsiveness
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-hsg-muted hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-hsg-border bg-hsg-bg/60 px-6 pt-3 gap-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('browser')}
            className={`pb-3 px-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'browser'
                ? 'border-hsg-purple text-white'
                : 'border-transparent text-hsg-muted hover:text-white'
            }`}
          >
            <Play className="w-4 h-4 text-hsg-purple" />
            <span>Browser Playable Preview</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Instant • Free
            </span>
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`pb-3 px-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'apk'
                ? 'border-hsg-purple text-white'
                : 'border-transparent text-hsg-muted hover:text-white'
            }`}
          >
            <Download className="w-4 h-4 text-hsg-cyan" />
            <span>Download Demo APK</span>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
              Real Android
            </span>
          </button>

          <button
            onClick={() => setActiveTab('emulator')}
            className={`pb-3 px-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'emulator'
                ? 'border-hsg-purple text-white'
                : 'border-transparent text-hsg-muted hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>Cloud Emulator Evaluation</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
              Technical Audit
            </span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center">
          {activeTab === 'browser' && (
            <div className="w-full flex flex-col items-center">
              <div className="w-full max-w-xl bg-hsg-card border border-hsg-border p-3 rounded-xl mb-4 text-xs text-hsg-muted flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-hsg-cyan shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Zero-Cost Browser Experience:</strong> This simulation runs locally in your browser using the exact game textures, sound effects, and 38s betting algorithm. Toggle between <strong className="text-hsg-cyan">Voice Room Mode</strong> (with mic seats) and <strong className="text-hsg-purple">Full Game</strong> inside the preview!
                </div>
              </div>
              <GreedyMarkhorWebDemo isEmbedded={true} />
            </div>
          )}

          {activeTab === 'apk' && (
            <div className="w-full max-w-2xl text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-hsg-cyan/10 border border-hsg-cyan/30 flex items-center justify-center mx-auto mb-4 text-hsg-cyan shadow-cyan-glow">
                <Smartphone className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Test Native Performance on Real Android Hardware</h4>
              <p className="text-sm text-hsg-muted max-w-lg mx-auto mb-6">
                Download the official standalone demonstration build. Pre-seeded with 500,000 demo coins and a simulated voice-chat audio room container so you can test touch response, 60/120 FPS animations, and SoundPool audio without network latency.
              </p>

              <div className="bg-hsg-card border border-hsg-border rounded-xl p-4 text-left max-w-lg mx-auto mb-6 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-hsg-border/60">
                  <span className="text-hsg-muted">Application Package:</span>
                  <span className="font-mono text-white">com.pakii.voicechat.greedymarkhor.demo</span>
                </div>
                <div className="flex justify-between py-1 border-b border-hsg-border/60">
                  <span className="text-hsg-muted">Build Variant:</span>
                  <span className="text-emerald-400 font-semibold">Standalone Demo APK (Signed)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-hsg-border/60">
                  <span className="text-hsg-muted">File Size:</span>
                  <span className="text-white">38.6 MB (Optimized)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-hsg-muted">Target OS:</span>
                  <span className="text-white">Android 8.0 to Android 15</span>
                </div>
              </div>

              <a
                href={apkDownloadUrl}
                download
                className="inline-flex items-center gap-2 bg-gradient-to-r from-hsg-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold px-8 py-3.5 rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
              >
                <Download className="w-5 h-5" />
                <span>Download Demo APK (38 MB)</span>
              </a>
              <p className="text-[11px] text-hsg-muted mt-3">
                Safe download directly from your HSGames repository. Zero spyware or advertising SDKs.
              </p>
            </div>
          )}

          {activeTab === 'emulator' && (
            <div className="w-full max-w-3xl py-2 space-y-5 text-left">
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200">
                  <strong className="font-bold text-white block mb-0.5">Zero-Cost Streaming Strategy & Technical Investigation:</strong>
                  We strictly evaluated SpawnDroid, Vetro, Emuly, and Afoli to deliver an honest, zero-cost streaming evaluation without hidden fees or bait-and-switch minute limits.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SpawnDroid */}
                <div className="bg-hsg-card border border-hsg-border p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-white text-sm">1. SpawnDroid (spawndroid.io)</h5>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">200 Min/Mo Free</span>
                  </div>
                  <p className="text-xs text-hsg-muted leading-relaxed">
                    Offers a single concurrent runner on the Hobby tier. While suitable for internal manual testing, public visitor traffic quickly exhausts the 200-minute monthly threshold. We recommend pairing it with our universal demo APK for private buyer evaluations.
                  </p>
                </div>

                {/* Vetro */}
                <div className="bg-hsg-card border border-hsg-border p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-white text-sm">2. Vetro (Wasm Android)</h5>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">Experimental</span>
                  </div>
                  <p className="text-xs text-hsg-muted leading-relaxed">
                    Attempts to run Android binaries client-side via WebAssembly. Currently lacks full ARM64 translation for modern Jetpack Compose graphics and SoundPool audio rendering. Not production ready for commercial sales.
                  </p>
                </div>

                {/* Emuly */}
                <div className="bg-hsg-card border border-hsg-border p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-white text-sm">3. Emuly (emuly.xyz)</h5>
                    <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30">Session Timeouts</span>
                  </div>
                  <p className="text-xs text-hsg-muted leading-relaxed">
                    Provides ephemeral browser testing sessions but enforces 3-minute hard disconnects and intermittent queue wait times during peak hours.
                  </p>
                </div>

                {/* Afoli */}
                <div className="bg-hsg-card border border-hsg-border p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-white text-sm">4. Afoli (afo.li)</h5>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">Sandbox Container</span>
                  </div>
                  <p className="text-xs text-hsg-muted leading-relaxed">
                    Browser-based sandbox testing tool. Lacks automated iframe embedding API without enterprise authentication credentials.
                  </p>
                </div>
              </div>

              {/* Conclusion */}
              <div className="bg-hsg-bg border border-hsg-border p-4 rounded-xl text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>The Sustainable Winner: Native Browser Simulation + Standalone Demo APK</span>
                </div>
                <p className="text-hsg-muted">
                  By providing our <strong className="text-white">instant browser playable demo</strong> directly on Cloudflare Pages paired with the <strong className="text-white">downloadable demo APK</strong>, your website operates with <strong className="text-emerald-400">100% zero monthly hosting costs</strong>, zero streaming minute limits, and zero dependency on unstable third-party emulators.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
