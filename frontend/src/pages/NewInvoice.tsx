import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createInvoice } from '../store/slices/invoiceSlice';
import Header from '../components/Header';

interface Props {
  onCreated?: () => void;
}

type Item = { name: string; quantity: number; rate: number; total: number };

const NewInvoice: React.FC<Props> = ({ onCreated }) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<Item[]>([{ name: '', quantity: 1, rate: 0, total: 0 }]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const updateItem = (index: number, field: keyof Item, value: string | number) => {
    const next = [...items];
    // @ts-ignore
    next[index][field] = field === 'name' ? String(value) : Number(value);
    next[index].total = Number(next[index].quantity) * Number(next[index].rate);
    setItems(next);
  };

  const addItem = () => setItems(prev => [...prev, { name: '', quantity: 1, rate: 0, total: 0 }]);
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));

  const subtotal = items.reduce((a, b) => a + (b.total || 0), 0);
  const gst = Math.round((subtotal * 0.18 + Number.EPSILON) * 100) / 100;
  const amount = Math.round((subtotal + gst + Number.EPSILON) * 100) / 100;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const invoiceId = `#${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      // @ts-ignore
      await dispatch(createInvoice({ invoiceId, clientName, clientEmail, dueDate, items, amount, status: 'pending' })).unwrap();
      onCreated?.();
      navigate('/invoices');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create invoice');
    }
  };

  return (
    <div className="min-h-screen bg-light-bg px-6 py-10 relative">
      {/* Dynamic Header */}
      <Header showLogoutButton={true} title="levitation" subtitle="infotech" />
      
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold text-dark-1 mb-6">Add product</h1>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-dark-1">Traveller Name</label>
              <input className="mt-1 w-full border rounded-md p-2 focus:ring-2 focus:ring-brand" value={clientName} onChange={e => setClientName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-1">Email</label>
              <input type="email" className="mt-1 w-full border rounded-md p-2 focus:ring-2 focus:ring-brand" value={clientEmail} onChange={e => setClientEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-1">Due Date</label>
              <input type="date" className="mt-1 w-full border rounded-md p-2 focus:ring-2 focus:ring-brand" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-dark-1">Products</h2>
              <button type="button" onClick={addItem} className="text-brand font-bold">+ Add New Item</button>
            </div>
            <div className="mt-4 space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-5">
                    <label className="block text-xs font-semibold text-light-2">Product Name</label>
                    <input className="w-full border rounded-md p-2" value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)} required />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-light-2">Qty</label>
                    <input type="number" min={1} className="mt-1 w-full border rounded-md p-2" value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} required />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-light-2">Rate</label>
                    <input type="number" min={0} className="mt-1 w-full border rounded-md p-2" value={item.rate} onChange={e => updateItem(idx, 'rate', e.target.value)} required />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-light-2">Total</label>
                    <input readOnly className="w-full border rounded-md p-2 bg-gray-50" value={item.total.toFixed(2)} />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button type="button" onClick={() => removeItem(idx)} className="text-red-600">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-64 border rounded-lg p-4 bg-light-bg">
              <div className="flex justify-between text-sm text-light-2"><span>Total Charges</span><span>£{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-light-2 mt-2"><span>GST (18%)</span><span>£{gst.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-dark-1 mt-3"><span>Total Amount</span><span>£ {amount.toFixed(2)}</span></div>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/welcome')} className="px-4 py-2 rounded-md bg-gray-200">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-brand text-white font-bold">Next</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewInvoice;


