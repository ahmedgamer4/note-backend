const logger = require('./logger')

const requestLogger = (req, res, next) => {
  logger.info('Method', req.method)
  logger.info('Path', req.path)
  logger.info('Body', req.body)
  logger.info('--------')
  next()
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CaseError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unkown endpoint' })
}

module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint,
}
