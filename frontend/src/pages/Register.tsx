import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/slices/authSlice';
import type { RootState } from '../store/store';
import Header from '../components/Header';
import registerImg from '../assets/register.png';
import register1Img from '../assets/register1.png';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s: RootState) => s.auth);

  // Auto-sliding image state
  const [currentImage, setCurrentImage] = useState(0);
  const images = [registerImg, register1Img];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    // @ts-ignore
    dispatch(register({ name, email, password }))
      .unwrap()
      .then(() => {
        setSuccess('Registered successfully. Redirecting to login...');
        setTimeout(() => navigate('/login'), 1000);
      })
      .catch(() => {});
  };

  return (
    <div className="min-h-screen flex justify-center bg-black">
      {/* Mobile Layout: Vertical Stack */}
      <div className="w-full lg:hidden flex flex-col pt-20 px-4 sm:px-6">
        {/* Dynamic Header - Show on all screen sizes */}
        <Header variant="register" title="levitation" subtitle="solution" />
        
        {/* Top: Image Slider */}
        <div className="w-full h-64 sm:h-80 overflow-hidden rounded-xl shadow-lg mb-8">
          <div className="relative h-full w-full">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Slide ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 rounded-xl ${
                  index === currentImage ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            
            {/* Image indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentImage ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: Registration Form */}
        <div className="w-full flex flex-col gap-6">
          <div className="rounded-lg p-4 sm:p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">Sign up to begin journey</h2>
            <p className="text-gray-300 mb-6 sm:mb-8 text-center text-sm sm:text-base">This is basic signup page which is used for levitation assignment purpose.</p>
            
            <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-white font-medium mb-2 text-sm sm:text-base">Enter your name</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full bg-dark-2 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand text-sm sm:text-base" 
                />
                <p className="text-gray-400 text-xs sm:text-sm mt-1">this name will be displayed with your inquiry</p>
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2 text-sm sm:text-base">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full bg-dark-2 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-brand text-sm sm:text-base" 
                />
                <p className="text-gray-400 text-xs sm:text-sm mt-1">this email will be displayed with your inquiry</p>
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2 text-sm sm:text-base">Password</label>
                <input 
                  type="password" 
                  required 
                  minLength={6} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full bg-dark-2 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand text-sm sm:text-base" 
                />
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Any further updates will be forwarded on this email ID</p>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}
              {success && <p className="text-green-400 text-sm">{success}</p>}
              
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <button 
                  disabled={loading} 
                  type="submit" 
                  className="w-full sm:w-auto bg-brand hover:bg-brand-light text-white font-bold py-3 px-6 sm:px-8 rounded-md transition-colors text-sm sm:text-base"
                >
                  {loading ? 'Please wait...' : 'Register'}
                </button>
                <Link to="/login" className="text-white hover:text-gray-300 text-sm sm:text-base text-center">Already have account ?</Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Desktop Layout: Original Side-by-Side */}
      <div className="hidden lg:flex relative w-[1440px] h-[1024px] rotate-0 opacity-100 bg-black overflow-hidden">
        {/* Dynamic Header */}
        <Header variant="register" title="levitation" subtitle="solution" />

        {/* Full page background cover */}
        <div
          className="absolute inset-0 w-[1440px] h-[1024px] bg-black -z-20"
        />

        {/* Content Row: Left form (480px) + Right slider (830px) */}
        <div className="w-full h-full flex items-start gap-10 px-10 py-12 pt-32 overflow-hidden">
          {/* Left Side - Signup Form (fixed width) */}
          <div
            className="absolute w-[496px] h-[629.87060546875px] top-[208px] left-[65.5px] rotate-0 opacity-100 flex flex-col gap-8"
          >
            {/* Form */}
            <div className="rounded-lg p-8">
              <h2 className="text-3xl font-bold text-white mb-2">Sign up to begin journey</h2>
              <p className="text-gray-300 mb-8">This is basic signup page which is used for levitation assignment purpose.</p>
              
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">Enter your name</label>
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="w-full bg-dark-2 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand" 
                  />
                  <p className="text-gray-400 text-sm mt-1">this name will be displayed with your inquiry</p>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full bg-dark-2 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand" 
                  />
                  <p className="text-gray-400 text-sm mt-1">this email will be displayed with your inquiry</p>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Password</label>
                  <input 
                    type="password" 
                    required 
                    minLength={6} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="w-full bg-dark-2 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand" 
                  />
                  <p className="text-gray-400 text-sm mt-1">Any further updates will be forwarded on this email ID</p>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}
                {success && <p className="text-green-400 text-sm">{success}</p>}
                
                <div className="flex items-center gap-4">
                  <button 
                    disabled={loading} 
                    type="submit" 
                    className="bg-brand hover:bg-brand-light text-white font-bold py-3 px-8 rounded-md transition-colors"
                  >
                    {loading ? 'Please wait...' : 'Register'}
                  </button>
                  <Link to="/login" className="text-white hover:text-gray-300">Already have account ?</Link>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side - Auto-sliding Image Slider (exact specifications) */}
          <div
            className="absolute top-[190.5px] left-[668px] w-[772px] h-[733px] rounded-tl-[60px] rounded-bl-[60px] rotate-0 opacity-100 overflow-hidden shadow-2xl"
          >
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Slide ${index + 1}`}
                className={`absolute inset-0 w-[830px] h-[733px] object-cover transition-opacity duration-1000 rounded-tl-[60px] rounded-bl-[60px] ${
                  index === currentImage ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            
            {/* Image indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentImage ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;


