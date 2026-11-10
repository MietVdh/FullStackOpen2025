import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Typography, Box, Button } from '@mui/material'
import blogService from '../services/blogs'

const BlogDetails = ({ user, blogs, setBlogs, displayMessage }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const blog = blogs.find(b => b.id === id)
  const [likes, setLikes] = useState(blog?.likes ?? 0)

  if (!blog) {
    return null
  }

  const handleLikeClick = async () => {
    const newLikes = likes + 1
    setLikes(newLikes)
    const updatedBlog = await blogService.update(blog, { ...blog, likes: newLikes })
    setBlogs(blogs.map(b => b.id === blog.id ? updatedBlog : b))
  }

  const handleRemove = async () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      const toBeDeleted = { ...blog }
      await blogService.remove(toBeDeleted.id)
      navigate('/')
      setBlogs(blogs.filter(b => b.id !== toBeDeleted.id))
      displayMessage({ text: `Blog "${toBeDeleted.title}" by ${toBeDeleted.author} has been deleted`, type: 'success' })

    }
  }

  const blogStyle = {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    border: 'none',
    marginBottom: 5
  }

  return  (
    <Box sx={blogStyle}>
      <Typography variant="h3" sx={{ paddingBottom: 2 }}>{blog.title}</Typography>
      <Typography variant="h5">by {blog.author}</Typography>

      <div style={{ marginTop: 10, marginBottom: 10 }}><a href={blog.url}>{blog.url}</a></div>
      <div style={{ marginTop: 10, marginBottom: 10 }}>Added by {blog.user.name}</div>
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <span data-testid="likes">{likes} {likes === 1 ? 'like' : 'likes'}</span>
        {user
          ? <Button data-testid="likeBtn" onClick={handleLikeClick} variant="contained" color="primary" style={{ marginLeft: 10 }}>like</Button>
          : ''}

        {user ? user.username === blog.user.username ?
          <Button name="remove" data-testid="removeBtn" onClick={handleRemove} variant="contained" color="error" style={{ marginLeft: 10 }}>remove</Button>
          : '' : ''}
      </div>
    </Box>
  )
}

export default BlogDetails