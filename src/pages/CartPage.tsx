import React, { useState } from 'react';
import { Trash2, ShieldCheck, ArrowRight, Upload, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { useStoreState } from '../services/store';

interface Props {
  navigate: (route: string, param?: string) => void;
}

export const CartPage: React.FC<Props> = ({ navigate }) => {
  const { cart, removeFromCart, clearCart, createOrder, settings, user } = useStoreState();

  const [paymentMethod, setPaymentMethod] = useState<string>('Bank Transfer (Meezan / HBL)');
  const [customerName, setCustomerName] = useState<string>(user?.fullName || '');
  const [customerEmail, setCustomerEmail] = useState<string>(user?.email || '');
  const [customerWhatsapp, setCustomerWhatsapp] = useState<string>('');
  const [paymentReference, setPaymentReference] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [proofFileUploaded, setProofFileUploaded] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFakeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProofFileUploaded(true);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerEmail.trim() || !customerName.trim()) {
      alert('Please provide your name and email address to receive your license key.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const created = createOrder({
        customerName,
        customerEmail,
        customerWhatsapp,
        items: cart,
        totalAmount,
        paymentMethod,
        paymentReference,
        paymentProofUrl: proofFileUploaded ? '/brand/hsgamelogo.png' : undefined,
        notes
      });
      setIsSubmitting(false);
      navigate('customer-dashboard');
    }, 800);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-hsg-card border border-hsg-border flex items-center justify-center mx-auto text-hsg-muted">
          🛒
        </div>
        <h2 className="text-2xl font-black text-white">Your Cart is Empty</h2>
        <p className="text-xs text-hsg-muted max-w-sm mx-auto">
          Explore our catalog of native Android multiplier games and social voice-room suites.
        </p>
        <button
          onClick={() => navigate('games')}
          className="px-6 py-3 rounded-xl bg-hsg-purple hover:bg-hsg-purpleDark text-white font-bold text-xs shadow-purple-glow transition"
        >
          Browse Games Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Review Order & Checkout</h1>
        <p className="text-xs text-hsg-muted mt-1">
          Review your chosen commercial licenses and complete payment verification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-hsg-card border border-hsg-border rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-hsg-border/60">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Selected Products ({cart.length})
              </span>
              <button
                onClick={clearCart}
                className="text-[11px] text-hsg-muted hover:text-red-400 transition"
              >
                Clear Cart
              </button>
            </div>

            <div className="divide-y divide-hsg-border/40">
              {cart.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="py-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-white">{item.title}</h4>
                    <span className="inline-block text-[10px] uppercase font-bold bg-hsg-surface border border-hsg-border text-hsg-cyan px-2 py-0.5 rounded-full">
                      {item.licenseType === 'extended' ? 'Extended Commercial License' : 'Single Application License'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-base text-white">${item.price}</span>
                    <button
                      onClick={() => removeFromCart(item.id, item.licenseType)}
                      className="p-1.5 text-hsg-muted hover:text-red-400 rounded-lg hover:bg-white/5 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div className="pt-4 border-t border-hsg-border flex items-baseline justify-between">
              <span className="text-sm font-bold text-white">Subtotal</span>
              <span className="text-2xl font-black text-white">${totalAmount}</span>
            </div>
          </div>

          {/* Guarantee Banner */}
          <div className="bg-hsg-surface border border-hsg-border rounded-2xl p-4 flex items-start gap-3 text-xs text-hsg-muted">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Commercial Delivery Guarantee:</strong>
              Full un-obfuscated Kotlin source code, Supabase database migration script, and your unique commercial license key will be unlocked immediately in your Customer Dashboard once payment proof is approved.
            </div>
          </div>
        </div>

        {/* Right: Payment Instructions & Checkout Form */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSubmitOrder} className="bg-hsg-card border border-hsg-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Payment & Contact Information</h3>

            {/* Contact Details */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-hsg-muted uppercase tracking-wider block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Haider Ali"
                  className="w-full bg-hsg-surface border border-hsg-border text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-hsg-purple"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-hsg-muted uppercase tracking-wider block mb-1">
                  Email Address (For License & Source Archive Delivery) *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="developer@yourcompany.com"
                  className="w-full bg-hsg-surface border border-hsg-border text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-hsg-purple"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-hsg-muted uppercase tracking-wider block mb-1">
                  WhatsApp / Telegram (Optional, for expedited approval)
                </label>
                <input
                  type="text"
                  value={customerWhatsapp}
                  onChange={(e) => setCustomerWhatsapp(e.target.value)}
                  placeholder="+92 300 0000000"
                  className="w-full bg-hsg-surface border border-hsg-border text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-hsg-purple"
                />
              </div>
            </div>

            {/* Manual Payment Method Selector */}
            <div className="space-y-3 pt-3 border-t border-hsg-border/60">
              <label className="text-[11px] font-bold text-hsg-muted uppercase tracking-wider block">
                Select Official Payment Method *
              </label>

              {[
                'Bank Transfer (Meezan / HBL)',
                'EasyPaisa',
                'JazzCash',
                'USDT / Crypto (TRC-20)'
              ].map((method) => (
                <label
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition ${
                    paymentMethod === method
                      ? 'bg-hsg-purple/10 border-hsg-purple text-white font-bold'
                      : 'bg-hsg-surface border-hsg-border text-hsg-muted hover:text-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymethod"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="accent-hsg-purple"
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>

            {/* Configured Official Payment Details Box */}
            <div className="bg-hsg-surface border border-hsg-border p-4 rounded-2xl text-xs space-y-2">
              <span className="text-[10px] uppercase font-bold text-hsg-cyan block tracking-wider">
                Official Remittance Details:
              </span>

              {paymentMethod.includes('Bank') && (
                settings.paymentBankIban ? (
                  <>
                    <div className="flex justify-between py-1 border-b border-hsg-border/40">
                      <span className="text-hsg-muted">Account Title:</span>
                      <span className="font-bold text-white">{settings.paymentBankTitle}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-hsg-border/40">
                      <span className="text-hsg-muted">Bank Name:</span>
                      <span className="font-bold text-white">{settings.paymentBankName}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-hsg-muted">IBAN:</span>
                      <div className="flex items-center gap-1 font-mono text-white">
                        <span>{settings.paymentBankIban}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(settings.paymentBankIban, 'iban')}
                          className="text-hsg-cyan hover:text-white"
                        >
                          {copiedKey === 'iban' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-[11px] text-hsg-muted italic">
                    Bank coordinates will be provided directly upon order submission or once configured in the administrator dashboard.
                  </p>
                )
              )}

              {paymentMethod === 'EasyPaisa' && (
                settings.paymentEasypaisaNumber ? (
                  <div className="flex items-center justify-between py-1">
                    <span className="text-hsg-muted">EasyPaisa Account:</span>
                    <div className="flex items-center gap-1 font-mono text-white font-bold">
                      <span>{settings.paymentEasypaisaNumber}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(settings.paymentEasypaisaNumber, 'ep')}
                        className="text-hsg-cyan hover:text-white"
                      >
                        {copiedKey === 'ep' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-hsg-muted italic">
                    EasyPaisa account details will be provided directly upon order submission or once configured in the administrator dashboard.
                  </p>
                )
              )}

              {paymentMethod === 'JazzCash' && (
                settings.paymentJazzcashNumber ? (
                  <div className="flex items-center justify-between py-1">
                    <span className="text-hsg-muted">JazzCash Account:</span>
                    <div className="flex items-center gap-1 font-mono text-white font-bold">
                      <span>{settings.paymentJazzcashNumber}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(settings.paymentJazzcashNumber, 'jc')}
                        className="text-hsg-cyan hover:text-white"
                      >
                        {copiedKey === 'jc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-hsg-muted italic">
                    JazzCash account details will be provided directly upon order submission or once configured in the administrator dashboard.
                  </p>
                )
              )}

              {paymentMethod.includes('USDT') && (
                settings.paymentUsdtAddress ? (
                  <div className="flex items-center justify-between py-1">
                    <span className="text-hsg-muted">USDT (TRC20):</span>
                    <div className="flex items-center gap-1 font-mono text-white text-[11px] truncate max-w-[190px]">
                      <span className="truncate">{settings.paymentUsdtAddress}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(settings.paymentUsdtAddress, 'usdt')}
                        className="text-hsg-cyan hover:text-white shrink-0"
                      >
                        {copiedKey === 'usdt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-hsg-muted italic">
                    USDT deposit address will be provided directly upon order submission or once configured in the administrator dashboard.
                  </p>
                )
              )}
            </div>

            {/* Proof Upload & Reference */}
            <div className="space-y-3 pt-3 border-t border-hsg-border/60">
              <div>
                <label className="text-[11px] font-bold text-hsg-muted uppercase tracking-wider block mb-1">
                  Transaction Reference ID / Hash
                </label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="e.g. TRX-9928190 or Hash"
                  className="w-full bg-hsg-surface border border-hsg-border text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-hsg-purple font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-hsg-muted uppercase tracking-wider block mb-1">
                  Upload Payment Screenshot / Receipt Proof
                </label>
                <div className="border border-dashed border-hsg-border hover:border-hsg-purple rounded-xl p-4 text-center cursor-pointer bg-hsg-surface transition relative">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFakeFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-5 h-5 text-hsg-muted mx-auto mb-1.5" />
                  <span className="text-xs text-white font-medium block">
                    {proofFileUploaded ? '✅ Receipt Proof Attached' : 'Click to select payment screenshot'}
                  </span>
                  <span className="text-[10px] text-hsg-muted">PNG, JPG, or PDF up to 10MB</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-hsg-purple to-hsg-purpleDark hover:from-purple-500 hover:to-purple-700 text-white font-extrabold text-sm shadow-purple-glow transition transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting Purchase...' : `Complete Order ($${totalAmount})`}
            </button>

            <p className="text-[10px] text-hsg-muted text-center leading-normal">
              By submitting, you agree to our Commercial Source Code License terms. Orders are reviewed promptly by our administrators.
            </p>
          </form>
        </div>

      </div>

    </div>
  );
};
