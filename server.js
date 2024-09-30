const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

const uri = process.env.MONGODB_URI;
const dbName = process.env.db_mongodb;
const collectionName = process.env.collection_mongodb;

// Middleware to parse JSON bodies
app.use(express.json());

let cachedDb = null;
let cachedClient = null;

// Connect to MongoDB and cache the connection
async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db(dbName);
  
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// POST Endpoint to insert data
app.post('/data', async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection(collectionName);

    const data = req.body;
    await collection.insertOne(data);
    res.status(200).send('Dados inseridos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao inserir dados');
  }
});

// Export the Express app as a serverless function
module.exports = app;
module.exports.handler = (req, res) => {
  app(req, res); // Handles the serverless function request
};
