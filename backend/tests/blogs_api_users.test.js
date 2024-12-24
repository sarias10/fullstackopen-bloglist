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

//importa el modelo User para obtener los objetos guardados en la base de datos
const User = require('../models/user')

describe('testing blog list api users', () => {
    beforeEach( async () => {
        await User.deleteMany({})
        for(let object of helper.initialUsers){
            let newObject = new User(object)
            await newObject.save()
        }
    })

    describe('testing get all users', () => {
        test('users are returned as json', async () => {
            await api
                .get('/api/users')
                .expect(200)
                .expect('Content-type', /application\/json/)
        })

        test('users have 4 objects', async () => {
            const response = await api
                .get('/api/users')
            assert.strictEqual(response.body.length, 4)
        })
    })

    describe('creation of new Users', () => {
        test('users not valid: username\'s missing', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                password: 'root',
                name: 'Nuevo usuario'
            }
            const response = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtStart.length,usersAtEnd.length)
            assert.strictEqual(response.body.error, 'User validation failed: username: Path `username` is required.')
        })

        test('users not valid: password\'s missing', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'newUser',
                name: 'Nuevo usuario'
            }
            const response = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtStart.length,usersAtEnd.length)
            assert.strictEqual(response.body.error, 'password is missing')
        })

        test('users not valid: username have less than 3 characters', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'ne',
                password: 'root',
                name: 'Nuevo usuario'
            }
            const response = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtStart.length,usersAtEnd.length)
            assert.strictEqual(response.body.error, 'User validation failed: username: Path `username` (`ne`) is shorter than the minimum allowed length (3).')
        })

        test('users not valid: password have less than 3 characters', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'newUser',
                password: 'ro',
                name: 'Nuevo usuario'
            }
            const response = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtStart.length,usersAtEnd.length)
            assert.strictEqual(response.body.error, 'The password must be at least 3 characters long.')
        })

        test('username is unique', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'root',
                password: 'root',
                name: 'Nuevo usuario'
            }
            const response = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)

            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtStart.length,usersAtEnd.length)
            assert.strictEqual(response.body.error, 'expected `username` to be unique')
        })

        test('user successfully created', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'newUser',
                password: 'root',
                name: 'Nuevo usuario'
            }
            await api
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-type', /application\/json/)

            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtEnd.length, usersAtStart.length+1)
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})