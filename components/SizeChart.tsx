'use client';

import { useState } from 'react';

interface AdultSize {
  size: string;
  chest: string;
}

interface ChildSize {
  ageRange: string;
  size: string;
}

export default function SizeChart() {
  const [selectedAdultSize, setSelectedAdultSize] = useState<string | null>(null);
  const [selectedChildSize, setSelectedChildSize] = useState<string | null>(null);

  const adultSizes: AdultSize[] = [
    { size: 'XS', chest: '34' },
    { size: 'S', chest: '36' },
    { size: 'M', chest: '38' },
    { size: 'L', chest: '40' },
    { size: 'XL', chest: '42' },
    { size: 'XXL', chest: '44' },
    { size: 'XXXL', chest: '46' },
    { size: '4XL', chest: '48' },
    { size: '5XL', chest: '50' },
  ];

  const childSizes: ChildSize[] = [
    { ageRange: '1 to 2 years', size: '22' },
    { ageRange: '3 to 4 years', size: '24' },
    { ageRange: '5 to 6 years', size: '26' },
    { ageRange: '7 to 8 years', size: '28' },
    { ageRange: '9 to 10 years', size: '30' },
    { ageRange: '11 to 12 years', size: '32' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            <span className="marathi-text">साईज चार्ट</span>
          </h2>
          <p className="text-gray-600 text-lg">
            योग्य साईज निवडण्यासाठी खालील तक्ता पहा
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* CHILDREN SECTION - Small Children (First) */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full"></div>
            <h3 className="text-2xl font-bold text-gray-800 marathi-text">
              लहान मुलांसाठी
            </h3>
            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">Small Children</span>
          </div>

          {/* Children Table - Desktop */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                  <th className="px-6 py-4 text-left font-semibold text-lg">वयोगट</th>
                  <th className="px-6 py-4 text-left font-semibold text-lg">साईज</th>
                 </tr>
              </thead>
              <tbody>
                {childSizes.map((item, index) => (
                  <tr 
                    key={item.ageRange}
                    onClick={() => setSelectedChildSize(item.size)}
                    className={`border-b border-gray-200 cursor-pointer transition-colors ${
                      selectedChildSize === item.size 
                        ? 'bg-green-50' 
                        : index % 2 === 0 
                          ? 'bg-white hover:bg-gray-50' 
                          : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-700">{item.ageRange}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{item.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Children Cards - Mobile */}
          <div className="md:hidden space-y-3">
            {childSizes.map((item) => (
              <div
                key={item.ageRange}
                onClick={() => setSelectedChildSize(item.size)}
                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all ${
                  selectedChildSize === item.size ? 'border-2 border-green-500 bg-green-50' : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">वयोगट</p>
                    <p className="font-semibold text-gray-800">{item.ageRange}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">साईज</p>
                    <p className="font-bold text-green-600 text-lg">{item.size}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Children Selection Feedback */}
          {selectedChildSize && (
            <div className="mt-4 text-center animate-pulse">
              <p className="text-green-600 font-semibold">
                ✓ तुम्ही बाल {selectedChildSize} साईज निवडला आहे
              </p>
            </div>
          )}
        </div>

        {/* ADULT SECTION - Boys & Girls (Second) */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            <h3 className="text-2xl font-bold text-gray-800 marathi-text">
              मोठ्या मुलांसाठी व प्रौढांसाठी
            </h3>
            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">Boys & Girls</span>
          </div>
          <p className="text-gray-500 text-sm mb-4">छातीचा माप (इंच मध्ये)</p>

          {/* Adult Table - Desktop - Same style as Children table */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                  <th className="px-6 py-4 text-left font-semibold text-lg">साईज</th>
                  <th className="px-6 py-4 text-left font-semibold text-lg">छाती (इंच)</th>
                 </tr>
              </thead>
              <tbody>
                {adultSizes.map((item, index) => (
                  <tr 
                    key={item.size}
                    onClick={() => setSelectedAdultSize(item.size)}
                    className={`border-b border-gray-200 cursor-pointer transition-colors ${
                      selectedAdultSize === item.size 
                        ? 'bg-orange-50' 
                        : index % 2 === 0 
                          ? 'bg-white hover:bg-gray-50' 
                          : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <td className="px-6 py-4 font-bold text-gray-800">
                      <span className="text-lg">{item.size}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{item.chest} इंच</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Adult Cards - Mobile - Clean format like children */}
          <div className="md:hidden space-y-3">
            {adultSizes.map((item) => (
              <div
                key={item.size}
                onClick={() => setSelectedAdultSize(item.size)}
                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all ${
                  selectedAdultSize === item.size ? 'border-2 border-orange-500 bg-orange-50' : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">साईज</p>
                    <p className="font-semibold text-gray-800 text-lg">{item.size}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">छाती</p>
                    <p className="font-bold text-orange-600 text-lg">{item.chest}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Adult Selection Feedback */}
          {selectedAdultSize && (
            <div className="mt-4 text-center animate-pulse">
              <p className="text-green-600 font-semibold">
                ✓ तुम्ही प्रौढ {selectedAdultSize} साईज निवडला आहे
              </p>
            </div>
          )}
        </div>

        {/* Fit Tips Section */}

        {/* Quick Size Guide Summary */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <p className="text-xs text-gray-500">बालके</p>
            <p className="font-bold text-green-600">1 ते 12 वर्ष</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <p className="text-xs text-gray-500">बाल साईज</p>
            <p className="font-bold text-green-600">22 ते 32</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <p className="text-xs text-gray-500">प्रौढ</p>
            <p className="font-bold text-orange-600">XS ते 5XL</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <p className="text-xs text-gray-500">छाती माप</p>
            <p className="font-bold text-orange-600">34 ते 50"</p>
          </div>
        </div>
      </div>
    </section>
  );
}