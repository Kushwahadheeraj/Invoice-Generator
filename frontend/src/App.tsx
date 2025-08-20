// client/src/App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from './components/Header';
import InvoiceList from './components/InvoiceList';
import EmptyState from './components/EmptyState';
import { Invoice } from './types';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import NewInvoice from './pages/NewInvoice';

const API_URL = 'http://localhost:5001/api/invoices';

const App: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = useCallback(async (filters: string[] = []) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.length > 0) {
        params.append('status', filters.join(','));
      }
      const response = await axios.get(`${API_URL}?${params.toString()}`);
      setInvoices(response.data);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="max-w-4xl mx-auto py-12 px-6">
              <Header invoiceCount={invoices.length} onFilterChange={fetchInvoices} />
              {loading ? (
                <p className="text-center mt-20">Loading...</p>
              ) : invoices.length > 0 ? (
                <InvoiceList invoices={invoices} />
              ) : (
                <EmptyState />
              )}
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/new" element={<NewInvoice onCreated={() => fetchInvoices()} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;