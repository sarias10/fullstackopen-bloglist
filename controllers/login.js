const jwt = require('jsonwebtoken')
const brcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    //este es el cuerpo con los datos de la solicitud que se manda
    const body = request.body

    //Busca en la base de datos y devuelve el primer usuario que coincide con el username del body
    const user = await User.findOne({ username: body.username })

    //sino encontro el usuario, entonces passwordCorrect es false
    //si encontro al usuario enconces compara la contraseña encriptada con la contraseña del body, usando bcrypt.compare()
    //si la comparacion es igual devuelve true
    const passwordCorrect = user === null
        ? false
        : await brcrypt.compare(body.password, user.password)


    //si alguno de los dos es falso o los dos es falso, entonces se ejecuta esto porque devuelve true el condicional
    //basicamente responde con un error si se cumple esto
    if(!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    //si todo esta correcto se ejecuta lo que sique

    //aqui se crea un objeto con atributo username y id del usuario autenticado (usuario existe y contraseña correcta)
    const userForToken = {
        username: user.username,
        id: user._id
    }

    //se crea un token y se firma
    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        //esto hace que el token solo dure 60*60 segundos, una hora
        // { expiresIn: 60*60 }
    )

    //finalmente se responde la solicitud
    response
        .status(200)
        //envia el cuerpo de la respuesta
        .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter