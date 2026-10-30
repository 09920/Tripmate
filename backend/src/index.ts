import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { dbService } from './db/database';
import { getRecommendations } from './services/recommendationEngine';
import { TripPlan, Destination } from './types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/images', express.static(path.resolve(__dirname, '../../frontend/public/images')));

// Initialize SQLite database on launch
dbService.init()
  .then(() => {
    console.log('✨ SQLite Database successfully initialized and synced.');
  })
  .catch((err) => {
    console.error('❌ Failed to initialize database:', err);
  });

// --- Health Check ---
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'TripMeta Recommendation & Itinerary API',
    database: 'SQLite',
    timestamp: new Date().toISOString()
  });
});

// --- Destinations API ---
app.get('/api/destinations', async (req: Request, res: Response) => {
  try {
    const { category, state, search } = req.query;
    const destinations = await dbService.getAllDestinations({
      category: category as string,
      state: state as string,
      search: search as string
    });
    res.json(destinations);
  } catch (error: any) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Failed to retrieve destinations', details: error.message });
  }
});

app.get('/api/destinations/:id', async (req: Request, res: Response) => {
  try {
    const dest = await dbService.getDestinationById(req.params.id);
    if (!dest) {
      return res.status(404).json({ error: `Destination '${req.params.id}' not found` });
    }
    res.json(dest);
  } catch (error: any) {
    console.error('Error fetching destination by ID:', error);
    res.status(500).json({ error: 'Failed to retrieve destination', details: error.message });
  }
});

app.post('/api/destinations', async (req: Request, res: Response) => {
  try {
    const dest: Destination = req.body;
    if (!dest.id || !dest.name || !dest.state) {
      return res.status(400).json({ error: 'Missing required destination fields (id, name, state)' });
    }
    await dbService.insertDestination(dest);
    res.status(201).json({ message: 'Destination created successfully', destination: dest });
  } catch (error: any) {
    console.error('Error inserting destination:', error);
    res.status(500).json({ error: 'Failed to insert destination', details: error.message });
  }
});

// --- Recommendations API ---
app.post('/api/recommendations', async (req: Request, res: Response) => {
  try {
    const userPreferences = req.body || {};
    const allDestinations = await dbService.getAllDestinations();
    
    const recommendations = getRecommendations(userPreferences, allDestinations);
    
    // Return top 12 recommendations
    res.json(recommendations.slice(0, 12));
  } catch (error: any) {
    console.error('Error computing recommendations:', error);
    res.status(500).json({ error: 'Failed to compute recommendations', details: error.message });
  }
});

// --- Trips & Itinerary API ---
app.get('/api/trips', async (_req: Request, res: Response) => {
  try {
    const trips = await dbService.getAllTrips();
    res.json(trips);
  } catch (error: any) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Failed to retrieve trips', details: error.message });
  }
});

app.get('/api/trips/:id', async (req: Request, res: Response) => {
  try {
    const trip = await dbService.getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json(trip);
  } catch (error: any) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ error: 'Failed to retrieve trip', details: error.message });
  }
});

app.post('/api/trips', async (req: Request, res: Response) => {
  try {
    const trip: TripPlan = req.body;
    if (!trip.name || !trip.duration) {
      return res.status(400).json({ error: 'Invalid trip: name and duration are required' });
    }
    if (!trip.id) {
      trip.id = `trip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
    if (!trip.createdAt) {
      trip.createdAt = new Date().toISOString();
    }
    await dbService.saveTrip(trip);
    res.status(201).json({ message: 'Trip saved successfully', trip });
  } catch (error: any) {
    console.error('Error saving trip:', error);
    res.status(500).json({ error: 'Failed to save trip', details: error.message });
  }
});

app.delete('/api/trips/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await dbService.deleteTrip(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Trip not found or already deleted' });
    }
    res.json({ message: 'Trip deleted successfully', id: req.params.id });
  } catch (error: any) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Failed to delete trip', details: error.message });
  }
});

// --- Saved Destinations (Bookmarks) API ---
app.get('/api/saved', async (_req: Request, res: Response) => {
  try {
    const destinations = await dbService.getSavedDestinations();
    const ids = await dbService.getSavedDestinationIds();
    res.json({ destinations, savedIds: ids });
  } catch (error: any) {
    console.error('Error fetching saved destinations:', error);
    res.status(500).json({ error: 'Failed to fetch saved destinations', details: error.message });
  }
});

app.post('/api/saved/:id', async (req: Request, res: Response) => {
  try {
    const destinationId = req.params.id;
    await dbService.saveDestination(destinationId);
    res.status(201).json({ message: 'Destination bookmarked successfully', destinationId });
  } catch (error: any) {
    console.error('Error saving bookmark:', error);
    res.status(500).json({ error: 'Failed to bookmark destination', details: error.message });
  }
});

app.delete('/api/saved/:id', async (req: Request, res: Response) => {
  try {
    const destinationId = req.params.id;
    await dbService.removeSavedDestination(destinationId);
    res.json({ message: 'Destination removed from bookmarks', destinationId });
  } catch (error: any) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ error: 'Failed to remove bookmark', details: error.message });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 TripMeta API Server running with SQLite on http://localhost:${PORT}`);
});
