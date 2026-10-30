import { Destination, UserPreferences, RecommendationResult } from '../types';

const tokenize = (text: string): string[] => {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 1);
};

export function getRecommendations(
  rawPreferences: Partial<UserPreferences>,
  destinations: Destination[]
): RecommendationResult[] {
  if (!destinations || destinations.length === 0) return [];

  // Safe preferences with robust fallbacks
  const preferences: UserPreferences = {
    starting_location: rawPreferences?.starting_location?.trim() || '',
    duration_days: Math.max(1, Number(rawPreferences?.duration_days) || 3),
    travellers_count: Math.max(1, Number(rawPreferences?.travellers_count) || 2),
    budget_max: Math.max(1000, Number(rawPreferences?.budget_max) || 20000),
    traveller_type: rawPreferences?.traveller_type?.trim() || 'Couple',
    transport_preference: rawPreferences?.transport_preference?.trim() || 'Any',
    interests: Array.isArray(rawPreferences?.interests) ? rawPreferences.interests : []
  };

  const getDocumentFeatures = (dest: Destination): string => {
    return [
      ...(dest.categories || []),
      ...(dest.interests || []),
      ...(dest.things_to_do || []),
      dest.state || '',
      dest.name || ''
    ]
      .join(' ')
      .toLowerCase();
  };

  const documents = destinations.map(getDocumentFeatures);
  const userFeatureStr = [
    ...preferences.interests,
    preferences.traveller_type,
    preferences.transport_preference !== 'Any' ? preferences.transport_preference : ''
  ]
    .join(' ')
    .toLowerCase();

  const allDocs = [...documents, userFeatureStr];
  const tokenizedDocs = allDocs.map(tokenize);

  // Term document frequency
  const df: Record<string, number> = {};
  tokenizedDocs.forEach((tokens) => {
    const uniqueTokens = new Set(tokens);
    uniqueTokens.forEach((t) => {
      df[t] = (df[t] || 0) + 1;
    });
  });

  // Inverse document frequency
  const idf: Record<string, number> = {};
  const N = allDocs.length;
  for (const [term, count] of Object.entries(df)) {
    idf[term] = Math.log((N + 1) / (count + 1)) + 1;
  }

  // User TF-IDF vector
  const userTokens = tokenizedDocs[tokenizedDocs.length - 1];
  const userTf: Record<string, number> = {};
  userTokens.forEach((t) => {
    userTf[t] = (userTf[t] || 0) + 1;
  });

  const userVector: Record<string, number> = {};
  let userNorm = 0;
  for (const [term, count] of Object.entries(userTf)) {
    const tfIdf = count * (idf[term] || 1);
    userVector[term] = tfIdf;
    userNorm += tfIdf * tfIdf;
  }
  userNorm = Math.sqrt(userNorm);

  // Current season detection
  const currentMonth = new Date().getMonth();
  const seasons = [
    { name: 'Winter', months: [11, 0, 1] },
    { name: 'Spring', months: [2, 3] },
    { name: 'Summer', months: [4, 5, 6] },
    { name: 'Monsoon', months: [7, 8, 9] },
    { name: 'Autumn', months: [10] }
  ];
  let currentSeason = 'Winter';
  seasons.forEach((s) => {
    if (s.months.includes(currentMonth)) currentSeason = s.name;
  });

  const results: RecommendationResult[] = [];

  destinations.forEach((dest, index) => {
    const destTokens = tokenizedDocs[index];
    const destTf: Record<string, number> = {};
    destTokens.forEach((t) => {
      destTf[t] = (destTf[t] || 0) + 1;
    });

    let destNorm = 0;
    let dotProduct = 0;

    for (const [term, count] of Object.entries(destTf)) {
      const tfIdf = count * (idf[term] || 1);
      destNorm += tfIdf * tfIdf;
      if (userVector[term]) {
        dotProduct += tfIdf * userVector[term];
      }
    }

    destNorm = Math.sqrt(destNorm);
    const contentSimilarity = userNorm > 0 && destNorm > 0 ? dotProduct / (userNorm * destNorm) : 0.3;
    const ratingScore = (dest.rating || 4.0) / 5.0;
    const seasonalMatch = (dest.best_season || []).some(
      (s) => s.toLowerCase() === currentSeason.toLowerCase()
    )
      ? 1.0
      : 0.6;

    // Final weighted score: 0.5 Content + 0.3 Rating + 0.2 Season
    const finalScore = 0.5 * contentSimilarity + 0.3 * ratingScore + 0.2 * seasonalMatch;

    const budgetFits = dest.estimated_budget_min <= preferences.budget_max;
    const durationFits = dest.recommended_duration_min <= preferences.duration_days;
    const typeFits = (dest.traveller_types || []).some(
      (t) => t.toLowerCase() === preferences.traveller_type.toLowerCase()
    );

    const reasons: string[] = [];
    if (preferences.interests.length > 0 && contentSimilarity > 0.05) {
      const matchedInterests = preferences.interests.filter(i => 
        dest.interests.map(d => d.toLowerCase()).includes(i.toLowerCase()) ||
        dest.categories.map(c => c.toLowerCase()).includes(i.toLowerCase())
      );
      if (matchedInterests.length > 0) {
        reasons.push(`Top match for ${matchedInterests.join(', ')}`);
      } else {
        reasons.push(`Aligned with ${preferences.interests.slice(0, 2).join(' & ')} vibe`);
      }
    }
    if (budgetFits) {
      reasons.push(`Within ₹${preferences.budget_max.toLocaleString('en-IN')} budget`);
    } else {
      reasons.push(`Slightly above ₹${preferences.budget_max.toLocaleString('en-IN')} budget`);
    }
    if (durationFits) {
      reasons.push(`Ideal for ${preferences.duration_days}-day itinerary`);
    }
    if (dest.rating >= 4.5) {
      reasons.push(`Exceptional ${dest.rating}★ visitor rating`);
    }
    if (seasonalMatch === 1.0) {
      reasons.push(`Prime time to visit (${currentSeason} season)`);
    }
    if (typeFits) {
      reasons.push(`Highly rated for ${preferences.traveller_type}s`);
    }

    let penalizedScore = finalScore;
    if (!budgetFits) penalizedScore -= 0.15;
    if (!durationFits) penalizedScore -= 0.1;

    // Normalize to 15% - 99%
    const computedPercentage = Math.max(18, Math.min(99, Math.round(penalizedScore * 100)));

    results.push({
      ...dest,
      match_score: computedPercentage,
      match_reasons: reasons
    });
  });

  results.sort((a, b) => b.match_score - a.match_score);
  return results;
}
