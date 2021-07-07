//Completed 3.1-3.7
//Completed 3.9-3.11
//Completed 3.12 (mongo.js)
//Completed 3.13-3.14
//Completed 3.15-3.18
//https://fso-part3-complete.herokuapp.com/

require('dotenv').config()
const http = require('http')
const express = require('express')

//Part 3.7 Logging Middleware
var morgan = require('morgan')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()
app.use(express.json())

app.use(morgan('tiny'))

//Part 3.9
// const cors = require('cors')
// app.use(cors())

//Part 3.11 frontend build
app.use(express.static('build'))

//Part 3.16
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidtionError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

//May need to comment this out to truly tie to DB
//Need to do duplicate checks on DB first
//Need to add initial contacts here since data already in DB won't be updated here
// let contacts=[
//   {
//     "name": "Arto Hellas",
//     "number": "040-123456",
//     "id": 1
//   },
//   {
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523",
//     "id": 2
//   },
//   {
//     "name": "Dan Abramov",
//     "number": "12-43-234345",
//     "id": 3
//   },
//   {
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122",
//     "id": 4
//   }
// ]
let contacts=[]
Person.find({}).then(people => {
  contacts=people
})

app.get('/',(req,res)=>{
  res.send('build')
})

app.get('/info',(req,res)=>{
  let date = new Date()
  res.send('Phonebook has info for ' + contacts.length +' people' + '<br/>' + date)
})

// Part 3.13
// app.get("/api/persons",(req,res)=>{
//   res.send(contacts)
// })
app.get('/api/persons',(req,res)=>{
  Person.find({}).then(people => {
    res.json(people)
  })
})

app.get('/api/persons/:id',(req,res,next)=>{
  const id = (req.params.id)
  console.log(id)
  Person.findById(id)
    .then(result => {
      console.log(result)
      res.json(result)
      res.status(204).end()
    })
    .catch(error => next())
})

app.delete('/api/persons/:id',(req,res,next)=>{
  //Part 3.15 mongoDB "_id" is not just numbers
  //const id = Number(req.params.id)
  const id = (req.params.id)
  //From Part 2
  //contacts = contacts.filter(element => element.id !== id)

  Person.findByIdAndRemove(id)
    .then(result=>{
      res.status(204).end()
    })
    .catch(error => next())

  res.status(204).end()
})

app.post('/api/persons',(req,res,next)=>{
  const id = Math.floor(Math.random()*100)
  const name = req.body.name
  const number = req.body.number
  //console.log(req.body)

  let nameRepeat = contacts.find(element => element.name === name)

  //Part 3.14
  const person = new Person({
    name: name,
    number: number
  })

  if (nameRepeat){
    res.status(400).end('Name must be unique')
  }
  else if (name=='' || number==''){
    res.status(400).end('Fields cannot be blank')
  }
  else {
    person.save()
      .then(result => {
        console.log('added ' + person.name +' number' + person.number + 'to phonebook')
        mongoose.connection.close()
      })
      .catch(error => next(error))
  }

  //From Part 2
  //contacts.push({name,number,"id":id})

  //Part 3.14
  //Res to trigger front end styling (Green Notif)
  res.send(contacts)
})

app.put('/api/persons/:id',(req,res,next)=>{
  const name = req.body.name
  const number = req.body.number

  const person = {
    name: req.body.name,
    number: req.body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next())

  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
