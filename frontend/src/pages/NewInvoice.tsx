import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import { ArrowUpDown } from 'lucide-react';
import addIcon from '../assets/formkit_add.svg';
import type { RootState } from '../store/store';

type Item = { name: string; quantity: number; rate: number; total: number };

const NewInvoice: React.FC = () => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<{ name: string; rate: number; quantity: number}>({ name: '', rate: 0, quantity: 1 });
  const [isGenerating, setIsGenerating] = useState(false);
  const authUserName = useSelector((s: RootState) => s.auth.user?.name);
  const authUserEmail = useSelector((s: RootState) => s.auth.user?.email);

  // Prefill client name from logged-in user if available
  useEffect(() => {
    if (!clientName && authUserName) {
      setClientName(authUserName);
    }
  }, [authUserName]);

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

  const subtotal = items.reduce((a, b) => a + (b.total || 0), 0);
  const gst = Math.round((subtotal * 0.18 + Number.EPSILON) * 100) / 100;
  const amount = Math.round((subtotal + gst + Number.EPSILON) * 100) / 100;

  const generatePDF = async () => {
    if (items.length === 0) {
      alert('Please add at least one product before generating PDF.');
      return;
    }

    setIsGenerating(true);
    try {
      // Create HTML invoice template
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 0; 
              background-color: #f5f5f5;
            }
            
            /* Top Header Section */
            .header {
              display: flex;
              justify-content: space-between;
              background-color: #2d3748;
              color: white;
              padding: 20px;
              margin-bottom: 20px;
            }
            
            .header-left {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            
            .code-icon {
              background-color: #4a5568;
              padding: 8px;
              border-radius: 4px;
              font-size: 16px;
            }
            
            .company-name {
              font-size: 20px;
              font-weight: bold;
            }
            
            .header-right {
              font-size: 18px;
              font-weight: bold;
            }
            
            /* Client/Invoice Details */
            .client-section {
              background: linear-gradient(135deg, #4c51bf 0%, #667eea 100%);
              color: white;
              padding: 20px;
              margin: 0 20px 20px 20px;
              border-radius: 8px;
            }
            
            .client-info {
              display: flex;
              flex-direction: column;
              gap: 15px;
            }
            
            .client-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .client-label {
              font-size: 14px;
              color: #e2e8f0;
              font-weight: normal;
            }
            
            .client-value {
              font-size: 16px;
              font-weight: bold;
              color: #f7fafc;
            }
            
            .email-field {
              background-color: white;
              color: #2d3748;
              padding: 8px 16px;
              border-radius: 25px;
              font-size: 14px;
              font-weight: normal;
              border: none;
              outline: none;
            }
            
            /* Product Table */
            .table-container {
              margin: 0 20px 20px 20px;
            }
            
            .table {
              width: 100%;
              border-collapse: collapse;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .table-header {
              background: linear-gradient(135deg, #2d3748 0%, #48bb78 100%);
              color: white;
              padding: 15px;
            }
            
            .table-header th {
              padding: 15px;
              text-align: left;
              font-weight: bold;
              font-size: 14px;
            }
            
            .table-body td {
              padding: 15px;
              border-bottom: 1px solid #e2e8f0;
              background-color: white;
              font-size: 14px;
            }
            
            /* Invoice Summary */
            .summary-container {
              display: flex;
              justify-content: flex-end;
              margin: 0 20px 20px 20px;
            }
            
            .summary-box {
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              min-width: 250px;
            }
            
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              font-size: 14px;
            }
            
            .summary-total {
              font-size: 16px;
              font-weight: bold;
              color: #2d3748;
              border-top: 2px solid #e2e8f0;
              padding-top: 10px;
              margin-top: 10px;
            }
            
            /* Footer Message */
            .footer {
              margin: 0 20px 20px 20px;
              text-align: center;
            }
            
            .footer-message {
              background-color: #2d3748;
              color: white;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 15px;
              line-height: 1.6;
              font-size: 14px;
            }
            
            .footer-date {
              color: #4a5568;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <!-- Top Header Section -->
          <div class="header">
            <div class="header-left">
              <div class="code-icon">&lt;/&gt;</div>
              <div class="company-name">Levitation</div>
            </div>
            <div class="header-right">INVOICE GENERATOR</div>
          </div>
          
          <!-- Client/Invoice Details -->
          <div class="client-section">
            <div class="client-info">
              <!-- Top Row: Name and Date labels -->
              <div class="client-row">
                <div class="client-label">Name</div>
                <div class="client-label">Date : ${new Date().toLocaleDateString()}</div>
              </div>
              <!-- Bottom Row: Actual name value and email field -->
              <div class="client-row">
                <div class="client-value">${clientName || authUserName || 'Person_name'}</div>
                <input type="email" class="email-field" value="${clientEmail || authUserEmail || 'example@email.com'}" readonly>
              </div>
            </div>
          </div>
          
          <!-- Product Table -->
          <div class="table-container">
            <table class="table">
              <thead class="table-header">
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody class="table-body">
                ${items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.rate}</td>
                    <td>USD ${item.total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <!-- Invoice Summary -->
          <div class="summary-container">
            <div class="summary-box">
              <div class="summary-row">
                <span>Total Charges:</span>
                <span>$${subtotal.toFixed(2)}</span>
              </div>
              <div class="summary-row">
                <span>GST (18%):</span>
                <span>$${gst.toFixed(2)}</span>
              </div>
              <div class="summary-row summary-total">
                <span>Total Amount:</span>
                <span>₹ ${amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <!-- Footer Message -->
          <div class="footer">
            <div class="footer-message">
              We are pleased to provide any further information you may require and look forward to assisting with your next order. Rest assured, it will receive our prompt and dedicated attention.
            </div>
            <div class="footer-date">
              Date: ${new Date().toLocaleDateString()}
            </div>
          </div>
        </body>
        </html>
      `;

      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          html: invoiceHTML,
          options: {
            format: 'A4',
            printBackground: true
          }
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-black">
      {/* Header */}
      <Header showLogoutButton={true} title="levitation" subtitle="move" />
      
      {/* Full page background cover */}
      <div
        className="absolute inset-0 w-full h-full bg-black -z-10"
      />
      
      {/* Main container with responsive design */}
      <div 
        className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8"
      >
        <div className="space-y-8">
        {/* Main Title Section */}
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide text-white mb-3">Add Products</h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto sm:mx-0">This is basic login page which is used for levitation assignment purpose.</p>
        </div>

        {/* Product Input Form */}
          <div className="bg-[#141a22] border border-[#2e323a] rounded-xl shadow-xl shadow-black/20 ring-1 ring-white/5 p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <div className="sm:col-span-2 lg:col-span-1">
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
                  placeholder="Enter product price"
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
                  placeholder="Enter product quantity"
                value={newItem.quantity}
                onChange={e => setNewItem({ ...newItem, quantity: Number(e.target.value) })} 
              />
            </div>
          </div>
          
            <div className="mt-6 flex justify-center">
            <button 
              type="button" 
              onClick={addItem} 
                className="bg-[#3a4a2f] hover:bg-[#4c6440] text-white font-semibold py-3 px-6 sm:px-8 rounded-md flex items-center gap-2 shadow border border-[#5d6f50] focus:outline-none transition-colors"
            >
                <span className="text-sm sm:text-base">Add Product</span>
              <img src={addIcon} alt="add" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Products Table */}
          <div className="rounded-lg shadow-md border border-[#2e323a] overflow-hidden">
          <div className="overflow-x-auto bg-[#0f1217]">
              <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#e6e8eb]">
                    <th className="text-left py-3 px-3 sm:px-4 font-semibold text-slate-800">
                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline">Product name</span>
                        <span className="sm:hidden">Product</span>
                        <ArrowUpDown size={14} className="text-gray-500 sm:w-4 sm:h-4" />
                    </div>
                  </th>
                    <th className="text-left py-3 px-3 sm:px-4 font-semibold text-slate-800">Price</th>
                    <th className="text-left py-3 px-3 sm:px-4 font-semibold text-slate-800">
                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline">Quantity</span>
                        <span className="sm:hidden">Qty</span>
                        <ArrowUpDown size={14} className="text-gray-500 sm:w-4 sm:h-4" />
                    </div>
                  </th>
                    <th className="text-left py-3 px-3 sm:px-4 font-semibold text-slate-800">
                      <span className="hidden sm:inline">Total Price</span>
                      <span className="sm:hidden">Total</span>
                    </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-t border-[#2e323a] odd:bg-[#0f1217] even:bg-[#111827]">
                      <td className="py-3 px-3 sm:px-4 text-gray-100 text-xs sm:text-sm">{item.name}</td>
                      <td className="py-3 px-3 sm:px-4 text-gray-100 text-xs sm:text-sm">$ {item.rate}</td>
                      <td className="py-3 px-3 sm:px-4 text-gray-100 text-xs sm:text-sm">{item.quantity}</td>
                      <td className="py-3 px-3 sm:px-4 text-gray-100 text-xs sm:text-sm">INR {item.total}</td>
                  </tr>
                ))}
                {/* summary rows to match screenshot */}
                <tr className="border-t border-[#2e323a]">
                    <td className="py-3 px-3 sm:px-4" colSpan={3}>
                      <div className="w-full text-right text-gray-300 text-xs sm:text-sm">Sub-Total</div>
                  </td>
                    <td className="py-3 px-3 sm:px-4 text-gray-300 text-xs sm:text-sm">INR {subtotal.toFixed(1)}</td>
                </tr>
                <tr className="border-t border-[#2e323a]">
                    <td className="py-3 px-3 sm:px-4" colSpan={3}>
                      <div className="w-full text-right text-gray-300 text-xs sm:text-sm">Incl + GST 18%</div>
                  </td>
                    <td className="py-3 px-3 sm:px-4 text-gray-300 text-xs sm:text-sm">INR {amount.toFixed(1)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Summary */}
          <div className="bg-transparent rounded-lg shadow-none p-4 sm:p-6">
            <div className="flex justify-center sm:justify-end">
              <div className="w-full sm:w-80 space-y-3 border border-[#2e323a] rounded-md p-4 bg-white text-slate-800">
                <div className="flex justify-between text-xs sm:text-sm">
                <span>Sub-Total</span>
                <span>INR {subtotal.toFixed(1)}</span>
              </div>
                <div className="flex justify-between text-xs sm:text-sm">
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
              onClick={generatePDF}
              disabled={items.length === 0 || isGenerating}
              className="w-full sm:w-auto mx-auto bg-[#2a2f3a] hover:bg-[#3a404e] disabled:opacity-70 text-[#c5ff8b] font-medium py-3 px-6 sm:px-8 rounded-md text-sm sm:text-base shadow-md border border-[#404552] transition-colors"
            >
              {isGenerating ? 'Generating PDF...' : 'Generate PDF Invoice'}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default NewInvoice;


