'use client';

import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const scrollToBooking = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const bookingSection = document.getElementById('booking-form');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo and Mandal Details */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Fixed Logo Container - Removed the scale-[1.35] zoom effect */}
            <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white shadow-sm overflow-hidden bg-white flex items-center justify-center">
              <img 
                src="/images/mandal-logo.png" 
                alt="मालाडचा मोरया Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            
            {/* Mandal Name, Subtitle, and Date */}
            <div className="flex flex-col">
              <h1 className="marathi-text text-lg sm:text-2xl font-bold leading-tight drop-shadow-sm">
                श्री रामेश्वर मित्र मंडळ
              </h1>
              <h2 className="text-base sm:text-lg font-extrabold text-yellow-300 drop-shadow-sm mt-0.5">
                मालाडचा मोरया
              </h2>
              <div className="mt-1">
                <span className="inline-block bg-white text-red-600 px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold tracking-wider shadow-sm">
                  स्थापना : १९८५
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            <a 
              href="/" 
              className="hover:text-orange-200 transition-colors font-medium"
            >
              मुख्यपृष्ठ
            </a>
            <a 
              href="#booking-form" 
              onClick={scrollToBooking}
              className="hover:text-orange-200 transition-colors font-medium"
            >
              बुकिंग
            </a>
            <a 
              href="/admin" 
              className="hover:text-orange-200 transition-colors font-medium"
            >
              प्रशासन
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden focus:outline-none flex-shrink-0 ml-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-orange-500">
            <nav className="flex flex-col space-y-3">
              <a 
                href="/" 
                className="hover:text-orange-200 transition-colors py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                मुख्यपृष्ठ
              </a>
              <a 
                href="#booking-form" 
                onClick={scrollToBooking}
                className="hover:text-orange-200 transition-colors py-2 font-medium"
              >
                बुकिंग
              </a>
              <a 
                href="/admin" 
                className="hover:text-orange-200 transition-colors py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                प्रशासन
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}