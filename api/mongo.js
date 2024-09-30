const { MongoClient } = require('mongodb');
const router = express.Router();

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    const db = client.db(process.env.db_mongodb);
    const collection = db.collection(process.env.collection_mongodb);

    // Endpoint to insert data
    router.post('/data', (req, res) => {
      const data = req.body;
      collection.insertOne(data)
        .then(result => {
          res.status(200).send('Dados inseridos');
        })
        .catch(error => {
          res.status(500).send('Erro ao inserir dados');
        });
    })
    });