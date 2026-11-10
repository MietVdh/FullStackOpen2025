import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'
import blogService from '../services/blogs'

const NewBlogForm = ({ blogs, setBlogs, displayMessage }) => {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleNewBlogSubmit = async (event) => {
    event.preventDefault()

    const newBlog = {
      title: title,
      author: author,
      url: url,
    }

    const returnedBlog = await blogService.create(newBlog)
    displayMessage(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
    setBlogs(blogs.concat(returnedBlog))
    setTitle('')
    setAuthor('')
    setUrl('')
    navigate('/')

  }

  return (
    <div>
      <h2>Add New Blog</h2>
      <form onSubmit={handleNewBlogSubmit}>
        <div>
          <TextField
          label="Title"
          type="text" 
          onChange={({ target }) => setTitle(target.value)} 
          name="blog-title" 
          value={title} 
          style={{ marginTop: 10 }}
          data-testid="title-input"
        />
        </div>
        <div>
          <TextField
            label="Author"
            type="text" 
            onChange={({ target }) => setAuthor(target.value)} 
            name="blog-author" 
            value={author} 
            style={{ marginTop: 10 }}
            data-testid="author-input"
          />
        </div>
        <div>
          <TextField
            label="Url"
            type="text" 
            onChange={({ target }) => setUrl(target.value)} 
            name="blog-url" 
            value={url} 
            style={{ marginTop: 10 }}
            data-testid="url-input"
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>create</Button>
      </form>
    </div>
  )}

export default NewBlogForm
