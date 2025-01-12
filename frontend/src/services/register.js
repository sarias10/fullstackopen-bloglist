import axios from 'axios'
const baseUrl = '/api/users'

const register = async (username, name, password) => {
  const response = await axios.post(baseUrl, {
    username: username,
    name: name,
    password: password
  })
  return response
}

// solo he podido hacer que funcione en la consola del navegador

// const main = async () => {
//   try{
//     const response = await register('deyanira', 'deyanira', 'root')
//     console.log('hola', response)
//   }catch(error){
//     console.log(error.response.data.error)
//   }
// }
// main()

export default { register }