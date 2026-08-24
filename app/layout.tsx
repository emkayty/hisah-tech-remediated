'use client';

import type { Metadata } from "next";
import "./globals.css";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, BookOpen, Mail, FileCode } from 'lucide-react';
import WhatsAppButton from './components/WhatsAppButton';
import AIAssistant from '@/components/AIAssistant';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  return (
    <html lang="en">
      <head>
        <title>Hisah Tech</title>
        <meta name="description" content="Built with AppGen" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href="https://app-cdn.appgen.com/c7064d62-1c73-490d-ac77-d68af9351b9e/assets/uploaded_1770778750067_te5t3k.jpeg" />
      </head>
      <body className="antialiased">
        {/* Top Header Navigation */}
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50 pt-[env(safe-area-inset-top)]">
          <nav className="flex justify-around items-center h-14 px-2">
            <Link 
              href="/" 
              className={`flex flex-col items-center justify-center flex-1 h-full transition ${
                pathname === '/' ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs mt-0.5">Home</span>
            </Link>
            
            <Link 
              href="/bios-files" 
              className={`flex flex-col items-center justify-center flex-1 h-full transition ${
                pathname === '/bios-files' ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-xs mt-0.5">BIOS Files</span>
            </Link>
            
            <Link 
              href="/schematics" 
              className={`flex flex-col items-center justify-center flex-1 h-full transition ${
                pathname === '/schematics' ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <FileCode className="w-5 h-5" />
              <span className="text-xs mt-0.5">Schematics</span>
            </Link>
            
            <Link 
              href="/repair-guides" 
              className={`flex flex-col items-center justify-center flex-1 h-full transition ${
                pathname === '/repair-guides' ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-xs mt-0.5">Guides</span>
            </Link>
            
            <Link 
              href="/contact" 
              className={`flex flex-col items-center justify-center flex-1 h-full transition ${
                pathname === '/contact' ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Mail className="w-5 h-5" />
              <span className="text-xs mt-0.5">Contact</span>
            </Link>
          </nav>
        </header>

        <main className="pt-14 pb-20">{children}</main>
        
        {/* WhatsApp Floating Button */}
        <WhatsAppButton />
        
        {/* AI Assistant */}
        <AIAssistant />
      </body>
    </html>
  );
}
