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


// Blog information and the number of likes are displayed to unauthenticated users, 
// buttons are not displayed

test('when no user is authenticated, blog information is displayed but buttons are not shown', async () => {
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

    render(
    <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
        <Routes>
            <Route path="/blogs/:id" 
            element={
                <BlogDetails 
                    user={null}
                    blogs={[blog]}
                    setBlogs={vi.fn()}
                    displayMessage={vi.fn()} />
            } />
        </Routes>
    </MemoryRouter>)

    expect(await screen.findByText(/Test Blog Title/)).toBeInTheDocument()
    expect(await screen.findByText(/Test Author/)).toBeInTheDocument()
    expect(await screen.findByText(/http:\/\/testblog.com/)).toBeInTheDocument()
    expect(await screen.findByText(/5 likes/)).toBeInTheDocument()

    expect(screen.queryByRole('button', { text: 'like' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { text: 'remove' })).not.toBeInTheDocument()
})

//Authenticated users who are not the blog’s creator are shown only the like button

test('when a user is authenticated who is not the creator of the blog, only the like button is shown', async () => {
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
    </MemoryRouter>)

    expect(screen.queryByRole('button', { name: 'like' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
})





//The blog’s creator is also shown the delete button
test('when the authenticated user is the creator of the blog, the remove button is shown', async () => {
    
    const loggedInUser = {
        name: 'Another User',
        username: 'anotheruser'
    }
    
    const blog = {
        id: '123',
        title: 'Test Blog Title',
        author: 'Test Author',
        url: 'http://testblog.com',
        likes: 5,
        user: loggedInUser
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
    </MemoryRouter>)

    expect(screen.queryByRole('button', { name: 'like' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeInTheDocument()
})