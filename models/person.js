//Part 3.13-3.14
//Database config in one module

const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log("Connecting to: ",url);

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    required: true
  },
  number: {
    type: String,
    minLength: 7,
    required: true
  }
})

//const Person = mongoose.model('Person', personSchema)
module.exports = mongoose.model('Person', personSchema)
