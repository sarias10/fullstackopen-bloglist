require('dotenv').config()

const mongoose = require('mongoose')
const helper = require('./tests/blog_test_helper')

const url = process.env.TEST_MONGODB_URI

const Blog = require('./models/blog')
const User = require('./models/user')

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
const saveBlogs = async () => {
    await Blog.deleteMany({})
    for( let object of helper.initialBlogs){
        let newBlog = new Blog(object)
        await newBlog.save()
    }
    console.log('blogs saved')
}
const saveUsers = async () => {
    await User.deleteMany({})
    for ( let object of helper.initialUsers) {
        let newUser = new User(object)
        await newUser.save()
    }
    console.log('users saved')
}
const randomUser = async () => {
    return await User.aggregate().sample(1)
}

const createBlog = async () => {
    const blog = {
        title: 'test',
        author: 'test',
        url: 'test',
        likes: 4,
    }
    const newBlog = new Blog(blog)
    const response = await newBlog.save()
    return response
}
const salida = async () => {
    await connectUrl()
    await saveBlogs()
    await saveUsers()
    console.log(await createBlog())
    await closeConnection()
    console.log(await helper.blogsInDb)
}

salida()












