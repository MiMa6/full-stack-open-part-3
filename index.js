require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(express.static('dist'))

morgan.token('response_body', function (req, res) { return JSON.stringify(req.body) })
const tinyFormat = ':method :url :status :res[content-length] - :response-time ms'
const responseBodyFormat = ':response_body'
app.use(morgan(tinyFormat + ' ' + responseBodyFormat))

const cors = require('cors')
app.use(cors())

app.get('/info', (request, response,) => {
    Person.find({})
    .then(persons => {
        const phonebookLenght = persons.length
        console.log(`Number of persons in collection: ${phonebookLenght}`)
        const currentDate = new Date();
        const firstLine = `<p>Phonebook has info for ${phonebookLenght} people</p>`
        const secondLine = `<p>${currentDate}</p>`
        const message = firstLine + secondLine
        response.send(message)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            console.log(persons)
            response.json(persons)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {

    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                console.log(person)
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined || body.name === '') {
        console.log('name is missing')
        return response.status(400).json({
            error: 'name is missing'
        })
    }

    if (body.number === undefined || body.number === '') {
        console.log('number is missing')
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))

})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})