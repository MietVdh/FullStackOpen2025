import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, blogs, setBlogs, displayMessage }) => {

  const [showDetails, setShowDetails] = useState(false)
  const [likes, setLikes] = useState(blog.likes)


  const handleLikeClick = async () => {
    const updatedBlog = await blogService.update(blog, { ...blog, likes: likes + 1 })
    setLikes(likes + 1)
  }

  const handleRemove = async () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      displayMessage(`Blog "${blog.title}" by ${blog.author} has been deleted`)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const details = () => {
    return (
      <div>
        <div>URL: <a href={blog.url}>{blog.url}</a></div>
        <div>{likes} {likes === 1 ? 'like' : 'likes'} <button onClick={handleLikeClick}>like</button></div>
        <div>Added by {blog.user.name}</div>
        <button onClick={() => setShowDetails(false)}>hide details</button>
        {user.username === blog.user.username ?
          <button onClick={handleRemove}>remove</button>
          : '' }
      </div>
    )
  }

  return  (
    <div style={blogStyle}>
      <div>
        <span><b>{blog.title}</b></span> - {blog.author}
        {showDetails ? details() : <button onClick={() => setShowDetails(true)}>view</button>}
      </div>
    </div>
  )
}

export default Blog