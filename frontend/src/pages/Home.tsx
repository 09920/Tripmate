import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Users,
  Wallet,
  ArrowRight,
  Sparkles,
  Heart,
  Star,
  Compass,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { Destination } from '../types';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [popularDestinations, setPopularDestinations] = useState<Destination[]>([]);
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Quick Match state
  const [quickDuration, setQuickDuration] = useState(4);
  const [quickTravellerType, setQuickTravellerType] = useState('Couple');
  const [quickBudget, setQuickBudget] = useState(25000);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      api.getDestinations(),
      api.getSavedDestinations()
    ])
      .then(([dests, saved]) => {
        if (!isMounted) return;
        setAllDestinations(dests);
        // Top 8 rated destinations (highlighting popular flagship spots)
        const sorted = [...dests].sort((a, b) => b.rating - a.rating).slice(0, 8);
        setPopularDestinations(sorted);
        setSavedIds(new Set(saved.savedIds || []));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading home data:', err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleBookmark = async (dest: Destination, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isSaved = savedIds.has(dest.id);
    const newSaved = new Set(savedIds);

    if (isSaved) {
      newSaved.delete(dest.id);
      setSavedIds(newSaved);
      await api.toggleBookmark(dest, true);
      toast.info(`Removed ${dest.name} from saved bookmarks`);
    } else {
      newSaved.add(dest.id);
      setSavedIds(newSaved);
      await api.toggleBookmark(dest, false);
      toast.success(`Saved ${dest.name} to bookmarks!`);
    }
    window.dispatchEvent(new Event('tripMeta_saved_changed'));
  };

  const handleQuickMatch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/plan', {
      state: {
        preset: {
          duration_days: quickDuration,
          traveller_type: quickTravellerType,
          budget_max: quickBudget
        }
      }
    });
  };

  const curatedMoods = [
    { name: 'Nature', image: '/images/Meghalaya.jpg', query: 'Nature' },
    { name: 'Adventure', image: '/images/Rishikesh.jpeg', query: 'Adventure' },
    { name: 'Historical', image: '/images/Hampi.jpg', query: 'Historical' },
    { name: 'Mountains', image: '/images/Manali.jpg', query: 'Mountains' },
    { name: 'Beaches', image: '/images/Goa.jpeg', query: 'Beaches' },
    { name: 'Waterfalls', image: '/images/Mahabaleshwar.jpg', query: 'Waterfalls' },
    { name: 'Camping', image: '/images/Chopta.jpg', query: 'Camping' },
  ];

  return (
    <div className="w-full space-y-24 pb-24 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Ambient Hero Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-brand-500/10 via-sky-400/10 to-brand-200/20 blur-[130px] rounded-full pointer-events-none" />

        {/* Hero Background Texture */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/2444403/pexels-photo-2444403.jpeg"
            alt="Scenic Travel in India"
            className="w-full h-full object-cover opacity-15 filter saturate-120"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC]/50 via-[#F8FAFC]/85 to-[#F8FAFC]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Badge Tag */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-200 text-brand-700 text-xs sm:text-sm font-semibold shadow-sm backdrop-blur-xl"
          >
            <Sparkles size={16} className="text-brand-500" />
            <span>AI-Driven Match Engine & Itinerary Architect</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#163047] tracking-tight leading-[1.1]"
          >
            Don't just find a destination.<br />
            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-sky-500 bg-clip-text text-transparent">
              Discover the right trip.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Stop browsing generic listicles. TripMeta scores destinations against your exact group dynamics, real budget limits, and seasonal weather with mathematical precision.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2"
          >
            <button
              onClick={() => navigate('/plan')}
              className="glass-button-primary flex items-center justify-center gap-3 text-base !py-4 !px-8 w-full sm:w-auto shadow-teal"
            >
              <Sparkles size={20} />
              <span>Match My Ideal Trip</span>
              <ArrowRight size={18} />
            </button>
            <Link
              to="/explore"
              className="glass-button-secondary flex items-center justify-center gap-2 text-base !py-4 !px-8 w-full sm:w-auto"
            >
              <Compass size={18} />
              <span>Explore All Destinations</span>
            </Link>
          </motion.div>

          {/* Quick Match Interactive Glass Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 max-w-4xl mx-auto"
          >
            <form
              onSubmit={handleQuickMatch}
              className="glass-card p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center text-left bg-white shadow-card border border-slate-200"
            >
              {/* Duration Field */}
              <div className="space-y-1 sm:border-r border-slate-200 sm:pr-4">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={14} className="text-brand-500" />
                  Duration
                </label>
                <select
                  value={quickDuration}
                  onChange={(e) => setQuickDuration(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 text-[#163047] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 font-medium"
                >
                  <option value={2}>Weekend (2 Days)</option>
                  <option value={4}>Getaway (4 Days)</option>
                  <option value={7}>Week Long (7 Days)</option>
                  <option value={10}>Grand Tour (10+ Days)</option>
                </select>
              </div>

              {/* Group Type Field */}
              <div className="space-y-1 sm:border-r border-slate-200 sm:pr-4">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Users size={14} className="text-brand-500" />
                  Travel Crew
                </label>
                <select
                  value={quickTravellerType}
                  onChange={(e) => setQuickTravellerType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-[#163047] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 font-medium"
                >
                  <option value="Solo">Solo Traveler</option>
                  <option value="Couple">Couple / Duo</option>
                  <option value="Friends">Friends Trip</option>
                  <option value="Family">Family Holiday</option>
                  <option value="College Group">College Buddies</option>
                </select>
              </div>

              {/* Budget Field */}
              <div className="space-y-1 sm:border-r border-slate-200 sm:pr-4">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Wallet size={14} className="text-brand-500" />
                  Max Budget
                </label>
                <select
                  value={quickBudget}
                  onChange={(e) => setQuickBudget(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 text-[#163047] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 font-medium"
                >
                  <option value={10000}>Budget (Up to ₹10k)</option>
                  <option value={25000}>Standard (Up to ₹25k)</option>
                  <option value={50000}>Comfort (Up to ₹50k)</option>
                  <option value={100000}>Luxury (₹1 Lakh+)</option>
                </select>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full glass-button-primary flex items-center justify-center gap-2 !py-3 text-sm"
                >
                  <Sparkles size={16} />
                  <span>Quick Match</span>
                </button>
              </div>
            </form>
          </motion.div>

          {/* Social Proof Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto border-t border-slate-200"
          >
            <div>
              <p className="text-2xl sm:text-3xl font-black text-brand-600">100%</p>
              <p className="text-xs text-slate-500 font-medium">Personalized Matches</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-brand-600">35+</p>
              <p className="text-xs text-slate-500 font-medium">Indian Top Destinations</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-brand-600">TF-IDF</p>
              <p className="text-xs text-slate-500 font-medium">Cosine ML Scoring</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-brand-600">SQLite</p>
              <p className="text-xs text-slate-500 font-medium">Live Persistence</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Curated Experiences by Vibe */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="badge-emerald mb-3">Vibe Explorer</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#163047] tracking-tight">
              Curated Travel Moods
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              Select your preferred vibe to filter our curated intelligence repository.
            </p>
          </div>
          <Link
            to="/explore"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1.5 transition-colors"
          >
            <span>Browse all categories</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
          {curatedMoods.map((mood) => {
            const count = allDestinations.filter((d) => (d.categories || []).includes(mood.query)).length;
            return (
              <Link
                key={mood.name}
                to={`/explore?category=${mood.query}`}
                className="group relative h-48 sm:h-60 rounded-2xl overflow-hidden glass-card-hover border border-slate-200 shadow-sm"
              >
                <img
                  src={mood.image}
                  alt={mood.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#163047]/90 via-[#163047]/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-base font-bold text-white group-hover:text-brand-200 transition-colors">
                    {mood.name}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-200">
                    {count > 0 ? `${count} places` : 'Explore'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trending Highest-Rated Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="badge-accent mb-3">Highly Rated</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#163047] tracking-tight">
              Top Rated Highlights
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              Traveler-adored spots with proven reviews and stellar ratings.
            </p>
          </div>
          <Link
            to="/explore"
            className="glass-button-secondary text-sm flex items-center gap-2 !py-2.5 !px-4"
          >
            <span>View All Places</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card h-80 skeleton rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((dest) => {
              const isSaved = savedIds.has(dest.id);

              return (
                <div
                  key={dest.id}
                  onClick={() => navigate(`/destination/${dest.id}`)}
                  className="group glass-card-hover rounded-2xl overflow-hidden flex flex-col cursor-pointer bg-white border border-slate-200 shadow-card"
                >
                  {/* Image Container */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#163047]/70 via-transparent to-black/10" />

                    {/* Rating Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-amber-700 flex items-center gap-1 border border-slate-200 shadow-sm">
                      <Star size={13} className="fill-amber-500 text-amber-500" />
                      <span>{dest.rating.toFixed(1)}</span>
                    </div>

                    {/* Bookmark Heart Button */}
                    <button
                      onClick={(e) => handleToggleBookmark(dest, e)}
                      aria-label="Save destination"
                      className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center border border-slate-200 text-slate-700 hover:scale-110 active:scale-95 transition-all shadow-sm"
                    >
                      <Heart
                        size={17}
                        className={isSaved ? 'fill-red-500 text-red-500' : 'text-slate-400'}
                      />
                    </button>

                    {/* State Tag */}
                    <div className="absolute bottom-3 left-3 text-xs text-white font-medium flex items-center gap-1 drop-shadow-md">
                      <MapPin size={13} className="text-brand-300" />
                      <span>{dest.state}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#163047] group-hover:text-brand-600 transition-colors">
                        {dest.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {dest.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Est. Budget</span>
                        <span className="font-semibold text-[#163047]">
                          ₹{dest.estimated_budget_min.toLocaleString('en-IN')} - ₹{dest.estimated_budget_max.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                        <span className="font-semibold text-brand-600">
                          {dest.recommended_duration_min}-{dest.recommended_duration_max} Days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Feature Showcase: Why TripMeta */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 sm:p-12 relative overflow-hidden border border-brand-200 bg-gradient-to-br from-white via-white to-brand-50/50 shadow-card">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="badge-emerald">Architecture Innovation</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#163047] tracking-tight">
              Built for travelers who value time and precision.
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Standard booking engines show you where you *can* go. TripMeta calculates where you *should* go, utilizing vector cosine similarity over rich destination parameters.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mt-10 relative z-10">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-base font-bold text-[#163047]">TF-IDF Vector Matching</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Matches your specific activity interests and travel style against deep semantic features rather than shallow tags.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-[#163047]">Budget Penalization Rules</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hard filters combined with soft score penalties prevent unrealistic itinerary proposals outside your budget range.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center">
                <Calendar size={20} />
              </div>
              <h3 className="text-base font-bold text-[#163047]">Seasonal Weather Awareness</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Considers the current calendar month to prioritize hill stations in summer and coastal paradises in winter.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
