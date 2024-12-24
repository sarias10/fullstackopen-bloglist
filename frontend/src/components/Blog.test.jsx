import { render, screen } from '@testing-library/react'

import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'
import BlogForm from './BlogForm'

test('renders content', () => {
  const blog = {
    title: 'Testeando que aparezca titulo y autor',
    author: 'Sergio',
    url: 'https://hola.com/',
    likes: 800
  }
  render(<Blog blog = {blog}/>)

  const titleAuthorElement = screen.queryByText('Testeando que aparezca titulo y autor - Sergio')
  expect(titleAuthorElement).toBeDefined()
  //queryByText, devuelve el elemento pero no genera excepción sino se encuentra
  const urlElement = screen.queryByText('https://hola.com/')
  expect(urlElement).toBeNull()
  const likesElement = screen.queryByText('800')
  expect(likesElement).toBeNull()
})

test('click the view button once to display likes and URL', async () => {
  const blog = {
    title: 'Testeando que aparezca likes y url',
    author: 'Sergio',
    url: 'https://hola.com/',
    likes: 800
  }
  render(<Blog blog = {blog}/>)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const likes = screen.getByText('likes 800')
  const url = screen.getByText('https://hola.com/')

  expect(likes).toBeDefined()
  expect(url).toBeDefined()
})

test('click button likes twice', async () => {
  const blog = {
    title: 'Testeando que aparezca likes y url',
    author: 'Sergio',
    url: 'https://hola.com/',
    likes: 800
  }

  const mockHandler = vi.fn()
  render(<Blog blog = {blog} handleLike={mockHandler}/>)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('add new blog', async () => {
  const createNewBlog = vi.fn()

  render(<BlogForm createNewBlog={createNewBlog} />)

  const titleInput = screen.getByPlaceholderText('write title here')
  const authorInput = screen.getByPlaceholderText('write author here')
  const urlInput = screen.getByPlaceholderText('write url here')

  const sendButton = screen.getByText('create')


  await userEvent.type(titleInput, 'testeando escribir titulo')
  await userEvent.type(authorInput, 'testeando escribir author')
  await userEvent.type(urlInput, 'testeando escribir url')

  await userEvent.click(sendButton)

  console.log(createNewBlog.mock.calls)
  expect(createNewBlog.mock.calls).toHaveLength(1)
  expect(createNewBlog.mock.calls[0][0].title).toBe('testeando escribir titulo')
  expect(createNewBlog.mock.calls[0][0].author).toBe('testeando escribir author')
  expect(createNewBlog.mock.calls[0][0].url).toBe('testeando escribir url')
})