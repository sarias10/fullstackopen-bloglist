import { Link, useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import blogService from '../services/blogs'
const Login = ({ username, password, setUser, setMessage, setUsername, setPassword }) => {

  const navigate = useNavigate()
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
      navigate('/')
    }catch (error){
      setMessage({ message: error.response.data.error, error: true })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleButtonRegister = () => {
    navigate('/register')
  }
  return (
    <>
      <h2>log in to application</h2>
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
      <button onClick={handleButtonRegister}>
        register
      </button>
    </>
  )
}

export default Login