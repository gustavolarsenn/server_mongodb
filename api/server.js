const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    const db = client.db(process.env.db_mongodb);
    const collection = db.collection(process.env.collection_mongodb);

    // Endpoint to insert data
    app.post('/api/data', (req, res) => {
      const data = req.body;
      collection.insertOne(data)
        .then(result => {
          res.status(200).send('Dados inseridos');
        })
        .catch(error => {
          res.status(500).send('Erro ao inserir dados');
        });
    });

    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html');
    });
  })
  .catch(error => console.error(error));

// Export the app as a serverless function
module.exports = app;
module.exports.handler = (req, res) => {
  app(req, res);
};