import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { test, expect } from 'vitest'
import Blog from './Blog'
import BlogDetails from './BlogDetails'

test('renders author and title', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 5,
  }

  render(
    <MemoryRouter>
      <Blog blog={blog} />
    </MemoryRouter>
  )

  expect(screen.getByText('Test Blog Title')).toBeInTheDocument()
  expect(screen.getByText('Test Author')).toBeInTheDocument()
  expect(screen.queryByText('http://testblog.com')).not.toBeInTheDocument()
  expect(screen.queryByText('5 likes')).not.toBeInTheDocument()
  expect(screen.queryByRole('button')).not.toBeInTheDocument()

})


test('link points to blog details', () => {
  const blog = {
    id: '123',
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 5,
  }

  render(
    <MemoryRouter>
      <Blog blog={blog} />
    </MemoryRouter>
  )

  const link = screen.getByRole('link', { name: 'Test Blog Title' })

  expect(link).toHaveAttribute('href', '/blogs/123')
})



test('navigates to blog details', async () => {
  const blog = {
    id: '123',
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 5,
    user: { username: 'testuser', name: 'Test User' },
  }

  const user = userEvent.setup()

  render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Blog blog={blog} />} />
        <Route
          path="/blogs/:id"
          element={<BlogDetails blogs={[blog]} user={null} />}
        />
      </Routes>
    </MemoryRouter>
  )

  await user.click(screen.getByRole('link', { name: 'Test Blog Title' }))

  expect(screen.getByText('http://testblog.com')).toBeInTheDocument()
})