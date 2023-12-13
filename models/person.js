const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

var numberFormatValidator = function (string) {
    var myRegxp = /^(\d{2,3}-)?\d{6,}$/
    return myRegxp.test(string)
}

var minLengthValidator = function (string) {
    // 8 numbers + "-"
    return string.length < 9 
}

var numberValidators = [
    { validator: minLengthValidator, msg: 'Person validation failed: number: Wrong format, example formats -> 09-1234556 and 040-22334455' },
    { validator: numberFormatValidator, msg: 'Phone number must have atleast 8 numbers' },  
]

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        validate: numberValidators,
        required: [true, 'Person phone number required']
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)