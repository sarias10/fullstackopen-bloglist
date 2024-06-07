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
}
const salida = async () => {
    await bucle()
}


connectUrl()
salida()












