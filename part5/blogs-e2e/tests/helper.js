
const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'log in' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByTestId('title-field').fill(title)
  await page.getByTestId('author-field').fill(author)
  await page.getByTestId('url-field').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  const bloglistDiv = await page.getByTestId('bloglist')
  await bloglistDiv.getByText(title).waitFor()
}

export { loginWith, createBlog }