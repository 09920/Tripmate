import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  MapPin,
  Map,
  Navigation,
  CheckCircle2,
  Bed,
  Utensils,
  Calendar,
  IndianRupee,
  ArrowLeft,
  Star,
  Sparkles,
  Plane,
  Train,
  Car,
  Layers,
  Share2
} from 'lucide-react';
import { Destination } from '../types';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

const DestinationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [dest, setDest] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    Promise.all([
      api.getDestinationById(id),
      api.getSavedDestinations()
    ])
      .then(([destination, saved]) => {
        if (!isMounted) return;
        setDest(destination);
        setIsSaved((saved.savedIds || []).includes(id));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching destination details:', err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const toggleSave = async () => {
    if (!dest) return;
    const nextSavedState = !isSaved;
    setIsSaved(nextSavedState);

    await api.toggleBookmark(dest, !nextSavedState);
    if (nextSavedState) {
      toast.success(`Saved ${dest.name} to your bookmarks!`);
    } else {
      toast.info(`Removed ${dest.name} from bookmarks`);
    }
    window.dispatchEvent(new Event('tripMeta_saved_changed'));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleBuildTrip = () => {
    if (dest) {
      navigate('/trip-builder', { state: { destinations: [dest] } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="relative w-20 h-20 mb-6">
          <div className="w-20 h-20 border-4 border-slate-200 border-t-brand-500 rounded-full animate-spin" />
          <Sparkles className="absolute inset-0 m-auto text-brand-500 w-8 h-8 animate-pulse" />
        </div>
        <p className="text-slate-500 text-sm font-medium">Loading destination intelligence...</p>
      </div>
    );
  }

  if (!dest) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
          <MapPin size={32} />
        </div>
        <h2 className="text-2xl font-bold text-[#163047]">Destination not found</h2>
        <p className="text-slate-500 text-sm max-w-sm">
          The requested destination record could not be found or has been moved.
        </p>
        <button
          onClick={() => navigate('/explore')}
          className="glass-button-primary text-xs !py-2.5"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 space-y-12">
      {/* Cinematic Hero Header */}
      <div className="relative h-[65vh] min-h-[480px] w-full overflow-hidden">
        <img
          src={dest.image}
          alt={dest.name}
          className="w-full h-full object-cover filter brightness-[0.8]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#163047]/90 via-[#163047]/40 to-black/30" />

        {/* Back and Utility Actions */}
        <div className="absolute top-6 left-4 sm:left-8 right-4 sm:right-8 flex justify-between items-center z-10">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 bg-white/90 hover:bg-white backdrop-blur-md border border-slate-200 rounded-2xl flex items-center justify-center text-[#163047] transition-all shadow-md active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="w-11 h-11 bg-white/90 hover:bg-white backdrop-blur-md border border-slate-200 rounded-2xl flex items-center justify-center text-[#163047] transition-all shadow-md active:scale-95"
              aria-label="Share destination"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={toggleSave}
              className="w-11 h-11 bg-white/90 hover:bg-white backdrop-blur-md border border-slate-200 rounded-2xl flex items-center justify-center text-[#163047] transition-all shadow-md active:scale-95"
              aria-label="Save to bookmarks"
            >
              <Heart
                size={18}
                className={isSaved ? 'fill-red-500 text-red-500' : 'text-slate-600'}
              />
            </button>
          </div>
        </div>

        {/* Destination Hero Caption */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-7xl mx-auto z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {(dest.categories || []).map((cat) => (
                  <span key={cat} className="badge-emerald !py-1 !px-3 font-bold text-xs uppercase tracking-wider">
                    {cat}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-sm">
                {dest.name}
              </h1>
              <p className="text-base sm:text-lg text-slate-200 flex items-center gap-3">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin size={18} className="text-brand-300" /> {dest.state}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <Star size={16} className="fill-amber-400 text-amber-400" /> {dest.rating.toFixed(1)} / 5.0
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleBuildTrip}
                className="glass-button-primary flex items-center gap-2 text-sm !py-3.5 !px-7 shadow-teal"
              >
                <Layers size={18} />
                <span>Build Itinerary</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Deep Guide */}
        <div className="lg:col-span-2 space-y-12">
          {/* About */}
          <section className="glass-card p-6 sm:p-8 space-y-4 bg-white border border-slate-200 shadow-card">
            <h2 className="text-xl font-bold text-[#163047] flex items-center gap-2">
              <Sparkles size={20} className="text-brand-500" />
              <span>About {dest.name}</span>
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              {dest.description}
            </p>
          </section>

          {/* Things to Do */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[#163047]">Curated Activities & Highlights</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {(dest.things_to_do || []).map((thing, i) => (
                <div
                  key={i}
                  className="glass-card p-4 rounded-xl flex items-start gap-3 bg-white border border-slate-200 shadow-xs"
                >
                  <CheckCircle2 className="text-brand-500 flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-sm font-semibold text-[#163047]">{thing}</span>
                </div>
              ))}
            </div>
          </section>

          {/* How to Reach */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[#163047] flex items-center gap-2">
              <Navigation size={20} className="text-sky-500" />
              <span>How to Reach</span>
            </h2>
            <div className="glass-card p-6 space-y-5 bg-white border border-slate-200 shadow-card">
              {(dest.how_to_reach || []).map((route, i) => {
                const isAir = route.mode.toLowerCase().includes('flight') || route.mode.toLowerCase().includes('air');
                const isTrain = route.mode.toLowerCase().includes('train') || route.mode.toLowerCase().includes('rail');
                const Icon = isAir ? Plane : isTrain ? Train : Car;

                return (
                  <div
                    key={i}
                    className={`flex gap-4 ${
                      i !== 0 ? 'pt-5 border-t border-slate-100' : ''
                    }`}
                  >
                    <div className="w-11 h-11 bg-brand-50 border border-brand-100 text-brand-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#163047] mb-0.5">By {route.mode}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {route.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Nearby Places to Visit */}
          {(dest.nearby_places || []).length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#163047]">Nearby Attractions</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {dest.nearby_places.map((place, i) => (
                  <div
                    key={i}
                    className="group glass-card rounded-2xl overflow-hidden flex bg-white border border-slate-200 shadow-card"
                  >
                    <div className="w-1/3 h-28 relative overflow-hidden">
                      <img
                        src={place.image}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 w-2/3 flex flex-col justify-center">
                      <h4 className="font-bold text-sm text-[#163047]">{place.name}</h4>
                      <p className="text-xs text-brand-600 font-medium mt-0.5">
                        {place.category} • {place.distance_km} km away
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar: Key Metrics & Stays */}
        <div className="space-y-6">
          {/* Quick Metrics Card */}
          <div className="glass-card p-6 space-y-6 bg-white border border-brand-200 shadow-card">
            <h3 className="font-bold text-lg text-[#163047] border-b border-slate-100 pb-3">
              Trip Overview
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <IndianRupee size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Estimated Budget Range
                  </p>
                  <p className="font-extrabold text-[#163047] text-base mt-0.5">
                    ₹{dest.estimated_budget_min.toLocaleString('en-IN')} - ₹{dest.estimated_budget_max.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-slate-500">Total per traveler</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-sky-50 border border-sky-100 text-sky-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Recommended Duration
                  </p>
                  <p className="font-extrabold text-[#163047] text-base mt-0.5">
                    {dest.recommended_duration_min} to {dest.recommended_duration_max} Days
                  </p>
                  <p className="text-[11px] text-slate-500">Optimal pace for highlights</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-amber-50 border border-amber-100 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Map size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Prime Season to Visit
                  </p>
                  <p className="font-extrabold text-[#163047] text-base mt-0.5">
                    {(dest.best_season || []).join(', ')}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleBuildTrip}
              className="w-full glass-button-primary flex items-center justify-center gap-2 text-sm !py-3.5 mt-2"
            >
              <Layers size={16} />
              <span>Launch Itinerary Builder</span>
            </button>
          </div>

          {/* Where to Stay */}
          <div className="glass-card p-6 space-y-4 bg-white border border-slate-200 shadow-card">
            <h3 className="font-bold text-base text-[#163047] flex items-center gap-2">
              <Bed className="text-brand-500" size={18} />
              <span>Recommended Accommodations</span>
            </h3>
            <div className="space-y-3.5">
              {(dest.stay_options || []).map((stay, i) => (
                <div key={i} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0 space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-[#163047]">{stay.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {stay.budget_level}
                    </span>
                  </div>
                  <p className="text-xs text-brand-600 font-medium">{stay.type}</p>
                  <p className="text-xs text-slate-500 leading-snug">{stay.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Where to Eat */}
          <div className="glass-card p-6 space-y-4 bg-white border border-slate-200 shadow-card">
            <h3 className="font-bold text-base text-[#163047] flex items-center gap-2">
              <Utensils className="text-amber-500" size={18} />
              <span>Culinary Experiences</span>
            </h3>
            <div className="space-y-3.5">
              {(dest.restaurant_options || []).map((rest, i) => (
                <div key={i} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0 space-y-1">
                  <h4 className="font-bold text-sm text-[#163047]">{rest.name}</h4>
                  <p className="text-xs text-amber-600 font-medium">{rest.cuisine}</p>
                  <p className="text-xs text-slate-500 leading-snug">{rest.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;
