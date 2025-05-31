const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, logout, likeByText } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // empty DB
    await request.post('/api/testing/reset')
    // create users for backend
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Harry Potter',
        username: 'potter',
        password: 'quidditch'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByTestId('loginform')
    expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
      await expect(page.getByTestId('bloglist')).toBeVisible()
    })
    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrongpassword')

      await expect(page.getByText('Wrong credentials')).toBeVisible()
      await expect(page.getByTestId('bloglist')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'a blog created by Playwright', 'Playwright tester', 'www.example.com/playwright')
      const blogsDiv = await page.getByTestId('bloglist')
      await expect(blogsDiv).toContainText('a blog created by Playwright')
    })

    describe('when there are some blogs in the database', () => {
      beforeEach( async ({ page }) => {
        await createBlog(page, 'first blog', 'Playwright tester', 'www.example.com/first')
        await createBlog(page, 'second blog', 'Playwright tester', 'www.example.com/second')
        await createBlog(page, 'third blog', 'Playwright tester', 'www.example.com/third')
      })

      test('a blog can be liked', async ({ page }) => {
        const firstBlogDiv = page.getByTestId('blog').filter({ hasText: 'first blog' })
        await firstBlogDiv.getByRole('button', { name: 'view' }).click()
        const likesDiv = firstBlogDiv.getByTestId('likes')
        await likesDiv.getByRole('button', { name: 'like' }).click()
        expect(likesDiv).toContainText('1 like')
        await likesDiv.getByRole('button', { name: 'like' }).click()
        expect(likesDiv).toContainText('2 likes')
      })

      test('the user who added a blog can delete it', async ({ page }) => {
        const firstBlogDiv = page.getByTestId('blog').filter({ hasText: 'first blog' })
        await firstBlogDiv.getByRole('button', { name: 'view' }).click()

        page.on('dialog', dialog => dialog.accept());
        await firstBlogDiv.getByRole('button', { name: 'remove' }).click()
        await expect(firstBlogDiv).not.toBeVisible()
      })

      test('only the user who added a blog can see its delete button', async ({ page }) => {
        await logout(page)
        await loginWith(page, 'potter', 'quidditch')
        const firstBlogDiv = page.getByTestId('blog').filter({ hasText: 'first blog' })
        await firstBlogDiv.getByRole('button', { name: 'view' }).click()
        await expect(firstBlogDiv.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      test('blogs are ordered by likes', async ({ page }) => {
        // should be in order: second - third - first
        await likeByText(page, 'third blog', 3)
        await likeByText(page, 'second blog', 5)
        await likeByText(page, 'first blog', 1)

        await logout(page)
        await loginWith(page, 'potter', 'quidditch')
        const blogs = page.getByTestId('blog').all()
        await expect(page.getByTestId('blog')).toContainText(['second blog', 'third blog', 'first blog'])
        // await expect(page.getByTestId('blog')).toContainText(['5 likes', '3 likes', '1 like'])
      })

    })

  })
})