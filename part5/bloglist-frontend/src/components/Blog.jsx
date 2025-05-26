import { useState } from 'react'

const Blog = ({ blog }) => {

  const [showDetails, setShowDetails] = useState(false)

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
        <div>{blog.likes} {blog.likes === 1 ? 'like' : 'likes'} <button>like</button></div>
        <div>Added by {blog.user.name}</div>
        <button onClick={() => setShowDetails(false)}>hide details</button>
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