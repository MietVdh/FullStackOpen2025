import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { AppBar, Button, Container, Toolbar } from '@mui/material'
import BlogsList from './components/BlogsList'
import BlogDetails from './components/BlogDetails'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)

  const getStoredUser = () => {
    const loggedUser = window.localStorage.getItem('bloglistUser')
    return loggedUser ? JSON.parse(loggedUser) : null
  }

  const [user, setUser] = useState(getStoredUser)

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token)
    }
  }, [user])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
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
    displayMessage({ text: 'You were successfully logged out', type: 'success' })
  }


  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <Router>
        <AppBar position="static" style={{ marginBottom: 20, padding: 10 }}>
          <Toolbar>
            <Button color="inherit" component={Link} to="/" sx={style}>Blogs</Button>

            {user ? <Button color="inherit" component={Link} sx={style} to="/new">new blog</Button> : ''}
            {user ? <Button color="inherit" onClick={handleLogout} sx={style}>Log out</Button> : <Button color="inherit" component={Link} sx={style} to="/login">login</Button>}

          </Toolbar>
        </AppBar>

        <Notification message={message} />

        <Routes>
          <Route path="/login" element={
            <LoginForm
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
      </Router>
    </Container>


  )
}

export default App