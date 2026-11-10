const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, logout, likeByText } = require('./helper')


describe('Blog app', () => {  
test('front page can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')

    const locator = page.getByText('All Blogs')
    await expect(locator).toBeVisible()
  })})


describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // empty DB
    await request.post('http://localhost:3003/api/testing/reset')
    // create users for backend
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Harry Potter',
        username: 'potter',
        password: 'quidditch'
      }
    })
    await page.goto('/')
  })


  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByTestId('bloglist')).toBeVisible()
    })
    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrongpassword')

      await expect(page.getByText('Wrong credentials')).toBeVisible()
      await expect(page.getByTestId('bloglist')).not.toBeVisible()
    })
  })

  // test('login response', async ({ page }) => {
  //     const loginResponsePromise = page.waitForResponse(response =>
  //         response.url().includes('/api/login') &&
  //         response.request().method() === 'POST'
  //     )

  //     await loginWith(page, 'mluukkai', 'salainen')

  //     const response = await loginResponsePromise

  //     console.log('status:', response.status())
  //     console.log('body:', await response.json())
  // })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByTestId('bloglist')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'a blog created by Playwright', 'Playwright tester', 'www.example.com/playwright')
      await page.goto('http://localhost:5173')
      const blogsDiv = page.getByTestId('blog')
      await expect(blogsDiv).toContainText('a blog created by Playwright')
    })

    describe('when there are some blogs in the database', () => {
      beforeEach( async ({ page }) => {
        await createBlog(page, 'first blog', 'Playwright tester', 'www.example.com/first')
        await createBlog(page, 'second blog', 'Playwright tester', 'www.example.com/second')
        await createBlog(page, 'third blog', 'Playwright tester', 'www.example.com/third')
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('link', { name: 'first blog' }).click()
        const likesSpan = page.getByTestId('likes')
        await page.getByTestId('likeBtn').click()
        await expect(likesSpan).toContainText('1 like')
      })

      test('the user who added a blog can delete it', async ({ page }) => {
        page.on('dialog', dialog => dialog.accept());
        await page.getByRole('link', { name: 'first blog' }).click()
        await page.getByTestId('removeBtn').click()

        await expect(page.getByTestId('blog').filter({ hasText: 'first blog' })).toHaveCount(0)
      })

      test('only the user who added a blog can see its delete button', async ({ page }) => {
        await logout(page)
        await loginWith(page, 'potter', 'quidditch')
        await page.getByRole('link', { name: 'first blog' }).click()
        await expect(page.getByTestId('removeBtn')).not.toBeVisible()
      })
    })
  })
/*
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
*/
    })

