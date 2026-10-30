import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { Destination, TripPlan } from '../types';
import { seedDestinations } from '../data/seed';

// Resolve database path in the backend directory
const DB_PATH = path.resolve(__dirname, '../../tripmeta.db');

export class DatabaseService {
  private db: sqlite3.Database;
  private isInitialized = false;

  constructor() {
    // Ensure sqlite3 verbose mode
    const sqlite = sqlite3.verbose();
    this.db = new sqlite.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ Failed to open SQLite database:', err.message);
      } else {
        console.log(`📦 Connected to SQLite database at: ${DB_PATH}`);
      }
    });
  }

  // Promise-based run
  private run(sql: string, params: any[] = []): Promise<{ id?: number; changes?: number }> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  // Promise-based get
  private get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(row as T);
      });
    });
  }

  // Promise-based all
  private all<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve((rows || []) as T[]);
      });
    });
  }

  // Serialize Destination into DB row format
  private serializeDestination(dest: Destination) {
    return {
      id: dest.id,
      name: dest.name,
      state: dest.state,
      description: dest.description,
      categories: JSON.stringify(dest.categories || []),
      interests: JSON.stringify(dest.interests || []),
      best_season: JSON.stringify(dest.best_season || []),
      facilities: JSON.stringify(dest.facilities || []),
      estimated_budget_min: dest.estimated_budget_min,
      estimated_budget_max: dest.estimated_budget_max,
      recommended_duration_min: dest.recommended_duration_min,
      recommended_duration_max: dest.recommended_duration_max,
      traveller_types: JSON.stringify(dest.traveller_types || []),
      rating: dest.rating,
      latitude: dest.latitude,
      longitude: dest.longitude,
      image: dest.image,
      nearby_places: JSON.stringify(dest.nearby_places || []),
      things_to_do: JSON.stringify(dest.things_to_do || []),
      how_to_reach: JSON.stringify(dest.how_to_reach || []),
      stay_options: JSON.stringify(dest.stay_options || []),
      restaurant_options: JSON.stringify(dest.restaurant_options || [])
    };
  }

  // Deserialize DB row back into clean typed Destination
  private deserializeDestination(row: any): Destination {
    const parse = (val: any, fallback: any) => {
      if (!val) return fallback;
      if (typeof val === 'object') return val;
      try {
        return JSON.parse(val);
      } catch {
        return fallback;
      }
    };

    return {
      id: row.id,
      name: row.name,
      state: row.state,
      description: row.description,
      categories: parse(row.categories, []),
      interests: parse(row.interests, []),
      best_season: parse(row.best_season, []),
      facilities: parse(row.facilities, []),
      estimated_budget_min: Number(row.estimated_budget_min),
      estimated_budget_max: Number(row.estimated_budget_max),
      recommended_duration_min: Number(row.recommended_duration_min),
      recommended_duration_max: Number(row.recommended_duration_max),
      traveller_types: parse(row.traveller_types, []),
      rating: Number(row.rating),
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      image: row.image,
      nearby_places: parse(row.nearby_places, []),
      things_to_do: parse(row.things_to_do, []),
      how_to_reach: parse(row.how_to_reach, []),
      stay_options: parse(row.stay_options, []),
      restaurant_options: parse(row.restaurant_options, []),
      created_at: row.created_at
    };
  }

  // Initialize DB tables and seed if empty
  public async init(): Promise<void> {
    if (this.isInitialized) return;

    await this.run(`
      CREATE TABLE IF NOT EXISTS destinations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        state TEXT NOT NULL,
        description TEXT NOT NULL,
        categories TEXT NOT NULL,
        interests TEXT NOT NULL,
        best_season TEXT NOT NULL,
        facilities TEXT NOT NULL,
        estimated_budget_min REAL NOT NULL,
        estimated_budget_max REAL NOT NULL,
        recommended_duration_min INTEGER NOT NULL,
        recommended_duration_max INTEGER NOT NULL,
        traveller_types TEXT NOT NULL,
        rating REAL NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        image TEXT NOT NULL,
        nearby_places TEXT NOT NULL,
        things_to_do TEXT NOT NULL,
        how_to_reach TEXT NOT NULL,
        stay_options TEXT NOT NULL,
        restaurant_options TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        duration INTEGER NOT NULL,
        destinations TEXT NOT NULL,
        days TEXT NOT NULL,
        total_budget REAL DEFAULT 0,
        notes TEXT DEFAULT '',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS saved_destinations (
        id TEXT PRIMARY KEY,
        destination_id TEXT NOT NULL UNIQUE,
        saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (destination_id) REFERENCES destinations (id) ON DELETE CASCADE
      )
    `);

    // Check count of destinations
    const countRow = await this.get<{ count: number }>(`SELECT COUNT(*) as count FROM destinations`);
    if (!countRow || countRow.count === 0) {
      console.log('🌱 SQLite destinations table is empty. Seeding initial destinations...');
      const initialDests = seedDestinations();
      for (const dest of initialDests) {
        await this.insertDestination(dest);
      }
      console.log(`✅ Successfully seeded ${initialDests.length} destinations into SQLite.`);
    } else {
      const initialDests = seedDestinations();
      for (const dest of initialDests) {
        await this.run(`UPDATE destinations SET image = ? WHERE id = ? OR LOWER(name) = LOWER(?)`, [
          dest.image,
          dest.id,
          dest.name
        ]);
      }
      console.log('🔄 Synced destination images with latest catalog.');
    }

    this.isInitialized = true;
  }

  public async insertDestination(dest: Destination): Promise<void> {
    const s = this.serializeDestination(dest);
    const sql = `
      INSERT OR REPLACE INTO destinations (
        id, name, state, description, categories, interests, best_season, facilities,
        estimated_budget_min, estimated_budget_max, recommended_duration_min, recommended_duration_max,
        traveller_types, rating, latitude, longitude, image, nearby_places, things_to_do,
        how_to_reach, stay_options, restaurant_options
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      s.id, s.name, s.state, s.description, s.categories, s.interests, s.best_season, s.facilities,
      s.estimated_budget_min, s.estimated_budget_max, s.recommended_duration_min, s.recommended_duration_max,
      s.traveller_types, s.rating, s.latitude, s.longitude, s.image, s.nearby_places, s.things_to_do,
      s.how_to_reach, s.stay_options, s.restaurant_options
    ];
    await this.run(sql, params);
  }

  public async getAllDestinations(filters?: { category?: string; state?: string; search?: string }): Promise<Destination[]> {
    let query = `SELECT * FROM destinations WHERE 1=1`;
    const params: any[] = [];

    if (filters?.category) {
      query += ` AND categories LIKE ?`;
      params.push(`%"${filters.category}"%`);
    }

    if (filters?.state) {
      query += ` AND state = ?`;
      params.push(filters.state);
    }

    if (filters?.search) {
      query += ` AND (name LIKE ? OR state LIKE ? OR description LIKE ?)`;
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    query += ` ORDER BY rating DESC`;

    const rows = await this.all<any>(query, params);
    return rows.map((r) => this.deserializeDestination(r));
  }

  public async getDestinationById(id: string): Promise<Destination | null> {
    const row = await this.get<any>(`SELECT * FROM destinations WHERE id = ?`, [id]);
    if (!row) return null;
    return this.deserializeDestination(row);
  }

  // --- Trips Management ---
  public async getAllTrips(): Promise<TripPlan[]> {
    const rows = await this.all<any>(`SELECT * FROM trips ORDER BY createdAt DESC`);
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      duration: r.duration,
      destinations: JSON.parse(r.destinations || '[]'),
      days: JSON.parse(r.days || '[]'),
      total_budget: r.total_budget,
      notes: r.notes,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
    }));
  }

  public async getTripById(id: string): Promise<TripPlan | null> {
    const r = await this.get<any>(`SELECT * FROM trips WHERE id = ?`, [id]);
    if (!r) return null;
    return {
      id: r.id,
      name: r.name,
      duration: r.duration,
      destinations: JSON.parse(r.destinations || '[]'),
      days: JSON.parse(r.days || '[]'),
      total_budget: r.total_budget,
      notes: r.notes,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
    };
  }

  public async saveTrip(trip: TripPlan): Promise<void> {
    const sql = `
      INSERT INTO trips (id, name, duration, destinations, days, total_budget, notes, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        duration = excluded.duration,
        destinations = excluded.destinations,
        days = excluded.days,
        total_budget = excluded.total_budget,
        notes = excluded.notes,
        updatedAt = excluded.updatedAt
    `;
    const now = new Date().toISOString();
    await this.run(sql, [
      trip.id,
      trip.name,
      trip.duration,
      JSON.stringify(trip.destinations || []),
      JSON.stringify(trip.days || []),
      trip.total_budget || 0,
      trip.notes || '',
      trip.createdAt || now,
      now
    ]);
  }

  public async deleteTrip(id: string): Promise<boolean> {
    const result = await this.run(`DELETE FROM trips WHERE id = ?`, [id]);
    return (result.changes ?? 0) > 0;
  }

  // --- Saved Destinations (Bookmarks) ---
  public async getSavedDestinations(): Promise<Destination[]> {
    const rows = await this.all<any>(`
      SELECT d.* FROM destinations d
      INNER JOIN saved_destinations s ON d.id = s.destination_id
      ORDER BY s.saved_at DESC
    `);
    return rows.map(r => this.deserializeDestination(r));
  }

  public async getSavedDestinationIds(): Promise<string[]> {
    const rows = await this.all<{ destination_id: string }>(`SELECT destination_id FROM saved_destinations`);
    return rows.map(r => r.destination_id);
  }

  public async saveDestination(destinationId: string): Promise<void> {
    const id = `saved_${destinationId}_${Date.now()}`;
    await this.run(
      `INSERT OR IGNORE INTO saved_destinations (id, destination_id) VALUES (?, ?)`,
      [id, destinationId]
    );
  }

  public async removeSavedDestination(destinationId: string): Promise<boolean> {
    const result = await this.run(
      `DELETE FROM saved_destinations WHERE destination_id = ?`,
      [destinationId]
    );
    return (result.changes ?? 0) > 0;
  }
}

export const dbService = new DatabaseService();

