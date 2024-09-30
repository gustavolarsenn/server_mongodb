const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection string
const uri = `mongodb+srv://${process.env.user_mongodb}:${process.env.password_mongodb}@${process.env.project_mongodb}.gl8zm.mongodb.net/${process.env.db_mongodb}?retryWrites=true&w=majority&appName=${process.env.app_name_mongodb}`;

// Middleware to parse JSON bodies
app.use(express.json());


require("./api/mongo/mongo.js")(app);
// Connect to MongoDB


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



// MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(client => {
//     const db = client.db(process.env.db_mongodb);
//     const collection = db.collection(process.env.collection_mongodb);

//     // Endpoint to insert data
//     app.post('/data', (req, res) => {
//       const data = req.body;
//       collection.insertOne(data)
//         .then(result => {
//           res.status(200).send('Dados inseridos');
//         })
//         .catch(error => {
//           res.status(500).send('Erro ao inserir dados');
//         });
//     });

//     app.get('/', (req, res) => {
//       res.sendFile(__dirname + '/index.html');
//     });
//     // Start the server
//     app.listen(port, () => {
//       console.log(`Server running on port ${port}`);
//     });
//   })
//   .catch(error => console.error(error));