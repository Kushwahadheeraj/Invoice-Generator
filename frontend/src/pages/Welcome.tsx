import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'

const Welcome: React.FC = () => {
  const images = [
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529336953121-4f3b7e68a9f0?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?q=80&w=1200&auto=format&fit=crop',
  ]
  const [slide, setSlide] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % images.length), 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen bg-light-bg relative">
      {/* Dynamic Header */}
      <Header showLogoutButton={true} title="levitation" subtitle="infotech" />
      
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-dark-1 to-dark-2 p-6 rounded-xl shadow">Let the Journey Begin!</h1>
          <p className="text-light-2 max-w-md">This is basic login page which is used for levitation assignment purpose.</p>
          <Link to="/new" className="inline-block mt-8 bg-brand hover:bg-brand-light text-white font-bold px-6 py-3 rounded-md">Add Products</Link>
        </div>
        <div className="relative h-[460px] w-full overflow-hidden rounded-xl shadow">
          {images.map((src, idx) => (
            <img key={idx} src={src} alt="slide" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx===slide?'opacity-100':'opacity-0'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Welcome


