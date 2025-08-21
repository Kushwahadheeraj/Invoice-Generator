// client/src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoices } from './store/slices/invoiceSlice';
import type { RootState } from './store/store';
import type { Invoice } from './types';

// Components
import Header from './components/Header';
import EmptyState from './components/EmptyState';
import InvoiceList from './components/InvoiceList';
import InvoiceItem from './components/InvoiceItem';

// Pages
import Register from './pages/Register';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import NewInvoice from './pages/NewInvoice';

// Protected Route Component
const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useSelector((s: RootState) => s.auth);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const dispatch = useDispatch();
  const { loading, list } = useSelector((s: RootState) => s.invoices);

  useEffect(() => {
    if (list.length > 0) {
      setInvoices(list);
      setFilteredInvoices(list);
    }
  }, [list]);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const onFilterChange = (filters: string[]) => {
    if (filters.length === 0) {
      setFilteredInvoices(invoices);
    } else {
      const filtered = invoices.filter(invoice => filters.includes(invoice.status));
      setFilteredInvoices(filtered);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Protected><Welcome /></Protected>} />
        <Route path="/new" element={<Protected><NewInvoice onCreated={() => onFilterChange([])} /></Protected>} />
        <Route path="/invoices" element={<Protected>
          <div className="min-h-screen bg-light-bg px-6 py-10">
            <div className="max-w-4xl mx-auto">
              <Header 
                variant="invoice"
                invoiceCount={invoices.length} 
                onFilterChange={onFilterChange} 
              />
              {filteredInvoices.length > 0 ? (
                <InvoiceList invoices={filteredInvoices} />
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </Protected>} />
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;