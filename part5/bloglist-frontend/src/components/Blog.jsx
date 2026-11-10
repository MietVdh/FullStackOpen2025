import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  return  (
    <div style={blogStyle}>
      <div className="blog" data-testid="blog">
        <Link to={`/blogs/${blog.id}`}><b>{blog.title}</b></Link><span> - </span><span>{blog.author}</span>
      </div>
    </div>
  )
}

export default Blog