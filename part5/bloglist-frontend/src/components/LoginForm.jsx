import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'
import blogService from '../services/blogs'
import loginService from '../services/login'

const LoginForm = ({ setUser, displayMessage }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('bloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      displayMessage({ text: 'Login successful', type: 'success' })
      navigate('/')
    } catch {
      displayMessage({ text: 'Wrong credentials', type: 'error' })
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Log In</h2>
      <div>
        <TextField
          label="Username"
          type="text"
          value={username}
          name="username"
          data-testid="username"
          onChange={({ target }) => setUsername(target.value)}
          style={{ marginBottom: 10 }}
        />
      </div>
      <div>
        <TextField
          label="Password"
          type="password"
          value={password}
          name="password"
          data-testid="password"
          onChange={({ target }) => setPassword(target.value)}
          style={{ marginTop: 10 }}
        />
      </div>
      <Button type="submit" variant="contained" style={{ marginTop: 10 }}>log in</Button>
    </form>
  )}

export default LoginForm