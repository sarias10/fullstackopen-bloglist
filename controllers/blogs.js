// Aqui se guardan todas las solicitudes http hacia los objetos blog

// El objeto enrutador es, de hecho, un middleware que se puede utilizar para definir "rutas relacionadas" en un solo lugar

const notesRouter = require('express').Router()
const Blog = require('../models/blog')

notesRouter.get('/', async (request,response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

notesRouter.post('/', async (request,response) => {
    const blog = new Blog(request.body)

    const result = await blog.save()
    // significa que una solicitud se procesó correctamente y devolvió,o creó, un recurso o resources en el proceso
    response.status(201).json(result)
})

module.exports = notesRouter