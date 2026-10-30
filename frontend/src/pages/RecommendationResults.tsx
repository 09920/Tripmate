import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Star,
  Compass,
  ArrowUpDown,
  Layers,
  ChevronRight
} from 'lucide-react';
import { RecommendationResult, UserPreferences } from '../types';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

const RecommendationResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'match' | 'budget' | 'rating'>('match');

  // Fallback preferences if user accessed directly or refreshed
  const preferences: UserPreferences = useMemo(() => {
    return (
      location.state?.preferences || {
        starting_location: 'Mumbai',
        duration_days: 4,
        travellers_count: 2,
        budget_max: 25000,
        traveller_type: 'Couple',
        transport_preference: 'Any',
        interests: ['Nature', 'Relaxation']
      }
    );
  }, [location.state?.preferences]);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      api.getRecommendations(preferences),
      api.getSavedDestinations()
    ])
      .then(([recs, saved]) => {
        if (!isMounted) return;
        setResults(recs);
        setSavedIds(new Set(saved.savedIds || []));
        setLoading(false);
      })
      .catch(async (err) => {
        console.error('Failed to load recommendations:', err);
        toast.error('Could not compute real-time recommendations. Using fallback catalog.');
        try {
          const fallback = await api.getDestinations();
          if (isMounted && fallback.length > 0) {
            setResults(
              fallback.map((dest) => ({
                ...dest,
                match_score: 85,
                match_reasons: ['Catalog recommendation']
              }))
            );
          }
        } catch {
          // Ignore fallback error
        }
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [preferences]);

  const handleToggleBookmark = async (dest: RecommendationResult, e: React.MouseEvent) => {
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

  const handleBuildItinerary = (dest: RecommendationResult, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/trip-builder', { state: { destinations: [dest] } });
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'budget') return a.estimated_budget_min - b.estimated_budget_min;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.match_score - a.match_score;
  });

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="relative w-20 h-20 mb-6">
          <div className="w-20 h-20 border-4 border-slate-200 border-t-[#0D9488] rounded-full animate-spin" />
          <Sparkles className="absolute inset-0 m-auto text-[#0D9488] w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-[#163047] mb-2">Analyzing Travel Matches</h2>
        <p className="text-[#64748B] text-sm">Evaluating content similarity against your constraints...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Header & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <button
            onClick={() => navigate('/plan', { state: { preset: preferences } })}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0D9488] hover:text-[#0b7a70] transition-colors mb-3"
          >
            <ArrowLeft size={16} />
            <span>Modify Trip Constraints</span>
          </button>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#163047] tracking-tight">
            Personalized Trip Matches
          </h1>
          <p className="text-[#64748B] text-sm mt-1">
            Found {results.length} ranked destinations suitable for your{' '}
            <span className="text-[#163047] font-semibold">{preferences.duration_days}-day</span>{' '}
            {preferences.traveller_type} trip from {preferences.starting_location || 'your origin'}.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 shadow-sm p-2 rounded-2xl">
          <ArrowUpDown size={16} className="text-[#64748B] ml-2" />
          <span className="text-xs text-[#64748B] font-semibold">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-[#163047] text-xs font-bold focus:outline-none pr-3 py-1 cursor-pointer"
          >
            <option value="match" className="bg-white text-[#163047]">Highest Match Score</option>
            <option value="rating" className="bg-white text-[#163047]">User Rating (High to Low)</option>
            <option value="budget" className="bg-white text-[#163047]">Budget (Low to High)</option>
          </select>
        </div>
      </div>

      {/* Constraints Summary Pill Bar */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[#163047] shadow-sm flex items-center gap-1.5 font-medium">
          <Calendar size={13} className="text-[#0D9488]" />
          {preferences.duration_days} Days
        </span>
        <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[#163047] shadow-sm flex items-center gap-1.5 font-medium">
          <Sparkles size={13} className="text-[#0D9488]" />
          ₹{preferences.budget_max.toLocaleString('en-IN')} Max Budget
        </span>
        <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[#163047] shadow-sm flex items-center gap-1.5 font-medium">
          <Compass size={13} className="text-[#0D9488]" />
          {preferences.traveller_type}
        </span>
        {preferences.interests.map((vibe) => (
          <span key={vibe} className="badge-emerald !py-1 !px-2.5">
            {vibe}
          </span>
        ))}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedResults.map((dest, idx) => {
          const isSaved = savedIds.has(dest.id);
          const isTopMatch = idx === 0 && sortBy === 'match';

          return (
            <div
              key={dest.id}
              onClick={() => navigate(`/destination/${dest.id}`)}
              className={`group glass-card-hover rounded-3xl overflow-hidden flex flex-col cursor-pointer relative ${
                isTopMatch ? 'border-[#0D9488] ring-2 ring-[#0D9488]/30 shadow-teal-sm' : ''
              }`}
            >
              {/* Media Header */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#163047]/90 via-[#163047]/20 to-black/30" />

                {/* Match Percentage Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#0D9488]/30 shadow-md flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#0D9488] animate-pulse" />
                  <span className="text-sm font-extrabold text-[#163047]">
                    {dest.match_score}% Match
                  </span>
                </div>

                {/* Bookmark Button */}
                <button
                  type="button"
                  onClick={(e) => handleToggleBookmark(dest, e)}
                  aria-label="Bookmark destination"
                  className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:scale-110 active:scale-95 transition-all shadow-md"
                >
                  <Heart
                    size={18}
                    className={isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}
                  />
                </button>

                {/* Region & Rating Pill */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                  <span className="text-white font-medium flex items-center gap-1 drop-shadow-md">
                    <MapPin size={14} className="text-sky-300" />
                    {dest.state}
                  </span>
                  <span className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[#163047] font-bold flex items-center gap-1 border border-slate-200/60 shadow-sm">
                    <Star size={13} className="fill-amber-400 text-amber-500" />
                    {dest.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-grow justify-between space-y-5 bg-white">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#163047] group-hover:text-[#0D9488] transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-2 mt-2 leading-relaxed">
                    {dest.description}
                  </p>

                  {/* Match Reasons Chips */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(dest.match_reasons || []).slice(0, 3).map((reason, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-slate-200 text-[#163047]"
                      >
                        <CheckCircle2 size={12} className="text-[#0D9488] flex-shrink-0" />
                        <span className="truncate max-w-[200px]">{reason}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Budget & Duration Stats */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#64748B] block text-[10px] uppercase font-bold tracking-wider">Estimated Cost</span>
                    <span className="text-[#163047] font-bold text-sm">
                      ₹{dest.estimated_budget_min.toLocaleString('en-IN')} - ₹{dest.estimated_budget_max.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#64748B] block text-[10px] uppercase font-bold tracking-wider">Suggested Stay</span>
                    <span className="text-[#0D9488] font-bold text-sm">
                      {dest.recommended_duration_min}-{dest.recommended_duration_max} Days
                    </span>
                  </div>
                </div>

                {/* Primary Card CTAs */}
                <div className="pt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleBuildItinerary(dest, e)}
                    className="glass-button-primary text-xs flex items-center justify-center gap-1.5 !py-2.5"
                  >
                    <Layers size={14} />
                    <span>Build Itinerary</span>
                  </button>
                  <Link
                    to={`/destination/${dest.id}`}
                    className="glass-button-secondary text-xs flex items-center justify-center gap-1.5 !py-2.5"
                  >
                    <span>View Guide</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendationResults;
