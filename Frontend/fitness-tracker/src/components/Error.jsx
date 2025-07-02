import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Error.css'

function Error() {
  const navigate = useNavigate()
  return (
    <div className="error-container">
      <div className="error-card">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-message">Sorry, the page you are looking for does not exist or has been moved.</p>
        <button className="get-started-btn error-btn" onClick={() => navigate('/')}>Go Home</button>
      </div>
    </div>
  )
}

export default Error
