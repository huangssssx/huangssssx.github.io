import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

console.log('MONGODB_URI:', MONGODB_URI ? MONGODB_URI.substring(0, 30) + '...' : 'UNDEFINED');

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

declare global {
  var _mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log('[db] connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    }).then((conn) => {
      console.log('[db] MongoDB connected successfully');
      return conn;
    }).catch((err) => {
      console.error('[db] MongoDB connection failed:', err.message);
      cached.promise = null;
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
