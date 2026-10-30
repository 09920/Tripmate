import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Map, Heart, Info, Menu, X, Sparkles, ChevronRight, Layers } from 'lucide-react';
import { getSavedDestinations, getSavedTrips } from '../utils/storage';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const location = useLocation();

  // Keep saved item counter up to date
  useEffect(() => {
    const updateCount = () => {
      const dests = getSavedDestinations();
      const trips = getSavedTrips();
      setSavedCount(dests.length + trips.length);
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    // Listen for custom event if emitted within same tab
    window.addEventListener('tripMeta_saved_changed', updateCount);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('tripMeta_saved_changed', updateCount);
    };
  }, [location.pathname]);

  const navLinks = [
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Plan My Trip', path: '/plan', icon: Map },
    { name: 'Saved', path: '/saved', icon: Heart, badge: savedCount > 0 ? savedCount : null },
    { name: 'How It Works', path: '/about', icon: Info },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Top Glass Navbar */}
      <header className="sticky top-0 z-50 glass-nav transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-emerald-400 p-[1.5px] shadow-glow-brand group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-brand-400 animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight text-white leading-none">
                  TRIP<span className="text-brand-400">META</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">
                  AI Travel Architect
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                      active ? 'text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeNavTab"
                        className="absolute inset-0 bg-gradient-to-r from-brand-600/30 to-emerald-500/20 border border-brand-500/40 rounded-xl"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon size={16} className={active ? 'text-brand-400' : 'text-slate-400'} />
                    <span className="relative z-10">{link.name}</span>
                    {link.badge !== null && link.badge !== undefined && (
                      <span className="relative z-10 px-2 py-0.5 text-xs font-bold bg-brand-500/30 text-brand-300 border border-brand-500/50 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Quick Action */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/plan"
                className="glass-button-primary flex items-center gap-2 text-sm !py-2.5 !px-5"
              >
                <span>Design Itinerary</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl overflow-hidden"
            >
              <div className="px-4 pt-3 pb-6 space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);

                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        active
                          ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 font-semibold'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} className={active ? 'text-brand-400' : 'text-slate-400'} />
                        <span>{link.name}</span>
                      </div>
                      {link.badge !== null && link.badge !== undefined && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-brand-500/30 text-brand-300 border border-brand-500/40 rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}

                <div className="pt-4">
                  <Link
                    to="/plan"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full glass-button-primary flex items-center justify-center gap-2"
                  >
                    <span>Design Custom Itinerary</span>
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Page Body */}
      <main className="flex-grow">{children}</main>

      {/* World-Class Footer */}
      <footer className="relative bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-brand-500/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-slate-800/60">
            {/* Brand Intro */}
            <div className="md:col-span-5 space-y-4">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white font-black text-xl shadow-glow-brand">
                  T
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-white">
                  TRIP<span className="text-brand-400">META</span>
                </span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                Next-generation personalized travel discovery engine. Powered by TF-IDF content filtering, seasonal intelligence, and SQLite persistence for seamless trip curation across India.
              </p>
              <div className="flex items-center gap-2 text-xs text-brand-400 pt-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
                <span>Backend SQLite API v2.0 Operational</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Navigation
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <Link to="/explore" className="hover:text-brand-400 transition-colors">
                    Explore Destinations
                  </Link>
                </li>
                <li>
                  <Link to="/plan" className="hover:text-brand-400 transition-colors">
                    Plan My Trip (Match Engine)
                  </Link>
                </li>
                <li>
                  <Link to="/saved" className="hover:text-brand-400 transition-colors">
                    Saved Itineraries & Bookmarks
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-brand-400 transition-colors">
                    Algorithm & System Architecture
                  </Link>
                </li>
              </ul>
            </div>

            {/* Tech Stack Highlights */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Full-Stack Architecture
              </h4>
              <div className="flex flex-wrap gap-2">
                {['React 19', 'TypeScript', 'Node.js Express', 'SQLite3', 'Tailwind CSS', 'Framer Motion', 'TF-IDF Cosine Match'].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-slate-900 border border-slate-700/60 text-slate-300 rounded-lg text-xs font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-500 pt-2">
                Designed and engineered for ultra-responsive travel curation and production readiness.
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} TripMeta Technologies. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Documentation</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
