import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../styles/Header.css'
import { gsap } from 'gsap'

//
// You can replace this with your own image path or import
const fitnessImage = "https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg"

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const imgRef = useRef(null)
  const navigate = useNavigate()

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (imgRef.current) {
      gsap.fromTo(
        imgRef.current,
        { rotateY: 0 },
        { rotateY: 360, duration: 3, ease: "power2.inOut" }
      )
    }
  }, []) // run after mount

  return (
    <>
      <div className="header">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>FitWithUs</Link>
        </div>
        <nav className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
          <Link to="/dashboard">Dashboard</Link>
       
        </nav>
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span style={{transform: menuOpen ? 'rotate(45deg) translate(6px, 6px)' : ''}}></span>
          <span style={{opacity: menuOpen ? 0 : 1}}></span>
          <span style={{transform: menuOpen ? 'rotate(-45deg) translate(7px, -7px)' : ''}}></span>
        </div>
        {menuOpen && (
          <div className="mobile-nav">
            <Link to="/home" onClick={closeMenu}>Home</Link>
            <Link to="/login" onClick={closeMenu}>Login</Link>
            <Link to="/signup" onClick={closeMenu}>Signup</Link>
            <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
   
          </div>
        )}
      </div>

      {/* Left and Right Section */}
      <div className="header-content">
        <div className="left-section">
          <h1>Fitness Tracker</h1>
          <p>Fitness Tracker is a platform that helps you track your fitness goals and progress.</p>
          <button
            className="get-started-btn"
            onClick={() => navigate('/signup')}
          >
            Get Started
          </button>
        </div>
        <div className="right-section">
          <img
            ref={imgRef}
            src={fitnessImage}
            alt="Fitness Tracker"
            style={{ display: 'block', backfaceVisibility: 'hidden' }}
          />
        </div>
      </div>
    </>
  )
}

export default Header;
