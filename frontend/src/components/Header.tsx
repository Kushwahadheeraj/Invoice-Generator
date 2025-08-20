// client/src/components/Header.tsx
import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  invoiceCount: number;
  onFilterChange: (filters: string[]) => void;
}

const Header: React.FC<HeaderProps> = ({ invoiceCount, onFilterChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    let newFilters: string[];
    if (checked) {
      newFilters = [...filters, name];
    } else {
      newFilters = filters.filter((f) => f !== name);
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-dark-1">Invoices</h1>
        <p className="text-light-2 mt-2">There are {invoiceCount} total invoices</p>
      </div>
      
      <div className="flex items-center gap-10">
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
};

export default Header;