require('dotenv').config()
const Blog = require('./models/blog')
const mongoose = require('mongoose')
const helper = require('./tests/blog_test_helper')

const url = process.env.TEST_MONGODB_URI

const blog = require('./models/blog')


const connectUrl = async () => {
    await mongoose.connect(url)
    console.log('connected to DB')
}

const closeConnection = async () => {
    await mongoose.connection.close()
    console.log('connection closed')
}
const blogsInDb = async () => {
    return await Blog.find({})
}
const bucle = async () => {
    await Blog.deleteMany({})
    console.log('base de datos borrada')
    console.log('base de datos actual', await blogsInDb())
    for( let object of helper.initialBlogs){
        let newBlog = new Blog(object)
        await newBlog.save()
        console.log('blog guardado')
    }
    console.log('base de datos despues', await blogsInDb())
    const lista = await blogsInDb()
    const unDato = lista[0].toJSON()
    console.log('un dato', unDato)
    console.log('tipo dato', typeof unDato)
    console.log('un dato', Object.keys(unDato))
}
const salida = async () => {
    await bucle()
    await mongoose.connection.close()
    console.log('connection closed')
}


connectUrl()
salida()












