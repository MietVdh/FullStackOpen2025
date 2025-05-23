import { useState, useEffect } from 'react'
import BlogsList from './components/BlogsList'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import blogService from './services/blogs'
import loginService from './services/login';


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('bloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      displayMessage('Login successful')
    } catch (exception) {
      displayMessage('Wrong credentials')
      console.log('Wrong credentials')
    }
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
          username={username} 
          password={password} 
          handleLogin={handleLogin}
          setUsername={setUsername}
          setPassword={setPassword}
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