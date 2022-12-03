const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response) => {
  Note.find({}).then((notes) => response.json(notes))
})

notesRouter.get('/:id', (request, response, next) => {
  const { id } = request.params
  Note.findById(id)
    .then((note) => {
      if (note) {
        response.json(note)
      } else {
        response.status(404)
      }
    })
    .catch((err) => next(err))
})

notesRouter.delete('/id', (request, response, next) => {
  const { id } = request.params
  Note.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end()
    })
    .catch((err) => next(err))
})

notesRouter.post('/', (request, response, next) => {
  const { body } = request

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save()
    .then((savedNote) => response.json(savedNote))
    .catch((err) => next(err))
})

notesRouter.put('/:id', (req, res, next) => {
  const { body } = req

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(
    req.params.id,
    note,
    { new: true, runValidators: true, context: 'query' },
  )
    .then((updatedNote) => {
      res.json(updatedNote)
    })
    .catch((err) => next(err))
})

module.exports = notesRouter
