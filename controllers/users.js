const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.status(200).json(users)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    const saltRounds = 10
    //ciframos la contraseña recibida
    const passwordHash = await bcrypt.hash(password,saltRounds)

    //creamos un nuevo objeto usuario
    const user = new User({
        username,
        // si hay que ponerla así, porque la propiedad en el modelo se llama password
        password: passwordHash,
        name
    })

    //utilizamos el metodo save del objeto para guardar el usuario en la base de datos
    const savedUser = await user.save()

    //respondemos con el usuario guardado
    response.status(201).json(savedUser)
})

//exportamos para poder usarlo en el archivo app.js
module.exports = usersRouter