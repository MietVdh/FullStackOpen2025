
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