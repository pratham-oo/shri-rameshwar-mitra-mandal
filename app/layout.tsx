import type { Metadata } from 'next';
import Header from '@/components/Header';
import GanpatiDecoration from '@/components/GanpatiDecoration';
import './globals.css';

export const metadata: Metadata = {
  title: 'श्री रामेश्वर मित्र मंडळ | T-Shirt Booking 2025',
  description:
    'Book your Ganesh Mandal T-Shirts online. Easy booking, price calculation, and payment verification.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mr">
      <body className="overflow-x-hidden bg-white">

        {/* Top Ganpati Decoration */}
        <GanpatiDecoration position="top" />

        {/* Navbar */}
        <Header />

        {/* Page Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer Ganpati Decoration */}
        <GanpatiDecoration position="bottom" />

      </body>
    </html>
  );
}