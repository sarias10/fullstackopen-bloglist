const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
//importa la aplicacion "app"
const app = require('../app')
//envuelve la aplicación app en la función supertest, creando el objeto superagent
//el objeto superagent se asigna a la variable api y se prueba la api con el
const api = supertest(app)

const helper = require('./blog_test_helper')

//se importa el modelo Blog
const Blog = require('../models/blog')
const User = require('../models/user')



describe('testing blog list api', () => {
    let token
    beforeEach( async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})
        // Crear usuario y obtener el token
        const newUser = {
            username: 'root1',
            name: 'Superuser',
            password: 'root1'
        }
        //se crea el usuario
        await api
            .post('/api/users')
            .send(newUser)
        //se inicia sesion con el usuario creado
        const loginResponse = await api
            .post('/api/login')
            .send({
                username: 'root1',
                password: 'root1'
            })
        //se responde la solicitud con el token firmado
        token = loginResponse.body.token
        //se crean los objetos con la info del usuario loggeado
        for(let object of helper.initialBlogs){
            //Tenga en cuenta que debe llamar .set()DESPUÉS de llamar .post(), no antes.
            //si lo haces al reves da error
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(object)
        }
    })

    //testea si encontro los blogs de una persona
    describe('testing get all blogs', () => {
        test('blogs are returned as json', async () => {
            await api
                .get('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-type', /application\/json/)
        })

        test('blog list have 6 objects', async () => {
            const response = await api
                .get('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
            assert.strictEqual(response.body.length, 6)
        })

        test('id\'s property is "id"', async () => {
            const response = await api
                .get('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
            const firstObjectAtributes = Object.keys(response.body[0])
            assert(firstObjectAtributes.includes('id'))
        })
    })

    describe('creation of new blogs', () => {
        test('creating a new blog', async () => {
            const newBlog = {
                title: 'learning to test api',
                author: 'Sergio Arias',
                url: 'sergio-arias.com',
                likes: 50000,
            }
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-type', /application\/json/)
            //verifica que la base de datos aumente en uno
            assert.strictEqual((await helper.blogsInDb()).length, helper.initialBlogs.length+1)

            const titles = (await helper.blogsInDb()).map(blog => blog.title)
            //verifica que la base de datos contenga el title del nuevo objeto
            assert(titles.includes('learning to test api'))

        })

        test('likes is 0 if likes missing in the request', async () => {
            //In this test this object never have likes property
            const newBlog = {
                title: 'learning to test api',
                author: 'Sergio Arias',
                url: 'sergio-arias.com'
            }
            const post = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-type', /application\/json/)

            const response = post.body
            assert.strictEqual(response.likes,0)
        })

        test('if title missing then response code is 400', async () => {
            const newBlog = {
                author: 'Sergio Arias',
                url: 'sergio-arias.com',
                likes: 50000
            }
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)
        })

        test('if url missing then response code is 400', async () => {
            const newBlog = {
                title: 'learning to test api',
                author: 'Sergio Arias',
                likes: 50000
            }
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)
        })

        test('Testing when no token is provided', async () => {
            const newBlog = {
                title: 'learning to test api',
                author: 'Sergio Arias',
                url: 'sergio-arias.com',
                likes: 50000,
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)
        })
    })

    describe('deletion of a blog', () => {
        test('blog can be deleted', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const oneBlog = blogsAtStart[0]
            const titleOfOneBlog = oneBlog.title
            //delete the blog
            await api
                .delete(`/api/blogs/${oneBlog.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204)

            const blogAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogAtEnd.length, blogsAtStart.length-1)

            const titles = blogAtEnd.map(blog => blog.title)
            assert(!titles.includes(titleOfOneBlog))
        })
    })

    describe('update of a blog', () => {
        test('testing invalid id', async () => {
            const invalidId = '58'

            const updatedBlog = {
                likes: 8
            }
            await api
                .put(`/api/blogs/${invalidId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedBlog)
                .expect(400)
        })

        test('testing only update likes', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const firstBlog = blogsAtStart[0]
            const id = firstBlog.id
            const updateBlog = {
                title: 'testing update',
                author: 'Sergio',
                url: 'sergio.com/',
                likes: 800,
            }
            await api
                .put(`/api/blogs/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updateBlog)
                .expect(200)
            const blogsAtEnd = await helper.blogsInDb()
            const blog = blogsAtEnd.find(blog => blog.id===id)
            //test if likes change
            assert.strictEqual(blog.likes, updateBlog.likes)
            //test if title not change
            assert.strictEqual(blog.title, firstBlog.title)
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})