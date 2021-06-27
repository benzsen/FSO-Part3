//Part 3.13-3.14
//Database config in one module

const mongoose = require('mongoose')

const url = "mongodb+srv://admin-benzsen:"+"password"+"@cluster0.ml9kl.mongodb.net/part3phonebook?retryWrites=true&w=majority"

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

//const Person = mongoose.model('Person', personSchema)
module.exports = mongoose.model('Person', personSchema)
