import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Filter,
  X,
  Star,
  Heart,
  Calendar,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Compass,
  Layers
} from 'lucide-react';
import { Destination } from '../types';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

const Explore: React.FC = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const queryParams = new URLSearchParams(search);
  const initialCategory = queryParams.get('category') || '';

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedState, setSelectedState] = useState('');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = [
    'Nature',
    'Adventure',
    'Historical',
    'Mountains',
    'Beaches',
    'Waterfalls',
    'Camping'
  ];

  const states = useMemo(() => {
    const unique = Array.from(new Set(destinations.map((d) => d.state))).filter(Boolean);
    return unique.length > 0
      ? unique.sort()
      : [
          'Andaman and Nicobar Islands',
          'Arunachal Pradesh',
          'Goa',
          'Himachal Pradesh',
          'Karnataka',
          'Kerala',
          'Madhya Pradesh',
          'Maharashtra',
          'Meghalaya',
          'Rajasthan',
          'Tamil Nadu',
          'Uttarakhand',
          'West Bengal'
        ];
  }, [destinations]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      api.getDestinations(),
      api.getSavedDestinations()
    ])
      .then(([data, saved]) => {
        if (!isMounted) return;
        setDestinations(data);
        setSavedIds(new Set(saved.savedIds || []));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching destinations:', err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update selectedCategory if query param changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const handleToggleBookmark = async (dest: Destination, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isSaved = savedIds.has(dest.id);
    const newSaved = new Set(savedIds);

    if (isSaved) {
      newSaved.delete(dest.id);
      setSavedIds(newSaved);
      await api.toggleBookmark(dest, true);
      toast.info(`Removed ${dest.name} from saved items`);
    } else {
      newSaved.add(dest.id);
      setSavedIds(newSaved);
      await api.toggleBookmark(dest, false);
      toast.success(`Saved ${dest.name} to bookmarks!`);
    }
    window.dispatchEvent(new Event('tripMeta_saved_changed'));
  };

  const handleBuildTrip = (dest: Destination, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/trip-builder', { state: { destinations: [dest] } });
  };

  const filteredDestinations = destinations.filter((dest) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      dest.name.toLowerCase().includes(q) ||
      dest.state.toLowerCase().includes(q) ||
      dest.description.toLowerCase().includes(q);

    const matchesCategory = selectedCategory
      ? (dest.categories || []).includes(selectedCategory)
      : true;

    const matchesState = selectedState ? dest.state === selectedState : true;

    return matchesSearch && matchesCategory && matchesState;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedState('');
  };

  const hasActiveFilters = Boolean(selectedCategory || selectedState || searchQuery);

  return (
    <div className="min-h-screen pb-24 space-y-10">
      {/* Search Header Banner */}
      <section className="relative py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="badge-emerald mb-2">Curated India Atlas</span>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Explore Destinations
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-1">
                Browse our structured database of verified travel sanctuaries across India.
              </p>
            </div>

            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden glass-button-secondary text-sm flex items-center gap-2 self-start"
            >
              <SlidersHorizontal size={16} />
              <span>{mobileFilterOpen ? 'Hide Filters' : 'Filter Places'}</span>
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="relative max-w-3xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-brand-400" size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-12 pr-12 text-base sm:text-lg !py-3.5"
              placeholder="Search by destination name, state, or keywords..."
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside
          className={`w-full md:w-64 flex-shrink-0 space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="glass-card p-5 space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                <Filter size={16} className="text-brand-400" /> Filters
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Experience Category
              </h4>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    !selectedCategory
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  All Categories ({destinations.length})
                </button>
                {categories.map((cat) => {
                  const count = destinations.filter((d) => (d.categories || []).includes(cat)).length;
                  const active = selectedCategory === cat;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        active
                          ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="text-[10px] text-slate-500">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* State Filter */}
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Indian State
              </h4>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => setSelectedState('')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    !selectedState
                      ? 'text-brand-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All States
                </button>
                {states.map((st) => {
                  const active = selectedState === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedState(st)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all ${
                        active
                          ? 'text-brand-300 font-bold bg-brand-500/10'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Destination Listing Grid */}
        <main className="flex-grow space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
            <span>
              Showing <strong className="text-white">{filteredDestinations.length}</strong> of{' '}
              {destinations.length} destinations
            </span>
            {hasActiveFilters && (
              <span className="text-brand-400">Filters applied</span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-card h-80 skeleton rounded-3xl" />
              ))}
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="glass-card p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Compass size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">No destinations found</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                We couldn't find any places matching your current filter criteria.
              </p>
              <button onClick={clearFilters} className="glass-button-primary text-xs !py-2.5">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((dest) => {
                const isSaved = savedIds.has(dest.id);

                return (
                  <div
                    key={dest.id}
                    onClick={() => navigate(`/destination/${dest.id}`)}
                    className="group glass-card-hover rounded-3xl overflow-hidden flex flex-col cursor-pointer"
                  >
                    {/* Image Header */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

                      {/* Rating */}
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-amber-300 flex items-center gap-1 border border-white/10 shadow-sm">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span>{dest.rating.toFixed(1)}</span>
                      </div>

                      {/* Bookmark Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleBookmark(dest, e)}
                        className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-md"
                      >
                        <Heart
                          size={16}
                          className={isSaved ? 'fill-red-500 text-red-500' : 'text-slate-300'}
                        />
                      </button>

                      {/* State Location Tag */}
                      <div className="absolute bottom-3 left-3 text-xs text-slate-200 font-medium flex items-center gap-1 drop-shadow-md">
                        <MapPin size={13} className="text-brand-400" />
                        <span>{dest.state}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                      <div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {(dest.categories || []).slice(0, 2).map((c) => (
                            <span key={c} className="badge-emerald !text-[10px] !py-0.5 !px-2">
                              {c}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors">
                          {dest.name}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {dest.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Est. Budget</span>
                          <span className="font-semibold text-slate-200">
                            ₹{dest.estimated_budget_min.toLocaleString('en-IN')} - ₹{dest.estimated_budget_max.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                          <span className="font-semibold text-brand-400">
                            {dest.recommended_duration_min}-{dest.recommended_duration_max} Days
                          </span>
                        </div>
                      </div>

                      <div className="pt-1 flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleBuildTrip(dest, e)}
                          className="w-full glass-button-primary text-xs flex items-center justify-center gap-1.5 !py-2"
                        >
                          <Layers size={13} />
                          <span>Build Itinerary</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Explore;
