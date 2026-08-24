'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AboutUsPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      
      for(let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const element = reveals[i] as HTMLElement;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if(elementTop < windowHeight - elementVisible) {
          element.classList.add('active');
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen" style={{ fontFamily: 'Verdana, Arial, Helvetica, sans-serif' }}>
      <style jsx global>{`
        body {
          font-family: Verdana, Arial, sans-serif;
          background-color: #f5f5f5;
        }
        .forum-header {
          background: linear-gradient(180deg, #4a90e2 0%, #2c5aa0 100%);
          border-bottom: 3px solid #1e3a5f;
        }
        .forum-category {
          background: white;
          border: 1px solid #ddd;
          transition: all 0.2s;
        }
        .forum-category:hover {
          background: #f9f9f9;
          border-color: #4a90e2;
        }
        .stats-box {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 3px;
        }
        .breadcrumb {
          font-size: 11px;
          color: #666;
        }
      `}</style>

      {/* Top Navigation Bar */}
      <div className="forum-header text-white py-3 px-4 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
              <h1 className="text-2xl font-bold">HISAH TECH</h1>
            </div>
            <div className="flex gap-4 text-sm">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/bios-files" className="hover:underline">BIOS Files</Link>
              <Link href="/schematics" className="hover:underline">Schematics</Link>
              <Link href="/repair-guides" className="hover:underline">Guides</Link>
              <Link href="/contact" className="hover:underline">Contact</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="breadcrumb">
          <Link href="/" className="text-blue-600 hover:underline">Hisah Tech</Link> » <span>About Us</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        
        {/* Header Section */}
        <div className="bg-white p-6 mb-6 border border-gray-300 rounded shadow-sm">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">About Hisah Tech</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Hisah Tech Limited is a registered private technology company in Nigeria, incorporated on 16 October 2019 as a private company limited by shares (RC Number: 1624952). We are committed to delivering quality service, technical expertise, and customer satisfaction.
          </p>
        </div>

        {/* Company Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 border border-gray-300 rounded shadow-sm">
            <h3 className="text-xl font-bold text-blue-700 mb-3">Who We Are</h3>
            <p className="text-gray-600 mb-3 leading-relaxed">
              <strong>Hisah Tech Limited</strong> is a registered private technology company in Nigeria, incorporated on <strong>16 October 2019</strong> as a private company limited by shares (<strong>RC Number: 1624952</strong>).
            </p>
            <p className="text-gray-600 mb-3 leading-relaxed">
              The company is legally based in <strong>Minna, Niger State</strong>, and has been providing reliable technology solutions since its establishment.
            </p>
            <div className="bg-blue-50 p-4 rounded border border-blue-200 mt-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-700">2019</div>
                  <div className="text-xs text-gray-600">Established</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700">Niger</div>
                  <div className="text-xs text-gray-600">State</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700">100%</div>
                  <div className="text-xs text-gray-600">Professional</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-300 rounded shadow-sm">
            <h3 className="text-xl font-bold text-green-700 mb-3">Our Services</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Computer and laptop repairs</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Hardware diagnostics and testing</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Supply of genuine replacement parts</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>System chargers and computer accessories</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Expert technical support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 mb-6 border border-gray-300 rounded shadow-sm">
          <h3 className="text-xl font-bold text-purple-700 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-1">Phone</div>
              <div className="text-gray-600">+234 703 064 8418</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-1">Email</div>
              <div className="text-gray-600 break-all">hisahtechltd@gmail.com</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-1">Location</div>
              <div className="text-gray-600">Minna, Niger State</div>
            </div>
          </div>
          <div className="mt-6 bg-gray-50 p-4 rounded border border-gray-200">
            <div className="text-sm font-semibold text-gray-700 mb-2">Office Address</div>
            <div className="text-gray-600">
              Suite B23/B22, Peniel Albarka Plaza<br />
              Opposite Federal High Court<br />
              Minna, Niger State, Nigeria
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded shadow-lg text-center">
          <h3 className="text-2xl font-bold mb-3">Get In Touch</h3>
          <p className="mb-6 text-blue-100">
            Need professional computer repair services? Have questions about our solutions? We're here to help.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/contact" className="bg-white text-blue-700 px-6 py-3 rounded font-bold hover:bg-gray-100 transition">
              Contact Us
            </Link>
            <Link href="/pricing" className="bg-blue-800 text-white px-6 py-3 rounded font-bold hover:bg-blue-900 transition border border-blue-500">
              View Services
            </Link>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <div className="mb-3">
            <a href="#" className="hover:underline mx-2">Home</a> |
            <a href="#" className="hover:underline mx-2">Help</a> |
            <a href="#" className="hover:underline mx-2">Search</a> |
            <Link href="/about-us" className="hover:underline mx-2">About</Link> |
            <Link href="/contact" className="hover:underline mx-2">Contact</Link>
          </div>
          <div className="text-gray-400 text-xs">
            © 2019-2024 Hisah Tech Limited (RC: 1624952). All rights reserved.
            <br />Powered by Community Forums Software
          </div>
        </div>
      </div>
    </div>
  );
}
