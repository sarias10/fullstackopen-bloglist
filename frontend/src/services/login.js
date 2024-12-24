import axios from 'axios'
const baseUrl = '/api/login'

const login = async (username, password) => {
  const response = await axios.post(baseUrl,{
    username: username,
    password: password
  })
  return response.data
}

// const main = async () =>{
//     const response = await login('Julio', 'root')
//     console.log('hola', response)
// }
// main()

export default {
  login
}