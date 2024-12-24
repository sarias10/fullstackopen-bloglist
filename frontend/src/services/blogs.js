import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const setToken = (newtoken) => {
  token = `Bearer ${newtoken}`
}

//token de kelly, solo para ejemplos
const config2 = {
  headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImtlbGx5IiwiaWQiOiI2NmZlODJhYzRmNmM2YWQzZjhjZjhjYTIiLCJpYXQiOjE3Mjk1OTY4Mzd9.4ui0WrniPzAUkFWKCA9FgByUkduK1WgBwwyo0zyWyeU' }
}

const getAll = async () => {
  const config = {
    headers: { Authorization: token }
  }
  console.log('se empieza a ejecutar la petición')
  const response = await axios.get(baseUrl, config)
  return response.data
}

const createBlog = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const updateBlog = async (id, blog) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.put(`${baseUrl}/${id}`,blog, config)
  return response
}

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response
}

// const example = () => {
//   return 'hola'
// }

// const main = async () =>{
//   console.log('ejecutandose');
//     const response = await getAll()
//   console.log('Blogs', response)
// }

// main()

export default { getAll, setToken, createBlog, updateBlog, deleteBlog, token }