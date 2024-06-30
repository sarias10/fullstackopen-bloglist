// para consultar los nombres de los errores hay que usar "error.name" no dice la propiedad explicitamente en el objeto porque es una propiedad no enumerable
const blogsRouter = require('../controllers/blogs')

const errorHandler = (error, request, response, next) => {
    if(error.name==='CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name ==='ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'expected `username` to be unique' })
    }
    next(error)
}

const tokenExtractor = (request, response, next) => {
    //codigo que extra el token
}

module.exports = {
    errorHandler,
    tokenExtractor
}