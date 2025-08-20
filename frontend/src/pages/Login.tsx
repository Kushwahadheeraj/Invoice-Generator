import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg px-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold text-dark-1 mb-6">Login</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-1">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-1">Password</label>
            <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-brand hover:bg-brand-light text-white font-bold py-2 rounded-md">Login</button>
        </form>
        <p className="text-sm text-light-2 mt-4">Don't have an account? <Link to="/register" className="text-brand font-bold">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;


