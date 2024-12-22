// Aqui se guardan todas las solicitudes http hacia los objetos blog

// El objeto enrutador es, de hecho, un middleware que se puede utilizar para definir "rutas relacionadas" en un solo lugar

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request,response, next) => {
    try {
        const user = request.user
        const blogs = await Blog.find({ user: user.id }).populate('user', { username: 1, name: 1 })
        console.log(typeof blogs[0].user.toString())
        response.status(200).json(blogs)
    } catch(error) {
        next(error)
    }
})

blogsRouter.post('/', async (request,response, next) => {
    const body = request.body
    try{
        //esto tiene el token decodificado
        const decodedToken = request.user

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
        //como el user ya viene en la solicitud(por el middleware) lo guardamos en la variable user
        const user = request.user
        //buscamos el blog que se quiere borrar
        const blog = await Blog.findById(request.params.id)

        //si el usuario no es dueño del blog se responde con un mensaje de error
        if(blog.user.toString()!==user.id) {
            return response.status(401).json({ error: 'server error' })
        }
        // Busca y elimina el blog con el ID especificado en los parámetros de la solicitud
        await Blog.findByIdAndDelete(request.params.id)
        // Busca un usuario por su ID y elimina el ID del blog especificado en los parámetros de la solicitud del array 'blogs' del usuario
        const updateUser = await User.findOneAndUpdate(
            { _id: user.id }, // Criterio de búsqueda: encuentra el usuario por su ID
            { $pull: { blogs: request.params.id } } // Actualización: elimina el ID del blog del array 'blogs' del usuario
        )
        await updateUser.save()
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
        const user = request.user
        //buscamos el blog que se quiere actualizar
        const blogFound = await Blog.findById(request.params.id)
        if(blogFound.user.toString() !==user.id){
            return response.status(401).json({ error: 'server error' })
        }
        const updatedBlog = await Blog
            //se le pasa el nuevo blog como argumento y solo actualiza el campo que se le paso
            .findByIdAndUpdate(request.params.id, blog,
                {
                    new: true,// Devuelve el documento actualizado en lugar del original
                    runValidators: true, //parametro para que vuelva a validar los datos ingresados con lo del modelo
                    context: 'query' // contexto de validación
                })
        response.status(200).json(updatedBlog)
    } catch(error) {
        next(error)
    }
})

module.exports = blogsRouter