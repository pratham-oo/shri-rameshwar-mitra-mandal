'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isBookingClosed, setIsBookingClosed] = useState(false);

  const handleBookNow = () => {
    const bookingSection = document.getElementById('booking-form');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Timer logic
  useEffect(() => {
    const checkBookingDeadline = () => {
      const now = new Date();
      const today = new Date(now);
      today.setHours(23, 59, 0, 0); // 11:59 PM today
      
      const timeDiff = today.getTime() - now.getTime();
      
      if (timeDiff <= 0) {
        setIsBookingClosed(true);
        setTimeRemaining('समाप्त');
        return;
      }
      
      // Calculate hours, minutes, seconds remaining
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
      setTimeRemaining(`${hours} तास ${minutes} मिनिटे ${seconds} सेकंद`);
    };
    
    checkBookingDeadline();
    
    // Update timer every second
    const interval = setInterval(checkBookingDeadline, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Timer Banner - Below the main content */}
        <div className="mb-8 text-center">
          {isBookingClosed ? (
            <div className="inline-block bg-red-100 border-2 border-red-500 rounded-xl px-8 py-4 shadow-lg">
              <p className="text-red-700 font-bold text-xl marathi-text">
                🙏 बुकिंग बंद झाले आहे
              </p>
              <p className="text-red-600 mt-1 text-sm">
                गणपती बाप्पा मोरया! पुढच्या वर्षी भेटूया.
              </p>
            </div>
          ) : (
            <div className="inline-block bg-gradient-to-r from-orange-100 to-orange-200 border border-orange-300 rounded-xl px-8 py-4 shadow-md">
              <p className="text-orange-700 font-semibold text-sm md:text-base">
                ⏳ बुकिंग साठी उरलेला वेळ:
              </p>
              <p className="text-2xl md:text-3xl font-bold text-orange-600 mt-1 animate-pulse">
                {timeRemaining}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          
          {/* Left Side - Text Content */}
          <div className="flex-1 text-center md:text-left">
            {/* Small badge */}
            <div className="inline-block bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              गणेशोत्सव २०२६
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
              <span className="marathi-text text-orange-800">
                श्री रामेश्वर मित्र मंडळ
              </span>
            </h1>
            
            {/* Subtitle - Malad cha Morya */}
            <p className="marathi-text text-xl md:text-2xl text-orange-600 font-semibold mb-1">
              मालाडचा मोरया
            </p>
            
            {/* Registration Number */}
            <p className="text-sm text-gray-500 mb-4">
              रजि. नं. म. म. जी. बी. बी. एस. डी. १५७३
            </p>
            
            {/* English Subtitle */}
            <p className="text-gray-600 text-lg md:text-xl mb-6 max-w-2xl mx-auto md:mx-0">
              T-Shirt Booking 2026
            </p>
            
            {/* Description */}
            <p className="text-gray-600 text-md mb-6 max-w-2xl mx-auto md:mx-0">
              गणेशोत्सवाच्या शुभ उत्सवासाठी खास डिझाइन केलेली टी-शर्ट बुक करा. 
              सर्व साईजमध्ये उपलब्ध (XS ते 5XL व बालके)
            </p>
            
            {/* Book Now Button */}
            <button
              onClick={handleBookNow}
              disabled={isBookingClosed}
              className={`text-white text-lg md:text-xl font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                isBookingClosed 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-orange-600 to-red-600 hover:scale-105'
              }`}
            >
              {isBookingClosed ? 'बुकिंग बंद' : 'आत्ताच बुक करा 🚀'}
            </button>
            
            {/* Small note */}
            <p className="text-sm text-gray-500 mt-4">
              {isBookingClosed ? 'बुकिंग संपले. पुढच्या वर्षी भेटूया!' : 'मर्यादित संख्या • लवकर बुक करा'}
            </p>
          </div>
          
          {/* Right Side - T-Shirt Image + PDF Guide */}
          <div className="flex-1 flex flex-col items-center md:items-end gap-6">
            {/* T-Shirt Image */}
            <div className="relative group">
              {/* Glow effect behind image */}
              <div className="absolute inset-[-20%] bg-gradient-to-r from-orange-400 to-red-400 rounded-3xl blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              
              {/* Image Container */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform group-hover:scale-105 transition-transform duration-300">
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px]">
                  <Image
                    src="/images/tshirt-2026.png"
                    alt="Ganesh Mandal T-Shirt Design 2026 - श्री रामेश्वर मित्र मंडळ"
                    fill
                    sizes="(max-width: 640px) 80vw, (max-width: 768px) 70vw, (max-width: 1024px) 50vw, 40vw"
                    className="object-contain rounded-xl"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* PDF Guide Button */}
            <div className="w-full max-w-sm">
              <a
                href="/ganpati-tee-guide.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <p className="text-sm font-medium">बुकिंग मार्गदर्शक</p>
                    <p className="text-xs opacity-90">Booking Guide (PDF)</p>
                  </div>
                  <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">📄</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Developer Credit - ENLARGED and VISIBLE */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-full shadow-md border border-orange-200/60">
            <span className="text-base md:text-lg">🖥️</span>
            <span className="text-sm md:text-base text-gray-600 marathi-text font-medium">
              Developed by
            </span>
            <span className="text-base md:text-lg font-bold text-orange-600 marathi-text">
              प्रथम शिंदे
            </span>
            <span className="text-gray-300 text-lg">|</span>
            <span className="text-sm md:text-base text-gray-500">
              © २०२६
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}