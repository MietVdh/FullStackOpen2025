import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import BlogsList from './components/BlogsList'
import BlogDetails from './components/BlogDetails'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import blogService from './services/blogs'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [newBlogFormVisible, setNewBlogFormVisible] = useState(false)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('bloglistUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const displayMessage = msg => {
    setMessage(msg)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleLogout = event => {
    event.preventDefault()

    window.localStorage.removeItem('bloglistUser')
    blogService.setToken(null)
    setUser(null)
    displayMessage('You were successfully logged out')
  }


  const padding = { padding: 5 }

  const newBlogForm = () => {
    const hideWhenVisible = { display: newBlogFormVisible ? 'none' : '' }
    const showWhenVisible = { display: newBlogFormVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setNewBlogFormVisible(true)}>new blog</button>
        </div>
        <div style={showWhenVisible}>
          <NewBlogForm
            setBlogs={setBlogs}
            blogs={blogs}
            displayMessage={displayMessage}
            setNewBlogFormVisible={setNewBlogFormVisible}/>
          <button onClick={() => setNewBlogFormVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }


  return (
    <Router>
      <div>
        <Link style={padding} to="/">blogs</Link>
        {user ? <Link style={padding} to="/new">new blog</Link> : ''}
        {user ? <button onClick={handleLogout}>Log out</button> : <Link style={padding} to="/login">login</Link>}
      </div>

      { message && <div className="notification">{message}</div> }

      <Routes>
        <Route path="/login" element={
          <LoginForm 
            user={user}
            setUser={setUser}
            displayMessage={displayMessage} />
        } />

        <Route path="/blogs/:id" element={
          <BlogDetails
            user={user}
            blogs={blogs}
            setBlogs={setBlogs}
            displayMessage={displayMessage} />
        } />

        <Route path="/new" element={
          <NewBlogForm
            setBlogs={setBlogs}
            blogs={blogs}
            displayMessage={displayMessage} />
        } />

        <Route path="/" element={
          <BlogsList 
            blogs={blogs}
            setBlogs={setBlogs}
            user={user}
            displayMessage={displayMessage} />
        }/>
      </Routes>

      {/* <div>
        { message && <div className="notification">{message}</div> }

        { user === null ?
          <LoginForm
            user={user}
            setUser={setUser}
            displayMessage={displayMessage}
          />
          :
          <div>
            <p>{user.name} logged in  <button onClick={handleLogout}>Log out</button></p>

            {newBlogForm()}

            <BlogsList
              blogs={blogs}
              setBlogs={setBlogs}
              user={user}
              displayMessage={displayMessage}/>
          </div>
        }
      </div> */}

    </Router>
    
  )
}

export default App