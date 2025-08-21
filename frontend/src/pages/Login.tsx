import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import type { RootState } from '../store/store';
import Header from '../components/Header';
import loginImg from '../assets/login.jpg';
import loginImg1 from '../assets/login1.png';
import frameLogo from '../assets/Group.png';

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

  // Slider images with seamless continuous sequence
  const images = [
    loginImg,
    loginImg1,
    loginImg,
    loginImg1,
    loginImg,
    loginImg1,
    loginImg,
    loginImg1,
  ];

  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setSlide((s) => {
        // Create seamless loop - when reaching end, reset to start
        if (s >= images.length - 1) return 0;
        return s + 1;
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen flex relative bg-black">
      {/* Dynamic Header - Show on all screen sizes */}
      <Header variant="login" title="levitation" subtitle="infotech" />
      
      {/* Full page background cover */}
      <div
        className="absolute inset-0 w-full h-full bg-black -z-20"
      />
      
      {/* Main container with responsive design */}
      <div 
        className="relative flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen lg:h-[1024px] rotate-0 opacity-100 overflow-hidden"
      >
        {/* Mobile Layout: Image Slider at Top, Form Below */}
        <div className="w-full lg:hidden flex flex-col gap-6 pt-20">
          {/* Top: Image Slider */}
          <div className="w-full h-64 sm:h-80 overflow-hidden rounded-xl shadow">
            <div 
              className="flex transition-transform duration-2000 ease-linear h-full"
              style={{ transform: `translateX(-${slide * 120}%)` }}
            >
              {images.map((src, idx) => (
                <div key={idx} className="flex-shrink-0 w-full h-full mr-4">
                  <img 
                    src={src} 
                    alt="slide" 
                    className="w-full h-full object-cover rounded-lg" 
                  />
                </div>
              ))}
            </div>
            
            {/* Slide indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {[0, 1].map((index) => (
                <button
                  key={index}
                  onClick={() => setSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    slide % 2 === index 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Bottom: Login Form */}
          <div className="w-full flex flex-col gap-6 px-4 sm:px-6">
            {/* Company Logo and Name */}
            <div className="flex items-center gap-3 justify-center">
              <img 
                src={frameLogo} 
                alt="Company Logo" 
                className="w-12 h-12 sm:w-14 sm:h-14"
              />
              <div className="flex flex-col">
                <span className="text-white text-lg sm:text-xl font-bold">levitation</span>
                <span className="text-white text-sm sm:text-base">infotech</span>
              </div>
            </div>

            <div className="w-full max-w-md mx-auto">
              {/* Form Header */}
              <div className="mb-6 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Let the Journey Begin!</h1>
                <p className="text-gray-300 text-sm sm:text-base">This is basic login page which is used for levitation assignment purpose.</p>
              </div>

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2 text-sm sm:text-base">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="Enter Email ID"
                    className="w-full bg-dark-2 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand text-sm sm:text-base" 
                  />
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">This email will be displayed with your inquiry.</p>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2 text-sm sm:text-base">Current Password</label>
                  <input 
                    type="password" 
                    required 
                    minLength={6} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Enter the Password"
                    className="w-full bg-dark-2 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand text-sm sm:text-base" 
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}
                
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button 
                    disabled={loading} 
                    type="submit" 
                    className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md transition-colors text-sm sm:text-base"
                  >
                    {loading ? 'Logging in...' : 'Login now'}
                  </button>
                  <Link to="/register" className="text-white hover:text-gray-300 text-sm sm:text-base text-center">Don't have an account? Register here</Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Desktop Layout: Original Side-by-Side */}
        <div className="hidden lg:flex w-full h-full">
          {/* Left Side - Image Slider */}
          <div 
            className="absolute w-[616px] h-[744px] top-[164px] left-[59px] rotate-0 opacity-100 flex flex-col gap-5"
          >
            <div className="relative h-full w-full overflow-hidden rounded-xl shadow">
              <div 
                className="flex transition-transform duration-2000 ease-linear h-full"
                style={{ transform: `translateX(-${slide * 120}%)` }}
              >
                {images.map((src, idx) => (
                  <div key={idx} className="flex-shrink-0 w-full h-full mr-8">
                    <img 
                      src={src} 
                      alt="slide" 
                      className="w-full h-full object-cover rounded-lg" 
                    />
                  </div>
                ))}
              </div>
              
              {/* Slide indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {[0, 1].map((index) => (
                  <button
                    key={index}
                    onClick={() => setSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      slide % 2 === index 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div 
            className="absolute w-[565px] h-[578.123779296875px] top-[180px] left-[784px] rotate-0 opacity-100 flex flex-col gap-11"
          >
            {/* Company Logo and Name */}
            <div 
              className="flex items-center gap-[15.26px] rotate-0 opacity-100"
            >
              <img 
                src={frameLogo} 
                alt="Company Logo" 
                className="w-[59.51820373535156px] h-[59.51820373535156px] rotate-0 opacity-100"
              />
              <div className="flex flex-col">
                <span className="text-white text-2xl font-bold">levitation</span>
                <span className="text-white text-lg">infotech</span>
              </div>
            </div>

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
                  <Link to="/register" className="text-white hover:text-gray-300">Don't have an account? Register here</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


