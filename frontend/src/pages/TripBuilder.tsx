import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Clock,
  Save,
  Plus,
  Trash2,
  Sparkles,
  ArrowLeft,
  Printer,
  ChevronDown,
  Layers,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { Destination, TripPlan, TripActivity, TripDay } from '../types';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

const TripBuilder: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [availableDestinations, setAvailableDestinations] = useState<Destination[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<Destination[]>(
    location.state?.destinations || []
  );

  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [tripName, setTripName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // New activity form modal state
  const [activeDayModal, setActiveDayModal] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('11:00 AM');
  const [newLocation, setNewLocation] = useState('');
  const [newType, setNewType] = useState<'Activity' | 'Dining' | 'Leisure' | 'Sightseeing' | 'Logistics'>('Activity');

  // Load baseline destinations if direct access
  useEffect(() => {
    let isMounted = true;
    api.getDestinations().then((dests) => {
      if (!isMounted) return;
      setAvailableDestinations(dests);
      if (selectedDestinations.length === 0 && dests.length > 0) {
        // Default to first destination if empty
        setSelectedDestinations([dests[0]]);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize or re-generate baseline itinerary whenever destination changes
  useEffect(() => {
    if (selectedDestinations.length === 0) return;

    const dest = selectedDestinations[0];
    const duration = Math.max(2, dest.recommended_duration_min || 3);

    const days: TripDay[] = [];
    let activityIndex = 0;

    for (let i = 1; i <= duration; i++) {
      const activities: TripActivity[] = [];

      if (i === 1) {
        activities.push({
          id: `d${i}-a1`,
          time: '10:00 AM',
          title: `Arrival & Hotel Check-in`,
          location: dest.name,
          type: 'Logistics'
        });
        activities.push({
          id: `d${i}-a2`,
          time: '03:00 PM',
          title: 'Orientation & Local Sunset Walk',
          location: dest.nearby_places?.[0]?.name || 'Town Center',
          type: 'Leisure'
        });
      } else if (i === duration) {
        activities.push({
          id: `d${i}-a1`,
          time: '10:00 AM',
          title: 'Souvenir Shopping & Traditional Brunch',
          location: dest.restaurant_options?.[0]?.name || 'Local Marketplace',
          type: 'Dining'
        });
        activities.push({
          id: `d${i}-a2`,
          time: '03:00 PM',
          title: 'Hotel Checkout & Departure Transit',
          location: dest.name,
          type: 'Logistics'
        });
      } else {
        const thing1 = dest.things_to_do?.[activityIndex % (dest.things_to_do.length || 1)] || 'Scenic Sightseeing';
        activityIndex++;
        const thing2 = dest.things_to_do?.[activityIndex % (dest.things_to_do.length || 1)] || 'Cultural Exploration';
        activityIndex++;

        activities.push({
          id: `d${i}-a1`,
          time: '09:30 AM',
          title: thing1,
          location: dest.nearby_places?.[activityIndex % (dest.nearby_places.length || 1)]?.name || dest.name,
          type: 'Activity'
        });
        activities.push({
          id: `d${i}-a2`,
          time: '02:30 PM',
          title: thing2,
          location: dest.name,
          type: 'Sightseeing'
        });
      }

      days.push({ dayNumber: i, activities });
    }

    const defaultName = `${dest.name} Discovery Itinerary`;
    setTripName(defaultName);
    setTripPlan({
      id: `trip_${Date.now()}`,
      name: defaultName,
      destinations: selectedDestinations,
      duration,
      days,
      total_budget: dest.estimated_budget_min,
      createdAt: new Date().toISOString()
    });
  }, [selectedDestinations]);

  const handleSaveTrip = async () => {
    if (!tripPlan) return;
    setIsSaving(true);

    try {
      const finalTrip: TripPlan = {
        ...tripPlan,
        name: tripName.trim() || `${selectedDestinations[0]?.name || 'Custom'} Trip`,
        updatedAt: new Date().toISOString()
      };

      await api.saveTrip(finalTrip);
      setIsSaved(true);
      toast.success('Itinerary successfully saved to SQLite database!');
      setTimeout(() => {
        navigate('/saved');
      }, 1000);
    } catch (err: any) {
      console.error('Failed to save trip:', err);
      toast.error('Failed to save itinerary to database');
    } finally {
      setIsSaving(false);
    }
  };

  const removeActivity = (dayIndex: number, activityId: string) => {
    if (!tripPlan) return;
    const newDays = [...tripPlan.days];
    newDays[dayIndex].activities = newDays[dayIndex].activities.filter((a) => a.id !== activityId);
    setTripPlan({ ...tripPlan, days: newDays });
    toast.info('Activity removed from schedule');
  };

  const addDay = () => {
    if (!tripPlan) return;
    const nextDayNumber = tripPlan.days.length + 1;
    const newDay: TripDay = {
      dayNumber: nextDayNumber,
      activities: [
        {
          id: `d${nextDayNumber}-a1`,
          time: '10:00 AM',
          title: 'Day Exploration & Free Time',
          location: selectedDestinations[0]?.name || 'Local Area',
          type: 'Leisure'
        }
      ]
    };
    setTripPlan({
      ...tripPlan,
      duration: nextDayNumber,
      days: [...tripPlan.days, newDay]
    });
    toast.success(`Added Day ${nextDayNumber} to itinerary`);
  };

  const openAddActivityModal = (dayIndex: number) => {
    setActiveDayModal(dayIndex);
    setNewTitle('');
    setNewTime('11:00 AM');
    setNewLocation(selectedDestinations[0]?.name || '');
    setNewType('Activity');
  };

  const handleAddActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripPlan || activeDayModal === null || !newTitle.trim()) return;

    const newActivity: TripActivity = {
      id: `act_${Date.now()}`,
      time: newTime.trim() || '12:00 PM',
      title: newTitle.trim(),
      location: newLocation.trim() || selectedDestinations[0]?.name || 'Location',
      type: newType
    };

    const newDays = [...tripPlan.days];
    newDays[activeDayModal].activities.push(newActivity);
    setTripPlan({ ...tripPlan, days: newDays });
    setActiveDayModal(null);
    toast.success('New activity added!');
  };

  if (!tripPlan) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-[#0D9488] rounded-full animate-spin mb-4" />
        <p className="text-[#64748B] text-sm">Initializing itinerary canvas...</p>
      </div>
    );
  }

  const primaryDest = selectedDestinations[0];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      {/* Top Banner Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="flex-grow space-y-2">
          <button
            onClick={() => navigate('/explore')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0D9488] hover:text-[#0b7a70] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Atlas & Recommendations</span>
          </button>

          {/* Editable Trip Title Input */}
          <input
            type="text"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            className="text-3xl sm:text-5xl font-black text-[#163047] bg-transparent border-b-2 border-transparent hover:border-slate-300 focus:border-[#0D9488] outline-none w-full py-1 transition-all placeholder:text-slate-300"
            placeholder="Name your journey..."
          />

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] pt-1">
            <span className="flex items-center gap-1.5 text-[#163047] font-semibold">
              <MapPin size={14} className="text-[#0D9488]" />
              {selectedDestinations.map((d) => d.name).join(', ')}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-sky-500" />
              {tripPlan.duration} Days Scheduled
            </span>
            <span>•</span>
            <span className="text-[#0D9488] font-semibold">
              Est. Budget: ₹{primaryDest?.estimated_budget_min.toLocaleString('en-IN')} - ₹{primaryDest?.estimated_budget_max.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="glass-button-secondary text-xs flex items-center gap-2 !py-3 !px-4"
            title="Print or Save PDF"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">Export PDF</span>
          </button>

          <button
            type="button"
            onClick={handleSaveTrip}
            disabled={isSaving || isSaved}
            className={`glass-button-primary text-xs flex items-center gap-2 !py-3 !px-6 ${
              isSaved ? '!bg-emerald-600 !from-emerald-600 !to-emerald-600 text-white pointer-events-none' : ''
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle2 size={16} />
                <span>Saved to Database</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>{isSaving ? 'Persisting...' : 'Save Itinerary'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Destination Switcher Pill if multiple available */}
      {availableDestinations.length > 0 && (
        <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs bg-white">
          <div className="flex items-center gap-2 text-[#163047] font-medium">
            <Sparkles size={16} className="text-[#0D9488]" />
            <span>Want to plan for a different destination?</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={primaryDest?.id || ''}
              onChange={(e) => {
                const found = availableDestinations.find((d) => d.id === e.target.value);
                if (found) setSelectedDestinations([found]);
              }}
              className="bg-[#F8FAFC] border border-slate-200 text-[#163047] rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#0D9488]"
            >
              {availableDestinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.state})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Days & Timeline Canvas */}
      <div className="glass-card p-6 sm:p-10 space-y-12 bg-white">
        {tripPlan.days.map((day, dIdx) => (
          <div key={day.dayNumber} className="relative">
            {/* Timeline Vertical Thread */}
            {dIdx !== tripPlan.days.length - 1 && (
              <div className="absolute left-6 top-16 bottom-[-3.5rem] w-[2px] bg-slate-200" />
            )}

            {/* Day Header Badge */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0D9488] text-white flex items-center justify-center font-black text-lg shadow-teal-sm">
                  D{day.dayNumber}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#163047]">
                    Day {day.dayNumber}
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    {day.activities.length} planned activities
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openAddActivityModal(dIdx)}
                className="glass-button-secondary text-xs flex items-center gap-1.5 !py-2 !px-3"
              >
                <Plus size={14} className="text-[#0D9488]" />
                <span>Add Activity</span>
              </button>
            </div>

            {/* Activities List */}
            <div className="pl-6 sm:pl-16 space-y-3">
              {day.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="group bg-[#F8FAFC] hover:bg-white p-4 sm:p-5 rounded-2xl flex items-start justify-between gap-4 border border-slate-200 hover:border-[#0D9488]/40 hover:shadow-card transition-all"
                >
                  <div className="space-y-1 flex-grow">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#0D9488] bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
                        {activity.time}
                      </span>
                      <span className="text-[10px] font-semibold text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {activity.type}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#163047] pt-1">
                      {activity.title}
                    </h3>
                    <p className="text-xs text-[#64748B] flex items-center gap-1">
                      <MapPin size={13} className="text-[#0D9488]" />
                      {activity.location}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeActivity(dIdx, activity.id)}
                    aria-label="Delete activity"
                    className="text-slate-400 hover:text-rose-500 p-2 rounded-xl hover:bg-slate-100 transition-colors opacity-70 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Append Extra Day */}
        <div className="pt-6 border-t border-slate-200 flex justify-center">
          <button
            type="button"
            onClick={addDay}
            className="glass-button-secondary flex items-center gap-2 text-sm !py-3 !px-6"
          >
            <Plus size={18} className="text-[#0D9488]" />
            <span>Add Day {tripPlan.days.length + 1} to Itinerary</span>
          </button>
        </div>
      </div>

      {/* Add Activity Modal */}
      <AnimatePresence>
        {activeDayModal !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white max-w-md w-full p-6 sm:p-8 space-y-6 rounded-3xl border border-slate-200 shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-[#163047] flex items-center gap-2">
                  <Plus size={18} className="text-[#0D9488]" />
                  <span>Add Activity for Day {(activeDayModal ?? 0) + 1}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveDayModal(null)}
                  className="text-slate-400 hover:text-[#163047]"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddActivitySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#163047] uppercase tracking-wider mb-1.5">
                    Activity Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Visit Tea Museum & Factory"
                    className="glass-input w-full text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#163047] uppercase tracking-wider mb-1.5">
                      Schedule Time
                    </label>
                    <input
                      type="text"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      placeholder="e.g. 10:30 AM"
                      className="glass-input w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#163047] uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="glass-input w-full text-sm cursor-pointer"
                    >
                      <option value="Activity" className="bg-white text-[#163047]">Activity</option>
                      <option value="Sightseeing" className="bg-white text-[#163047]">Sightseeing</option>
                      <option value="Dining" className="bg-white text-[#163047]">Dining</option>
                      <option value="Leisure" className="bg-white text-[#163047]">Leisure</option>
                      <option value="Logistics" className="bg-white text-[#163047]">Logistics</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#163047] uppercase tracking-wider mb-1.5">
                    Location / Landmark
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Eravikulam National Park"
                    className="glass-input w-full text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setActiveDayModal(null)}
                    className="glass-button-secondary text-xs !py-2.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="glass-button-primary text-xs !py-2.5 !px-5"
                  >
                    Insert Activity
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TripBuilder;
