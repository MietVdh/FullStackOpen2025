import { useState, useEffect } from 'react'
import blogService from '../services/blogs'
import loginService from '../services/login'

const LoginForm = ({ user, setUser, displayMessage }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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

  return (
  <form onSubmit={handleLogin}>
    <h2>Log in to application</h2>
    <div>
      username <input 
        type="text" 
        value={username} 
        name="username"
        onChange={({target}) => setUsername(target.value)}
        />
    </div>
    <div>
      password <input 
        type="password" 
        value={password} 
        name="username" 
        onChange={({target}) => setPassword(target.value)}
        />
    </div>
    <button type="submit">log in</button>
  </form>
)}

export default LoginForm