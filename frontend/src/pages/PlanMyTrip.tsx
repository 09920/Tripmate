import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Users,
  Wallet,
  Car,
  Compass,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Plane,
  Train,
  Bus,
  Bike
} from 'lucide-react';
import { UserPreferences } from '../types';
import { useToast } from '../context/ToastContext';

const steps = [
  { id: 'location', title: 'Starting Point', subtitle: 'Where will your journey begin?', icon: MapPin },
  { id: 'duration', title: 'Trip Duration', subtitle: 'How many days do you have?', icon: Calendar },
  { id: 'travellers', title: 'Travel Crew', subtitle: 'Who are you traveling with?', icon: Users },
  { id: 'budget', title: 'Budget Limit', subtitle: 'Total estimated budget for the trip', icon: Wallet },
  { id: 'transport', title: 'Transport Mode', subtitle: 'How do you prefer to get there?', icon: Car },
  { id: 'interests', title: 'Travel Vibes', subtitle: 'What activities ignite your interest?', icon: Compass }
];

const PlanMyTrip: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize with location state preset if provided from Home Quick Match
  const preset = location.state?.preset;

  const [preferences, setPreferences] = useState<UserPreferences>({
    starting_location: preset?.starting_location || 'Mumbai',
    duration_days: preset?.duration_days || 3,
    travellers_count: preset?.travellers_count || 2,
    budget_max: preset?.budget_max || 20000,
    traveller_type: preset?.traveller_type || 'Couple',
    transport_preference: preset?.transport_preference || 'Any',
    interests: preset?.interests || ['Nature', 'Relaxation']
  });

  useEffect(() => {
    if (preset) {
      toast.info('Applied your quick match preferences!');
    }
  }, [preset]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((curr) => curr + 1);
    } else {
      submitPlan();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((curr) => curr - 1);
    }
  };

  const submitPlan = () => {
    setIsProcessing(true);
    // Allow animation to complete
    setTimeout(() => {
      navigate('/results', { state: { preferences } });
    }, 1200);
  };

  const toggleInterest = (interest: string) => {
    setPreferences((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  if (isProcessing) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 text-center space-y-6 max-w-md">
          <div className="relative w-20 h-20 mx-auto">
            <div className="w-20 h-20 border-4 border-slate-800 border-t-brand-400 rounded-full animate-spin" />
            <Sparkles className="absolute inset-0 m-auto text-brand-400 w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Matching Your Ideal Destinations
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Running vector cosine similarity, seasonal month correlation, and budget penalty scoring across our destination database...
          </p>
        </div>
      </div>
    );
  }

  const currentStepConfig = steps[currentStep];

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Wizard Header & Progress Steps */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>STEP {currentStep + 1} OF {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% COMPLETED</span>
          </div>

          {/* Stepper Bar */}
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 shadow-glow-brand"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Stepper Pills on Desktop */}
          <div className="hidden sm:grid grid-cols-6 gap-2 pt-2">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isPast = idx < currentStep;
              const isCurr = idx === currentStep;

              return (
                <button
                  key={s.id}
                  onClick={() => idx <= currentStep && setCurrentStep(idx)}
                  className={`flex items-center gap-1.5 p-2 rounded-xl text-left border transition-all text-xs ${
                    isCurr
                      ? 'bg-slate-900 border-brand-500/50 text-brand-300 font-semibold'
                      : isPast
                      ? 'bg-slate-950/60 border-emerald-500/20 text-slate-400 hover:text-white'
                      : 'bg-transparent border-transparent text-slate-600 opacity-60'
                  }`}
                >
                  <Icon size={14} className={isCurr ? 'text-brand-400' : isPast ? 'text-emerald-500' : 'text-slate-600'} />
                  <span className="truncate">{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wizard Card Body */}
        <div className="glass-card p-6 sm:p-10 border border-white/10 relative overflow-hidden">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-400 mb-2">
              <Sparkles size={14} />
              <span>{currentStepConfig.title}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {currentStepConfig.subtitle}
            </h1>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="min-h-[260px] flex flex-col justify-center"
            >
              {/* Step 0: Starting Location */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Departure City or Hub
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="text-brand-400" size={20} />
                      </div>
                      <input
                        type="text"
                        value={preferences.starting_location}
                        onChange={(e) => setPreferences({ ...preferences, starting_location: e.target.value })}
                        className="glass-input w-full pl-12 text-lg"
                        placeholder="e.g. Mumbai, Delhi, Bengaluru, Pune..."
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-xs text-slate-400 self-center mr-1">Popular hubs:</span>
                    {['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Kochi', 'Kolkata'].map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setPreferences({ ...preferences, starting_location: city });
                          toast.info(`Starting location set to ${city}`);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                          preferences.starting_location === city
                            ? 'bg-brand-500/20 border-brand-500/50 text-brand-300'
                            : 'bg-slate-900 border-slate-700/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Duration */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { days: 2, label: 'Weekend Trip' },
                      { days: 3, label: 'Long Weekend' },
                      { days: 4, label: 'Mid-week Break' },
                      { days: 5, label: 'Exploration' },
                      { days: 7, label: 'Full Week' },
                      { days: 10, label: 'Grand Journey' },
                      { days: 14, label: 'Fortnight Tour' }
                    ].map((item) => (
                      <button
                        key={item.days}
                        type="button"
                        onClick={() => setPreferences({ ...preferences, duration_days: item.days })}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          preferences.duration_days === item.days
                            ? 'bg-brand-500/20 border-brand-500/60 text-white shadow-glow-brand'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xl font-bold block text-brand-400">{item.days} Days</span>
                        <span className="text-xs text-slate-400">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Travellers */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Select Party Composition
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {['Solo', 'Couple', 'Friends', 'Family', 'College Group'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setPreferences({ ...preferences, traveller_type: type })}
                          className={`py-3.5 px-4 rounded-xl border font-semibold text-sm transition-all ${
                            preferences.traveller_type === type
                              ? 'bg-brand-500/20 border-brand-500/60 text-brand-300 shadow-glow-brand'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Total Passenger Count</h4>
                      <p className="text-xs text-slate-400">Used for vehicle sizing and room estimates</p>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-900 border border-slate-700/80 rounded-2xl p-2">
                      <button
                        type="button"
                        onClick={() =>
                          setPreferences((prev) => ({
                            ...prev,
                            travellers_count: Math.max(1, prev.travellers_count - 1)
                          }))
                        }
                        className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors"
                      >
                        -
                      </button>
                      <span className="text-2xl font-black text-white w-10 text-center">
                        {preferences.travellers_count}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setPreferences((prev) => ({
                            ...prev,
                            travellers_count: Math.min(25, prev.travellers_count + 1)
                          }))
                        }
                        className="w-10 h-10 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Budget */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[8000, 15000, 25000, 40000, 60000, 100000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setPreferences({ ...preferences, budget_max: amt })}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          preferences.budget_max === amt
                            ? 'bg-brand-500/20 border-brand-500/60 text-white shadow-glow-brand'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-lg font-bold block text-brand-300">
                          ₹{amt.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-400">
                          {amt <= 15000 ? 'Budget Friendly' : amt <= 40000 ? 'Comfortable' : 'Premium Luxury'}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Or specify custom ceiling
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-bold">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={preferences.budget_max}
                        onChange={(e) =>
                          setPreferences({ ...preferences, budget_max: Math.max(1000, Number(e.target.value) || 0) })
                        }
                        className="glass-input w-full pl-10 text-lg font-bold text-white"
                        placeholder="Enter custom budget"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Transport Mode */}
              {currentStep === 4 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { mode: 'Car', icon: Car, label: 'Road Trip / Self Drive' },
                    { mode: 'Bike', icon: Bike, label: 'Motorbike Odyssey' },
                    { mode: 'Train', icon: Train, label: 'Scenic Rail Travel' },
                    { mode: 'Bus', icon: Bus, label: 'Volvo / State Transport' },
                    { mode: 'Flight', icon: Plane, label: 'Express Air Travel' },
                    { mode: 'Any', icon: Compass, label: 'Any Feasible Mode' }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = preferences.transport_preference === item.mode;

                    return (
                      <button
                        key={item.mode}
                        type="button"
                        onClick={() => setPreferences({ ...preferences, transport_preference: item.mode })}
                        className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                          isSelected
                            ? 'bg-brand-500/20 border-brand-500/60 text-white shadow-glow-brand'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div>
                          <span className="font-bold text-sm block text-white">{item.mode}</span>
                          <span className="text-[11px] text-slate-400 leading-tight">{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Step 5: Interests & Travel Vibes */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      'Nature',
                      'Adventure',
                      'Mountains',
                      'Beaches',
                      'Waterfalls',
                      'Historical',
                      'Camping',
                      'Photography',
                      'Spirituality',
                      'Relaxation',
                      'Food & Cuisine',
                      'Trekking'
                    ].map((interest) => {
                      const isSelected = preferences.interests.includes(interest);

                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                            isSelected
                              ? 'bg-brand-500/25 border-brand-500 text-brand-200 shadow-glow-brand'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>

                  {preferences.interests.length === 0 && (
                    <p className="text-xs text-amber-400 pt-2">
                      * Pick at least one vibe so our TF-IDF engine can compute relevant recommendations.
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Action Footer */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center">
            <button
              type="button"
              onClick={prevStep}
              className={`glass-button-secondary text-sm flex items-center gap-2 ${
                currentStep === 0 ? 'invisible pointer-events-none' : ''
              }`}
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={nextStep}
              disabled={currentStep === 5 && preferences.interests.length === 0}
              className="glass-button-primary text-sm flex items-center gap-2 !px-8"
            >
              <span>{currentStep === steps.length - 1 ? 'Compute Matches' : 'Continue'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanMyTrip;
