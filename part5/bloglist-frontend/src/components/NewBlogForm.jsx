import { useState, useEffect } from 'react'
import blogService from '../services/blogs'
  

const NewBlogForm = ({ blogs, setBlogs }) => {
  
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
    setBlogs(blogs.concat(returnedBlog))
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
  <div>
    <h2>Create new</h2>
    <form onSubmit={handleNewBlogSubmit}>
      <div>
        title: 
        <input type="text" onChange={({target}) => setTitle(target.value)} name="blog-title" value={title} />
      </div>
      <div>
        author: 
        <input type="text" onChange={({target}) => setAuthor(target.value)} name="blog-author" value={author} />
      </div>
      <div>
        url: 
        <input type="text" onChange={({target}) => setUrl(target.value)} name="blog-url" value={url} />
      </div>
      <button type="submit">create</button>
    </form>
  </div>
)}

export default NewBlogForm