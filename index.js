require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true
  }
]

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => response.json(notes))
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  Note.findById(id)
    .then(note => {
      if (note) {
        response.json(note)
      }
      else {
        response.status(404)
      }
    })
    .catch(err => next(err))
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  Note.findByIdAndRemove(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(err => next(err))
})

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save()
    .then(savedNote => response.json(savedNote))
    .catch(err => next(err))
})

app.put('/api/notes/:id', (req, res, next) => {
  const body = req.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(
    req.params.id,
    note,
    { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(err => next(err))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unkown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CaseError') {
    return response.status(400).send({error: 'malformatted id'})
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).send({error: error.message})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3004
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
