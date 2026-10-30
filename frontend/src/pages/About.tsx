import React from 'react';
import { Database, Filter, Layers, Zap, Sparkles, CheckCircle2, Cpu, HardDrive } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="badge-emerald mb-2">Technical Whitepaper</span>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          How TripMeta Works
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Discovering the ideal journey shouldn't rely on generic top-10 listicles. TripMeta executes content-based filtering using Term Frequency-Inverse Document Frequency (TF-IDF), Cosine Similarity, and SQLite persistence.
        </p>
      </div>

      {/* The Problem vs Solution */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6 sm:p-8 space-y-4 border border-rose-500/20">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-400">
            The Industry Problem
          </div>
          <h2 className="text-xl font-bold text-white">Disjointed Information & Cognitive Overload</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Travel details are scattered across thousands of commercial blogs, biased affiliate lists, and outdated forums. Travelers spend hours trying to reconcile conflicting data with their actual party size, budget constraints, and weather patterns.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 space-y-4 border border-brand-500/30 shadow-glow-brand">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-400">
            The TripMeta Solution
          </div>
          <h2 className="text-xl font-bold text-white">Constraint-First Mathematical Matching</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            TripMeta begins with your exact constraints: your party composition, maximum ceiling budget, departure hub, and required duration. It then computes affinity vectors across our verified structured atlas.
          </p>
        </div>
      </div>

      {/* 4 Pillars of Intelligence */}
      <div className="glass-card p-8 sm:p-10 space-y-8">
        <h2 className="text-2xl font-black text-white border-b border-slate-800 pb-4">
          Core Engine Pipeline
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <Database size={22} />
            </div>
            <h3 className="font-bold text-white text-base">1. Structured Regional Ontologies</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every destination in our SQLite database is mapped with multidimensional attributes: categories, seasonal months, transit logistics, activity arrays, and budget ranges.
            </p>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Filter size={22} />
            </div>
            <h3 className="font-bold text-white text-base">2. User Feature Vectorization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your requested vibes, crew dynamics, and transit preferences are tokenized and weighted into a high-dimensional preference vector.
            </p>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Layers size={22} />
            </div>
            <h3 className="font-bold text-white text-base">3. TF-IDF & Cosine Similarity</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates the angle between your query vector and all destination corpus vectors. Penalizes generic frequent terms while prioritizing distinctive affinities.
            </p>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Zap size={22} />
            </div>
            <h3 className="font-bold text-white text-base">4. Real-Time Dynamic Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Merges similarity with verified user ratings and active calendar season. Applies penalty deductions if a destination exceeds your designated budget.
            </p>
          </div>
        </div>
      </div>

      {/* The Mathematical Model */}
      <div className="glass-card p-8 sm:p-10 space-y-6">
        <h2 className="text-2xl font-black text-white">Algorithm Formulation</h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          The final match score ranking is computed through a normalized weighted linear composite:
        </p>

        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 space-y-2">
          <p className="text-brand-400 font-bold">
            Score = (0.50 × ContentSimilarity) + (0.30 × RatingRatio) + (0.20 × SeasonalMatch)
          </p>
          <div className="text-slate-400 text-xs pt-2 space-y-1">
            <p>• If (EstimatedBudgetMin &gt; UserBudgetMax): Score = Score - 0.15 (Soft Budget Penalty)</p>
            <p>• If (RecommendedDurationMin &gt; UserDurationDays): Score = Score - 0.10 (Duration Penalty)</p>
            <p>• MatchScorePercentage = Clamp(Round(Score × 100), 18%, 99%)</p>
          </div>
        </div>
      </div>

      {/* Technology Stack Specification */}
      <div className="glass-card p-8 sm:p-10 space-y-6">
        <h2 className="text-2xl font-black text-white">Full-Stack Tech Architecture</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-brand-400 font-bold uppercase block">Frontend</span>
            <span className="font-bold text-white text-sm">React 19 & Vite</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-brand-400 font-bold uppercase block">Styling</span>
            <span className="font-bold text-white text-sm">Tailwind CSS 3.4</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-brand-400 font-bold uppercase block">Animations</span>
            <span className="font-bold text-white text-sm">Framer Motion</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-brand-400 font-bold uppercase block">Backend & DB</span>
            <span className="font-bold text-white text-sm">Node.js + SQLite3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
