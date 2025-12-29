// lib/db.js
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) throw new Error("Please add your Mongo URI to .env");

if (process.env.NODE_ENV === "development") {
  // Avoid multiple instances in dev hot reload
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Single instance in production
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

module.exports = { clientPromise };
