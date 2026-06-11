'use client';

import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export default function TestSupabase() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Testing connection...');
    
    try {
      // Test 1: Check if we can read from orders table
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      
      if (ordersError) throw ordersError;
      
      setTestResult('✅ Connection successful! Database is reachable.\n');
      
      // Test 2: Insert a test order
      const testOrderId = `TEST-${Date.now()}`;
      const { data: newOrder, error: insertError } = await supabase
        .from('orders')
        .insert({
          order_id: testOrderId,
          customer_name: 'Test Customer',
          mobile_number: '9999999999',
          total_amount: 350,
          total_shirts: 1
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      setTestResult(prev => prev + `✅ Test order created! Order ID: ${newOrder.order_id}\n`);
      
      // Test 3: Add test items
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert({
          order_id: newOrder.id,
          size: 'M',
          quantity: 1,
          price_per_piece: 350,
          subtotal: 350
        });
      
      if (itemsError) throw itemsError;
      
      setTestResult(prev => prev + '✅ Test items added!\n');
      
      // Test 4: Read the order back
      const { data: fetchedOrder, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('order_id', testOrderId)
        .single();
      
      if (fetchError) throw fetchError;
      
      setTestResult(prev => prev + `✅ Retrieved order with ${fetchedOrder.order_items.length} item(s)\n`);
      setTestResult(prev => prev + '\n🎉 All tests passed! Supabase is working perfectly.');
      
    } catch (error: any) {
      console.error('Supabase error:', error);
      setTestResult(`❌ Error: ${error.message}\n\nCheck that you:\n1. Created the tables in SQL editor\n2. Have correct URL and anon key\n3. Are using the right environment variables`);
    } finally {
      setLoading(false);
    }
  };

  const cleanupTest = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .like('order_id', 'TEST-%');
      
      if (error) throw error;
      setTestResult(prev => prev + '\n\n🧹 Test data cleaned up successfully.');
    } catch (error: any) {
      console.error('Cleanup error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-20 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Supabase Connection Test</h1>
        <p className="text-gray-600 mb-6">Testing your database setup...</p>
        
        <div className="space-y-4">
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 w-full"
          >
            {loading ? 'Testing...' : 'Run Database Tests'}
          </button>
          
          {testResult.includes('All tests passed') && (
            <button
              onClick={cleanupTest}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all w-full"
            >
              Clean Up Test Data
            </button>
          )}
        </div>
        
        {testResult && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{testResult}</pre>
          </div>
        )}
        
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Next:</strong> After tests pass, we'll modify the booking form to save to Supabase!
          </p>
        </div>
      </div>
    </div>
  );
}