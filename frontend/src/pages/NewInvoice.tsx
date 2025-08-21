import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createInvoice } from '../store/slices/invoiceSlice';
import Header from '../components/Header';
import { Plus, ArrowUpDown } from 'lucide-react';
import { pdfService } from '../services';
import { buildInvoiceHtml } from '../utils/invoiceTemplate';

interface Props {
  onCreated?: () => void;
}

type Item = { name: string; quantity: number; rate: number; total: number };

const NewInvoice: React.FC<Props> = ({ onCreated }) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<{ name: string; rate: number; quantity: number}>({ name: '', rate: 0, quantity: 1 });
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const updateItem = (index: number, field: keyof Item, value: string | number) => {
    const next = [...items];
    // @ts-ignore
    next[index][field] = field === 'name' ? String(value) : Number(value);
    next[index].total = Number(next[index].quantity) * Number(next[index].rate);
    setItems(next);
  };

  const addItem = () => {
    if (!newItem.name.trim() || Number(newItem.rate) <= 0 || Number(newItem.quantity) <= 0) return;
    const item: Item = {
      name: newItem.name.trim(),
      rate: Number(newItem.rate),
      quantity: Number(newItem.quantity),
      total: Number(newItem.quantity) * Number(newItem.rate),
    };
    setItems(prev => [...prev, item]);
    setNewItem({ name: '', rate: 0, quantity: 1 });
  };
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));

  const subtotal = items.reduce((a, b) => a + (b.total || 0), 0);
  const gst = Math.round((subtotal * 0.18 + Number.EPSILON) * 100) / 100;
  const amount = Math.round((subtotal + gst + Number.EPSILON) * 100) / 100;

  const invoiceId = `#${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const handleGeneratePdf = async () => {
    try {
      setIsGenerating(true);
      const html = buildInvoiceHtml({
        invoiceId,
        date: new Date().toLocaleDateString(),
        clientName: clientName || 'Person_Name',
        items: items.map(i => ({ name: i.name || 'Product', quantity: i.quantity, rate: i.rate, total: i.total })),
        subtotal,
        gst,
        total: amount,
      });
      await pdfService.downloadPDF({ html, options: { format: 'A4' } }, `invoice-${invoiceId}.pdf`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // @ts-ignore
      await dispatch(createInvoice({ invoiceId, clientName, clientEmail, dueDate, items, amount, status: 'pending' })).unwrap();
      onCreated?.();
      navigate('/invoices');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create invoice');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e13] px-6 py-12 relative">
      {/* soft radial glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-44 -translate-x-1/2 h-80 w-[720px] rounded-full blur-[80px]" style={{background:'radial-gradient(ellipse at center, rgba(124,93,250,0.22), rgba(0,0,0,0))'}} />
      </div>

      {/* Header */}
      <Header showLogoutButton={true} title="levitation" subtitle="move" />
      
      <div className="relative max-w-6xl mx-auto">
        {/* Main Title Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-wide text-white mb-2">Add Products</h1>
          <p className="text-gray-400 text-sm">This is basic login page which is used for levitation assignment purpose.</p>
        </div>

        {/* Product Input Form */}
        <div className="bg-[#141a22] border border-[#2e323a] rounded-xl shadow-xl shadow-black/20 ring-1 ring-white/5 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Product Name</label>
              <input 
                className="w-full h-12 bg-[#0b0f14] border border-[#2e323a] text-gray-200 placeholder:text-gray-500 rounded-md px-3 focus:ring-2 focus:ring-[#7C5DFA] focus:border-[#7C5DFA]" 
                placeholder="Enter product name"
                value={newItem.name}
                onChange={e => setNewItem({ ...newItem, name: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Product Price</label>
              <input 
                type="number" 
                min="0"
                className="w-full h-12 bg-[#0b0f14] border border-[#2e323a] text-gray-200 placeholder:text-gray-500 rounded-md px-3 focus:ring-2 focus:ring-[#7C5DFA] focus:border-[#7C5DFA]" 
                placeholder="Enter price"
                value={newItem.rate}
                onChange={e => setNewItem({ ...newItem, rate: Number(e.target.value) })} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Quantity</label>
              <input 
                type="number" 
                min="1"
                className="w-full h-12 bg-[#0b0f14] border border-[#2e323a] text-gray-200 placeholder:text-gray-500 rounded-md px-3 focus:ring-2 focus:ring-[#7C5DFA] focus:border-[#7C5DFA]" 
                placeholder="Enter quantity"
                value={newItem.quantity}
                onChange={e => setNewItem({ ...newItem, quantity: Number(e.target.value) })} 
              />
            </div>
          </div>
          
          <div className="mt-4">
            <button 
              type="button" 
              onClick={addItem} 
              className="bg-green-500 hover:bg-green-400 text-black font-semibold py-3 px-6 rounded-lg flex items-center gap-2 shadow"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-lg shadow-md mb-8 border border-[#2e323a] overflow-hidden">
          <div className="overflow-x-auto bg-[#0f1217]">
            <table className="w-full text-[15px]">
              <thead>
                <tr className="bg-white">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      Product name
                      <ArrowUpDown size={16} className="text-gray-500" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      Quantity
                      <ArrowUpDown size={16} className="text-gray-500" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-t border-[#2e323a] odd:bg-[#0f1217] even:bg-[#111827]">
                    <td className="py-3 px-4 text-gray-100">{item.name}</td>
                    <td className="py-3 px-4 text-gray-100">$ {item.rate}</td>
                    <td className="py-3 px-4 text-gray-100">{item.quantity}</td>
                    <td className="py-3 px-4 text-gray-100">INR {item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="bg-transparent rounded-lg shadow-none p-6 mb-8">
          <div className="flex justify-end">
            <div className="w-80 space-y-3 border border-[#2e323a] rounded-md p-4 bg-white/95 text-slate-800">
              <div className="flex justify-between">
                <span>Sub Total</span>
                <span>INR {subtotal.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Inc + GST 18%</span>
                <span>INR {amount.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Generate PDF Button */}
        <div className="text-center space-x-3">
          <button 
            type="button"
            onClick={handleGeneratePdf}
            disabled={isGenerating}
            className="bg-[#2a2f3a] hover:bg-[#3a404e] disabled:opacity-70 text-white font-semibold py-3 px-10 rounded-full text-lg shadow-md"
          >
            {isGenerating ? 'Generating...' : 'Generate PDF Invoice'}
          </button>
          <button 
            type="button"
            onClick={onSubmit as any}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md text-lg"
          >
            Save Invoice
          </button>
        </div>

        {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default NewInvoice;


