// Aqui se guardan todas las solicitudes http hacia los objetos blog

// El objeto enrutador es, de hecho, un middleware que se puede utilizar para definir "rutas relacionadas" en un solo lugar

const notesRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

notesRouter.get('/', async (request,response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

notesRouter.post('/', async (request,response, next) => {
    const body = request.body
    //busca un usuario random en la base de datos
    const query = await User.aggregate().sample(1)
    //guardo su ID
    const randomUserId = query[0]._id.toString()
    //lo agrego al body como propiedad
    body.user = randomUserId
    //creo un nuevo objeto Blog con el modelo
    const blog = new Blog(body)

    try{
        //guardo el blog en la base de datos usando su metodo save()
        const savedBlog = await blog.save()
        //encuentra el usuario por su Id
        const user = await User.findById(randomUserId)
        //actualizo su lista de blogs con su anterior lista de blogs con el blog guardado
        user.blogs = user.blogs.concat(savedBlog._id)
        //guardo la actualizacion del usuario
        await user.save()
        // significa que una solicitud se procesó correctamente y devolvió,o creó, un recurso o resources en el proceso
        response.status(201).json(savedBlog)
    }catch(error){
        next(error)
    }
})

notesRouter.delete('/:id', async (request, response, next) => {
    try {
        await Blog.findByIdAndDelete(request.params.id)
        //es importante poner .end() para poner en la respuesta sin contenido
        response.status(204).end()
    } catch(error) {
        next(error)
    }
})

notesRouter.put('/:id', async (request, response, next) => {
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

module.exports = notesRouter