import { useState, useEffect } from 'react'
import BlogsList from './components/BlogsList'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import blogService from './services/blogs'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)


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
    }, 5000);
  }

  const handleLogout = event => {
    event.preventDefault()

    window.localStorage.removeItem('bloglistUser')
    blogService.setToken(null)
    setUser(null)
    displayMessage('You were successfully logged out')
  }


  return (
    <div>
      { message && <div className="notification">{message}</div> }

      { user === null ?
      
        <LoginForm 
          user={user}
          setUser={setUser}
          displayMessage={displayMessage}
        />
      : 
        <div>
          <p>{user.name} logged in </p>
          <button onClick={handleLogout}>Log out</button>

          <NewBlogForm setBlogs={setBlogs} blogs={blogs} displayMessage={displayMessage}/>
          
          <BlogsList blogs={blogs} />
        </div>
      }
    </div>
  )
}

export default App