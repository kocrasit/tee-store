import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs/promises';

let mongo: MongoMemoryServer;
let baselineUploads = new Set<string>();

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
  process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret';
  process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
  process.env.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());

  // Uploads cleanup baseline (avoid deleting existing repo files)
  const existing = await fs.readdir('uploads').catch(() => []);
  baselineUploads = new Set(existing);
});

afterEach(async () => {
  const db = mongoose.connection.db;
  if (!db) return;
  const collections = await db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();

  // Remove only files created during this test run
  const current = await fs.readdir('uploads').catch(() => []);
  const toDelete = current.filter((f) => !baselineUploads.has(f));
  await Promise.all(
    toDelete.map((f) => fs.unlink(`uploads/${f}`).catch(() => undefined))
  );
});


