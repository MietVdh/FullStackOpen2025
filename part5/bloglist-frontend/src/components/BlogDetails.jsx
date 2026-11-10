import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'

const BlogDetails = ({ user, blogs, setBlogs, displayMessage }) => {
    const navigate = useNavigate()
    const { id } = useParams()
    const blog = blogs.find(b => b.id === id)
    const [likes, setLikes] = useState(blog.likes)

  
    const handleLikeClick = async () => {
      const updatedBlog = await blogService.update(blog, { ...blog, likes: likes + 1 })
      setLikes(likes + 1)
      setBlogs(blogs.map(b => b.id === blog.id ? updatedBlog : b))
    }
  
    const handleRemove = async () => {
      if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
        blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        displayMessage(`Blog "${blog.title}" by ${blog.author} has been deleted`)
        navigate('/')
      }
    }
  
    const blogStyle = {
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5
    }

    return  (
    <div style={blogStyle}>
      <div>
        <span><b>{blog.title}</b></span> - {blog.author}
        <div>
            <div>URL: <a href={blog.url}>{blog.url}</a></div>
            <div>
              <span data-testid="likes">{likes} {likes === 1 ? 'like' : 'likes'}</span> 
              {user 
                ? <button data-testid="likeBtn" onClick={handleLikeClick}>like</button> 
                : ''}
            </div>
            <div>Added by {blog.user.name}</div>
            {user ? user.username === blog.user.username ?
            <button name="remove" data-testid="removeBtn" onClick={handleRemove}>remove</button>
            : '' : ''}
        </div>
      </div>
    </div>
  )
}

export default BlogDetails