const LoginForm = ({ username, password, handleLogin, setUsername, setPassword }) => (
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
)

export default LoginForm