// para consultar los nombres de los errores hay que usar "error.name" no dice la propiedad explicitamente en el objeto porque es una propiedad no enumerable
const jwt = require('jsonwebtoken')
const User = require('../models/user')

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

const getTokenFrom = request => {
    //obtiene el encabezado authorization de la solicitud
    const authorization = request.get('authorization')
    //si autorizacion existe y empieza con 'Bearer '
    //entonces reemplaza 'Bearer ' con nada y devuelve lo demas
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    //sino cumple el condicional anterior entonces devuelve null
    return null
}

const tokenExtractor = (request, response, next) => {
    //codigo que extrae el token
    request.token = getTokenFrom(request)

    next()
}

const userExtractor = async (request, response, next) => {

    //decodifica el token y devuelve en decodedToken el objeto con atributos username y id
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    //sino existe el id en el token devuelve error
    if(!decodedToken || !decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    //busca en la base de datos el usuario con el id del token y lo guarda en la variable user
    const user = await User.findById(decodedToken.id)

    //configura request.user en el objeto de la solicitud
    request.user = user
    next()
}

module.exports = {
    errorHandler,
    tokenExtractor,
    userExtractor
}