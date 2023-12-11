const express = require('express')
const app = express()

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('Main Page')
})

app.get('/info', (request, response) => {
    const phonebookLenght = persons.length
    const currentDate = new Date();
    
    const firstLine = `<p>Phonebook has info for ${phonebookLenght} people</p>`
    const secondLine = `<p>${currentDate}</p>`
    const message = firstLine + secondLine
    response.send(message)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)