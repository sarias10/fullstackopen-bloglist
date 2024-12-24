const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        // resetea blogs y usuarios
        await request.post('/api/testing/reset')
        // agrega un nuevo usuario
        await request.post('/api/users', {
          data: {
            username: "Julio",
            name: "Julio",
            password: "root"
          }
        })

      await page.goto('/')
    })
  
    test('Login form is shown', async ({ page }) => {
        const locator = await page.getByText('log in to application')
        await expect(locator).toBeVisible()
        await expect(page.getByText('username')).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
          await loginWith(page, 'Julio', 'root')
          await expect(page.getByText('Julio log-in')).toBeVisible()
        })
    
        test('fails with wrong credentials', async ({ page }) => {
          await loginWith(page, 'Julio', 'wrong')

          const errorDiv = await page.locator('.error')
          await expect(errorDiv).toContainText('invalid username or password')

          await expect(page.getByText('Julio log-in')).not.toBeVisible()
        })
      })
      describe('When logged in', () => {
        beforeEach(async ({ page }) => {
          await loginWith(page, 'Julio', 'root')
        })
      
        test('a new blog can be created', async ({ page }) => {
          await createBlog(page, 'blog de prueba', 'Julio', 'julio.com')
          await expect(page.getByText('blog de prueba - Julio')).toBeVisible()
        })
      })
  })