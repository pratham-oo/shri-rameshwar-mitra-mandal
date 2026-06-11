'use client';

import { supabase } from '@/lib/supabase';
import { useState } from 'react';

interface Order {
  id: number;
  order_id: string;
  customer_name: string;
  mobile_number: string;
  total_shirts: number;
  total_amount: number;
  payment_verified: boolean;
  collected: boolean;
  utr_number: string | null;
  created_at: string;
  order_items?: any[];
}

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [exporting, setExporting] = useState(false);

  const searchOrders = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setOrders([]);
    setSelectedOrder(null);
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `);
    
    // Search by Order ID OR Mobile Number
    if (searchTerm.startsWith('RMM')) {
      query = query.eq('order_id', searchTerm);
    } else {
      query = query.eq('mobile_number', searchTerm);
    }
    
    const { data, error } = await query;
    
    if (error) {
      alert('Search error: ' + error.message);
    } else {
      setOrders(data || []);
    }
    
    setLoading(false);
  };

  const markAsCollected = async (orderId: number, orderIdString: string) => {
    const volunteerName = prompt('Enter your name (for record):');
    if (!volunteerName) return;
    
    setVerifying(true);
    
    const { error } = await supabase
      .from('orders')
      .update({
        collected: true,
        collected_at: new Date().toISOString(),
        collected_by: volunteerName
      })
      .eq('id', orderId);
    
    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert(`✅ Order ${orderIdString} marked as COLLECTED!`);
      searchOrders();
    }
    
    setVerifying(false);
  };

  const verifyPayment = async (orderId: number, orderIdString: string) => {
    const { error } = await supabase
      .from('orders')
      .update({
        payment_verified: true,
        payment_verified_at: new Date().toISOString()
      })
      .eq('id', orderId);
    
    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert(`✅ Payment for ${orderIdString} verified!`);
      searchOrders();
    }
  };

  const exportToCSV = async () => {
    setExporting(true);
    
    try {
      // Fetch all orders
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          order_id,
          customer_name,
          mobile_number,
          total_amount,
          total_shirts,
          payment_verified,
          utr_number,
          collected,
          created_at,
          order_items (
            size,
            quantity
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Format data for CSV
      const csvData = orders.map(order => ({
        'Order ID': order.order_id,
        'Customer Name': order.customer_name,
        'Mobile Number': order.mobile_number,
        'Total Shirts': order.total_shirts,
        'Total Amount': `₹${order.total_amount}`,
        'Payment Verified': order.payment_verified ? 'Yes' : 'No',
        'UTR Number': order.utr_number || '-',
        'Collected': order.collected ? 'Yes' : 'No',
        'Items': order.order_items?.map((item: any) => `${item.size} x${item.quantity}`).join(', ') || '-',
        'Booking Date': new Date(order.created_at).toLocaleString('en-IN')
      }));
      
      // Convert to CSV string
      const headers = Object.keys(csvData[0] || {});
      const csvRows = [
        headers.join(','),
        ...csvData.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            return `"${String(value).replace(/"/g, '""')}"`;
          }).join(',')
        )
      ];
      
      const csvString = csvRows.join('\n');
      
      // Download file
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('✅ Export successful! Check your downloads folder.');
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    }
    
    setExporting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-800 marathi-text">
            प्रशासन पॅनेल
          </h1>
          <p className="text-gray-600">वितरण दिनी ऑर्डर शोधा आणि सत्यापित करा</p>
        </div>
        
        {/* Admin Actions Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              disabled={exporting}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              📥 {exporting ? 'Exporting...' : 'Export All Orders to CSV'}
            </button>
            <p className="text-sm text-gray-500 flex items-center ml-4">
              💡 CSV can be opened in Google Sheets or Excel
            </p>
          </div>
        </div>
        
        {/* Search Box */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="ऑर्डर ID किंवा मोबाईल नंबर टाका"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchOrders()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={searchOrders}
              disabled={loading}
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'शोधत आहे...' : 'शोधा 🔍'}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            💡 उदा: RMM2026-0001 किंवा 9876543210
          </p>
        </div>
        
        {/* Results */}
        {orders.length === 0 && !loading && searchTerm && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">❌ कोणतीही ऑर्डर सापडली नाही</p>
          </div>
        )}
        
        {/* Order Cards */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className={`bg-white rounded-lg shadow-md overflow-hidden border-l-8 ${
              order.collected ? 'border-green-500' : 'border-orange-500'
            }`}>
              <div className="p-6">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">ऑर्डर ID</p>
                    <p className="text-2xl font-bold text-orange-600">{order.order_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">बुकिंग तारीख</p>
                    <p className="text-sm font-semibold">
                      {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
                  <div>
                    <p className="text-xs text-gray-500">ग्राहक नाव</p>
                    <p className="font-semibold">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">मोबाईल नंबर</p>
                    <p className="font-semibold">{order.mobile_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">एकूण टी-शर्ट</p>
                    <p className="font-semibold">{order.total_shirts} pcs</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">एकूण रक्कम</p>
                    <p className="font-semibold text-orange-600">₹{order.total_amount}</p>
                  </div>
                </div>
                
                {/* Items Summary */}
                {order.order_items && order.order_items.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">टी-शर्ट तपशील</p>
                    <div className="flex flex-wrap gap-2">
                      {order.order_items.map((item: any, idx: number) => (
                        <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                          {item.size} × {item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Status Badges */}
                <div className="flex gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.payment_verified 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.payment_verified ? '✓ पेमेंट व्हेरिफाइड' : '⏳ पेमेंट पेंडिंग'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.collected 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {order.collected ? '✓ संकलित' : '📦 संकलित नाही'}
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!order.payment_verified && (
                    <button
                      onClick={() => verifyPayment(order.id, order.order_id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700"
                    >
                      ✅ पेमेंट व्हेरिफाय करा
                    </button>
                  )}
                  {order.payment_verified && !order.collected && (
                    <button
                      onClick={() => markAsCollected(order.id, order.order_id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
                    >
                      📦 संकलित म्हणून चिन्हांकित करा
                    </button>
                  )}
                  {order.collected && (
                    <button
                      disabled
                      className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-semibold cursor-not-allowed"
                    >
                      ✓ आधीच संकलित
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Instructions for Volunteers */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-800 mb-2">📋 वितरण दिनासाठी सूचना:</h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
            <li>ग्राहकाकडून ऑर्डर ID किंवा मोबाईल नंबर घ्या</li>
            <li>वरील सर्च बॉक्समध्ये टाका</li>
            <li>ऑर्डरची माहिती तपासा (नाव, साईज, संख्या)</li>
            <li>ग्राहकाचा मोबाईल नंबर व्हेरिफाय करा</li>
            <li>पेमेंट व्हेरिफाइड असल्याचे सुनिश्चित करा</li>
            <li>टी-शर्ट हस्तांतरित करा</li>
            <li>"संकलित म्हणून चिन्हांकित करा" बटण क्लिक करा</li>
            <li className="font-bold">एकदा संकलित झाल्यानंतर पुन्हा संकलित करता येणार नाही</li>
            <li>📥 सर्व ऑर्डरचा CSV Export वरच्या बटणावरून करता येईल</li>
          </ul>
        </div>
      </div>
    </div>
  );
}