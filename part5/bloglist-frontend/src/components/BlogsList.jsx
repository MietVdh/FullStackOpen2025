import Blog from './Blog'
import PropTypes from 'prop-types'


const BlogsList = ({ blogs, setBlogs, user, displayMessage }) => (
  <div>
    <h2>blogs</h2>
    {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
      <Blog
        key={blog.id}
        blog={blog}
        user={user}
        blogs={blogs}
        setBlogs={setBlogs}
        displayMessage={displayMessage}/>
    )}
  </div>
)

BlogsList.propTypes = {
  blogs: PropTypes.array.isRequired,
  setBlogs: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  displayMessage: PropTypes.func.isRequired
}

export default BlogsList