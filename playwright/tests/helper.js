const loginWith = async (page, username, password) => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', {name: 'login'}).click()
}

const logoutWith = async (page) => {
    await page.getByRole('button', { name: 'log out'}).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'new blog'}).click()
    await page.getByTestId('title').fill(title)
    await page.getByTestId('author').fill(author)
    await page.getByTestId('url').fill(url)
    await page.getByRole('button', { name: 'create'}).click()
    await page.getByText(`${title} - ${author}`).waitFor()
}

const handleView = async (page, text) => {
    const blogContainer = await page.getByText(text)
    const viewButton = await blogContainer.locator('.viewButton')
    await viewButton.click()
}

const createUser = async (request, username, name, password) => {
    await request.post('/api/users', {
        data: {
          username: username,
          name: name,
          password: password
        }
      })
      console.log(`username ${username} created`);
}

export { loginWith, logoutWith, createBlog, handleView, createUser }