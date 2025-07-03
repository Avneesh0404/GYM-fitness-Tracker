import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/Header.css'
import { gsap } from 'gsap'

//
// You can replace this with your own image path or import
const fitnessImage = "https://imgs.search.brave.com/dGHG7WelJa5VN_HsaRDUSjTrOjSiZD0WE52Jki6fFdI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMDYv/Njk0LzA1NS9zbWFs/bC9hc2lhbi1zcG9y/dC13b21hbi1ydW5u/aW5nLW9uLXRyZWFk/bWlsbC1pbi1maXRu/ZXNzLWNsdWItY2Fy/ZGlvLXdvcmtvdXQt/aGVhbHRoeS1saWZl/c3R5bGUtZ3V5LXRy/YWluaW5nLWluLWd5/bS1zcG9ydC1ydW5u/aW5nLWNvbmNlcHQt/cGhvdG8uanBn"

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const imgRef = useRef(null)

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
          <button className="get-started-btn">Get Started</button>
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
