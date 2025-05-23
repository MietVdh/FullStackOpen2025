const LoginForm = ({ username, password, handleLogin, setUsername, setPassword }) => (
  <form onSubmit={handleLogin}>
    <h2>Log in to application</h2>
    username <input 
      type="text" 
      value={username} 
      name="username"
      onChange={({target}) => setUsername(target.value)}
      />
    password <input 
      type="password" 
      value={password} 
      name="username" 
      onChange={({target}) => setPassword(target.value)}
      />
    <button type="submit">log in</button>
  </form>
)

export default LoginForm