const { MongoClient } = require("mongodb");

let cachedClient = null;
let cachedDb = null;

async function connectDB() {
  if (cachedDb) {
    return cachedDb;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not set");
  }

  const client = new MongoClient(process.env.MONGO_URI);

  await client.connect();

  const db = client.db("abrakahomes");

  cachedClient = client;
  cachedDb = db;

  return db;
}

module.exports = { connectDB };
