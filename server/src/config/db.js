import mongoose from 'mongoose';

async function getPublicIp() {
  try {
    const response = await fetch('https://api.ipify.org');
    return response.ok ? await response.text() : null;
  } catch {
    return null;
  }
}

function getCached() {
  if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
  }
  return global.mongoose;
}

export async function connectDB(retries = process.env.VERCEL ? 1 : 5, delayMs = 3000) {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set in environment variables');
  }

  const cached = getCached();
  if (cached.conn) {
    return cached.conn;
  }

  if (cached.promise) {
    cached.conn = await cached.promise;
    return cached.conn;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      cached.promise = mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
      cached.conn = await cached.promise;
      console.log('Connected to MongoDB');
      return cached.conn;
    } catch (error) {
      cached.promise = null;
      const isLastAttempt = attempt === retries;

      if (!isLastAttempt) {
        console.log(
          `MongoDB connection attempt ${attempt}/${retries} failed, retrying in ${delayMs / 1000}s...`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      const ip = await getPublicIp();
      const lines = [
        error.message,
        '',
        'Atlas fix:',
        '1. Open https://cloud.mongodb.com → your project',
        '2. Network Access → Add IP Address',
        ip
          ? `3. Add this IP: ${ip}  (or use "Allow Access from Anywhere" for dev)`
          : '3. Add your current IP (or use "Allow Access from Anywhere" for dev)',
        '4. Wait 1–2 minutes, then restart the server',
      ];

      throw new Error(lines.join('\n'));
    }
  }
}