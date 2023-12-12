const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.json())

morgan.token('response_body', function (req, res) { return JSON.stringify(req.body) })
const tinyFormat = ':method :url :status :res[content-length] - :response-time ms'
const responseBodyFormat = ':response_body'
app.use(morgan(tinyFormat + ' ' + responseBodyFormat))

const cors = require('cors')
app.use(cors())

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

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }

    const person = {
        id: Math.floor(Math.random() * 10000),
        name: body.name,
        number: body.number

    }

    persons = persons.concat(person)
    response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})