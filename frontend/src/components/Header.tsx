// client/src/components/Header.tsx
import React, { useState } from 'react';
import { Plus, ChevronDown, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import type { RootState } from '../store/store';
import logo from '../assets/logo.svg';

interface HeaderProps {
  showLoginButton?: boolean;
  showLogoutButton?: boolean;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'auth' | 'login' | 'register';
}

const Header: React.FC<HeaderProps> = ({ 
  showLoginButton = false,
  showLogoutButton = false,
  title = "levitation",
  subtitle = "infotech",
  variant = 'default'
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((s: RootState) => s.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Login page variant - shows "Connecting People With Technology" button
  if (variant === 'login') {
    return (
      <div 
        className="absolute top-0 w-full lg:w-[1340px] h-[64.0999984741211px] left-0 lg:-left-[0.5px] border-b border-white/10 rotate-0 opacity-100 bg-black/30 backdrop-blur-[10px] flex items-center justify-between z-10 px-3 xs:px-4 sm:px-6 lg:px-6"
      >
        <div className="flex items-center gap-2 xs:gap-3">
          <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-lg bg-white flex items-center justify-center">
            <div className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">&lt;/&gt;</span>
            </div>
          </div>
          <div className="text-white">
            <div className="font-bold leading-tight text-xs xs:text-sm sm:text-base lg:text-base">{title}</div>
            <div className="text-xs opacity-80 -mt-0.5 hidden xs:block">{subtitle}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 xs:gap-3">
          <div className="border border-lime-300 text-lime-300 px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 rounded-md text-xs xs:text-sm font-medium text-center max-w-[120px] xs:max-w-none">
            <span className="hidden xs:inline">Connecting People With Technology</span>
            <span className="xs:hidden">Technology</span>
          </div>
        </div>
      </div>
    );
  }

  // Register page variant - shows "Login" button
  if (variant === 'register') {
    return (
      <div 
        className="absolute top-0 w-full lg:w-[1340px] h-[64.0999984741211px] left-0 lg:-left-[0.5px] border-b border-white/10 rotate-0 opacity-100 bg-black/30 backdrop-blur-[10px] flex items-center justify-between z-10 px-3 xs:px-4 sm:px-6 lg:px-6"
      >
        <div className="flex items-center gap-2 xs:gap-3">
        <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-lg bg-white flex items-center justify-center">
            <div className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">&lt;/&gt;</span>
            </div>
          </div>
          <div className="text-white">
            <div className="font-bold leading-tight text-xs xs:text-sm sm:text-base lg:text-base">{title}</div>
            <div className="text-xs opacity-80 -mt-0.5 hidden xs:block">{subtitle}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 xs:gap-3">
          <Link
            to="/login"
            className="bg-lime-300 hover:bg-lime-200 text-black font-semibold py-1.5 xs:py-2 px-3 xs:px-4 rounded-md transition-colors text-xs xs:text-sm lg:text-sm whitespace-nowrap min-h-[32px] flex items-center justify-center"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  // Auth variant (for other auth pages) - full-width top bar
  if (variant === 'auth') {
    return (
      <div 
        className="absolute top-0 w-full lg:w-[1340px] h-[64.0999984741211px] left-0 lg:-left-[0.5px] border-b border-white/10 rotate-0 opacity-100 bg-black/30 backdrop-blur-[10px] flex items-center justify-between z-10 px-3 xs:px-4 sm:px-6 lg:px-6"
      >
        <div className="flex items-center gap-2 xs:gap-3">
          <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-lg bg-white flex items-center justify-center">
            <img src={logo} alt="Levitation" className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="text-white">
            <div className="font-bold leading-tight text-xs xs:text-sm sm:text-base lg:text-base">{title}</div>
            <div className="text-xs opacity-80 -mt-0.5 hidden xs:block">{subtitle}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 xs:gap-3">
          {showLoginButton && (
            <Link
              to="/login"
              className="bg-lime-300 hover:bg-lime-200 text-black font-semibold py-1.5 xs:py-2 px-3 xs:px-4 rounded-md transition-colors text-xs xs:text-sm lg:text-sm whitespace-nowrap min-h-[32px] flex items-center justify-center"
            >
              Login
            </Link>
          )}
          {showLogoutButton && token && (
            <button
              onClick={handleLogout}
              className="bg-lime-300 hover:bg-lime-200 text-black font-semibold py-1.5 xs:py-2 px-3 xs:px-4 rounded-md transition-colors text-xs xs:text-sm lg:text-sm whitespace-nowrap min-h-[32px] flex items-center justify-center"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default variant (for other pages like NewInvoice) - with mobile menu
  return (
    <div 
      className="absolute top-0 w-full lg:w-[1340px] h-[64.0999984741211px] left-0 lg:-left-[0.5px] border-b border-white/10 rotate-0 opacity-100 bg-black/30 backdrop-blur-[10px] flex items-center justify-between z-10 px-3 xs:px-4 sm:px-6 lg:px-6"
    >
      <div className="flex items-center gap-2 xs:gap-3">
        <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-lg bg-white flex items-center justify-center">
          <img src={logo} alt="Levitation" className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="text-white">
          <div className="font-bold leading-tight text-xs xs:text-sm sm:text-base lg:text-base">{title}</div>
          <div className="text-xs opacity-80 -mt-0.5 hidden xs:block">{subtitle}</div>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-3">
        {showLogoutButton && token && (
          <button
            onClick={handleLogout}
            className="bg-lime-300 hover:bg-lime-200 text-black font-semibold py-1.5 px-4 rounded-md transition-colors text-sm"
          >
            Logout
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button
          onClick={toggleMobileMenu}
          className="text-white p-2 hover:bg-white/10 rounded-md transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-[10px] border-b border-white/10">
          <div className="px-4 py-4 space-y-3">
            {showLogoutButton && token && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-lime-300 hover:bg-lime-200 text-black font-semibold py-3 px-4 rounded-md transition-colors text-sm text-center min-h-[44px] flex items-center justify-center"
              >
                Logout
              </button>
            )}
            <div className="text-white text-sm text-center opacity-70 py-2">
              {title} {subtitle}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;