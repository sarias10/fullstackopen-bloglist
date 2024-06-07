const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./blog_test_helper')
const Blog = require('../models/blog')
//importa la aplicacion "app" y la envuelve en la función supertest, creando el objeto superagent
//el objeto superagent se asigna a la variable api y se prueba la api con el
const api = supertest(app)

beforeEach( async () => {
    await Blog.deleteMany({})
    for(let object of helper.initialBlogs){
        let newObject = new Blog(object)
        await newObject.save()
    }
})

describe('testing blog list api', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-type', /application\/json/)
    })

    test('blog list have 6 objects', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, 6)
    })

    test('id\'s property is "id"', async () => {
        const response = await api.get('/api/blogs')
        const firstObjectAtributes = Object.keys(response.body[0])
        assert(firstObjectAtributes.includes('id'))
    })

    test('creating a new blog', async () => {
        const newBlog = {
            title: 'learning to test api',
            author: 'Sergio Arias',
            url: 'sergio-arias.com',
            likes: 50000,
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-type', /application\/json/)
        //verifica que la base de datos aumente en uno
        assert.strictEqual((await helper.blogsInDb()).length, helper.initialBlogs.length+1)

        const titles = (await helper.blogsInDb()).map(blog => blog.title)
        //verifica que la base de datos contenga el title del nuevo objeto
        assert(titles.includes('learning to test api'))

    })
})

after(async () => {
    await mongoose.connection.close()
})