import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'

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
    
    // const blogsList = container.querySelector('.blog')
    // expect(blogsList.querySelector('button').not.toBeInTheDocument())
})