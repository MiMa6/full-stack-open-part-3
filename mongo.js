const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length === 4 || process.argv.length > 5) {
  console.log('give password, name and number as argument to save person')
  console.log('give password as argument without name and number to find all persons')
  process.exit(1)
}

const password = process.argv[2]
const dbName = 'phonebookApp'

const url =
    `mongodb+srv://fullstack:${password}@cluster0.c7jltpn.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// Find all persons saved to db
if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
  })
}

// Add person to db
if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

