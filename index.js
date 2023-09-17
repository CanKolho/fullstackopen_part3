require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person.js')

const app = express()

morgan.token('postData', function (req) {
  return req.method === 'POST' ? JSON.stringify(req.body) : ' '
})

app.use(cors())
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :postData')
)
app.use(express.static('dist'))

const showErrorMsg = (res, msg) => {
  return res.status(400).json({ 
    error: msg 
  })
}

app.get('/info', (req, res) => {
  Person.find({})
    .then(people => {
    res.send(`
      <p>Phonebook has info for ${people.length} people</p>
      <p>${new Date()}</p>
    `)
    })
    .catch(error => console.log(error))
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => console.log(error))
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => console.log(error))
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body

  if (!name) {
    return showErrorMsg(res, 'Name missing')
  }

  if (!number) {
    return showErrorMsg(res, 'Number missing')
  }

  const person = new Person({
    name: name,
    number: number,
  })

  person
    .save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => console.log(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})