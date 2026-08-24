'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function BlogPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <Link href="/" className="text-blue-600 hover:underline">Hisah Tech</Link> » <span>Blog & Articles</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        
        {/* Header Section */}
        <div className="bg-white p-6 mb-6 border border-gray-300 rounded shadow-sm">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Blog & Technical Articles</h2>
          <p className="text-gray-600">
            Tutorials, repair guides, and technical insights from experienced hardware technicians.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Featured Article */}
            <article className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
              <img src="https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=800" alt="Repair" className="w-full h-64 object-cover" />
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">FEATURED</span>
                  <span>Jun 14, 2023</span>
                  <span>•</span>
                  <span>By Admin</span>
                  <span>•</span>
                  <span>12 min read</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 hover:text-blue-600 cursor-pointer">
                  Reballing the RTX 4090: A Survival Guide
                </h3>
                <p className="text-gray-600 mb-4">
                  Modern BGAs are prone to cracking under thermal stress. We document the precise heat profiles and flux chemistry required to successfully reball high-end GPUs without delamination.
                </p>
                <a href="#" className="text-blue-600 hover:underline font-semibold text-sm">Read Full Article →</a>
              </div>
            </article>

            {/* Article Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <article className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden hover:shadow-md transition">
                <img src="https://images.unsplash.com/photo-1555664424-778a693065af?auto=format&fit=crop&q=80&w=400" alt="Capacitors" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <span className="text-xs text-blue-600 font-semibold">THEORY</span>
                  <h3 className="text-lg font-bold text-gray-800 my-2">Polymer vs Electrolytic: The Reality</h3>
                  <p className="text-sm text-gray-600 mb-3">Are solid polymer caps really the cure-all for power ripple? We analyze the ESR charts.</p>
                  <a href="#" className="text-sm text-blue-600 hover:underline">Read More →</a>
                </div>
              </article>

              <article className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden hover:shadow-md transition">
                <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400" alt="Oscilloscope" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <span className="text-xs text-green-600 font-semibold">TOOLS</span>
                  <h3 className="text-lg font-bold text-gray-800 my-2">Budget Oscilloscopes for 2024</h3>
                  <p className="text-sm text-gray-600 mb-3">You don't need a Tektronix to find a short. Reviewing the best sub-$300 rigs.</p>
                  <a href="#" className="text-sm text-blue-600 hover:underline">Read More →</a>
                </div>
              </article>

              <article className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden hover:shadow-md transition">
                <img src="https://images.unsplash.com/photo-1621252179027-94459d2713dc?auto=format&fit=crop&q=80&w=400" alt="Circuit board" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <span className="text-xs text-purple-600 font-semibold">RETRO</span>
                  <h3 className="text-lg font-bold text-gray-800 my-2">Restoring the Amiga 500</h3>
                  <p className="text-sm text-gray-600 mb-3">A complete walk-through on neutralizing battery acid damage on vintage PCBs.</p>
                  <a href="#" className="text-sm text-blue-600 hover:underline">Read More →</a>
                </div>
              </article>

              <article className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden hover:shadow-md transition">
                <img src="https://images.unsplash.com/photo-1593106578502-27fa8479d060?auto=format&fit=crop&q=80&w=400" alt="Soldering" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <span className="text-xs text-orange-600 font-semibold">GUIDE</span>
                  <h3 className="text-lg font-bold text-gray-800 my-2">Flux Chemistry 101</h3>
                  <p className="text-sm text-gray-600 mb-3">Understanding the difference between Rosin, No-Clean, and Water Soluble flux.</p>
                  <a href="#" className="text-sm text-blue-600 hover:underline">Read More →</a>
                </div>
              </article>

            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 py-6">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">←</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded font-semibold">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">2</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">3</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">→</button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            
            {/* Search */}
            <div className="bg-white p-4 border border-gray-300 rounded shadow-sm">
              <h3 className="font-bold mb-3 text-sm">Search Articles</h3>
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Categories */}
            <div className="bg-white p-4 border border-gray-300 rounded shadow-sm">
              <h3 className="font-bold mb-3 text-sm">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-100 hover:bg-blue-100 border border-gray-300 rounded text-xs cursor-pointer">Motherboards (142)</span>
                <span className="px-2 py-1 bg-gray-100 hover:bg-blue-100 border border-gray-300 rounded text-xs cursor-pointer">PSU Repair (89)</span>
                <span className="px-2 py-1 bg-gray-100 hover:bg-blue-100 border border-gray-300 rounded text-xs cursor-pointer">GPU (56)</span>
                <span className="px-2 py-1 bg-gray-100 hover:bg-blue-100 border border-gray-300 rounded text-xs cursor-pointer">Retro (34)</span>
                <span className="px-2 py-1 bg-gray-100 hover:bg-blue-100 border border-gray-300 rounded text-xs cursor-pointer">Tools (28)</span>
              </div>
            </div>

            {/* Trending */}
            <div className="bg-white p-4 border border-gray-300 rounded shadow-sm">
              <h3 className="font-bold mb-4 text-sm">Trending Articles</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-lg font-bold text-gray-400">01</span>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">Identifying Fake Rubycon Caps</h4>
                    <span className="text-xs text-gray-500">4.2k views</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-lg font-bold text-gray-400">02</span>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">The "Safe" Replacement List 2023</h4>
                    <span className="text-xs text-gray-500">3.8k views</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-lg font-bold text-gray-400">03</span>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">Why Your Monitor Won't Turn On</h4>
                    <span className="text-xs text-gray-500">2.1k views</span>
                  </div>
                </div>
              </div>
            </div>

          </aside>

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
            <br />Powered by Community Forums Software
          </div>
        </div>
      </div>
    </div>
  );
}
