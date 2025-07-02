import React from 'react'
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

function Home() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    // Navigate to another page, e.g., /dashboard
    navigate('/dashboard');
  };

  return (
    <div className="home-container">
      <div className="home-welcome" style={{ cursor: 'pointer' }} onClick={handleHomeClick}>
        <h1>Welcome to the Fitness Tracker</h1>
        <p>Track your workouts, monitor your progress, and achieve your fitness goals with the universe's best fitness platform.</p>
        <span style={{fontSize: '0.95rem', color: '#00ffae'}}>Click here to go to Dashboard</span>
      </div>
      <div className="home-swiper">
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
              <img src={img} alt={`Fitness ${idx + 1}`} className="home-slide-img" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default Home
