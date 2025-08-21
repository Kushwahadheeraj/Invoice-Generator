import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import type { RootState } from '../store/store';
import Header from '../components/Header';
import loginImg from '../assets/login.jpg';
import loginImg1 from '../assets/login1.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector((s: RootState) => s.auth);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // @ts-ignore
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (token) navigate('/new');
  }, [token, navigate]);

  // Slider images
  const images = [
    loginImg,
    loginImg1,
  ];

  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % images.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-dark-1 flex relative">
      {/* Dynamic Header */}
      <Header variant="auth" title="levitation" subtitle="infotech" />
      
      {/* Left Side - Image Slider */}
      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="relative h-[460px] w-full overflow-hidden rounded-xl shadow">
          <div 
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${slide * 100}%)` }}
          >
            {images.map((src, idx) => (
              <img 
                key={idx} 
                src={src} 
                alt="slide" 
                className="w-full h-full object-cover flex-shrink-0" 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          {/* Form Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Let the Journey Begin!</h1>
            <p className="text-gray-300">This is basic login page which is used for levitation assignment purpose.</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Enter Email ID"
                className="w-full bg-dark-2 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand" 
              />
              <p className="text-gray-400 text-sm mt-1">This email will be displayed with your inquiry.</p>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Current Password</label>
              <input 
                type="password" 
                required 
                minLength={6} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Enter the Password"
                className="w-full bg-dark-2 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand" 
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
            
            <div className="flex items-center gap-4">
              <button 
                disabled={loading} 
                type="submit" 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-md transition-colors"
              >
                {loading ? 'Logging in...' : 'Login now'}
              </button>
              <Link to="/register" className="text-white hover:text-gray-300">Forget password?</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Top Right Corner - Branding */}
      <div className="absolute top-6 right-6">
        <div className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-colors text-sm">
          Connecting People With Technology
        </div>
      </div>
    </div>
  );
};

export default Login;


