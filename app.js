// Este archivo establece la conexion a la base de datos

const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

const mongoUrl = config.MONGODB_URI

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(mongoUrl)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())

// Este middleware se ejecuta en todas las rutas para extraer el token
app.use(middleware.tokenExtractor)

//todas las solicitudes a la direccion /api/login las maneja loginRouter
app.use('/api/login',loginRouter)
app.use('/api/blogs',middleware.userExtractor, blogsRouter)
//cuando se haga una solicitud HTTP a la direccion .../api/users, se ejecutara usersRouter
app.use('/api/users', usersRouter)
//handler of requests with result to errors
app.use(middleware.errorHandler)


module.exports = app