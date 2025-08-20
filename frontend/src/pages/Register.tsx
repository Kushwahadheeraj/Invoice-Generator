import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5001/api/auth/register', { name, email, password });
      setSuccess('Registered successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg px-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold text-dark-1 mb-6">Register</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-1">Name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-1">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-1">Password</label>
            <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <button type="submit" className="w-full bg-brand hover:bg-brand-light text-white font-bold py-2 rounded-md">Register</button>
        </form>
        <p className="text-sm text-light-2 mt-4">Already have an account? <Link to="/login" className="text-brand font-bold">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;


