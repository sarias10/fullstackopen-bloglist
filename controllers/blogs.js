const notesRouter = require('express').Router()
const Blog = require('../models/blog')

notesRouter.get('/', (request,response) => {
    Blog
    .find({})
    .then(blogs => {
        response.json(blogs)
    })
})

notesRouter.post('/', (request,response) => {
    const blog = new Blog(request.body)

    blog
    .save()
    .then(result => {
        // significa que una solicitud se procesó correctamente y devolvió,o creó, un recurso o resources en el proceso
        response.status(201).json(result)
    })
    .catch(error => console.log(error.message))
})

module.exports = notesRouter