// Aqui se guardan todas las solicitudes http hacia los objetos blog

// El objeto enrutador es, de hecho, un middleware que se puede utilizar para definir "rutas relacionadas" en un solo lugar

const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/testGetTokenFrom', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    console.log('usuario encontrado', user)
})

blogsRouter.get('/', async (request,response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request,response, next) => {
    const body = request.body

    try{
        //decodifica el token y devuelve en decodedToken el objeto con atributos username y id
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        //sino existe el id en el token devuelve error
        if(!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }
        //busca en la base de datos el usuario con el id del token y lo guarda en la variable user
        const user = await User.findById(decodedToken.id)

        //crea un blog nuevo usando el esquema Blog y asignando a user user el user._id
        const blog = new Blog ({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user._id
        })

        //guarda el blog en la base de datos de los blogs
        const savedBlog = await blog.save()
        //actualiza la lista de blogs del usuario concatenando el blog guardado
        user.blogs = user.blogs.concat(savedBlog)
        //guarda en la base de datos la actualización
        await user.save()

        //un código 201 significa que una solicitud se procesó correctamente y devolvió,o creó, un recurso o resources en el proceso
        //responde con el blog guardado
        response.status(201).json(savedBlog)
    }catch(error){
        next(error)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        await Blog.findByIdAndDelete(request.params.id)
        //es importante poner .end() para poner en la respuesta sin contenido
        response.status(204).end()
    } catch(error) {
        next(error)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    const blog = {
        //estos son los unicos datos que se actualizaran en la request
        likes: request.body.likes
    }
    try {
        const updatedBlog = await Blog
            //se le pasa el nuevo blog como argumento
            .findByIdAndUpdate(request.params.id, blog,
                { new: true,
                    //para que vuelva a validar los datos ingresados
                    runValidators: true,
                    context: 'query' })
        response.status(200).json(updatedBlog)
    } catch(error) {
        next(error)
    }
})

module.exports = blogsRouter