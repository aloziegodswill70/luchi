import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SessionWrapper from '@/components/SessionWrapper'; // ✅

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Luchi25 – Your AI Hustle Partner',
  description: 'Generate CVs, Instagram bios, and business ideas with AI – built for Nigerians.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <SessionWrapper>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
