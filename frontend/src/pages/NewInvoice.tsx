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
    <div className="min-h-screen bg-gray-100 px-6 py-10 relative">
      {/* Header */}
      <Header showLogoutButton={true} title="levitation" subtitle="move" />
      
      <div className="max-w-6xl mx-auto">
        {/* Main Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Add Products</h1>
          <p className="text-gray-600">This is basic login page which is used for levitation assignment purpose.</p>
        </div>

        {/* Product Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
              <input 
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Enter product name"
                value={newItem.name}
                onChange={e => setNewItem({ ...newItem, name: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Price</label>
              <input 
                type="number" 
                min="0"
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Enter price"
                value={newItem.rate}
                onChange={e => setNewItem({ ...newItem, rate: Number(e.target.value) })} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
              <input 
                type="number" 
                min="1"
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
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
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md flex items-center gap-2"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      Product name
                      <ArrowUpDown size={16} className="text-gray-500" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      Quantity
                      <ArrowUpDown size={16} className="text-gray-500" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-800">{item.name}</td>
                    <td className="py-3 px-4 text-gray-800">$ {item.rate}</td>
                    <td className="py-3 px-4 text-gray-800">{item.quantity}</td>
                    <td className="py-3 px-4 text-gray-800">INR {item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-end">
            <div className="w-80 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Sub Total</span>
                <span>INR {subtotal.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
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
            className="bg-gray-800 hover:bg-gray-900 disabled:opacity-70 text-white font-semibold py-4 px-8 rounded-lg text-lg"
          >
            {isGenerating ? 'Generating...' : 'Generate PDF Invoice'}
          </button>
          <button 
            type="button"
            onClick={onSubmit as any}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg"
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


