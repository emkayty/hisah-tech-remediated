'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ContactPage() {
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent successfully!');
  };

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
          <Link href="/" className="text-blue-600 hover:underline">Hisah Tech</Link> » <span>Contact Us</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        
        {/* Header Section */}
        <div className="bg-white p-6 mb-6 border border-gray-300 rounded shadow-sm">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Contact Us</h2>
          <p className="text-gray-600">
            Have questions about our services? Need technical support? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Contact Form */}
          <div className="bg-white p-6 border border-gray-300 rounded shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Service Request</option>
                  <option>Business Partnership</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                <textarea 
                  rows={6} 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white p-6 border border-gray-300 rounded shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Phone</div>
                    <div className="text-gray-600">+234 703 064 8418</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Email</div>
                    <div className="text-gray-600 break-all">hisahtechltd@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Location</div>
                    <div className="text-gray-600">Minna, Niger State, Nigeria</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-300 rounded shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Office Address</h3>
              <div className="text-gray-600 leading-relaxed">
                Suite B23/B22, Peniel Albarka Plaza<br />
                Opposite Federal High Court<br />
                Minna, Niger State, Nigeria
              </div>
            </div>

            <div className="bg-blue-50 p-6 border border-blue-200 rounded">
              <h3 className="text-lg font-bold text-blue-800 mb-2">Business Hours</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <div>Monday - Friday: 9:00 AM - 6:00 PM</div>
                <div>Saturday: 10:00 AM - 4:00 PM</div>
                <div>Sunday: Closed</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <div className="mb-3">
            <Link href="/" className="hover:underline mx-2">Home</Link> |
            <a href="#" className="hover:underline mx-2">Help</a> |
            <a href="#" className="hover:underline mx-2">Search</a> |
            <Link href="/about-us" className="hover:underline mx-2">About</Link> |
            <Link href="/contact" className="hover:underline mx-2">Contact</Link>
          </div>
          <div className="text-gray-400 text-xs">
            © 2024 Hisah Tech. All rights reserved.
            <br />Resurrecting electronics since 2015
          </div>
        </div>
      </div>
    </div>
  );
}
