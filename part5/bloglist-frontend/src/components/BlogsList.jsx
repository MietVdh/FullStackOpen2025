import Blog from './Blog'

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

export default BlogsList