const errorHandler = (error, request, response, next) => {
  if (error.name === 'MongoServerError' && error.message.includes(
    'E11000 duplicate key error')) {
      return response.status(400).json({ error: 'Username is not available' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({ error: 'token invalid' })
    }
  
  next(error)
}

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } 
  next()
}

module.exports = { errorHandler, tokenExtractor }