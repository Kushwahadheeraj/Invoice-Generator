import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createInvoice } from '../store/slices/invoiceSlice';
import Header from '../components/Header';
import { Plus, ArrowUpDown } from 'lucide-react';
import addIcon from '../assets/formkit_add.svg';
import { pdfService } from '../services';
import { buildInvoiceHtml } from '../utils/invoiceTemplate';
import type { RootState } from '../store/store';
import logo from '../assets/logo.png';

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
  const [logoDataUrl, setLogoDataUrl] = useState<string>('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUserName = useSelector((s: RootState) => s.auth.user?.name);
  const authUserEmail = useSelector((s: RootState) => s.auth.user?.email);

  // Prefill client name from logged-in user if available
  useEffect(() => {
    if (!clientName && authUserName) {
      setClientName(authUserName);
    }
  }, [authUserName]);

  // Load logo.png as data URL so Puppeteer can render it inside PDF
  useEffect(() => {
    const loadImageAsDataUrl = async (src: string) => {
      try {
        const resp = await fetch(src);
        const blob = await resp.blob();
        const reader = new FileReader();
        reader.onloadend = () => setLogoDataUrl(reader.result as string);
        reader.readAsDataURL(blob);
      } catch {
        setLogoDataUrl('');
      }
    };
    loadImageAsDataUrl(logo);
  }, []);

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
      const resolvedName = clientName || authUserName || 'Person_name';
      const resolvedEmail = authUserEmail || clientEmail || '';
      const html = buildInvoiceHtml({
        invoiceId,
        date: new Date().toLocaleDateString(),
        clientName: resolvedName,
        clientEmail: resolvedEmail,
        items: items.map(i => ({ name: i.name || 'Product', quantity: i.quantity, rate: i.rate, total: i.total })),
        subtotal,
        gst,
        total: amount,
        logoDataUrl,
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
      await dispatch(createInvoice({ invoiceId, clientName: clientName || authUserName || '', clientEmail, dueDate, items, amount, status: 'pending' })).unwrap();
      onCreated?.();
      navigate('/invoices');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create invoice');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e13] px-6 py-12 relative">

      {/* Header */}
      <Header showLogoutButton={true} title="levitation" subtitle="move" />
      
      <div className="relative max-w-6xl pt-32 mx-auto">
        {/* Main Title Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-wide text-white mb-2 text-left">Add Products</h1>
          <p className="text-gray-400 text-sm text-left">This is basic login page which is used for levitation assignment purpose.</p>
        </div>

        {/* Product Input Form */}
        <div className="bg-[#141a22] border border-[#2e323a] rounded-xl shadow-xl shadow-black/20 ring-1 ring-white/5 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Product Name</label>
              <input 
                className="w-full h-12 bg-[#0b0f14] border border-[#2e323a] text-gray-200 placeholder:text-gray-500 rounded-md px-3 focus:outline-none focus:ring-0 focus:border-[#2e323a]" 
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
                className="w-full h-12 bg-[#0b0f14] border border-[#2e323a] text-gray-200 placeholder:text-gray-500 rounded-md px-3 focus:outline-none focus:ring-0 focus:border-[#2e323a]" 
                placeholder="Enter the price"
                value={newItem.rate}
                onChange={e => setNewItem({ ...newItem, rate: Number(e.target.value) })} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Quantity</label>
              <input 
                type="number" 
                min="1"
                className="w-full h-12 bg-[#0b0f14] border border-[#2e323a] text-gray-200 placeholder:text-gray-500 rounded-md px-3 focus:outline-none focus:ring-0 focus:border-[#2e323a]" 
                placeholder="Enter the City"
                value={newItem.quantity}
                onChange={e => setNewItem({ ...newItem, quantity: Number(e.target.value) })} 
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            <button 
              type="button" 
              onClick={addItem} 
              className="bg-[#3a4a2f] hover:bg-[#4c6440] text-white font-semibold py-2.5 px-5 rounded-md flex items-center gap-2 shadow border border-[#5d6f50] focus:outline-none"
            >
              <span className="text-sm">Add Product</span>
              <img src={addIcon} alt="add" className="w-4 h-4" />

            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-lg shadow-md mb-8 border border-[#2e323a] overflow-hidden">
          <div className="overflow-x-auto bg-[#0f1217]">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-[#e6e8eb]">
                  <th className="text-left py-2.5 px-4 font-semibold text-slate-800">
                    <div className="flex items-center gap-2">
                      Product name
                      <ArrowUpDown size={16} className="text-gray-500" />
                    </div>
                  </th>
                  <th className="text-left py-2.5 px-4 font-semibold text-slate-800">Price</th>
                  <th className="text-left py-2.5 px-4 font-semibold text-slate-800">
                    <div className="flex items-center gap-2">
                      Quantity
                      <ArrowUpDown size={16} className="text-gray-500" />
                    </div>
                  </th>
                  <th className="text-left py-2.5 px-4 font-semibold text-slate-800">Total Price</th>
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
                {/* summary rows to match screenshot */}
                <tr className="border-t border-[#2e323a]">
                  <td className="py-3 px-4" colSpan={3}>
                    <div className="w-full text-right text-gray-300">Sub-Total</div>
                  </td>
                  <td className="py-3 px-4 text-gray-300">INR {subtotal.toFixed(1)}</td>
                </tr>
                <tr className="border-t border-[#2e323a]">
                  <td className="py-3 px-4" colSpan={3}>
                    <div className="w-full text-right text-gray-300">Incl + GST 18%</div>
                  </td>
                  <td className="py-3 px-4 text-gray-300">INR {amount.toFixed(1)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="bg-transparent rounded-lg shadow-none p-6 mb-8">
          <div className="flex justify-end">
            <div className="w-80 space-y-3 border border-[#2e323a] rounded-md p-4 bg-white text-slate-800">
              <div className="flex justify-between text-[13px]">
                <span>Sub-Total</span>
                <span>INR {subtotal.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span>Inc + GST 18%</span>
                <span>INR {amount.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Generate PDF Button */}
        <div className="text-center">
          <button 
            type="button"
            onClick={handleGeneratePdf}
            disabled={isGenerating}
            className="mx-auto bg-[#2a2f3a] hover:bg-[#3a404e] disabled:opacity-70 text-[#c5ff8b] font-medium py-2.5 px-8 rounded-md text-sm shadow-md border border-[#404552]"
          >
            {isGenerating ? 'Generating...' : 'Generate PDF Invoice'}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default NewInvoice;


