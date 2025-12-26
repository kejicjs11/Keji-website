import { MongoClient } from "mongodb";

// Use a cached connection to prevent multiple connections in serverless
let cachedClient = null;
let cachedDb = null;

export async function connectDB() {
  if (cachedDb) {
    return cachedDb;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("Please add MONGO_URI environment variable in Vercel");
  }

  const client = new MongoClient(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db("abrakahomes"); // Database name
  cachedClient = client;
  cachedDb = db;

  return db;
}
