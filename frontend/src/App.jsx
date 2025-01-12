import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Message from './components/Message'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { compareFn } from './utils'
import Login from './components/Login'
import Register from './components/Register'
import { useLocalStorage } from './utils/useLocalStorage'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] =useState('')
  //const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useLocalStorage('user', null)
  //message
  const [message, setMessage] = useState(null)
  //refs
  const blogFormRef = useRef()//se utiliza para crear una referencia blogFormRef, que se asigna al componente togglable para poder usar las funciones definidas y (permitidas) dentro del componente padre

  useEffect(() => {
    //si el user existe entonces se obtienen todos los blogs
    const fetchBlogs = async () => {
      try{
        if(user){
          blogService.setToken(user.token) //establece otra vez el token
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

  const handleCreateNewBlog = async (newBlog) => {
    try{
      blogFormRef.current.toggleVisibility()//llamo a la funcion toggleVisibility antes declarada para usar con ref para ocultar el formulario
      const response = await blogService.createBlog(newBlog) //peticion que crea el blog con el objeto pasado desde el componente BlogForm
      const newBlogs = blogs.concat(response)//crea una nueva variable y concatena el estado existente al nuevo blog creado
      const sortedBlogs = compareFn(newBlogs)//ordena los blogs por la cantidad de likes
      setBlogs(sortedBlogs)//actualiza el estado blogs
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
    <BrowserRouter>
      <div>
        <h2>blogs</h2>
        {message &&
      <Message message={message.message} error ={message.error}/>}
        <Routes>
          <Route path='/login' element={<Login username={username} password={password} setUser={setUser} setMessage={setMessage} setUsername={setUsername} setPassword={setPassword}/>} />
          <Route path='/register' element={<Register setMessage={setMessage} setUser={setUser} />} />
          <Route path='/' element= {user ? (
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
            <Blog key={blog.id} blog={blog} username = {user.username} blogs={blogs} setBlogs={setBlogs} handleLike={() => handleLike(blog)}/>
          ))}
            </>
          )
            : (
              <Navigate to="/login" />
            )} />
        </Routes>

      </div>
    </BrowserRouter>
  )
}

export default App