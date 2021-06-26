//Part 3.12

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2];

const url = "mongodb+srv://admin-benzsen:test123@cluster0.ml9kl.mongodb.net/part3phonebook?retryWrites=true&w=majority"

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if((process.argv[3]) && process.argv[4]){
  const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
  })

  person.save().then(result => {
    console.log("added " + person.name +" number" + person.number + "to phonebook")
    mongoose.connection.close()
  })
}
else{
  Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person.name +" "+person.number)
  })
  mongoose.connection.close()
  })
}
