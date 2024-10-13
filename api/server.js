const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection string
const uri = `mongodb+srv://${process.env.user_mongodb}:${process.env.password_mongodb}@${process.env.project_mongodb}.gl8zm.mongodb.net/${process.env.db_mongodb}?retryWrites=true&w=majority&appName=${process.env.app_name_mongodb}`;

// Middleware to parse JSON bodies
app.use(express.json());

async function fetchRainData(){
  const ID_CIDADE = '4970'
  const TOKEN_CLIMATEMPO = '247b20282967aedbad798b36adc5e6ab'
  try{
    const res = await fetch(`http://apiadvisor.climatempo.com.br/api/v1/forecast/locale/${ID_CIDADE}/days/15?token=${TOKEN_CLIMATEMPO}`)
    
    const data = await res.json()

    const rainData = {
      cityId: data.id,
      cityName: data.name,
      cityState: data.state,
      cityCountry: data.country,
      api: data.meteogram,
      rainForecast: {
        date: data.data[0].date,
        date_br: data.data[0].date_br,
        rainPrecipitation: data.data[0].rain.precipitation,
        rainProbability: data.data[0].rain.probability
      }
    }

    return rainData
  } catch (error) {
    console.error(error)
    return "Erro ao buscar dados: " + error
  }
}

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    const db = client.db(process.env.db_mongodb);
    const collection = db.collection(process.env.collection_mongodb);

    // Endpoint to insert data
    app.post('/api/data', async (req, res) => {
      const data = req.body;

      const rainData = await fetchRainData()

      data.rainData = rainData
      
      collection.insertOne(data)
        .then(result => {
          res.status(200).send('Dados inseridos');
        })
        .catch(error => {
          res.status(500).send('Erro ao inserir dados');
        });
    });

    app.get('/rainData', (req, res) => {
      const data = fetchRainData()
      res.send(data)
    });
    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html');
    });
    // Start the server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(error => console.error(error));