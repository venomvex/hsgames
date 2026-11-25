import React, { useState } from 'react';
import { Package, Key, Download, LifeBuoy, FileText, Settings, User, Clock, CheckCircle2, AlertCircle, Copy, Check, MessageSquare, Plus } from 'lucide-react';
import { useStoreState } from '../services/store';
import { License, Order, SupportTicket } from '../types';

interface Props {
  navigate: (route: string, param?: string) => void;
}

export const CustomerDashboard: React.FC<Props> = ({ navigate }) => {
  const { user, orders, licenses, tickets, setTickets } = useStoreState();

  const [activeTab, setActiveTab] = useState<'overview' | 'purchases' | 'licenses' | 'downloads' | 'support' | 'settings'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New ticket form state
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Technical Integration');
  const [ticketMessage, setTicketMessage] = useState('');

  const userEmail = user?.email || 'developer@voicechat.app';
  const myOrders = orders.filter(o => o.customerEmail.toLowerCase() === userEmail.toLowerCase() || true); // show orders for test
  const myLicenses = licenses.filter(l => l.customerEmail.toLowerCase() === userEmail.toLowerCase() || true);
  const myTickets = tickets.filter(t => t.customerEmail.toLowerCase() === userEmail.toLowerCase() || true);

  const copyLicense = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: ticketSubject,
      customerEmail: userEmail,
      category: ticketCategory,
      priority: 'medium',
      status: 'open',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'customer',
          senderName: user?.fullName || 'Customer',
          text: ticketMessage,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }
      ]
    };

    setTickets([newTicket, ...tickets]);
    setShowNewTicketModal(false);
    setTicketSubject('');
    setTicketMessage('');
    setActiveTab('support');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Profile Header */}
      <div className="bg-hsg-card border border-hsg-border rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-hsg-purple to-hsg-cyan flex items-center justify-center text-2xl font-black text-white shadow-purple-glow">
            {user?.fullName?.substring(0, 1) || 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{user?.fullName || 'Customer Portal'}</h1>
              <span className="text-[10px] bg-hsg-purple/20 text-hsg-purple border border-hsg-purple/30 font-bold px-2 py-0.5 rounded-full uppercase">
                {user?.role === 'admin' ? 'Administrator' : 'Commercial Client'}
              </span>
            </div>
            <p className="text-xs text-hsg-muted mt-0.5">{user?.email || userEmail}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewTicketModal(true)}
            className="px-4 py-2.5 rounded-xl bg-hsg-surface hover:bg-white/10 text-white font-bold text-xs border border-hsg-border transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-hsg-cyan" />
            <span>Open Ticket</span>
          </button>
          <button
            onClick={() => navigate('games')}
            className="px-5 py-2.5 rounded-xl bg-hsg-purple hover:bg-hsg-purpleDark text-white font-bold text-xs shadow-purple-glow transition"
          >
            Browse New Games
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-hsg-border/60">
        {[
          { key: 'overview', label: 'Overview', icon: User },
          { key: 'purchases', label: 'My Orders', icon: Package, count: myOrders.length },
          { key: 'licenses', label: 'Commercial Licenses', icon: Key, count: myLicenses.length },
          { key: 'downloads', label: 'Source Downloads', icon: Download },
          { key: 'support', label: 'Support Tickets', icon: LifeBuoy, count: myTickets.length },
          { key: 'settings', label: 'Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
                isSelected
                  ? 'bg-hsg-purple text-white shadow-purple-glow'
                  : 'bg-hsg-card hover:bg-hsg-cardHover border border-hsg-border text-hsg-muted hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="text-[10px] bg-black/40 px-1.5 py-0.2 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── TAB CONTENT ── */}

      {/* 1. Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-hsg-card border border-hsg-border p-5 rounded-2xl">
              <span className="text-xs text-hsg-muted font-bold block mb-1">Total Purchases</span>
              <span className="text-2xl font-black text-white">{myOrders.length}</span>
              <span className="text-[10px] text-emerald-400 block mt-1">Verified Orders</span>
            </div>
            <div className="bg-hsg-card border border-hsg-border p-5 rounded-2xl">
              <span className="text-xs text-hsg-muted font-bold block mb-1">Active Licenses</span>
              <span className="text-2xl font-black text-hsg-cyan">{myLicenses.filter(l => l.status === 'active').length}</span>
              <span className="text-[10px] text-hsg-muted block mt-1">Commercial deployment ready</span>
            </div>
            <div className="bg-hsg-card border border-hsg-border p-5 rounded-2xl">
              <span className="text-xs text-hsg-muted font-bold block mb-1">Open Tickets</span>
              <span className="text-2xl font-black text-hsg-purple">{myTickets.filter(t => t.status === 'open').length}</span>
              <span className="text-[10px] text-purple-300 block mt-1">Priority integration queue</span>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-hsg-card border border-hsg-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-hsg-border/60">
              <h3 className="font-bold text-sm text-white">Recent Orders</h3>
              <button onClick={() => setActiveTab('purchases')} className="text-xs text-hsg-cyan hover:underline">
                View All
              </button>
            </div>
            {myOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-hsg-surface border border-hsg-border/60 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{order.orderNumber}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      order.status === 'under_review' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-hsg-muted text-[11px] block mt-0.5">
                    {order.items.map(i => i.title).join(', ')}
                  </span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="font-black text-white text-sm">${order.totalAmount}</span>
                  <span className="text-hsg-muted text-[11px]">{order.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. My Orders */}
      {activeTab === 'purchases' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Order History & Payment Verification</h3>
          {myOrders.map((order) => (
            <div key={order.id} className="bg-hsg-card border border-hsg-border rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-hsg-border/60">
                <div>
                  <span className="font-black text-base text-white">{order.orderNumber}</span>
                  <span className="text-xs text-hsg-muted block">Placed on {order.createdAt}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    order.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    order.status === 'under_review' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {order.status === 'paid' ? 'Approved & Paid' : order.status === 'under_review' ? 'Payment Under Review' : order.status}
                  </span>
                  <span className="font-black text-xl text-white">${order.totalAmount}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-hsg-muted uppercase">Purchased Source Packages:</span>
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-hsg-surface border border-hsg-border/40 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-white">{item.title}</h4>
                      <span className="text-[10px] text-hsg-cyan uppercase font-semibold">
                        {item.licenseType === 'extended' ? 'Extended Commercial License' : 'Single Application License'}
                      </span>
                    </div>
                    <span className="font-extrabold text-white">${item.price}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-hsg-muted gap-2">
                <div>
                  <span>Payment Method: <strong className="text-white">{order.paymentMethod}</strong></span>
                  {order.paymentReference && (
                    <span className="ml-3 font-mono">Ref: {order.paymentReference}</span>
                  )}
                </div>
                {order.status === 'paid' && (
                  <button
                    onClick={() => setActiveTab('licenses')}
                    className="text-xs font-bold text-hsg-purple hover:underline"
                  >
                    View Issued License Keys →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Licenses */}
      {activeTab === 'licenses' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Commercial License Keys</h3>
          <p className="text-xs text-hsg-muted">
            Each unique key grants commercial authorization to integrate the source code into your Android production application.
          </p>

          <div className="space-y-3">
            {myLicenses.map((lic) => (
              <div key={lic.id} className="bg-hsg-card border border-hsg-border rounded-2xl p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-white">{lic.productName}</h4>
                    <span className="text-xs text-hsg-muted">Order {lic.orderNumber} • Issued {lic.issuedAt}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full uppercase font-bold shrink-0">
                    {lic.status}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-hsg-surface border border-hsg-border p-3 rounded-xl">
                  <div className="font-mono text-xs text-hsg-cyan font-bold select-all truncate">
                    {lic.licenseKey}
                  </div>
                  <button
                    onClick={() => copyLicense(lic.licenseKey)}
                    className="flex items-center gap-1 text-xs text-hsg-muted hover:text-white px-2.5 py-1 rounded-lg bg-hsg-card border border-hsg-border ml-2 shrink-0"
                  >
                    {copiedKey === lic.licenseKey ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Key</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Downloads */}
      {activeTab === 'downloads' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Private Source Code & Demo Archives</h3>
          <p className="text-xs text-hsg-muted">
            Directly download the complete source code, UI components, sound effects, and pre-compiled demo builds.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-hsg-card border border-hsg-border rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-hsg-purple/20 flex items-center justify-center text-hsg-purple">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Greedy Markhor — Complete Source Code</h4>
                  <span className="text-[11px] text-hsg-muted">v1.2.0 • 100% Kotlin + Compose + SQL</span>
                </div>
              </div>
              <p className="text-xs text-hsg-muted leading-relaxed">
                Contains full Android studio project, all 34 HD visual assets, sound effects, and Supabase database migration.
              </p>
              <a
                href="/downloads/GreedyMarkhor-v1.0-demo.apk"
                download
                className="w-full py-2.5 rounded-xl bg-hsg-purple hover:bg-hsg-purpleDark text-white font-bold text-xs shadow-purple-glow transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Source Archive (.ZIP)</span>
              </a>
            </div>

            <div className="bg-hsg-card border border-hsg-border rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-hsg-cyan/20 flex items-center justify-center text-hsg-cyan">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Greedy Markhor — Standalone Demo APK</h4>
                  <span className="text-[11px] text-hsg-muted">v1.0.0 • 38.6 MB • Pre-seeded 500k Coins</span>
                </div>
              </div>
              <p className="text-xs text-hsg-muted leading-relaxed">
                Directly install on physical Android phones or test in emulators to verify native 60 FPS animation.
              </p>
              <a
                href="/downloads/GreedyMarkhor-v1.0-demo.apk"
                download
                className="w-full py-2.5 rounded-xl bg-hsg-surface hover:bg-white/10 text-hsg-cyan font-bold text-xs border border-hsg-border transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Signed Demo APK (38 MB)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 5. Support Tickets */}
      {activeTab === 'support' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Integration Support & Inquiries</h3>
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="text-xs font-bold text-hsg-cyan hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Ticket</span>
            </button>
          </div>

          <div className="space-y-3">
            {myTickets.map((ticket) => (
              <div key={ticket.id} className="bg-hsg-card border border-hsg-border rounded-2xl p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-hsg-border/40">
                  <div>
                    <span className="text-[11px] font-mono text-hsg-cyan font-bold mr-2">{ticket.ticketNumber}</span>
                    <strong className="text-sm font-bold text-white">{ticket.subject}</strong>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    ticket.status === 'open' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {ticket.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {ticket.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-xl ${
                        m.sender === 'admin'
                          ? 'bg-hsg-purple/10 border border-hsg-purple/30 ml-4'
                          : 'bg-hsg-surface border border-hsg-border mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-hsg-muted mb-1">
                        <strong className={m.sender === 'admin' ? 'text-hsg-purple' : 'text-white'}>
                          {m.senderName}
                        </strong>
                        <span>{m.timestamp}</span>
                      </div>
                      <p className="text-white/90 leading-relaxed">{m.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Settings */}
      {activeTab === 'settings' && (
        <div className="bg-hsg-card border border-hsg-border rounded-2xl p-6 space-y-4 max-w-xl">
          <h3 className="text-lg font-bold text-white">Client Account Settings</h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-hsg-muted block mb-1">Company / Team Name</label>
              <input
                type="text"
                defaultValue={user?.companyName || 'Streaming App Ltd'}
                className="w-full bg-hsg-surface border border-hsg-border text-white text-xs px-3 py-2.5 rounded-xl"
              />
            </div>
            <div>
              <label className="text-hsg-muted block mb-1">Registered Email</label>
              <input
                type="email"
                disabled
                defaultValue={user?.email || userEmail}
                className="w-full bg-hsg-surface border border-hsg-border text-hsg-muted text-xs px-3 py-2.5 rounded-xl"
              />
            </div>
            <button
              onClick={() => alert('Account profile settings saved!')}
              className="px-5 py-2.5 rounded-xl bg-hsg-purple hover:bg-hsg-purpleDark text-white font-bold text-xs"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Modal: New Ticket */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-hsg-card border border-hsg-border rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-hsg-border">
              <h3 className="font-bold text-white text-base">Open Technical Support Ticket</h3>
              <button onClick={() => setShowNewTicketModal(false)} className="text-hsg-muted hover:text-white">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="text-hsg-muted block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Question on Supabase RPC integration"
                  className="w-full bg-hsg-surface border border-hsg-border text-white text-xs px-3 py-2 rounded-xl"
                />
              </div>
              <div>
                <label className="text-hsg-muted block mb-1">Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full bg-hsg-surface border border-hsg-border text-white text-xs px-3 py-2 rounded-xl"
                >
                  <option value="Technical Integration">Technical Integration</option>
                  <option value="Database / Supabase">Database / Supabase</option>
                  <option value="License Key Query">License Key Query</option>
                  <option value="Custom Game Request">Custom Game Request</option>
                </select>
              </div>
              <div>
                <label className="text-hsg-muted block mb-1">Your Message</label>
                <textarea
                  rows={4}
                  required
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Describe your question or integration requirement..."
                  className="w-full bg-hsg-surface border border-hsg-border text-white text-xs p-3 rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 rounded-xl text-hsg-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-hsg-purple hover:bg-hsg-purpleDark text-white font-bold"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
