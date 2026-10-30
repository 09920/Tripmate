import React from 'react';
import { Database, Filter, Layers, Zap, Sparkles, CheckCircle2, Cpu, HardDrive } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="badge-emerald mb-2">Technical Whitepaper</span>
        <h1 className="text-4xl sm:text-6xl font-black text-[#163047] tracking-tight">
          How TripMeta Works
        </h1>
        <p className="text-[#64748B] text-base sm:text-lg leading-relaxed">
          Discovering the ideal journey shouldn't rely on generic top-10 listicles. TripMeta executes content-based filtering using Term Frequency-Inverse Document Frequency (TF-IDF), Cosine Similarity, and SQLite persistence.
        </p>
      </div>

      {/* The Problem vs Solution */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6 sm:p-8 space-y-4 border border-rose-200 bg-white shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-600">
            The Industry Problem
          </div>
          <h2 className="text-xl font-bold text-[#163047]">Disjointed Information & Cognitive Overload</h2>
          <p className="text-[#64748B] text-sm leading-relaxed">
            Travel details are scattered across thousands of commercial blogs, biased affiliate lists, and outdated forums. Travelers spend hours trying to reconcile conflicting data with their actual party size, budget constraints, and weather patterns.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 space-y-4 border border-[#0D9488]/30 bg-white shadow-card ring-1 ring-[#0D9488]/20">
          <div className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">
            The TripMeta Solution
          </div>
          <h2 className="text-xl font-bold text-[#163047]">Constraint-First Mathematical Matching</h2>
          <p className="text-[#64748B] text-sm leading-relaxed">
            TripMeta begins with your exact constraints: your party composition, maximum ceiling budget, departure hub, and required duration. It then computes affinity vectors across our verified structured atlas.
          </p>
        </div>
      </div>

      {/* 4 Pillars of Intelligence */}
      <div className="glass-card p-8 sm:p-10 space-y-8 bg-white">
        <h2 className="text-2xl font-black text-[#163047] border-b border-slate-200 pb-4">
          Core Engine Pipeline
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 text-[#0D9488] flex items-center justify-center">
              <Database size={22} />
            </div>
            <h3 className="font-bold text-[#163047] text-base">1. Structured Regional Ontologies</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Every destination in our SQLite database is mapped with multidimensional attributes: categories, seasonal months, transit logistics, activity arrays, and budget ranges.
            </p>
          </div>

          <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center">
              <Filter size={22} />
            </div>
            <h3 className="font-bold text-[#163047] text-base">2. User Feature Vectorization</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Your requested vibes, crew dynamics, and transit preferences are tokenized and weighted into a high-dimensional preference vector.
            </p>
          </div>

          <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
              <Layers size={22} />
            </div>
            <h3 className="font-bold text-[#163047] text-base">3. TF-IDF & Cosine Similarity</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Calculates the angle between your query vector and all destination corpus vectors. Penalizes generic frequent terms while prioritizing distinctive affinities.
            </p>
          </div>

          <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <Zap size={22} />
            </div>
            <h3 className="font-bold text-[#163047] text-base">4. Real-Time Dynamic Scoring</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Merges similarity with verified user ratings and active calendar season. Applies penalty deductions if a destination exceeds your designated budget.
            </p>
          </div>
        </div>
      </div>

      {/* The Mathematical Model */}
      <div className="glass-card p-8 sm:p-10 space-y-6 bg-white">
        <h2 className="text-2xl font-black text-[#163047]">Algorithm Formulation</h2>
        <p className="text-[#64748B] text-sm leading-relaxed">
          The final match score ranking is computed through a normalized weighted linear composite:
        </p>

        <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200 font-mono text-xs sm:text-sm text-[#163047] space-y-2">
          <p className="text-[#0D9488] font-bold text-sm sm:text-base">
            Score = (0.50 × ContentSimilarity) + (0.30 × RatingRatio) + (0.20 × SeasonalMatch)
          </p>
          <div className="text-[#64748B] text-xs pt-2 space-y-1">
            <p>• If (EstimatedBudgetMin &gt; UserBudgetMax): Score = Score - 0.15 (Soft Budget Penalty)</p>
            <p>• If (RecommendedDurationMin &gt; UserDurationDays): Score = Score - 0.10 (Duration Penalty)</p>
            <p>• MatchScorePercentage = Clamp(Round(Score × 100), 18%, 99%)</p>
          </div>
        </div>
      </div>

      {/* Technology Stack Specification */}
      <div className="glass-card p-8 sm:p-10 space-y-6 bg-white">
        <h2 className="text-2xl font-black text-[#163047]">Full-Stack Tech Architecture</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
            <span className="text-[10px] text-[#0D9488] font-bold uppercase tracking-wider block">Frontend</span>
            <span className="font-bold text-[#163047] text-sm">React 19 & Vite</span>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
            <span className="text-[10px] text-[#0D9488] font-bold uppercase tracking-wider block">Styling</span>
            <span className="font-bold text-[#163047] text-sm">Tailwind CSS 3.4</span>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
            <span className="text-[10px] text-[#0D9488] font-bold uppercase tracking-wider block">Animations</span>
            <span className="font-bold text-[#163047] text-sm">Framer Motion</span>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
            <span className="text-[10px] text-[#0D9488] font-bold uppercase tracking-wider block">Backend & DB</span>
            <span className="font-bold text-[#163047] text-sm">Node.js + SQLite3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
