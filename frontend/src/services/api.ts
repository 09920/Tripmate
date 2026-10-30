import { Destination, UserPreferences, RecommendationResult, TripPlan } from '../types';
import {
  getSavedDestinations as getLocalSavedDestinations,
  saveDestination as saveLocalDestination,
  removeSavedDestination as removeLocalSavedDestination,
  getSavedTrips as getLocalSavedTrips,
  saveTrip as saveLocalTrip
} from '../utils/storage';
import { seedDestinations } from '../data/fallbackDestinations';
import { getRecommendations as getLocalRecommendations } from './recommendationEngine';

const API_BASE = '/api';

class ApiService {
  // Safe fetch helper with timeout and JSON parsing
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        signal: controller.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  // --- Destinations ---
  public async getDestinations(params?: { category?: string; state?: string; search?: string }): Promise<Destination[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.state) query.append('state', params.state);
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    try {
      return await this.request<Destination[]>(`/destinations${queryString}`);
    } catch (err) {
      console.warn('Backend unavailable, falling back to local destination catalog:', err);
      let list = seedDestinations();
      if (params?.category) {
        list = list.filter((d) => d.categories?.some((c) => c.toLowerCase() === params.category!.toLowerCase()));
      }
      if (params?.state) {
        list = list.filter((d) => d.state?.toLowerCase() === params.state!.toLowerCase());
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.state.toLowerCase().includes(q) ||
            d.description.toLowerCase().includes(q)
        );
      }
      return list;
    }
  }

  public async getDestinationById(id: string): Promise<Destination | null> {
    try {
      return await this.request<Destination>(`/destinations/${id}`);
    } catch (err) {
      console.warn(`Failed to fetch destination ${id} from backend, falling back to local catalog:`, err);
      const match = seedDestinations().find((d) => d.id === id);
      return match || null;
    }
  }

  // --- Recommendations ---
  public async getRecommendations(preferences: UserPreferences): Promise<RecommendationResult[]> {
    try {
      return await this.request<RecommendationResult[]>('/recommendations', {
        method: 'POST',
        body: JSON.stringify(preferences)
      });
    } catch (err) {
      console.warn('Backend unavailable, computing recommendations locally:', err);
      const all = seedDestinations();
      return getLocalRecommendations(preferences, all).slice(0, 12);
    }
  }

  // --- Trips ---
  public async getTrips(): Promise<TripPlan[]> {
    try {
      const backendTrips = await this.request<TripPlan[]>('/trips');
      return backendTrips;
    } catch (err) {
      console.warn('Failed to fetch trips from backend, using local storage:', err);
      return getLocalSavedTrips();
    }
  }

  public async saveTrip(trip: TripPlan): Promise<TripPlan> {
    // Always mirror to localStorage for instant offline access
    saveLocalTrip(trip);
    try {
      const res = await this.request<{ trip: TripPlan }>('/trips', {
        method: 'POST',
        body: JSON.stringify(trip)
      });
      return res.trip || trip;
    } catch (err) {
      console.warn('Backend saveTrip failed, saved locally:', err);
      return trip;
    }
  }

  public async deleteTrip(id: string): Promise<void> {
    // Remove locally
    const current = getLocalSavedTrips();
    localStorage.setItem('tripMeta_savedTrips', JSON.stringify(current.filter(t => t.id !== id)));
    try {
      await this.request(`/trips/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn(`Backend deleteTrip failed for ${id}:`, err);
    }
  }

  // --- Bookmarks (Saved Destinations) ---
  public async getSavedDestinations(): Promise<{ destinations: Destination[]; savedIds: string[] }> {
    try {
      const data = await this.request<{ destinations: Destination[]; savedIds: string[] }>('/saved');
      return data;
    } catch (err) {
      const local = getLocalSavedDestinations();
      return { destinations: local, savedIds: local.map(d => d.id) };
    }
  }

  public async toggleBookmark(destination: Destination, isCurrentlySaved: boolean): Promise<boolean> {
    if (isCurrentlySaved) {
      removeLocalSavedDestination(destination.id);
      try {
        await this.request(`/saved/${destination.id}`, { method: 'DELETE' });
      } catch (err) {
        console.warn('Backend removeBookmark error:', err);
      }
      return false;
    } else {
      saveLocalDestination(destination);
      try {
        await this.request(`/saved/${destination.id}`, { method: 'POST' });
      } catch (err) {
        console.warn('Backend saveBookmark error:', err);
      }
      return true;
    }
  }
}

export const api = new ApiService();

