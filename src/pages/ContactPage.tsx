import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { useStoreState } from '../services/store';

export const ContactPage: React.FC = () => {
  const { settings } = useStoreState();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Get in Touch With Our Engineering Team
        </h1>
        <p className="text-xs sm:text-sm text-hsg-muted">
          Have questions regarding Android architecture, custom RPC migrations, or extended agency licensing? Reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-hsg-card border border-hsg-border rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white">Direct Communication</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-hsg-surface border border-hsg-border/60">
                <Mail className="w-5 h-5 text-hsg-purple shrink-0 mt-0.5" />
                <div>
                  <span className="text-hsg-muted block text-[10px] uppercase font-bold">Official Email</span>
                  {settings.contactEmail ? (
                    <a href={`mailto:${settings.contactEmail}`} className="text-white font-mono hover:text-hsg-cyan transition">
                      {settings.contactEmail}
                    </a>
                  ) : (
                    <span className="text-hsg-muted italic">Pending direct configuration (Submit form below)</span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-hsg-surface border border-hsg-border/60">
                <MessageSquare className="w-5 h-5 text-hsg-cyan shrink-0 mt-0.5" />
                <div>
                  <span className="text-hsg-muted block text-[10px] uppercase font-bold">Direct Messaging / WhatsApp</span>
                  <span className="text-white font-medium">
                    {settings.contactWhatsapp || 'Available upon inquiry submission'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-hsg-border/60 text-xs text-hsg-muted space-y-2">
              <span className="text-white font-bold block">Business Hours:</span>
              <p>Monday – Saturday: 9:00 AM – 7:00 PM (PKT / UTC+5)</p>
              <p>Support inquiries receive responses within 2 to 4 business hours.</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-hsg-card border border-hsg-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Send an Official Inquiry</h3>

            {submitted && (
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thank you! Your message has been received. An engineer will follow up shortly.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-hsg-muted block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tariq Khan"
                  className="w-full bg-hsg-surface border border-hsg-border text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-hsg-purple"
                />
              </div>

              <div>
                <label className="text-hsg-muted block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-hsg-surface border border-hsg-border text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-hsg-purple"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-hsg-muted block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Custom game integration inquiry"
                  className="w-full bg-hsg-surface border border-hsg-border text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-hsg-purple"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-hsg-muted block mb-1">Message *</label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your voice-chat application, platform scale, or technical requirements..."
                  className="w-full bg-hsg-surface border border-hsg-border text-white text-xs p-3 rounded-xl focus:outline-none focus:border-hsg-purple"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-hsg-purple hover:bg-hsg-purpleDark text-white font-extrabold text-xs shadow-purple-glow transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
