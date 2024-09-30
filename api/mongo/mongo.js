// api/hello.js
export default async function handler(collection, req, res) {
    const data = req.body;
    collection.insertOne(data)
      .then(result => {
        res.status(200).send('Dados inseridos');
      })
      .catch(error => {
        res.status(500).send('Erro ao inserir dados');
      });
  };
