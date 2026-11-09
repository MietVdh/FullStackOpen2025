// Make a test for the new blog form. 
// The test should check, that the form calls the event handler it received as props
//  with the right details when a new blog is created.

import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'
import blogService from '../services/blogs'

vi.mock('../services/blogs', () => ({
    default: {
        create: vi.fn().mockResolvedValue({
            title: 'Test Title',
            author: 'Test Author',
            url: 'http://testurl.com',
        }),
    },
}))

test('calls event handler with right details when a new blog is created', async () => {

    const displayMessage = vi.fn()
    const user = userEvent.setup()
    
    render(
        <MemoryRouter>
            <NewBlogForm 
            displayMessage={displayMessage} 
            blogs={[]}
            setBlogs={vi.fn()}
        />
        </MemoryRouter>
    )

    const authorInput = screen.getByRole('textbox', { name: 'author:' })
    const titleInput = screen.getByRole('textbox', { name: 'title:' })
    const urlInput = screen.getByRole('textbox', { name: 'url:' })
    const createButton = screen.getByRole('button', { text: 'create' })

    await user.type(authorInput, 'Test Author')
    await user.type(titleInput, 'Test Title')
    await user.type(urlInput, 'http://testurl.com')
    await user.click(createButton)

    expect(blogService.create).toHaveBeenCalledTimes(1)
    expect(blogService.create).toHaveBeenCalledWith({
      title: 'Test Title',
      author: 'Test Author',
      url: 'http://testurl.com'
    })  
})