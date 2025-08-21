// client/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';
import Login from './pages/Login';
import Register from './pages/Register';
import NewInvoice from './pages/NewInvoice';

const App: React.FC = () => {
  const { user } = useSelector((s: RootState) => s.auth);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/new-invoice" /> : <Navigate to="/register" />} />
          <Route path="/login" element={user ? <Navigate to="/new-invoice" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/new-invoice" /> : <Register />} />
          <Route path="/new-invoice" element={user ? <NewInvoice /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;