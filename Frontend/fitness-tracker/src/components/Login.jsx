import React, { useState } from 'react'
import '../styles/Home.css'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (response.ok) {
        // Save token and user info
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        // Redirect to dashboard
        navigate('/dashboard')
      } else {
        setError(data.msg || 'Login failed')
      }
    } catch (err) {
      setError('Error connecting to server')
    }
  }

  return (
    <div className="home-container login-container">
      <div className="login-card">
        <h2 className="login-title">Login to Fitness Tracker</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="get-started-btn login-btn">Login</button>
          {error && <div className="login-error">{error}</div>}
        </form>
      </div>
    </div>
  )
}

export default Login
