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
          
          {/* Logo and Mandal Name */}
          <div className="flex items-center space-x-3">
            {/* Icon/Logo Placeholder */}
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold text-xl">श्री</span>
            </div>
            
            {/* Mandal Name in Marathi */}
            <div>
              <h1 className="marathi-text text-xl sm:text-2xl font-bold leading-tight">
                श्री रामेश्वर मित्र मंडळ
              </h1>
              <p className="text-xs sm:text-sm text-orange-100 hidden sm:block">
                T-Shirt Booking Portal 2026
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <a 
              href="/" 
              className="hover:text-orange-200 transition-colors"
            >
              मुख्यपृष्ठ
            </a>
            <a 
              href="#booking-form" 
              onClick={scrollToBooking}
              className="hover:text-orange-200 transition-colors"
            >
              बुकिंग
            </a>
            <a 
              href="/admin" 
              className="hover:text-orange-200 transition-colors"
            >
              प्रशासन
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden focus:outline-none"
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
                className="hover:text-orange-200 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                मुख्यपृष्ठ
              </a>
              <a 
                href="#booking-form" 
                onClick={scrollToBooking}
                className="hover:text-orange-200 transition-colors py-2"
              >
                बुकिंग
              </a>
              <a 
                href="/admin" 
                className="hover:text-orange-200 transition-colors py-2"
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