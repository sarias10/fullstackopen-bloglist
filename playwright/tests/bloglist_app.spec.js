const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, handleView, createUser, logoutWith } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        // resetea blogs y usuarios
        await request.post('/api/testing/reset')
        // agrega un nuevo usuario
        await createUser(request, 'julio', 'Julio', 'root')

      await page.goto('/')
    })
  
    test('Login form is shown', async ({ page }) => {
        const locator = await page.getByText('log in to application')
        await expect(locator).toBeVisible()
        await expect(page.getByText('username')).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
          await loginWith(page, 'julio', 'root')
          await expect(page.getByText('Julio log-in')).toBeVisible()
        })
    
        test('fails with wrong credentials', async ({ page }) => {
          await loginWith(page, 'julio', 'wrong')

          const errorDiv = await page.locator('.error')
          await expect(errorDiv).toContainText('invalid username or password')

          await expect(page.getByText('Julio log-in')).not.toBeVisible()
        })
      })
    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
          await loginWith(page, 'julio', 'root')
        })
      
        test('a new blog can be created', async ({ page }) => {
          await createBlog(page, 'blog de prueba', 'Julio', 'julio.com')
          await expect(page.getByText('blog de prueba - Julio')).toBeVisible()
        })

        test('blog can be liked', async ({ page }) => {
          await createBlog(page, 'blog de prueba', 'Julio', 'julio.com')
          await handleView(page,'blog de prueba - Julio')
          await page.getByRole('button', {name: 'like'}).click()
          await expect(page.getByText('1')).toBeVisible()
        })

        test('blog can be deleted', async ({ page }) => {
          await createBlog(page, 'blog de prueba', 'Julio', 'julio.com')
          await handleView(page,'blog de prueba - Julio')

          // Configurar el manejador de diálogos antes de hacer clic en el botón
          // asi se tiene que hacer
          page.on('dialog', async dialog => {
            await dialog.accept()
          })

          await page.getByRole('button', {name: 'remove'}).click()

          await expect(page.getByText('blog de prueba - Julio')).not.toBeVisible()
        })

        describe('Another user create a blog', () => {
          beforeEach(async ({ page, request }) => {
            await createUser(request, 'kelly', 'kelly', 'root')
            await createBlog(page, 'blog de prueba', 'Julio', 'julio.com')
            await logoutWith(page)
            await loginWith(page,'kelly','root')
          })

          test('an user cannot remove blogs created by other user', async ({ page }) => {
            await handleView(page, 'blog de prueba - Julio')
            await expect(page.getByText('remove')).not.toBeVisible()
          })
        })
      })
  })