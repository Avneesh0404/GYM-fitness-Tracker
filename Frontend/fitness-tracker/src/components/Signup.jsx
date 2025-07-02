import React, { useState } from 'react'
import '../styles/Home.css'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle signup logic here
    alert('Signup submitted!')
  }

  return (
    <div className="home-container login-container">
      <div className="login-card">
        <h2 className="login-title">Sign Up for Fitness Tracker</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="login-input"
            required
          />
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
          <button type="submit" className="get-started-btn login-btn">Sign Up</button>
        </form>
      </div>
    </div>
  )
}

export default Signup
