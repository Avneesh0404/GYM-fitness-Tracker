import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import '../styles/Home.css'

const images = [
  'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&w=1200&q=80',
  'https://images.unsplash.com/photo-1517960413843-0aee8e2d471c?auto=format&fit=crop&w=800&q=80',
  'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&w=1200&q=80',
  'https://images.pexels.com/photos/3768913/pexels-photo-3768913.jpeg?auto=compress&w=1200&q=80',
  'https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg?auto=compress&w=1200&q=80',
]

const features = [
  {
    icon: "💪",
    title: "Track Your Progress",
    desc: "Visualize your workout journey with beautiful charts and stats. See your improvements week by week!"
  },
  {
    icon: "📈",
    title: "Smart Suggestions",
    desc: "Get personalized tips when your progress slows down, so you always stay motivated and on track."
  },
  {
    icon: "📝",
    title: "Easy Logging",
    desc: "Log your workouts in seconds. Edit, delete, and review your history anytime."
  },
  {
    icon: "🔒",
    title: "Private & Secure",
    desc: "Your data is safe and only visible to you. We value your privacy."
  }
]

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    const welcome = document.querySelector('.home-welcome')
    if (welcome) {
      welcome.classList.add('fade-in-up')
    }
    return () => {
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  const handleHomeClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="home-container">
      <div className="home-welcome" style={{ cursor: 'pointer' }} onClick={handleHomeClick}>
        <h1>
          <span className="highlighted">Welcome to the Fitness Tracker</span>
        </h1>
        <p>
          <span className="fade-in-delay">
            Track your workouts, monitor your progress, and achieve your fitness goals with the universe's best fitness platform.
          </span>
        </p>
        <span style={{fontSize: '0.95rem', color: '#00ffae'}}>Click here to go to Dashboard</span>
      </div>

      <div className="home-swiper fade-in-delay">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img src={img} alt={`Fitness ${idx + 1}`} className="home-slide-img slide-zoom-in" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Animated Features Section */}
      <div className="features-section">
        {features.map((f, i) => (
          <div className="feature-card fade-in-feature" style={{ animationDelay: `${0.2 + i * 0.18}s` }} key={i}>
            <div className="feature-icon">{f.icon}</div>
            <div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
