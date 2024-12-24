import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Message from './components/Message'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { compareFn } from './utils'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] =useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  //message
  const [message, setMessage] = useState(
    { message: 'Mensaje de prueba...',
      error: false
    })
  //refs
  const blogFormRef = useRef()//se utiliza para crear una referencia blogFormRef, que se asigna al componente togglable para poder usar las funciones definidas y (permitidas) dentro del componente padre

  useEffect(() => {
    const data = JSON.parse(window.localStorage.getItem('user'))
    if(data){
      setUser(data)
      blogService.setToken(data.token) //establece otra vez el token
    }
  }, [])

  useEffect(() => {
    //si el user existe entonces se obtienen todos los blogs
    const fetchBlogs = async () => {
      try{
        if(user){
          console.log('user', user)
          const response = await blogService.getAll()
          const orderedList = compareFn(response)
          setBlogs(orderedList)
        }
      }catch (error) {
        console.error(error)
      }
    }
    fetchBlogs()
  }, [user])//actualiza el estado blogs cuando el user cambia

  const handleLogin = async (event) => {
    event.preventDefault()
    try{
      const response = await loginService.login(username, password)
      blogService.setToken(response.token)
      setUser(response)
      window.localStorage.setItem('user', JSON.stringify(response))
      setMessage({ message: 'welcome', error: false })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }catch (error){
      setMessage({ message: error.response.data.error, error: true })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const login = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          data-testid='username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          data-testid='password'
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const handleCreateNewBlog = async (newBlog) => {
    try{
      blogFormRef.current.toggleVisibility()//llamo a la funcion toggleVisibility antes declarada para usar con ref para ocultar el formulario
      const response = await blogService.createBlog(newBlog) //peticion que crea el blog con el objeto pasado desde el componente BlogForm
      const newBlogs = blogs.concat(response)//crea una nueva variable y concatena el estado existente al nuevo blog creado
      setBlogs(newBlogs)//actualiza el estado blogs
      setMessage({ message: `a new blog ${response.title} by ${response.author} added`, error: false })
      setTimeout(() => {//esta funcion se ejecutara despues de 5 segundos
        setMessage(null)//es decir, el estado setMessage quedara nulo despues de 5 segundos de mostrar el mensaje
      }, 5000)
    }catch (error){
      console.error(error.message)
    }
  }
  //maneja el boton de like de blog
  const handleLike = async (blog) => {
    const newBlogLikes = {
      likes: blog.likes + 1
    }
    const response = await blogService.updateBlog(blog.id, newBlogLikes)
    //obtiene la lista de blogs como prop en el componente y actualiza los likes solo del blog con el mismo id
    const allBlogs = blogs.map(item => {
      if(item.id === blog.id){
        item.likes = response.data.likes
      }
      return item
    })
    setBlogs(allBlogs)
  }

  const showCreateBlogForm = () => (
    <Togglable buttonLabel={'new blog'} ref={blogFormRef}>{/*se pasa blogFormRef como referencia*/}
      <BlogForm createNewBlog={handleCreateNewBlog}/>
    </Togglable>
  )

  const userLogged = () => (
    <div>
      {user.name} log-in
    </div>
  )

  const logOut = () => {
    setUsername(null)
    setPassword(null)
    setBlogs(null)
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('user')
  }

  return (
    <div>
      <h2>blogs</h2>
      {message &&
      <Message message={message.message} error ={message.error}/>}
      {user ?
        <>
          {userLogged()}
          <button onClick={logOut}>
            log out
          </button>
          <h2>create new</h2>
          {showCreateBlogForm()}
          <h2>blogs list created by {user.name}</h2>
          {blogs &&
          (blogs.map(blog =>
            <Blog key={blog.id} blog={blog} name={user.name} blogs={blogs} setBlogs={setBlogs} handleLike={() => handleLike(blog)}/>
          ))
          }
        </>
        :
        <>
          <h2>log in to application</h2>
          {login()}
        </>
      }
    </div>
  )
}

export default App