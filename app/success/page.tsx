'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

// Import the type of your SuccessContent component
// This helps TypeScript understand the import
const SuccessContent = dynamic<{}>(
  () => import('./SuccessContent').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
);

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}