import { useState } from 'react'
import blogService from '../services/blogs'
import blogs from '../services/blogs'
import { compareFn } from '../utils'

const Blog = ({ blog, username, blogs, setBlogs, handleLike }) => {
  const [showDetails, setShowDetails] =useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const removeButtonStyle = {
    backgroundColor:'red',
    color: 'white',
    fontWeight: 'bold'
  }
  //cambia el estado showDetails para mostrar los demas atributos de blog
  const controlShowDetails = () => {
    setShowDetails(!showDetails)
  }

  //maneja el boton de remove
  const handleDelete = async () => {
    if(confirm('Do you want to delete the blog?')){
      const response = await blogService.deleteBlog(blog.id)
      const allBlogs = blogs.filter(item => item.id !== blog.id)
      setBlogs(allBlogs)
    }
  }
  return(
    <div className='blog' style={blogStyle}>
      {blog.title} - {blog.author} <button className='viewButton' onClick={controlShowDetails}>view</button>
      {showDetails &&
      <div>
        <span>{blog.url}</span>
        <br/>
        <span>likes {blog.likes}</span> <button className='likeButton' onClick={handleLike}>like</button>
        <br/>
        <span>{blog.user.name}</span>
        <br/>
        {blog.user.username === username &&
        <button style={removeButtonStyle} onClick={handleDelete}>remove</button>
        }
      </div>
      }
    </div>
  )}

export default Blog