const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // empty DB
    await request.post('http://localhost:3003/api/testing/reset')
    // create user for backend
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByTestId('loginform')
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

  // 5.19
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'a blog created by Playwright', 'Playwright tester', 'www.example.com/playwright')
      const notesDiv = await page.getByTestId('bloglist')
      await expect(notesDiv).toContainText('a blog created by Playwright')
    })

    // 5.20 Test that blog can be liked

    // 5.21 Ensure user who added blog can delete it

    // 5.22 Ensure that only user who added blog sees delete button

    // 5.23 Ensure that blogs are arranged according to likes (most likes first)
  })
})