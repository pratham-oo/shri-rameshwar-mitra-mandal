'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface OrderItem {
  size: string;
  quantity: number;
  price_per_piece: number;
  subtotal: number;
}

interface OrderData {
  order_id: string;
  customer_name: string;
  mobile_number: string;
  total_amount: number;
  total_shirts: number;
  created_at: string;
  items: OrderItem[];
}

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [showScreenshotMessage, setShowScreenshotMessage] = useState(false);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(dataParam));
        setOrderData(parsed);
      } catch (error) {
        console.error('Failed to parse order data:', error);
      }
    }
  }, [searchParams]);

  const handleScreenshotConfirm = () => {
    setShowScreenshotMessage(true);
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  const bookingDate = new Date(orderData.created_at);
  const formattedDate = bookingDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-8 text-center">
            <div className="text-6xl mb-3">🙏</div>
            <h1 className="text-3xl md:text-4xl font-bold text-white marathi-text mb-2">
              बुकिंग यशस्वी!
            </h1>
            <p className="text-orange-100 text-lg">
              तुमची टी-शर्ट बुकिंग पूर्ण झाली आहे
            </p>
          </div>
          
          <div className="border-b-4 border-dashed border-orange-200 bg-orange-50 px-6 py-6 text-center">
            <p className="text-gray-600 text-sm mb-2">तुमचा ऑर्डर ID</p>
            <p className="text-4xl md:text-5xl font-bold text-orange-600 tracking-wider">
              {orderData.order_id}
            </p>
            <div className="mt-3 inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm">
              📸 कृपया हा पेज स्क्रीनशॉट घ्या
            </div>
          </div>
          
          <div className="px-6 py-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 marathi-text">
              ऑर्डर तपशील
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">ग्राहक नाव</p>
                  <p className="font-semibold text-gray-800">{orderData.customer_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">मोबाईल नंबर</p>
                  <p className="font-semibold text-gray-800">{orderData.mobile_number}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">बुकिंग तारीख</p>
                  <p className="font-semibold text-gray-800">{formattedDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">एकूण टी-शर्ट</p>
                  <p className="font-semibold text-gray-800">{orderData.total_shirts} टी-शर्ट</p>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto mb-6">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">साईज</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">संख्या</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">किंमत</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-600">एकूण</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orderData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-gray-800 font-medium">{item.size}</td>
                      <td className="px-4 py-3 text-gray-600">{item.quantity}</td>
                      <td className="px-4 py-3 text-gray-600">₹{item.price_per_piece}</td>
                      <td className="px-4 py-3 text-right font-semibold text-orange-600">₹{item.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-orange-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-800">
                      एकूण रक्कम:
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-orange-600 text-xl">
                      ₹{orderData.total_amount}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-8 shadow-lg">
            <p className="text-2xl md:text-3xl font-bold marathi-text text-orange-800 mb-3">
              ॐ गण गणपतये नमः
            </p>
            <p className="text-sm text-gray-600 mt-2">
              वक्रतुंड महाकाय सूर्यकोटि समप्रभा ।<br />
              निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={handleScreenshotConfirm}
            className="bg-gradient-to-r from-green-600 to-teal-600 text-white text-lg font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            📸 मी स्क्रीनशॉट घेतला आहे
          </button>
          {showScreenshotMessage && (
            <div className="mt-3 text-green-600 font-semibold">
              ✓ धन्यवाद! होम पेजवर जात आहे...
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/">
            <button className="text-orange-600 font-bold text-xl marathi-text hover:text-red-600 transition-colors">
              गणपती बाप्पा मोरया 🙏
            </button>
          </Link>
        </div>
        
        <p className="text-center text-xs text-gray-400 mt-8 pb-8">
          * संकलनाच्या वेळी हा स्क्रीनशॉट किंवा ऑर्डर ID दाखवणे अनिवार्य आहे
        </p>
      </div>
    </div>
  );
}