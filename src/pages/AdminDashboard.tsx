import React, { useState } from 'react';
import { 
  ShieldCheck, Package, ShoppingCart, Key, Users, Settings, LifeBuoy, 
  CheckCircle2, XCircle, Eye, Plus, Edit, Trash2, Smartphone, Terminal, 
  DollarSign, Sparkles, AlertCircle, Copy, Check, ExternalLink 
} from 'lucide-react';
import { useStoreState } from '../services/store';
import { GameItem, Order, License, SupportTicket, GameBundle } from '../types';
import { CATEGORIES_LIST } from '../data/mockData';
import { isSupabaseConfigured } from '../lib/supabase';

interface Props {
  navigate: (route: string, param?: string) => void;
}

export const AdminDashboard: React.FC<Props> = ({ navigate }) => {
  const { 
    games, setGames, 
    orders, approveOrder, rejectOrder, 
    licenses, setLicenses, 
    bundles, setBundles, 
    tickets, setTickets, 
    settings, setSettings 
  } = useStoreState();

  const [activeSection, setActiveSection] = useState<
    'overview' | 'games' | 'orders' | 'licenses' | 'bundles' | 'demo-infra' | 'tickets' | 'settings'
  >('overview');

  const [inspectOrder, setInspectOrder] = useState<Order | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState<string>('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [settingsForm, setSettingsForm] = useState(settings);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Statistics
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'under_review' || o.status === 'pending').length;
  const approvedOrdersCount = orders.filter(o => o.status === 'paid').length;
  const totalRevenue = orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.totalAmount, 0);

  const handleApprove = (orderId: string) => {
    approveOrder(orderId);
    setInspectOrder(null);
  };

  const handleReject = (orderId: string) => {
    const reason = prompt('Enter rejection reason (optional):');
    rejectOrder(orderId, reason || 'Payment proof verification failed.');
    setInspectOrder(null);
  };

  const handleReplyTicket = (ticketId: string) => {
    if (!ticketReplyText.trim()) return;
    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'resolved' as const,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          messages: [
            ...t.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'admin' as const,
              senderName: 'HSGames Administrator',
              text: ticketReplyText,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
            }
          ]
        };
      }
      return t;
    });
    setTickets(updated);
    setTicketReplyText('');
    setSelectedTicketId(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(settingsForm);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const toggleGamePublish = (gameId: string) => {
    const updated = games.map(g => {
      if (g.id === gameId) {
        return { ...g, status: g.status === 'published' ? 'draft' as const : 'published' as const };
      }
      return g;
    });
    setGames(updated);
  };

  const toggleGameFeatured = (gameId: string) => {
    const updated = games.map(g => {
      if (g.id === gameId) {
        return { ...g, featured: !g.featured };
      }
      return g;
    });
    setGames(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-black font-extrabold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>Settings Successfully Updated!</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-gradient-to-r from-hsg-card via-[#1c1236] to-hsg-card border border-hsg-purple/50 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-hsg-purple/20 border border-hsg-purple/40 flex items-center justify-center text-hsg-purple shadow-purple-glow">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">Administrator Command Center</h1>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                isSupabaseConfigured
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {isSupabaseConfigured ? '● Supabase PostgreSQL Live' : '○ Standalone Local DB'}
              </span>
            </div>
            <p className="text-xs text-hsg-muted mt-1">
              Full control over products, 8 categories, manual payment approvals, license minting, and zero-cost demo infrastructure.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('home')}
          className="text-xs font-bold text-hsg-muted hover:text-white px-4 py-2 rounded-xl bg-hsg-surface border border-hsg-border"
        >
          View Public Site →
        </button>
      </div>

      {/* Admin Section Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-hsg-border/60">
        {[
          { key: 'overview', label: 'Overview Analytics', icon: ShieldCheck },
          { key: 'orders', label: 'Orders & Payments', icon: ShoppingCart, badge: pendingOrdersCount },
          { key: 'games', label: 'Games Management', icon: Package, count: games.length },
          { key: 'bundles', label: 'Game Bundles', icon: Sparkles, count: bundles.length },
          { key: 'licenses', label: 'Minted Licenses', icon: Key, count: licenses.length },
          { key: 'demo-infra', label: 'Demo Infrastructure', icon: Smartphone },
          { key: 'tickets', label: 'Support Tickets', icon: LifeBuoy, count: tickets.length },
          { key: 'settings', label: 'Marketplace Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeSection === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
                isSelected
                  ? 'bg-hsg-purple text-white shadow-purple-glow'
                  : 'bg-hsg-card hover:bg-hsg-cardHover border border-hsg-border text-hsg-muted hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="text-[10px] bg-amber-500 text-black font-extrabold px-1.5 py-0.2 rounded-full animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── 1. OVERVIEW ANALYTICS ── */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-hsg-card border border-hsg-border p-5 rounded-2xl">
              <span className="text-xs text-hsg-muted font-bold block mb-1">Approved Revenue</span>
              <span className="text-3xl font-black text-white">${totalRevenue}</span>
              <span className="text-[10px] text-emerald-400 block mt-1">Paid Commercial Sales</span>
            </div>
            <div className="bg-hsg-card border border-hsg-border p-5 rounded-2xl">
              <span className="text-xs text-hsg-muted font-bold block mb-1">Pending Proofs</span>
              <span className="text-3xl font-black text-amber-400">{pendingOrdersCount}</span>
              <span className="text-[10px] text-hsg-muted block mt-1">Awaiting review</span>
            </div>
            <div className="bg-hsg-card border border-hsg-border p-5 rounded-2xl">
              <span className="text-xs text-hsg-muted font-bold block mb-1">Total Products</span>
              <span className="text-3xl font-black text-hsg-cyan">{games.length}</span>
              <span className="text-[10px] text-hsg-muted block mt-1">Across 8 Categories</span>
            </div>
            <div className="bg-hsg-card border border-hsg-border p-5 rounded-2xl">
              <span className="text-xs text-hsg-muted font-bold block mb-1">Licenses Issued</span>
              <span className="text-3xl font-black text-hsg-purple">{licenses.length}</span>
              <span className="text-[10px] text-purple-300 block mt-1">Commercial Keys</span>
            </div>
          </div>

          {/* Quick Pending Orders Table */}
          <div className="bg-hsg-card border border-hsg-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-hsg-border/60">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Pending Manual Payment Approvals</span>
              </h3>
              <button onClick={() => setActiveSection('orders')} className="text-xs text-hsg-cyan hover:underline">
                Manage All Orders
              </button>
            </div>

            {orders.filter(o => o.status === 'under_review' || o.status === 'pending').length > 0 ? (
              <div className="space-y-3">
                {orders.filter(o => o.status === 'under_review' || o.status === 'pending').map((o) => (
                  <div key={o.id} className="p-4 rounded-xl bg-hsg-surface border border-hsg-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white font-mono text-sm">{o.orderNumber}</strong>
                        <span className="text-hsg-muted">— {o.customerName} ({o.customerEmail})</span>
                      </div>
                      <span className="text-hsg-muted text-[11px] block mt-0.5">
                        Products: {o.items.map(i => i.title).join(', ')} • {o.paymentMethod}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-black text-base text-white">${o.totalAmount}</span>
                      <button
                        onClick={() => setInspectOrder(o)}
                        className="px-3 py-1.5 rounded-lg bg-hsg-purple hover:bg-hsg-purpleDark text-white font-bold"
                      >
                        Inspect & Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-hsg-muted py-4 text-center">No orders currently pending review.</p>
            )}
          </div>
        </div>
      )}

      {/* ── 2. ORDERS & PAYMENT PROOFS ── */}
      {activeSection === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Customer Orders & Payment Verification</h3>
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="bg-hsg-card border border-hsg-border rounded-2xl p-5 space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-hsg-border/60">
                  <div>
                    <span className="font-mono text-sm font-black text-white">{o.orderNumber}</span>
                    <span className="text-hsg-muted ml-2">Customer: <strong className="text-white">{o.customerName}</strong> ({o.customerEmail})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      o.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      o.status === 'under_review' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {o.status.replace('_', ' ')}
                    </span>
                    <span className="font-black text-base text-white">${o.totalAmount}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-hsg-muted gap-2">
                  <div>
                    <span>Items: <strong className="text-white">{o.items.map(i => i.title).join(', ')}</strong></span>
                    <span className="ml-3">Method: <strong className="text-white">{o.paymentMethod}</strong></span>
                    {o.paymentReference && <span className="ml-3 font-mono text-hsg-cyan">Ref: {o.paymentReference}</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInspectOrder(o)}
                      className="px-3 py-1 rounded-lg bg-hsg-surface hover:bg-white/10 text-white border border-hsg-border"
                    >
                      View Details
                    </button>
                    {o.status !== 'paid' && (
                      <button
                        onClick={() => handleApprove(o.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold"
                      >
                        Approve Payment
                      </button>
                    )}
                    {o.status !== 'rejected' && o.status !== 'paid' && (
                      <button
                        onClick={() => handleReject(o.id)}
                        className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. GAMES MANAGEMENT ── */}
      {activeSection === 'games' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Android Game Catalog</h3>
            <button
              onClick={() => alert('New product builder: Upload APK, set 8-category assignment, and configure prices.')}
              className="px-4 py-2 rounded-xl bg-hsg-purple hover:bg-hsg-purpleDark text-white text-xs font-bold flex items-center gap-1.5 shadow-purple-glow"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Game</span>
            </button>
          </div>

          <div className="space-y-3">
            {games.map((g) => (
              <div key={g.id} className="bg-hsg-card border border-hsg-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img src={g.coverImage} alt={g.title} className="w-12 h-12 rounded-xl object-contain bg-black/40 p-1" />
                  <div>
                    <h4 className="font-bold text-sm text-white">{g.title}</h4>
                    <div className="flex items-center gap-2 text-hsg-muted text-[11px] mt-0.5">
                      <span className="text-hsg-cyan font-semibold">{g.category}</span>
                      <span>•</span>
                      <span>Single: ${g.priceSingle}</span>
                      <span>•</span>
                      <span>Extended: ${g.priceExtended}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleGameFeatured(g.id)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${
                      g.featured ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-hsg-surface text-hsg-muted border-hsg-border'
                    }`}
                  >
                    {g.featured ? '★ Featured' : 'Normal'}
                  </button>

                  <button
                    onClick={() => toggleGamePublish(g.id)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${
                      g.status === 'published' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'
                    }`}
                  >
                    {g.status === 'published' ? 'Published' : 'Draft'}
                  </button>

                  <button
                    onClick={() => navigate('game-details', g.slug)}
                    className="p-1.5 rounded-lg bg-hsg-surface hover:bg-white/10 text-white border border-hsg-border"
                    title="View Page"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 4. GAME BUNDLES ── */}
      {activeSection === 'bundles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Configured Game Packs (Bundles)</h3>
            <button
              onClick={() => alert('New bundle builder active.')}
              className="px-4 py-2 rounded-xl bg-hsg-purple hover:bg-hsg-purpleDark text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Bundle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bundles.map((b) => (
              <div key={b.id} className="bg-hsg-card border border-hsg-border rounded-2xl p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{b.title}</h4>
                  <span className="text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Save {b.savingsPercentage}%
                  </span>
                </div>
                <p className="text-hsg-muted line-clamp-2">{b.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-hsg-border">
                  <span className="font-black text-white text-base">${b.bundlePrice}</span>
                  <span className="text-hsg-muted">{b.gameIds.length} Games Included</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 5. MINTED LICENSES ── */}
      {activeSection === 'licenses' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Commercial License Registry</h3>
          <div className="space-y-3">
            {licenses.map((lic) => (
              <div key={lic.id} className="bg-hsg-card border border-hsg-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-hsg-cyan font-bold">{lic.licenseKey}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.2 rounded-full uppercase font-bold">
                      {lic.status}
                    </span>
                  </div>
                  <span className="text-hsg-muted block mt-0.5">
                    Product: <strong className="text-white">{lic.productName}</strong> • Client: {lic.customerEmail}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-hsg-muted block font-mono">{lic.licenseType}</span>
                  <span className="text-[11px] text-hsg-muted">Issued: {lic.issuedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 6. DEMO INFRASTRUCTURE STATUS ── */}
      {activeSection === 'demo-infra' && (
        <div className="space-y-6">
          <div className="bg-hsg-card border border-hsg-border rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Zero-Cost Demo Architecture — Status Report</h3>
                <p className="text-xs text-hsg-muted">Production-sustainable model avoiding recurring server & emulator streaming subscriptions.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-hsg-surface border border-hsg-border p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-white font-bold">1. Browser Playable Simulation</strong>
                  <span className="text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full">Active</span>
                </div>
                <p className="text-hsg-muted leading-relaxed">
                  Recreates the exact 38s betting and deceleration loop in React using the game's actual 34 HD assets and SoundPool chip audio. Hosted on Cloudflare Pages free tier with $0 monthly server costs.
                </p>
              </div>

              <div className="bg-hsg-surface border border-hsg-border p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-white font-bold">2. Standalone Demo APK Distribution</strong>
                  <span className="text-cyan-400 font-bold bg-cyan-500/20 px-2 py-0.5 rounded-full">Compiled (38 MB)</span>
                </div>
                <p className="text-hsg-muted leading-relaxed">
                  Pre-configured standalone demo APK built with mock 500k coins and simulated audio room wrapper. Hosted in public downloads for direct installation on physical Android devices.
                </p>
              </div>
            </div>

            {/* Technical Evaluation Summary */}
            <div className="bg-hsg-bg border border-hsg-border p-4 rounded-2xl text-xs space-y-3">
              <strong className="text-hsg-cyan block font-bold uppercase tracking-wider">
                Cloud Emulator Tier Investigation (SpawnDroid / Vetro / Emuly / Afoli):
              </strong>
              <p className="text-hsg-muted leading-relaxed">
                • <strong>SpawnDroid:</strong> Hobby plan caps usage at 200 minutes/month for 1 runner. Suitable for scheduled high-value VIP buyer demos, but exhausted quickly by continuous public traffic.<br/>
                • <strong>Vetro:</strong> Client-side WebAssembly execution lacks complete translation for Jetpack Compose hardware acceleration shaders.<br/>
                • <strong>Conclusion:</strong> The browser-native simulation + direct APK download pipeline provides 100% reliable uptime with <strong>strictly zero hosting expenses</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. SUPPORT TICKETS ── */}
      {activeSection === 'tickets' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Client Technical Support Tickets</h3>
          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="bg-hsg-card border border-hsg-border rounded-2xl p-5 space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-hsg-border/60">
                  <div>
                    <span className="font-mono text-hsg-cyan font-bold mr-2">{t.ticketNumber}</span>
                    <strong className="text-white font-bold text-sm">{t.subject}</strong>
                    <span className="text-hsg-muted ml-2">from {t.customerEmail}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    t.status === 'open' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {t.status}
                  </span>
                </div>

                <div className="space-y-2">
                  {t.messages.map((m) => (
                    <div key={m.id} className="p-3 rounded-xl bg-hsg-surface border border-hsg-border">
                      <div className="flex items-center justify-between text-[10px] text-hsg-muted mb-1">
                        <strong className={m.sender === 'admin' ? 'text-hsg-purple' : 'text-white'}>{m.senderName}</strong>
                        <span>{m.timestamp}</span>
                      </div>
                      <p className="text-white/90">{m.text}</p>
                    </div>
                  ))}
                </div>

                {selectedTicketId === t.id ? (
                  <div className="pt-2 space-y-2">
                    <textarea
                      rows={3}
                      value={ticketReplyText}
                      onChange={(e) => setTicketReplyText(e.target.value)}
                      placeholder="Type your official administrative reply..."
                      className="w-full bg-hsg-surface border border-hsg-border text-white text-xs p-3 rounded-xl"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedTicketId(null)}
                        className="px-3 py-1.5 rounded-lg text-hsg-muted"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReplyTicket(t.id)}
                        className="px-4 py-1.5 rounded-lg bg-hsg-purple hover:bg-hsg-purpleDark text-white font-bold"
                      >
                        Send Reply & Mark Resolved
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-1">
                    <button
                      onClick={() => setSelectedTicketId(t.id)}
                      className="text-xs font-bold text-hsg-purple hover:underline"
                    >
                      Reply to Ticket →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 8. MARKETPLACE SETTINGS ── */}
      {activeSection === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-hsg-card border border-hsg-border rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl text-xs">
          <h3 className="text-lg font-bold text-white">Marketplace & Official Payment Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-hsg-muted block mb-1">Brand Name</label>
              <input
                type="text"
                value={settingsForm.brandName}
                onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                className="w-full bg-hsg-surface border border-hsg-border text-white px-3 py-2 rounded-xl"
              />
            </div>

            <div>
              <label className="text-hsg-muted block mb-1">Tagline</label>
              <input
                type="text"
                value={settingsForm.tagline}
                onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                className="w-full bg-hsg-surface border border-hsg-border text-white px-3 py-2 rounded-xl"
              />
            </div>

            <div>
              <label className="text-hsg-muted block mb-1">Contact Email</label>
              <input
                type="email"
                value={settingsForm.contactEmail}
                onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                className="w-full bg-hsg-surface border border-hsg-border text-white px-3 py-2 rounded-xl"
              />
            </div>

            <div>
              <label className="text-hsg-muted block mb-1">Contact WhatsApp</label>
              <input
                type="text"
                value={settingsForm.contactWhatsapp}
                onChange={(e) => setSettingsForm({ ...settingsForm, contactWhatsapp: e.target.value })}
                className="w-full bg-hsg-surface border border-hsg-border text-white px-3 py-2 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-hsg-border space-y-3">
            <span className="text-xs font-bold text-hsg-cyan uppercase block">Official Remittance Details:</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-hsg-muted block mb-1">Bank Title</label>
                <input
                  type="text"
                  value={settingsForm.paymentBankTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, paymentBankTitle: e.target.value })}
                  className="w-full bg-hsg-surface border border-hsg-border text-white px-3 py-2 rounded-xl"
                />
              </div>

              <div>
                <label className="text-hsg-muted block mb-1">Bank Name</label>
                <input
                  type="text"
                  value={settingsForm.paymentBankName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, paymentBankName: e.target.value })}
                  className="w-full bg-hsg-surface border border-hsg-border text-white px-3 py-2 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-hsg-muted block mb-1">Bank IBAN</label>
                <input
                  type="text"
                  value={settingsForm.paymentBankIban}
                  onChange={(e) => setSettingsForm({ ...settingsForm, paymentBankIban: e.target.value })}
                  className="w-full bg-hsg-surface border border-hsg-border text-white px-3 py-2 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-hsg-muted block mb-1">EasyPaisa Account</label>
                <input
                  type="text"
                  value={settingsForm.paymentEasypaisaNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, paymentEasypaisaNumber: e.target.value })}
                  className="w-full bg-hsg-surface border border-hsg-border text-white px-3 py-2 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-hsg-muted block mb-1">JazzCash Account</label>
                <input
                  type="text"
                  value={settingsForm.paymentJazzcashNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, paymentJazzcashNumber: e.target.value })}
                  className="w-full bg-hsg-surface border border-hsg-border text-white px-3 py-2 rounded-xl font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-hsg-muted block mb-1">USDT (TRC-20) Wallet Address</label>
                <input
                  type="text"
                  value={settingsForm.paymentUsdtAddress}
                  onChange={(e) => setSettingsForm({ ...settingsForm, paymentUsdtAddress: e.target.value })}
                  className="w-full bg-hsg-surface border border-hsg-border text-white px-3 py-2 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-hsg-purple hover:bg-hsg-purpleDark text-white font-bold shadow-purple-glow"
          >
            Save Marketplace Settings
          </button>
        </form>
      )}

      {/* Inspect Order Modal */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-hsg-card border border-hsg-border rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-hsg-border">
              <h3 className="font-bold text-white text-base">Review Order {inspectOrder.orderNumber}</h3>
              <button onClick={() => setInspectOrder(null)} className="text-hsg-muted hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-hsg-surface p-3 rounded-xl space-y-1">
                <div>Customer: <strong className="text-white">{inspectOrder.customerName}</strong> ({inspectOrder.customerEmail})</div>
                <div>WhatsApp: <strong className="text-white">{inspectOrder.customerWhatsapp || 'N/A'}</strong></div>
                <div>Method: <strong className="text-white">{inspectOrder.paymentMethod}</strong></div>
                {inspectOrder.paymentReference && (
                  <div>Reference / Hash: <strong className="text-hsg-cyan font-mono">{inspectOrder.paymentReference}</strong></div>
                )}
                <div className="pt-1 text-sm font-black text-white">Amount: ${inspectOrder.totalAmount}</div>
              </div>

              <div>
                <span className="text-hsg-muted block mb-1">Attached Payment Receipt:</span>
                <div className="bg-black/50 border border-hsg-border rounded-xl p-3 flex items-center justify-center">
                  <img
                    src={inspectOrder.paymentProofUrl || '/brand/hsgamelogo.png'}
                    alt="Proof"
                    className="max-h-40 object-contain rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-hsg-border">
                <button
                  type="button"
                  onClick={() => handleReject(inspectOrder.id)}
                  className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(inspectOrder.id)}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold shadow-lg"
                >
                  Approve & Issue License
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
