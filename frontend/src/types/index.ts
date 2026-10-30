export interface NearbyPlace {
  name: string;
  distance_km: number;
  category: string;
  image: string;
}

export interface HowToReach {
  mode: string;
  description: string;
}

export interface StayOption {
  name: string;
  type: string;
  budget_level: string;
  description: string;
}

export interface RestaurantOption {
  name: string;
  cuisine: string;
  description: string;
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  description: string;
  categories: string[];
  interests: string[];
  best_season: string[];
  facilities: string[];
  estimated_budget_min: number;
  estimated_budget_max: number;
  recommended_duration_min: number;
  recommended_duration_max: number;
  traveller_types: string[];
  rating: number;
  latitude: number;
  longitude: number;
  image: string;
  nearby_places: NearbyPlace[];
  things_to_do: string[];
  how_to_reach: HowToReach[];
  stay_options: StayOption[];
  restaurant_options: RestaurantOption[];
  created_at?: string;
}

export interface UserPreferences {
  starting_location: string;
  duration_days: number;
  travellers_count: number;
  budget_max: number;
  traveller_type: string;
  transport_preference: string;
  interests: string[];
}

export interface RecommendationResult extends Destination {
  match_score: number;
  match_reasons: string[];
}

export interface TripActivity {
  id: string;
  time: string;
  title: string;
  location: string;
  type: 'Logistics' | 'Leisure' | 'Activity' | 'Dining' | 'Sightseeing' | string;
}

export interface TripDay {
  dayNumber: number;
  activities: TripActivity[];
}

export interface TripPlan {
  id: string;
  name: string;
  destinations: Destination[];
  duration: number;
  days: TripDay[];
  total_budget?: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}
