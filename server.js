const express = require('express')
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const app = express()
const uri = "mongodb+srv://user01:010120@cluster0.mk5oh.mongodb.net/teste?retryWrites=true&w=majority";



MongoClient.connect(uri, (err, client) => {
  if (err) return console.log(err)
  db = client.db('user01-nodejs')
  app.listen(8080, () => {
    console.log('server rodando na porta 8080')
  })
})

app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index.ejs', { msg: "", err: "" })
});

app.get('/registro', (req, res) => {
  res.render('registro.ejs', { msg: "", err: "" })
})



app.get('/show', async (req, res) => {
  db.collection('data').find().toArray((err, results) => {
    if (err) return console.log(err)
    console.log(results);
    res.render('show.ejs', { data: results, msg: "", err: "" })

  })
})

app.post('/show', (req, res) => {
  db.collection('data').insertOne(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('Salvo no Banco de Dados')

    db.collection('data').find().toArray((err, results) => {
      if (err) return console.log(err)

      res.render('show.ejs', { data: results, msg: "Salvo com sucesso no banco de dados", err: "" })

    })
  })
})

app.get('/edit/:id', (req, res) => {
  var id = req.params.id
  db.collection('data').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('edit.ejs', { data: result, msg: "", err: "" })
  })
})

app.post('/edit/:id', async (req, res) => {
  var id = req.params.id
  var nome = req.body.nome
  var email = req.body.email
  var telefone = req.body.telefone
  db.collection('data').updateOne({ _id: ObjectId(id) }, {
    $set: {
      nome: nome,
      email: email,
      telefone: telefone
    }
  })
  db.collection('data').find().toArray((err, results) => {
    if (err) return console.log(err)

    res.render('show.ejs', { data: results, msg: "Editado com sucesso", err: "" })

  })
})

app.route('/delete/:id')
  .get((req, res) => {
    var id = req.params.id

    db.collection('data').deleteOne({ _id: ObjectId(id) }, (err, results) => {
      if (err) res.render('show.ejs', { data: results, msg: "", err: "Não foi possível deletar o registro" })

      db.collection('data').find().toArray((err, results) => {
        if (err) res.render('show.ejs', { data: results, err: "Não foi possível retornar os registros" })

        res.render('show.ejs', { data: results, msg: "Removido com sucesso", err: "" })

      })
    })
  })