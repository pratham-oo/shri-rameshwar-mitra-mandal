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
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-lg md:text-xl font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              आत्ताच बुक करा 🚀
            </button>
            
            {/* Small note */}
            <p className="text-sm text-gray-500 mt-4">
              मर्यादित संख्या • लवकर बुक करा
            </p>
          </div>
          
          {/* Right Side - T-Shirt Image (ENLARGED) */}
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative group">
              {/* Glow effect behind image - LARGER */}
              <div className="absolute inset-[-20%] bg-gradient-to-r from-orange-400 to-red-400 rounded-3xl blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              
              {/* Image Container - LARGER */}
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
          </div>
        </div>
      </div>
    </section>
  );
}