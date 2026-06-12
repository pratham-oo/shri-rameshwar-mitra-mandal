'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

// TypeScript interfaces
interface TShirtItem {
  id: number;
  size: string;
  quantity: number;
  pricePerPiece: number;
}

export default function BookingForm() {
  // Customer details state
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  
  // Payment details state
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // T-Shirt items state
  const [items, setItems] = useState<TShirtItem[]>([
    { id: 1, size: 'M', quantity: 1, pricePerPiece: 350 }
  ]);
  
  const [nextId, setNextId] = useState(2);
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Price per T-Shirt
  const PRICE_PER_T_SHIRT = 350;
  
  // Available sizes
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL', '5XL'];
  const childSizes = ['22', '24', '26', '28', '30', '32'];
  
  // Calculate total shirts
  const calculateTotalShirts = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };
  
  // Calculate total price
  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.pricePerPiece), 0);
  };
  
  // Add new T-Shirt row
  const addTShirt = () => {
    setItems([...items, { id: nextId, size: 'M', quantity: 1, pricePerPiece: PRICE_PER_T_SHIRT }]);
    setNextId(nextId + 1);
  };
  
  // Remove T-Shirt row
  const removeTShirt = (id: number) => {
    if (items.length === 1) {
      alert('At least one T-Shirt is required');
      return;
    }
    setItems(items.filter(item => item.id !== id));
  };
  
  // Update item size
  const updateSize = (id: number, size: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, size: size } : item
    ));
  };
  
  // Update item quantity
  const updateQuantity = (id: number, inputValue: string) => {
    if (inputValue === '') {
      setItems(items.map(item => 
        item.id === id ? { ...item, quantity: 0 } : item
      ));
      return;
    }
    
    const numericValue = inputValue.replace(/\D/g, '');
    
    if (numericValue === '') {
      setItems(items.map(item => 
        item.id === id ? { ...item, quantity: 0 } : item
      ));
      return;
    }
    
    let quantity = parseInt(numericValue, 10);
    
    if (quantity > 20) quantity = 20;
    if (quantity < 1) quantity = 1;
    
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: quantity } : item
    ));
  };
  
  const handleQuantityChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    updateQuantity(id, e.target.value);
  };
  
  const handleQuantityBlur = (id: number, currentQuantity: number) => {
    if (currentQuantity < 1 || isNaN(currentQuantity)) {
      setItems(items.map(item => 
        item.id === id ? { ...item, quantity: 1 } : item
      ));
    }
  };
  
  const getQuantityDisplay = (quantity: number) => {
    return quantity === 0 ? '' : quantity.toString();
  };
  
  // Compress image before upload
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          if (width > 1200) {
            height = (height * 1200) / width;
            width = 1200;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name.replace(/\.(png|jpg|jpeg|heic)$/i, '.jpg'), {
                  type: 'image/jpeg',
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Compression failed'));
              }
            },
            'image/jpeg',
            0.7
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };
  
  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload only image files (JPG, PNG)');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB');
      return;
    }
    
    setUploading(true);
    try {
      const compressedFile = await compressImage(file);
      setPaymentScreenshot(compressedFile);
      setPreviewUrl(URL.createObjectURL(compressedFile));
    } catch (error) {
      alert('Failed to compress image. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  
  // Upload screenshot to Supabase Storage
  const uploadScreenshot = async (orderId: string): Promise<string | null> => {
    if (!paymentScreenshot) return null;
    
    const fileExt = paymentScreenshot.name.split('.').pop();
    const fileName = `${orderId}-${Date.now()}.jpg`;
    const filePath = fileName;
    
    const { error: uploadError } = await supabase.storage
      .from('payment-screenshots')
      .upload(filePath, paymentScreenshot);
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('payment-screenshots')
      .getPublicUrl(filePath);
    
    return publicUrl;
  };
  
  // Form validation
  const isFormValid = () => {
    if (!customerName.trim()) return false;
    if (!mobileNumber.trim() || mobileNumber.length !== 10 || !/^\d+$/.test(mobileNumber)) return false;
    if (items.length === 0) return false;
    if (items.some(item => item.quantity < 1)) return false;
    if (!utrNumber.trim() || utrNumber.length < 6) return false;
    if (!paymentScreenshot) return false;
    return true;
  };
  
  // Save to Supabase
  const saveToSupabase = async (screenshotUrl: string | null) => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerName.trim(),
          mobile_number: mobileNumber,
          total_amount: calculateTotal(),
          total_shirts: calculateTotalShirts(),
          utr_number: utrNumber,
          payment_screenshot_url: screenshotUrl,
          payment_verified: false,
          collected: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        size: item.size,
        quantity: item.quantity,
        price_per_piece: item.pricePerPiece,
        subtotal: item.quantity * item.pricePerPiece
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      return { success: true, orderData };
      
    } catch (error: any) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      let errorMsg = 'Please fill all required fields:\n';
      if (!customerName.trim()) errorMsg += '- Name\n';
      if (!mobileNumber.trim() || mobileNumber.length !== 10) errorMsg += '- Valid Mobile Number (10 digits)\n';
      if (!utrNumber.trim()) errorMsg += '- UTR Number\n';
      if (!paymentScreenshot) errorMsg += '- Payment Screenshot\n';
      alert(errorMsg);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage(null);
    
    const result = await saveToSupabase(null);
    
    if (result.success) {
      const screenshotUrl = await uploadScreenshot(result.orderData.order_id);
      
      if (screenshotUrl) {
        await supabase
          .from('orders')
          .update({ payment_screenshot_url: screenshotUrl })
          .eq('id', result.orderData.id);
      }
      
      const orderDataForPage = {
        order_id: result.orderData.order_id,
        customer_name: customerName.trim(),
        mobile_number: mobileNumber,
        total_amount: calculateTotal(),
        total_shirts: calculateTotalShirts(),
        utr_number: utrNumber,
        created_at: new Date().toISOString(),
        items: items.map(item => ({
          size: item.size,
          quantity: item.quantity,
          price_per_piece: item.pricePerPiece,
          subtotal: item.quantity * item.pricePerPiece
        }))
      };
      
      const encodedData = encodeURIComponent(JSON.stringify(orderDataForPage));
      window.location.href = `/success?data=${encodedData}`;
      
    } else {
      setSubmitMessage({
        type: 'error',
        text: `❌ Booking failed: ${result.error}\nPlease try again.`
      });
      setIsSubmitting(false);
      
      setTimeout(() => {
        setSubmitMessage(null);
      }, 10000);
    }
  };
  
  return (
    <section id="booking-form" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            T-Shirt Booking Form
          </h2>
          <p className="text-gray-600 text-lg">
            Please fill in the details below
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mt-4 rounded-full"></div>
        </div>
        
        {/* Error Message */}
        {submitMessage && submitMessage.type === 'error' && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-500 text-red-700">
            <p className="text-sm">{submitMessage.text}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Customer Details Section */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Customer Details
            </h3>
            
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                />
              </div>
              
              {/* Mobile Number */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="9876543210"
                  maxLength={10}
                  disabled={isSubmitting}
                />
                {mobileNumber && mobileNumber.length !== 10 && (
                  <p className="text-red-500 text-sm mt-1">Please enter 10 digit mobile number</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Payment Section */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Payment Details
            </h3>
            
            {/* QR Code Section */}
            <div className="bg-white rounded-lg p-4 mb-4 text-center">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Scan QR Code to Pay
              </p>
              <div className="flex justify-center">
                <img 
                  src="/images/qr.png" 
                  alt="UPI QR Code for Payment"
                  className="w-48 h-48 object-contain"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Google Pay / PhonePe / Any UPI App</p>
            </div>
            
            {/* UTR Number */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                UTR Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.toUpperCase())}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Enter UTR number from your payment"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                UTR number is shown in your bank statement after payment
              </p>
            </div>
            
            {/* Screenshot Upload */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Payment Screenshot <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isSubmitting || uploading}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload screenshot showing UTR number and amount
              </p>
              {uploading && <p className="text-blue-500 text-sm mt-1">Compressing image...</p>}
            </div>
            
            {/* Preview */}
            {previewUrl && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-1">Preview:</p>
                <img src={previewUrl} alt="Preview" className="h-32 rounded-lg border" />
              </div>
            )}
          </div>
          
          {/* T-Shirt Selection Section */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              T-Shirt Details
            </h3>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    {/* Size Selection */}
                    <div>
                      <label className="block text-gray-600 text-sm font-semibold mb-1">
                        Size
                      </label>
                      <select
                        value={item.size}
                        onChange={(e) => updateSize(item.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        disabled={isSubmitting}
                      >
                        <optgroup label="Adult Sizes">
                          {availableSizes.map(size => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Children Sizes">
                          {childSizes.map(size => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                    
                    {/* Quantity */}
                    <div>
                      <label className="block text-gray-600 text-sm font-semibold mb-1">
                        Quantity
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={getQuantityDisplay(item.quantity)}
                        onChange={(e) => handleQuantityChange(item.id, e)}
                        onBlur={() => handleQuantityBlur(item.id, item.quantity)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="1"
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-400 mt-1">(1 to 20)</p>
                    </div>
                    
                    {/* Price per piece */}
                    <div>
                      <label className="block text-gray-600 text-sm font-semibold mb-1">
                        Price per piece
                      </label>
                      <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                        ₹ {item.pricePerPiece}
                      </div>
                    </div>
                    
                    {/* Subtotal & Remove Button */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <label className="block text-gray-600 text-sm font-semibold mb-1">
                          Subtotal
                        </label>
                        <div className="w-full px-3 py-2 bg-orange-50 rounded-lg text-orange-700 font-bold">
                          ₹ {item.quantity * item.pricePerPiece}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTShirt(item.id)}
                        className="text-red-500 hover:text-red-700 font-bold py-2 px-3"
                        disabled={isSubmitting}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addTShirt}
                className="w-full py-3 border-2 border-dashed border-orange-300 rounded-lg text-orange-600 font-semibold hover:bg-orange-50 transition-colors"
                disabled={isSubmitting}
              >
                + Add Another T-Shirt
              </button>
            </div>
          </div>
          
          {/* Total Price Section */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-gray-600 text-sm">Total T-Shirts</p>
                <p className="text-2xl font-bold text-gray-800">
                  {items.reduce((sum, item) => sum + item.quantity, 0)} T-Shirts
                </p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-600 text-sm">Total Amount to Pay</p>
                <p className="text-4xl font-bold text-orange-600">
                  ₹ {calculateTotal()}
                </p>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className={`w-full py-4 text-lg font-bold rounded-lg transition-all ${
              !isFormValid() || isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-lg transform hover:scale-[1.02] cursor-pointer'
            }`}
          >
            {isSubmitting ? 'Submitting Booking...' : 'Complete Booking & Submit 📝'}
          </button>
          
          <p className="text-center text-sm text-gray-500">
            * After submission, you will receive an Order ID. Please save it for collection.
          </p>
        </form>
      </div>
    </section>
  );
}