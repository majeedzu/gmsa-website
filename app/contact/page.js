'use html';
'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '../../lib/db';

export default function Contact() {
  const [settings, setSettings] = useState({
    phone: '+233 24 123 4567',
    email: 'info@gmsahtu.com',
    address: 'Ho Technical University Campus, GMSA Secretariat, Ho, Volta Region, Ghana'
  });

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    db.getSettings().then(data => {
      if (data) {
        setSettings({
          phone: data.phone || settings.phone,
          email: data.email || settings.email,
          address: data.address || settings.address
        });
      }
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await db.saveContact(form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setError('An error occurred while sending your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-primary dark:text-secondary uppercase tracking-widest bg-primary/10 dark:bg-secondary/10 px-3 py-1 rounded-full">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Contact GMSA-HTU
          </h1>
          <p className="text-muted text-sm sm:text-base">
            Have questions, feedback, or need spiritual counseling? Reach out to the executive board.
          </p>
          <div className="h-1 w-20 bg-gold rounded mx-auto" />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Info & Maps (Takes 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Info Cards */}
            <div className="bg-card-bg border border-border-color rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-foreground">Contact Channels</h2>
              <div className="h-0.5 w-10 bg-primary dark:bg-secondary rounded" />
              
              <div className="space-y-4 text-sm sm:text-base">
                <div className="flex items-start space-x-3.5 text-foreground/85">
                  <span className="p-2.5 bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary rounded-lg mt-0.5">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-xs text-muted uppercase tracking-wider mb-1">Secretariat Office</h3>
                    <p className="leading-relaxed text-sm">{settings.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 text-foreground/85">
                  <span className="p-2.5 bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary rounded-lg mt-0.5">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-xs text-muted uppercase tracking-wider mb-1">Telephone Contacts</h3>
                    <p className="text-sm">
                      <a href={`tel:${settings.phone}`} className="hover:text-primary transition-colors font-medium">{settings.phone}</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 text-foreground/85">
                  <span className="p-2.5 bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary rounded-lg mt-0.5">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-xs text-muted uppercase tracking-wider mb-1">Email Coordinates</h3>
                    <p className="text-sm">
                      <a href={`mailto:${settings.email}`} className="hover:text-primary transition-colors font-medium">{settings.email}</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="bg-card-bg border border-border-color rounded-2xl p-3 shadow-sm overflow-hidden h-72 relative">
              <iframe
                title="Ho Technical University Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3968.125553140516!2d0.4645089758778401!3d6.589136122646279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b4fb553a1b32d%3A0x89e2483863484f93!2sHo%20Technical%20University!5e0!3m2!1sen!2sgh!4v1717932900000!5m2!1sen!2sgh"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Right: Contact Form (Takes 7 cols) */}
          <div className="lg:col-span-7 bg-card-bg border border-border-color rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-foreground">Write to the Secretariat</h2>
            <div className="h-0.5 w-10 bg-primary dark:bg-secondary rounded" />

            {/* Notifications */}
            {success && (
              <div className="flex items-start space-x-2 text-[#0F7A35] bg-green-50 dark:bg-green-950/20 dark:text-green-400 p-4 rounded-xl border border-green-200/50">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="text-sm font-medium">
                  Thank you! Your message has been sent successfully. We will get back to you shortly.
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start space-x-2 text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 p-4 rounded-xl border border-red-200/50">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="text-sm font-medium">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-xs font-bold text-foreground/80 uppercase">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="bg-light-gray dark:bg-muted-bg text-foreground placeholder-zinc-500 text-sm px-4 py-2.5 rounded-xl border border-transparent focus:outline-none focus:border-primary w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-bold text-foreground/80 uppercase">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="bg-light-gray dark:bg-muted-bg text-foreground placeholder-zinc-500 text-sm px-4 py-2.5 rounded-xl border border-transparent focus:outline-none focus:border-primary w-full"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="subject" className="text-xs font-bold text-foreground/80 uppercase">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  className="bg-light-gray dark:bg-muted-bg text-foreground placeholder-zinc-500 text-sm px-4 py-2.5 rounded-xl border border-transparent focus:outline-none focus:border-primary w-full"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="text-xs font-bold text-foreground/80 uppercase">Message Text</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  className="bg-light-gray dark:bg-muted-bg text-foreground placeholder-zinc-500 text-sm px-4 py-2.5 rounded-xl border border-transparent focus:outline-none focus:border-primary w-full"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-primary dark:bg-secondary text-white dark:text-black font-bold rounded-xl shadow hover:scale-[1.01] active:scale-[0.99] hover:bg-primary/95 dark:hover:bg-secondary/95 transition-all cursor-pointer"
              >
                {loading ? (
                  <span>Sending message...</span>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
