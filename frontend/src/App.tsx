// client/src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';

// Pages
import Register from './pages/Register';
import Login from './pages/Login';
import NewInvoice from './pages/NewInvoice';

// Protected Route Component
const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useSelector((s: RootState) => s.auth);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  const { token } = useSelector((s: RootState) => s.auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/new" element={<Protected><NewInvoice /></Protected>} />
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;