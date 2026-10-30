import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Trash2,
  Map,
  Compass,
  ArrowRight,
  Layers,
  Sparkles,
  Clock
} from 'lucide-react';
import { Destination, TripPlan } from '../types';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

const Saved: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'destinations' | 'trips'>('destinations');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [trips, setTrips] = useState<TripPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSavedData = async () => {
    try {
      const [savedDests, savedTrips] = await Promise.all([
        api.getSavedDestinations(),
        api.getTrips()
      ]);
      setDestinations(savedDests.destinations || []);
      setTrips(savedTrips || []);
    } catch (err) {
      console.error('Error fetching saved data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedData();
    window.addEventListener('tripMeta_saved_changed', loadSavedData);
    return () => {
      window.removeEventListener('tripMeta_saved_changed', loadSavedData);
    };
  }, []);

  const handleRemoveDestination = async (id: string, name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const dest = destinations.find((d) => d.id === id);
    if (!dest) return;

    await api.toggleBookmark(dest, true);
    setDestinations((prev) => prev.filter((d) => d.id !== id));
    toast.info(`Removed ${name} from saved items`);
    window.dispatchEvent(new Event('tripMeta_saved_changed'));
  };

  const handleDeleteTrip = async (id: string, name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    await api.deleteTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
    toast.info(`Deleted itinerary "${name}"`);
    window.dispatchEvent(new Event('tripMeta_saved_changed'));
  };

  const handleViewTrip = (trip: TripPlan) => {
    navigate('/trip-builder', {
      state: {
        destinations: trip.destinations,
        existingTrip: trip
      }
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <span className="badge-emerald mb-2">My Saved Collections</span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Saved Destinations & Itineraries
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Your bookmarked regions and personalized travel schedules saved to your SQLite profile.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('destinations')}
          className={`relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'destinations'
              ? 'text-white bg-slate-900 border border-brand-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Bookmarked Places</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-brand-500/20 text-brand-300 font-mono">
            {destinations.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('trips')}
          className={`relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'trips'
              ? 'text-white bg-slate-900 border border-brand-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>My Planned Trips</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-brand-500/20 text-brand-300 font-mono">
            {trips.length}
          </span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card h-64 skeleton rounded-2xl" />
          ))}
        </div>
      ) : activeTab === 'destinations' ? (
        destinations.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <MapPin size={28} />
            </div>
            <h3 className="text-xl font-bold text-white">No bookmarked destinations yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore places on the atlas or match engine and tap the heart icon to save them for easy reference.
            </p>
            <Link to="/explore" className="glass-button-primary inline-flex items-center gap-2 text-xs !py-3">
              <Compass size={16} />
              <span>Explore Destinations</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                onClick={() => navigate(`/destination/${dest.id}`)}
                className="group glass-card-hover rounded-2xl overflow-hidden flex flex-col cursor-pointer border border-white/5"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
                  <button
                    onClick={(e) => handleRemoveDestination(dest.id, dest.name, e)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-slate-950/80 backdrop-blur border border-white/10 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-all shadow-sm"
                    title="Remove from saved"
                  >
                    <Trash2 size={15} />
                  </button>
                  <div className="absolute bottom-3 left-3 text-xs text-slate-200 font-medium flex items-center gap-1">
                    <MapPin size={13} className="text-brand-400" />
                    <span>{dest.state}</span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {dest.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      ₹{dest.estimated_budget_min.toLocaleString('en-IN')} - ₹{dest.estimated_budget_max.toLocaleString('en-IN')}
                    </span>
                    <span className="text-brand-400 font-semibold">
                      {dest.recommended_duration_min}-{dest.recommended_duration_max} Days
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : trips.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Layers size={28} />
          </div>
          <h3 className="text-xl font-bold text-white">No custom itineraries planned yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Use the Trip Builder or recommendation engine to craft structured day-by-day itineraries.
          </p>
          <Link to="/plan" className="glass-button-primary inline-flex items-center gap-2 text-xs !py-3">
            <Sparkles size={16} />
            <span>Plan a Custom Trip</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="glass-card p-6 rounded-2xl flex flex-col justify-between border border-white/5 space-y-6"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white leading-snug">{trip.name}</h3>
                  <button
                    onClick={(e) => handleDeleteTrip(trip.id, trip.name, e)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Delete itinerary"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-4">
                  <MapPin size={13} className="text-brand-400" />
                  <span>
                    {(trip.destinations || []).map((d) => d.name).join(', ') || 'Custom Destinations'}
                  </span>
                </p>

                <div className="flex gap-4 pt-3 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-brand-300 font-semibold">
                    <Calendar size={15} />
                    <span>{trip.duration} Days</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-purple-300">
                    <Clock size={15} />
                    <span>
                      {(trip.days || []).reduce((acc, d) => acc + (d.activities?.length || 0), 0)} Activities
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleViewTrip(trip)}
                className="w-full glass-button-primary text-xs flex items-center justify-center gap-2 !py-2.5"
              >
                <span>Open in Trip Builder</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;
