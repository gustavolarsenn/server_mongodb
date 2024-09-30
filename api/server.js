const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 3000;

app.use(express.json());

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db(process.env.db_mongodb);
    const collection = db.collection(process.env.collection_mongodb);

    app.post('/data', (req, res) => {
      const data = req.body;
      console.log('Received data:', data);
      collection.insertOne(data)
        .then(result => {
          res.status(200).send('Dados inseridos');
        })
        .catch(error => {
          console.error('Error inserting data:', error);
          res.status(500).send('Erro ao inserir dados');
        });
    });

    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html');
    });
  })
  .catch(error => console.error('Error connecting to MongoDB:', error));

module.exports = app;
module.exports.handler = (req, res) => {
  app(req, res);
};