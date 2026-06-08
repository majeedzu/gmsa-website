'use html';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { db } from '../lib/db';

export default function Footer() {
  const [settings, setSettings] = useState({
    phone: '',
    email: '',
    address: '',
    socialFacebook: '',
    socialTwitter: '',
    socialInstagram: '',
    footerText: ''
  });

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    db.getSettings().then(data => {
      setSettings(data);
    });
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await db.saveSubscriber(email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    } catch (err) {
      console.error('Newsletter error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-brand-black dark:bg-[#020202] text-white border-t border-border-color/10 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary dark:text-secondary border-b border-primary/20 pb-2">
              GMSA HTU
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Ghana Muslim Students' Association (GMSA), Ho Technical University branch. 
              We nurture faith, build academic competence, and foster a sense of brotherhood 
              and leadership among Muslim students.
            </p>
            <div className="flex space-x-3 pt-2">
              {settings.socialFacebook && (
                <a 
                  href={settings.socialFacebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 bg-gray-800 hover:bg-primary dark:hover:bg-secondary dark:hover:text-black rounded-full transition-all text-white hover:scale-105"
                  aria-label="Facebook"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
              {settings.socialTwitter && (
                <a 
                  href={settings.socialTwitter} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 bg-gray-800 hover:bg-primary dark:hover:bg-secondary dark:hover:text-black rounded-full transition-all text-white hover:scale-105"
                  aria-label="Twitter / X"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {settings.socialInstagram && (
                <a 
                  href={settings.socialInstagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 bg-gray-800 hover:bg-primary dark:hover:bg-secondary dark:hover:text-black rounded-full transition-all text-white hover:scale-105"
                  aria-label="Instagram"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-200 border-b border-primary/20 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-primary dark:hover:text-secondary transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary dark:hover:text-secondary transition-colors">About History</Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-primary dark:hover:text-secondary transition-colors">Upcoming Events</Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-primary dark:hover:text-secondary transition-colors">Announcements</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-primary dark:hover:text-secondary transition-colors">Photo Gallery</Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-primary dark:hover:text-secondary transition-colors">Islamic Resources</Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-200 border-b border-primary/20 pb-2">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {settings.address && (
                <li className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gold shrink-0 mt-1" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings.phone && (
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gold shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">{settings.phone}</a>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gold shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">{settings.email}</a>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter Widget */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-200 border-b border-primary/20 pb-2">
              Newsletter
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Subscribe to our weekly circular newsletter to receive reminders, updates, and articles.
            </p>
            {subscribed ? (
              <div className="flex items-center space-x-2 text-primary bg-primary/10 dark:text-secondary dark:bg-secondary/10 px-3 py-2 rounded-md border border-primary/20">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-xs font-semibold">Subscribed successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 text-white placeholder-gray-500 text-sm px-4 py-2 rounded-l-md border border-gray-700 focus:outline-none focus:border-primary w-full"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary dark:bg-secondary dark:text-black font-semibold px-4 rounded-r-md hover:bg-primary/95 transition-colors cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="h-[1px] bg-gray-800/60 my-6" />

        {/* Footer Base */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 space-y-4 sm:space-y-0">
          <p>{settings.footerText || "© 2026 Ghana Muslim Students' Association - Ho Technical University Branch."}</p>
          <div className="flex space-x-4">
            <Link href="/login" className="hover:text-gray-300">Admin Login</Link>
            <span>•</span>
            <span>HTU Volta Region, Ghana</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
