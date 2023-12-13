const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        //validate: numberValidators,
        validate: [
            {
                validator: function (string) {
                    // 8 numbers + "-" = 9
                    return string.length >= 9
                },
                message: 'Phone number must have atleast 8 numbers'
            },
            {
                validator: function (string) {
                    return /\d{2,3}-\d+$/.test(string);
                },
                message: 'Person validation failed: number: Wrong format, example formats: 09-1234556 and 040-22334455'
            }
        ],
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