const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('postData', function (req) {
  return req.method === 'POST' ? JSON.stringify(req.body) : ' '
})

app.use(cors())
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :postData')
)

let persons = [
  {
    id: 1, 
    name: "Arto Hellas",
    number: "040-12456"  
  },  
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"  
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"  
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"  
  },
]

const generateRandomId = () => {
  return Math.floor(Math.random() * 10000)
}

const showErrorMsg = (res, msg) => {
  return res.status(400).json({ 
    error: msg 
  })
}

app.get('/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body

  if (!name) {
    return showErrorMsg(res, 'Name missing')
  }

  if (!number) {
    return showErrorMsg(res, 'Number missing')
  }

  const alreadyAdded = persons.find(p => p.name === name)

  if (alreadyAdded) {
    return showErrorMsg(res, 'Name must be unique')
  }

  const newPerson = {
    id: generateRandomId(),
    name: name,
    number: number
  }

  persons = persons.concat(newPerson)

  res.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})