'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LP</span>
            </div>
            <span className="text-xl font-bold text-white">LaptopFix Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors">
              Home
            </Link>
            
            {/* Service Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsServiceOpen(true)}
              onMouseLeave={() => setIsServiceOpen(false)}
            >
              <button className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                Service
                <ChevronDown className={`w-4 h-4 transition-transform ${isServiceOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isServiceOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link 
                    href="/password-generator"
                    className="block px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    Password Generator
                  </Link>
                  <Link 
                    href="/chrome-to-windows"
                    className="block px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    Chrome to Windows
                  </Link>
                </div>
              )}
            </div>

            <Link href="/repair-guides" className="text-slate-300 hover:text-white transition-colors">
              Repair Guides
            </Link>
            <Link href="/schematics" className="text-slate-300 hover:text-white transition-colors">
              Schematics
            </Link>
            <Link href="/bios-files" className="text-slate-300 hover:text-white transition-colors">
              BIOS Files
            </Link>
            <Link href="/blog" className="text-slate-300 hover:text-white transition-colors">
              Blog
            </Link>
            <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/about-us" className="text-slate-300 hover:text-white transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-slate-300 hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/" className="block py-2 text-slate-300 hover:text-white transition-colors">
              Home
            </Link>
            
            {/* Mobile Service Submenu */}
            <div className="py-2">
              <button 
                onClick={() => setIsServiceOpen(!isServiceOpen)}
                className="w-full text-left text-slate-300 hover:text-white transition-colors flex items-center justify-between"
              >
                Service
                <ChevronDown className={`w-4 h-4 transition-transform ${isServiceOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isServiceOpen && (
                <div className="mt-2 ml-4 space-y-2">
                  <Link 
                    href="/password-generator"
                    className="block py-2 text-slate-400 hover:text-white transition-colors"
                  >
                    Password Generator
                  </Link>
                  <Link 
                    href="/chrome-to-windows"
                    className="block py-2 text-slate-400 hover:text-white transition-colors"
                  >
                    Chrome to Windows
                  </Link>
                </div>
              )}
            </div>

            <Link href="/repair-guides" className="block py-2 text-slate-300 hover:text-white transition-colors">
              Repair Guides
            </Link>
            <Link href="/schematics" className="block py-2 text-slate-300 hover:text-white transition-colors">
              Schematics
            </Link>
            <Link href="/bios-files" className="block py-2 text-slate-300 hover:text-white transition-colors">
              BIOS Files
            </Link>
            <Link href="/blog" className="block py-2 text-slate-300 hover:text-white transition-colors">
              Blog
            </Link>
            <Link href="/pricing" className="block py-2 text-slate-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/about-us" className="block py-2 text-slate-300 hover:text-white transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="block py-2 text-slate-300 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
