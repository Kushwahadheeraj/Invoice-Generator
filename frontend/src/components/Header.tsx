// client/src/components/Header.tsx
import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import type { RootState } from '../store/store';
import logo from '../assets/logo.svg';
import ConnectionStatusComponent from './ConnectionStatus';

interface HeaderProps {
  invoiceCount?: number;
  onFilterChange?: (filters: string[]) => void;
  showLoginButton?: boolean;
  showLogoutButton?: boolean;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'auth' | 'invoice';
}

const Header: React.FC<HeaderProps> = ({ 
  invoiceCount, 
  onFilterChange,
  showLoginButton = false,
  showLogoutButton = false,
  title = "levitation",
  subtitle = "infotech",
  variant = 'default'
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((s: RootState) => s.auth);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    let newFilters: string[];
    if (checked) {
      newFilters = [...filters, name];
    } else {
      newFilters = filters.filter((f) => f !== name);
    }
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Auth variant (for Register/Login pages) - full-width top bar
  if (variant === 'auth') {
    return (
      <div className="absolute top-0 left-0 right-0 h-14 bg-dark-2/80 backdrop-blur flex items-center">
        <div className="mx-auto w-full flex items-center justify-between" style={{ maxWidth: '1440px', padding: '0 24px' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
              <img src={logo} alt="Levitation" className="w-5 h-5" />
            </div>
            <div className="text-white">
              <div className="font-bold leading-tight">{title}</div>
              <div className="text-xs opacity-80 -mt-0.5">{subtitle}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {showLoginButton && (
              <Link
                to="/login"
                className="bg-lime-300 hover:bg-lime-200 text-black font-semibold py-1.5 px-4 rounded-md transition-colors text-sm"
              >
                Login
              </Link>
            )}
            {showLogoutButton && token && (
              <button
                onClick={handleLogout}
                className="bg-lime-300 hover:bg-lime-200 text-black font-semibold py-1.5 px-4 rounded-md transition-colors text-sm"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Invoice variant (for invoice list page)
  if (variant === 'invoice') {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand/90 flex items-center justify-center">
            <img src={logo} alt="Levitation" className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-dark-1">Invoices</h1>
            <p className="text-light-2 text-sm mt-1">There are {invoiceCount} total invoices</p>
          </div>
        </div>
        
        <div className="flex items-center gap-10">
          <ConnectionStatusComponent />
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-3 font-bold text-dark-1">
              Filter by status <ChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} color="#7C5DFA" />
            </button>
            {dropdownOpen && (
              <div className="absolute top-10 right-0 w-48 bg-white shadow-lg rounded-lg p-6 z-10">
                {['draft', 'pending', 'paid'].map((status) => (
                  <label key={status} className="flex items-center mb-4 last:mb-0 cursor-pointer">
                    <input type="checkbox" name={status} onChange={handleCheckboxChange} className="w-4 h-4 accent-brand" />
                    <span className="ml-3 font-bold capitalize text-dark-1">{status}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <Link to="/new" className="flex items-center gap-4 bg-brand hover:bg-brand-light text-white font-bold py-2 pr-4 pl-2 rounded-full transition-colors">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Plus color="#7C5DFA" size={18} />
            </div>
            New Invoice
          </Link>
        </div>
      </div>
    );
  }

  // Default variant (for other pages like Welcome, NewInvoice)
  return (
    <div className="absolute top-0 left-0 right-0 h-14 bg-dark-2/80 backdrop-blur flex items-center">
      <div className="mx-auto w-full flex items-center justify-between" style={{ maxWidth: '1440px', padding: '0 24px' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
            <img src={logo} alt="Levitation" className="w-5 h-5" />
          </div>
          <div className="text-white">
            <div className="font-bold leading-tight">{title}</div>
            <div className="text-xs opacity-80 -mt-0.5">{subtitle}</div>
          </div>
        </div>

        <div>
          {showLogoutButton && token && (
            <button
              onClick={handleLogout}
              className="bg-lime-300 hover:bg-lime-200 text-black font-semibold py-1.5 px-4 rounded-md transition-colors text-sm"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;