'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

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

interface DashboardStats {
  totalOrders: number;
  totalShirts: number;
  totalAmount: number;
  pendingPayment: number;
  pendingCollection: number;
  collected: number;
  sizeBreakdown: { [key: string]: number };
  dateWiseOrders: { date: string; count: number }[];
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pendingPayment' | 'pendingCollection' | 'collected'>('all');

  // All sizes for breakdown
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL', '5XL', '22', '24', '26', '28', '30', '32'];

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const hasAdminAuth = cookies.some(cookie => 
        cookie.trim().startsWith('admin_auth=true')
      );
      
      if (!hasAdminAuth) {
        router.push('/admin/login');
      } else {
        setIsAuthenticated(true);
        fetchDashboardStats();
        fetchAllOrders();
      }
      setChecking(false);
    };
    
    checkAuth();
  }, [router]);

  // Fetch all orders for filtering
  const fetchAllOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setAllOrders(data);
      applyFilter(activeFilter, data);
    }
  };

  // Apply filter to orders
  const applyFilter = (filter: typeof activeFilter, ordersData = allOrders) => {
    setActiveFilter(filter);
    let filteredOrders = [...ordersData];
    
    switch (filter) {
      case 'pendingPayment':
        filteredOrders = ordersData.filter(o => !o.payment_verified);
        break;
      case 'pendingCollection':
        filteredOrders = ordersData.filter(o => o.payment_verified && !o.collected);
        break;
      case 'collected':
        filteredOrders = ordersData.filter(o => o.collected);
        break;
      default:
        break;
    }
    
    setOrders(filteredOrders);
  };

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `);
      
      if (ordersError) throw ordersError;
      
      // Calculate statistics
      const totalOrders = ordersData.length;
      const totalShirts = ordersData.reduce((sum, order) => sum + order.total_shirts, 0);
      const totalAmount = ordersData.reduce((sum, order) => sum + order.total_amount, 0);
      const pendingPayment = ordersData.filter(o => !o.payment_verified).length;
      const pendingCollection = ordersData.filter(o => o.payment_verified && !o.collected).length;
      const collected = ordersData.filter(o => o.collected).length;
      
      // Size breakdown
      const sizeBreakdown: { [key: string]: number } = {};
      allSizes.forEach(size => { sizeBreakdown[size] = 0; });
      
      ordersData.forEach(order => {
        order.order_items?.forEach((item: any) => {
          if (sizeBreakdown[item.size] !== undefined) {
            sizeBreakdown[item.size] += item.quantity;
          }
        });
      });
      
      // Date-wise orders (last 7 days)
      const dateWiseOrders: { [key: string]: number } = {};
      const last7Days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();
      
      last7Days.forEach(date => { dateWiseOrders[date] = 0; });
      
      ordersData.forEach(order => {
        const orderDate = new Date(order.created_at).toISOString().split('T')[0];
        if (dateWiseOrders[orderDate] !== undefined) {
          dateWiseOrders[orderDate]++;
        }
      });
      
      setStats({
        totalOrders,
        totalShirts,
        totalAmount,
        pendingPayment,
        pendingCollection,
        collected,
        sizeBreakdown,
        dateWiseOrders: Object.entries(dateWiseOrders).map(([date, count]) => ({ date, count }))
      });
      
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLogout = () => {
    document.cookie = 'admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/admin/login');
  };

  const searchOrders = async () => {
    if (!searchTerm.trim()) {
      applyFilter(activeFilter);
      return;
    }
    
    setLoading(true);
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `);
    
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

  const clearSearch = () => {
    setSearchTerm('');
    applyFilter(activeFilter);
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
      fetchDashboardStats();
      fetchAllOrders();
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
      fetchDashboardStats();
      fetchAllOrders();
    }
  };

  const exportToCSV = async () => {
    setExporting(true);
    
    try {
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

  if (checking || loadingStats) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Logout Button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-orange-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage orders, verify payments, and track collections</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center gap-2"
          >
            🚪 Logout
          </button>
        </div>

        {/* Statistics Dashboard */}
        {stats && (
          <>
            {/* Main Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <p className="text-2xl font-bold text-orange-600">{stats.totalOrders}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.totalShirts}</p>
                <p className="text-sm text-gray-600">Total T-Shirts</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <p className="text-2xl font-bold text-green-600">₹{stats.totalAmount}</p>
                <p className="text-sm text-gray-600">Total Amount</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center cursor-pointer hover:shadow-lg transition" onClick={() => applyFilter('pendingPayment')}>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingPayment}</p>
                <p className="text-sm text-gray-600">Pending Payment</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center cursor-pointer hover:shadow-lg transition" onClick={() => applyFilter('pendingCollection')}>
                <p className="text-2xl font-bold text-purple-600">{stats.pendingCollection}</p>
                <p className="text-sm text-gray-600">Pending Collection</p>
              </div>
            </div>

            {/* Size Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">T-Shirts by Size</h2>
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-3">
                {Object.entries(stats.sizeBreakdown)
                  .filter(([_, count]) => count > 0)
                  .map(([size, count]) => (
                    <div key={size} className="bg-orange-50 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-orange-600">{size}</p>
                      <p className="text-sm text-gray-600">{count} pcs</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Date-wise Orders */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Orders by Date (Last 7 Days)</h2>
              <div className="grid grid-cols-7 gap-2">
                {stats.dateWiseOrders.map((item) => (
                  <div key={item.date} className="text-center">
                    <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString('en-IN', { weekday: 'short' })}</p>
                    <p className="text-lg font-bold text-orange-600">{item.count}</p>
                    <p className="text-xs text-gray-400">{item.date.split('-')[2]}/{item.date.split('-')[1]}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {/* Filter Buttons */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => applyFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeFilter === 'all' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Orders ({stats?.totalOrders || 0})
            </button>
            <button
              onClick={() => applyFilter('pendingPayment')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeFilter === 'pendingPayment' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }`}
            >
              ⏳ Pending Payment ({stats?.pendingPayment || 0})
            </button>
            <button
              onClick={() => applyFilter('pendingCollection')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeFilter === 'pendingCollection' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              📦 Pending Collection ({stats?.pendingCollection || 0})
            </button>
            <button
              onClick={() => applyFilter('collected')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeFilter === 'collected' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              ✓ Collected ({stats?.collected || 0})
            </button>
          </div>
        </div>
        
        {/* Admin Actions Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportToCSV}
              disabled={exporting}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              📥 {exporting ? 'Exporting...' : 'Export All to CSV'}
            </button>
            <button
              onClick={() => {
                fetchDashboardStats();
                fetchAllOrders();
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>
        
        {/* Search Box */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search by Order ID (RMM2026-XXXX) or Mobile Number"
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
              {loading ? 'Searching...' : 'Search 🔍'}
            </button>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600"
              >
                Clear ✕
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            💡 Example: RMM2026-0001 or 9876543210
          </p>
        </div>
        
        {/* Results Count */}
        {orders.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">Showing {orders.length} order(s)</p>
          </div>
        )}
        
        {/* No Results */}
        {orders.length === 0 && !loading && searchTerm && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">❌ No orders found</p>
          </div>
        )}
        
        {/* Order Cards */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className={`bg-white rounded-lg shadow-md overflow-hidden border-l-8 ${
              order.collected ? 'border-green-500' : order.payment_verified ? 'border-blue-500' : 'border-yellow-500'
            }`}>
              <div className="p-6">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="text-2xl font-bold text-orange-600">{order.order_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Booking Date</p>
                    <p className="text-sm font-semibold">
                      {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                
                {/* Customer Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b">
                  <div>
                    <p className="text-xs text-gray-500">Customer Name</p>
                    <p className="font-semibold">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mobile Number</p>
                    <p className="font-semibold">{order.mobile_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total T-Shirts</p>
                    <p className="font-semibold">{order.total_shirts} pcs</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Amount</p>
                    <p className="font-semibold text-orange-600">₹{order.total_amount}</p>
                  </div>
                </div>
                
                {/* Items Summary */}
                {order.order_items && order.order_items.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">T-Shirt Details</p>
                    <div className="flex flex-wrap gap-2">
                      {order.order_items.map((item: any, idx: number) => (
                        <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                          {item.size} × {item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* UTR Number if available */}
                {order.utr_number && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500">UTR Number</p>
                    <p className="text-sm font-mono bg-gray-50 px-2 py-1 rounded inline-block">{order.utr_number}</p>
                  </div>
                )}
                
                {/* Status Badges */}
                <div className="flex gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.payment_verified 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.payment_verified ? '✓ Payment Verified' : '⏳ Payment Pending'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.collected 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {order.collected ? '✓ Collected' : '📦 Not Collected'}
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!order.payment_verified && (
                    <button
                      onClick={() => verifyPayment(order.id, order.order_id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700"
                    >
                      ✅ Verify Payment
                    </button>
                  )}
                  {order.payment_verified && !order.collected && (
                    <button
                      onClick={() => markAsCollected(order.id, order.order_id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
                    >
                      📦 Mark as Collected
                    </button>
                  )}
                  {order.collected && (
                    <button
                      disabled
                      className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-semibold cursor-not-allowed"
                    >
                      ✓ Already Collected
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State for Filters */}
        {orders.length === 0 && !searchTerm && activeFilter !== 'all' && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-500 text-lg">No orders in this category</p>
            <button
              onClick={() => applyFilter('all')}
              className="mt-4 text-orange-600 font-semibold hover:underline"
            >
              View all orders →
            </button>
          </div>
        )}
        
        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-800 mb-2">📋 Distribution Day Instructions:</h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
            <li>Ask customer for Order ID or Mobile Number</li>
            <li>Search using the search box above</li>
            <li>Verify customer name and mobile number match</li>
            <li>Check that payment is verified (green badge)</li>
            <li>Hand over the T-Shirts</li>
            <li>Click "Mark as Collected" button</li>
            <li className="font-bold">Once marked collected, it cannot be collected again</li>
          </ul>
        </div>
      </div>
    </div>
  );
}