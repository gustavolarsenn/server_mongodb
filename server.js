const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection string
const uri = "mongodb+srv://williamgl02:bmgr3foZlaPF5bTW@iotchuva.gl8zm.mongodb.net/iotChuvaDB?retryWrites=true&w=majority&appName=iotChuva";

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    const db = client.db('iotChuvaDB');
    const collection = db.collection('temperaturaDados');

    // Endpoint to insert data
    app.post('/data', (req, res) => {
      const data = req.body;
      collection.insertOne(data)
        .then(result => {
          res.status(200).send('Dados inseridos');
        })
        .catch(error => {
          res.status(500).send('Erro ao inserir dados');
        });
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(error => console.error(error));