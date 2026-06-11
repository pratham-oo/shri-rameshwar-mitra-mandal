'use client';

import Image from 'next/image';

export default function Hero() {
  const handleBookNow = () => {
    const bookingSection = document.getElementById('booking-form');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Side - Text Content */}
          <div className="flex-1 text-center md:text-left">
            {/* Small badge */}
            <div className="inline-block bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              गणेशोत्सव २०२६
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="marathi-text text-orange-800">
                श्री रामेश्वर मित्र मंडळ
              </span>
              <br />
              <span className="text-gray-800 text-3xl md:text-4xl lg:text-5xl">
                T-Shirt Booking 2026
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-gray-600 text-lg md:text-xl mb-6 max-w-2xl mx-auto md:mx-0">
              गणेशोत्सवाच्या शुभ उत्सवासाठी खास डिझाइन केलेली टी-शर्ट बुक करा. 
              दर्जेदार कापसाची टी-शर्ट, कमी किमतीत.
            </p>
            
            {/* Key Features List */}
            <div className="space-y-3 mb-8 max-w-md mx-auto md:mx-0">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-gray-700">उच्च दर्जाचे १००% सुती कापड</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-gray-700">आकर्षक गणपती डिझाइन</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-gray-700">सर्व साईजमध्ये उपलब्ध (XS ते 5XL व बालके)</span>
              </div>
            </div>
            
            {/* Book Now Button */}
            <button
              onClick={handleBookNow}
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-lg md:text-xl font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              आत्ताच बुक करा 🚀
            </button>
            
            {/* Small note */}
            <p className="text-sm text-gray-500 mt-4">
              मर्यादित संख्या • लवकर बुक करा
            </p>
          </div>
          
          {/* Right Side - T-Shirt Image */}
          <div className="flex-1 flex justify-center">
            <div className="relative group">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              
              {/* Image Container */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-4 transform group-hover:scale-105 transition-transform duration-300">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <Image
                    src="/images/tshirt-design.png"
                    alt="Ganesh Mandal T-Shirt Design 2026 - श्री रामेश्वर मित्र मंडळ"
                    fill
                    className="object-contain rounded-xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}