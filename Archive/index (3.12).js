//Completed 3.1-3.7
//Completed 3.9-3.11
//Completed 3.12 (mongo.js)
//https://fso-part3-10.herokuapp.com/

const http = require('http')
const express = require('express')
var morgan = require('morgan')

const app = express()
app.use(express.json());

app.use(morgan('tiny'));

//Part 3.9
// const cors = require('cors')
// app.use(cors())

//Part 3.11 frontend build
app.use(express.static('build'))

let contacts=[
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get("/",(req,res)=>{
  res.send("build")
})

app.get("/info",(req,res)=>{
  let date = new Date();
  res.send("Phonebook has info for " + contacts.length +" people" + "<br/>" + date);
})

app.get("/api/persons",(req,res)=>{
  res.send(contacts)
})

app.get("/api/persons/:postId",(req,res)=>{
  const id = Number(req.params.postId)
  let contactFound = contacts.find(element => element.id === id)
  if (!contactFound){
    res.status(404).end();
  }
  res.send(contactFound);
})

app.delete("/api/persons/:postId",(req,res)=>{
  const id = Number(req.params.postId)
  contacts = contacts.filter(element => element.id !== id)
  res.status(204).end()
})

app.post("/api/persons",(req,res)=>{
  const id = Math.floor(Math.random()*100);
  const name = req.body.name;
  const number = req.body.number;
  let nameRepeat = contacts.find(element => element.name === name);
  contacts.push({name,number,"id":id})
  if (nameRepeat){
    res.status(400).end('Name must be unique')
  }
  else if (!name || !number){
    res.status(400).end('Fields cannot be blank')
  }
  console.log(req.body);
  res.send(contacts)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
