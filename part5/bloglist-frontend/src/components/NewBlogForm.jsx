import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
      <h2>Create new</h2>
      <form onSubmit={handleNewBlogSubmit}>
        <label>
          title:
          <input 
            type="text" 
            onChange={({ target }) => setTitle(target.value)} 
            name="blog-title" 
            value={title} 
            data-testid="title-input"
          />
        </label>
        <label>
          author:
          <input 
            type="text" 
            onChange={({ target }) => setAuthor(target.value)} 
            name="blog-author" 
            value={author} 
            data-testid="author-input"
          />
        </label>
        <label>
          url:
          <input 
            type="text" 
            onChange={({ target }) => setUrl(target.value)} 
            name="blog-url" 
            value={url} 
            data-testid="url-input"
          />
        </label>
        <button type="submit">create</button>
      </form>
    </div>
  )}

export default NewBlogForm