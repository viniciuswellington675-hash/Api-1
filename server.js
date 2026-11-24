const express = require ('express');
const api = express ();
const {MongoClient} = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const dotenv = require ('dotenv');

dotenv.config()

const url = process.env.DATABASE_URL

const client = new MongoClient(url)
let collection

api.set('view engine', 'ejs')
api.use(express.urlencoded({ extended: true }))

api.get('/index', (req, res) => {
    res.render('index.ejs');
});

api.post('/show', async (req, res) => {
    await collection.insertOne({
        nome: req.body.nome,
        cpf: req.body.cpf,
        email: req.body.email,
        telefone: req.body.telefone
    });
    res.redirect('/show')
})

api.get('/show', async (req, res) => {
    const crud = await collection.find().toArray()
    res.render('show.ejs', {crud})
})

api.get('/edit/:id', async(req, res) =>{
    const crud = await collection.find({_id: new ObjectId (req.params.id)}).toArray()
    res.render('edit.ejs', {crud})
})

api.post('/edit/:id', async(req, res) =>{
    await collection.updateOne(
        {_id: new ObjectId(req.params.id)},
        {
            $set:{
                 nome: req.body.nome,
                 cpf: req.body.cpf,
                 email: req.body.email,
                 telefone: req.body.telefone
            }
        }
    )
    res.redirect('/show')
})

api.get('/delete/:id', async (req, res) =>{
    await collection.deleteOne({_id: new ObjectId(req.params.id)})
    res.redirect('show')
})

async function iniciar(){
    await client.connect()
    const db = client.db('aluno')
    collection = db.collection('crud')
    console.log("conectou com o nosso banco")

    api.listen(3000, function(){
    console.log("o nosso servidor esta rodando a porta 3000")
})
}

iniciar().catch(function(erro){
    console.error("erro ao iniciar", erro)
})
