import React, { useState } from 'react'

const BlogForm = ({ createNewBlog }) => {
  const [title, setTitle] = useState('')//si dejo esto null da error, creo que porque al enviar datos, se envian nulos
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addNewBlog = (event) => {
    event.preventDefault()//evita que se recargue el componente
    createNewBlog({ //le pasa un objeto a la funcion que se paso como propiedad
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <form onSubmit={addNewBlog}>
      <div>
            title
        <input
          data-testid='title'
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
          placeholder='write title here'
        />
      </div>
      <div>
            author
        <input
          data-testid='author'
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
          placeholder='write author here'
        />
      </div>
      <div>
            url
        <input
          data-testid='url'
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
          placeholder='write url here'
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm