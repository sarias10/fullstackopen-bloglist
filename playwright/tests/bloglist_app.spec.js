const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, handleView, createUser, logoutWith, handleLike } = require('./helper')

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
          await handleLike(page,'blog de prueba - Julio','likes 1')
          //await page.getByRole('button', {name: 'like'}).click()
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

        test('blogs are sorted by likes in descending order', async ({ page }) => {
          await createBlog(page, 'blog de prueba1', 'autor 1', 'autor1.com')
          await createBlog(page, 'blog de prueba2', 'autor 2', 'autor2.com')
          await handleView(page, 'blog de prueba1 - autor 1')
          // Hacer clic en el botón 'like' 5 veces
          for (let i = 0; i < 2; i++) {
            await handleLike(page, 'blog de prueba1 - autor 1',`likes ${i+1}`)
          }
          await createBlog(page, 'blog de prueba3', 'autor 3', 'autor3.com')
          await createBlog(page, 'blog de prueba4', 'autor 4', 'autor4.com')
          await handleView(page, 'blog de prueba3 - autor 3')
          // Hacer clic en el botón 'like' 5 veces
          for (let i = 0; i < 5; i++) {
            await handleLike(page, 'blog de prueba3 - autor 3',`likes ${i+1}`)
          }
          await createBlog(page, 'blog de prueba5', 'autor 5', 'autor5.com')
          await handleView(page, 'blog de prueba1 - autor 1')
          await handleView(page, 'blog de prueba3 - autor 3')
          // Obtener los títulos de los blogs en el orden en que aparecen en la página
          const blogLocator = page.locator('.blog')
          const blogTitles = await blogLocator.allTextContents()

          // Verificar que los títulos están en el orden esperado
          expect(blogTitles).toEqual([
            'blog de prueba3 - autor 3 view',
            'blog de prueba1 - autor 1 view',
            'blog de prueba2 - autor 2 view',
            'blog de prueba4 - autor 4 view',
            'blog de prueba5 - autor 5 view'
          ])
        })
      })
  })