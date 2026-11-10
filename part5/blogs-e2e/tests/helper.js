const { expect } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  const loginResponse = page.waitForResponse(response =>
        response.url().endsWith('/api/login') &&
        response.request().method() === 'POST'
    )

  await page.goto('/login')
  await page.getByRole('textbox', { name: 'Username' }).fill(username)
  await page.getByRole('textbox', { name: 'Password' }).fill(password)
  await page.getByRole('button', { name: 'log in' }).click()


  await loginResponse
}
 
const createBlog = async (page, title, author, url) => {
  await page.goto('/new')

  await page.getByRole('textbox', { name: 'Title' }).fill(title)
  await page.getByRole('textbox', { name: 'Author' }).fill(author)
  await page.getByRole('textbox', { name: 'URL' }).fill(url)

   const createResponse = page.waitForResponse(response =>
    response.url().endsWith('/api/blogs') &&
    response.request().method() === 'POST' &&
    response.ok()
  )

  await page.getByRole('button', { name: 'create' }).click()
  await createResponse
  await expect(page.getByTestId('blog').filter({ hasText: title }))
    .toBeVisible()
}

const logout = async (page) => {
  await page.getByRole('button', { name: 'log out' }).click()
}

const likeByText = async (page, text, numOfLikes) => {
  const blogDiv = page.getByTestId('blog').filter({ hasText: text })
  await blogDiv.getByRole('button', { name: 'view' }).click()
  const likesDiv = blogDiv.getByTestId('likes')
  const likeButton = likesDiv.getByRole('button', { name: 'like' })
  for (let i=0; i<numOfLikes; i++) {
    await likeButton.click()
  }
  await blogDiv.getByText('like').waitFor()
}

export { loginWith, createBlog, logout, likeByText }