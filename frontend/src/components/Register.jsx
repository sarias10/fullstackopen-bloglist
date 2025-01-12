import { useState } from 'react'
import registerService from '../services/register'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { useNavigate } from 'react-router-dom'

const Register = ({ setMessage, setUser }) => {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const handleRegister = async(event) => {
    event.preventDefault()
    try{
      const responseRegister = await registerService.register(username,name,password)
      if(responseRegister.status === 201){
        const responseLogin = await loginService.login(username, password)
        blogService.setToken(responseLogin.token)
        setUser(responseLogin)
        window.localStorage.setItem('user', JSON.stringify(responseLogin))
        setMessage({ message: `Welcome ${responseRegister.data.name}, you have been registered `, error: false })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        navigate('/')
      }
      setUsername('')
      setName('')
      setPassword('')
    }catch(error){
      setMessage({ message: error.response.data.error, error: true })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setUsername('')
      setName('')
      setPassword('')
    }
    // console.log('registered')
    // console.log(username)
    // console.log(password)
  }
  return (
    <>
      <h2>Register in to application</h2>
      <form onSubmit={handleRegister}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          name
          <input
            type="text"
            value={name}
            name="Name"
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">register</button>
      </form>
    </>
  )
}

export default Register