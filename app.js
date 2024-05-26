const express = require('express')
const config = require('./utils/config')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = config.MONGODB_URI

mongoose.connect(mongoUrl)
    .then(()=>{
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request,response) => {
    Blog
    .find({})
    .then(blogs => {
        response.json(blogs)
    })
})

app.post('/api/blogs', (request,response) => {
    const blog = new Blog(request.body)

    blog
    .save()
    .then(result => {
        // significa que una solicitud se procesó correctamente y devolvió,o creó, un recurso o resources en el proceso
        response.status(201).json(result)
    })
    .catch(error => console.log(error.message))
})

module.exports = app