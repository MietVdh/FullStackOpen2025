import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import BlogDetails from './BlogDetails'
import blogService from '../services/blogs'


vi.mock('../services/blogs', () => ({
    default: {
        update: vi.fn().mockResolvedValue({}),
        remove: vi.fn(),
    },
}))

test('when like button is clicked twice, handler is called twice', async () => {
    const blog = {
        id: '123',
        title: 'Test Blog Title',
        author: 'Test Author',
        url: 'http://testblog.com',
        likes: 5,
        user: {
            name: 'Test User',
            username: 'testuser'
        }
    }

    const loggedInUser = {
        name: 'Another User',
        username: 'anotheruser'
    }
    

    render(
    <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
        <Routes>
            <Route path="/blogs/:id" 
            element={
                <BlogDetails 
                    user={loggedInUser}
                    blogs={[blog]}
                    setBlogs={vi.fn()}
                    displayMessage={vi.fn()} />
            } />
        </Routes>
    </MemoryRouter>
)

    const user = userEvent.setup()
    const likeButton = await screen.findByRole('button', { text: 'like' })

    expect(likeButton).toBeInTheDocument()

    await user.click(likeButton)
    await user.click(likeButton) 

    expect(blogService.update).toHaveBeenCalledTimes(2)



})