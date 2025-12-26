const { MongoClient } = require("mongodb");

let cachedClient = null;
let cachedDb = null;

async function connectDB() {
  if (cachedDb) return cachedDb;

  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not set");

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db("abrakahomes"); // database name does NOT need to match site name
  cachedClient = client;
  cachedDb = db;

  return db;
}

module.exports = { connectDB };
