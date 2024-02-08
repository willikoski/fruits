require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const jsxEngine = require('jsx-view-engine')
const Fruit = require('./models/fruit')
const PORT = process.env.PORT || 3000

const app = express()

app.use(express.urlencoded({extended: true})) //for serverside rendered site
// app.use(express.json()) for building an API

//view engine
app.set('view engine', 'jsx')
app.engine('jsx', jsxEngine())

mongoose.connect(process.env.MONGO_URI)
mongoose.connection.once('open', () => {
    console.log('connected to mongo')
})

//INDUCES (types of restful routes)

//index (show list of all fruits)
app.get('/fruits', async (req, res) => {
    try {
        const foundFruits = await Fruit.find({})
        res.render('fruits/Index', {
            fruits: foundFruits
        })
    }
    catch(error) {
        res.status(400).send({message: error.message})
    }
})


//new (show user a form to create a fruit) --> diff from create cuz shows a form
app.get('/fruits/new', (req, res) => {
    res.render('fruits/New')
})


//delete (backend only - used to delete a fruit)

//update (backend only - used to update a fruit)

//create (backend only - used to create a fruit) --> connects to form in backend
app.post('/fruits', async (req, res) => {
    if(req.body.readyToEat === 'on'){
        req.body.readyToEat = true
    } 
    else {
        req.body.readyToEat = false
    }
    try {
        const createdFruit = await Fruit.create(req.body)
        res.redirect(`/fruits/${createdFruit._id}`)
    } 
    catch(error) {
        res.status(400).send({message: error.message})
    }

    console.log(req.body)
})

//edit (shows a form so you can edit the fruit) --> connects to update/delete

//show (shows you 1 individual fruit)
app.get('/fruits/:id', async (req, res) => {
    try {
        const foundFruit = await Fruit.findOne({_id: req.params.id})
        res.render('fruits/Show', {
        fruit: foundFruit
        })
    }
    catch(error) {
        res.status(400).send({ message: error.message })
    }
})


//PORT
app.listen(PORT, () => {
    console.log(`ayo the port at ${PORT} is lit`)
})