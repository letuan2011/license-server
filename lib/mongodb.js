const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI");
}

// dùng global để cache
let cached = global._mongo;

if (!cached) {
  cached = global._mongo = { client: null, db: null };
}

async function connectToDatabase() {
  if (cached.client && cached.db) {
    return cached;
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  await client.connect();

  const db = client.db("license-server");

  cached.client = client;
  cached.db = db;

  return cached;
}

module.exports = { connectToDatabase };
