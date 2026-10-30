import { Destination, TripPlan } from '../types';

export type { TripPlan };

export const getSavedDestinations = (): Destination[] => {
  try {
    const saved = localStorage.getItem('tripMeta_savedDestinations');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveDestination = (dest: Destination) => {
  const saved = getSavedDestinations();
  if (!saved.find(d => d.id === dest.id)) {
    localStorage.setItem('tripMeta_savedDestinations', JSON.stringify([...saved, dest]));
    window.dispatchEvent(new Event('tripMeta_saved_changed'));
  }
};

export const removeSavedDestination = (id: string) => {
  const saved = getSavedDestinations();
  localStorage.setItem('tripMeta_savedDestinations', JSON.stringify(saved.filter(d => d.id !== id)));
  window.dispatchEvent(new Event('tripMeta_saved_changed'));
};

export const isDestinationSaved = (id: string): boolean => {
  const saved = getSavedDestinations();
  return saved.some(d => d.id === id);
};

export const getSavedTrips = (): TripPlan[] => {
  try {
    const saved = localStorage.getItem('tripMeta_savedTrips');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveTrip = (trip: TripPlan) => {
  const saved = getSavedTrips();
  const existingIndex = saved.findIndex(t => t.id === trip.id);
  if (existingIndex >= 0) {
    saved[existingIndex] = trip;
  } else {
    saved.push(trip);
  }
  localStorage.setItem('tripMeta_savedTrips', JSON.stringify(saved));
  window.dispatchEvent(new Event('tripMeta_saved_changed'));
};

export const removeTrip = (id: string) => {
  const saved = getSavedTrips();
  localStorage.setItem('tripMeta_savedTrips', JSON.stringify(saved.filter(t => t.id !== id)));
  window.dispatchEvent(new Event('tripMeta_saved_changed'));
};
