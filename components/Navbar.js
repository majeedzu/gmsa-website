'use html';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, LogIn, LayoutDashboard, LogOut } from 'lucide-react';
import { db, auth } from '../lib/db';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [session, setSession] = useState(null);
  const [settings, setSettings] = useState({ gmsaLogo: '', htuLogo: '' });

  useEffect(() => {
    // 1. Session check
    setSession(auth.getSession());
    
    // 2. Settings check (logos)
    db.getSettings().then(data => {
      setSettings(data);
    });

    // 3. Dark mode init
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Refresh session on focus or storage events
    const handleStorage = () => {
      setSession(auth.getSession());
      db.getSettings().then(data => setSettings(data));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [pathname]);

  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    await auth.logout();
    setSession(null);
    window.location.href = '/';
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Events', href: '/events' },
    { label: 'Announcements', href: '/announcements' },
    { label: 'Resources', href: '/resources' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <nav className="glass sticky top-0 z-50 w-full transition-all duration-300 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            {/* GMSA National Logo */}
            <Link href="/" className="flex items-center space-x-2">
              {settings.gmsaLogo ? (
                <img 
                  src={settings.gmsaLogo} 
                  alt="GMSA National Logo" 
                  className="h-12 w-auto object-contain rounded-md"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-xs shadow-md border border-white/20">
                  GMSA
                </div>
              )}
            </Link>

            <div className="h-8 w-[1px] bg-border-color" />

            {/* HTU Logo */}
            <Link href="/" className="flex items-center">
              {settings.htuLogo ? (
                <img 
                  src={settings.htuLogo} 
                  alt="HTU Logo" 
                  className="h-12 w-auto object-contain rounded-md"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-white font-bold text-xs shadow-md border border-white/20">
                  HTU
                </div>
              )}
            </Link>

            {/* Title */}
            <div className="hidden md:flex flex-col">
              <span className="text-base font-bold tracking-wide text-primary dark:text-secondary-green">GMSA - HTU</span>
              <span className="text-[10px] text-muted tracking-widest font-semibold uppercase">Ho Technical University</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    isActive
                      ? 'text-primary dark:text-secondary bg-primary/10 dark:bg-secondary/10'
                      : 'text-foreground/80 hover:text-primary dark:hover:text-secondary hover:bg-light-gray'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-foreground/80 hover:text-primary dark:hover:text-secondary hover:bg-light-gray rounded-full cursor-pointer transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Admin Session actions */}
            {session ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/admin"
                  className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/95 dark:bg-secondary rounded-md shadow-md hover:scale-[1.02] transition-all"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full cursor-pointer transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-primary hover:text-white border border-primary hover:bg-primary dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black rounded-md transition-all"
              >
                <LogIn className="h-4 w-4" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex items-center space-x-2 lg:hidden">
            {/* Dark Mode Toggle (Mobile) */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-foreground/80 hover:text-primary dark:hover:text-secondary rounded-full cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground/85 hover:text-primary hover:bg-light-gray rounded-md cursor-pointer transition-colors"
              aria-label="Open main menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu panel */}
      {isOpen && (
        <div className="lg:hidden animate-fade-in border-t border-border-color bg-background/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-1 shadow-inner">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 text-base font-semibold rounded-md transition-all ${
                  isActive
                    ? 'text-primary dark:text-secondary bg-primary/10 dark:bg-secondary/10'
                    : 'text-foreground/80 hover:text-primary dark:hover:text-secondary hover:bg-light-gray'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="h-[1px] bg-border-color my-4" />

          {session ? (
            <div className="space-y-2 px-4">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center space-x-2 px-4 py-3 text-base font-semibold text-white bg-primary dark:bg-secondary rounded-md shadow-md"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Admin Dashboard</span>
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center justify-center space-x-2 px-4 py-3 text-base font-semibold text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 rounded-md"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="px-4">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center space-x-2 px-4 py-3 text-base font-semibold text-primary border border-primary dark:border-secondary dark:text-secondary rounded-md hover:bg-primary hover:text-white"
              >
                <LogIn className="h-5 w-5" />
                <span>Admin Login</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
